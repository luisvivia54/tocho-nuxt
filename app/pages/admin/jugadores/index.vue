<!-- app/pages/admin/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-100 overflow-x-hidden">
    <!-- Fondo -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-28 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl"></div>
      <div class="absolute top-24 -left-28 h-[420px] w-[560px] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
      <div class="absolute -bottom-28 -right-28 h-[520px] w-[620px] rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,.10),transparent_45%)]"></div>
      <div
        class="absolute inset-0 opacity-25 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_72px)]"
      ></div>
    </div>

    <section class="pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <!-- HEADER -->
        <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-slate-400">
              TOCHERO5 · Consola Admin
            </p>

            <h1 class="mt-2 font-display text-3xl md:text-4xl font-extrabold text-white">
              Jugadores <span class="text-white/70">(Admin)</span>
            </h1>

            <p class="mt-2 text-sm text-slate-300 max-w-2xl">
              Directorio global para revisar jugadores, filtrar y ver stats básicas. (Protegido por middleware admin)
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-200">
                Lectura
              </span>
              <span class="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-100">
                Filtros
              </span>
              <span class="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-100">
                Stats
              </span>
            </div>
          </div>

          <div class="w-full lg:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              :disabled="pendingAny"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/jugadores"
              class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Ver versión pública →
            </NuxtLink>
          </div>
        </header>

        <!-- ESTADOS -->
        <div v-if="pendingAny" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          Cargando jugadores…
        </div>

        <div v-else-if="errorAny" class="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-100">
          Error cargando datos. Revisa que el backend esté disponible.
        </div>

        <!-- LAYOUT NUEVO -->
        <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          <!-- SIDEBAR FILTROS -->
          <aside class="lg:col-span-3 min-w-0">
            <div class="lg:sticky lg:top-24 space-y-4">
              <!-- Resumen -->
              <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 p-4 sm:p-5">
                <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">resumen</p>
                <div class="mt-3 grid grid-cols-3 gap-2">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Jugadores</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">{{ playersVm.length }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Equipos</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">{{ teamsVm.length }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Total</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">{{ filteredPlayers.length }}</p>
                  </div>
                </div>

                <p class="mt-3 text-[11px] text-slate-400">
                  Última actualización:
                  <span class="text-slate-200 font-semibold">{{ lastUpdatedLabel }}</span>
                </p>
              </div>

              <!-- Filtros -->
              <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden">
                <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="font-semibold text-white">Filtros</h2>
                    <p class="text-xs text-slate-400">Equipo, número, categoría y nombre.</p>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                    @click="clearFilters"
                  >
                    Limpiar
                  </button>
                </div>

                <div class="p-4 sm:p-5 space-y-3">
                  <!-- Equipo -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Equipo</label>
                    <select
                      v-model="teamPick"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="ALL">Todos</option>
                      <option v-for="t in teamsVm" :key="t.teamId" :value="String(t.teamId)">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Número -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Número</label>
                    <input
                      v-model.trim="numberPick"
                      inputmode="numeric"
                      placeholder="Ej. 7"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <!-- Categoría -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Categoría</label>
                    <select
                      v-model="categoryPick"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="ALL">Todas</option>
                      <option v-for="c in categoryOptions" :key="c" :value="c">
                        {{ c }}
                      </option>
                    </select>
                  </div>

                  <!-- Nombre -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Nombre</label>
                    <input
                      v-model.trim="namePick"
                      placeholder="Escribe para buscar…"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <!-- Orden -->
                  <div class="pt-2">
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Orden</label>
                    <select
                      v-model="sortKey"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="impact">Impacto</option>
                      <option value="td">TD</option>
                      <option value="int">INT</option>
                      <option value="pa">PA</option>
                      <option value="sack">SACK</option>
                      <option value="name">Nombre</option>
                      <option value="team">Equipo</option>
                      <option value="number">Número</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- DIRECTORIO -->
          <section class="lg:col-span-6 min-w-0">
            <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
              <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">directorio</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Jugadores</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Click en un jugador para ver el detalle a la derecha.
                  </p>
                </div>

                <span class="shrink-0 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  Total: {{ sortedPlayersAll.length }}
                </span>
              </div>

              <!-- Paginación arriba -->
              <div class="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
                <p class="text-[11px] text-slate-400">
                  Mostrando
                  <span class="text-slate-200 font-semibold">{{ rangeStart }}</span>-
                  <span class="text-slate-200 font-semibold">{{ rangeEnd }}</span>
                  de
                  <span class="text-slate-200 font-semibold">{{ sortedPlayersAll.length }}</span>
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
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
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                    :disabled="page >= pageCount"
                    @click="page = Math.min(pageCount, page + 1)"
                  >
                    →
                  </button>
                </div>
              </div>

              <!-- Tabla -->
              <div class="overflow-x-auto">
                <table class="min-w-[860px] w-full text-sm">
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
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="pagedPlayers.length === 0">
                      <td colspan="8" class="px-4 py-6 text-slate-400">
                        No hay jugadores para esos filtros.
                      </td>
                    </tr>

                    <tr
                      v-for="p in pagedPlayers"
                      :key="p.id"
                      class="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                      :class="p.id === selectedId ? 'bg-white/5' : ''"
                      @click="selectPlayer(p.id)"
                    >
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="h-10 w-10 rounded-2xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0">
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
                            </p>
                            <p class="text-[11px] text-slate-400 truncate">
                              ID: {{ p.id }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3 text-slate-200">
                        {{ p.teamName || '—' }}
                      </td>

                      <td class="px-4 py-3 text-slate-200 tabular-nums">
                        {{ p.number ?? '—' }}
                      </td>

                      <td class="px-4 py-3 text-slate-200">
                        {{ p.categoryCode || '—' }}
                      </td>

                      <td class="px-4 py-3 font-semibold text-slate-100 tabular-nums">{{ p.stats.td }}</td>
                      <td class="px-4 py-3 font-semibold text-slate-100 tabular-nums">{{ p.stats.int }}</td>
                      <td class="px-4 py-3 font-semibold text-slate-100 tabular-nums">{{ p.stats.pa }}</td>
                      <td class="px-4 py-3 font-semibold text-slate-100 tabular-nums">{{ p.stats.sack }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Paginación abajo -->
              <div class="px-4 sm:px-5 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                <p class="text-[11px] text-slate-400">
                  Impacto = TD + INT + PA + SACK
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                    :disabled="page <= 1"
                    @click="page = Math.max(1, page - 1)"
                  >
                    ← Anterior
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                    :disabled="page >= pageCount"
                    @click="page = Math.min(pageCount, page + 1)"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- DETALLE -->
          <aside class="lg:col-span-3 min-w-0">
            <div class="lg:sticky lg:top-24">
              <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden">
                <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">detalle</p>
                    <h3 class="mt-1 font-display text-lg font-extrabold text-white">
                      {{ selectedPlayer ? 'Jugador seleccionado' : 'Selecciona un jugador' }}
                    </h3>
                  </div>

                  <button
                    v-if="selectedPlayer"
                    type="button"
                    class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                    @click="selectedId = null"
                  >
                    Quitar
                  </button>
                </div>

                <div class="p-4 sm:p-5">
                  <div v-if="!selectedPlayer" class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                    <div class="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-black/20 grid place-items-center text-slate-200">
                      <span class="text-xl">👤</span>
                    </div>
                    <p class="mt-3 font-semibold text-white">Selecciona un jugador</p>
                    <p class="mt-1 text-sm text-slate-400">
                      Da click en una fila del directorio para ver sus datos y stats.
                    </p>
                  </div>

                  <div v-else class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-2xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0">
                        <img
                          v-if="selectedPlayer.photoUrl"
                          :src="selectedPlayer.photoUrl"
                          :alt="selectedPlayer.fullName"
                          class="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span v-else class="text-[13px] font-extrabold text-slate-200">
                          {{ initials(selectedPlayer.fullName) }}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-white truncate">
                          {{ selectedPlayer.fullName }}
                          <span v-if="selectedPlayer.number != null" class="ml-2 text-slate-400 font-semibold">
                            #{{ selectedPlayer.number }}
                          </span>
                        </p>
                        <p class="text-sm text-slate-300 truncate">
                          {{ selectedPlayer.teamName || 'Sin equipo' }}
                        </p>
                        <p class="text-[11px] text-slate-400 truncate">
                          ID: {{ selectedPlayer.id }} · {{ selectedPlayer.categoryCode || '—' }}
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-3 text-center">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-violet-100/80">TD</p>
                        <p class="mt-1 text-xl font-extrabold text-violet-100 tabular-nums">{{ selectedPlayer.stats.td }}</p>
                      </div>
                      <div class="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-3 text-center">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-fuchsia-100/80">INT</p>
                        <p class="mt-1 text-xl font-extrabold text-fuchsia-100 tabular-nums">{{ selectedPlayer.stats.int }}</p>
                      </div>
                      <div class="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-3 py-3 text-center">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-sky-100/80">PA</p>
                        <p class="mt-1 text-xl font-extrabold text-sky-100 tabular-nums">{{ selectedPlayer.stats.pa }}</p>
                      </div>
                      <div class="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-center">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-emerald-100/80">SACK</p>
                        <p class="mt-1 text-xl font-extrabold text-emerald-100 tabular-nums">{{ selectedPlayer.stats.sack }}</p>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p class="text-[11px] text-slate-400">Impacto</p>
                      <p class="mt-1 text-2xl font-extrabold text-white tabular-nums">
                        {{ impact(selectedPlayer) }}
                      </p>
                      <p class="mt-1 text-[11px] text-slate-400">TD + INT + PA + SACK</p>
                    </div>
                  </div>
                </div>
              </div>

              <p class="mt-3 text-[11px] text-slate-400">
                Nota: esta vista es sólo lectura por ahora. Si luego quieres editar jugadores, lo armamos con modal + PUT.
              </p>
            </div>
          </aside>
        </div>

        <div class="h-10"></div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncData, useRuntimeConfig } from '#imports'

definePageMeta({ middleware: ['admin'] })

/** =========================
 *  API CONFIG
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const API_TEAMS = `${API_BASE}/teams`
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
async function mapPool<T, R>(items: readonly T[], worker: (item: T) => Promise<R>, concurrency = 8): Promise<R[]> {
  const out = new Array<R>(items.length)
  let i = 0
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = i++
      if (idx >= items.length) break
      out[idx] = await worker(items[idx]!)
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
  code?: string
  gender?: string
}

type PlayerStats = { td: number; int: number; pa: number; sack: number; rec: number }

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

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
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

const categoryOptions = computed(() => {
  const s = new Set<string>()
  for (const t of teamsVm.value) {
    const c = String(t.code ?? '').trim()
    if (c) s.add(c)
  }
  return Array.from(s.values()).sort((a, b) => a.localeCompare(b))
})

/** =========================
 *  FETCH STATS
 *  ========================= */
type PlayerSeasonStatsApi = Partial<{
  playerId: number
  player_id: number
  id: number
  td: number
  passTd: number
  pass_td: number
  interceptions: number
  intercep: number
  sacks: number
}>

const {
  data: statsData,
  pending: statsPending,
  error: statsErr,
  refresh: refreshStats,
} = useAsyncData('admin-players-stats', async () => {
  try {
    const raw = await $fetch<any>(API_STATS_PLAYERS)
    return unwrapList<PlayerSeasonStatsApi>(raw)
  } catch {
    return []
  }
})

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
        return list.map((p: any) => ({ ...p, __teamId: t.teamId, __teamName: t.name }))
      } catch {
        return []
      }
    },
    8
  )
  return chunks.flat()
}

