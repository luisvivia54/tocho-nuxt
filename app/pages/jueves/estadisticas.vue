<template>
  <main class="min-h-screen text-slate-50">
    <JuevesHeader />

    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30"
        :style="{ backgroundImage: `url(${stadiumBg})` }"
      />
      <div class="absolute inset-0 bg-[#050816]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_28%)]" />
    </div>

    <section class="relative px-4 pb-12 pt-28 md:px-6">
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
                    <option value="ALL" class="bg-[#0b152a] text-white">Todas</option>
                    <option
                      v-for="item in seasonOptions"
                      :key="item.value"
                      :value="item.value"
                      class="bg-[#0b152a] text-white"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Categoría</span>
                  <select
                    v-model="selectedCategory"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  >
                    <option value="ALL" class="bg-[#0b152a] text-white">Todas</option>
                    <option
                      v-for="item in categoryOptions"
                      :key="item.value"
                      :value="item.value"
                      class="bg-[#0b152a] text-white"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Rama</span>
                  <select
                    v-model="selectedBranch"
                    class="w-full rounded-2xl border border-white/10 bg-[#0b152a] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  >
                    <option value="ALL" class="bg-[#0b152a] text-white">Todas</option>
                    <option
                      v-for="item in branchOptions"
                      :key="item.value"
                      :value="item.value"
                      class="bg-[#0b152a] text-white"
                    >
                      {{ item.label }}
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
                    :placeholder="view === 'equipos' ? 'Ej. Buhos, Águilas...' : 'Ej. Juan, Carlos...'"
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
                <span class="font-semibold text-white">{{ filteredPlayers.length }}</span>
              </div>

              <div v-if="view === 'jugadores'">
                Activos:
                <span class="font-semibold text-white">{{ activePlayersCount }}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="currentLoadError && view === 'equipos' && !teamRows.length"
          class="mt-6 rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100"
        >
          <h2 class="text-base font-bold">No se pudieron cargar las estadísticas</h2>
          <p class="mt-2 text-sm text-rose-100/90">{{ currentLoadError }}</p>
        </section>

        <section
          v-else-if="currentLoadError && view === 'jugadores' && !playerRows.length"
          class="mt-6 rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100"
        >
          <h2 class="text-base font-bold">No se pudieron cargar las estadísticas</h2>
          <p class="mt-2 text-sm text-rose-100/90">{{ currentLoadError }}</p>
        </section>

        <section
          v-else-if="view === 'equipos'"
          class="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b152a] shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
        >
          <div v-if="pendingTeamsView && !teamRows.length" class="space-y-3 p-5">
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
          <div v-if="pendingPlayersView && !playerRows.length" class="space-y-3 p-5">
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
            <div class="h-12 animate-pulse rounded-2xl bg-white/5" />
          </div>

          <div v-else-if="paginatedPlayers.length" class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr class="bg-white/[0.03] text-left text-[13px] font-bold text-slate-400">
                  <th class="px-4 py-4">Jugador</th>
                  <th class="px-4 py-4">Equipo</th>
                  <th class="px-4 py-4">Temporada</th>
                  <th class="px-4 py-4">Categoría</th>
                  <th class="px-4 py-4">Rama</th>
                  <th class="px-4 py-4 text-center">PJ</th>
                  <th class="px-4 py-4 text-center">TD</th>
                  <th class="px-4 py-4 text-center">Pass Yds</th>
                  <th class="px-4 py-4 text-center">Rush Yds</th>
                  <th class="px-4 py-4 text-center">Rec Yds</th>
                  <th class="px-4 py-4 text-center">INT</th>
                  <th class="px-4 py-4 text-center">Sacks</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="player in paginatedPlayers"
                  :key="player.rowKey"
                  class="transition hover:bg-white/[0.03]"
                >
                  <td class="border-t border-white/5 px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-xs font-bold text-cyan-200">
                        <span>{{ initials(player.playerName) }}</span>
                      </div>

                      <div class="min-w-0">
                        <p class="truncate text-[15px] font-semibold text-white">{{ player.playerName }}</p>
                        <p class="mt-0.5 text-xs text-slate-500">#{{ player.position }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="border-t border-white/5 px-4 py-4">{{ player.teamName }}</td>
                  <td class="border-t border-white/5 px-4 py-4">{{ player.season }}</td>
                  <td class="border-t border-white/5 px-4 py-4">{{ player.category }}</td>
                  <td class="border-t border-white/5 px-4 py-4">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="branchBadgeClass(player.branch)">
                      {{ player.branch }}
                    </span>
                  </td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.gamesPlayed }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.touchdowns }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.passingYards }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.rushingYards }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.receivingYards }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.interceptions }}</td>
                  <td class="border-t border-white/5 px-4 py-4 text-center">{{ player.sacks }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="p-10 text-center">
            <p class="text-lg font-semibold text-white">No hay jugadores para mostrar</p>
            <p class="mt-2 text-sm text-slate-400">Prueba con otros filtros.</p>
          </div>

          <div
            v-if="playerTotalPages > 1"
            class="flex flex-col gap-3 border-t border-white/10 bg-[#081122] px-5 py-4 md:flex-row md:items-center md:justify-between"
          >
            <p class="text-sm text-slate-400">
              Mostrando
              <span class="font-semibold text-slate-200">{{ playerStartIndex + 1 }}</span>
              -
              <span class="font-semibold text-slate-200">{{ playerEndIndex }}</span>
              de
              <span class="font-semibold text-white">{{ filteredPlayers.length }}</span>
              jugadores
            </p>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="playerPage === 1"
                @click="goToPlayerPage(playerPage - 1)"
              >
                Anterior
              </button>

              <template v-for="node in playerPagination" :key="node.key">
                <span v-if="node.ellipsis" class="px-1 text-slate-500">...</span>

                <button
                  v-else
                  type="button"
                  class="min-w-[40px] rounded-xl px-3 py-2 text-sm font-semibold transition"
                  :class="node.active
                    ? 'bg-cyan-400 text-slate-950'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
                  @click="handlePlayerPageNode(node.value)"
                >
                  {{ node.label }}
                </button>
              </template>

              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="playerPage === playerTotalPages"
                @click="goToPlayerPage(playerPage + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, useAsyncData, useHead } from "#imports"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

useHead({
  title: "Estadísticas | Liga Jueves",
})

type AnyRow = Record<string, unknown>
type ViewMode = "equipos" | "jugadores"

type OptionItem = {
  value: string
  label: string
}

type PageNode = {
  key: string
  label: string
  value: number | null
  active: boolean
  ellipsis: boolean
}

type CategoryDefinition = {
  id: string
  code: string
  genderValue: string
  genderLabel: string
}

type TeamMeta = {
  id: string
  teamName: string
  seasonValue: string
  season: string
  seasonPriority: number
  categoryValue: string
  category: string
  categoryPriority: number
  branchValue: string
  branch: string
  branchPriority: number
  active: boolean
  logo: string | null
}

type TeamStanding = {
  rowKey: string
  teamId: number | string | null
  teamName: string
  seasonValue: string
  season: string
  categoryValue: string
  category: string
  branchValue: string
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

type PlayerSeasonRow = {
  rowKey: string
  playerId: number | string | null
  playerName: string
  teamName: string
  seasonValue: string
  season: string
  categoryValue: string
  category: string
  branchValue: string
  branch: string
  gamesPlayed: number
  touchdowns: number
  passingYards: number
  rushingYards: number
  receivingYards: number
  interceptions: number
  sacks: number
  active: boolean
}

type ResolvedSeasonInfo = {
  seasonValue: string
  season: string
  priority: number
}

type ResolvedCategoryInfo = {
  categoryValue: string
  category: string
  priority: number
}

type ResolvedBranchInfo = {
  branchValue: string
  branch: string
  priority: number
}

const JUEVES_LEAGUE_ID = 2

const stadiumBg = "/img/hero-stadium.jpg"

const view = ref<ViewMode>("equipos")
const search = ref("")
const selectedSeason = ref("ALL")
const selectedCategory = ref("ALL")
const selectedBranch = ref("ALL")
const onlyActive = ref(true)

const teamPage = ref(1)
const playerPage = ref(1)
const pageSize = 10

const seasonQueryValue = computed(() => {
  if (selectedSeason.value === "ALL") return null
  const match = String(selectedSeason.value).match(/^SEASON_(\d+)$/)
  if (!match) return null

  const parsed = Number(match[1])
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})

const teamFilterQuery = computed(() => ({
  leagueId: JUEVES_LEAGUE_ID,
  categoryCode: selectedBranch.value === "ALL" ? undefined : selectedBranch.value,
  gender: selectedCategory.value === "ALL" ? undefined : selectedCategory.value,
}))

const playerFilterQuery = computed(() => ({
  leagueId: JUEVES_LEAGUE_ID,
  seasonId: selectedSeason.value === "ALL" ? undefined : seasonQueryValue.value ?? undefined,
}))

const { data: seasonsRaw } = await useAsyncData(
  "jueves-stats-seasons-page",
  async () => {
    return await $fetch<unknown>("/api/t5/seasons/list", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])
  }
)

const { data: categoriesRaw } = await useAsyncData(
  "jueves-stats-categories-page",
  async () => {
    return await $fetch<unknown>("/api/t5/categories", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])
  }
)

