<template>
  <main class="min-h-screen text-slate-50">
    <!-- HEADER -->
    <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#050816]/88 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex h-20 items-center justify-between gap-6">
          <NuxtLink to="/jueves" class="flex items-center gap-3">
            <span class="text-[2rem] font-black leading-none tracking-tight text-orange-400">T5</span>
            <span class="text-[1.1rem] font-medium text-slate-300">Liga de Jueves</span>
          </NuxtLink>

          <nav class="hidden items-center gap-12 md:flex">
            <NuxtLink
              to="/jueves"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Inicio
              <span
                v-if="route.path === '/jueves'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/partidos"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/partidos' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Partidos
              <span
                v-if="route.path === '/jueves/partidos'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/equipos"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/equipos' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Equipos
              <span
                v-if="route.path === '/jueves/equipos'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/estadisticas"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/estadisticas' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Estadísticas
              <span
                v-if="route.path === '/jueves/estadisticas'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>
          </nav>

          <div class="hidden items-center gap-6 md:flex">
            <NuxtLink
              to="/"
              class="text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-slate-400 hover:text-slate-200"
            >
              ← Volver
            </NuxtLink>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 transition hover:text-slate-200"
              aria-label="Instagram"
            >
              <Instagram class="h-5 w-5" />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 transition hover:text-slate-200"
              aria-label="Facebook"
            >
              <Facebook class="h-5 w-5" />
            </a>
          </div>

          <button
            type="button"
            class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 md:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            Menú
          </button>
        </div>

        <div v-if="mobileOpen" class="pb-4 md:hidden">
          <div class="flex flex-col gap-2">
            <NuxtLink
              to="/jueves"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Inicio
            </NuxtLink>
            <NuxtLink
              to="/jueves/partidos"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Partidos
            </NuxtLink>
            <NuxtLink
              to="/jueves/equipos"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Equipos
            </NuxtLink>
            <NuxtLink
              to="/jueves/estadisticas"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Estadísticas
            </NuxtLink>
            <NuxtLink
              to="/"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              ← Volver
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- BG -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30"
        :style="{ backgroundImage: `url(${stadiumBg})` }"
      />
      <div class="absolute inset-0 bg-[#050816]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_28%)]" />
    </div>

    <!-- CONTENT -->
    <section class="relative px-4 pb-12 pt-16 md:px-6">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="rounded-full px-5 py-2.5 text-sm font-semibold transition"
            :class="view === 'equipos'
              ? 'bg-cyan-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.25)]'
              : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
            @click="setView('equipos')"
          >
            Equipos
          </button>

          <button
            type="button"
            class="rounded-full px-5 py-2.5 text-sm font-semibold transition"
            :class="view === 'jugadores'
              ? 'bg-cyan-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.25)]'
              : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
            @click="setView('jugadores')"
          >
            Jugadores
          </button>
        </div>

        <section class="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(2,6,23,0.84))] p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur md:p-7">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div class="max-w-4xl">
                <div class="flex flex-wrap items-center gap-3">
                  <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                    {{ view === 'equipos' ? 'Estadísticas de equipos' : 'Estadísticas de jugadores' }}
                  </h1>

                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition"
                    :class="onlyActive
                      ? 'border-emerald-400/20 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'"
                    @click="toggleOnlyActive"
                  >
                    {{ onlyActive ? 'Solo activos' : 'Mostrando todos' }}
                  </button>
                </div>

                <p class="mt-3 text-sm leading-7 text-slate-300 md:text-base">
                  {{ viewDescription }}
                </p>
              </div>

              <NuxtLink
                to="/jueves"
                class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                ← Volver al inicio
              </NuxtLink>
            </div>

            <div class="rounded-2xl border border-white/10 bg-[#081122]/80 p-4 md:p-5">
              <div class="grid gap-4 lg:grid-cols-[180px_220px_220px_minmax(0,1fr)_auto] lg:items-end">
                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Temporada</span>
                  <select
                    v-model="selectedSeason"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  >
                    <option v-for="item in seasonOptions" :key="item" :value="item" class="bg-[#0b152a] text-white">
                      {{ item }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Categoría</span>
                  <select
                    v-model="selectedCategory"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  >
                    <option v-for="item in categoryOptions" :key="item" :value="item" class="bg-[#0b152a] text-white">
                      {{ item }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Rama</span>
                  <select
                    v-model="selectedBranch"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  >
                    <option v-for="item in branchOptions" :key="item" :value="item" class="bg-[#0b152a] text-white">
                      {{ item }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {{ view === 'equipos' ? 'Buscar equipo' : 'Buscar jugador' }}
                  </span>
                  <input
                    v-model="search"
                    type="text"
                    :placeholder="view === 'equipos' ? 'Ej. Buhos, Águilas...' : 'Endpoint pendiente...'"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
                  />
                </label>

                <div class="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                    @click="clearFilters"
                  >
                    Limpiar filtros
                  </button>

                  <button
                    type="button"
                    class="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="pending"
                    @click="reloadData"
                  >
                    {{ pending ? 'Cargando...' : 'Refrescar' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:flex-wrap md:items-center md:gap-6">
              <div v-if="view === 'equipos'">
                Equipos:
                <span class="font-semibold text-white">{{ filteredTeams.length }}</span>
              </div>

              <div v-if="view === 'equipos'">
                Activos:
                <span class="font-semibold text-white">{{ activeTeamsCount }}</span>
              </div>

              <div v-if="view === 'jugadores'">
                Jugadores:
                <span class="font-semibold text-white">0</span>
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="loadError && !teamRows.length"
          class="mt-6 rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100"
        >
          <h2 class="text-base font-bold">No se pudieron cargar las estadísticas</h2>
          <p class="mt-2 text-sm text-rose-100/90">{{ loadError }}</p>
        </section>

        <section
          v-else-if="view === 'equipos'"
          class="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b152a] shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
        >
          <div v-if="pending && !teamRows.length" class="space-y-3 p-5">
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
          </div>

          <div v-else-if="paginatedTeams.length" class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr class="bg-white/[0.03] text-left text-[13px] font-bold text-slate-400">
                  <th class="px-4 py-4">Equipo</th>
                  <th class="px-4 py-4">Temporada</th>
                  <th class="px-4 py-4">Categoría</th>
                  <th class="px-4 py-4">Rama</th>
                  <th class="px-4 py-4 text-center">PJ</th>
                  <th class="px-4 py-4 text-center">G</th>
                  <th class="px-4 py-4 text-center">P</th>
                  <th class="px-4 py-4 text-center">PF</th>
                  <th class="px-4 py-4 text-center">PC</th>
                  <th class="px-4 py-4 text-center">Diff</th>
                  <th class="px-4 py-4 text-center">Índice</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="team in paginatedTeams"
                  :key="team.rowKey"
                  class="transition hover:bg-white/[0.03]"
                >
                  <td class="border-t border-white/5 px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-xs font-bold text-cyan-200">
                        <img
                          v-if="team.logo"
                          :src="team.logo"
                          :alt="team.teamName"
                          class="h-full w-full object-cover"
                        />
                        <span v-else>{{ initials(team.teamName) }}</span>
                      </div>

                      <div class="min-w-0">
                        <p class="truncate text-[15px] font-semibold text-white">{{ team.teamName }}</p>
                        <p class="mt-0.5 text-xs text-slate-500">#{{ team.position }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="border-t border-white/5 px-4 py-4">{{ team.season }}</td>
                  <td class="border-t border-white/5 px-4 py-4">{{ team.category }}</td>
                  <td class="border-t border-white/5 px-4 py-4">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="branchBadgeClass(team.branch)">
                      {{ team.branch }}
                    </span>
                  </td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ team.played }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ team.won }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ team.lost }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ team.pointsFor }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ team.pointsAgainst }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold" :class="diffBadgeClass(team.pointDiff)">
                      {{ signedNumber(team.pointDiff) }}
                    </span>
                  </td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">
                    <span class="inline-flex rounded-full bg-cyan-400/15 px-2.5 py-1 text-xs font-bold text-cyan-200">
                      {{ formatPct(team.pct) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="p-10 text-center">
            <p class="text-lg font-semibold text-white">No hay equipos para mostrar</p>
            <p class="mt-2 text-sm text-slate-400">Prueba con otros filtros.</p>
          </div>

          <div
            v-if="teamTotalPages > 1"
            class="flex flex-col gap-3 border-t border-white/10 bg-[#081122] px-5 py-4 md:flex-row md:items-center md:justify-between"
          >
            <p class="text-sm text-slate-400">
              Mostrando
              <span class="font-semibold text-slate-200">{{ teamStartIndex + 1 }}</span>
              -
              <span class="font-semibold text-slate-200">{{ teamEndIndex }}</span>
              de
              <span class="font-semibold text-white">{{ filteredTeams.length }}</span>
              equipos
            </p>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="teamPage === 1"
                @click="goToTeamPage(teamPage - 1)"
              >
                Anterior
              </button>

              <template v-for="node in teamPagination" :key="node.key">
                <span v-if="node.ellipsis" class="px-1 text-slate-500">...</span>

                <button
                  v-else
                  type="button"
                  class="min-w-[40px] rounded-xl px-3 py-2 text-sm font-semibold transition"
                  :class="node.active
                    ? 'bg-cyan-400 text-slate-950'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
                  @click="handleTeamPageNode(node.value)"
                >
                  {{ node.label }}
                </button>
              </template>

              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="teamPage === teamTotalPages"
                @click="goToTeamPage(teamPage + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>

        <section
          v-else
          class="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b152a] shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
        >
          <div class="p-10 text-center">
            <p class="text-lg font-semibold text-white">La vista de jugadores aún no está conectada</p>
            <p class="mt-2 text-sm text-slate-400">
              Falta confirmar el endpoint real del backend para estadísticas individuales.
            </p>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Facebook, Instagram } from 'lucide-vue-next'

definePageMeta({
  layout: 'liga-b',
})

useHead({
  title: 'Estadísticas | Liga Jueves',
})

type AnyRow = Record<string, unknown>
type ViewMode = 'equipos' | 'jugadores'

type TeamStanding = {
  rowKey: string
  teamId: number | string | null
  teamName: string
  season: string
  category: string
  branch: string
  played: number
  won: number
  lost: number
  tied: number
  pointsFor: number
  pointsAgainst: number
  pointDiff: number
  standingPoints: number
  pct: number
  active: boolean
  logo: string | null
}

type PageNode = {
  key: string
  label: string
  value: number | null
  active: boolean
  ellipsis: boolean
}

type TeamMeta = {
  id: string
  teamName: string
  category: string
  branch: string
  season: string
  active: boolean
  logo: string | null
}

const route = useRoute()
const mobileOpen = ref(false)
const stadiumBg = '/img/hero-stadium.jpg'

const view = ref<ViewMode>('equipos')
const search = ref('')
const selectedSeason = ref('Todas')
const selectedCategory = ref('Todas')
const selectedBranch = ref('Todas')
const onlyActive = ref(true)

const teamPage = ref(1)
const pageSize = 10

const API_POINTS_URL = 'https://tocho5-webservice.onrender.com/api/points'
const API_TEAMS_URL = 'https://tocho5-webservice.onrender.com/api/teams'

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toText(value: unknown, fallback = '—'): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  return fallback
}

function toBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'si', 'sí', 'active'].includes(normalized)) return true
    if (['false', '0', 'no', 'inactive', 'inactivo'].includes(normalized)) return false
  }

  return fallback
}

function pick(row: AnyRow, keys: string[], fallback: unknown = null): unknown {
  for (const key of keys) {
    const value = key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, row)

    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
}

function normalizeCollection(payload: unknown): AnyRow[] {
  if (Array.isArray(payload)) return payload as AnyRow[]

  if (payload && typeof payload === 'object') {
    const source = payload as Record<string, unknown>
    if (Array.isArray(source.data)) return source.data as AnyRow[]
    if (Array.isArray(source.items)) return source.items as AnyRow[]
    if (Array.isArray(source.content)) return source.content as AnyRow[]
    if (Array.isArray(source.results)) return source.results as AnyRow[]
    if (Array.isArray(source.teams)) return source.teams as AnyRow[]
  }

  return []
}

async function fetchArray(url: string, timeout = 12000): Promise<AnyRow[]> {
  const response = await $fetch<unknown>(url, {
    method: 'GET',
    timeout,
  })
  return normalizeCollection(response)
}

function normalizePct(value: number): number {
  if (!Number.isFinite(value)) return 0
  return value <= 1 ? value * 100 : value
}