const {
  data: rosterData,
  pending: rosterPending,
  error: rosterErr,
  refresh: refreshRoster,
} = useAsyncData(
  () => `admin-players-roster:${teamsVm.value.length}`,
  async () => dedupeById(await fetchRosterFromTeams()),
  { watch: [teamsVm] }
)

/** =========================
 *  MAP TO VIEWMODEL (roster + stats)
 *  ========================= */
const playersVm = computed<PlayerVM[]>(() => {
  const roster = unwrapList<any>(rosterData.value)
  const statsMap = statsByPlayerId.value

  const mapped = roster
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

  // Si hay stats sin roster, igual los mostramos como “Jugador {id}”
  const ids = new Set(mapped.map((p) => p.id))
  for (const [pid, s] of statsMap.entries()) {
    if (ids.has(pid)) continue
    mapped.push({
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

  return mapped
})

/** =========================
 *  FILTERS
 *  ========================= */
const teamPick = ref<'ALL' | string>('ALL')
const categoryPick = ref<'ALL' | string>('ALL')
const numberPick = ref('')
const namePick = ref('')

/** al cambiar filtros → página 1 */
const page = ref(1)
watch([teamPick, categoryPick, numberPick, namePick], () => {
  page.value = 1
})

const filteredPlayers = computed(() => {
  const tPick = teamPick.value
  const cPick = categoryPick.value
  const qNum = numberPick.value.trim()
  const qName = namePick.value.toLowerCase().trim()

  return playersVm.value.filter((p) => {
    if (tPick !== 'ALL') {
      const id = Number(tPick)
      if (Number.isFinite(id) && p.teamId !== id) return false
    }

    if (cPick !== 'ALL') {
      const c = String(p.categoryCode ?? '').trim()
      if (c !== cPick) return false
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

type SortKey = 'impact' | 'td' | 'int' | 'pa' | 'sack' | 'name' | 'team' | 'number'
const sortKey = ref<SortKey>('impact')

const sortedPlayersAll = computed(() => {
  const arr = filteredPlayers.value.slice()
  const k = sortKey.value
  const safe = (s: any) => String(s ?? '').toLowerCase()

  return arr.sort((a, b) => {
    if (k === 'impact') return impact(b) - impact(a)
    if (k === 'td') return b.stats.td - a.stats.td
    if (k === 'int') return b.stats.int - a.stats.int
    if (k === 'pa') return b.stats.pa - a.stats.pa
    if (k === 'sack') return b.stats.sack - a.stats.sack
    if (k === 'number') return toNum(b.number) - toNum(a.number)
    if (k === 'team') return safe(a.teamName).localeCompare(safe(b.teamName))
    return safe(a.fullName).localeCompare(safe(b.fullName))
  })
})

const perPage = 12
const pageCount = computed(() => Math.max(1, Math.ceil(sortedPlayersAll.value.length / perPage)))
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
  categoryPick.value = 'ALL'
  numberPick.value = ''
  namePick.value = ''
  sortKey.value = 'impact'
}

/** =========================
 *  SELECCIÓN + REFRESH
 *  ========================= */
const selectedId = ref<number | null>(null)
function selectPlayer(id: number) {
  selectedId.value = id
}
const selectedPlayer = computed(() => {
  if (selectedId.value == null) return null
  return playersVm.value.find((p) => p.id === selectedId.value) ?? null
})

const pendingAny = computed(() => !!teamsPending.value || !!rosterPending.value || !!statsPending.value)
const errorAny = computed(() => !!teamsErr.value || !!rosterErr.value || !!statsErr.value)

const lastUpdatedAt = ref<Date | null>(null)
const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '—'
  const d = lastUpdatedAt.value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

async function refreshAll() {
  await Promise.all([refreshTeams(), refreshRoster(), refreshStats()])
  lastUpdatedAt.value = new Date()
}
</script>
