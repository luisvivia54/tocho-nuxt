<!-- app/pages/admin/jugadores/index.vue -->
<template>
  <main class="min-h-screen bg-[#F3F4FF] text-slate-900">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6 pb-10">
        <!-- Header -->
        <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Consola Admin</p>

            <div class="mt-1 flex flex-wrap items-center gap-2">
              <h1 class="font-display text-3xl font-extrabold text-slate-900">
                Jugadores (Admin)
              </h1>

              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="authOk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
              >
                {{ authOk ? `Auth OK (${authSource})` : `SIN TOKEN (${authSource || 'no detectado'})` }}
              </span>

              <span
                v-if="playersEndpointUsed"
                class="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                Players: {{ playersEndpointUsed }}
              </span>
            </div>

            <p class="mt-2 text-slate-600 max-w-2xl">
              Información personal, asignación de equipo y edición rápida. (No estadísticas)
            </p>

            <div class="mt-3 flex flex-wrap gap-2 items-center">
              <span class="text-[11px] text-slate-500">Endpoints:</span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                <code class="text-slate-700">{{ API_TEAMS }}</code>
              </span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                <code class="text-slate-700">{{ API_BASE }}</code>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              @click="refreshAll"
            >
              ⟳ Refrescar
            </button>
          </div>
        </header>

        <!-- Notice -->
        <div v-if="notice.text" class="mt-4 rounded-2xl border px-4 py-3 text-sm" :class="noticeClass">
          {{ notice.text }}
        </div>

        <!-- Filtros -->
        <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Equipo -->
            <div class="md:col-span-4">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Equipo
              </label>
              <select
                v-model="teamPick"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos</option>
                <option v-for="t in teamsVm" :key="t.teamId" :value="String(t.teamId)">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <!-- Rama -->
            <div class="md:col-span-3">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Rama
              </label>
              <select
                v-model="genderPick"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todas</option>
                <option value="VARONIL">Varonil</option>
                <option value="FEMENIL">Femenil</option>
                <option value="MIXTO">Mixto</option>
              </select>
            </div>

            <!-- Buscar -->
            <div class="md:col-span-5">
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Buscar (nombre / curp / correo / tel)
              </label>
              <input
                v-model.trim="q"
                placeholder="Ej. Kaori, GARC..., @gmail, 55..."
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="md:col-span-12 flex items-center justify-between gap-2 pt-1">
              <p class="text-[11px] text-slate-500">
                Mostrando <span class="font-semibold text-slate-900">{{ filteredPlayers.length }}</span> jugador(es)
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Estados -->
        <div v-if="pendingAny" class="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Cargando jugadores...
        </div>

        <div
          v-else-if="errorAny"
          class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p class="font-semibold">Error cargando jugadores/equipos.</p>

          <details class="mt-2">
            <summary class="cursor-pointer text-xs font-semibold text-red-700/90">Ver detalle</summary>
            <div class="mt-2 space-y-2 text-xs text-red-800">
              <div v-if="teamsErrMsg">
                <p class="font-semibold">Teams:</p>
                <pre class="whitespace-pre-wrap break-words">{{ teamsErrMsg }}</pre>
              </div>
              <div v-if="playersErrMsg">
                <p class="font-semibold">Players:</p>
                <pre class="whitespace-pre-wrap break-words">{{ playersErrMsg }}</pre>
              </div>
            </div>
          </details>
        </div>

        <!-- Contenido -->
        <div v-else class="mt-4">
          <!-- MOBILE cards -->
          <div class="md:hidden space-y-3">
            <article
              v-for="p in pagedPlayers"
              :key="p.id"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex items-center gap-3">
                  <div class="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                    <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.fullName" class="h-full w-full object-cover" />
                    <span v-else class="text-[12px] font-extrabold text-slate-700">{{ initials(p.fullName) }}</span>
                  </div>

                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 truncate">{{ p.fullName }}</p>
                    <p class="mt-0.5 text-xs text-slate-600 truncate">
                      {{ p.teamName || '—' }}
                      <span v-if="p.number != null" class="text-slate-400"> · #{{ p.number }}</span>
                    </p>
                    <p class="mt-1 text-[11px] text-slate-500 truncate">
                      CURP: <span class="font-semibold text-slate-700">{{ p.curp || '—' }}</span>
                    </p>
                    <p class="text-[11px] text-slate-500 truncate">
                      Tel: <span class="font-semibold text-slate-700">{{ p.phone || '—' }}</span>
                      <span class="text-slate-400"> · </span>
                      Email: <span class="font-semibold text-slate-700">{{ p.email || '—' }}</span>
                    </p>
                  </div>
                </div>

                <button
                  class="shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="openDrawer(p)"
                >
                  Editar
                </button>
              </div>

              <div class="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                  {{ prettyDivision(p.gender) }}
                </span>
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                  Nac: {{ p.birthDate || '—' }}
                </span>
              </div>
            </article>
          </div>

          <!-- DESKTOP table -->
          <div class="hidden md:block rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-x-auto">
            <table class="min-w-[1200px] w-full text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b border-slate-200/80">
                  <th class="px-3 py-2">Jugador</th>
                  <th class="px-3 py-2">Equipo</th>
                  <th class="px-3 py-2">#</th>
                  <th class="px-3 py-2">Rama</th>
                  <th class="px-3 py-2">CURP</th>
                  <th class="px-3 py-2">Teléfono</th>
                  <th class="px-3 py-2">Email</th>
                  <th class="px-3 py-2">Nac.</th>
                  <th class="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="p in pagedPlayers"
                  :key="p.id"
                  class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td class="px-3 py-2">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                        <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.fullName" class="h-full w-full object-cover" />
                        <span v-else class="text-[12px] font-extrabold text-slate-700">{{ initials(p.fullName) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-900 truncate max-w-[340px]">
                          {{ p.fullName }}
                        </p>
                        <p class="text-[11px] text-slate-500 truncate max-w-[340px]">
                          ID: {{ p.id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-2 text-slate-800">{{ p.teamName || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.number ?? '—' }}</td>

                  <td class="px-3 py-2">
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {{ prettyDivision(p.gender) }}
                    </span>
                  </td>

                  <td class="px-3 py-2 text-slate-800">{{ p.curp || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.phone || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.email || '—' }}</td>
                  <td class="px-3 py-2 text-slate-800">{{ p.birthDate || '—' }}</td>

                  <td class="px-3 py-2 text-right">
                    <button
                      class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      @click="openDrawer(p)"
                    >
                      Editar
                    </button>
                  </td>
                </tr>

                <tr v-if="pagedPlayers.length === 0">
                  <td colspan="9" class="px-3 py-3 text-sm text-slate-500">
                    No hay jugadores que coincidan con los filtros.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="text-[11px] text-slate-500">
              Mostrando <span class="font-semibold text-slate-900">{{ rangeLabel }}</span>
              de <span class="font-semibold text-slate-900">{{ filteredPlayers.length }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                :disabled="page <= 1"
                @click="page = Math.max(1, page - 1)"
              >
                ←
              </button>

              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                Página {{ page }} / {{ totalPages }}
              </span>

              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                :disabled="page >= totalPages"
                @click="page = Math.min(totalPages, page + 1)"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-2"
    >
      <div v-if="drawerOpen" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-black/40" @click="closeDrawer" />

        <aside class="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl border-l border-slate-200">
          <div class="h-full flex flex-col">
            <div class="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Editar jugador</p>
                <h2 class="mt-1 font-display text-2xl font-extrabold text-slate-900 truncate">
                  {{ draft.fullName || 'Jugador' }}
                </h2>
                <p class="mt-1 text-sm text-slate-600 truncate">
                  {{ draft.teamName || 'Sin equipo' }}
                  <span v-if="draft.number != null" class="text-slate-400"> · #{{ draft.number }}</span>
                </p>
              </div>

              <button
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="closeDrawer"
              >
                Cerrar
              </button>
            </div>

            <div class="p-5 overflow-auto flex-1">
              <div class="grid grid-cols-1 gap-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Nombre completo</label>
                    <input
                      v-model.trim="draft.fullName"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Número</label>
                    <input
                      v-model.number="draft.number"
                      inputmode="numeric"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej. 10"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">CURP</label>
                    <input
                      v-model.trim="draft.curp"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Fecha de nacimiento</label>
                    <input
                      v-model.trim="draft.birthDate"
                      type="date"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Teléfono</label>
                    <input
                      v-model.trim="draft.phone"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Email</label>
                    <input
                      v-model.trim="draft.email"
                      type="email"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Rama</label>
                    <select
                      v-model="draft.gender"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">—</option>
                      <option value="VARONIL">Varonil</option>
                      <option value="FEMENIL">Femenil</option>
                      <option value="MIXTO">Mixto</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Equipo</label>
                    <select
                      v-model="draft.teamId"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option :value="null">—</option>
                      <option v-for="t in teamsVm" :key="t.teamId" :value="t.teamId">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Foto URL</label>
                  <input
                    v-model.trim="draft.photoUrl"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                  <p class="font-semibold text-slate-700">Qué se guarda:</p>
                  <p class="mt-1">
                    Nombre, número, CURP, fecha nac., tel, email, rama, teamId y fotoUrl.
                  </p>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                :disabled="saving"
                @click="closeDrawer"
              >
                Cancelar
              </button>

              <button
                class="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                :disabled="saving || !draft.id"
                @click="savePlayer"
              >
                {{ saving ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRuntimeConfig, useAsyncData, useNuxtApp } from '#imports'

/* =========================
   API
========================= */
const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()

function normalizeApiBase(v: string) {
  const s = String(v || '').trim().replace(/\/+$/, '')
  if (!s) return 'https://tocho5-api.tochero5.mx/api'
  return s.endsWith('/api') ? s : `${s}/api`
}

const API_BASE = normalizeApiBase(((config.public as any)?.apiBase as string) || 'https://tocho5-api.tochero5.mx')
const API_TEAMS = `${API_BASE}/teams`

/* =========================
   AUTH (Keycloak)
========================= */
const authOk = ref(false)
const authSource = ref('')

function getKeycloakClient(): { source: string; client: any } | null {
  const app: any = nuxtApp as any
  const candidates = [
    { source: '$kc', client: app.$kc },
    { source: '$keycloak', client: app.$keycloak },
    { source: '$keycloakClient', client: app.$keycloakClient }
  ]
  for (const c of candidates) if (c.client) return c
  return null
}

async function getAccessToken(): Promise<{ token: string | null; source: string }> {
  const app: any = nuxtApp as any

  const kcWrap = getKeycloakClient()
  if (kcWrap?.client) {
    const kc: any = kcWrap.client
    try {
      if (kc.updateToken) await kc.updateToken(30)
    } catch {}
    const t = kc.token
    if (typeof t === 'string' && t.length > 20) return { token: t, source: kcWrap.source }
  }

  if (typeof app.$kcGetToken === 'function') {
    try {
      const t = await app.$kcGetToken()
      if (typeof t === 'string' && t.length > 20) return { token: t, source: '$kcGetToken()' }
    } catch {}
  }

  if (typeof app.$getToken === 'function') {
    try {
      const t = await app.$getToken()
      if (typeof t === 'string' && t.length > 20) return { token: t, source: '$getToken()' }
    } catch {}
  }

  return { token: null, source: kcWrap?.source || '' }
}

async function waitForToken(maxMs = 2500) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    const { token, source } = await getAccessToken()
    authSource.value = source
    authOk.value = !!token
    if (token) return token
    await new Promise((r) => setTimeout(r, 120))
  }
  return null
}

type HeadersMap = Record<string, string>
async function authHeaders(json = false): Promise<HeadersMap> {
  const token = await waitForToken()
  const h: HeadersMap = {}
  if (json) h['Content-Type'] = 'application/json'
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

/* =========================
   Helpers
========================= */
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
function prettyDivision(division: string | null | undefined): string {
  if (!division) return '—'
  const up = String(division).toUpperCase()
  if (up === 'VARONIL') return 'Varonil'
  if (up === 'FEMENIL') return 'Femenil'
  if (up === 'MIXTO') return 'Mixto'
  return String(division)
}
function formatErr(e: any) {
  if (!e) return ''
  const status = e?.status || e?.statusCode
  const url = e?.request || e?.url
  const msg = e?.message || String(e)
  const data = e?.data ? JSON.stringify(e.data).slice(0, 900) : ''
  return [status ? `status: ${status}` : '', url ? `url: ${url}` : '', msg ? `message: ${msg}` : '', data ? `data: ${data}` : '']
    .filter(Boolean)
    .join('\n')
}

/* =========================
   Types
========================= */
type TeamVM = { teamId: number; name: string }

type PlayerVM = {
  id: number
  fullName: string
  number: number | null
  photoUrl: string | null
  teamId: number | null
  teamName: string | null
  gender: string | null
  curp: string | null
  phone: string | null
  email: string | null
  birthDate: string | null
}

/* =========================
   Fetch Teams
========================= */
const { data: teamsData, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'admin-players-teams',
  async () => {
    const h = await authHeaders(false)
    try {
      const raw = await $fetch<any>(API_TEAMS, { headers: Object.keys(h).length ? h : undefined })
      return unwrapList<any>(raw)
    } catch {
      const raw = await $fetch<any>(API_TEAMS)
      return unwrapList<any>(raw)
    }
  },
  { default: () => [], server: false }
)

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo')
    }))
    .filter((t) => Number.isFinite(t.teamId))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const teamById = computed(() => {
  const m = new Map<number, TeamVM>()
  for (const t of teamsVm.value) m.set(t.teamId, t)
  return m
})

/* =========================
   Fetch Players (AUTO-DETECT endpoint)
========================= */
const playersEndpointUsed = ref<string>('')

async function tryPlayersEndpoint(url: string, headers: HeadersMap): Promise<any[] | null> {
  try {
    const raw = await $fetch<any>(url, { headers })
    const list = unwrapList<any>(raw)
    return list
  } catch (e: any) {
    const status = e?.status || e?.statusCode
    // si es 404, probamos el siguiente endpoint
    if (status === 404) return null
    // cualquier otro error (401/403/500) lo dejamos “subir”
    throw e
  }
}

async function fetchPlayersAuto(): Promise<any[]> {
  const h = await authHeaders(false)
  if (!h.Authorization) throw new Error('No se pudo obtener token de Keycloak para llamar Players')

  const candidates = [
    `${API_BASE}/players`,
    `${API_BASE}/player`,
    `${API_BASE}/players/all`,
    `${API_BASE}/player/all`
  ]

  for (const url of candidates) {
    const list = await tryPlayersEndpoint(url, h)
    if (list && list.length >= 0) {
      playersEndpointUsed.value = url
      return list
    }
  }

  // fallback: por equipos (/teams/{id}/players)
  const teamsList = unwrapList<any>(teamsData.value)
  const teamIds = teamsList
    .map((t: any) => Number(t.teamId ?? t.team_id ?? t.id))
    .filter((n: number) => Number.isFinite(n))

  if (!teamIds.length) throw new Error('No hay equipos para fallback /teams/{id}/players')

  const chunks = await Promise.all(
    teamIds.map(async (tid) => {
      try {
        const raw = await $fetch<any>(`${API_TEAMS}/${tid}/players`, { headers: h })
        const list = unwrapList<any>(raw)
        return list.map((p: any) => ({ ...p, __teamId: tid }))
      } catch {
        return []
      }
    })
  )

  playersEndpointUsed.value = `${API_TEAMS}/{id}/players`
  return chunks.flat()
}

const { data: playersData, pending: playersPending, error: playersErr, refresh: refreshPlayers } = useAsyncData(
  'admin-players-all',
  async () => {
    playersEndpointUsed.value = ''
    return await fetchPlayersAuto()
  },
  { default: () => [], server: false, watch: [teamsData] }
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

      const numberRaw = x.number ?? x.jerseyNumber ?? x.jersey_number ?? x.num ?? null
      const number = numberRaw == null ? null : toNum(numberRaw)

      const teamIdRaw =
        x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? x.__teamId ?? null
      const teamId = teamIdRaw == null ? null : Number(teamIdRaw) || null

      const teamNameFromApi = String(x.teamName ?? x.team_name ?? x.team?.name ?? '').trim()
      const t = teamId ? teamById.value.get(teamId) : undefined
      const teamName = teamNameFromApi || t?.name || null

      const genderVal = x.gender ?? x.team?.gender ?? null
      const gender = genderVal ? String(genderVal).toUpperCase() : null

      const curp = x.curp ?? x.CURP ?? null
      const phone = x.phone ?? x.telefono ?? x.tel ?? null
      const email = x.email ?? x.correo ?? null

      const bd = x.birthDate ?? x.birth_date ?? x.fechaNacimiento ?? x.fecha_nacimiento ?? null
      const birthDate = bd ? String(bd).slice(0, 10) : null

      const photoUrl = x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null

      return {
        id,
        fullName,
        number,
        photoUrl: photoUrl ? String(photoUrl) : null,
        teamId,
        teamName,
        gender,
        curp: curp ? String(curp) : null,
        phone: phone ? String(phone) : null,
        email: email ? String(email) : null,
        birthDate
      } satisfies PlayerVM
    })
    .filter((p) => Number.isFinite(p.id))
})

