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
              Lista equipos (público) y permite borrarlos (API segura con token).
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
              <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold">
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
          <div v-if="errorMsg" class="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <p class="font-semibold">No se pudo cargar la lista.</p>
            <p class="mt-1 text-amber-100/80">{{ errorMsg }}</p>
            <p class="mt-2 text-amber-100/70">
              Tip: si Render está dormido puede tardar o dar 503. Este panel intenta también la API principal.
            </p>
          </div>

          <!-- Nota 409 -->
          <div class="mt-4 text-xs text-slate-300/70">
            ⚠️ Si al borrar falla con <span class="font-semibold">409</span>: el equipo tiene relaciones (partidos/rosters).
            Si falla con <span class="font-semibold">404</span>: aún no existe el endpoint DELETE en el backend.
          </div>
        </div>

        <!-- Tabla -->
        <div class="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div class="grid grid-cols-12 gap-0 border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
            <div class="col-span-8 md:col-span-9">Equipo</div>
            <div class="col-span-4 md:col-span-3 text-right">Acciones</div>
          </div>

          <div v-if="!loading && filteredTeams.length === 0" class="px-4 py-10 text-center text-sm text-slate-300/70">
            No hay equipos para mostrar.
          </div>

          <div v-for="t in filteredTeams" :key="String(t.id)" class="grid grid-cols-12 items-center gap-0 px-4 py-3 border-b border-white/5 last:border-b-0">
            <div class="col-span-8 md:col-span-9 min-w-0">
              <p class="font-semibold text-slate-50 truncate">{{ t.name }}</p>
              <p class="text-xs text-slate-300/60">ID: {{ t.id }}</p>
            </div>

            <div class="col-span-4 md:col-span-3 flex justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-500/15"
                :disabled="deletingId === String(t.id)"
                @click="confirmDelete(t)"
              >
                {{ deletingId === String(t.id) ? 'Borrando…' : 'Borrar' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp, useState, useRouter } from '#imports'
import { useAuthz } from '~/composables/useAuthz'

type Team = { id: number | string; name: string }

const router = useRouter()
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

/**
 * Fuentes:
 * - 1) API principal (ideal, si existe GET /api/teams)
 * - 2) Render (puede dormir/caerse)
 */
const SOURCES = [
  { label: 'API principal', url: 'https://tocho5-api.tochero5.mx/api/teams' },
  { label: 'Render (legacy)', url: 'https://tocho5-webservice.onrender.com/api/teams' },
]

// Borrado seguro (tu backend debe implementar DELETE /api/admin/teams/{id})
const SECURE_TEAMS_BASE = 'https://tocho5-api.tochero5.mx/api/admin/teams'

const q = ref('')
const teams = ref<Team[]>([])
const loading = ref(false)
const errorMsg = ref<string>('')
const sourceLabel = ref<string>('')

const deletingId = ref<string>('')

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

async function fetchFromSource(url: string) {
  // ofetch/$fetch soporta timeout
  return await $fetch(url, { method: 'GET', timeout: 12000 })
}

async function refresh() {
  if (!isAdmin.value) return

  loading.value = true
  errorMsg.value = ''
  sourceLabel.value = ''
  teams.value = []

  // intenta fuentes en orden
  for (const s of SOURCES) {
    try {
      const data = await fetchFromSource(s.url)
      const list = normalizeTeams(data)

      // si viene vacío pero no error, igual lo aceptamos (puede ser liga sin equipos)
      teams.value = list
      sourceLabel.value = s.label
      loading.value = false
      return
    } catch (e: any) {
      // sigue con la siguiente fuente
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

async function confirmDelete(team: Team) {
  const id = String(team.id)
  const ok = window.confirm(`¿Borrar equipo "${team.name}"? (ID: ${id})`)
  if (!ok) return

  deletingId.value = id
  try {
    const token = await nuxtApp.$kcGetToken?.()
    if (!token) throw new Error('No hay token. Inicia sesión.')

    await $fetch(`${SECURE_TEAMS_BASE}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      timeout: 12000,
    })

    // si borró: quítalo de la lista
    teams.value = teams.value.filter((t) => String(t.id) !== id)
  } catch (e: any) {
    const status = e?.status || e?.response?.status
    if (status === 404) {
      alert('404: El backend aún NO tiene el endpoint DELETE /api/admin/teams/{id}.')
    } else if (status === 409) {
      alert('409: No se puede borrar porque el equipo tiene relaciones (partidos/rosters).')
    } else if (status === 401 || status === 403) {
      alert('No autorizado. Revisa rol admin / mapeo de roles en backend.')
    } else {
      alert(e?.statusMessage || e?.message || 'Error borrando equipo')
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