const {
  data: teamsMetaRaw,
  pending: pendingTeamsMeta,
  error: teamsMetaError,
  refresh: refreshTeamsMeta,
} = await useAsyncData(
  "jueves-stats-team-meta",
  async () => {
    return await $fetch<unknown>("/api/t5/teams", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])
  }
)

const {
  data: pointsData,
  pending: pendingPoints,
  error: pointsError,
  refresh: refreshPoints,
} = await useAsyncData(
  "jueves-stats-points",
  async () => {
    return await $fetch<unknown>("/api/t5/points", {
      query: teamFilterQuery.value,
    }).catch(() => [])
  },
  {
    watch: [teamFilterQuery],
  }
)

const {
  data: playersData,
  pending: pendingPlayers,
  error: playersError,
  refresh: refreshPlayers,
} = await useAsyncData(
  "jueves-stats-players",
  async () => {
    return await $fetch<unknown>("/api/t5/stats/players", {
      query: playerFilterQuery.value,
    }).catch(() => [])
  },
  {
    watch: [playerFilterQuery],
  }
)

const pendingTeamsView = computed(() => pendingPoints.value || pendingTeamsMeta.value)
const pendingPlayersView = computed(() => pendingPlayers.value || pendingTeamsMeta.value)
const pending = computed(() => pendingTeamsView.value || pendingPlayersView.value)

