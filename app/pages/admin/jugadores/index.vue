<!-- app/pages/admin/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-50 selection:bg-cyan-300/30 selection:text-cyan-100">
    <!-- Fondo -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl"></div>
      <div class="absolute top-24 -left-24 h-[420px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 h-[460px] w-[560px] rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,.10),transparent_45%)]"></div>
      <div class="absolute inset-0 opacity-20 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_72px)]"></div>
    </div>

    <!-- HERO -->
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Tochero5 · Consola Admin
            </p>
            <h1 class="mt-2 font-display text-3xl md:text-4xl font-extrabold text-white">
              Jugadores (Admin)
            </h1>
            <p class="mt-2 text-sm text-slate-300 max-w-2xl">
              Directorio global para revisar jugadores, filtrar y ver stats básicas.
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                Protegido (middleware admin)
              </span>
              <span class="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                Lectura
              </span>
              <span class="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-100">
                Filtros
              </span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/jugadores"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition text-center"
            >
              Ver versión pública →
            </NuxtLink>
          </div>
        </header>

        <!-- FILTROS -->
        <section class="mt-6 rounded-3xl border border-white/10 bg-[#070b1d]/85 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden">
          <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 class="font-semibold text-white">Filtros</h2>
              <p class="text-xs text-slate-400">Nombre, equipo, número y categoría.</p>
            </div>

            <button
              type="button"
              class="self-start sm:self-auto text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
              @click="clearFilters"
            >
              Limpiar
            </button>
          </div>

          <div class="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Equipo -->
            <div class="md:col-span-4">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Equipo</label>
              <select
                v-model="teamPick"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="ALL">Todos</option>
                <option v-for="t in teams" :key="t.teamId" :value="String(t.teamId)">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <!-- Número -->
            <div class="md:col-span-2">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Número</label>
              <input
                v-model.trim="numberPick"
                inputmode="numeric"
                placeholder="Ej. 7"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Categoría -->
            <div class="md:col-span-3">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Categoría</label>
              <input
                v-model.trim="catPick"
                placeholder="Ej. U12 / Libre"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Nombre -->
            <div class="md:col-span-3">
              <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Nombre</label>
              <input
                v-model.trim="namePick"
                placeholder="Escribe para buscar…"
                class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div class="md:col-span-12 flex items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-400">
                Mostrando <span class="text-slate-200 font-semibold">{{ filtered.length }}</span> jugador(es)
              </p>

              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400">Orden:</span>
                <select
                  v-model="sortPick"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="impact">Impacto</option>
                  <option value="name">Nombre</option>
                  <option value="team">Equipo</option>
                  <option value="number">Número</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- ESTADOS -->
        <div v-if="pendingAny" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          Cargando jugadores…
        </div>

        <div v-else-if="errorAny" class="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-100">
          Error cargando datos. Revisa que el backend esté disponible.
          <div v-if="lastError" class="mt-2 text-[12px] text-rose-100/80 break-words">
            {{ lastError }}
          </div>
        </div>

        <!-- TABLA -->
        <div v-else class="mt-6 grid lg:grid-cols-12 gap-6">
          <!-- LISTA -->
          <section class="lg:col-span-8 rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
            <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">directorio</p>
                <h2 class="mt-1 font-display text-xl font-extrabold text-white">Jugadores</h2>
                <p class="mt-1 text-xs text-slate-400">
                  Click en “Ver” para abrir detalle.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  Total: {{ sorted.length }}
                </span>
              </div>
            </div>

            <!-- Paginación top -->
            <div class="px-4 sm:px-5 py-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p class="text-[11px] text-slate-400">
                Mostrando
                <span class="text-slate-200 font-semibold">{{ rangeStart }}</span>
                -
                <span class="text-slate-200 font-semibold">{{ rangeEnd }}</span>
                de
                <span class="text-slate-200 font-semibold">{{ sorted.length }}</span>
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                  :disabled="page <= 1"
                  @click="page = Math.max(1, page - 1)"
                >
                  ←
                </button>
                <span class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
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

            <div class="overflow-x-auto">
              <table class="min-w-[920px] w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-400 border-b border-white/10">
                    <th class="px-4 py-3">Jugador</th>
                    <th class="px-4 py-3">Equipo</th>
                    <th class="px-4 py-3">#</th>
                    <th class="px-4 py-3">Categoría</th>
                    <th class="px-4 py-3">TD</th>
                    <th class="px-4 py-3">INT</th>
                    <th class="px-4 py-3">PA</th>
                    <th class="px-4 py-3">SACK</th>
                    <th class="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="p in paged"
                    :key="p.id"
                    class="border-b border-white/5 hover:bg-white/5"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3 min-w-0">
                        <div class="h-10 w-10 rounded-2xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0">
                          <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.fullName" class="h-full w-full object-cover" />
                          <span v-else class="text-[12px] font-extrabold text-slate-200">{{ initials(p.fullName) }}</span>
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-white truncate">{{ p.fullName }}</p>
                          <p class="text-[11px] text-slate-400 truncate">ID: {{ p.id }}</p>
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3 text-slate-200">{{ p.teamName || '—' }}</td>
                    <td class="px-4 py-3 text-slate-200 tabular-nums">{{ p.number ?? '—' }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ p.categoryCode || '—' }}</td>

                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-xl border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-100 tabular-nums">
                        {{ p.stats.td }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-2.5 py-1 text-xs font-semibold text-fuchsia-100 tabular-nums">
                        {{ p.stats.int }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-xl border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-100 tabular-nums">
                        {{ p.stats.pa }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-100 tabular-nums">
                        {{ p.stats.sack }}
                      </span>
                    </td>

                    <td class="px-4 py-3 text-right">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                        @click="select(p)"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>

                  <tr v-if="paged.length === 0">
                    <td colspan="9" class="px-4 py-6 text-sm text-slate-400">
                      No hay jugadores para esos filtros.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- DETALLE -->
          <aside class="lg:col-span-4">
            <div class="sticky top-24 rounded-3xl border border-white/10 bg-[#070b1d]/85 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden">
              <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">detalle</p>
                  <h3 class="mt-1 font-display text-lg font-extrabold text-white">
                    {{ selected ? 'Jugador' : 'Selecciona un jugador' }}
                  </h3>
                </div>

                <button
                  v-if="selected"
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  @click="selected = null"
                >
                  Cerrar
                </button>
              </div>

              <div v-if="!selected" class="p-6 text-center">
                <div class="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5 grid place-items-center text-slate-200">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="currentColor" stroke-width="1.6"/>
                    <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                </div>
                <p class="mt-3 text-sm text-slate-200">Selecciona un jugador</p>
                <p class="mt-1 text-xs text-slate-400">Aquí verás sus datos y stats.</p>
              </div>

              <div v-else class="p-5">
                <div class="flex items-center gap-3">
                  <div class="h-14 w-14 rounded-3xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0">
                    <img v-if="selected.photoUrl" :src="selected.photoUrl" :alt="selected.fullName" class="h-full w-full object-cover" />
                    <span v-else class="text-sm font-extrabold text-slate-200">{{ initials(selected.fullName) }}</span>
                  </div>

                  <div class="min-w-0">
                    <p class="font-extrabold text-white truncate">{{ selected.fullName }}</p>
                    <p class="text-sm text-slate-300 truncate">{{ selected.teamName || 'Sin equipo' }}</p>
                    <p class="text-[11px] text-slate-400">
                      ID: <span class="text-slate-200 font-semibold">{{ selected.id }}</span>
                      <span v-if="selected.number != null"> · #{{ selected.number }}</span>
                      <span v-if="selected.categoryCode"> · {{ selected.categoryCode }}</span>
                    </p>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2">
                  <div class="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-center">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-violet-100/80">TD</p>
                    <p class="mt-0.5 text-xl font-extrabold text-violet-100 tabular-nums">{{ selected.stats.td }}</p>
                  </div>
                  <div class="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-center">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-fuchsia-100/80">INT</p>
                    <p class="mt-0.5 text-xl font-extrabold text-fuchsia-100 tabular-nums">{{ selected.stats.int }}</p>
                  </div>
                  <div class="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-center">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-sky-100/80">PA</p>
                    <p class="mt-0.5 text-xl font-extrabold text-sky-100 tabular-nums">{{ selected.stats.pa }}</p>
                  </div>
                  <div class="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-center">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-emerald-100/80">SACK</p>
                    <p class="mt-0.5 text-xl font-extrabold text-emerald-100 tabular-nums">{{ selected.stats.sack }}</p>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p class="text-[11px] text-slate-400">Impacto</p>
                  <p class="text-sm text-slate-200 font-semibold tabular-nums">
                    {{ impact(selected) }} (TD + INT + PA + SACK)
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div class="h-10"></div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

import { computed, ref, watch } from 'vue'
import { useAsyncData, useRuntimeConfig } from '#imports'

/** =========================
 *  API
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const API_TEAMS = `${API_BASE}/teams`

// Estrategia: players primero, si falla usamos stats/players (como tu pública)
const API_PLAYERS = `${API_BASE}/players`
const API_STATS_PLAYERS = `${API_BASE}/stats/players`

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

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

/** =========================
 *  TYPES
 *  ========================= */
type TeamVM = { teamId: number; name: string }

type PlayerStats = { td: number; int: number; pa: number; sack: number }

type PlayerVM = {
  id: number
  fullName: string
  number?: number | null
  photoUrl?: string | null
  teamId?: number | null
  teamName?: string
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
} = useAsyncData('admin-players-teams', async () => {
  try {
    const raw = await $fetch<any>(API_TEAMS)
    return unwrapList<any>(raw)
  } catch {
    return []
  }
})

const teams = computed<TeamVM[]>(() =>
  unwrapList<any>(teamsData.value)
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
    }))
    .filter((t) => Number.isFinite(t.teamId))
    .sort((a, b) => a.name.localeCompare(b.name))
)

