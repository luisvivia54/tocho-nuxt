<!-- app/pages/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <!-- HERO -->
    <section class="relative pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl"></div>
        <div class="absolute top-20 -left-24 h-[420px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 h-[460px] w-[560px] rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,.10),transparent_45%)]"
        ></div>
        <div
          class="absolute inset-0 opacity-25 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_72px)]"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
        <header class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
          <div>
            <p class="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              TOCHERO5 · CENTRO DE ESTADÍSTICAS
            </p>

            <h1 class="mt-2 font-display text-3xl md:text-4xl font-extrabold text-white">
              Jugadores
            </h1>

            <p class="mt-2 text-sm text-slate-300 max-w-2xl">
              Rankings y métricas por jugador. Usa los filtros para encontrar tu equipo y comparar números.
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
              >
                Live data (backend)
              </span>
              <span
                class="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-100"
              >
                Rankings
              </span>
              <span
                class="inline-flex items-center rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold text-fuchsia-100"
              >
                Líderes
              </span>
            </div>
          </div>

          <!-- acciones: en móvil se apilan -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/estadisticas"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Ver estadísticas (equipos)
            </NuxtLink>
          </div>
        </header>

        <!-- FILTROS -->
        <section
          class="mt-6 sm:mt-7 rounded-3xl border border-white/10 bg-[#070b1d]/85 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden"
        >
          <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-white">Filtros</h2>
              <p class="text-xs text-slate-400">Equipo, número y nombre del jugador.</p>
            </div>

            <button
              type="button"
              class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
              @click="clearFilters"
            >
              Limpiar
            </button>
          </div>

          <div class="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Equipo -->
            <div class="md:col-span-5">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Equipo</label>
              <select
                v-model="teamPick"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="ALL">Todos</option>
                <option v-for="t in teamsVm" :key="t.teamId" :value="String(t.teamId)">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <!-- Número -->
            <div class="md:col-span-3">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Número</label>
              <input
                v-model.trim="numberPick"
                inputmode="numeric"
                placeholder="Ej. 7"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Nombre -->
            <div class="md:col-span-4">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Nombre del jugador</label>
              <input
                v-model.trim="namePick"
                placeholder="Escribe para buscar…"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div class="md:col-span-12 flex items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-400">
                Mostrando <span class="text-slate-200 font-semibold">{{ filteredPlayers.length }}</span> jugador(es)
              </p>
            </div>
          </div>
        </section>

        <!-- ESTADOS -->
        <div
          v-if="pendingAny"
          class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
        >
          Cargando jugadores…
        </div>

        <div
          v-else-if="errorAny"
          class="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-100"
        >
          Error cargando datos. Revisa que el backend esté disponible.
        </div>

        <!-- CONTENIDO -->
        <div v-else class="mt-6 grid lg:grid-cols-12 gap-6">
          <!-- LÍDERES -->
          <section class="lg:col-span-5 space-y-4">
            <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 p-4 md:p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">leaders</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Top por categoría</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Tablas estilo “poster”. Aquí es donde se siente full estadística.
                  </p>
                </div>

                <span
                  class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
                >
                  {{ seasonLabel }}
                </span>
              </div>
            </div>

            <PosterPanel
              title="Intercepciones"
              subtitle="DEFENSIVA"
              accent="fuchsia"
              :rows="leadersINT"
              value-label="INT"
              :value-fn="(p) => p.stats.int"
            />

            <PosterPanel
              title="Anotaciones"
              subtitle="PUNTOS"
              accent="violet"
              :rows="leadersTD"
              value-label="TD"
              :value-fn="(p) => p.stats.td"
            />

            <PosterPanel
              title="Pases de anotación"
              subtitle="QB"
              accent="sky"
              :rows="leadersPA"
              value-label="PA"
              :value-fn="(p) => p.stats.pa"
            />

            <PosterPanel
              title="Sacks"
              subtitle="PASS RUSH"
              accent="emerald"
              :rows="leadersSACK"
              value-label="SACK"
              :value-fn="(p) => p.stats.sack"
            />
          </section>

          <!-- RANKING / TARJETAS -->
          <section class="lg:col-span-7 space-y-4">
            <div
              class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
            >
              <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">ranking</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Jugadores</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Ordenado por <span class="text-slate-200 font-semibold">Impacto</span> (TD + INT + PA + SACK).
                    Paginado de <b class="text-slate-200">10 en 10</b>.
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <span class="hidden sm:inline text-[11px] text-slate-400">Total:</span>
                  <span
                    class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
                  >
                    {{ sortedPlayersAll.length }}
                  </span>
                </div>
              </div>

              <!-- PAGINACIÓN TOP -->
              <div
                class="px-4 sm:px-5 py-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <p class="text-[11px] text-slate-400">
                  Mostrando
                  <span class="text-slate-200 font-semibold">{{ rangeStart }}</span>
                  -
                  <span class="text-slate-200 font-semibold">{{ rangeEnd }}</span>
                  de
                  <span class="text-slate-200 font-semibold">{{ sortedPlayersAll.length }}</span>
                </p>

                <div class="flex items-center gap-2 justify-between sm:justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page <= 1"
                    @click="page = Math.max(1, page - 1)"
                  >
                    ←
                  </button>

                  <span
                    class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
                  >
                    Página {{ page }} / {{ pageCount }}
                  </span>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page >= pageCount"
                    @click="page = Math.min(pageCount, page + 1)"
                  >
                    →
                  </button>
                </div>
              </div>

              <!-- LISTA -->
              <div v-if="pagedPlayers.length === 0" class="px-4 sm:px-5 py-6 text-sm text-slate-300">
                No hay jugadores para esos filtros.
              </div>

              <div v-else class="p-3 sm:p-4 md:p-5 space-y-3">
                <article
                  v-for="(p, idx) in pagedPlayers"
                  :key="p.id"
                  class="rounded-3xl border border-white/10 bg-white/5 hover:bg-white/7 transition shadow-[0_18px_55px_rgba(0,0,0,0.35)]"
                >
                  <div class="p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4">
                    <!-- TOP: RANK + FOTO + INFO -->
                    <div class="flex items-center gap-3 min-w-0">
                      <div
                        class="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl border border-white/10 bg-black/20 grid place-items-center text-sm font-extrabold text-slate-200 shrink-0"
                      >
                        {{ (page - 1) * perPage + idx + 1 }}
                      </div>

                      <div
                        class="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0"
                      >
                        <img
                          v-if="p.photoUrl"
                          :src="p.photoUrl"
                          :alt="p.fullName"
                          class="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span v-else class="text-[12px] font-extrabold text-slate-200">
                          {{ initials(p.fullName) }}
                        </span>
                      </div>

                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-white truncate">
                          {{ p.fullName }}
                          <span v-if="p.number != null" class="ml-2 text-slate-400 font-semibold">#{{ p.number }}</span>
                        </p>

                        <p class="mt-0.5 text-sm text-slate-200 truncate">
                          {{ p.teamName || 'Sin equipo' }}
                        </p>

                        <p class="mt-0.5 text-[11px] text-slate-400 truncate">
                          <span v-if="p.gender">{{ p.gender }}</span>
                          <span v-if="p.categoryCode" class="ml-1">· {{ p.categoryCode }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- STATS: en móvil 2x2 -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                      <div class="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-2 sm:px-3 py-2 text-center">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-fuchsia-100/80">INT</p>
                        <p class="mt-0.5 text-base sm:text-lg font-extrabold text-fuchsia-100 tabular-nums">
                          {{ p.stats.int }}
                        </p>
                      </div>

                      <div class="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-2 sm:px-3 py-2 text-center">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-violet-100/80">TD</p>
                        <p class="mt-0.5 text-base sm:text-lg font-extrabold text-violet-100 tabular-nums">
                          {{ p.stats.td }}
                        </p>
                      </div>

                      <div class="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-2 sm:px-3 py-2 text-center">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-sky-100/80">PA</p>
                        <p class="mt-0.5 text-base sm:text-lg font-extrabold text-sky-100 tabular-nums">
                          {{ p.stats.pa }}
                        </p>
                      </div>

                      <div class="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-2 sm:px-3 py-2 text-center">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-emerald-100/80">SACK</p>
                        <p class="mt-0.5 text-base sm:text-lg font-extrabold text-emerald-100 tabular-nums">
                          {{ p.stats.sack }}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <!-- PAGINACIÓN BOTTOM -->
              <div class="px-4 sm:px-5 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p class="text-[11px] text-slate-400">
                  Impacto = TD + INT + PA + SACK
                </p>

                <div class="flex items-center gap-2 justify-between sm:justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page <= 1"
                    @click="page = Math.max(1, page - 1)"
                  >
                    ← Anterior
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page >= pageCount"
                    @click="page = Math.min(pageCount, page + 1)"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useAsyncData, useRuntimeConfig, useRoute } from '#imports'