/* =========================
   Filters + Pagination
========================= */
const q = ref('')
const teamPick = ref<'ALL' | string>('ALL')
const genderPick = ref<'ALL' | string>('ALL')

const filteredPlayers = computed(() => {
  const qq = q.value.trim().toLowerCase()
  const tPick = teamPick.value
  const gPick = genderPick.value

  return playersVm.value.filter((p) => {
    if (tPick !== 'ALL') {
      const tid = Number(tPick)
      if (Number.isFinite(tid) && p.teamId !== tid) return false
    }
    if (gPick !== 'ALL') {
      if ((p.gender || '').toUpperCase() !== gPick) return false
    }
    if (qq) {
      const blob = [
        p.fullName,
        p.curp,
        p.phone,
        p.email,
        p.teamName,
        p.gender,
        p.birthDate,
        String(p.number ?? '')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!blob.includes(qq)) return false
    }
    return true
  })
})

const pageSize = 12
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlayers.value.length / pageSize)))

watch([q, teamPick, genderPick], () => {
  page.value = 1
})
watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pageStart = computed(() => (page.value - 1) * pageSize)
const pageEnd = computed(() => Math.min(filteredPlayers.value.length, pageStart.value + pageSize))
const pagedPlayers = computed(() => filteredPlayers.value.slice(pageStart.value, pageEnd.value))