const categoryDefinitions = computed<CategoryDefinition[]>(() => {
  return normalizeCollection(categoriesRaw.value)
    .map((row) => normalizeCategoryDefinition(row))
    .filter((item) => item.id || item.code || item.genderValue)
})

const categoryById = computed(() => {
  const map = new Map<string, CategoryDefinition>()

  for (const item of categoryDefinitions.value) {
    if (item.id && !map.has(item.id)) {
      map.set(item.id, item)
    }
  }

  return map
})

const categoryByCode = computed(() => {
  const map = new Map<string, CategoryDefinition>()

  for (const item of categoryDefinitions.value) {
    if (item.code && !map.has(item.code)) {
      map.set(item.code, item)
    }
  }

  return map
})

const teamMetaById = computed(() => {
  const map = new Map<string, TeamMeta>()

  for (const row of normalizeCollection(teamsMetaRaw.value)) {
    const meta = normalizeTeamMeta(row)
    if (meta.id) map.set(normalizeKey(meta.id), meta)
  }

  return map
})

const teamMetaByName = computed(() => {
  const map = new Map<string, TeamMeta>()

  for (const row of normalizeCollection(teamsMetaRaw.value)) {
    const meta = normalizeTeamMeta(row)
    const key = normalizeKey(meta.teamName)
    if (key && !map.has(key)) map.set(key, meta)
  }

  return map
})

const teamRows = computed<TeamStanding[]>(() => {
  const rows = normalizeCollection(pointsData.value)

  return rows.map((row, index) => {
    const rawTeamId = pick(row, ["team_id", "teamId", "team.id", "id"], "")
    const rawTeamName = pick(row, ["team_name", "teamName", "team.name", "name"], "")
    const meta =
      teamMetaById.value.get(normalizeKey(rawTeamId)) ||
      teamMetaByName.value.get(normalizeKey(rawTeamName))

    return buildTeamStanding(row, meta, index)
  })
})

const playerRows = computed<PlayerSeasonRow[]>(() => {
  const rows = normalizeCollection(playersData.value)

  return rows.map((row, index) => {
    const rawTeamId = pick(row, ["teamId", "team_id", "team.id"], "")
    const rawTeamName = pick(row, ["teamName", "team_name", "team.name"], "")
    const meta =
      teamMetaById.value.get(normalizeKey(rawTeamId)) ||
      teamMetaByName.value.get(normalizeKey(rawTeamName))

    return buildPlayerRow(row, meta, index)
  })
})

const seasonOptions = computed<OptionItem[]>(() => {
  const fromApi = normalizeCollection(seasonsRaw.value)
    .map((row) => {
      const seasonInfo = resolveSeasonInfo(row)
      return {
        value: seasonInfo.seasonValue,
        label: seasonInfo.season,
      }
    })

  const fromTeams = teamRows.value
    .filter((row) => row.seasonValue && row.season && row.seasonValue !== "ALL")
    .map((row) => ({
      value: row.seasonValue,
      label: row.season,
    }))

  const fromPlayers = playerRows.value
    .filter((row) => row.seasonValue && row.season && row.seasonValue !== "ALL")
    .map((row) => ({
      value: row.seasonValue,
      label: row.season,
    }))

  return uniqueOptions([...fromApi, ...fromTeams, ...fromPlayers]).sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )
})

const categoryOptions = computed<OptionItem[]>(() => {
  const fromApi = normalizeCollection(categoriesRaw.value)
    .map((row) => {
      const def = normalizeCategoryDefinition(row)
      if (!def.genderValue) return null

      return {
        value: def.genderValue,
        label: def.genderLabel,
      }
    })
    .filter(Boolean) as OptionItem[]

  const fromTeams = teamRows.value
    .filter((row) => row.categoryValue && row.category)
    .map((row) => ({
      value: row.categoryValue,
      label: row.category,
    }))

  const fromPlayers = playerRows.value
    .filter((row) => row.categoryValue && row.category)
    .map((row) => ({
      value: row.categoryValue,
      label: row.category,
    }))

  return uniqueOptions([...fromApi, ...fromTeams, ...fromPlayers]).sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )
})