function normalizeBranch(value: string): string {
  const normalized = value.trim().toLowerCase()

  if (['varonil', 'masculino', 'male', 'm'].includes(normalized)) return 'Varonil'
  if (['femenil', 'femenino', 'female', 'f'].includes(normalized)) return 'Femenil'
  if (['mixto', 'mixta', 'mixed'].includes(normalized)) return 'Mixto'

  return value || 'Mixto'
}

function normalizeTeamMeta(row: AnyRow): TeamMeta {
  const rawId = pick(row, ['team_id', 'teamId', 'id'], '')
  const id = String(rawId ?? '').trim()

  return {
    id,
    teamName: toText(pick(row, ['team_name', 'teamName', 'name']), 'Equipo'),
    category: toText(
      pick(row, ['category.name', 'categoryName', 'category', 'categoria']),
      'Sin categoría'
    ),
    branch: normalizeBranch(
      toText(pick(row, ['branch', 'rama', 'gender', 'genre']), 'Mixto')
    ),
    season: toText(
      pick(row, ['season.name', 'seasonName', 'season', 'temporada', 'seasonCode']),
      'WT'
    ),
    active: toBoolean(pick(row, ['isActive', 'active']), true),
    logo: (() => {
      const value = pick(row, ['logoUrl', 'logo', 'imageUrl', 'photo', 'avatar'], null)
      return value ? String(value) : null
    })(),
  }
}