const rangeLabel = computed(() => {
  const total = filteredPlayers.value.length
  if (!total) return '0 - 0'
  return `${pageStart.value + 1} - ${pageEnd.value}`
})

function clearFilters() {
  q.value = ''
  teamPick.value = 'ALL'
  genderPick.value = 'ALL'
}

/* =========================
   Drawer + Save
   (intenta PUT/PATCH en /players/{id} y /player/{id})
========================= */
const drawerOpen = ref(false)
const saving = ref(false)

const draft = ref<PlayerVM>({
  id: 0,
  fullName: '',
  number: null,
  photoUrl: null,
  teamId: null,
  teamName: null,
  gender: null,
  curp: null,
  phone: null,
  email: null,
  birthDate: null
})

function openDrawer(p: PlayerVM) {
  draft.value = JSON.parse(JSON.stringify(p))
  drawerOpen.value = true
}
function closeDrawer() {
  drawerOpen.value = false
}

const notice = ref<{ type: 'ok' | 'err' | 'info'; text: string }>({ type: 'info', text: '' })
const noticeClass = computed(() => {
  if (notice.value.type === 'ok') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (notice.value.type === 'err') return 'border-red-200 bg-red-50 text-red-700'
  return 'border-slate-200 bg-white text-slate-700'
})
function setNotice(type: 'ok' | 'err' | 'info', text: string) {
  notice.value = { type, text }
  if (typeof window === 'undefined') return
  window.setTimeout(() => {
    if (notice.value.text === text) notice.value = { type: 'info', text: '' }
  }, 3500)
}