/** =========================
 *  API CONFIG
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const API_TEAMS = `${API_BASE}/teams`
const API_STATS_PLAYERS = `${API_BASE}/stats/players`

const route = useRoute()

/** leagueId por default 1, pero soporta /jugadores?leagueId=2 */
const leagueId = computed<number>(() => {
  const q = route.query.leagueId
  const v = Array.isArray(q) ? q[0] : q
  const n = Number(v ?? 1)
  return Number.isFinite(n) && n > 0 ? n : 1
})

/** seasonId opcional si luego lo usas: /jugadores?leagueId=1&seasonId=3 */
const seasonId = computed<number | null>(() => {
  const q = route.query.seasonId
  const v = Array.isArray(q) ? q[0] : q
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : null
})

/** =========================
 *  HELPERS
 *  ========================= */
function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  return []
}

const toNum = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)
const upper = (v: any) => String(v ?? '').toUpperCase()

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function dedupeById(list: any[]) {
  const m = new Map<number, any>()
  for (const x of list) {
    const id = Number(x?.playerId ?? x?.player_id ?? x?.id)
    if (!Number.isFinite(id)) continue
    if (!m.has(id)) m.set(id, x)
  }
  return Array.from(m.values())
}

/** pool simple para no aventar 50 requests al mismo tiempo */
async function mapPool<T, R>(
  items: readonly T[],
  worker: (item: T) => Promise<R>,
  concurrency = 8
): Promise<R[]> {
  const out = new Array<R>(items.length)
  let i = 0

  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = i++
      if (idx >= items.length) break

      const item = items[idx]!
      out[idx] = await worker(item)
    }
  })

  await Promise.all(runners)
  return out
}

