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
              Jugadores <span class="text-white/70">(por equipo)</span>
            </h1>

            <p class="mt-2 text-sm text-slate-300 max-w-2xl">
              Selecciona un equipo para ver su roster. (Protegido por middleware admin)
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-200">
                Lectura
              </span>
              <span class="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-100">
                Equipos → Roster
              </span>
              <span class="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-100">
                Datos del jugador
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
          Cargando equipos y rosters…
        </div>

        <div v-else-if="errorAny" class="mt-6 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-100">
          Error cargando datos. Revisa que el backend esté disponible (teams + teams/{id}/detail).
        </div>

        <!-- LAYOUT -->
        <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          <!-- SIDEBAR FILTROS -->
          <aside class="lg:col-span-3 min-w-0">
            <div class="lg:sticky lg:top-24 space-y-4">
              <!-- Resumen -->
              <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 p-4 sm:p-5">
                <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">resumen</p>

                <div class="mt-3 grid grid-cols-3 gap-2">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Equipos</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">{{ teamsFilteredAll.length }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Jugadores</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">{{ totalPlayers }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">Roster</p>
                    <p class="mt-1 text-lg font-extrabold text-white tabular-nums">
                      {{ selectedTeamPlayersFiltered.length }}
                    </p>
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
                    <p class="text-xs text-slate-400">Filtra equipos y roster.</p>
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
                  <!-- Equipo (texto) -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Buscar equipo</label>
                    <input
                      v-model.trim="teamQuery"
                      placeholder="Ej. Águilas…"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <!-- Categoría -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Categoría (code)</label>
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

                  <!-- Rama -->
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Rama (gender)</label>
                    <select
                      v-model="genderPick"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="ALL">Todas</option>
                      <option value="VARONIL">VARONIL</option>
                      <option value="FEMENIL">FEMENIL</option>
                      <option value="MIXTO">MIXTO</option>
                    </select>
                  </div>

                  <!-- Buscar jugador dentro del roster seleccionado -->
                  <div class="pt-2">
                    <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Buscar jugador (roster)</label>
                    <input
                      v-model.trim="playerQuery"
                      placeholder="Nombre / # / CURP…"
                      class="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40"
                    />
                    <p class="mt-2 text-[11px] text-slate-400">
                      Tip: aquí sí busca por <span class="text-slate-200 font-semibold">#</span> y también por <span class="text-slate-200 font-semibold">CURP</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- DIRECTORIO EQUIPOS -->
          <section class="lg:col-span-6 min-w-0">
            <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
              <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">directorio</p>
                  <h2 class="mt-1 font-display text-xl font-extrabold text-white">Equipos</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    Click en un equipo para ver su roster a la derecha.
                  </p>
                </div>

                <span class="shrink-0 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  Total: {{ teamsFilteredAll.length }}
                </span>
              </div>

              <!-- Paginación -->
              <div class="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
                <p class="text-[11px] text-slate-400">
                  Mostrando
                  <span class="text-slate-200 font-semibold">{{ teamRangeStart }}</span>-
                  <span class="text-slate-200 font-semibold">{{ teamRangeEnd }}</span>
                  de
                  <span class="text-slate-200 font-semibold">{{ teamsFilteredAll.length }}</span>
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                    :disabled="teamPage <= 1"
                    @click="teamPage = Math.max(1, teamPage - 1)"
                  >
                    ←
                  </button>

                  <span class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
                    Página {{ teamPage }} / {{ teamPageCount }}
                  </span>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
                    :disabled="teamPage >= teamPageCount"
                    @click="teamPage = Math.min(teamPageCount, teamPage + 1)"
                  >
                    →
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-[860px] w-full text-sm">
                  <thead>
                    <tr class="text-left text-slate-400 border-b border-white/10">
                      <th class="px-4 py-3">Equipo</th>
                      <th class="px-4 py-3">Categoría</th>
                      <th class="px-4 py-3">Rama</th>
                      <th class="px-4 py-3">Jugadores</th>
                      <th class="px-4 py-3">Capitán</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="teamsPaged.length === 0">
                      <td colspan="5" class="px-4 py-6 text-slate-400">
                        No hay equipos para esos filtros.
                      </td>
                    </tr>

                    <tr
                      v-for="t in teamsPaged"
                      :key="t.teamId"
                      class="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                      :class="t.teamId === selectedTeamId ? 'bg-white/5' : ''"
                      @click="selectTeam(t.teamId)"
                    >
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="h-10 w-10 rounded-2xl border border-white/10 bg-black/20 overflow-hidden grid place-items-center shrink-0">
                            <img
                              v-if="t.logoUrl"
                              :src="t.logoUrl"
                              :alt="t.name"
                              class="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <span v-else class="text-[12px] font-extrabold text-slate-200">
                              {{ initials(t.name) }}
                            </span>
                          </div>
                          <div class="min-w-0">
                            <p class="font-semibold text-white truncate">{{ t.name }}</p>
                            <p class="text-[11px] text-slate-400 truncate">ID: {{ t.teamId }}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3 text-slate-200">
                        {{ t.categoryCode || '—' }}
                      </td>

                      <td class="px-4 py-3 text-slate-200">
                        {{ t.gender || '—' }}
                      </td>

                      <td class="px-4 py-3 text-slate-200 tabular-nums">
                        {{ t.playersCount }}
                      </td>

                      <td class="px-4 py-3 text-slate-200">
                        {{ t.captainName || 'Por definir' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="px-4 sm:px-5 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                <p class="text-[11px] text-slate-400">
                  Este directorio viene de <span class="text-slate-200 font-semibold">/teams</span> + <span class="text-slate-200 font-semibold">/teams/{id}/detail</span>.
                </p>

                <NuxtLink
                  v-if="selectedTeam"
                  :to="`/teams/${selectedTeam.teamId}`"
                  class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  Ver equipo →
                </NuxtLink>
              </div>
            </div>
          </section>

          <!-- ROSTER DEL EQUIPO -->
          <aside class="lg:col-span-3 min-w-0">
            <div class="lg:sticky lg:top-24">
              <div class="rounded-3xl border border-white/10 bg-[#070b1d]/85 overflow-hidden">
                <div class="px-4 sm:px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400">roster</p>
                    <h3 class="mt-1 font-display text-lg font-extrabold text-white truncate">
                      {{ selectedTeam ? selectedTeam.name : 'Selecciona un equipo' }}
                    </h3>
                    <p v-if="selectedTeam" class="mt-1 text-xs text-slate-400 truncate">
                      {{ selectedTeam.playersCount }} jugador{{ selectedTeam.playersCount === 1 ? '' : 'es' }} ·
                      {{ selectedTeam.categoryCode || '—' }} · {{ selectedTeam.gender || '—' }}
                    </p>
                  </div>

                  <button
                    v-if="selectedTeam"
                    type="button"
                    class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                    @click="selectedTeamId = null"
                  >
                    Quitar
                  </button>
                </div>

                <div class="p-4 sm:p-5">
                  <div v-if="!selectedTeam" class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                    <div class="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-black/20 grid place-items-center text-slate-200">
                      <span class="text-xl">🏈</span>
                    </div>
                    <p class="mt-3 font-semibold text-white">Selecciona un equipo</p>
                    <p class="mt-1 text-sm text-slate-400">
                      Da click en una fila del directorio para ver su roster.
                    </p>
                  </div>

                  <div v-else>
                    <div v-if="selectedTeamPlayersFiltered.length === 0" class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      No hay jugadores para ese filtro dentro de este equipo.
                    </div>

                    <div v-else class="space-y-2 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
                      <article
                        v-for="p in selectedTeamPlayersFiltered"
                        :key="p.id"
                        class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
                      >
                        <div class="h-10 w-10 rounded-full overflow-hidden border border-white/10 bg-black/20 grid place-items-center shrink-0">
                          <img
                            v-if="p.photoUrl"
                            :src="p.photoUrl"
                            :alt="p.fullName"
                            class="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <span v-else class="text-[11px] font-extrabold text-slate-200">
                            {{ initials(p.fullName) }}
                          </span>
                        </div>

                        <div class="flex-1 min-w-0">
                          <p class="text-slate-100 font-semibold truncate">{{ p.fullName }}</p>

                          <p class="mt-0.5 text-[11px] text-slate-400">
                            <span v-if="p.jerseyNumber != null">#{{ p.jerseyNumber }}</span>
                            <span v-if="p.jerseyNumber != null && ageFromBirthdate(p.birthdate) != null" class="mx-1 text-slate-500">·</span>
                            <span v-if="ageFromBirthdate(p.birthdate) != null">{{ ageFromBirthdate(p.birthdate) }} años</span>
                          </p>

                          <!-- CURP (admin) -->
                          <p v-if="p.curp" class="mt-1 text-[11px] text-slate-500 truncate">
                            CURP: <span class="font-mono text-slate-300">{{ p.curp }}</span>
                          </p>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>

              <p class="mt-3 text-[11px] text-slate-400">
                Nota: esta vista es sólo lectura. Aquí usamos los mismos campos del endpoint <span class="text-slate-200 font-semibold">/teams/{id}/detail</span>.
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
 *  API
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const API_TEAMS = `${API_BASE}/teams`

/** =========================
 *  TYPES (como tu teams/{id}/detail)
 *  ========================= */
type Season = { id: number; name: string }
type Category = { id: number; name: string; code: string; gender: string }
type CaptainDto = { id: number; fullName: string }

type ApiTeam = {
  teamId: number
  season: Season | null
  category: Category | null
  name: string
  shortName: string | null
  logoUrl: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  captain: CaptainDto | string | null
}

type Player = {
  id: number
  fullName: string
  curp: string
  jerseyNumber: number | null
  birthdate: string | null
  photoUrl: string | null
}

type TeamDetailResponse = {
  team: ApiTeam
  players: Player[]
  lastGames: any[]
  gallery: any[]
}

/** =========================
 *  HELPERS
 *  ========================= */
const toStr = (v: any) => String(v ?? '')
const upper = (v: any) => toStr(v).toUpperCase()

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  return []
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function normalizeUrl(url: string | null): string | null {
  if (!url || url === 'NULL') return null
  return url
}

function ageFromBirthdate(birthdate: string | null): number | null {
  if (!birthdate) return null
  const date = new Date(birthdate)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) age -= 1
  return age
}

/** pool simple */
async function mapPool<T, R>(items: readonly T[], worker: (item: T) => Promise<R>, concurrency = 6): Promise<R[]> {
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
 *  FETCH TEAMS
 *  ========================= */
const { data: teamsRaw, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'admin-jugadores-teams',
  async () => {
    try {
      const raw = await $fetch<any>(API_TEAMS)
      return unwrapList<any>(raw)
    } catch {
      return []
    }
  }
)

const teamsBase = computed(() => {
  const list = unwrapList<any>(teamsRaw.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
    }))
    .filter((t) => Number.isFinite(t.teamId))
})

/** =========================
 *  FETCH TEAM DETAILS (players + category + captain, etc.)
 *  ========================= */
const { data: detailsRaw, pending: detailsPending, error: detailsErr, refresh: refreshDetails } = useAsyncData(
  () => `admin-jugadores-team-details:${teamsBase.value.length}`,
  async () => {
    const base = teamsBase.value
    if (!base.length) return []

    const results = await mapPool(
      base,
      async (t) => {
        try {
          const res = await $fetch<TeamDetailResponse>(`${API_TEAMS}/${t.teamId}/detail`)
          // normaliza photoUrls
          const players = (res.players ?? []).map((p) => ({ ...p, photoUrl: normalizeUrl(p.photoUrl) }))
          return { ...res, players }
        } catch {
          return null
        }
      },
      6
    )

    return results.filter(Boolean) as TeamDetailResponse[]
  },
  { watch: [teamsBase] }
)

type TeamRow = {
  teamId: number
  name: string
  logoUrl: string | null
  categoryCode: string
  gender: string
  captainName: string
  playersCount: number
  players: Player[]
}

const teamsVm = computed<TeamRow[]>(() => {
  const list = (detailsRaw.value ?? []) as TeamDetailResponse[]
  return list
    .map((d) => {
      const t = d.team
      const cap =
        typeof t.captain === 'string'
          ? t.captain
          : (t.captain as any)?.fullName || ''

      return {
        teamId: t.teamId,
        name: t.name,
        logoUrl: normalizeUrl(t.logoUrl),
        categoryCode: t.category?.code ?? '',
        gender: upper(t.category?.gender ?? ''),
        captainName: String(cap || ''),
        playersCount: (d.players ?? []).length,
        players: (d.players ?? []).slice(),
      } satisfies TeamRow
    })
    .sort((a, b) => a.name.localeCompare(b.name))
})

const categoryOptions = computed(() => {
  const s = new Set<string>()
  for (const t of teamsVm.value) {
    const c = String(t.categoryCode || '').trim()
    if (c) s.add(c)
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b))
})