async function savePlayer() {
  if (!draft.value?.id) return
  saving.value = true

  try {
    const h = await authHeaders(true)
    if (!h.Authorization) {
      setNotice('err', 'No hay token de Keycloak. Vuelve a iniciar sesión.')
      return
    }

    const payload: any = {
      fullName: draft.value.fullName,
      number: draft.value.number,
      curp: draft.value.curp,
      phone: draft.value.phone,
      email: draft.value.email,
      birthDate: draft.value.birthDate,
      gender: draft.value.gender,
      teamId: draft.value.teamId,
      photoUrl: draft.value.photoUrl
    }

    const updateCandidates = [
      `${API_BASE}/players/${draft.value.id}`,
      `${API_BASE}/player/${draft.value.id}`
    ]

    let ok = false
    for (const url of updateCandidates) {
      try {
        await $fetch(url, { method: 'PUT', headers: h, body: payload })
        ok = true
        break
      } catch (ePut: any) {
        const st = ePut?.status || ePut?.statusCode
        if (st === 404) continue
        try {
          await $fetch(url, { method: 'PATCH', headers: h, body: payload })
          ok = true
          break
        } catch (ePatch: any) {
          const st2 = ePatch?.status || ePatch?.statusCode
          if (st2 === 404) continue
          throw ePatch
        }
      }
    }

    if (!ok) {
      setNotice('err', 'No encontré endpoint de update (probé /players/{id} y /player/{id}).')
      return
    }

    await refreshPlayers()

    if (draft.value.teamId) {
      const t = teamById.value.get(draft.value.teamId)
      if (t) draft.value.teamName = t.name
    } else {
      draft.value.teamName = null
    }

    setNotice('ok', 'Jugador actualizado correctamente.')
    drawerOpen.value = false
  } catch {
    setNotice('err', 'No se pudo guardar. Revisa endpoint/permiso del backend.')
  } finally {
    saving.value = false
  }
}

/* =========================
   Global refresh
========================= */
const pendingAny = computed(() => !!teamsPending.value || !!playersPending.value)
const errorAny = computed(() => !!teamsErr.value || !!playersErr.value)

const teamsErrMsg = computed(() => formatErr((teamsErr as any).value))
const playersErrMsg = computed(() => formatErr((playersErr as any).value))

async function refreshAll() {
  setNotice('info', 'Refrescando...')
  await refreshTeams()
  await refreshPlayers()
  setNotice('ok', 'Listo.')
}

onMounted(async () => {
  const { token, source } = await getAccessToken()
  authSource.value = source
  authOk.value = !!token
})
</script>
