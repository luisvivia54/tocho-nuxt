import { computed, onMounted, ref } from 'vue'
import { useRuntimeConfig, refreshNuxtData } from '#imports'
import { normalizeApiBase } from './useApiBase'
import { useAuthedFetch, AuthedFetchError } from './useAuthedFetch'

/**
 * Lógica compartida de "Nueva temporada" (rollover) para domingo y jueves.
 *
 * - Carga la temporada activa (GET /seasons/current + /seasons para el nombre).
 * - Pide confirmación antes del POST /seasons/rollover (no se puede deshacer).
 * - Evita nombres repetidos dentro de la liga.
 * - Tras crearla, invalida las claves de useAsyncData que guardan la temporada
 *   activa para que el resto de páginas tomen la nueva sin recargar.
 */

type RolloverResponse = {
  newSeasonId: number
  equiposMovidos: number
  standingsCreados: number
}

type SeasonRow = { id: number; name: string }

export function useSeasonRollover(leagueId: number) {
  const config = useRuntimeConfig()
  const apiBase = normalizeApiBase((config.public as { apiBase?: string }).apiBase)
  const { authedFetch } = useAuthedFetch()

  const name = ref('')
  const loading = ref(false)
  const errorMessage = ref('')
  const result = ref<RolloverResponse | null>(null)
  const seasons = ref<SeasonRow[]>([])
  const currentSeasonId = ref<number | null>(null)

  const currentSeason = computed(
    () => seasons.value.find((s) => s.id === currentSeasonId.value) ?? null
  )
  const currentSeasonLabel = computed(() => {
    if (currentSeason.value) return currentSeason.value.name
    return currentSeasonId.value ? `Temporada ${currentSeasonId.value}` : ''
  })

  async function loadSeasons() {
    try {
      const [list, current] = await Promise.all([
        authedFetch<SeasonRow[]>(`${apiBase}/seasons?leagueId=${leagueId}`, {
          method: 'GET',
          requireAuth: false,
        }),
        authedFetch<{ seasonId?: number }>(`${apiBase}/seasons/current?leagueId=${leagueId}`, {
          method: 'GET',
          requireAuth: false,
        }),
      ])
      seasons.value = Array.isArray(list) ? list : []
      currentSeasonId.value = Number(current?.seasonId) || null
    } catch {
      // Si falla, el rollover sigue disponible; solo no mostramos la activa.
    }
  }

  function messageForStatus(status?: number, apiMsg?: string) {
    if (status === 401) return 'Tu sesión expiró. Inicia sesión de nuevo.'
    if (status === 403) return 'No tienes permisos de administrador.'
    // Los mensajes genéricos de ofetch ("[POST] https://...") no sirven al usuario.
    const usable = apiMsg && !apiMsg.startsWith('[') ? apiMsg : ''
    if (status === 400) return usable || 'Datos inválidos. Revisa el nombre de la temporada.'
    if (status === 409) return usable || 'Ya existe una temporada con ese nombre.'
    return usable || 'No se pudo crear la temporada. Revisa que la liga tenga una temporada activa de origen.'
  }

  async function rollover() {
    errorMessage.value = ''
    result.value = null

    const trimmed = name.value.trim()
    if (!trimmed) {
      errorMessage.value = 'Falta el nombre de la temporada.'
      return
    }

    const duplicated = seasons.value.some(
      (s) => String(s.name).trim().toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicated) {
      errorMessage.value = `Ya existe una temporada llamada "${trimmed}" en esta liga.`
      return
    }

    const from = currentSeasonLabel.value ? `"${currentSeasonLabel.value}"` : 'la temporada actual'
    const ok = window.confirm(
      `Se cerrará ${from} y se creará "${trimmed}". Los equipos y su tabla se moverán a la nueva temporada.\n\nEsta acción no se puede deshacer. ¿Continuar?`
    )
    if (!ok) return

    try {
      loading.value = true

      const res = await authedFetch<RolloverResponse>(`${apiBase}/seasons/rollover`, {
        method: 'POST',
        body: { leagueId, name: trimmed },
      })

      result.value = res
      name.value = ''
      await loadSeasons()
      // Si /current aún no refleja el cambio, confiamos en la respuesta del rollover.
      if (res?.newSeasonId) currentSeasonId.value = res.newSeasonId
      await refreshNuxtData([
        `current-season-league-${leagueId}`,
        `season-current-league-${leagueId}`,
      ])
    } catch (error) {
      const status = error instanceof AuthedFetchError ? error.status : undefined
      const apiMsg = error instanceof AuthedFetchError ? error.message : undefined
      errorMessage.value = messageForStatus(status, apiMsg)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadSeasons)

  return {
    name,
    loading,
    errorMessage,
    result,
    currentSeasonLabel,
    rollover,
  }
}
