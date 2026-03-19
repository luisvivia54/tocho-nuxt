<template>
  <main class="bg-[#050816] text-slate-50 min-h-screen">
    <section class="pt-16 md:pt-16 lg:pt-16">
      <div class="max-w-6xl mx-auto container-pad px-4 sm:px-6">
        <!-- HEADER -->
        <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div v-once>
            <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Tochero5 · Temporada oficial
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
              Equipos registrados
            </h1>
            <p class="mt-1 text-sm md:text-base text-slate-400 max-w-xl">
              Explora los equipos participantes y entra al detalle para ver su roster.
            </p>
          </div>

          <!-- Resumen -->
          <div class="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 shadow-lg backdrop-blur">
            <p class="font-semibold text-slate-100">
              {{ teamsList.length }} equipo{{ teamsList.length === 1 ? '' : 's' }}
            </p>
            <p class="mt-0.5">
              Filtros:
              <span class="text-slate-100 font-semibold">{{ selectedRamaLabel }}</span>
              ·
              <span class="text-slate-100 font-semibold">{{ selectedCategoriaLabel }}</span>
            </p>
          </div>
        </header>

        <!-- FILTROS + BÚSQUEDA -->
        <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <!-- Selects -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              <!-- Rama -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Rama (code)</label>
                <div class="relative">
                  <select
                    v-model="selectedRama"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="categoriesPending"
                  >
                    <option value="all">Todas</option>
                    <option v-for="code in ramaOptions" :key="code" :value="code">
                      {{ code }}
                    </option>
                  </select>

                  <button
                    v-if="selectedRama !== 'all'"
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    @click="clearRama"
                    aria-label="Quitar filtro de rama"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Categoría (gender)</label>
                <div class="relative">
                  <select
                    v-model="selectedCategoria"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="categoriesPending"
                  >
                    <option value="all">Todas</option>
                    <option v-for="g in categoriaOptions" :key="g" :value="g">
                      {{ niceGender(g) }}
                    </option>
                  </select>

                  <button
                    v-if="selectedCategoria !== 'all'"
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    @click="clearCategoria"
                    aria-label="Quitar filtro de categoría"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Buscar -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Buscar</label>
                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                    🔍
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar equipo..."
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-500"
                @click="clearFilters"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <!-- Chips / estado -->
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span class="text-slate-400">Estado:</span>

            <span
              v-if="selectedRama !== 'all'"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Rama: <strong class="text-slate-100">{{ selectedRama }}</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearRama">✕</button>
            </span>

            <span
              v-if="selectedCategoria !== 'all'"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Categoría: <strong class="text-slate-100">{{ niceGender(selectedCategoria) }}</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearCategoria">✕</button>
            </span>

            <span
              v-if="searchQuery.trim()"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Búsqueda: <strong class="text-slate-100">“{{ searchQuery.trim() }}”</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearSearch">✕</button>
            </span>

            <span v-if="categoriesError" class="text-amber-200">
              No se pudo cargar /categories de la liga 1. El listado de equipos sigue funcionando.
            </span>
          </div>
        </section>

        <!-- ESTADOS -->
        <div v-if="pending" class="mt-8 text-sm text-slate-400">Cargando equipos...</div>

        <div
          v-else-if="error"
          class="mt-8 rounded-2xl bg-red-950/60 text-red-100 border border-red-500/60 px-4 py-3 text-sm"
        >
          Ocurrió un error al cargar los equipos. Revisa la consola del navegador.
        </div>

        <!-- LISTADO -->
        <div v-else class="mt-6">
          <div
            v-if="filteredTeams.length === 0"
            class="rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
          >
            <p class="font-semibold text-slate-100">Sin resultados</p>
            <p class="mt-1 text-slate-300">
              No hay equipos para la combinación seleccionada.
              <span class="text-slate-200">Puedes cambiar la rama/categoría arriba o limpiar filtros.</span>
            </p>
          </div>

          <!-- GRID -->
          <div v-else class="grid gap-4 sm:gap-5 md:grid-cols-2">
            <article
              v-for="team in paginatedTeams"
              :key="team.teamId"
              class="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 shadow-md transition hover:border-slate-500"
              :style="getCardGradientStyle(team)"
            >
              <div class="flex items-center gap-4 p-4">
                <!-- Logo -->
                <div class="w-16 h-16 rounded-xl bg-slate-950/70 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner shrink-0">
                  <img
                    v-if="team.logoUrl"
                    :src="team.logoUrl"
                    :alt="team.name"
                    loading="lazy"
                    class="max-h-14 max-w-full object-contain"
                  />
                  <span v-else class="text-xs font-semibold text-slate-200 text-center px-2">
                    {{ team.shortName || 'Equipo' }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h2 class="font-display text-lg font-bold text-white truncate">{{ team.name }}</h2>
                  <p class="text-[11px] text-slate-200 truncate">{{ team.shortName || 'Sin abreviatura' }}</p>

                  <div class="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    <span class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100">
                      Rama:
                      <strong class="text-white/95">{{ getTeamCode(team) || '—' }}</strong>
                    </span>

                    <span class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100">
                      Categoría:
                      <strong class="text-white/95">{{ niceGender(getTeamGender(team) || '—') }}</strong>
                    </span>

                    <span
                      v-if="team.colorPrimary"
                      class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100"
                    >
                      <span class="w-3 h-3 rounded-full border border-white/30" :style="{ backgroundColor: team.colorPrimary || '#4F46E5' }" />
                      Primario
                    </span>

                    <span
                      v-if="team.colorSecondary"
                      class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100"
                    >
                      <span class="w-3 h-3 rounded-full border border-white/30" :style="{ backgroundColor: team.colorSecondary || '#22D3EE' }" />
                      Secundario
                    </span>

                    <span
                      class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
                      :class="team.isActive
                        ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                        : 'border-slate-400/40 bg-slate-500/10 text-slate-200'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="team.isActive ? 'bg-emerald-400' : 'bg-slate-400'"></span>
                      {{ team.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>

                <!-- CTA -->
                <div class="self-stretch flex items-center">
                  <NuxtLink
                    :to="teamDetailHref(team.teamId)"
                    :prefetch="false"
                    class="inline-flex items-center gap-1 rounded-xl bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 shadow hover:bg-amber-100 transition"
                  >
                    Ver detalle
                    <span class="text-[11px]">↗</span>
                  </NuxtLink>
                </div>
              </div>
            </article>
          </div>

          <!-- PAGINACIÓN -->
          <div
            v-if="filteredTeams.length > 0 && totalPages > 1"
            class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400"
          >
            <p>
              Mostrando
              <span class="font-semibold text-slate-100">
                {{ pageStart + 1 }}–{{ pageEnd }}
              </span>
              de
              <span class="font-semibold text-slate-100">
                {{ filteredTeams.length }}
              </span>
              equipos
            </p>

            <div class="flex items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                ← Anterior
              </button>

              <span class="px-2">
                Página <span class="font-semibold text-slate-100">{{ currentPage }}</span> / {{ totalPages }}
              </span>

              <button
                type="button"
                class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRuntimeConfig, useFetch } from '#imports'
import { normalizeApiBase } from '../composables/useApiBase'

type Nullable<T> = T | null

interface ApiTeam {
  teamId: number
  leagueId?: number | null
  name: string
  shortName: Nullable<string>
  colorPrimary: Nullable<string>
  colorSecondary: Nullable<string>
  logoUrl: Nullable<string>
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  code?: Nullable<string>
  categoryCode?: Nullable<string>
  gender?: Nullable<string>
  categoryGender?: Nullable<string>
  category?: Nullable<{ code?: string; gender?: string; name?: string; leagueId?: number | null }>
}

interface CategoryDto {
  id: number
  leagueId?: number | null
  name: string
  code: string
  gender: string
}

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  if (x && Array.isArray(x.data)) return x.data
  return []
}

const PAGE_LEAGUE_ID = 1

const config = useRuntimeConfig()
const API_BASE = `${normalizeApiBase(config.public.apiBase)}/`

// ================== FILTROS ==================
const selectedRama = ref<string>('all')
const selectedCategoria = ref<string>('all')
const searchQuery = ref('')

// ================== CATEGORÍAS (solo liga 1) ==================
const categoriesQuery = computed(() => ({
  leagueId: PAGE_LEAGUE_ID,
}))

const {
  data: categoriesRaw,
  pending: categoriesPending,
  error: categoriesError,
} = useFetch<any>('categories', {
  baseURL: API_BASE,
  query: categoriesQuery,
  default: () => [],
})

const allCategories = computed<CategoryDto[]>(() => unwrapList<CategoryDto>(categoriesRaw.value))

const categoriesList = computed<CategoryDto[]>(() => {
  const list = allCategories.value || []
  const withLeagueMeta = list.some((c) => c?.leagueId !== null && c?.leagueId !== undefined)

  if (!withLeagueMeta) return list
  return list.filter((c) => Number(c?.leagueId) === PAGE_LEAGUE_ID)
})

const validCategoryCodes = computed<Set<string>>(() => {
  const set = new Set<string>()

  for (const c of categoriesList.value) {
    const code = normalizeUpper(c?.code)
    if (code) set.add(code)
  }

  return set
})

const validCategoryGenders = computed<Set<string>>(() => {
  const set = new Set<string>()

  for (const c of categoriesList.value) {
    const gender = normalizeUpper(c?.gender)
    if (gender) set.add(gender)
  }

  return set
})

const hasUsableCategoryCatalog = computed(() =>
  !categoriesPending.value &&
  !categoriesError.value &&
  categoriesList.value.length > 0
)

const ramaOptions = computed(() => {
  const set = new Set<string>()

  for (const c of categoriesList.value) {
    const code = normalizeUpper(c?.code)
    if (code) set.add(code)
  }

  return Array.from(set).sort()
})

const categoriaOptions = computed(() => {
  const set = new Set<string>()

  for (const c of categoriesList.value) {
    const gender = normalizeUpper(c?.gender)
    if (gender) set.add(gender)
  }

  return Array.from(set).sort()
})

const selectedRamaLabel = computed(() =>
  selectedRama.value === 'all' ? 'Todas las ramas' : selectedRama.value
)

const selectedCategoriaLabel = computed(() =>
  selectedCategoria.value === 'all' ? 'Todas las categorías' : niceGender(selectedCategoria.value)
)

// Query para el BACK: teams/list?leagueId=1&categoryCode=...&gender=...
const teamsQuery = computed(() => ({
  leagueId: PAGE_LEAGUE_ID,
  categoryCode: selectedRama.value === 'all' ? undefined : selectedRama.value,
  gender: selectedCategoria.value === 'all' ? undefined : selectedCategoria.value,
}))

// ================== FETCH TEAMS ==================
const {
  data: teamsRaw,
  pending,
  error,
  refresh,
} = useFetch<any>('teams/list', {
  baseURL: API_BASE,
  query: teamsQuery,
  default: () => [],
})

const allTeams = computed<ApiTeam[]>(() => unwrapList<ApiTeam>(teamsRaw.value))

const teamsList = computed<ApiTeam[]>(() => {
  return (allTeams.value || []).filter((team) => teamBelongsToLeagueOne(team))
})

// ================== FILTRO LOCAL (búsqueda) ==================
const filteredTeams = computed<ApiTeam[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return teamsList.value

  return teamsList.value.filter((team) => {
    const name = String(team.name || '').toLowerCase()
    const short = String(team.shortName || '').toLowerCase()
    return name.includes(query) || short.includes(query)
  })
})

