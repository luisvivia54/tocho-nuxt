<template>
  <main class="bg-[#050816] text-slate-50 min-h-screen">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6">
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
          <div
            v-if="!pending && !error"
            class="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 shadow-lg backdrop-blur"
          >
            <p class="font-semibold text-slate-100">
              {{ teamsList.length }} equipo{{ teamsList.length === 1 ? '' : 's' }}
            </p>
            <p class="mt-0.5">
              Usa la búsqueda y paginación para encontrar rápidamente tu equipo.
            </p>
          </div>
        </header>

        <!-- ESTADOS -->
        <div v-if="pending" class="mt-8 text-sm text-slate-400">
          Cargando equipos...
        </div>

        <div
          v-else-if="error"
          class="mt-8 rounded-2xl bg-red-950/60 text-red-100 border border-red-500/60 px-4 py-3 text-sm"
        >
          Ocurrió un error al cargar los equipos. Revisa la consola del navegador.
        </div>

        <!-- CONTENIDO -->
        <div v-else>
          <!-- Sin equipos -->
          <div
            v-if="teamsList.length === 0"
            class="mt-8 rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
          >
            Aún no hay equipos registrados.
          </div>

          <!-- Con equipos -->
          <div v-else>
            <!-- Búsqueda -->
            <div
              class="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <p class="text-xs md:text-sm text-slate-400">
                Filtra por nombre o abreviatura.
              </p>

              <div class="relative w-full md:w-72">
                <span
                  class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs"
                >
                  🔍
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar equipo..."
                  class="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Sin resultados de filtro -->
            <div
              v-if="filteredTeams.length === 0"
              class="mt-6 rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
            >
              No se encontraron equipos que coincidan con “{{ searchQuery }}”.
            </div>

            <!-- GRID DE EQUIPOS (PAGINADA) -->
            <div
              v-else
              class="mt-6 grid gap-5 md:grid-cols-2"
            >
              <article
                v-for="team in paginatedTeams"
                :key="team.teamId"
                class="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 shadow-md transition hover:border-slate-500"
                :style="getCardGradientStyle(team)"
              >
                <div class="flex items-center gap-4 p-4">
                  <!-- Logo -->
                  <div
                    class="w-16 h-16 rounded-xl bg-slate-950/70 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner shrink-0"
                  >
                    <img
                      v-if="team.logoUrl"
                      :src="team.logoUrl"
                      :alt="team.name"
                      loading="lazy"
                      class="max-h-14 max-w-full object-contain"
                    />
                    <span
                      v-else
                      class="text-xs font-semibold text-slate-200 text-center px-2"
                    >
                      {{ team.shortName || 'Equipo' }}
                    </span>
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h2 class="font-display text-lg font-bold text-white truncate">
                      {{ team.name }}
                    </h2>
                    <p class="text-[11px] text-slate-200 truncate">
                      {{ team.shortName || 'Sin abreviatura' }}
                    </p>

                    <div class="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                      <span
                        v-if="team.colorPrimary"
                        class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100"
                      >
                        <span
                          class="w-3 h-3 rounded-full border border-white/30"
                          :style="{ backgroundColor: team.colorPrimary || '#4F46E5' }"
                        />
                        Primario
                      </span>
                      <span
                        v-if="team.colorSecondary"
                        class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-slate-100"
                      >
                        <span
                          class="w-3 h-3 rounded-full border border-white/30"
                          :style="{ backgroundColor: team.colorSecondary || '#22D3EE' }"
                        />
                        Secundario
                      </span>

                      <span
                        class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
                        :class="team.isActive
                          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-400/40 bg-slate-500/10 text-slate-200'"
                      >
                        <span
                          class="h-1.5 w-1.5 rounded-full"
                          :class="team.isActive ? 'bg-emerald-400' : 'bg-slate-400'"
                        ></span>
                        {{ team.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                  </div>

                  <!-- CTA -->
                  <div class="self-stretch flex items-center">
                    <NuxtLink
                      :to="teamDetailRoute(team.teamId)"
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
              v-if="totalPages > 1"
              class="mt-6 flex items-center justify-between gap-3 text-xs text-slate-400"
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

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  ← Anterior
                </button>
                <span>
                  Página
                  <span class="font-semibold text-slate-100">{{ currentPage }}</span>
                  / {{ totalPages }}
                </span>
                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'

interface ApiTeam {
  teamId: number
  leagueId: number
  name: string
  shortName: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  logoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const { data, pending, error } = useApi<ApiTeam[]>('/teams')

const teamsList = computed<ApiTeam[]>(() => {
  const raw = data.value as unknown
  if (!Array.isArray(raw)) return []
  return raw as ApiTeam[]
})

const searchQuery = ref('')

// FILTRO
const filteredTeams = computed<ApiTeam[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return teamsList.value
  return teamsList.value.filter((team) => {
    const name = team.name.toLowerCase()
    const short = (team.shortName || '').toLowerCase()
    return name.includes(query) || short.includes(query)
  })
})

// PAGINACIÓN
const pageSize = 8
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / pageSize))
)

const paginatedTeams = computed<ApiTeam[]>(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTeams.value.slice(start, start + pageSize)
})

const pageStart = computed(() => {
  if (!filteredTeams.value.length) return 0
  return (currentPage.value - 1) * pageSize
})

const pageEnd = computed(() => pageStart.value + paginatedTeams.value.length)

// Cuando cambia el filtro, regresamos a página 1
watch(filteredTeams, () => {
  currentPage.value = 1
})

// RUTA DETALLE (asegura que coincida con pages/equipos/[id].vue → name: 'equipos-id')
const teamDetailRoute = (id: number) => ({
  name: 'teams-id',
  params: { id }
})

// Degradado estático (sin animaciones pesadas)
const getCardGradientStyle = (team: ApiTeam) => {
  const primary = team.colorPrimary || '#0F172A'
  const secondary = team.colorSecondary || '#1E293B'
  return {
    backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})`,
    backgroundBlendMode: 'soft-light'
  }
}
</script>