/** =========================
 *  TYPES
 *  ========================= */
type TeamVM = {
  teamId: number
  name: string
  shortName?: string
  logoUrl?: string | null
  code?: string
  gender?: string
}

type PlayerStats = {
  td: number
  int: number
  pa: number
  sack: number
  rec: number
}

type PlayerVM = {
  id: number
  fullName: string
  number?: number | null
  photoUrl?: string | null
  teamId?: number | null
  teamName?: string
  gender?: string
  categoryCode?: string
  stats: PlayerStats
}

/** =========================
 *  FETCH TEAMS
 *  ========================= */
const { data: teamsData, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'players-teams',
  async () => {
    try {
      const raw = await $fetch<any>(API_TEAMS)
      return unwrapList<any>(raw)
    } catch {
      return []
    }
  }
)

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
      shortName: x.shortName ?? x.short_name ?? '',
      logoUrl: x.logoUrl ?? x.logo_url ?? x.photoUrl ?? x.photo_url ?? null,
      code: x.code ?? x.category?.code ?? x.rama ?? '',
      gender: x.gender ?? x.category?.gender ?? '',
    }))
    .filter((t) => Number.isFinite(t.teamId))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const teamById = computed(() => {
  const m = new Map<number, TeamVM>()
  for (const t of teamsVm.value) m.set(t.teamId, t)
  return m
})

/** =========================
 *  FETCH STATS
 *  ========================= */
type PlayerSeasonStatsApi = {
  playerId?: number
  player_id?: number
  id?: number
  fullName?: string
  full_name?: string
  td?: number
  passTd?: number
  pass_td?: number
  interceptions?: number
  intercep?: number
  sacks?: number
}

