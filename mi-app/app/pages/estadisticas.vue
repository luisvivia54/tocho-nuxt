<template>
  <section class="pt-24 md:pt-28 lg:pt-32">
    <div class="max-w-6xl mx-auto container-pad px-6 pb-10">
      <!-- HEADER -->
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <h1 class="font-display text-3xl font-extrabold text-slate-900">
            Estadísticas de equipos
          </h1>
          <p class="mt-2 text-slate-600 max-w-2xl">
            Partidos jugados, ganados, perdidos, puntos a favor y en contra, diferencia e índice de victorias.
          </p>

          <!-- FILTROS -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Categoría (categoryCode) -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Categoría (code)
              </label>
              <select
                v-model="selectedCategoryCode"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <!-- Rama (gender) -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Rama (gender)
              </label>
              <select
                v-model="selectedGender"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option value="VARONIL">Varonil</option>
                <option value="FEMENIL">Femenil</option>
                <option value="MIXTO">Mixto</option>
              </select>
            </div>

            <!-- Buscar + acciones -->
            <div class="flex flex-col gap-2">
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Buscar equipo
                </label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ej. Buhos, Aguilas…"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                >
                  Limpiar filtros
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  @click="refresh()"
                >
                  Refrescar
                </button>
              </div>
            </div>
          </div>

          <!-- Ruta actual -->
          <div class="mt-3 flex flex-wrap gap-2 items-center">
            <span class="text-[11px] text-slate-500">Consultando:</span>
            <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
              {{ pointsUrl }}
            </span>
          </div>
        </div>

        <NuxtLink
          to="/"
          class="hidden sm:inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          ← Volver al inicio
        </NuxtLink>
      </header>

      <!-- ESTADOS -->
      <div v-if="pending" class="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Cargando estadísticas...
      </div>

      <div v-else-if="error" class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error al cargar estadísticas.
      </div>

      <!-- CONTENIDO -->
      <div v-else class="mt-6">
        <!-- Vacío -->
        <div
          v-if="filteredRows.length === 0"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600"
        >
          No hay equipos que coincidan con los filtros / búsqueda actual.
          <div class="mt-2">
            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="clearFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- MOBILE: Cards -->
        <div v-else class="md:hidden space-y-3">
          <article
            v-for="row in filteredRows"
            :key="row.key"
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">{{ row.teamName }}</p>
                <p class="mt-1 text-xs text-slate-600">
                  Categoría:
                  <span class="font-semibold text-slate-800">{{ row.categoryCode || '—' }}</span>
                  · Rama:
                  <span class="font-semibold text-slate-800">{{ prettyDivision(row.gender) }}</span>
                </p>
              </div>

              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                {{ row.winRate }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">PJ</p>
                <p class="font-semibold text-slate-900">{{ row.gp }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">G</p>
                <p class="font-semibold text-slate-900">{{ row.wins }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">P</p>
                <p class="font-semibold text-slate-900">{{ row.losses }}</p>
              </div>

              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">PF</p>
                <p class="font-semibold text-slate-900">{{ row.pointsFor }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">PC</p>
                <p class="font-semibold text-slate-900">{{ row.pointsAgainst }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 px-3 py-2">
                <p class="text-slate-500">Diff</p>
                <p class="font-semibold" :class="row.diff >= 0 ? 'text-emerald-700' : 'text-red-700'">
                  {{ row.diff }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <!-- DESKTOP: Tabla -->
        <div class="hidden md:block rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-x-auto">
          <table class="min-w-[980px] w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 border-b border-slate-200/80">
                <th class="px-3 py-2">Equipo</th>
                <th class="px-3 py-2">Categoría</th>
                <th class="px-3 py-2">Rama</th>
                <th class="px-3 py-2">PJ</th>
                <th class="px-3 py-2">G</th>
                <th class="px-3 py-2">P</th>
                <th class="px-3 py-2">PF</th>
                <th class="px-3 py-2">PC</th>
                <th class="px-3 py-2">Diff</th>
                <th class="px-3 py-2">Índice</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="row in filteredRows"
                :key="row.key"
                class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td class="px-3 py-2 font-semibold text-slate-900">{{ row.teamName }}</td>
                <td class="px-3 py-2 text-slate-800">{{ row.categoryCode || '—' }}</td>

                <td class="px-3 py-2">
                  <span
                    class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-blue-50 text-blue-700': row.gender === 'VARONIL',
                      'bg-pink-50 text-pink-700': row.gender === 'FEMENIL',
                      'bg-emerald-50 text-emerald-700': row.gender === 'MIXTO',
                      'bg-slate-100 text-slate-700': !row.gender
                    }"
                  >
                    {{ prettyDivision(row.gender) }}
                  </span>
                </td>

                <td class="px-3 py-2 text-slate-800">{{ row.gp }}</td>
                <td class="px-3 py-2 text-slate-800">{{ row.wins }}</td>
                <td class="px-3 py-2 text-slate-800">{{ row.losses }}</td>
                <td class="px-3 py-2 text-slate-800">{{ row.pointsFor }}</td>
                <td class="px-3 py-2 text-slate-800">{{ row.pointsAgainst }}</td>

                <td class="px-3 py-2">
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="row.diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                  >
                    {{ row.diff }}
                  </span>
                </td>

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

        <!-- Volver mobile -->
        <div class="sm:hidden mt-4">
          <NuxtLink
            to="/"
            class="inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            ← Volver al inicio
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '@/composables/useApi'

type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO'

/** 🔥 OJO: tu /points ya regresa CAMELCASE */
interface ApiStanding {
  standingId: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  gp: number
  wins: number
  losses: number
  draws: number
  teamName: string
  gender: Gender | string
  teamId: number
  categoryId: number
  seasonId: number
  categoryCode: string
}

interface RowVM {
  key: string
  teamName: string
  gender: Gender | string
  categoryCode: string
  gp: number
  wins: number
  losses: number
  draws: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  diff: number
  winRate: string
}

/* Opciones estables (incluye Libre porque tu back lo manda) */
const categoryOptions = [
  { label: 'Libre', value: 'Libre' },
  { label: '+35', value: '+35' },
  { label: 'U-8', value: 'U8' },
  { label: 'U-10', value: 'U10' },
  { label: 'U-12', value: 'U12' },
  { label: 'U-14', value: 'U14' },
  { label: 'U-16', value: 'U16' }
]

const selectedCategoryCode = ref<'all' | string>('all')
const selectedGender = ref<'all' | Gender>('all')
const searchQuery = ref('')

/* URL reactiva */
const pointsUrl = computed(() => {
  const params = new URLSearchParams()

  if (selectedCategoryCode.value !== 'all') params.set('categoryCode', selectedCategoryCode.value)
  if (selectedGender.value !== 'all') params.set('gender', selectedGender.value)

  const qs = params.toString()
  return qs ? `/points?${qs}` : '/points'
})

/* Fetch reactivo (tu useApi debe aceptar computed) */
const { data: standings, pending, error, refresh } = useApi<ApiStanding[]>(pointsUrl)

const allRows = computed<RowVM[]>(() => {
  const raw = standings.value as unknown
  if (!Array.isArray(raw)) return []
  const rows = raw as ApiStanding[]

  return rows
    .slice()
    .sort((a, b) => (b.tablePoints ?? 0) - (a.tablePoints ?? 0))
    .map((s) => {
      const gp = s.gp ?? 0
      const wins = s.wins ?? 0
      const losses = s.losses ?? 0
      const draws = s.draws ?? 0
      const pointsFor = s.pointsFor ?? 0
      const pointsAgainst = s.pointsAgainst ?? 0
      const diff = pointsFor - pointsAgainst

      const rate = gp > 0 ? (wins / gp) * 100 : 0
      const winRate =
        Number.isFinite(rate) && rate >= 0
          ? (rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1)) + '%'
          : '0%'

      return {
        key: `${s.teamId}-${s.seasonId}-${s.categoryId}`,
        teamName: s.teamName ?? '—',
        gender: s.gender ?? '—',
        categoryCode: s.categoryCode ?? '—',
        gp,
        wins,
        losses,
        draws,
        pointsFor,
        pointsAgainst,
        tablePoints: s.tablePoints ?? 0,
        diff,
        winRate
      }
    })
})

/* filtro local por búsqueda */
const filteredRows = computed<RowVM[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRows.value
  return allRows.value.filter((r) => (r.teamName || '').toLowerCase().includes(q))
})

const clearFilters = () => {
  selectedCategoryCode.value = 'all'
  selectedGender.value = 'all'
  searchQuery.value = ''
}

const prettyDivision = (division: string | null | undefined): string => {
  if (!division) return '—'
  const up = division.toUpperCase()
  if (up === 'VARONIL') return 'Varonil'
  if (up === 'FEMENIL') return 'Femenil'
  if (up === 'MIXTO') return 'Mixto'
  return division
}
</script>
