import { computed } from 'vue'
import { useRuntimeConfig, useAsyncData } from '#imports'
import { $fetch } from 'ofetch'
import { normalizeApiBase } from './useApiBase'

/**
 * Fuente única de verdad para "la temporada activa de una liga".
 *
 * El backend expone GET /api/seasons/current?leagueId=X -> { seasonId }.
 * Después de un rollover, esa temporada activa cambia sola, así que cualquier
 * página que lea/escriba usando esto se mueve a la nueva temporada sin tocar código.
 *
 * Hay dos formas de usarlo:
 *  - useCurrentSeason(leagueId, fallback): reactiva, para defaults en setup.
 *  - fetchCurrentSeasonId(apiBase, leagueId, fallback): imperativa, para usar
 *    dentro de loaders async ya existentes.
 */

type CurrentSeasonResponse = { seasonId?: number }

/** Versión imperativa: úsala dentro de funciones async (loaders existentes). */
export async function fetchCurrentSeasonId(
  apiBase: string,
  leagueId: number,
  fallbackSeasonId = 0
): Promise<number> {
  const base = String(apiBase || '').replace(/\/+$/, '')
  try {
    const res = await $fetch<CurrentSeasonResponse>(
      `${base}/seasons/current?leagueId=${leagueId}`
    )
    return Number(res?.seasonId) || fallbackSeasonId
  } catch {
    return fallbackSeasonId
  }
}

/** Versión reactiva: úsala en setup para un default que se actualiza solo. */
export function useCurrentSeason(leagueId: number, fallbackSeasonId = 0) {
  const config = useRuntimeConfig()
  const apiBase = normalizeApiBase((config.public as { apiBase?: string }).apiBase)

  const { data, refresh } = useAsyncData<CurrentSeasonResponse | null>(
    `current-season-league-${leagueId}`,
    () =>
      $fetch<CurrentSeasonResponse>(`${apiBase}/seasons/current?leagueId=${leagueId}`).catch(
        () => null
      ),
    { server: false }
  )

  const currentSeasonId = computed<number>(
    () => Number(data.value?.seasonId) || fallbackSeasonId
  )

  return { currentSeasonId, refreshCurrentSeason: refresh }
}
