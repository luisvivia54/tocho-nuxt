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
              Lista equipos (público) y permite eliminarlos (soft-delete) con API segura y token.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              :disabled="loading"
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
              Tip: si Render está dormido puede tardar o dar 503. Este panel intenta también la API principal.
            </p>
          </div>

          <!-- Nota -->
          <div class="mt-4 text-xs text-slate-300/70">
            ⚠️ El “borrado” aquí es <span class="font-semibold">soft-delete</span>:
            <span class="font-semibold">PATCH /teams/{id}/active</span> con <span class="font-semibold">{ isActive:false }</span>.
            <br />
            Si falla con <span class="font-semibold">409</span>: el equipo tiene relaciones (partidos/rosters) y el backend bloqueó.
            Si falla con <span class="font-semibold">404</span>: revisa la ruta expuesta en tu backend.
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
            class="grid grid-cols-12 items-center gap-0 px-4 py-3 border-b border-white/5 last:border-b-0"
          >
            <div class="col-span-8 md:col-span-9 min-w-0">
              <p class="font-semibold text-slate-50 truncate">{{ t.name }}</p>
              <p class="text-xs text-slate-300/60">ID: {{ t.id }}</p>
            </div>

            <div class="col-span-4 md:col-span-3 flex justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-500/15 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="deletingId === String(t.id) || dangerOpen"
                @click="openDanger(t)"
              >
                {{ deletingId === String(t.id) ? 'Eliminando…' : 'Borrar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- =============== MODAL / ZONA DE PELIGRO (ADMIN LIST) =============== -->
        <div v-if="dangerOpen" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/60" @click="closeDanger" />

          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div
              class="w-full max-w-xl overflow-hidden rounded-3xl border border-red-500/25 bg-[#0B1220] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            >
              <div class="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold tracking-[0.25em] uppercase text-red-200/90">
                    zona de peligro
                  </p>
                  <h3 class="mt-1 text-base sm:text-lg font-extrabold text-red-100">
                    Eliminar equipo
                  </h3>
                  <p class="mt-1 text-xs text-slate-300">
                    Estás por eliminar:
                    <span class="font-semibold text-slate-100">{{ dangerTeam?.name }}</span>
                    <span class="text-slate-400">· ID: {{ dangerTeam?.id }}</span>
                  </p>
                </div>

                <button
                  type="button"
                  class="shrink-0 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
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
                    Para evitar eliminaciones accidentales, escribe exactamente:
                    <span class="font-extrabold text-red-200">ELIMINAR</span>
                  </p>

                  <label class="block mt-4 text-[11px] font-semibold text-slate-300 mb-1">
                    Escribe <span class="text-red-200 font-extrabold">ELIMINAR</span> para confirmar
                  </label>

                  <input
                    v-model="deleteConfirmText"
                    type="text"
                    class="w-full rounded-xl border border-red-500/30 bg-slate-950 px-3 py-2 text-sm text-slate-50
                          focus:outline-none focus:ring-2 focus:ring-red-500/55 focus:border-red-500/70"
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
                      class="inline-flex items-center rounded-xl px-4 py-2 text-xs font-extrabold
                            text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed
                            bg-red-600 hover:bg-red-500"
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

                <div v-if="toastMsg" class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
                  {{ toastMsg }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- =============== /MODAL =============== -->

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp, useRuntimeConfig, useState, useRouter } from '#imports'
import { useAuthz } from '~/composables/useAuthz'

type Team = { id: number | string; name: string }

const router = useRouter()
const config = useRuntimeConfig()
const nuxtApp = useNuxtApp() as any
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz() as any

// ✅ mismo detector de admin que usas en default.vue (simple y efectivo)
const isAdmin = computed<boolean>(() => {
  if (!kcReady.value || !isAuthenticated.value) return false
  const kc = nuxtApp.$kc
  const tp = kc?.tokenParsed as any
  if (!tp) return false
  const realmRoles: string[] = tp?.realm_access?.roles ?? []
  const roles = realmRoles.map((r) => String(r).toLowerCase())
  return roles.includes('admin')
})

// ======================== LISTADO (GET) ========================
/**
 * Fuentes:
 * - 1) API principal (ideal, tu config.public.apiBase)
 * - 2) Render (legacy)
 */
const SOURCES = [
  { label: 'API principal', url: '/teams', baseURL: config.public.apiBase },
  { label: 'Render (legacy)', url: 'https://tocho5-webservice.onrender.com/api/teams' },
]

const q = ref('')
const teams = ref<Team[]>([])
const loading = ref(false)
const errorMsg = ref<string>('')
const sourceLabel = ref<string>('')

// ======================== ELIMINAR (SOFT DELETE) ========================
// ✅ MISMA LÓGICA QUE EN TU VISTA DE DETALLE: PATCH /teams/{id}/active  body: { isActive:false }
const deletePhrase = 'ELIMINAR'
const dangerOpen = ref(false)
const dangerTeam = ref<Team | null>(null)
const deleteConfirmText = ref('')
const deletingId = ref<string>('') // id en proceso
const toastMsg = ref('')

const deleteTypedOk = computed(() => deleteConfirmText.value.trim().toUpperCase() === deletePhrase)
const DEACTIVATE_PATH = computed(() => {
  const id = dangerTeam.value?.id
  if (id == null) return ''
  return `/teams/${encodeURIComponent(String(id))}/active`
})

const filteredTeams = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return teams.value
  return teams.value.filter((t) => String(t.name || '').toLowerCase().includes(term))
})

