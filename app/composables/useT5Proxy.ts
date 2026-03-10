// app/composables/useT5Proxy.ts
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useFetch } from '#imports'

export function useT5Proxy<T>(path: MaybeRefOrGetter<string>) {
  return useFetch<T>(() => {
    const raw = String(toValue(path) || '').trim()
    const clean = raw.startsWith('/') ? raw.slice(1) : raw
    return `/api/t5/${clean}`
  })
}