const teamById = computed(() => {
  const m = new Map<number, TeamVM>()
  for (const t of teams.value) m.set(t.teamId, t)
  return m
})

/** =========================
 *  FETCH PLAYERS (fallback)
 *  ========================= */
const lastError = ref<string>('')

async function fetchPlayersSmart(): Promise<any[]> {
  lastError.value = ''
  // 1) /players
  try {
    const raw = await $fetch<any>(API_PLAYERS)
    return unwrapList<any>(raw)
  } catch (e: any) {
    lastError.value = String(e?.message ?? e ?? '')
  }

  // 2) /stats/players (fallback)
  try {
    const raw = await $fetch<any>(API_STATS_PLAYERS)
    return unwrapList<any>(raw)
  } catch (e: any) {
    lastError.value = String(e?.message ?? e ?? '')
    return []
  }
}

const {
  data: playersRaw,
  pending: playersPending,
  error: playersErr,
  refresh: refreshPlayers,
} = useAsyncData('admin-players-list', fetchPlayersSmart)

const players = computed<PlayerVM[]>(() => {
  const list = unwrapList<any>(playersRaw.value)

  return list
    .map((x) => {
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
      const teamIdRaw = x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? null
      const teamId = teamIdRaw == null ? null : Number(teamIdRaw) || null
      const teamName =
        String(x.teamName ?? x.team_name ?? x.team?.name ?? (teamId ? teamById.value.get(teamId)?.name : '') ?? '').trim() ||
        undefined

      // stats: soporta ambos formatos (players o stats/players)
      const td = toNum(x.td ?? x.touchdowns)
      const pa = toNum(x.passTd ?? x.pass_td)
      const it = toNum(x.interceptions ?? x.intercep ?? x.int)
      const sack = toNum(x.sacks ?? x.sack)

      const categoryCode = String(x.categoryCode ?? x.category_code ?? x.category?.code ?? '').trim() || ''

      return {
        id,
        fullName,
        number: number == null ? null : toNum(number),
        photoUrl: x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null,
        teamId,
        teamName,
        categoryCode,
        stats: { td, pa, int: it, sack },
      } satisfies PlayerVM
    })
    .filter(Boolean) as PlayerVM[]
})