function buildTeamStanding(pointRow: AnyRow, meta: TeamMeta | undefined, index: number): TeamStanding {
  const rawTeamId = pick(pointRow, ['team_id', 'teamId', 'id'], null)

  const teamId =
    rawTeamId === null || rawTeamId === undefined
      ? null
      : (typeof rawTeamId === 'number' || typeof rawTeamId === 'string'
          ? rawTeamId
          : String(rawTeamId))

  const played = toNumber(pick(pointRow, ['gp', 'games_played', 'played', 'jj', 'pj']), 0)
  const won = toNumber(pick(pointRow, ['wins', 'won', 'jg', 'pg']), 0)
  const tied = toNumber(pick(pointRow, ['ties', 'tied', 'empates', 'je']), 0)
  const lost = toNumber(
    pick(pointRow, ['losses', 'lost', 'jp', 'pp']),
    Math.max(played - won - tied, 0)
  )

  const pointsFor = toNumber(
    pick(pointRow, ['points_for', 'gf', 'pointsFor', 'pf', 'favor']),
    0
  )

  const pointsAgainst = toNumber(
    pick(pointRow, ['points_against', 'gc', 'pointsAgainst', 'pc', 'against']),
    0
  )

  const pointDiff = toNumber(
    pick(pointRow, ['pointDiff', 'difference', 'dif', 'diff']),
    pointsFor - pointsAgainst
  )

  const pctValue = pick(pointRow, ['pct', 'percentage', 'winPct'], null)
  const pct =
    pctValue !== null && pctValue !== undefined
      ? normalizePct(toNumber(pctValue))
      : (played > 0 ? (won / played) * 100 : 0)

  const teamName = toText(
    pick(pointRow, ['team_name', 'teamName', 'name']),
    meta?.teamName || 'Equipo'
  )

  return {
    rowKey: `team-${teamId ?? teamName}-${index}`,
    teamId,
    teamName,
    season: meta?.season || toText(pick(pointRow, ['season', 'seasonName', 'temporada']), 'WT'),
    category: meta?.category || toText(pick(pointRow, ['category', 'categoryName', 'categoria']), 'Sin categoría'),
    branch: meta?.branch || normalizeBranch(toText(pick(pointRow, ['branch', 'rama', 'gender']), 'Mixto')),
    played,
    won,
    lost,
    tied,
    pointsFor,
    pointsAgainst,
    pointDiff,
    standingPoints: toNumber(
      pick(pointRow, ['table_points', 'pts', 'points', 'standingPoints', 'puntos']),
      0
    ),
    pct,
    active: meta?.active ?? true,
    logo: meta?.logo ?? null,
  }
}