const branchOptions = computed<OptionItem[]>(() => {
  const fromApi = normalizeCollection(categoriesRaw.value)
    .map((row) => {
      const def = normalizeCategoryDefinition(row)
      if (!def.code) return null

      return {
        value: def.code,
        label: def.code,
      }
    })
    .filter(Boolean) as OptionItem[]

  const fromTeams = teamRows.value
    .filter((row) => row.branchValue && row.branch)
    .map((row) => ({
      value: row.branchValue,
      label: row.branch,
    }))

  const fromPlayers = playerRows.value
    .filter((row) => row.branchValue && row.branch)
    .map((row) => ({
      value: row.branchValue,
      label: row.branch,
    }))

  return uniqueOptions([...fromApi, ...fromTeams, ...fromPlayers]).sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )
})

const filteredTeams = computed<TeamStanding[]>(() => {
  const query = normalizeText(search.value)

  return [...teamRows.value]
    .filter((item) => selectedSeason.value === "ALL" || item.seasonValue === selectedSeason.value)
    .filter((item) => selectedCategory.value === "ALL" || item.categoryValue === selectedCategory.value)
    .filter((item) => selectedBranch.value === "ALL" || item.branchValue === selectedBranch.value)
    .filter((item) => !onlyActive.value || item.active)
    .filter((item) => {
      if (!query) return true
      return normalizeText([item.teamName, item.category, item.branch, item.season].join(" ")).includes(query)
    })
    .sort((a, b) => {
      return (
        b.standingPoints - a.standingPoints ||
        b.pct - a.pct ||
        b.pointDiff - a.pointDiff ||
        b.pointsFor - a.pointsFor ||
        a.teamName.localeCompare(b.teamName, "es")
      )
    })
})

const filteredPlayers = computed<PlayerSeasonRow[]>(() => {
  const query = normalizeText(search.value)

  return [...playerRows.value]
    .filter((item) => selectedSeason.value === "ALL" || item.seasonValue === selectedSeason.value)
    .filter((item) => selectedCategory.value === "ALL" || item.categoryValue === selectedCategory.value)
    .filter((item) => selectedBranch.value === "ALL" || item.branchValue === selectedBranch.value)
    .filter((item) => !onlyActive.value || item.active)
    .filter((item) => {
      if (!query) return true
      return normalizeText([item.playerName, item.teamName, item.category, item.branch, item.season].join(" ")).includes(query)
    })
    .sort((a, b) => {
      const yardsA = a.passingYards + a.rushingYards + a.receivingYards
      const yardsB = b.passingYards + b.rushingYards + b.receivingYards

      return (
        b.touchdowns - a.touchdowns ||
        yardsB - yardsA ||
        b.interceptions - a.interceptions ||
        b.sacks - a.sacks ||
        a.playerName.localeCompare(b.playerName, "es")
      )
    })
})

const activeTeamsCount = computed(() => filteredTeams.value.filter((item) => item.active).length)
const activePlayersCount = computed(() => filteredPlayers.value.filter((item) => item.active).length)

const viewDescription = computed(() => {
  return view.value === "equipos"
    ? "Tabla de rendimiento por equipo, conectada al backend real de la liga de jueves."
    : "Líderes individuales por temporada, conectados al endpoint real de estadísticas de jugadores."
})