/** =========================
 *  FILTERS
 *  ========================= */
const teamQuery = ref('')
const categoryPick = ref<'ALL' | string>('ALL')
const genderPick = ref<'ALL' | string>('ALL')
const playerQuery = ref('')

const teamsFilteredAll = computed(() => {
  const tq = teamQuery.value.trim().toLowerCase()
  const cat = categoryPick.value
  const gen = genderPick.value

  return teamsVm.value.filter((t) => {
    if (tq && !t.name.toLowerCase().includes(tq)) return false
    if (cat !== 'ALL' && String(t.categoryCode || '') !== cat) return false
    if (gen !== 'ALL' && upper(t.gender) !== gen) return false
    return true
  })
})

/** al cambiar filtros de equipos → página 1 */
const teamPage = ref(1)
watch([teamQuery, categoryPick, genderPick], () => (teamPage.value = 1))

/** =========================
 *  PAGINATION (equipos)
 *  ========================= */
const teamsPerPage = 10
const teamPageCount = computed(() => Math.max(1, Math.ceil(teamsFilteredAll.value.length / teamsPerPage)))
const teamsPaged = computed(() => {
  const start = (teamPage.value - 1) * teamsPerPage
  return teamsFilteredAll.value.slice(start, start + teamsPerPage)
})
const teamRangeStart = computed(() => {
  const total = teamsFilteredAll.value.length
  if (!total) return 0
  return (teamPage.value - 1) * teamsPerPage + 1
})
const teamRangeEnd = computed(() => {
  const total = teamsFilteredAll.value.length
  if (!total) return 0
  return Math.min(total, (teamPage.value - 1) * teamsPerPage + teamsPaged.value.length)
})