const {
  data: pointsData,
  pending: pendingPoints,
  error: pointsError,
  refresh: refreshPoints,
} = useLazyAsyncData(
  'jueves-points',
  async () => {
    return await fetchArray(API_POINTS_URL, 12000)
  },
  {
    server: false,
    default: () => [],
  }
)

const {
  data: teamsData,
  refresh: refreshTeams,
} = useLazyAsyncData(
  'jueves-teams',
  async () => {
    return await fetchArray(API_TEAMS_URL, 12000)
  },
  {
    server: false,
    default: () => [],
  }
)

const pending = computed(() => pendingPoints.value)

const teamMetaMap = computed(() => {
  const map = new Map<string, TeamMeta>()

  for (const row of (teamsData.value ?? []) as AnyRow[]) {
    const meta = normalizeTeamMeta(row)
    if (meta.id) map.set(meta.id, meta)
  }

  return map
})

const teamRows = computed<TeamStanding[]>(() => {
  const rows = (pointsData.value ?? []) as AnyRow[]

  return rows.map((row, index) => {
    const rawTeamId = pick(row, ['team_id', 'teamId', 'id'], '')
    const meta = teamMetaMap.value.get(String(rawTeamId ?? ''))
    return buildTeamStanding(row, meta, index)
  })
})

const loadError = computed(() => {
  const raw = pointsError.value as { data?: { message?: string }; message?: string } | null
  if (!raw) return ''
  return raw.data?.message || raw.message || 'No se pudieron cargar los puntos desde el backend.'
})

const activeTeamsCount = computed(() => teamRows.value.filter(item => item.active).length)

const seasonOptions = computed<string[]>(() => {
  const values = Array.from(new Set(teamRows.value.map(item => item.season).filter(Boolean)))
  return ['Todas', ...values.sort((a, b) => a.localeCompare(b, 'es'))]
})

const categoryOptions = computed<string[]>(() => {
  const values = Array.from(new Set(teamRows.value.map(item => item.category).filter(Boolean)))
  return ['Todas', ...values.sort((a, b) => a.localeCompare(b, 'es'))]
})

const branchOptions = computed<string[]>(() => {
  const values = Array.from(new Set(teamRows.value.map(item => item.branch).filter(Boolean)))
  return ['Todas', ...values.sort((a, b) => a.localeCompare(b, 'es'))]
})

const viewDescription = computed(() => {
  return view.value === 'equipos'
    ? 'Partidos jugados, ganados, perdidos, puntos a favor y en contra, diferencia e índice de victorias.'
    : 'La vista de jugadores queda lista en cuanto confirmemos el endpoint real del backend.'
})

