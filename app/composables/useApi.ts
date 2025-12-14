// composables/useApi.ts
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useRuntimeConfig, useFetch } from '#imports'

export function useApi<T>(path: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()

  // ✅ Pasamos un getter: useFetch lo reactiva cuando cambie un computed/ref dentro
  return useFetch<T>(() => toValue(path), {
    baseURL: config.public.apiBase,
  })
}
