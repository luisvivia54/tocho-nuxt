<!-- app/pages/admin/equipos.vue -->
<template>
  <main class="min-h-screen bg-[#050816] text-slate-50">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <!-- Header -->
        <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="space-y-2">
            <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              Tochero5 · Panel Admin
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">Equipos</h1>
            <p class="text-sm text-slate-300/80">
              Edita los datos y la división de cada equipo, o desactívalo.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-60"
              :disabled="loading || !canCallApi"
              @click="refresh()"
            >
              {{ loading ? 'Actualizando…' : 'Actualizar' }}
            </button>
          </div>
        </header>

        <!-- Barra de estado -->
        <div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-300/80">Mostrando</span>
              <span
                class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold"
              >
                {{ filteredTeams.length }} / {{ teams.length }}
              </span>
              <span v-if="loading" class="text-xs text-slate-300/70">Cargando…</span>
            </div>

            <div class="text-xs text-slate-300/70">
              Fuente: <span class="font-semibold text-slate-100">{{ sourceLabel || '—' }}</span>
            </div>
          </div>

          <!-- Buscador -->
          <div class="mt-4">
            <label class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Buscar</label>
            <div class="mt-2 relative">
              <input
                v-model="q"
                type="text"
                placeholder="Nombre del equipo…"
                class="w-full rounded-2xl border border-white/10 bg-[#0B1220]/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="errorMsg"
            class="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          >
            <p class="font-semibold">No se pudo cargar la lista.</p>
            <p class="mt-1 text-amber-100/80">{{ errorMsg }}</p>
            <p class="mt-2 text-amber-100/70">
              Tip: este panel intenta <span class="font-semibold">/teams</span> y
              <span class="font-semibold">/teams/list</span>, tanto en la API principal como en la legacy.
            </p>
          </div>

        </div>

        <!-- Tabla -->
        <div class="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div
            class="grid grid-cols-12 gap-0 border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-400"
          >
            <div class="col-span-8 md:col-span-9">Equipo</div>
            <div class="col-span-4 md:col-span-3 text-right">Acciones</div>
          </div>

          <div
            v-if="!loading && filteredTeams.length === 0"
            class="px-4 py-10 text-center text-sm text-slate-300/70"
          >
            No hay equipos para mostrar.
          </div>

          <div
            v-for="t in filteredTeams"
            :key="String(t.id)"
            class="grid grid-cols-12 items-center gap-0 border-b border-white/5 px-4 py-3 last:border-b-0"
          >
            <div class="col-span-8 md:col-span-9 min-w-0">
              <p class="truncate font-semibold text-slate-50">{{ t.name }}</p>

              <p class="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-300/60">
                <span>ID: {{ t.id }}</span>

                <span
                  v-if="t.categoryLabel"
                  class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-semibold text-slate-100"
                >
                  {{ t.categoryLabel }}
                </span>

                <span v-if="t.gender" class="text-slate-400">{{ niceGender(t.gender) }}</span>

                <span v-if="!t.categoryLabel" class="text-amber-300/80">Sin inscripción</span>
              </p>
            </div>

            <div class="col-span-4 md:col-span-3 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="dangerOpen || editOpen"
                @click="openEdit(t)"
              >
                Editar
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="deletingId === String(t.id) || dangerOpen || editOpen"
                @click="openDanger(t)"
              >
                {{ deletingId === String(t.id) ? 'Eliminando…' : 'Borrar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal editar -->
        <div v-if="editOpen && editTeam" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/60" @click="closeEdit" />

          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div
              class="max-h-full w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1220] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            >
              <div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-200/90">
                    editar equipo
                  </p>
                  <h3 class="mt-1 truncate text-base font-extrabold text-white sm:text-lg">
                    {{ editTeam.name }}
                  </h3>
                  <p class="mt-1 text-xs text-slate-400">
                    ID: {{ editTeam.id }}
                    <template v-if="editTeam.categoryLabel"> · {{ editTeam.categoryLabel }}</template>
                    <template v-if="editTeam.gender"> · {{ niceGender(editTeam.gender) }}</template>
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex shrink-0 items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  :disabled="saving"
                  @click="closeEdit"
                >
                  Cerrar
                </button>
              </div>

              <form class="space-y-4 p-5" @submit.prevent="saveEdit">
                <div>
                  <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Nombre
                  </label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    maxlength="80"
                    class="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    :disabled="saving"
                  />
                </div>

                <div>
                  <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Nombre corto
                  </label>
                  <input
                    v-model="editForm.shortName"
                    type="text"
                    maxlength="20"
                    placeholder="Opcional"
                    class="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    :disabled="saving"
                  />
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Color primario
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="editForm.colorPrimary"
                        type="color"
                        class="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-slate-950"
                        :disabled="saving"
                      />
                      <input
                        v-model="editForm.colorPrimary"
                        type="text"
                        maxlength="7"
                        class="w-full min-w-0 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-blue-400/60 focus:outline-none"
                        :disabled="saving"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Color secundario
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="editForm.colorSecondary"
                        type="color"
                        class="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-slate-950"
                        :disabled="saving"
                      />
                      <input
                        v-model="editForm.colorSecondary"
                        type="text"
                        maxlength="7"
                        class="w-full min-w-0 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-blue-400/60 focus:outline-none"
                        :disabled="saving"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    División
                  </label>
                  <select
                    v-if="divisionChoices.length > 1"
                    v-model.number="editForm.categoryId"
                    class="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-blue-400/60 focus:outline-none"
                    :disabled="saving"
                  >
                    <option v-for="c in divisionChoices" :key="c.id" :value="c.id">
                      {{ c.label }}
                    </option>
                  </select>
                  <p v-else class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
                    {{ editTeam.categoryId ? 'Esta categoría no tiene divisiones A/B.' : 'El equipo no tiene inscripción.' }}
                  </p>
                  <p v-if="divisionChanged" class="mt-2 text-[11px] text-amber-200/90">
                    Vas a mover al equipo de división. Solo se puede si todavía no tiene partidos en esta temporada.
                  </p>
                </div>

                <div
                  v-if="editError"
                  class="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-100"
                >
                  {{ editError }}
                </div>

                <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    :disabled="saving"
                    @click="closeEdit"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="saving || !editForm.name.trim()"
                  >
                    {{ saving ? 'Guardando…' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div v-if="dangerOpen" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/60" @click="closeDanger" />

          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div
              class="w-full max-w-xl overflow-hidden rounded-3xl border border-red-500/25 bg-[#0B1220] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            >
              <div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-200/90">
                    zona de peligro
                  </p>
                  <h3 class="mt-1 text-base font-extrabold text-red-100 sm:text-lg">
                    Desactivar equipo
                  </h3>
                  <p class="mt-1 text-xs text-slate-300">
                    Estás por desactivar:
                    <span class="font-semibold text-slate-100">{{ dangerTeam?.name }}</span>
                    <span class="text-slate-400">· ID: {{ dangerTeam?.id }}</span>
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex shrink-0 items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  @click="closeDanger"
                  :disabled="deletingId !== ''"
                >
                  Cerrar
                </button>
              </div>

              <div class="p-5">
                <div class="rounded-2xl border border-red-500/20 bg-red-950/20 p-4">
                  <p class="text-xs font-semibold text-slate-100">Confirmación de seguridad</p>
                  <p class="mt-1 text-[11px] text-slate-300">
                    Para evitar desactivaciones accidentales, escribe exactamente:
                    <span class="font-extrabold text-red-200">ELIMINAR</span>
                  </p>

                  <label class="mb-1 mt-4 block text-[11px] font-semibold text-slate-300">
                    Escribe <span class="font-extrabold text-red-200">ELIMINAR</span> para confirmar
                  </label>

                  <input
                    v-model="deleteConfirmText"
                    type="text"
                    class="w-full rounded-xl border border-red-500/30 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/55"
                    placeholder="ELIMINAR"
                    autocomplete="off"
                    spellcheck="false"
                    :disabled="deletingId !== ''"
                  />

                  <div class="mt-3 flex items-center justify-between gap-3">
                    <p class="text-[11px]" :class="deleteTypedOk ? 'text-emerald-200' : 'text-slate-400'">
                      {{ deleteTypedOk ? '✅ Confirmación válida' : 'Escribe la palabra exacta para habilitar el botón' }}
                    </p>

                    <button
                      type="button"
                      class="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="!deleteTypedOk || deletingId !== ''"
                      @click="confirmDeactivate"
                    >
                      <span v-if="deletingId !== ''">Eliminando…</span>
                      <span v-else>Eliminar definitivamente</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    class="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    :disabled="deletingId !== ''"
                    @click="closeDanger"
                  >
                    Cancelar
                  </button>
                </div>

                <div
                  v-if="toastMsg"
                  class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200"
                >
                  {{ toastMsg }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig, useState, useRouter } from '#imports'
import { $fetch } from 'ofetch'
import { useAuthz } from '~/composables/useAuthz'

function niceGender(g: string) {
  const x = String(g || '').trim().toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}

type Team = {
  id: number | string
  name: string
  shortName: string
  colorPrimary: string
  colorSecondary: string
  leagueId: number | null
  categoryId: number | null
  categoryCode: string
  categoryLabel: string
  gender: string
}

type Category = {
  id: number
  leagueId: number | null
  code: string
  gender: string
  levelOrder: string | null
  label: string
}

type FetchSource = {
  label: string
  url: string
}

const router = useRouter()
const config = useRuntimeConfig()
const nuxtApp = useNuxtApp() as any
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz() as any

function normalizeApiBase(raw?: string) {
  const fallback = 'https://tocho5-api.tochero5.mx/api'
  let base = String(raw || fallback).trim().replace(/\/+$/, '')
  if (!base) base = fallback
  if (/\/api$/i.test(base)) return base
  return `${base}/api`
}

const API_BASE = computed(() =>
  normalizeApiBase((config.public as any)?.apiBase as string | undefined)
)

const isAdmin = computed<boolean>(() => {
  if (!kcReady.value || !isAuthenticated.value) return false
  const kc = nuxtApp.$kc
  const tp = kc?.tokenParsed as any
  if (!tp) return false

  const realmRoles: string[] = tp?.realm_access?.roles ?? []
  const clientKey = tp?.azp || 'nuxt-app'
  const clientRoles: string[] =
    tp?.resource_access?.[clientKey]?.roles ??
    tp?.resource_access?.['nuxt-app']?.roles ??
    []

  return [...realmRoles, ...clientRoles]
    .map((r) => String(r).toLowerCase())
    .includes('admin')
})

const canCallApi = computed<boolean>(() => process.client && kcReady.value && !!isAuthenticated.value && isAdmin.value)

// ======================== LISTADO (GET) ========================
const q = ref('')
const teams = ref<Team[]>([])
const loading = ref(false)
const errorMsg = ref('')
const sourceLabel = ref('')

function buildSources(): FetchSource[] {
  const api = API_BASE.value

  return [
    { label: 'API principal · /teams/list', url: `${api}/teams/list` },
    { label: 'API principal · /teams', url: `${api}/teams` },
    { label: 'Render legacy · /api/teams', url: 'https://tocho5-webservice.onrender.com/api/teams' },
    { label: 'Render legacy · /api/teams/list', url: 'https://tocho5-webservice.onrender.com/api/teams/list' },
  ]
}

function normalizeTeams(payload: any): Team[] {
  const arr =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.teams) ? payload.teams :
    Array.isArray(payload?.content) ? payload.content :
    Array.isArray(payload?.items) ? payload.items :
    Array.isArray(payload?.data) ? payload.data :
    []

  return arr
    .map((t: any) => {
      // /teams/list trae la rama y, desde el cambio de divisiones, tambien
      // categoryLevelOrder ("A" / "B", o "0" cuando la rama no esta dividida).
      const code = String(t?.categoryCode ?? t?.category?.code ?? t?.code ?? '').trim()
      const rawLevel = String(t?.categoryLevelOrder ?? t?.category_level_order ?? '').trim()
      const level = !rawLevel || rawLevel === '0' ? null : rawLevel.toUpperCase()

      const rawCategoryId = Number(t?.categoryId ?? t?.category_id ?? t?.category?.id ?? 0)
      const rawLeagueId = Number(t?.leagueId ?? t?.league_id ?? 0)

      return {
        id: t?.id ?? t?.teamId ?? t?.team_id,
        name: t?.name ?? t?.teamName ?? t?.team_name ?? 'Sin nombre',
        shortName: String(t?.shortName ?? t?.short_name ?? '').trim(),
        colorPrimary: String(t?.colorPrimary ?? t?.color_primary ?? '').trim(),
        colorSecondary: String(t?.colorSecondary ?? t?.color_secondary ?? '').trim(),
        leagueId: rawLeagueId || null,
        categoryId: rawCategoryId || null,
        categoryCode: code,
        categoryLabel: code ? (level ? `${code} ${level}` : code) : '',
        gender: String(t?.categoryGender ?? t?.category?.gender ?? t?.gender ?? '').trim().toUpperCase(),
      }
    })
    .filter((t: Team) => t.id != null)
}

const filteredTeams = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return teams.value
  return teams.value.filter((t) =>
    `${t.name || ''} ${t.categoryLabel || ''} ${t.gender || ''}`.toLowerCase().includes(term)
  )
})

async function fetchFromSource(source: FetchSource) {
  return await $fetch(source.url, {
    method: 'GET',
    timeout: 12000,
  })
}

async function refresh() {
  if (!canCallApi.value) return

  loading.value = true
  errorMsg.value = ''
  sourceLabel.value = ''
  teams.value = []

  const sources = buildSources()

  // Las categorias solo se necesitan para el selector de division del modal.
  fetchCategories()

  for (const s of sources) {
    try {
      const data = await fetchFromSource(s)
      const list = normalizeTeams(data)

      if (list.length >= 0) {
        teams.value = list
        sourceLabel.value = s.label
        loading.value = false
        return
      }
    } catch (e: any) {
      const msg =
        e?.data?.message ||
        e?.response?._data?.message ||
        e?.statusMessage ||
        e?.message ||
        `Error en ${s.url}`

      errorMsg.value = `(${s.label}) ${msg}`
    }
  }

  loading.value = false
}

// ======================== CATEGORIAS (para divisiones) ========================
const categories = ref<Category[]>([])

async function fetchCategories() {
  try {
    const raw = await $fetch<any>(`${API_BASE.value}/categories`, { method: 'GET', timeout: 12000 })
    const arr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []

    categories.value = arr
      .map((c: any) => {
        const rawLevel = String(c?.levelOrder ?? c?.level_order ?? '').trim()
        const levelOrder = !rawLevel || rawLevel === '0' ? null : rawLevel.toUpperCase()
        const name = String(c?.displayName ?? c?.name ?? '').trim()
        return {
          id: Number(c?.id ?? c?.categoryId ?? 0),
          leagueId: Number(c?.leagueId ?? c?.league_id ?? 0) || null,
          code: String(c?.code ?? '').trim(),
          gender: String(c?.gender ?? '').trim().toUpperCase(),
          levelOrder,
          label: levelOrder ? `División ${levelOrder}` : name || `Categoría #${c?.id}`,
        }
      })
      .filter((c: Category) => c.id > 0)
  } catch {
    categories.value = []
  }
}

// ======================== EDITAR ========================
const editOpen = ref(false)
const editTeam = ref<Team | null>(null)
const saving = ref(false)
const editError = ref('')
const editForm = ref({
  name: '',
  shortName: '',
  colorPrimary: '#1D4ED8',
  colorSecondary: '#FFFFFF',
  categoryId: 0,
})

const HEX_RE = /^#[0-9a-fA-F]{6}$/

function safeHex(value: string, fallback: string) {
  const v = String(value || '').trim()
  return HEX_RE.test(v) ? v.toUpperCase() : fallback
}

// Divisiones de la misma rama que la categoria actual del equipo (A, B, ...).
const divisionChoices = computed<Category[]>(() => {
  const team = editTeam.value
  if (!team?.categoryId) return []

  const current = categories.value.find((c) => c.id === team.categoryId)
  if (!current) return []

  return categories.value
    .filter(
      (c) =>
        c.leagueId === current.leagueId &&
        c.code.toUpperCase() === current.code.toUpperCase() &&
        c.gender === current.gender
    )
    .sort((a, b) => (a.levelOrder ?? '').localeCompare(b.levelOrder ?? ''))
})

const divisionChanged = computed(
  () =>
    !!editTeam.value?.categoryId &&
    !!editForm.value.categoryId &&
    editForm.value.categoryId !== editTeam.value.categoryId
)

function openEdit(team: Team) {
  editError.value = ''
  editTeam.value = team
  editForm.value = {
    name: team.name,
    shortName: team.shortName,
    colorPrimary: safeHex(team.colorPrimary, '#1D4ED8'),
    colorSecondary: safeHex(team.colorSecondary, '#FFFFFF'),
    categoryId: team.categoryId ?? 0,
  }
  editOpen.value = true
  if (!categories.value.length) fetchCategories()
}

function closeEdit() {
  if (saving.value) return
  editOpen.value = false
  editTeam.value = null
  editError.value = ''
}

async function saveEdit() {
  const team = editTeam.value
  if (!team) return

  editError.value = ''
  const name = editForm.value.name.trim()
  if (!name) {
    editError.value = 'El nombre del equipo es obligatorio.'
    return
  }

  const colorPrimary = editForm.value.colorPrimary.trim()
  const colorSecondary = editForm.value.colorSecondary.trim()
  if (!HEX_RE.test(colorPrimary) || !HEX_RE.test(colorSecondary)) {
    editError.value = 'Los colores deben tener formato #RRGGBB.'
    return
  }

  const body: Record<string, any> = {
    name,
    shortName: editForm.value.shortName.trim(),
    colorPrimary,
    colorSecondary,
  }
  if (divisionChanged.value) body.categoryId = editForm.value.categoryId

  saving.value = true
  try {
    const token = await getAccessToken()
    if (!token) throw new Error('No hay token. Inicia sesión otra vez.')

    await $fetch(`${API_BASE.value}/admin/teams/${encodeURIComponent(String(team.id))}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
      timeout: 12000,
    })

    // Reflejar el cambio en la lista sin recargar todo.
    const newCategory = body.categoryId
      ? categories.value.find((c) => c.id === body.categoryId)
      : null

    teams.value = teams.value.map((t) => {
      if (String(t.id) !== String(team.id)) return t
      return {
        ...t,
        name,
        shortName: body.shortName,
        colorPrimary,
        colorSecondary,
        ...(newCategory
          ? {
              categoryId: newCategory.id,
              categoryLabel: newCategory.levelOrder
                ? `${t.categoryCode} ${newCategory.levelOrder}`
                : t.categoryCode,
            }
          : {}),
      }
    })

    saving.value = false
    closeEdit()
  } catch (e: any) {
    const status = getStatusCode(e)
    const msg = e?.data?.message || e?.response?._data?.message || e?.message || 'Error guardando cambios'

    if (status === 401) editError.value = 'Tu sesión expiró. Vuelve a iniciar sesión.'
    else if (status === 403) editError.value = 'No autorizado. Revisa que tu usuario sea admin.'
    else if (status === 404) editError.value = 'No se encontró el equipo o el endpoint de edición (¿ya se desplegó el backend?).'
    else editError.value = msg
  } finally {
    saving.value = false
  }
}

// ======================== ELIMINAR (SOFT DELETE) ========================
const deletePhrase = 'ELIMINAR'
const dangerOpen = ref(false)
const dangerTeam = ref<Team | null>(null)
const deleteConfirmText = ref('')
const deletingId = ref('')
const toastMsg = ref('')

const deleteTypedOk = computed(() => deleteConfirmText.value.trim().toUpperCase() === deletePhrase)

function getStatusCode(err: any): number | undefined {
  return err?.statusCode ?? err?.status ?? err?.response?.status ?? err?.response?._data?.status
}

async function getAccessToken(): Promise<string> {
  const kc = nuxtApp.$kc

  try {
    await kc?.updateToken?.(30)
  } catch {
    // ignore
  }

  if (typeof kc?.token === 'string' && kc.token) return kc.token

  try {
    const alt = await nuxtApp.$kcGetToken?.()
    if (typeof alt === 'string' && alt) return alt
  } catch {
    // ignore
  }

  return ''
}

function buildDeactivateUrls(id: string) {
  const safeId = encodeURIComponent(String(id))
  return [
    `${API_BASE.value}/teams/${safeId}/active`,
    `${API_BASE.value}/teams/${safeId}`,
  ]
}

function openDanger(team: Team) {
  toastMsg.value = ''
  dangerTeam.value = team
  deleteConfirmText.value = ''
  dangerOpen.value = true
}

function closeDanger() {
  if (deletingId.value) return
  dangerOpen.value = false
  dangerTeam.value = null
  deleteConfirmText.value = ''
  toastMsg.value = ''
}

async function confirmDeactivate() {
  if (!dangerTeam.value) return

  toastMsg.value = ''
  const id = String(dangerTeam.value.id)

  if (!deleteTypedOk.value) {
    toastMsg.value = `Para continuar, escribe exactamente "${deletePhrase}".`
    return
  }

  deletingId.value = id

  try {
    const token = await getAccessToken()
    if (!token) throw new Error('No hay token. Inicia sesión otra vez.')

    const urls = buildDeactivateUrls(id)
let lastError: any = null
let ok = false

for (const url of urls) {
  try {
    await $fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: { isActive: false },
      timeout: 12000,
    })
    ok = true
    break
  } catch (e: any) {
    lastError = e
    const status = getStatusCode(e)
    if (status !== 404) throw e
  }
}

if (!ok && lastError) throw lastError

    teams.value = teams.value.filter((t) => String(t.id) !== id)

    toastMsg.value = 'Equipo eliminado correctamente.'
    dangerOpen.value = false
    dangerTeam.value = null
    deleteConfirmText.value = ''
  } catch (e: any) {
    const status = getStatusCode(e)
    const msg =
      e?.data?.message ||
      e?.response?._data?.message ||
      e?.statusMessage ||
      e?.message ||
      'Error eliminando equipo'

    if (status === 404) {
      toastMsg.value = '404: No se encontró ni /teams/{id}/active ni /teams/{id}.'
    } else if (status === 409) {
      toastMsg.value = '409: No se puede eliminar porque el equipo tiene relaciones (partidos/rosters).'
    } else if (status === 401) {
      toastMsg.value = '401: Tu sesión expiró. Vuelve a iniciar sesión.'
    } else if (status === 403) {
      toastMsg.value = '403: No autorizado. Revisa rol admin / backend.'
    } else {
      toastMsg.value = msg
    }
  } finally {
    deletingId.value = ''
  }
}

// ======================== INIT ========================
const booted = ref(false)

watch(
  () => ({ ready: kcReady.value, auth: !!isAuthenticated.value, admin: isAdmin.value }),
  async ({ ready, auth, admin }) => {
    if (!ready) return

    if (!auth || !admin) {
      router.replace('/')
      return
    }

    if (!booted.value) {
      booted.value = true
      await refresh()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (kcReady.value && isAuthenticated.value && isAdmin.value && !booted.value) {
    booted.value = true
    await refresh()
  }
})
</script>