const filteredTeams = computed<TeamStanding[]>(() => {
  const query = search.value.trim().toLowerCase()

  return [...teamRows.value]
    .filter(item => selectedSeason.value === 'Todas' || item.season === selectedSeason.value)
    .filter(item => selectedCategory.value === 'Todas' || item.category === selectedCategory.value)
    .filter(item => selectedBranch.value === 'Todas' || item.branch === selectedBranch.value)
    .filter(item => !onlyActive.value || item.active)
    .filter(item => {
      if (!query) return true
      return [item.teamName, item.category, item.branch, item.season]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
    .sort((a, b) => {
      return (
        b.standingPoints - a.standingPoints ||
        b.pct - a.pct ||
        b.pointDiff - a.pointDiff ||
        b.pointsFor - a.pointsFor ||
        a.teamName.localeCompare(b.teamName, 'es')
      )
    })
})

const teamTotalPages = computed(() => Math.max(1, Math.ceil(filteredTeams.value.length / pageSize)))
const teamStartIndex = computed(() => (teamPage.value - 1) * pageSize)
const teamEndIndex = computed(() => Math.min(teamStartIndex.value + pageSize, filteredTeams.value.length))

const paginatedTeams = computed(() => {
  return filteredTeams.value
    .slice(teamStartIndex.value, teamStartIndex.value + pageSize)
    .map((item, index) => ({
      ...item,
      position: teamStartIndex.value + index + 1,
    }))
})

watch([search, selectedSeason, selectedCategory, selectedBranch, onlyActive, view], () => {
  teamPage.value = 1
})

watch(() => route.path, () => {
  mobileOpen.value = false
})

watch(seasonOptions, (options) => {
  if (!options.includes(selectedSeason.value)) {
    selectedSeason.value = 'Todas'
  }
})

watch(categoryOptions, (options) => {
  if (!options.includes(selectedCategory.value)) {
    selectedCategory.value = 'Todas'
  }
})

watch(branchOptions, (options) => {
  if (!options.includes(selectedBranch.value)) {
    selectedBranch.value = 'Todas'
  }
})

watch(filteredTeams, () => {
  if (teamPage.value > teamTotalPages.value) {
    teamPage.value = teamTotalPages.value
  }
})

function buildPagination(current: number, total: number): PageNode[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({
      key: `page-${index + 1}`,
      label: String(index + 1),
      value: index + 1,
      active: index + 1 === current,
      ellipsis: false,
    }))
  }

  const pageNumbers = Array.from(new Set([1, total, current - 1, current, current + 1]))
    .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= total)
    .sort((a, b) => a - b)

  const nodes: PageNode[] = []

  for (let i = 0; i < pageNumbers.length; i++) {
    const value = pageNumbers[i]
    if (typeof value !== 'number') continue

    nodes.push({
      key: `page-${value}`,
      label: String(value),
      value,
      active: value === current,
      ellipsis: false,
    })

    const next = pageNumbers[i + 1]
    if (typeof next === 'number' && next - value > 1) {
      nodes.push({
        key: `ellipsis-${value}-${next}`,
        label: '...',
        value: null,
        active: false,
        ellipsis: true,
      })
    }
  }

  return nodes
}

const teamPagination = computed<PageNode[]>(() => buildPagination(teamPage.value, teamTotalPages.value))

function goToTeamPage(page: number): void {
  if (page < 1 || page > teamTotalPages.value) return
  teamPage.value = page
}

function handleTeamPageNode(page: number | null): void {
  if (typeof page !== 'number') return
  goToTeamPage(page)
}

function setView(next: ViewMode): void {
  view.value = next
}

function clearFilters(): void {
  search.value = ''
  selectedSeason.value = 'Todas'
  selectedCategory.value = 'Todas'
  selectedBranch.value = 'Todas'
  onlyActive.value = true
}

function toggleOnlyActive(): void {
  onlyActive.value = !onlyActive.value
}

async function reloadData(): Promise<void> {
  teamPage.value = 1
  await Promise.allSettled([refreshPoints(), refreshTeams()])
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

function signedNumber(value: number): string {
  return value > 0 ? `${value}` : String(value)
}

function formatPct(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return `${safe.toFixed(safe % 1 === 0 ? 0 : 1)}%`
}

function branchBadgeClass(branch: string): string {
  if (branch === 'Varonil') return 'bg-cyan-400/15 text-cyan-200'
  if (branch === 'Femenil') return 'bg-pink-400/15 text-pink-200'
  return 'bg-amber-400/15 text-amber-200'
}

function diffBadgeClass(value: number): string {
  if (value > 0) return 'bg-emerald-400/15 text-emerald-200'
  if (value < 0) return 'bg-rose-400/15 text-rose-200'
  return 'bg-slate-400/15 text-slate-200'
}
</script>