const { data: statsData, pending: statsPending, error: statsErr, refresh: refreshStats } = useAsyncData(
  () => `players-stats:${leagueId.value}:${seasonId.value ?? 'current'}`,
  async () => {
    try {
      const params = new URLSearchParams()
      params.set('leagueId', String(leagueId.value))
      if (seasonId.value) params.set('seasonId', String(seasonId.value))

      const raw = await $fetch<any>(`${API_STATS_PLAYERS}?${params.toString()}`)
      return unwrapList<PlayerSeasonStatsApi>(raw)
    } catch {
      return []
    }
  },
  { watch: [leagueId, seasonId] }
)

const statsByPlayerId = computed(() => {
  const m = new Map<number, PlayerStats>()
  const list = unwrapList<PlayerSeasonStatsApi>(statsData.value)

  for (const x of list) {
    const id = Number(x.playerId ?? x.player_id ?? x.id)
    if (!Number.isFinite(id)) continue

    const td = toNum(x.td)
    const pa = toNum(x.passTd ?? x.pass_td)
    const it = toNum((x as any).interceptions ?? (x as any).intercep)
    const sack = toNum(x.sacks)

    m.set(id, { td, pa, int: it, sack, rec: 0 })
  }
  return m
})

/** =========================
 *  FETCH ROSTER GLOBAL (por equipos)
 *  ========================= */
async function fetchRosterFromTeams(): Promise<any[]> {
  const teams = teamsVm.value
  if (!teams.length) return []

  const chunks = await mapPool(
    teams,
    async (t) => {
      try {
        const raw = await $fetch<any>(`${API_TEAMS}/${t.teamId}/players`)
        const list = unwrapList<any>(raw)
        return list.map((p: any) => ({
          ...p,
          __teamId: t.teamId,
          __teamName: t.name,
        }))
      } catch {
        return []
      }
    },
    8
  )

  return chunks.flat()
}

const { data: rosterData, pending: rosterPending, error: rosterErr, refresh: refreshRoster } = useAsyncData(
  () => `players-roster:${teamsVm.value.length}`,
  async () => {
    return dedupeById(await fetchRosterFromTeams())
  },
  { watch: [teamsVm] }
)

/** =========================
 *  MAP TO VIEWMODEL (roster + stats join por playerId)
 *  ========================= */
const playersVm = computed<PlayerVM[]>(() => {
  const roster = unwrapList<any>(rosterData.value)
  const statsMap = statsByPlayerId.value

  const mappedFromRoster = roster
    .map((x: any) => {
      const id = Number(x.playerId ?? x.player_id ?? x.id)
      if (!Number.isFinite(id)) return null

      const fullName =
        String(
          x.fullName ??
            x.full_name ??
            x.name ??
            [x.firstName ?? x.first_name, x.lastName ?? x.last_name].filter(Boolean).join(' ')
        ).trim() || 'Jugador'

      const number = x.number ?? x.jerseyNumber ?? x.jersey_number ?? x.num ?? null

      const teamIdRaw = x.__teamId ?? x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? null
      const teamId = teamIdRaw == null ? null : Number(teamIdRaw) || null

      const t = teamId ? teamById.value.get(teamId) : undefined
      const teamName = String(x.__teamName ?? x.teamName ?? x.team_name ?? x.team?.name ?? t?.name ?? '').trim() || undefined

      const gender = x.gender ?? t?.gender ?? ''
      const categoryCode = x.categoryCode ?? x.category_code ?? t?.code ?? ''

      const s = statsMap.get(id) ?? { td: 0, pa: 0, int: 0, sack: 0, rec: 0 }

      return {
        id,
        fullName,
        number: number == null ? null : toNum(number),
        photoUrl: x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null,
        teamId,
        teamName,
        gender: gender ? upper(gender) : '',
        categoryCode: categoryCode ? String(categoryCode) : '',
        stats: { ...s },
      } satisfies PlayerVM
    })
    .filter(Boolean) as PlayerVM[]

  // Si algún día stats trae jugadores que no estén en roster:
  const idsInRoster = new Set(mappedFromRoster.map((p) => p.id))
  for (const [pid, s] of statsMap.entries()) {
    if (idsInRoster.has(pid)) continue
    mappedFromRoster.push({
      id: pid,
      fullName: `Jugador ${pid}`,
      number: null,
      photoUrl: null,
      teamId: null,
      teamName: undefined,
      gender: '',
      categoryCode: '',
      stats: { ...s },
    })
  }

  return mappedFromRoster
})

/** =========================
 *  FILTERS
 *  ========================= */