const currentLoadError = computed(() => {
  if (view.value === "equipos") {
    const err = pointsError.value || teamsMetaError.value
    return extractErrorMessage(err)
  }

  const err = playersError.value || teamsMetaError.value
  return extractErrorMessage(err)
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

const playerTotalPages = computed(() => Math.max(1, Math.ceil(filteredPlayers.value.length / pageSize)))
const playerStartIndex = computed(() => (playerPage.value - 1) * pageSize)
const playerEndIndex = computed(() => Math.min(playerStartIndex.value + pageSize, filteredPlayers.value.length))

const paginatedPlayers = computed(() => {
  return filteredPlayers.value
    .slice(playerStartIndex.value, playerStartIndex.value + pageSize)
    .map((item, index) => ({
      ...item,
      position: playerStartIndex.value + index + 1,
    }))
})

watch([search, selectedSeason, selectedCategory, selectedBranch, onlyActive, view], () => {
  teamPage.value = 1
  playerPage.value = 1
})

watch(
  seasonOptions,
  (options) => {
    if (
      selectedSeason.value !== "ALL" &&
      !options.some((option) => option.value === selectedSeason.value)
    ) {
      selectedSeason.value = "ALL"
    }
  },
  { immediate: true }
)

watch(categoryOptions, (options) => {
  if (
    selectedCategory.value !== "ALL" &&
    !options.some((option) => option.value === selectedCategory.value)
  ) {
    selectedCategory.value = "ALL"
  }
})

watch(branchOptions, (options) => {
  if (
    selectedBranch.value !== "ALL" &&
    !options.some((option) => option.value === selectedBranch.value)
  ) {
    selectedBranch.value = "ALL"
  }
})

watch(filteredTeams, () => {
  if (teamPage.value > teamTotalPages.value) {
    teamPage.value = teamTotalPages.value
  }
})

watch(filteredPlayers, () => {
  if (playerPage.value > playerTotalPages.value) {
    playerPage.value = playerTotalPages.value
  }
})

const teamPagination = computed<PageNode[]>(() => buildPagination(teamPage.value, teamTotalPages.value))
const playerPagination = computed<PageNode[]>(() => buildPagination(playerPage.value, playerTotalPages.value))

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
    .filter((n): n is number => typeof n === "number" && n >= 1 && n <= total)
    .sort((a, b) => a - b)

  const nodes: PageNode[] = []

  for (let i = 0; i < pageNumbers.length; i++) {
    const value = pageNumbers[i]
    if (typeof value !== "number") continue

    nodes.push({
      key: `page-${value}`,
      label: String(value),
      value,
      active: value === current,
      ellipsis: false,
    })

    const next = pageNumbers[i + 1]
    if (typeof next === "number" && next - value > 1) {
      nodes.push({
        key: `ellipsis-${value}-${next}`,
        label: "...",
        value: null,
        active: false,
        ellipsis: true,
      })
    }
  }

  return nodes
}

function setView(next: ViewMode): void {
  view.value = next
}

function clearFilters(): void {
  search.value = ""
  selectedSeason.value = "ALL"
  selectedCategory.value = "ALL"
  selectedBranch.value = "ALL"
  onlyActive.value = true
}

function toggleOnlyActive(): void {
  onlyActive.value = !onlyActive.value
}

async function reloadData(): Promise<void> {
  teamPage.value = 1
  playerPage.value = 1

  await Promise.allSettled([
    refreshPoints(),
    refreshTeamsMeta(),
    refreshPlayers(),
  ])
}

function goToTeamPage(page: number): void {
  if (page < 1 || page > teamTotalPages.value) return
  teamPage.value = page
}

function goToPlayerPage(page: number): void {
  if (page < 1 || page > playerTotalPages.value) return
  playerPage.value = page
}

function handleTeamPageNode(page: number | null): void {
  if (typeof page !== "number") return
  goToTeamPage(page)
}

function handlePlayerPageNode(page: number | null): void {
  if (typeof page !== "number") return
  goToPlayerPage(page)
}

function initials(name: string): string {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function signedNumber(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

function formatPct(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return `${safe.toFixed(safe % 1 === 0 ? 0 : 1)}%`
}

function branchBadgeClass(branch: string): string {
  const normalized = normalizeCodeValue(branch)
  if (!normalized || isMissingBranchText(branch)) return "bg-slate-400/15 text-slate-200"
  return "bg-amber-400/15 text-amber-200"
}

function diffBadgeClass(value: number): string {
  if (value > 0) return "bg-emerald-400/15 text-emerald-200"
  if (value < 0) return "bg-rose-400/15 text-rose-200"
  return "bg-slate-400/15 text-slate-200"
}

function extractErrorMessage(error: unknown): string {
  const err = error as { data?: { message?: string }; message?: string } | null
  return err?.data?.message || err?.message || ""
}

function normalizeCollection(payload: unknown): AnyRow[] {
  if (Array.isArray(payload)) return payload as AnyRow[]

  if (payload && typeof payload === "object") {
    const source = payload as Record<string, unknown>
    if (Array.isArray(source.data)) return source.data as AnyRow[]
    if (Array.isArray(source.items)) return source.items as AnyRow[]
    if (Array.isArray(source.content)) return source.content as AnyRow[]
    if (Array.isArray(source.results)) return source.results as AnyRow[]
    if (Array.isArray(source.teams)) return source.teams as AnyRow[]
  }

  return []
}

function pick(row: AnyRow, keys: string[], fallback: unknown = null): unknown {
  for (const key of keys) {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, row)

    if (value !== undefined && value !== null && value !== "") {
      return value
    }
  }

  return fallback
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toNullableNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toPositiveNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function toText(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim()
  if (typeof value === "number") return String(value)
  return fallback
}

function toBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["true", "1", "yes", "si", "sí", "active", "activo"].includes(normalized)) return true
    if (["false", "0", "no", "inactive", "inactivo"].includes(normalized)) return false
  }

  return fallback
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function normalizeKey(value: unknown): string {
  return normalizeText(value)
}

function normalizeGenderValue(value: unknown): string {
  const normalized = normalizeText(value).toUpperCase()

  if (!normalized) return ""
  if (normalized === "MASCULINO" || normalized === "MALE") return "VARONIL"
  if (normalized === "FEMENINO" || normalized === "FEMALE") return "FEMENIL"

  return normalized
}

function formatGenderLabel(value: string): string {
  const normalized = normalizeGenderValue(value)

  if (normalized === "VARONIL") return "Varonil"
  if (normalized === "FEMENIL") return "Femenil"
  if (normalized === "MIXTO") return "Mixto"

  return value || "Sin categoría"
}

function normalizeCodeValue(value: unknown): string {
  return String(value ?? "").trim().toUpperCase()
}

function sanitizeDisplayText(value: unknown): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""

  const normalized = normalizeText(raw)
  if (["0", "null", "undefined", "nan", "-", "—"].includes(normalized)) return ""

  return raw
}

