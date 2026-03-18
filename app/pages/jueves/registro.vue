<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Registro</p>
            <h1 class="text-3xl md:text-4xl font-extrabold text-white">
              {{ editingTeamId ? "Editar equipo" : "Registro de equipo" }}
            </h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Registra un equipo nuevo o edita uno existente manteniendo el estilo de la liga de jueves.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink
              to="/jueves/mi-equipo"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              Mi equipo
            </NuxtLink>

            <button
              type="button"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
              :disabled="submitting || uploading"
              @click="saveProgress"
            >
              Guardar progreso
            </button>

            <button
              type="button"
              class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/15"
              :disabled="submitting || uploading"
              @click="clearProgress"
            >
              Borrar progreso
            </button>
          </div>
        </header>

        <div v-if="statusMsg" class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {{ statusMsg }}
        </div>

        <div v-if="errorMsg" class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {{ errorMsg }}
        </div>

        <div v-if="!kcReady" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Inicializando sesión…</p>
          <p class="mt-1 text-sm text-slate-400">Espera a que Keycloak esté listo.</p>
        </div>

        <div v-else-if="!isAuthenticated" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Necesitas iniciar sesión</p>
          <p class="mt-1 text-sm text-slate-400">Debes autenticarte para registrar o editar equipos.</p>
          <button
            type="button"
            class="mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white"
            @click="login"
          >
            Iniciar sesión
          </button>
        </div>

        <div v-else class="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
          <!-- FORM -->
          <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div class="border-b border-white/10 pb-4">
              <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Datos del equipo</p>
              <h2 class="mt-2 text-xl font-extrabold text-white">Configuración general</h2>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div class="md:col-span-8">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre del equipo</label>
                <input
                  v-model.trim="team.name"
                  type="text"
                  placeholder="Ej. Tigres del Norte"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                />
              </div>

              <div class="md:col-span-4">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre corto</label>
                <input
                  v-model.trim="team.shortName"
                  type="text"
                  placeholder="Ej. TIG"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                />
              </div>

              <div class="md:col-span-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Liga</label>
                <input
                  :value="LEAGUE_LABEL"
                  disabled
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                />
              </div>

              <div class="md:col-span-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Temporada</label>
                <input
                  :value="SEASON_LABEL"
                  disabled
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                />
              </div>

              <div class="md:col-span-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Categoría</label>
                <select
                  v-model.number="team.categoryId"
                  :disabled="categoriesLoading"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60 disabled:opacity-50"
                >
                  <option :value="0">{{ categoriesLoading ? 'Cargando…' : 'Selecciona categoría' }}</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    {{ c.name }} · {{ niceGender(c.gender) }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Rama</label>
                <input
                  :value="selectedCategory?.code?.toUpperCase() || '—'"
                  disabled
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                />
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color primario</label>
                <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                  <input v-model="team.primaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent" />
                  <input v-model.trim="team.primaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#F97316" />
                </div>
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color secundario</label>
                <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                  <input v-model="team.secondaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent" />
                  <input v-model.trim="team.secondaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#FFFFFF" />
                </div>
              </div>

              <div class="md:col-span-8">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Logo del equipo</label>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <input
                    v-model.trim="team.logoUrl"
                    type="text"
                    placeholder="https://... o /img/..."
                    class="flex-1 rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  />
                  <button
                    type="button"
                    class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
                    :disabled="uploading"
                    @click="pickLogo"
                  >
                    {{ uploading ? "Subiendo…" : "Elegir archivo" }}
                  </button>
                </div>
                <p class="mt-2 text-xs text-slate-500">Sube el logo a R2 y se guarda en el equipo.</p>
              </div>

              <div class="md:col-span-4">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista rápida</label>
                <div class="flex h-[116px] items-center justify-center rounded-3xl border border-white/10 bg-[#0B1020]">
                  <img v-if="team.logoUrl" :src="team.logoUrl" :alt="team.name || 'Logo'" class="max-h-24 max-w-[120px] object-contain" />
                  <span v-else class="text-sm text-slate-500">Sin logo</span>
                </div>
              </div>
            </div>

            <!-- PLAYERS -->
            <div class="mt-8 border-t border-white/10 pt-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Integrantes</p>
                  <h3 class="mt-2 text-xl font-extrabold text-white">Jugadores del equipo</h3>
                  <p class="mt-1 text-sm text-slate-400">
                    Solo se envían los que tengan <strong class="text-slate-200">Nombre + CURP + Foto</strong>. Jersey opcional.
                  </p>
                  <p class="mt-1 text-xs text-slate-500">
                    Se enviarán: <span class="font-extrabold text-white">{{ validPlayers.length }}</span> / {{ team.players.length }}
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  @click="addPlayer"
                >
                  + Agregar integrante
                </button>
              </div>

              <div v-if="team.players.length === 0" class="mt-4 rounded-2xl border border-white/10 bg-[#0B1020]/50 px-4 py-4 text-sm text-slate-400">
                No has agregado integrantes todavía.
              </div>

              <div v-else class="mt-4 space-y-3">
                <div v-for="(player, index) in team.players" :key="player.id" class="rounded-3xl border border-white/10 bg-[#0B1020]/70 p-4">
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <p class="text-sm font-bold text-white">Jugador {{ index + 1 }}</p>
                    <button
                      type="button"
                      class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/15"
                      @click="removePlayer(index)"
                    >
                      Quitar
                    </button>
                  </div>

                  <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div class="md:col-span-5">
                      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre completo</label>
                      <input v-model.trim="player.fullName" type="text" placeholder="Nombre del jugador" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60" />
                    </div>

                    <div class="md:col-span-4">
                      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">CURP</label>
                      <input v-model.trim="player.curp" type="text" placeholder="CURP" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 uppercase outline-none transition focus:border-orange-400/60" />
                    </div>

                    <div class="md:col-span-3">
                      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Jersey</label>
                      <input v-model.trim="player.jerseyNumber" type="text" placeholder="Opcional" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60" />
                    </div>

                    <!-- FOTO: input file + preview (reemplaza el campo de URL) -->
                    <div class="md:col-span-8">
                      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Foto del jugador</label>
                      <p class="mb-2 text-xs text-slate-500">Sin foto, este integrante no se enviará.</p>
                      <input
                        type="file"
                        accept="image/*"
                        class="block w-full text-xs text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-white/15"
                        @change="onPlayerPhotoChange(index, $event)"
                      />
                    </div>

                    <div class="md:col-span-4">
                      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista previa</label>
                      <div class="flex h-[72px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08101E]">
                        <img
                          v-if="player.photoPreview"
                          :src="player.photoPreview"
                          alt="Foto"
                          class="h-full w-full object-cover"
                        />
                        <span v-else class="text-xs text-slate-500">Sin foto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                Se enviarán <span class="font-extrabold text-white">{{ validPlayers.length }}</span> integrante(s) completos.
              </div>
            </div>

            <div class="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button type="button" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10" :disabled="submitting || uploading" @click="saveProgress">
                Guardar progreso
              </button>
              <button type="button" class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 hover:bg-rose-500/15" :disabled="submitting || uploading" @click="clearProgress">
                Borrar progreso
              </button>
              <button type="button" class="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110 disabled:opacity-50" :disabled="submitting || uploading" @click="submitTeam">
                {{ submitting ? "Guardando…" : submitLabel }}
              </button>
            </div>
          </section>

          <!-- PREVIEW -->
          <aside class="space-y-5">
            <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Vista previa</p>
              <h3 class="mt-2 text-xl font-extrabold text-white">Resumen del equipo</h3>

              <div class="mt-5 rounded-3xl border border-white/10 bg-[#081122] p-5">
                <div class="flex items-start gap-4">
                  <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]">
                    <img v-if="team.logoUrl" :src="team.logoUrl" :alt="team.name || 'Logo'" class="max-h-16 max-w-16 object-contain" />
                    <span v-else class="text-xs text-slate-500">Logo</span>
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-2xl font-extrabold text-white">{{ team.name || "Nombre del equipo" }}</p>
                    <p class="mt-1 text-sm text-slate-400">{{ team.shortName || "Sin nombre corto" }}</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <span class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200">
                        {{ selectedCategory?.name || "Sin categoría" }}
                      </span>
                      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {{ selectedCategory?.code?.toUpperCase() || "—" }}
                      </span>
                      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {{ selectedCategory ? niceGender(selectedCategory.gender) : "—" }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-2 gap-3">
                  <div class="rounded-2xl border border-white/10 bg-[#0B1020] p-3">
                    <p class="text-[11px] uppercase tracking-wide text-slate-500">Color primario</p>
                    <div class="mt-2 flex items-center gap-3">
                      <span class="h-5 w-5 rounded-full border border-white/10" :style="{ backgroundColor: team.primaryColor || '#F97316' }" />
                      <span class="text-sm text-slate-200">{{ team.primaryColor || "—" }}</span>
                    </div>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-[#0B1020] p-3">
                    <p class="text-[11px] uppercase tracking-wide text-slate-500">Color secundario</p>
                    <div class="mt-2 flex items-center gap-3">
                      <span class="h-5 w-5 rounded-full border border-white/10" :style="{ backgroundColor: team.secondaryColor || '#FFFFFF' }" />
                      <span class="text-sm text-slate-200">{{ team.secondaryColor || "—" }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-5">
                  <p class="text-[11px] uppercase tracking-wide text-slate-500">Integrantes completos</p>
                  <div class="mt-2 space-y-2">
                    <div v-for="player in validPlayers.slice(0, 6)" :key="player.id" class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                      <span class="truncate text-sm text-slate-200">{{ player.fullName }}</span>
                      <span class="text-xs text-slate-500">{{ player.jerseyNumber || "—" }}</span>
                    </div>
                    <div v-if="validPlayers.length === 0" class="rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-3 text-sm text-slate-500">
                      Sin integrantes completos todavía.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>

    <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="onLogoChange" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useNuxtApp, useRoute, useRouter, useRuntimeConfig, useState } from "#imports"
import { useAuthz } from "~/composables/useAuthz"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

/* =========================
   CONSTANTES — solo cambia aquí
========================= */
const LEAGUE_ID    = 2
const SEASON_ID    = 3
const LEAGUE_LABEL = "Liga de Jueves"
const SEASON_LABEL = "Nocturna"

type HeadersMap = Record<string, string>

type Category = {
  id: number
  name: string
  code: string
  gender: string
}

type PlayerDraft = {
  id: string
  fullName: string
  curp: string
  jerseyNumber: string
  photoFile: File | null      // ← archivo real
  photoPreview: string | null // ← URL temporal para mostrar
}

type TeamDraft = {
  id: number | null
  name: string
  shortName: string
  categoryId: number
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  players: PlayerDraft[]
}

function normalizeApiBase(v: string) {
  const s = String(v || "").trim().replace(/\/+$/, "")
  if (!s) return "https://tocho5-api.tochero5.mx/api"
  return s.endsWith("/api") ? s : `${s}/api`
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

function niceGender(g: string) {
  const x = String(g || "").toUpperCase()
  if (x === "VARONIL") return "Varonil"
  if (x === "FEMENIL") return "Femenil"
  if (x === "MIXTO") return "Mixto"
  return g || "—"
}

function createEmptyPlayer(): PlayerDraft {
  return { id: uid("pl"), fullName: "", curp: "", jerseyNumber: "", photoFile: null, photoPreview: null }
}

function createEmptyTeam(): TeamDraft {
  return { id: null, name: "", shortName: "", categoryId: 0, primaryColor: "#F97316", secondaryColor: "#FFFFFF", logoUrl: "", players: [] }
}

/* =========================
   AUTH
========================= */
const nuxtApp = useNuxtApp()
const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()
const kcReady = useState<boolean>("kcReady", () => false)
const authz: any = useAuthz()

const isAuthenticated = computed<boolean>(() => {
  const kc = (nuxtApp as any).$kc
  return !!kc?.authenticated
})

function login() {
  const kc = (nuxtApp as any).$kc
  if (!kc?.login) return
  kc.login({ redirectUri: window.location.href })
}

async function getAccessToken(): Promise<string | null> {
  const app: any = nuxtApp as any
  const kc: any = app.$kc
  try { await kc?.updateToken?.(30) } catch {}
  if (typeof kc?.token === "string" && kc.token.length > 20) return kc.token
  if (typeof app.$kcGetToken === "function") {
    try { const t = await app.$kcGetToken(); if (typeof t === "string" && t.length > 20) return t } catch {}
  }
  if (typeof app.$getToken === "function") {
    try { const t = await app.$getToken(); if (typeof t === "string" && t.length > 20) return t } catch {}
  }
  return null
}

async function authHeaders(json = false): Promise<HeadersMap> {
  const token = await getAccessToken()
  const h: HeadersMap = {}
  if (json) h["Content-Type"] = "application/json"
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

/* =========================
   API
========================= */
const API_BASE = normalizeApiBase(((runtime.public as any)?.apiBase as string) || "https://tocho5-api.tochero5.mx")
const ASSET_UPLOAD_ENDPOINT = `${API_BASE}/assets/upload`
const TEAM_CREATE_URL = `${API_BASE}/teams/mine`

function TEAM_UPDATE_URL(id: number) { return `${API_BASE}/teams/${id}` }
function TEAM_FETCH_URL(id: number) { return `${API_BASE}/teams/${id}` }

/* =========================
   CATEGORÍAS
========================= */
const categories = ref<Category[]>([])
const categoriesLoading = ref(false)

async function fetchCategories() {
  categoriesLoading.value = true
  try {
    const url = `${API_BASE}/categories?leagueId=${LEAGUE_ID}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw = await res.json()
    const arr = Array.isArray(raw) ? raw
      : Array.isArray(raw?.content) ? raw.content
      : Array.isArray(raw?.items) ? raw.items
      : Array.isArray(raw?.data) ? raw.data : []
    categories.value = arr
      .map((c: any) => ({
        id: Number(c?.id ?? c?.categoryId ?? 0) || 0,
        name: String(c?.name ?? "").trim(),
        code: String(c?.code ?? "").trim(),
        gender: String(c?.gender ?? "").trim(),
      }))
      .filter((c: Category) => c.id > 0 && !!c.name)
  } catch (e) {
    console.error("Error cargando categorías:", e)
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

const selectedCategory = computed<Category | null>(() =>
  categories.value.find((c) => c.id === team.value.categoryId) || null
)

/* =========================
   ESTADO FORM
========================= */
const editingTeamId = computed<number | null>(() => {
  const id = Number(route.query.teamId ?? 0)
  return Number.isFinite(id) && id > 0 ? id : null
})

const storageKey = computed(() =>
  editingTeamId.value ? `jueves-registro-edit-${editingTeamId.value}` : "jueves-registro-create"
)

const team = ref<TeamDraft>(createEmptyTeam())
const serverSnapshot = ref<TeamDraft>(createEmptyTeam())
const statusMsg = ref("")
const errorMsg = ref("")
const submitting = ref(false)
const uploading = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

// validPlayers: necesitan nombre + curp + foto
const validPlayers = computed(() =>
  team.value.players.filter((p) => p.fullName.trim() && p.curp.trim() && p.photoFile)
)

const submitLabel = computed(() => editingTeamId.value ? "Guardar cambios" : "Registrar equipo")

function saveProgress() {
  if (!import.meta.client) return
  // No guardamos photoFile en localStorage (no serializable), solo los campos de texto
  const toSave = {
    ...team.value,
    players: team.value.players.map(p => ({
      id: p.id, fullName: p.fullName, curp: p.curp, jerseyNumber: p.jerseyNumber
    }))
  }
  localStorage.setItem(storageKey.value, JSON.stringify(toSave))
  errorMsg.value = ""
  statusMsg.value = "Progreso guardado localmente."
}

function clearProgress() {
  if (import.meta.client) localStorage.removeItem(storageKey.value)
  // revocar object URLs antes de limpiar
  for (const p of team.value.players) {
    if (p.photoPreview) URL.revokeObjectURL(p.photoPreview)
  }
  team.value = editingTeamId.value ? clone(serverSnapshot.value) : createEmptyTeam()
  errorMsg.value = ""
  statusMsg.value = "Progreso local borrado."
}

function addPlayer() { team.value.players.push(createEmptyPlayer()) }

function removePlayer(index: number) {
  const p = team.value.players[index]
  if (p?.photoPreview) URL.revokeObjectURL(p.photoPreview)
  team.value.players.splice(index, 1)
}

function pickLogo() { logoInput.value?.click() }

// Manejo de foto de jugador con input file
function onPlayerPhotoChange(index: number, event: Event) {
  const player = team.value.players[index]
  if (!player) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
  player.photoFile = file
  player.photoPreview = file ? URL.createObjectURL(file) : null
}

async function uploadAsset(folder: string, file: File) {
  const token = await getAccessToken()
  if (!token) throw new Error("No hay sesión activa.")
  const fd = new FormData()
  fd.append("folder", folder)
  fd.append("file", file)
  const res = await fetch(ASSET_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  const text = await res.text()
  let json: any = null
  try { json = text ? JSON.parse(text) : null } catch {}
  if (!res.ok) throw new Error((json?.message || json?.error) || `${res.status} ${res.statusText}`)
  return json
}

async function onLogoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return
  uploading.value = true
  errorMsg.value = ""
  statusMsg.value = "Subiendo logo…"
  try {
    const res = await uploadAsset("site/jueves/teams/logos", file)
    const publicUrl = String(res?.publicUrl || "")
    if (!publicUrl) throw new Error("La API no regresó publicUrl.")
    team.value.logoUrl = publicUrl
    statusMsg.value = "Logo subido correctamente."
  } catch (e: any) {
    errorMsg.value = e?.message || "No se pudo subir el logo."
  } finally {
    uploading.value = false
  }
}

function normalizeTeamFromApi(raw: any): TeamDraft {
  const rosterRaw =
    Array.isArray(raw?.players) ? raw.players :
    Array.isArray(raw?.members) ? raw.members :
    Array.isArray(raw?.roster) ? raw.roster : []
  return {
    id: Number(raw?.id ?? raw?.teamId ?? raw?.team_id ?? 0) || null,
    name: String(raw?.name ?? raw?.teamName ?? ""),
    shortName: String(raw?.shortName ?? raw?.short_name ?? raw?.abbr ?? ""),
    categoryId: Number(raw?.categoryId ?? raw?.category_id ?? raw?.category?.id ?? 0) || 0,
    primaryColor: String(raw?.primaryColor ?? raw?.primary_color ?? "#F97316"),
    secondaryColor: String(raw?.secondaryColor ?? raw?.secondary_color ?? "#FFFFFF"),
    logoUrl: String(raw?.logoUrl ?? raw?.logo_url ?? raw?.photoUrl ?? raw?.photo_url ?? ""),
    players: rosterRaw.map((p: any) => ({
      id: uid("pl"),
      fullName: String(p?.fullName ?? p?.full_name ?? p?.name ?? ""),
      curp: String(p?.curp ?? p?.CURP ?? ""),
      jerseyNumber: String(p?.jerseyNumber ?? p?.jersey_number ?? p?.number ?? ""),
      photoFile: null,
      photoPreview: null,
    })),
  }
}

async function fetchExistingTeam(id: number) {
  const headers = await authHeaders(false)
  try {
    const raw = await fetch(TEAM_FETCH_URL(id), {
      headers: headers.Authorization ? { Authorization: headers.Authorization } : {},
    })
    if (!raw.ok) throw new Error(`HTTP ${raw.status}`)
    const data = await raw.json()
    const normalized = normalizeTeamFromApi(data)
    team.value = clone(normalized)
    serverSnapshot.value = clone(normalized)
    statusMsg.value = "Equipo cargado para edición."
  } catch (e: any) {
    errorMsg.value = e?.message || "No se pudo cargar el equipo."
  }
}

function buildTeamPayload() {
  return {
    id: team.value.id,
    teamId: team.value.id,
    name: team.value.name.trim(),
    teamName: team.value.name.trim(),
    shortName: team.value.shortName.trim(),
    short_name: team.value.shortName.trim(),
    categoryId: team.value.categoryId,
    category_id: team.value.categoryId,
    seasonId: SEASON_ID,
    season_id: SEASON_ID,
    leagueId: LEAGUE_ID,
    league_id: LEAGUE_ID,
    primaryColor: team.value.primaryColor.trim(),
    primary_color: team.value.primaryColor.trim(),
    secondaryColor: team.value.secondaryColor.trim(),
    secondary_color: team.value.secondaryColor.trim(),
    logoUrl: team.value.logoUrl.trim(),
    logo_url: team.value.logoUrl.trim(),
  }
}

function validateTeam() {
  if (!team.value.name.trim()) return "Escribe el nombre del equipo."
  if (!team.value.shortName.trim()) return "Escribe el nombre corto."
  if (!team.value.categoryId) return "Selecciona una categoría."
  return ""
}

async function submitTeam() {
  errorMsg.value = ""
  statusMsg.value = ""
  const validation = validateTeam()
  if (validation) { errorMsg.value = validation; return }

  submitting.value = true
  try {
    const headers = await authHeaders(true)
    if (!headers.Authorization) throw new Error("No hay sesión activa.")
    const token = headers.Authorization.replace("Bearer ", "")

    let res: any = null

    if (editingTeamId.value) {
      const url = TEAM_UPDATE_URL(editingTeamId.value)
      try {
        const r = await fetch(url, { method: "PUT", headers, body: JSON.stringify(buildTeamPayload()) })
        res = await r.json()
      } catch {
        const r = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(buildTeamPayload()) })
        res = await r.json()
      }
    } else {
      const r = await fetch(TEAM_CREATE_URL, { method: "POST", headers, body: JSON.stringify(buildTeamPayload()) })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        throw new Error(err?.message || `Error ${r.status}`)
      }
      res = await r.json()
    }

    const newId = Number(res?.id ?? res?.teamId ?? res?.team_id ?? editingTeamId.value ?? 0) || null
    if (newId) team.value.id = newId

    // Subir jugadores válidos (con foto) uno por uno como multipart
    if (newId && validPlayers.value.length > 0) {
      for (const p of validPlayers.value) {
        try {
          const fd = new FormData()
          fd.append("fullName", p.fullName.trim())
          fd.append("curp", p.curp.trim().toUpperCase())
          if (p.jerseyNumber) fd.append("jerseyNumber", p.jerseyNumber)
          fd.append("photo", p.photoFile as File)

          await fetch(`${API_BASE}/teams/${newId}/players`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          })
        } catch (errPlayer) {
          console.error("Error subiendo jugador:", errPlayer)
        }
      }
    }

    serverSnapshot.value = clone(team.value)
    if (import.meta.client) localStorage.removeItem(storageKey.value)

    statusMsg.value = editingTeamId.value ? "Equipo actualizado correctamente." : "Equipo registrado correctamente."
    setTimeout(() => {
      router.push(`/jueves/mi-equipo${newId ? `?highlight=${newId}` : ""}`)
    }, 600)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || "No se pudo guardar el equipo."
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  errorMsg.value = ""
  statusMsg.value = ""

  await fetchCategories()

  if (editingTeamId.value) await fetchExistingTeam(editingTeamId.value)

  if (import.meta.client) {
    const saved = localStorage.getItem(storageKey.value)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        team.value = {
          ...createEmptyTeam(),
          ...parsed,
          players: Array.isArray(parsed?.players)
            ? parsed.players.map((p: any) => ({
                id: String(p?.id || uid("pl")),
                fullName: String(p?.fullName || ""),
                curp: String(p?.curp || ""),
                jerseyNumber: String(p?.jerseyNumber || ""),
                photoFile: null,
                photoPreview: null,
              }))
            : [],
        }
        statusMsg.value = editingTeamId.value ? "Se restauró tu progreso local para esta edición." : "Se restauró tu progreso local."
      } catch {}
    }
  }
})
</script>