/** =========================
 *  FILTERS
 *  ========================= */
const teamPick = ref<'ALL' | string>('ALL')
const numberPick = ref('')
const namePick = ref('')
const catPick = ref('')
const sortPick = ref<'impact' | 'name' | 'team' | 'number'>('impact')

const page = ref(1)
const perPage = 12

watch([teamPick, numberPick, namePick, catPick, sortPick], () => {
  page.value = 1
})

const filtered = computed(() => {
  const tPick = teamPick.value
  const qNum = numberPick.value.trim()
  const qName = namePick.value.toLowerCase().trim()
  const qCat = catPick.value.toLowerCase().trim()

  return players.value.filter((p) => {
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

    if (qCat) {
      const cc = String(p.categoryCode ?? '').toLowerCase()
      if (!cc.includes(qCat)) return false
    }

    return true
  })
})

function impact(p: PlayerVM) {
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

const sorted = computed(() => {
  const list = filtered.value.slice()
  switch (sortPick.value) {
    case 'name':
      return list.sort((a, b) => a.fullName.localeCompare(b.fullName))
    case 'team':
      return list.sort((a, b) => String(a.teamName ?? '').localeCompare(String(b.teamName ?? '')))
    case 'number':
      return list.sort((a, b) => toNum(a.number) - toNum(b.number))
    default:
      return list.sort((a, b) => impact(b) - impact(a))
  }
})

const pageCount = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage)))

const paged = computed(() => {
  const start = (page.value - 1) * perPage
  return sorted.value.slice(start, start + perPage)
})

const rangeStart = computed(() => (sorted.value.length ? (page.value - 1) * perPage + 1 : 0))
const rangeEnd = computed(() => Math.min(sorted.value.length, (page.value - 1) * perPage + paged.value.length))

function clearFilters() {
  teamPick.value = 'ALL'
  numberPick.value = ''
  namePick.value = ''
  catPick.value = ''
  sortPick.value = 'impact'
}

const selected = ref<PlayerVM | null>(null)
function select(p: PlayerVM) {
  selected.value = p
}

/** =========================
 *  STATES
 *  ========================= */
const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

async function refreshAll() {
  await Promise.all([refreshTeams(), refreshPlayers()])
}
</script>