/** =========================
 *  SELECCIÓN DE EQUIPO
 *  ========================= */
const selectedTeamId = ref<number | null>(null)

watch(
  () => teamsFilteredAll.value.map((t) => t.teamId).join(','),
  () => {
    // si no hay selección o la selección ya no existe, pon el primero
    const ids = teamsFilteredAll.value.map((t) => t.teamId)
    if (!ids.length) {
      selectedTeamId.value = null
      return
    }
    if (selectedTeamId.value == null || !ids.includes(selectedTeamId.value)) {
      selectedTeamId.value = ids[0]!
    }
  },
  { immediate: true }
)

function selectTeam(id: number) {
  selectedTeamId.value = id
  playerQuery.value = '' // opcional: al cambiar de equipo resetea búsqueda del roster
}

const selectedTeam = computed(() => {
  if (selectedTeamId.value == null) return null
  return teamsVm.value.find((t) => t.teamId === selectedTeamId.value) ?? null
})

const selectedTeamPlayersFiltered = computed(() => {
  const t = selectedTeam.value
  if (!t) return []

  const q = playerQuery.value.trim().toLowerCase()
  const list = (t.players ?? []).slice()

  // orden default: jersey asc, luego nombre
  list.sort((a, b) => {
    const an = a.jerseyNumber == null ? 9999 : a.jerseyNumber
    const bn = b.jerseyNumber == null ? 9999 : b.jerseyNumber
    if (an !== bn) return an - bn
    return String(a.fullName).localeCompare(String(b.fullName))
  })

  if (!q) return list

  return list.filter((p) => {
    const name = String(p.fullName || '').toLowerCase()
    const num = p.jerseyNumber == null ? '' : String(p.jerseyNumber)
    const curp = String(p.curp || '').toLowerCase()
    return name.includes(q) || num.includes(q) || curp.includes(q)
  })
})

const totalPlayers = computed(() => teamsVm.value.reduce((acc, t) => acc + (t.playersCount || 0), 0))

function clearFilters() {
  teamQuery.value = ''
  categoryPick.value = 'ALL'
  genderPick.value = 'ALL'
  playerQuery.value = ''
  teamPage.value = 1
}

/** =========================
 *  REFRESH
 *  ========================= */
const pendingAny = computed(() => !!teamsPending.value || !!detailsPending.value)
const errorAny = computed(() => !!teamsErr.value || !!detailsErr.value)

const lastUpdatedAt = ref<Date | null>(null)
const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '—'
  const d = lastUpdatedAt.value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

async function refreshAll() {
  await refreshTeams()
  await refreshDetails()
  lastUpdatedAt.value = new Date()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
}
</style>
