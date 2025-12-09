// app/composables/useLeagueData.ts
import { ref, computed, onMounted } from 'vue'

// 👉 Ajustamos directo a tu backend de Render
const API_POINTS_URL = 'https://tocho5-webservice.onrender.com/api/points'
const API_TEAMS_URL = 'https://tocho5-webservice.onrender.com/api/teams'

type PointRow = {
  team_id: number
  team_name: string
  gp: number
  wins: number
  points_for: number
  points_against: number
  table_points: number
}

export function useLeagueData() {
  // ====== STATE POSICIONES ======
  const loadingPoints = ref(false)
  const errorPoints = ref('')
  const points = ref<PointRow[]>([])

  // ====== STATE EQUIPOS (lo usaremos después para más cosas) ======
  const loadingTeams = ref(false)
  const errorTeams = ref('')
  const teams = ref<any[]>([])

  // ====== FETCH POSICIONES ======
  async function fetchPoints() {
    try {
      loadingPoints.value = true
      errorPoints.value = ''

      const data = await $fetch<any[]>(API_POINTS_URL, {
        method: 'GET'
      })

      // Normalizamos campos para que el front siempre tenga las mismas llaves
      points.value = data.map((r) => ({
        team_id: r.team_id ?? r.teamId ?? null,
        team_name: r.team_name ?? r.teamName ?? 'Equipo',
        gp: r.gp ?? r.games_played ?? 0,
        wins: r.wins ?? 0,
        points_for: r.points_for ?? r.gf ?? 0,
        points_against: r.points_against ?? r.gc ?? 0,
        table_points: r.table_points ?? r.pts ?? 0
      }))
    } catch (err: any) {
      console.error('Error cargando /api/points', err)
      errorPoints.value =
        err?.message || 'No se pudo cargar /api/points desde el backend'
      points.value = []
    } finally {
      loadingPoints.value = false
    }
  }

  // ====== FETCH EQUIPOS (para luego) ======
  async function fetchTeams() {
    try {
      loadingTeams.value = true
      errorTeams.value = ''

      const data = await $fetch<any[]>(API_TEAMS_URL, {
        method: 'GET'
      })

      teams.value = data
    } catch (err: any) {
      console.error('Error cargando /api/teams', err)
      errorTeams.value =
        err?.message || 'No se pudo cargar /api/teams desde el backend'
      teams.value = []
    } finally {
      loadingTeams.value = false
    }
  }

  // ====== TOP 5 POSICIONES (computed) ======
  const topPositions = computed(() => {
    if (!points.value.length) return []

    const rows = points.value.slice()

    // Ordenamos:
    // 1) Puntos de tabla (desc)
    // 2) Diferencia (GF - GC) (desc)
    // 3) GF (desc)
    // 4) Nombre (asc)
    rows.sort((a, b) => {
      if (b.table_points !== a.table_points) {
        return b.table_points - a.table_points
      }

      const diffA = a.points_for - a.points_against
      const diffB = b.points_for - b.points_against
      if (diffB !== diffA) {
        return diffB - diffA
      }

      if (b.points_for !== a.points_for) {
        return b.points_for - a.points_for
      }

      return String(a.team_name).localeCompare(String(b.team_name))
    })

    return rows.slice(0, 5)
  })

  // ====== INICIALIZAR AL ENTRAR A LA PÁGINA ======
  onMounted(() => {
    fetchTeams()
    fetchPoints()
  })

  return {
    // state y métodos para posiciones
    loadingPoints,
    errorPoints,
    points,
    topPositions,
    reloadPoints: fetchPoints,

    // state y métodos para equipos
    loadingTeams,
    errorTeams,
    teams,
    reloadTeams: fetchTeams
  }
}
