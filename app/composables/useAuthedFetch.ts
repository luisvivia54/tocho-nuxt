import { useNuxtApp } from '#imports'
import { $fetch } from 'ofetch'
import type { FetchError, FetchOptions } from 'ofetch'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type FetchBody =
  | FetchOptions<'json'>['body']
  | JsonValue
  | Record<string, unknown>

export interface ApiErrorPayload {
  code?: string
  message?: string
  traceId?: string
  status?: number
  [key: string]: unknown
}

export class AuthedFetchError extends Error {
  status?: number
  code?: string
  traceId?: string
  data?: ApiErrorPayload

  constructor(message: string, init: { status?: number; code?: string; traceId?: string; data?: ApiErrorPayload } = {}) {
    super(message)
    this.name = 'AuthedFetchError'
    this.status = init.status
    this.code = init.code
    this.traceId = init.traceId
    this.data = init.data
  }
}

export interface AuthedFetchOptions extends Omit<FetchOptions<'json'>, 'body' | 'headers' | 'method'> {
  method?: HttpMethod
  body?: FetchBody
  headers?: HeadersInit
  requireAuth?: boolean
  retryOn401?: boolean
}

interface KeycloakLike {
  token?: string | null
  updateToken?: (seconds: number) => Promise<boolean>
}

interface NuxtAuthApp {
  $kc?: KeycloakLike
  $kcGetToken?: () => Promise<string | undefined>
}

function toHeadersRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {}

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries())
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, String(value)])
  )
}

function hasHeader(headers: Record<string, string>, key: string) {
  const wanted = key.toLowerCase()
  return Object.keys(headers).some((entry) => entry.toLowerCase() === wanted)
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

function isJsonPayload(body: FetchBody | undefined) {
  if (body == null) return false
  if (isFormData(body)) return false
  if (typeof body === 'string') return false
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return false
  if (typeof Blob !== 'undefined' && body instanceof Blob) return false
  if (body instanceof ArrayBuffer) return false
  if (ArrayBuffer.isView(body)) return false
  return true
}

function normalizeErrorPayload(error: FetchError<ApiErrorPayload> | unknown): ApiErrorPayload {
  const candidate = error as FetchError<ApiErrorPayload> & {
    response?: { _data?: ApiErrorPayload; status?: number }
    data?: ApiErrorPayload
    status?: number
    statusCode?: number
  }

  const payload = candidate.data ?? candidate.response?._data ?? {}
  const status = candidate.status ?? candidate.statusCode ?? candidate.response?.status ?? payload.status

  return {
    ...payload,
    status: typeof status === 'number' ? status : payload.status,
  }
}

function normalizeError(error: FetchError<ApiErrorPayload> | unknown) {
  const payload = normalizeErrorPayload(error)
  const fallbackMessage =
    error instanceof Error && error.message ? error.message : 'Request failed'

  return new AuthedFetchError(payload.message || fallbackMessage, {
    status: payload.status,
    code: payload.code,
    traceId: payload.traceId,
    data: payload,
  })
}

/**
 * Cliente HTTP autenticado para endpoints protegidos del backend.
 *
 * Comportamiento:
 * - En cliente, intenta refrescar el token antes de cada request autenticada.
 * - Si `requireAuth` es `true` y no hay token disponible, lanza `AuthedFetchError`.
 * - Si la respuesta regresa `401`, intenta un refresh forzado una sola vez y reintenta.
 * - Si `body` es JSON, agrega `Content-Type: application/json`.
 * - Si `body` es `FormData`, no toca `Content-Type` para no romper el boundary.
 *
 * SSR:
 * - El proyecto obtiene la sesión desde `app/plugins/keycloak.client.ts`, así que en SSR
 *   este helper no puede reconstruir el token desde cookies o sesión del servidor.
 * - Por eso, las requests autenticadas deben ejecutarse del lado del cliente.
 */
export function useAuthedFetch() {
  const nuxtApp = useNuxtApp() as unknown as NuxtAuthApp

  async function getAccessToken(forceRefresh = false): Promise<string> {
    if (import.meta.server) return ''

    const kc = nuxtApp.$kc

    try {
      const minValidity = forceRefresh ? 0 : 30
      await kc?.updateToken?.(minValidity)
    } catch {
      // Dejamos que el flujo decida si todavía hay token usable o si debe fallar.
    }

    if (typeof kc?.token === 'string' && kc.token.length > 0) {
      return kc.token
    }

    if (typeof nuxtApp.$kcGetToken === 'function') {
      try {
        const token = await nuxtApp.$kcGetToken()
        if (typeof token === 'string' && token.length > 0) return token
      } catch {
        // Se normaliza más abajo como falta de sesión si requireAuth es true.
      }
    }

    return ''
  }

  async function authedFetch<T>(url: string, options: AuthedFetchOptions = {}): Promise<T> {
    const {
      requireAuth = true,
      retryOn401 = true,
      headers,
      body,
      ...rest
    } = options

    if (import.meta.server && requireAuth) {
      throw new AuthedFetchError(
        'No hay sesión disponible en SSR para esta request autenticada.',
        { status: 401, code: 'NO_SESSION' }
      )
    }

    const resolvedHeaders = toHeadersRecord(headers)
    const attachJsonContentType = isJsonPayload(body) && !hasHeader(resolvedHeaders, 'content-type')

    async function performRequest(forceRefresh = false) {
      const token = requireAuth ? await getAccessToken(forceRefresh) : ''

      if (requireAuth && !token) {
        throw new AuthedFetchError(
          'No hay sesión activa. Inicia sesión nuevamente para continuar.',
          { status: 401, code: 'NO_TOKEN' }
        )
      }

      const requestHeaders: Record<string, string> = { ...resolvedHeaders }

      if (attachJsonContentType) {
        requestHeaders['Content-Type'] = 'application/json'
      }

      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }

      return await $fetch<T>(url, {
        ...rest,
        body: body as FetchOptions<'json'>['body'],
        headers: requestHeaders,
      })
    }

    try {
      return await performRequest(false)
    } catch (error) {
      const normalized = normalizeError(error)

      if (retryOn401 && normalized.status === 401 && requireAuth && import.meta.client) {
        try {
          return await performRequest(true)
        } catch (retryError) {
          throw normalizeError(retryError)
        }
      }

      throw normalized
    }
  }

  return {
    authedFetch,
  }
}
