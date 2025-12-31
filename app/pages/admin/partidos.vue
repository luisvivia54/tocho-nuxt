<template>
  <main class="bg-slate-950 min-h-screen text-slate-50">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-7xl mx-auto px-6">
        <!-- HEADER -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div class="space-y-2">
            <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              TOCHERO5 · CONSOLA ADMIN
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
              Partidos (Admin)
            </h1>
            <p class="text-sm text-slate-300 max-w-2xl">
              Agrega, edita y finaliza partidos. Solo usuarios con rol <b>admin</b> en Keycloak.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="hardRefresh()"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/partidos"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              ← Ir a Partidos (público)
            </NuxtLink>

            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              Inicio
            </NuxtLink>
          </div>
        </header>

        <!-- GATES -->
        <div v-if="!kcReady" class="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p class="text-sm text-slate-200 font-semibold">Inicializando sesión…</p>
          <p class="text-xs text-slate-400 mt-1">Espera a que Keycloak esté listo.</p>
        </div>

        <div v-else-if="!isAdmin" class="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p class="text-sm text-rose-100 font-semibold">Acceso denegado</p>
          <p class="text-xs text-rose-200/80 mt-1">
            Tu usuario no tiene rol <b>admin</b>. Revisa el token/roles en Keycloak.
          </p>
          <div class="mt-4">
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              Volver al inicio
            </NuxtLink>
          </div>
        </div>

        <!-- ADMIN UI -->
        <div v-else class="grid lg:grid-cols-12 gap-6">
          <!-- LEFT: filtros + form -->
          <aside class="lg:col-span-4 space-y-4">
            <!-- filtros equipos -->
            <section class="rounded-3xl border border-slate-800/70 bg-slate-900/45 p-4 md:p-5">
              <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 class="font-semibold text-white">Filtros (equipos)</h2>
                  <p class="text-xs text-slate-400">Filtra equipos por rama/categoría/búsqueda.</p>
                </div>
                <button
                  type="button"
                  @click="resetTeamFilters()"
                  class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                >
                  Limpiar
                </button>
              </div>

              <div class="grid gap-3">
                <div>
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Rama (gender)</label>
                  <select
                    v-model="teamGenderPick"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="ALL">Todas</option>
                    <option value="VARONIL">Varonil</option>
                    <option value="FEMENIL">Femenil</option>
                    <option value="MIXTO">Mixto</option>
                  </select>
                </div>

                <div>
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Categoría (code)</label>
                  <input
                    v-model.trim="teamCodePick"
                    placeholder="Ej. U12, U14, LIBRE…"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Buscar equipo</label>
                  <input
                    v-model.trim="teamQuery"
                    placeholder="Escribe para filtrar…"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            </section>

            <!-- form partido -->
            <section class="rounded-3xl border border-slate-800/70 bg-slate-900/45 p-4 md:p-5">
              <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 class="font-semibold text-white">Datos del partido</h2>
                  <p class="text-xs text-slate-400">
                    {{ editingId ? `Editando juego ID: ${editingId}` : 'Creando nuevo partido' }}
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="clearForm()"
                    class="text-[11px] font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                  >
                    Nuevo / Limpiar
                  </button>
                </div>
              </div>

              <div class="grid gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Fecha</label>
                    <input
                      v-model="form.date"
                      type="date"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Hora</label>
                    <input
                      v-model="form.time"
                      type="time"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Cancha / Sede (opcional)</label>
                  <input
                    v-model.trim="form.field"
                    placeholder="Ej. Miguel Alemán"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Status</label>
                    <select
                      v-model="form.status"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="FINAL">FINAL</option>
                    </select>
                  </div>

                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Categoría (del partido)</label>
                    <select
                      v-model.number="form.categoryId"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    >
                      <option :value="0">— Selecciona —</option>
                      <option v-for="c in categories" :key="c.id" :value="c.id">
                        {{ c.name || `Categoría ${c.id}` }} · {{ c.gender || '—' }} · {{ c.code || '—' }}
                      </option>
                    </select>
                  </div>
                </div>

                <p v-if="catHint" class="text-[11px] text-slate-400">{{ catHint }}</p>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Local</label>
                    <div class="mt-1 rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2">
                      <p class="text-sm font-semibold text-slate-100 truncate">
                        {{ homeTeam?.name || 'Selecciona local' }}
                      </p>
                      <p class="text-[11px] text-slate-400 truncate">
                        {{ homeTeam ? teamMeta(homeTeam) : '—' }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Visitante</label>
                    <div class="mt-1 rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2">
                      <p class="text-sm font-semibold text-slate-100 truncate">
                        {{ awayTeam?.name || 'Selecciona visitante' }}
                      </p>
                      <p class="text-[11px] text-slate-400 truncate">
                        {{ awayTeam ? teamMeta(awayTeam) : '—' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Marcador (solo FINAL) -->
                <div v-if="form.status === 'FINAL'" class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Puntos Local</label>
                    <input
                      v-model.number="form.homeScore"
                      type="number"
                      min="0"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Puntos Visitante</label>
                    <input
                      v-model.number="form.awayScore"
                      type="number"
                      min="0"
                      class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <p v-if="formError" class="text-xs text-rose-300">{{ formError }}</p>
                <p v-if="formOk" class="text-xs text-emerald-300">{{ formOk }}</p>

                <div class="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="saving"
                    @click="saveGame()"
                  >
                    {{ saving ? 'Guardando…' : 'Guardar partido' }}
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
                    @click="clearForm()"
                  >
                    Limpiar
                  </button>
                </div>

                <p class="text-[11px] text-slate-500">
                  Tip: usa “Local/Visitante” a la derecha para llenar rápido. Para terminar un partido: botón “Finalizar”.
                </p>
              </div>
            </section>
          </aside>

          <!-- RIGHT: equipos + juegos -->
          <section class="lg:col-span-8 space-y-4">
            <!-- equipos -->
            <section class="rounded-3xl border border-slate-800/70 bg-slate-900/45 p-4 md:p-5">
              <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 class="font-semibold text-white">Equipos disponibles</h2>
                  <p class="text-xs text-slate-400">
                    Se filtran por rama/categoría/búsqueda.
                    <span class="text-slate-300 font-semibold">{{ filteredTeams.length }}</span> equipo(s).
                  </p>
                </div>
              </div>

              <div v-if="teamsPending" class="text-sm text-slate-300">Cargando equipos…</div>
              <div v-else-if="teamsError" class="text-sm text-rose-300">Error cargando equipos.</div>

              <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <article
                  v-for="t in filteredTeams"
                  :key="t.teamId"
                  class="rounded-2xl border border-slate-800/70 bg-slate-950/35 p-3 hover:border-slate-600 transition"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-xl bg-slate-950/60 border border-slate-700/70 overflow-hidden flex items-center justify-center"
                    >
                      <img v-if="t.logoUrl" :src="t.logoUrl" :alt="t.name" class="h-full w-full object-cover" />
                      <span v-else class="text-[12px] font-extrabold text-slate-200">
                        {{ initials(t.shortName || t.name || 'T5') }}
                      </span>
                    </div>

                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-100 truncate">{{ t.name }}</p>
                      <p class="text-[11px] text-slate-400 truncate">{{ teamMeta(t) }}</p>
                    </div>
                  </div>

                  <div class="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-900/70"
                      @click="pickHome(t)"
                    >
                      Local
                    </button>
                    <button
                      type="button"
                      class="flex-1 rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-900/70"
                      @click="pickAway(t)"
                    >
                      Visitante
                    </button>
                  </div>
                </article>
              </div>
            </section>

            <!-- juegos -->
            <section class="rounded-3xl border border-slate-800/70 bg-slate-900/45 p-4 md:p-5">
              <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 class="font-semibold text-white">Partidos</h2>
                  <p class="text-xs text-slate-400">
                    Lista desde backend (<code class="text-slate-300">/games</code>). Puedes <b>Editar</b> o <b>Finalizar</b>.
                  </p>
                </div>

                <button
                  type="button"
                  class="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-900/70"
                  @click="hardRefresh()"
                >
                  ⟳ Actualizar
                </button>
              </div>

              <!-- ✅ FILTROS DE PARTIDOS -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Estatus</label>
                  <select
                    v-model="gameStatusPick"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="ALL">Todos</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="FINAL">FINAL</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Buscar partido por equipo</label>
                  <input
                    v-model.trim="gameQuery"
                    placeholder="Ej. Gators, Halcones…"
                    class="mt-1 w-full rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div v-if="gamesPending" class="text-sm text-slate-300">Cargando partidos…</div>
              <div v-else-if="gamesError" class="text-sm text-rose-300">Error cargando partidos.</div>

              <div v-else class="space-y-2">
                <div
                  v-for="g in filteredGamesVm"
                  :key="g.id"
                  class="rounded-2xl border border-slate-800/70 bg-slate-950/35 px-3 py-3"
                >
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-100 truncate">
                        {{ g.homeName }} <span class="text-slate-500">vs</span> {{ g.awayName }}
                      </p>
                      <p class="text-[11px] text-slate-400 truncate">
                        ID: <span class="text-slate-200 font-semibold">{{ g.id }}</span>
                        <span class="text-slate-600">·</span>
                        {{ g.dateLabel }} {{ g.timeLabel }}
                        <span class="text-slate-600" v-if="g.categoryLabel">·</span>
                        <span v-if="g.categoryLabel">{{ g.categoryLabel }}</span>
                        <span class="text-slate-600">·</span>
                        <span class="text-slate-300">{{ upper(g.status) }}</span>
                        <template v-if="upper(g.status) === 'FINAL' && g.homeScore != null && g.awayScore != null">
                          <span class="text-slate-600">·</span>
                          <span class="text-emerald-200 font-semibold">{{ g.homeScore }} - {{ g.awayScore }}</span>
                        </template>
                      </p>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-900/70"
                        @click="loadForEdit(g)"
                      >
                        Editar
                      </button>

                      <button
                        v-if="upper(g.status) !== 'FINAL'"
                        type="button"
                        class="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-white"
                        @click="openFinish(g)"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>

                  <!-- ✅ PANEL FINALIZAR -->
                  <div v-if="finishPanelId === g.id" class="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs text-emerald-100 font-semibold">
                        Finalizar partido (guardar como FINAL)
                      </p>
                      <button
                        type="button"
                        class="text-[11px] font-semibold text-emerald-100/80 hover:text-emerald-100 underline underline-offset-4"
                        @click="closeFinish()"
                      >
                        Cerrar
                      </button>
                    </div>

                    <div class="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-[11px] uppercase tracking-[0.16em] text-emerald-100/80">Puntos Local</label>
                        <input
                          v-model.number="finishHomeScore"
                          type="number"
                          min="0"
                          class="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none"
                        />
                      </div>
                      <div>
                        <label class="text-[11px] uppercase tracking-[0.16em] text-emerald-100/80">Puntos Visitante</label>
                        <input
                          v-model.number="finishAwayScore"
                          type="number"
                          min="0"
                          class="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none"
                        />
                      </div>
                    </div>

                    <p v-if="finishError" class="mt-2 text-xs text-rose-200">{{ finishError }}</p>
                    <p v-if="finishOk" class="mt-2 text-xs text-emerald-200">{{ finishOk }}</p>

                    <div class="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="finishing"
                        @click="finishGame(g)"
                      >
                        {{ finishing ? 'Guardando…' : 'Guardar FINAL' }}
                      </button>

                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
                        @click="loadForEditAndFinal(g)"
                      >
                        Abrir en formulario
                      </button>
                    </div>
                  </div>
                </div>

                <p v-if="filteredGamesVm.length === 0" class="text-sm text-slate-300">
                  No hay partidos con esos filtros.
                </p>
              </div>
            </section>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig, useState, useAsyncData } from '#imports'
import { useAuthz } from '~/composables/useAuthz'

/** =========================
 *  AUTH (Keycloak)
 *  ========================= */
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)
const authz: any = useAuthz()

const isAdmin = computed<boolean>(() => {
  const v = authz?.isAdmin
  if (typeof v === 'boolean') return v
  if (v && typeof v === 'object' && 'value' in v) return !!v.value

  const kc = (nuxtApp as any).$kc
  const roles: string[] =
    kc?.tokenParsed?.realm_access?.roles ||
    kc?.tokenParsed?.resource_access?.['nuxt-app']?.roles ||
    []
  return roles.map((r) => String(r).toLowerCase()).includes('admin')
})

/** =========================
 *  API
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const DEFAULT_SEASON_ID = Number((config.public as any)?.seasonId ?? 1)

const API_GAMES = `${API_BASE}/games`
const API_TEAMS = `${API_BASE}/teams`
const API_CATEGORIES = `${API_BASE}/categories`

/** =========================
 *  TYPES
 *  ========================= */
type Category = { id: number; name?: string; code?: string; gender?: string }
type Team = {
  teamId: number
  name: string
  shortName?: string
  logoUrl?: string
  categoryId?: number
  categoryName?: string
  code?: string
  gender?: string
}

type GameVM = {
  id: number
  status: string
  match_date_utc?: string
  dateLabel: string
  timeLabel: string
  homeName: string
  awayName: string
  categoryLabel: string
  seasonId?: number
  categoryId?: number
  homeTeamId?: number
  awayTeamId?: number
  field?: string
  homeScore?: number | null
  awayScore?: number | null
}

/** =========================
 *  HELPERS
 *  ========================= */
function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  return []
}

