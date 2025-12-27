// app/composables/useTopPositions.ts
import { useRuntimeConfig } from '#imports'

export const useTopPositions = () => {
  const config = useRuntimeConfig()

  // 👇 Ajusta este base si tu backend está en otro puerto o ruta
  const apiBase =
    config.public.apiBase || 'http://localhost:8080/api'

  return useFetch('/standings/top', {
    baseURL: apiBase,
    query: {
      limit: 5
    }
  })
}