function normalizeTeams(payload: any): Team[] {
  // acepta varios formatos
  const arr =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.teams) ? payload.teams :
    Array.isArray(payload?.content) ? payload.content :
    []

  return arr
    .map((t: any) => ({
      id: t.id ?? t.teamId ?? t.team_id,
      name: t.name ?? t.teamName ?? t.team_name ?? 'Sin nombre',
    }))
    .filter((t: any) => t.id != null)
}

const getStatusCode = (err: any): number | undefined =>
  err?.statusCode ?? err?.response?.status ?? err?.response?._data?.status ?? err?.status

async function fetchFromSource(s: { url: string; baseURL?: string; label: string }) {
  if (s.baseURL) {
    return await $fetch(s.url, { method: 'GET', baseURL: s.baseURL, timeout: 12000 })
  }
  return await $fetch(s.url, { method: 'GET', timeout: 12000 })
}

async function refresh() {
  if (!isAdmin.value) return

  loading.value = true
  errorMsg.value = ''
  sourceLabel.value = ''
  teams.value = []

  for (const s of SOURCES) {
    try {
      const data = await fetchFromSource(s)
      const list = normalizeTeams(data)

      teams.value = list
      sourceLabel.value = s.label
      loading.value = false
      return
    } catch (e: any) {
      const msg =
        e?.data?.message ||
        e?.statusMessage ||
        e?.message ||
        `Error en ${s.url}`
      errorMsg.value = `(${s.label}) ${msg}`
    }
  }

  loading.value = false
}

// ======= UI: abrir/cerrar modal =======
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

// ======= Acción: soft delete =======
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
    const token = await nuxtApp.$kcGetToken?.()
    if (!token) throw new Error('No hay token. Inicia sesión.')

    await $fetch(DEACTIVATE_PATH.value, {
      baseURL: config.public.apiBase,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: { isActive: false },
      timeout: 12000,
    })

    // ✅ si eliminó: quítalo de la lista
    teams.value = teams.value.filter((t) => String(t.id) !== id)

    toastMsg.value = 'Equipo eliminado correctamente.'
    // UX: cierra modal
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
      toastMsg.value = '404: No se encontró el endpoint PATCH /teams/{id}/active. Revisa tu backend.'
    } else if (status === 409) {
      toastMsg.value = '409: No se puede eliminar porque el equipo tiene relaciones (partidos/rosters).'
    } else if (status === 401) {
      toastMsg.value = '401: Tu sesión expiró. Vuelve a iniciar sesión.'
    } else if (status === 403) {
      toastMsg.value = '403: No autorizado. Revisa rol admin / mapeo de roles en backend.'
    } else {
      toastMsg.value = msg
    }
  } finally {
    deletingId.value = ''
  }
}

onMounted(async () => {
  // si no es admin, lo sacamos
  if (!isAdmin.value) {
    router.push('/')
    return
  }
  await refresh()
})
</script>