const teamPick = ref<'ALL' | string>('ALL')
const numberPick = ref('')
const namePick = ref('')

watch([teamPick, numberPick, namePick], () => {
  page.value = 1
})

const filteredPlayers = computed(() => {
  const tPick = teamPick.value
  const qNum = numberPick.value.trim()
  const qName = namePick.value.toLowerCase().trim()

  return playersVm.value.filter((p) => {
    if (tPick !== 'ALL') {
      const id = Number(tPick)
      if (Number.isFinite(id) && p.teamId !== id) return false
    }

    if (qNum) {
      const n = String(p.number ?? '')
      if (!n.includes(qNum)) return false
    }

    if (qName) {
      const fn = String(p.fullName ?? '').toLowerCase()
      if (!fn.includes(qName)) return false
    }

    return true
  })
})

/** =========================
 *  SORT + PAGINATION
 *  ========================= */
function impact(p: PlayerVM) {
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

const sortedPlayersAll = computed(() => filteredPlayers.value.slice().sort((a, b) => impact(b) - impact(a)))

const perPage = 10
const page = ref(1)

const pageCount = computed(() => {
  const total = sortedPlayersAll.value.length
  return Math.max(1, Math.ceil(total / perPage))
})

const pagedPlayers = computed(() => {
  const start = (page.value - 1) * perPage
  return sortedPlayersAll.value.slice(start, start + perPage)
})

const rangeStart = computed(() => {
  const total = sortedPlayersAll.value.length
  if (!total) return 0
  return (page.value - 1) * perPage + 1
})

const rangeEnd = computed(() => {
  const total = sortedPlayersAll.value.length
  if (!total) return 0
  return Math.min(total, (page.value - 1) * perPage + pagedPlayers.value.length)
})

function clearFilters() {
  teamPick.value = 'ALL'
  numberPick.value = ''
  namePick.value = ''
}

/** =========================
 *  LEADERS
 *  ========================= */
function topBy(fn: (p: PlayerVM) => number, n = 7): PlayerVM[] {
  return filteredPlayers.value.slice().sort((a, b) => fn(b) - fn(a)).slice(0, n)
}

const leadersINT = computed(() => topBy((p) => p.stats.int, 7))
const leadersTD = computed(() => topBy((p) => p.stats.td, 7))
const leadersPA = computed(() => topBy((p) => p.stats.pa, 7))
const leadersSACK = computed(() => topBy((p) => p.stats.sack, 7))

const seasonLabel = computed(() => {
  const sid = seasonId.value ? `Season ${seasonId.value}` : 'Temporada actual'
  return `Liga ${leagueId.value} · ${sid}`
})

const pendingAny = computed(() => !!teamsPending.value || !!rosterPending.value || !!statsPending.value)
const errorAny = computed(() => !!teamsErr.value || !!rosterErr.value || !!statsErr.value)

async function refreshAll() {
  await Promise.all([refreshTeams(), refreshRoster(), refreshStats()])
}

/** =========================
 *  POSTER PANEL (responsive)
 *  ========================= */
type Accent = 'fuchsia' | 'violet' | 'sky' | 'emerald'
type AccentStyle = { ring: string; bg: string; text: string; chip: string }

const PosterPanel = defineComponent({
  name: 'PosterPanel',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    accent: { type: String as () => Accent, required: true },
    rows: { type: Array as () => PlayerVM[], required: true },
    valueLabel: { type: String, required: true },
    valueFn: { type: Function as unknown as () => (p: PlayerVM) => number, required: true },
  },
  setup(props) {
    const accentMap: Record<Accent, AccentStyle> = {
      fuchsia: {
        ring: 'border-fuchsia-400/25',
        bg: 'from-fuchsia-600/20 via-fuchsia-600/5 to-transparent',
        text: 'text-fuchsia-100',
        chip: 'border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100',
      },
      violet: {
        ring: 'border-violet-400/25',
        bg: 'from-violet-600/20 via-violet-600/5 to-transparent',
        text: 'text-violet-100',
        chip: 'border-violet-400/20 bg-violet-500/10 text-violet-100',
      },
      sky: {
        ring: 'border-sky-400/25',
        bg: 'from-sky-600/20 via-sky-600/5 to-transparent',
        text: 'text-sky-100',
        chip: 'border-sky-400/20 bg-sky-500/10 text-sky-100',
      },
      emerald: {
        ring: 'border-emerald-400/25',
        bg: 'from-emerald-600/20 via-emerald-600/5 to-transparent',
        text: 'text-emerald-100',
        chip: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
      },
    } as const

    const a = computed<AccentStyle>(() => accentMap[props.accent] ?? accentMap.fuchsia)

    return () =>
      h(
        'section',
        {
          class: `relative overflow-hidden rounded-3xl border ${a.value.ring} bg-white/5 shadow-[0_20px_55px_rgba(0,0,0,0.45)]`,
        },
        [
          h('div', { class: `absolute inset-0 bg-gradient-to-br ${a.value.bg} opacity-70` }),
          h('div', { class: 'relative p-4 md:p-5' }, [
            h('div', { class: 'flex items-start justify-between gap-3' }, [
              h('div', {}, [
                h('p', { class: 'text-[10px] uppercase tracking-[0.26em] text-slate-400' }, props.subtitle),
                h('h3', { class: `mt-1 font-display text-lg font-extrabold ${a.value.text}` }, props.title),
              ]),
              h(
                'span',
                {
                  class: `inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${a.value.chip}`,
                },
                props.valueLabel
              ),
            ]),

            h('div', { class: 'mt-3 rounded-2xl border border-white/10 bg-[#070b1d]/90 overflow-hidden' }, [
              // header desktop
              h(
                'div',
                {
                  class:
                    'hidden sm:grid grid-cols-12 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-400 border-b border-white/10',
                },
                [
                  h('div', { class: 'col-span-1' }, 'Rk'),
                  h('div', { class: 'col-span-7' }, 'Jugador'),
                  h('div', { class: 'col-span-3' }, 'Equipo'),
                  h('div', { class: 'col-span-1 text-right' }, props.valueLabel),
                ]
              ),

              props.rows.length
                ? props.rows.map((p, idx) =>
                    h('div', { class: 'border-b border-white/5 last:border-0' }, [
                      // mobile row
                      h('div', { class: 'sm:hidden px-3 py-3' }, [
                        h('div', { class: 'flex items-start justify-between gap-3' }, [
                          h('div', { class: 'min-w-0' }, [
                            h('p', { class: 'text-[10px] uppercase tracking-[0.22em] text-slate-500' }, `#${idx + 1}`),
                            h('p', { class: 'mt-0.5 font-semibold text-white truncate' }, [
                              p.fullName,
                              p.number != null
                                ? h('span', { class: 'ml-2 text-slate-400 font-semibold' }, `#${p.number}`)
                                : null,
                            ]),
                            h('p', { class: 'mt-0.5 text-xs text-slate-300 truncate' }, p.teamName || '—'),
                          ]),
                          h(
                            'div',
                            { class: `shrink-0 text-right font-extrabold ${a.value.text} tabular-nums text-lg` },
                            String(props.valueFn(p))
                          ),
                        ]),
                      ]),

                      // desktop row
                      h(
                        'div',
                        {
                          class:
                            'hidden sm:grid grid-cols-12 px-3 py-2 text-sm hover:bg-white/5',
                        },
                        [
                          h('div', { class: 'col-span-1 font-semibold text-slate-200 tabular-nums' }, String(idx + 1)),
                          h('div', { class: 'col-span-7 min-w-0' }, [
                            h('p', { class: 'font-semibold text-white truncate' }, [
                              p.fullName,
                              p.number != null
                                ? h('span', { class: 'ml-2 text-slate-400 font-semibold' }, `#${p.number}`)
                                : null,
                            ]),
                          ]),
                          h('div', { class: 'col-span-3 text-slate-200 truncate' }, p.teamName || '—'),
                          h(
                            'div',
                            { class: `col-span-1 text-right font-extrabold ${a.value.text} tabular-nums` },
                            String(props.valueFn(p))
                          ),
                        ]
                      ),
                    ])
                  )
                : h('div', { class: 'px-3 py-4 text-sm text-slate-400' }, 'Sin datos para este panel (aún).'),
            ]),
          ]),
        ]
      )
  },
})
</script>