function sanitizeSeasonLabel(value: unknown): string {
  const raw = sanitizeDisplayText(value)
  if (!raw) return ""

  const normalized = normalizeText(raw)
  if (normalized === "temporada 0") return ""

  return raw
}

function isMissingSeasonText(value: unknown): boolean {
  const normalized = normalizeText(value)
  return [
    "sin temporada",
    "sin temporada asignada",
    "no contiene temporada",
    "no tiene temporada",
    "sin season",
    "no season",
  ].includes(normalized)
}

function isMissingCategoryText(value: unknown): boolean {
  const normalized = normalizeText(value)
  return [
    "sin categoria",
    "sin categoria asignada",
    "no contiene categoria",
    "no tiene categoria",
  ].includes(normalized)
}

function isMissingBranchText(value: unknown): boolean {
  const normalized = normalizeText(value)
  return [
    "sin rama",
    "sin division",
    "sin branch",
  ].includes(normalized)
}

function buildSeasonValue(seasonId: number | null, seasonLabel: string): string {
  if (typeof seasonId === "number" && seasonId > 0) return `SEASON_${seasonId}`

  const cleanLabel = sanitizeSeasonLabel(seasonLabel)
  if (cleanLabel) return `LABEL_${normalizeText(cleanLabel)}`

  return "LABEL_sin-temporada"
}

function uniqueOptions(items: OptionItem[]): OptionItem[] {
  const map = new Map<string, string>()

  for (const item of items) {
    const value = String(item?.value || "").trim()
    const label = String(item?.label || "").trim()

    if (!value || !label) continue
    if (!map.has(value)) map.set(value, label)
  }

  return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
}

function normalizeCategoryDefinition(row: AnyRow): CategoryDefinition {
  const id = normalizeKey(pick(row, ["id", "categoryId", "category.id"], ""))
  const code = normalizeCodeValue(pick(row, ["code", "category.code"], ""))
  const genderValue = normalizeGenderValue(pick(row, ["gender", "category.gender"], ""))
  const genderLabel = genderValue ? formatGenderLabel(genderValue) : ""

  return {
    id,
    code,
    genderValue,
    genderLabel,
  }
}

function resolveCategoryDefinition(row: AnyRow): CategoryDefinition | undefined {
  const categoryId = normalizeKey(
    pick(row, [
      "category.id",
      "categoryId",
      "division.id",
      "rama.id",
      "team.category.id",
    ], "")
  )

  if (categoryId && categoryById.value.has(categoryId)) {
    return categoryById.value.get(categoryId)
  }

  const code = normalizeCodeValue(
    pick(row, [
      "category.code",
      "categoryCode",
      "division.code",
      "rama.code",
      "team.category.code",
      "code",
    ], "")
  )

  if (code && categoryByCode.value.has(code)) {
    return categoryByCode.value.get(code)
  }

  return undefined
}

function resolveSeasonInfo(row: AnyRow): ResolvedSeasonInfo {
  const seasonId = toPositiveNumber(
    pick(row, [
      "season.id",
      "seasonId",
      "temporada.id",
      "team.season.id",
    ], null)
  )

  const directLabel = sanitizeSeasonLabel(
    pick(row, [
      "season.name",
      "season.label",
      "season.title",
      "seasonName",
      "temporada.name",
      "temporada.nombre",
      "temporada",
      "season",
      "team.season.name",
    ], "")
  )

  if (seasonId !== null) {
    return {
      seasonValue: buildSeasonValue(seasonId, directLabel || `Temporada ${seasonId}`),
      season: directLabel || `Temporada ${seasonId}`,
      priority: 3,
    }
  }

  if (directLabel) {
    return {
      seasonValue: isMissingSeasonText(directLabel) ? "LABEL_sin-temporada" : buildSeasonValue(null, directLabel),
      season: directLabel,
      priority: isMissingSeasonText(directLabel) ? 2 : 3,
    }
  }

  return {
    seasonValue: "LABEL_sin-temporada",
    season: "Sin temporada asignada",
    priority: 1,
  }
}

