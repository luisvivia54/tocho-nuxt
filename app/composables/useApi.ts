import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useRuntimeConfig, useFetch } from '#imports'
import { normalizeApiBase } from './useApiBase'

export function useApi<T>(path: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()
  const baseURL = `${normalizeApiBase(config.public.apiBase)}/`

  return useFetch<T>(
    () => {
      const raw = String(toValue(path) || '').trim()
      return raw.replace(/^\/+/, '')
    },
    {
      baseURL,
    }
  )
}