function upper(v: any) {
  return String(v ?? '').trim().toUpperCase()
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function toLocalDateTime(iso: string) {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` }
}

function localToUtcIso(date: string, time: string) {
  const d = new Date(`${date}T${time}:00`)
  return d.toISOString()
}

/** =========================
 *  FETCH
 *  ========================= */
const { data: teamsData, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'admin-teams',
  async () => {
    const raw = await $fetch(API_TEAMS)
    return unwrapList<any>(raw)
  }
)
const teamsError = computed(() => !!teamsErr.value)

const { data: catData } = useAsyncData('admin-categories', async () => {
  try {
    const raw = await $fetch(API_CATEGORIES)
    return unwrapList<any>(raw)
  } catch {
    return []
  }
})

const categories = computed<Category[]>(() => {
  const list = unwrapList<any>(catData.value)
  return list
    .map((x) => ({
      id: Number(x.id ?? x.categoryId ?? x.category_id),
      name: x.name ?? x.categoryName,
      code: x.code,
      gender: x.gender,
    }))
    .filter((c) => Number.isFinite(c.id))
})

const categoryById = computed(() => {
  const m = new Map<number, Category>()
  for (const c of categories.value) m.set(c.id, c)
  return m
})

const baseTeams = computed<Team[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list.map((x) => ({
    teamId: Number(x.teamId ?? x.team_id ?? x.id),
    name: String(x.name ?? x.teamName ?? 'Equipo'),
    shortName: x.shortName ?? x.short_name ?? '',
    logoUrl: x.logoUrl ?? x.logo_url ?? x.photoUrl ?? x.photo_url ?? null,
    categoryId: Number(x.categoryId ?? x.category_id ?? x.category?.id ?? 0) || undefined,
    categoryName: x.categoryName ?? x.category_name ?? x.category?.name ?? '',
    code: x.code ?? x.category?.code ?? x.rama ?? '',
    gender: x.gender ?? x.category?.gender ?? '',
  }))
})

const teams = computed<Team[]>(() => {
  const map = categoryById.value
  return baseTeams.value.map((t) => {
    const cat = t.categoryId ? map.get(t.categoryId) : null
    const gender = upper(t.gender) || upper(cat?.gender)
    const code = String(t.code ?? '').trim() || String(cat?.code ?? '').trim()
    const categoryName = String(t.categoryName ?? '').trim() || String(cat?.name ?? '').trim()
    return { ...t, gender: gender || '', code: code || '', categoryName: categoryName || t.categoryName || '' }
  })
})

function teamMeta(t: Team) {
  const cat = String(t.categoryName || (t.categoryId ? `Cat ${t.categoryId}` : '')).trim()
  const g = t.gender ? upper(t.gender) : ''
  const code = t.code ? String(t.code).trim() : ''
  return [cat, g, code].filter(Boolean).join(' · ') || '—'
}

const { data: gamesData, pending: gamesPending, error: gamesErr, refresh: refreshGames } = useAsyncData(
  'admin-games',
  async () => {
    const raw = await $fetch(API_GAMES)
    return unwrapList<any>(raw)
  }
)
const gamesError = computed(() => !!gamesErr.value)

const gamesVm = computed<GameVM[]>(() => {
  const list = unwrapList<any>(gamesData.value)
  const catMap = categoryById.value

  return list.map((g) => {
    const id = Number(g.game_id ?? g.gameId ?? g.id)
    const iso = String(g.match_date_utc ?? g.matchDateUtc ?? g.match_date ?? '')
    const status = String(g.status ?? 'SCHEDULED')
    const d = iso ? new Date(iso) : new Date()
    const dateLabel = d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
    const timeLabel = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

    const homeName = String(g.home_team ?? g.homeTeam?.name ?? 'Local')
    const awayName = String(g.away_team ?? g.awayTeam?.name ?? 'Visitante')

    const categoryId = Number(g.category_id ?? g.categoryId ?? g.category?.id ?? 0) || undefined
    const cat = categoryId ? catMap.get(categoryId) : null

    const categoryLabel = [g.category?.name ?? cat?.name, g.category?.gender ?? cat?.gender, g.category?.code ?? cat?.code]
      .filter(Boolean)
      .join(' · ')

    return {
      id,
      status,
      match_date_utc: iso,
      dateLabel,
      timeLabel,
      homeName,
      awayName,
      categoryLabel,
      seasonId: Number(g.season_id ?? g.seasonId ?? 0) || undefined,
      categoryId,
      homeTeamId: Number(g.home_team_id ?? g.homeTeamId ?? g.homeTeam?.teamId ?? 0) || undefined,
      awayTeamId: Number(g.away_team_id ?? g.awayTeamId ?? g.awayTeam?.teamId ?? 0) || undefined,
      field: g.field ?? g.location ?? '',
      homeScore: g.homeScore ?? g.home_score ?? null,
      awayScore: g.awayScore ?? g.away_score ?? null,
    }
  })
})

/** =========================
 *  FILTROS EQUIPOS
 *  ========================= */
const teamGenderPick = ref<'ALL' | string>('ALL')
const teamCodePick = ref('')
const teamQuery = ref('')

const filteredTeams = computed(() => {
  const q = teamQuery.value.toLowerCase().trim()
  const code = teamCodePick.value.toLowerCase().trim()
  const gPick = upper(teamGenderPick.value)

  return teams.value.filter((t) => {
    const tg = upper(t.gender)
    const tc = String(t.code || '').toLowerCase()
    const name = String(t.name || '').toLowerCase()
    const short = String(t.shortName || '').toLowerCase()

    if (gPick !== 'ALL' && tg !== gPick) return false
    if (code && !tc.includes(code)) return false
    if (q && !(name.includes(q) || short.includes(q))) return false
    return true
  })
})

function resetTeamFilters() {
  teamGenderPick.value = 'ALL'
  teamCodePick.value = ''
  teamQuery.value = ''
}

/** =========================
 *  FILTROS PARTIDOS ✅
 *  ========================= */
const gameStatusPick = ref<'ALL' | 'SCHEDULED' | 'FINAL'>('SCHEDULED')
const gameQuery = ref('')

const filteredGamesVm = computed(() => {
  const q = gameQuery.value.toLowerCase().trim()
  const s = gameStatusPick.value

  return gamesVm.value.filter((g) => {
    const st = upper(g.status)
    if (s !== 'ALL' && st !== s) return false
    if (!q) return true
    const a = String(g.homeName || '').toLowerCase()
    const b = String(g.awayName || '').toLowerCase()
    return a.includes(q) || b.includes(q)
  })
})

/** =========================
 *  FORM (crear/editar)
 *  ========================= */
const editingId = ref<number | null>(null)
const homeTeamId = ref<number | null>(null)
const awayTeamId = ref<number | null>(null)

const homeTeam = computed(() => teams.value.find((t) => t.teamId === homeTeamId.value) || null)
const awayTeam = computed(() => teams.value.find((t) => t.teamId === awayTeamId.value) || null)

const form = ref({
  seasonId: DEFAULT_SEASON_ID, // interno (no UI)
  categoryId: 0,
  date: '',
  time: '',
  field: '',
  status: 'SCHEDULED',
  homeScore: 0,
  awayScore: 0,
})

const catHint = computed(() => {
  const c = categories.value.find((x) => x.id === Number(form.value.categoryId))
  if (!c) return ''
  return `${c.name || `Categoría ${c.id}`} · ${c.gender || '—'} · ${c.code || '—'}`
})

function pickHome(t: Team) {
  homeTeamId.value = t.teamId
  if (!form.value.categoryId && t.categoryId) form.value.categoryId = t.categoryId
}
function pickAway(t: Team) {
  awayTeamId.value = t.teamId
  if (!form.value.categoryId && t.categoryId) form.value.categoryId = t.categoryId
}

const saving = ref(false)
const formError = ref('')
const formOk = ref('')

function clearForm() {
  editingId.value = null
  homeTeamId.value = null
  awayTeamId.value = null
  form.value = {
    seasonId: DEFAULT_SEASON_ID,
    categoryId: 0,
    date: '',
    time: '',
    field: '',
    status: 'SCHEDULED',
    homeScore: 0,
    awayScore: 0,
  }
  formError.value = ''
  formOk.value = ''
}

function loadForEdit(g: GameVM) {
  editingId.value = g.id
  homeTeamId.value = g.homeTeamId ?? null
  awayTeamId.value = g.awayTeamId ?? null

  if (g.match_date_utc) {
    const dt = toLocalDateTime(g.match_date_utc)
    form.value.date = dt.date
    form.value.time = dt.time
  } else {
    form.value.date = ''
    form.value.time = ''
  }

  form.value.seasonId = g.seasonId ?? DEFAULT_SEASON_ID
  form.value.categoryId = g.categoryId ?? form.value.categoryId
  form.value.status = upper(g.status) === 'FINAL' ? 'FINAL' : 'SCHEDULED'
  form.value.field = String(g.field ?? '')
  form.value.homeScore = Number(g.homeScore ?? 0)
  form.value.awayScore = Number(g.awayScore ?? 0)

  formOk.value = ''
  formError.value = ''
}

function validateForm() {
  if (!form.value.date) return 'Falta la fecha.'
  if (!form.value.time) return 'Falta la hora.'
  if (!form.value.categoryId || form.value.categoryId < 1) return 'Selecciona categoría del partido.'
  if (!homeTeamId.value) return 'Selecciona equipo Local.'
  if (!awayTeamId.value) return 'Selecciona equipo Visitante.'
  if (homeTeamId.value === awayTeamId.value) return 'Local y Visitante no pueden ser el mismo equipo.'
  if (form.value.status === 'FINAL') {
    if (form.value.homeScore < 0 || form.value.awayScore < 0) return 'Los puntos no pueden ser negativos.'
  }
  return ''
}

async function saveGame() {
  formError.value = ''
  formOk.value = ''

  const msg = validateForm()
  if (msg) {
    formError.value = msg
    return
  }

  saving.value = true
  try {
    const isoUtc = localToUtcIso(form.value.date, form.value.time)
    const seasonId = Number(form.value.seasonId || DEFAULT_SEASON_ID)

    const payload: any = {
      season_id: seasonId,
      seasonId,

      category_id: form.value.categoryId,
      categoryId: form.value.categoryId,

      match_date_utc: isoUtc,
      matchDateUtc: isoUtc,

      status: form.value.status,
      field: form.value.field,
      location: form.value.field,

      home_team_id: homeTeamId.value,
      homeTeamId: homeTeamId.value,

      away_team_id: awayTeamId.value,
      awayTeamId: awayTeamId.value,
    }

    if (form.value.status === 'FINAL') {
      payload.homeScore = Number(form.value.homeScore ?? 0)
      payload.awayScore = Number(form.value.awayScore ?? 0)
      payload.home_score = Number(form.value.homeScore ?? 0)
      payload.away_score = Number(form.value.awayScore ?? 0)
    }

    if (editingId.value) {
      await $fetch(`${API_GAMES}/${editingId.value}`, { method: 'PUT', body: payload })
      formOk.value = `Partido actualizado (ID ${editingId.value}).`
    } else {
      await $fetch(API_GAMES, { method: 'POST', body: payload })
      formOk.value = 'Partido creado.'
    }

    await refreshGames()
    clearForm()
  } catch (e: any) {
    formError.value = e?.data?.message || e?.message || 'No se pudo guardar. Revisa consola / endpoint backend.'
  } finally {
    saving.value = false
  }
}

/** =========================
 *  FINALIZAR DESDE LA LISTA ✅
 *  ========================= */
const finishPanelId = ref<number | null>(null)
const finishHomeScore = ref<number>(0)
const finishAwayScore = ref<number>(0)
const finishing = ref(false)
const finishError = ref('')
const finishOk = ref('')

function openFinish(g: GameVM) {
  finishPanelId.value = g.id
  finishHomeScore.value = Number(g.homeScore ?? 0)
  finishAwayScore.value = Number(g.awayScore ?? 0)
  finishError.value = ''
  finishOk.value = ''
}

function closeFinish() {
  finishPanelId.value = null
  finishError.value = ''
  finishOk.value = ''
}

function loadForEditAndFinal(g: GameVM) {
  loadForEdit(g)
  form.value.status = 'FINAL'
  finishPanelId.value = null
}

async function finishGame(g: GameVM) {
  finishError.value = ''
  finishOk.value = ''

  // Si tu backend requiere IDs para actualizar, valida que existan
  const homeId = g.homeTeamId
  const awayId = g.awayTeamId
  const categoryId = g.categoryId

  if (!homeId || !awayId || !categoryId) {
    finishError.value =
      'Este juego no trae IDs necesarios (home/away/category). Dale “Abrir en formulario” y guárdalo como FINAL.'
    return
  }

  finishing.value = true
  try {
    const seasonId = Number(g.seasonId ?? DEFAULT_SEASON_ID)

    const payload: any = {
      season_id: seasonId,
      seasonId,

      category_id: categoryId,
      categoryId,

      match_date_utc: g.match_date_utc,
      matchDateUtc: g.match_date_utc,

      status: 'FINAL',

      home_team_id: homeId,
      homeTeamId: homeId,

      away_team_id: awayId,
      awayTeamId: awayId,

      homeScore: Number(finishHomeScore.value ?? 0),
      awayScore: Number(finishAwayScore.value ?? 0),
      home_score: Number(finishHomeScore.value ?? 0),
      away_score: Number(finishAwayScore.value ?? 0),
    }

    // si tienes campo/sede guardado
    if (g.field) {
      payload.field = g.field
      payload.location = g.field
    }

    await $fetch(`${API_GAMES}/${g.id}`, { method: 'PUT', body: payload })

    finishOk.value = `Partido ${g.id} marcado como FINAL.`
    await refreshGames()
    // opcional: cerrar panel
    // closeFinish()
  } catch (e: any) {
    finishError.value = e?.data?.message || e?.message || 'No se pudo finalizar. Revisa el backend.'
  } finally {
    finishing.value = false
  }
}

/** =========================
 *  REFRESH
 *  ========================= */
async function hardRefresh() {
  formOk.value = ''
  formError.value = ''
  finishOk.value = ''
  finishError.value = ''
  await Promise.all([refreshTeams(), refreshGames()])
}

/** reset al cambiar status del formulario */
watch(
  () => form.value.status,
  (v) => {
    if (upper(v) !== 'FINAL') {
      form.value.homeScore = 0
      form.value.awayScore = 0
    }
  }
)
</script>