function resolveCategoryInfo(row: AnyRow): ResolvedCategoryInfo {
  const def = resolveCategoryDefinition(row)

  const directGender = normalizeGenderValue(
    pick(row, [
      "category.gender",
      "categoryGender",
      "gender",
      "division.gender",
      "rama.gender",
      "team.category.gender",
    ], "")
  )

  const directLabel = sanitizeDisplayText(
    pick(row, [
      "category.label",
      "category.name",
      "categoryName",
      "division.label",
      "division.name",
      "rama.label",
      "rama.name",
      "team.category.label",
      "team.category.name",
    ], "")
  )

  const categoryValue = directGender || def?.genderValue || ""

  if (categoryValue) {
    return {
      categoryValue,
      category: formatGenderLabel(categoryValue),
      priority: 3,
    }
  }

  if (directLabel) {
    return {
      categoryValue: "",
      category: directLabel,
      priority: isMissingCategoryText(directLabel) ? 2 : 3,
    }
  }

  return {
    categoryValue: "",
    category: "Sin categoría",
    priority: 1,
  }
}

function resolveBranchInfo(row: AnyRow): ResolvedBranchInfo {
  const def = resolveCategoryDefinition(row)

  const directCode = normalizeCodeValue(
    pick(row, [
      "category.code",
      "categoryCode",
      "division.code",
      "rama.code",
      "branch.code",
      "team.category.code",
      "code",
    ], "")
  )

  if (directCode) {
    return {
      branchValue: directCode,
      branch: directCode,
      priority: 3,
    }
  }

  if (def?.code) {
    return {
      branchValue: def.code,
      branch: def.code,
      priority: 3,
    }
  }

  return {
    branchValue: "",
    branch: "Sin rama",
    priority: 1,
  }
}

function normalizeTeamMeta(row: AnyRow): TeamMeta {
  const seasonInfo = resolveSeasonInfo(row)
  const categoryInfo = resolveCategoryInfo(row)
  const branchInfo = resolveBranchInfo(row)

  const rawId = pick(row, ["teamId", "team_id", "team.id", "id"], "")
  const id = String(rawId ?? "").trim()

  return {
    id,
    teamName: toText(pick(row, ["teamName", "team_name", "team.name", "name"]), "Equipo"),
    seasonValue: seasonInfo.seasonValue,
    season: seasonInfo.season,
    seasonPriority: seasonInfo.priority,
    categoryValue: categoryInfo.categoryValue,
    category: categoryInfo.category,
    categoryPriority: categoryInfo.priority,
    branchValue: branchInfo.branchValue,
    branch: branchInfo.branch,
    branchPriority: branchInfo.priority,
    active: toBoolean(pick(row, ["isActive", "active", "status"]), true),
    logo: (() => {
      const value = pick(row, [
        "logoUrl",
        "logo",
        "imageUrl",
        "photo",
        "avatar",
        "team.logoUrl",
        "team.logo",
      ], null)
      return value ? String(value) : null
    })(),
  }
}

function normalizePct(value: number): number {
  if (!Number.isFinite(value)) return 0
  return value <= 1 ? value * 100 : value
}

