<!-- app/pages/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <!-- HERO / CABECERA “ESTADÍSTICAS” -->
    <section class="relative pt-24 md:pt-28 lg:pt-32">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl"></div>
        <div class="absolute top-20 -left-24 h-[420px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 h-[460px] w-[560px] rounded-full bg-emerald-500/10 blur-3xl"></div>

        <!-- líneas tipo “poster” -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,.10),transparent_45%)]"></div>
        <div class="absolute inset-0 opacity-25 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_72px)]"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6">
        <header class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
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
              <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                Live data (backend)
              </span>
              <span class="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-100">
                Rankings
              </span>
              <span class="inline-flex items-center rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold text-fuchsia-100">
                Líderes
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/estadisticas"
              class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Ver estadísticas (equipos)
            </NuxtLink>
          </div>
        </header>

        <!-- FILTROS -->
        <section
          class="mt-7 rounded-3xl border border-white/10 bg-[#070b1d]/85 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
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

          <div class="p-5 grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Equipo -->
            <div class="md:col-span-5">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Equipo
              </label>
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
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Número
              </label>
              <input
                v-model.trim="numberPick"
                inputmode="numeric"
                placeholder="Ej. 7"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Nombre -->
            <div class="md:col-span-4">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Nombre del jugador
              </label>
              <input
                v-model.trim="namePick"
                placeholder="Escribe para buscar…"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- meta -->
            <div class="md:col-span-12 flex flex-wrap items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-400">
                Mostrando
                <span class="text-slate-200 font-semibold">{{ filteredPlayers.length }}</span>
                jugador(es)
              </p>

              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  Endpoint players: <code class="ml-1 text-slate-300">{{ API_PLAYERS }}</code>
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ESTADOS (LOADING/ERROR) -->
        <div v-if="pendingAny" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          Cargando jugadores…
        </div>

        <div v-else-if="errorAny" class="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-100">
          Error cargando datos. Revisa que el backend esté disponible.
        </div>

        <!-- CONTENIDO PRINCIPAL -->
        <div v-else class="mt-6 grid lg:grid-cols-12 gap-6">
          <!-- LÍDERES (POSTER PANELS) -->
          <section class="lg:col-span-5 space-y-4">
            <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 p-4 md:p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">leaders</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Top por categoría</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Tablas estilo “poster” (tipo la imagen). Aquí es donde se siente full estadística.
                  </p>
                </div>

                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
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

          <!-- LISTA / RANKING GENERAL -->
          <section class="lg:col-span-7 space-y-4">
            <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
              <div class="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">ranking</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Tabla de jugadores</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Ordenada por <span class="text-slate-200 font-semibold">Impacto</span> (TD + INT + PA + SACK).
                    Puedes ajustar después si quieres.
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <span class="hidden sm:inline text-[11px] text-slate-400">Total:</span>
                  <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                    {{ filteredPlayers.length }}
                  </span>
                </div>
              </div>

              <!-- HEADER TABLE -->
              <div class="grid grid-cols-12 gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-slate-400 border-b border-white/10">
                <div class="col-span-1">Rk</div>
                <div class="col-span-5">Jugador</div>
                <div class="col-span-3">Equipo</div>
                <div class="col-span-1 text-right">TD</div>
                <div class="col-span-1 text-right">INT</div>
                <div class="col-span-1 text-right">IMP</div>
              </div>

              <!-- BODY -->
              <div v-if="sortedPlayers.length === 0" class="px-5 py-6 text-sm text-slate-300">
                No hay jugadores para esos filtros.
              </div>

              <div v-else class="divide-y divide-white/5">
                <div
                  v-for="(p, idx) in sortedPlayers"
                  :key="p.id"
                  class="px-5 py-3 hover:bg-white/5 transition"
                >
                  <div class="grid grid-cols-12 gap-2 items-center">
                    <!-- rk -->
                    <div class="col-span-1 font-semibold text-slate-200 tabular-nums">
                      {{ idx + 1 }}
                    </div>

                    <!-- jugador -->
                    <div class="col-span-5 min-w-0">
                      <div class="flex items-center gap-3 min-w-0">
                        <div
                          class="h-10 w-10 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0"
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

                        <div class="min-w-0">
                          <p class="font-semibold text-white truncate">
                            {{ p.fullName }}
                            <span v-if="p.number" class="ml-2 text-slate-400 font-semibold">#{{ p.number }}</span>
                          </p>
                          <p class="text-[11px] text-slate-400 truncate">
                            {{ p.gender || '—' }}<span v-if="p.categoryCode"> · {{ p.categoryCode }}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- equipo -->
                    <div class="col-span-3 min-w-0">
                      <p class="text-sm text-slate-200 truncate">{{ p.teamName || '—' }}</p>
                      <p class="text-[11px] text-slate-500 truncate">
                        {{ p.teamMeta || '' }}
                      </p>
                    </div>

                    <!-- TD -->
                    <div class="col-span-1 text-right font-extrabold text-violet-100 tabular-nums">
                      {{ p.stats.td }}
                    </div>

                    <!-- INT -->
                    <div class="col-span-1 text-right font-extrabold text-fuchsia-100 tabular-nums">
                      {{ p.stats.int }}
                    </div>

                    <!-- IMP -->
                    <div class="col-span-1 text-right font-extrabold text-blue-100 tabular-nums">
                      {{ impact(p) }}
                    </div>
                  </div>

                  <!-- mini chips -->
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">
                      PA: <span class="ml-1 text-slate-100">{{ p.stats.pa }}</span>
                    </span>
                    <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">
                      SACK: <span class="ml-1 text-slate-100">{{ p.stats.sack }}</span>
                    </span>
                    <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">
                      REC: <span class="ml-1 text-slate-100">{{ p.stats.rec }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-slate-300">
              Nota: si tu backend aún no manda stats por jugador, esta pantalla igual funciona con 0’s (y el diseño ya queda listo).
              Cuando tengas el endpoint real de stats, solo mapeamos campos y listo.
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import { useRuntimeConfig } from '#imports'

/** =========================
 *  API CONFIG
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const API_TEAMS = `${API_BASE}/teams`
const API_PLAYERS = `${API_BASE}/players` // si no existe, usamos fallback /teams/{id}/players

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

/** =========================
 *  TYPES
 *  ========================= */
type TeamVM = {
  teamId: number
  name: string
  shortName?: string
  logoUrl?: string | null
  categoryId?: number
  categoryName?: string
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
  teamMeta?: string
  gender?: string
  categoryCode?: string
  stats: PlayerStats
}

/** =========================
 *  FETCH
 *  ========================= */
const { data: teamsData, pending: teamsPending, error: teamsErr } = useAsyncData('players-teams', async () => {
  try {
    const raw = await $fetch<any>(API_TEAMS)
    return unwrapList<any>(raw)
  } catch {
    return []
  }
})

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
      shortName: x.shortName ?? x.short_name ?? '',
      logoUrl: x.logoUrl ?? x.logo_url ?? x.photoUrl ?? x.photo_url ?? null,
      categoryId: Number(x.categoryId ?? x.category_id ?? x.category?.id ?? 0) || undefined,
      categoryName: x.categoryName ?? x.category_name ?? x.category?.name ?? '',
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

async function fetchPlayersFallbackFromTeams(): Promise<any[]> {
  const teams = teamsVm.value
  if (!teams.length) return []
  const chunks = await Promise.all(
    teams.map(async (t) => {
      try {
        const raw = await $fetch<any>(`${API_TEAMS}/${t.teamId}/players`)
        return unwrapList<any>(raw)
      } catch {
        return []
      }
    })
  )
  return chunks.flat()
}

const { data: playersData, pending: playersPending, error: playersErr, refresh: refreshPlayers } = useAsyncData(
  'players-all',
  async () => {
    // 1) intenta /players
    try {
      const raw = await $fetch<any>(API_PLAYERS)
      const list = unwrapList<any>(raw)
      if (list.length) return list
    } catch {
      // ignore
    }

    // 2) fallback por teams
    return await fetchPlayersFallbackFromTeams()
  },
  { watch: [teamsVm] }
)

const playersVm = computed<PlayerVM[]>(() => {
  const list = unwrapList<any>(playersData.value)
  return list
    .map((x) => {
      const id = Number(x.playerId ?? x.player_id ?? x.id)
      const fullName =
        String(
          x.fullName ??
            x.full_name ??
            x.name ??
            [x.firstName ?? x.first_name, x.lastName ?? x.last_name].filter(Boolean).join(' ')
        ).trim() || 'Jugador'

      const number = (x.number ?? x.jerseyNumber ?? x.jersey_number ?? x.num ?? null) as any
      const teamId = Number(x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? 0) || null

      const t = teamId ? teamById.value.get(teamId) : undefined
      const teamName = String(x.teamName ?? x.team_name ?? x.team?.name ?? t?.name ?? '') || undefined

      const gender = x.gender ?? x.team?.gender ?? t?.gender ?? ''
      const categoryCode = x.categoryCode ?? x.category_code ?? x.team?.code ?? t?.code ?? ''

      // Stats: mapea lo que exista; si no existe -> 0
      const td = toNum(x.td ?? x.tds ?? x.touchdowns ?? x.stats?.td ?? x.stats?.tds)
      const it = toNum(x.int ?? x.interceptions ?? x.stats?.int ?? x.stats?.interceptions)
      const pa = toNum(x.pa ?? x.passingTd ?? x.passing_td ?? x.stats?.pa ?? x.stats?.passingTd)
      const sack = toNum(x.sack ?? x.sacks ?? x.stats?.sack ?? x.stats?.sacks)
      const rec = toNum(x.rec ?? x.receptions ?? x.stats?.rec ?? x.stats?.receptions)

      const teamMeta = t
        ? [t.categoryName, upper(t.gender), t.code].filter(Boolean).join(' · ')
        : ''

      return {
        id,
        fullName,
        number: number == null ? null : toNum(number),
        photoUrl: x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null,
        teamId,
        teamName,
        teamMeta,
        gender: gender ? upper(gender) : '',
        categoryCode: categoryCode ? String(categoryCode) : '',
        stats: { td, int: it, pa, sack, rec },
      } satisfies PlayerVM
    })
    .filter((p) => Number.isFinite(p.id))
})

/** =========================
 *  FILTERS
 *  ========================= */
const teamPick = ref<'ALL' | string>('ALL')
const numberPick = ref('')
const namePick = ref('')

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

const sortedPlayers = computed(() => {
  const rows = filteredPlayers.value.slice()
  return rows.sort((a, b) => impact(b) - impact(a))
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
  return filteredPlayers.value
    .slice()
    .sort((a, b) => fn(b) - fn(a))
    .slice(0, n)
}

const leadersINT = computed(() => topBy((p) => p.stats.int, 7))
const leadersTD = computed(() => topBy((p) => p.stats.td, 7))
const leadersPA = computed(() => topBy((p) => p.stats.pa, 7))
const leadersSACK = computed(() => topBy((p) => p.stats.sack, 7))

function impact(p: PlayerVM) {
  // “Impacto” simple para ranking general
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

const seasonLabel = computed(() => {
  // sin seasonId (como pediste). Solo label UI.
  return 'Temporada actual'
})

const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

async function refreshAll() {
  await refreshPlayers()
}

/** =========================
 *  POSTER PANEL (FIX TS: a NO undefined)
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

    // ✅ NO undefined (y con fallback extra por seguridad)
    const a = computed<AccentStyle>(() => accentMap[props.accent] ?? accentMap.fuchsia)

    return () =>
      h(
        'section',
        {
          class:
            `relative overflow-hidden rounded-3xl border ${a.value.ring} bg-white/5 shadow-[0_20px_55px_rgba(0,0,0,0.45)]`,
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
                { class: `inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${a.value.chip}` },
                props.valueLabel
              ),
            ]),

            h(
              'div',
              { class: 'mt-3 rounded-2xl border border-white/10 bg-[#070b1d]/90 overflow-hidden' },
              [
                h('div', { class: 'grid grid-cols-12 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-400 border-b border-white/10' }, [
                  h('div', { class: 'col-span-1' }, 'Rk'),
                  h('div', { class: 'col-span-7' }, 'Jugador'),
                  h('div', { class: 'col-span-3' }, 'Equipo'),
                  h('div', { class: 'col-span-1 text-right' }, props.valueLabel),
                ]),

                props.rows.length
                  ? props.rows.map((p, idx) =>
                      h('div', { class: 'grid grid-cols-12 px-3 py-2 text-sm border-b border-white/5 last:border-0 hover:bg-white/5' }, [
                        h('div', { class: 'col-span-1 font-semibold text-slate-200 tabular-nums' }, String(idx + 1)),
                        h('div', { class: 'col-span-7 min-w-0' }, [
                          h('p', { class: 'font-semibold text-white truncate' }, [
                            p.fullName,
                            p.number ? h('span', { class: 'ml-2 text-slate-400 font-semibold' }, `#${p.number}`) : null,
                          ]),
                          h('p', { class: 'text-[11px] text-slate-400 truncate' }, [
                            (p.gender || '—') + (p.categoryCode ? ` · ${p.categoryCode}` : ''),
                          ]),
                        ]),
                        h('div', { class: 'col-span-3 text-slate-200 truncate' }, p.teamName || '—'),
                        h('div', { class: `col-span-1 text-right font-extrabold ${a.value.text} tabular-nums` }, String(props.valueFn(p))),
                      ])
                    )
                  : h('div', { class: 'px-3 py-4 text-sm text-slate-400' }, 'Sin datos para este panel (aún).'),
              ]
            ),
          ]),
        ]
      )
  },
})
</script>
