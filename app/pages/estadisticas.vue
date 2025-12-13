<template>
  <section class="pt-24 md:pt-28 lg:pt-32">
    <div class="max-w-6xl mx-auto container-pad px-6">
      <!-- Título + filtros + volver -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h1 class="font-display text-3xl font-extrabold text-slate-900">
            Estadísticas de equipos
          </h1>
          <p class="mt-2 text-slate-600">
            Partidos jugados, ganados, perdidos, puntos a favor y en contra, diferencia
            e índice de victorias por equipo.
          </p>

          <!-- Filtros -->
          <div class="mt-4 flex flex-wrap gap-4">
            <!-- Filtro categoría -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Categoría
              </label>
              <select
                v-model="selectedCategory"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  :value="cat.value"
                >
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <!-- Filtro rama -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Rama
              </label>
              <select
                v-model="selectedDivision"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option value="VARONIL">Varonil</option>
                <option value="FEMENIL">Femenil</option>
                <option value="MIXTO">Mixto</option>
              </select>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/"
          class="hidden sm:inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>

      <!-- TABLA -->
      <div
        class="mt-6 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-x-auto"
      >
        <div v-if="pending" class="px-4 py-3 text-sm text-slate-500">
          Cargando estadísticas...
        </div>
        <div v-else-if="error" class="px-4 py-3 text-sm text-red-600">
          Error al cargar estadísticas.
        </div>

        <table v-else class="min-w-[960px] w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500 border-b border-slate-200/80">
              <th class="px-3 py-2">Equipo</th>
              <th class="px-3 py-2">Categoría</th>
              <th class="px-3 py-2">Rama</th>
              <th class="px-3 py-2">Partidos jugados</th>
              <th class="px-3 py-2">Partidos ganados</th>
              <th class="px-3 py-2">Partidos perdidos</th>
              <th class="px-3 py-2">Puntos a favor</th>
              <th class="px-3 py-2">Puntos en contra</th>
              <th class="px-3 py-2">Diferencia de puntos</th>
              <th class="px-3 py-2">Índice</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in filteredRows"
              :key="row.teamName + '-' + (row.category || '') + '-' + (row.division || '')"
              class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
            >
              <!-- Equipo -->
              <td class="px-3 py-2 font-semibold text-slate-800">
                {{ row.teamName }}
              </td>

              <!-- Categoría -->
              <td class="px-3 py-2">
                {{ row.category || '—' }}
              </td>

              <!-- Rama -->
              <td class="px-3 py-2">
                <span
                  v-if="row.division"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-blue-50 text-blue-700': row.division === 'VARONIL',
                    'bg-pink-50 text-pink-700': row.division === 'FEMENIL',
                    'bg-emerald-50 text-emerald-700': row.division === 'MIXTO'
                  }"
                >
                  {{ prettyDivision(row.division) }}
                </span>
                <span v-else class="text-xs text-slate-400">—</span>
              </td>

              <!-- Partidos jugados -->
              <td class="px-3 py-2">
                {{ row.gamesPlayed }}
              </td>

              <!-- Partidos ganados -->
              <td class="px-3 py-2">
                {{ row.wins }}
              </td>

              <!-- Partidos perdidos -->
              <td class="px-3 py-2">
                {{ row.losses }}
              </td>

              <!-- Puntos a favor -->
              <td class="px-3 py-2">
                {{ row.pointsFor }}
              </td>

              <!-- Puntos en contra -->
              <td class="px-3 py-2">
                {{ row.pointsAgainst }}
              </td>

              <!-- Diferencia de puntos -->
              <td class="px-3 py-2">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    row.diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  ]"
                >
                  {{ row.diff }}
                </span>
              </td>

              <!-- Índice (porcentaje de victorias) -->
              <td class="px-3 py-2">
                <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {{ row.winRate }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredRows.length === 0">
              <td colspan="10" class="px-3 py-3 text-sm text-slate-500">
                No hay equipos que coincidan con los filtros seleccionados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón volver en mobile -->
      <div class="sm:hidden mt-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '@/composables/useApi'

/**
 * Datos crudos que vienen de /points
 * (mismos campos que ya usabas en index.vue)
 */
interface ApiStanding {
  standing_id: number
  season_id: number
  category_id: number
  team_id: number
  gp: number              // Partidos jugados
  wins: number            // Ganados
  losses: number          // Perdidos
  draws: number           // Empatados (por si lo usas luego)
  points_for: number      // Puntos a favor
  points_against: number  // Puntos en contra
  table_points: number
  team_name: string

  // Opcionales: cuando el backend los exponga
  category_name?: string | null  // "+35", "U-8", etc.
  division?: string | null       // "VARONIL" | "FEMENIL" | "MIXTO"
}

/** ViewModel que se usa en la tabla */
interface StatRow {
  teamName: string
  category?: string | null
  division?: string | null
  gamesPlayed: number
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
  diff: number
  winRate: string  // "80%" por ejemplo
}

/* ========= LLAMADA AL BACK ========= */
const { data: standings, pending, error } = useApi<ApiStanding[]>('/points')

/* ========= OPCIONES DE CATEGORÍA ========= */
const categoryOptions = [
  { label: '+35', value: '+35' },
  { label: 'U-8', value: 'U-8' },
  { label: 'U-10', value: 'U-10' },
  { label: 'U-12', value: 'U-12' },
  { label: 'U-14', value: 'U-14' },
  { label: 'U-16', value: 'U-16' },
]

const selectedCategory = ref<'all' | string>('all')
const selectedDivision = ref<'all' | 'VARONIL' | 'FEMENIL' | 'MIXTO'>('all')

/* ========= Transformar respuesta del back a filas de tabla ========= */
const allRows = computed<StatRow[]>(() => {
  const raw = standings.value as unknown
  if (!Array.isArray(raw)) return []

  const rows = raw as ApiStanding[]

  return rows
    .slice()
    .sort((a, b) => b.table_points - a.table_points) // orden por puntos de tabla
    .map((s) => {
      const gamesPlayed = s.gp ?? 0
      const wins = s.wins ?? 0
      const pointsFor = s.points_for ?? 0
      const pointsAgainst = s.points_against ?? 0
      const diff = pointsFor - pointsAgainst

      // Índice: porcentaje de victorias
      let rate = 0
      if (gamesPlayed > 0) {
        rate = (wins / gamesPlayed) * 100
      }
      const winRate =
        Number.isFinite(rate) && rate >= 0
          ? (rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1)) + '%'
          : '0%'

      return {
        teamName: s.team_name,
        category: s.category_name ?? null,
        division: s.division ?? null,
        gamesPlayed,
        wins,
        losses: s.losses ?? 0,
        pointsFor,
        pointsAgainst,
        diff,
        winRate,
      }
    })
})

/* ========= Aplicar filtros ========= */
const filteredRows = computed<StatRow[]>(() => {
  return allRows.value.filter((row) => {
    const matchCategory =
      selectedCategory.value === 'all' ||
      (row.category ?? '').toUpperCase() === selectedCategory.value.toUpperCase()

    const matchDivision =
      selectedDivision.value === 'all' ||
      (row.division ?? '').toUpperCase() === selectedDivision.value.toUpperCase()

    return matchCategory && matchDivision
  })
})

/* ========= Helper para mostrar la rama bonita ========= */
const prettyDivision = (division: string | null | undefined): string => {
  if (!division) return ''
  const up = division.toUpperCase()
  if (up === 'VARONIL') return 'Varonil'
  if (up === 'FEMENIL') return 'Femenil'
  if (up === 'MIXTO') return 'Mixto'
  return division
}
</script>
