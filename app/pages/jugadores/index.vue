<!-- app/pages/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <!-- HERO / CABECERA “ESTADÍSTICAS” -->
    <section class="relative pt-24 md:pt-28 lg:pt-32">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl"
        ></div>
        <div class="absolute top-20 -left-24 h-[420px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 h-[460px] w-[560px] rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,.10),transparent_45%)]"
        ></div>
        <div
          class="absolute inset-0 opacity-25 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_72px)]"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6">
        <!-- ✅ Tabs internos (Estadísticas / Jugadores) -->
        <StatsTabs class="mb-6" />

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

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <!-- ✅ Quitamos el botón “Ver estadísticas (equipos)”
                 porque ahora se navega con los tabs de arriba -->
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
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400"> Equipo </label>
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
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400"> Número </label>
              <input
                v-model.trim="numberPick"
                inputmode="numeric"
                placeholder="Ej. 7"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Nombre -->
            <div class="md:col-span-4">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400"> Nombre del jugador </label>
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

              <span
                class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
              >
                Endpoint players:
                <code class="ml-1 text-slate-300">{{ API_PLAYERS }}</code>
              </span>
            </div>
          </div>
        </section>

        <!-- ESTADOS (LOADING/ERROR) -->
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

        <!-- CONTENIDO PRINCIPAL -->
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

          <!-- RANKING / LISTA -->
          <section class="lg:col-span-7 space-y-4">
            <div
              class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
            >
              <!-- HEADER -->
              <div class="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">ranking</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Jugadores</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Ordenado por <span class="text-slate-200 font-semibold">Impacto</span> (TD + INT + PA + SACK).
                    Paginado de <span class="text-slate-200 font-semibold">10 en 10</span>.
                  </p>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3">
                  <div class="text-[11px] text-slate-400">
                    Mostrando
                    <span class="text-slate-200 font-semibold">{{ rangeLabel }}</span>
                    de
                    <span class="text-slate-200 font-semibold">{{ sortedPlayers.length }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                      :disabled="page <= 1"
                      @click="page = Math.max(1, page - 1)"
                    >
                      ←
                    </button>

                    <span
                      class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
                    >
                      Página {{ page }} / {{ totalPages }}
                    </span>

                    <button
                      class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                      :disabled="page >= totalPages"
                      @click="page = Math.min(totalPages, page + 1)"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              <!-- BODY -->
              <div v-if="pagedPlayers.length === 0" class="px-5 py-6 text-sm text-slate-300">
                No hay jugadores para esos filtros.
              </div>

              <div v-else class="p-4 sm:p-5 space-y-3">
                <article
                  v-for="(p, idx) in pagedPlayers"
                  :key="p.id"
                  class="rounded-3xl border border-white/10 bg-[#050a1a]/70 hover:bg-white/5 transition overflow-hidden"
                >
                  <div class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <!-- izquierda: rank + avatar + info -->
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        class="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center shrink-0"
                      >
                        <span class="text-sm font-extrabold text-slate-200 tabular-nums">
                          {{ pageStartIndex + idx + 1 }}
                        </span>
                      </div>

                      <div
                        class="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0"
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
                        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                          <p class="font-semibold text-white truncate max-w-[420px]">
                            {{ p.fullName }}
                          </p>
                          <span v-if="p.number" class="text-slate-400 font-semibold">#{{ p.number }}</span>

                          <span
                            class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200"
                          >
                            IMP: <span class="ml-1 text-slate-100 tabular-nums">{{ impact(p) }}</span>
                          </span>
                        </div>

                        <p class="mt-0.5 text-[12px] text-slate-200 truncate">
                          {{ p.teamName || '—' }}
                          <span v-if="p.teamMeta" class="text-slate-500"> · {{ p.teamMeta }}</span>
                        </p>

                        <p class="text-[11px] text-slate-500 truncate">
                          {{ p.gender || '—' }}<span v-if="p.categoryCode"> · {{ p.categoryCode }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- derecha: métricas -->
                    <div class="w-full md:w-auto">
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div class="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2">
                          <p class="text-[10px] uppercase tracking-[0.22em] text-slate-300">INT</p>
                          <p class="mt-0.5 text-lg font-extrabold text-fuchsia-100 tabular-nums">
                            {{ p.stats.int }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-2">
                          <p class="text-[10px] uppercase tracking-[0.22em] text-slate-300">TD</p>
                          <p class="mt-0.5 text-lg font-extrabold text-violet-100 tabular-nums">
                            {{ p.stats.td }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-3 py-2">
                          <p class="text-[10px] uppercase tracking-[0.22em] text-slate-300">PA</p>
                          <p class="mt-0.5 text-lg font-extrabold text-sky-100 tabular-nums">
                            {{ p.stats.pa }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
                          <p class="text-[10px] uppercase tracking-[0.22em] text-slate-300">SACK</p>
                          <p class="mt-0.5 text-lg font-extrabold text-emerald-100 tabular-nums">
                            {{ p.stats.sack }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <!-- FOOTER PAGINACIÓN -->
              <div class="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div class="text-[11px] text-slate-400">
                  Total: <span class="text-slate-200 font-semibold">{{ sortedPlayers.length }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page <= 1"
                    @click="page = Math.max(1, page - 1)"
                  >
                    ← Anterior
                  </button>

                  <button
                    class="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                    :disabled="page >= totalPages"
                    @click="page = Math.min(totalPages, page + 1)"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-slate-300">
              Nota: si tu backend aún no manda stats por jugador, esta pantalla igual funciona con 0’s.
              Cuando tengas el endpoint real de stats, solo mapeamos campos y listo.
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
import StatsTabs from '@/components/StatsTabs.vue'

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
 *  FETCH TEAMS
 *  ========================= */
const {
  data: teamsData,
  pending: teamsPending,
  error: teamsErr,
  refresh: refreshTeams,
} = useAsyncData('players-teams', async () => {
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

const teamByNameLower = computed(() => {
  const m = new Map<string, TeamVM>()
  for (const t of teamsVm.value) {
    m.set(String(t.name).toLowerCase(), t)
    if (t.shortName) m.set(String(t.shortName).toLowerCase(), t)
  }
  return m
})

/** =========================
 *  PLAYERS FALLBACK (IMPORTANT)
 *  ========================= */
async function fetchPlayersFallbackFromTeams(): Promise<any[]> {
  const teams = teamsVm.value
  if (!teams.length) return []

  const chunks = await Promise.all(
    teams.map(async (t) => {
      try {
        const raw = await $fetch<any>(`${API_TEAMS}/${t.teamId}/players`)
        const list = unwrapList<any>(raw)
        return list.map((p) => ({
          ...p,
          __teamId: t.teamId,
          __teamName: t.name,
          __teamMeta: [t.categoryName, upper(t.gender), t.code].filter(Boolean).join(' · '),
          __teamCode: t.code,
          __teamGender: t.gender,
        }))
      } catch {
        return []
      }
    })
  )

  return chunks.flat()
}

/** =========================
 *  FETCH PLAYERS
 *  ========================= */
const {
  data: playersData,
  pending: playersPending,
  error: playersErr,
  refresh: refreshPlayers,
} = useAsyncData(
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

      let teamId =
        Number(x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? x.__teamId ?? x.team_fk ?? x.teamFk ?? 0) ||
        null

      let teamName = String(x.teamName ?? x.team_name ?? x.team?.name ?? x.__teamName ?? '').trim() || ''

      if (!teamId && teamName) {
        const tGuess = teamByNameLower.value.get(teamName.toLowerCase())
        if (tGuess) teamId = tGuess.teamId
      }

      const t = teamId ? teamById.value.get(teamId) : undefined
      if (!teamName && t?.name) teamName = t.name

      const gender = x.gender ?? x.team?.gender ?? x.__teamGender ?? t?.gender ?? ''
      const categoryCode = x.categoryCode ?? x.category_code ?? x.team?.code ?? x.__teamCode ?? t?.code ?? ''

      const td = toNum(x.td ?? x.tds ?? x.touchdowns ?? x.stats?.td ?? x.stats?.tds)
      const it = toNum(x.int ?? x.interceptions ?? x.stats?.int ?? x.stats?.interceptions)
      const pa = toNum(x.pa ?? x.passingTd ?? x.passing_td ?? x.stats?.pa ?? x.stats?.passingTd)
      const sack = toNum(x.sack ?? x.sacks ?? x.stats?.sack ?? x.stats?.sacks)
      const rec = toNum(x.rec ?? x.receptions ?? x.stats?.rec ?? x.stats?.receptions)

      const teamMeta =
        String(x.__teamMeta ?? '').trim() ||
        (t ? [t.categoryName, upper(t.gender), t.code].filter(Boolean).join(' · ') : '')

      return {
        id,
        fullName,
        number: number == null ? null : toNum(number),
        photoUrl: x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null,
        teamId,
        teamName: teamName || undefined,
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

function impact(p: PlayerVM) {
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

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
 *  PAGINATION (10 por página)
 *  ========================= */
const pageSize = 10
const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(sortedPlayers.value.length / pageSize)))

watch([teamPick, numberPick, namePick], () => {
  page.value = 1
})

watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pageStartIndex = computed(() => (page.value - 1) * pageSize)
const pageEndIndex = computed(() => Math.min(sortedPlayers.value.length, pageStartIndex.value + pageSize))

const pagedPlayers = computed(() => sortedPlayers.value.slice(pageStartIndex.value, pageEndIndex.value))

const rangeLabel = computed(() => {
  const total = sortedPlayers.value.length
  if (!total) return '0 - 0'
  return `${pageStartIndex.value + 1} - ${pageEndIndex.value}`
})

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

const seasonLabel = computed(() => 'Temporada actual')

const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

async function refreshAll() {
  try {
    await refreshTeams()
  } catch {}
  try {
    await refreshPlayers()
  } catch {}
}

/** =========================
 *  POSTER PANEL (TS safe)
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
                { class: `inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${a.value.chip}` },
                props.valueLabel
              ),
            ]),

            h('div', { class: 'mt-3 rounded-2xl border border-white/10 bg-[#070b1d]/90 overflow-hidden' }, [
              h(
                'div',
                {
                  class:
                    'grid grid-cols-12 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-400 border-b border-white/10',
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
                    h(
                      'div',
                      {
                        class:
                          'grid grid-cols-12 px-3 py-2 text-sm border-b border-white/5 last:border-0 hover:bg-white/5',
                      },
                      [
                        h('div', { class: 'col-span-1 font-semibold text-slate-200 tabular-nums' }, String(idx + 1)),
                        h('div', { class: 'col-span-7 min-w-0' }, [
                          h('p', { class: 'font-semibold text-white truncate' }, [
                            p.fullName,
                            p.number ? h('span', { class: 'ml-2 text-slate-400 font-semibold' }, `#${p.number}`) : null,
                          ]),
                          h(
                            'p',
                            { class: 'text-[11px] text-slate-400 truncate' },
                            (p.gender || '—') + (p.categoryCode ? ` · ${p.categoryCode}` : '')
                          ),
                        ]),
                        h('div', { class: 'col-span-3 text-slate-200 truncate' }, p.teamName || '—'),
                        h(
                          'div',
                          { class: `col-span-1 text-right font-extrabold ${a.value.text} tabular-nums` },
                          String(props.valueFn(p))
                        ),
                      ]
                    )
                  )
                : h('div', { class: 'px-3 py-4 text-sm text-slate-400' }, 'Sin datos para este panel (aún).'),
            ]),
          ]),
        ]
      )
  },
})
</script>