// ================== PAGINACIÓN ==================
const pageSize = 8
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTeams.value.length / pageSize)))

const paginatedTeams = computed<ApiTeam[]>(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTeams.value.slice(start, start + pageSize)
})

const pageStart = computed(() => (filteredTeams.value.length ? (currentPage.value - 1) * pageSize : 0))
const pageEnd = computed(() => pageStart.value + paginatedTeams.value.length)

// Reset page cuando cambian filtros o búsqueda
watch([selectedRama, selectedCategoria, searchQuery], () => {
  currentPage.value = 1
})

// Helpers UI
const clearRama = async () => {
  selectedRama.value = 'all'
  currentPage.value = 1
  await refresh()
}

const clearCategoria = async () => {
  selectedCategoria.value = 'all'
  currentPage.value = 1
  await refresh()
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const clearFilters = async () => {
  selectedRama.value = 'all'
  selectedCategoria.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
  await refresh()
}

// Link a detalle
const teamDetailHref = (id: number) => `/teams/${id}`

// Degradado
const getCardGradientStyle = (team: ApiTeam) => {
  const primary = team.colorPrimary || '#0F172A'
  const secondary = team.colorSecondary || '#1E293B'
  return {
    backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})`,
    backgroundBlendMode: 'soft-light',
  }
}

// tomar code/gender desde projection
const getTeamCode = (team: ApiTeam): string => {
  const v = team.category?.code || team.categoryCode || team.code || null
  return v ? String(v).toUpperCase() : ''
}

const getTeamGender = (team: ApiTeam): string => {
  const v = team.category?.gender || team.gender || team.categoryGender || null
  return v ? String(v).toUpperCase() : ''
}

function teamBelongsToLeagueOne(team: ApiTeam): boolean {
  const teamLeagueId = toNullableNumber(team?.leagueId)
  const nestedCategoryLeagueId = toNullableNumber(team?.category?.leagueId)

  const teamCode = normalizeUpper(getTeamCode(team))
  const teamGender = normalizeUpper(getTeamGender(team))

  // Si viene leagueId directo en el equipo, debe ser 1
  if (teamLeagueId !== null && teamLeagueId !== PAGE_LEAGUE_ID) {
    return false
  }

  // Si viene leagueId dentro de category, también debe ser 1
  if (nestedCategoryLeagueId !== null && nestedCategoryLeagueId !== PAGE_LEAGUE_ID) {
    return false
  }

  // Blindaje extra:
  // si el catálogo de categorías de liga 1 sí cargó, validamos contra ese catálogo
  if (hasUsableCategoryCatalog.value) {
    if (teamCode && !validCategoryCodes.value.has(teamCode)) {
      return false
    }

    // Solo valida gender si el equipo no trae code usable
    if (!teamCode && teamGender && !validCategoryGenders.value.has(teamGender)) {
      return false
    }
  }

  return true
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeUpper(value: unknown): string {
  return String(value || '').trim().toUpperCase()
}

function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}
</script>