function buildTeamStanding(pointRow: AnyRow, meta: TeamMeta | undefined, index: number): TeamStanding {
  const rowSeason = resolveSeasonInfo(pointRow)
  const rowCategory = resolveCategoryInfo(pointRow)
  const rowBranch = resolveBranchInfo(pointRow)

  const useRowSeason = rowSeason.priority >= (meta?.seasonPriority ?? 0)
  const useRowCategory = rowCategory.priority >= (meta?.categoryPriority ?? 0)
  const useRowBranch = rowBranch.priority >= (meta?.branchPriority ?? 0)

  const rawTeamId = pick(pointRow, ["team_id", "teamId", "team.id", "id"], null)

  const teamId =
    rawTeamId === null || rawTeamId === undefined
      ? null
      : (typeof rawTeamId === "number" || typeof rawTeamId === "string"
          ? rawTeamId
          : String(rawTeamId))

  const played = toNumber(pick(pointRow, ["gp", "games_played", "played", "jj", "pj"]), 0)
  const won = toNumber(pick(pointRow, ["wins", "won", "jg", "pg"]), 0)
  const tied = toNumber(pick(pointRow, ["ties", "tied", "empates", "je"]), 0)
  const lost = toNumber(
    pick(pointRow, ["losses", "lost", "jp", "pp"]),
    Math.max(played - won - tied, 0)
  )

  const pointsFor = toNumber(
    pick(pointRow, ["points_for", "gf", "pointsFor", "pf", "favor"]),
    0
  )

  const pointsAgainst = toNumber(
    pick(pointRow, ["points_against", "gc", "pointsAgainst", "pc", "against"]),
    0
  )

  const pointDiff = toNumber(
    pick(pointRow, ["pointDiff", "difference", "dif", "diff"]),
    pointsFor - pointsAgainst
  )

  const pctValue = pick(pointRow, ["pct", "percentage", "winPct"], null)
  const pct =
    pctValue !== null && pctValue !== undefined
      ? normalizePct(toNumber(pctValue))
      : (played > 0 ? (won / played) * 100 : 0)

  const teamName = toText(
    pick(pointRow, ["team_name", "teamName", "team.name", "name"]),
    meta?.teamName || "Equipo"
  )

  return {
    rowKey: `team-${teamId ?? teamName}-${index}`,
    teamId,
    teamName,
    seasonValue: useRowSeason ? rowSeason.seasonValue : (meta?.seasonValue || rowSeason.seasonValue),
    season: useRowSeason ? rowSeason.season : (meta?.season || rowSeason.season),
    categoryValue: useRowCategory ? rowCategory.categoryValue : (meta?.categoryValue || rowCategory.categoryValue),
    category: useRowCategory ? rowCategory.category : (meta?.category || rowCategory.category),
    branchValue: useRowBranch ? rowBranch.branchValue : (meta?.branchValue || rowBranch.branchValue),
    branch: useRowBranch ? rowBranch.branch : (meta?.branch || rowBranch.branch),
    played,
    won,
    lost,
    tied,
    pointsFor,
    pointsAgainst,
    pointDiff,
    standingPoints: toNumber(
      pick(pointRow, ["table_points", "pts", "points", "standingPoints", "puntos"]),
      0
    ),
    pct,
    active: meta?.active ?? true,
    logo: meta?.logo ?? null,
  }
}

function buildPlayerRow(row: AnyRow, meta: TeamMeta | undefined, index: number): PlayerSeasonRow {
  const rowSeason = resolveSeasonInfo(row)
  const rowCategory = resolveCategoryInfo(row)
  const rowBranch = resolveBranchInfo(row)

  const useRowSeason = rowSeason.priority >= (meta?.seasonPriority ?? 0)
  const useRowCategory = rowCategory.priority >= (meta?.categoryPriority ?? 0)
  const useRowBranch = rowBranch.priority >= (meta?.branchPriority ?? 0)

  const playerId = pick(row, ["playerId", "player_id", "player.id", "id"], null)
  const gamesPlayed = toNumber(pick(row, ["gamesPlayed", "gp", "played", "pj", "games"]), 0)

  const passingTouchdowns = toNumber(pick(row, ["passingTouchdowns", "passTds", "tdPass"]), 0)
  const rushingTouchdowns = toNumber(pick(row, ["rushingTouchdowns", "rushTds", "tdRush"]), 0)
  const receivingTouchdowns = toNumber(pick(row, ["receivingTouchdowns", "recTds", "tdRec"]), 0)

  const directTouchdowns = toNullableNumber(pick(row, ["touchdowns", "td", "tds", "totalTouchdowns"]))

  return {
    rowKey: `player-${playerId ?? index}-${index}`,
    playerId: playerId as number | string | null,
    playerName: toText(
      pick(row, ["playerName", "fullName", "name", "player.name", "athleteName"]),
      "Jugador"
    ),
    teamName: toText(
      pick(row, ["teamName", "team.name", "team_name"]),
      meta?.teamName || "Equipo"
    ),
    seasonValue: useRowSeason ? rowSeason.seasonValue : (meta?.seasonValue || rowSeason.seasonValue),
    season: useRowSeason ? rowSeason.season : (meta?.season || rowSeason.season),
    categoryValue: useRowCategory ? rowCategory.categoryValue : (meta?.categoryValue || rowCategory.categoryValue),
    category: useRowCategory ? rowCategory.category : (meta?.category || rowCategory.category),
    branchValue: useRowBranch ? rowBranch.branchValue : (meta?.branchValue || rowBranch.branchValue),
    branch: useRowBranch ? rowBranch.branch : (meta?.branch || rowBranch.branch),
    gamesPlayed,
    touchdowns:
      directTouchdowns !== null
        ? directTouchdowns
        : passingTouchdowns + rushingTouchdowns + receivingTouchdowns,
    passingYards: toNumber(pick(row, ["passingYards", "passYards", "ydsPass", "passing_yds"]), 0),
    rushingYards: toNumber(pick(row, ["rushingYards", "rushYards", "ydsRush", "rushing_yds"]), 0),
    receivingYards: toNumber(pick(row, ["receivingYards", "recYards", "ydsRec", "receiving_yds"]), 0),
    interceptions: toNumber(pick(row, ["interceptions", "ints", "defInterceptions"]), 0),
    sacks: toNumber(pick(row, ["sacks", "qbSacks"]), 0),
    active: meta?.active ?? true,
  }
}
</script>