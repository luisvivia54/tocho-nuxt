// composables/useApi.ts
import { useRuntimeConfig, useFetch } from '#imports'

// Pequeño wrapper para llamar a tu backend
export function useApi<T>(path: string) {
  const config = useRuntimeConfig()

  return useFetch<T>(path, {
    baseURL: config.public.apiBase,
  })
}
