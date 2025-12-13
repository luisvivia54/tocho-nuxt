// composables/useApi.ts
import { useRuntimeConfig, useFetch } from '#imports'

// Wrapper estable para llamar a tu backend (sin broncas de types)
export function useApi<T>(path: string) {
  const config = useRuntimeConfig()

  const baseURL = String(config.public.apiBase || '').replace(/\/$/, '')
  const url = path.startsWith('/') ? path : `/${path}`

  return useFetch<T>(url, {
    baseURL,
    retry: 2,
    retryDelay: 600,
  })
}
