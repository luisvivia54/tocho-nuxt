<template>
  <main class="bg-slate-950 min-h-screen text-slate-50">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto px-6">
        <!-- HEADER -->
        <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div class="space-y-2">
            <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Tochero5 · Admin
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
              Partidos (Admin)
            </h1>
            <p class="text-sm text-slate-300 max-w-xl">
              Crea, programa y marca como finalizados los partidos oficiales.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!isAuthenticated"
              class="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
              @click="login()"
            >
              Iniciar sesión
            </button>

            <button
              v-else-if="!isAdmin"
              class="inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
              disabled
              title="Necesitas rol admin"
            >
              Sin permisos de admin
            </button>

            <button
              v-else
              class="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
              @click="openCreate()"
            >
              + Agregar partido
            </button>
          </div>
        </header>

        <!-- PANEL -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-display text-lg font-semibold text-white">
                Herramientas
              </h2>
              <p class="text-xs text-slate-400">
                Usa “Agregar partido” para crear uno nuevo con filtros por rama/categoría.
              </p>
            </div>
          </div>

          <div class="mt-4 grid md:grid-cols-3 gap-4">
            <div class="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <p class="text-sm text-slate-200 font-semibold">Tip</p>
              <p class="text-sm text-slate-300 mt-1">
                Al abrir “Agregar partido” verás filtros y la lista de equipos disponibles.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <p class="text-xs text-slate-400">Catálogos</p>
              <p class="text-sm text-slate-200 mt-1">
                Categorías: <span class="font-semibold">{{ categoriesCount }}</span>
              </p>
              <p class="text-sm text-slate-200 mt-1">
                Equipos: <span class="font-semibold">{{ teamsCount }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL CREAR PARTIDO -->
    <Teleport to="body">
      <div v-if="createOpen" class="fixed inset-0 z-[80]">
        <!-- overlay (NO CIERRA al click) -->
        <div class="absolute inset-0 bg-black/60"></div>

        <!-- wrapper: centra y deja espacio arriba/abajo -->
        <div class="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <!-- modal: max-height + layout flex para scroll interno -->
          <div
            class="w-full max-w-5xl max-h-[88vh] rounded-2xl border border-slate-800 bg-slate-950
                   shadow-[0_30px_90px_rgba(0,0,0,0.60)] overflow-hidden flex flex-col"
          >
            <!-- header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/40">
              <div>
                <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                  Crear partido
                </p>
                <h3 class="font-display text-xl font-extrabold text-white">
                  Nuevo partido
                </h3>
              </div>

              <!-- (sin botón cerrar aquí) -->
            </div>

            <!-- content (SCROLL INTERNO) -->
            <div class="flex-1 overflow-auto">
              <div class="p-5 grid lg:grid-cols-[360px,1fr] gap-5">
                <!-- Left: filtros + form -->
                <div class="space-y-4">
                  <!-- Filtros -->
                  <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <h4 class="text-sm font-semibold text-white">Filtros</h4>
                    <p class="text-xs text-slate-400 mt-1">
                      Rama y categoría se toman de tus catálogos (backend).
                    </p>

                    <div class="mt-3 space-y-3">
                      <!-- Rama -->
                      <label class="block">
                        <span class="text-[11px] text-slate-400">Rama</span>
                        <select
                          v-model="selectedBranch"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        >
                          <option value="">Todas</option>
                          <option v-for="b in branchOptions" :key="b" :value="b">{{ b }}</option>
                        </select>
                      </label>

                      <!-- Categoría -->
                      <label class="block">
                        <span class="text-[11px] text-slate-400">Categoría</span>
                        <select
                          v-model.number="selectedCategoryId"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        >
                          <option :value="0">Todas</option>
                          <option
                            v-for="c in filteredCategories"
                            :key="getCategoryId(c)"
                            :value="getCategoryId(c)"
                          >
                            {{ getCategoryName(c) }}
                          </option>
                        </select>
                      </label>

                      <!-- Buscar equipo -->
                      <label class="block">
                        <span class="text-[11px] text-slate-400">Buscar equipo</span>
                        <input
                          v-model="teamSearch"
                          type="text"
                          placeholder="Escribe para filtrar..."
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                        />
                      </label>
                    </div>
                  </div>

                  <!-- Form -->
                  <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <h4 class="text-sm font-semibold text-white">Datos del partido</h4>

                    <div class="mt-3 grid grid-cols-1 gap-3">
                      <label class="block">
                        <span class="text-[11px] text-slate-400">Fecha (YYYY-MM-DD)</span>
                        <input
                          v-model="form.date"
                          type="date"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        />
                      </label>

                      <label class="block">
                        <span class="text-[11px] text-slate-400">Hora (HH:mm)</span>
                        <input
                          v-model="form.time"
                          type="time"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        />
                      </label>

                      <label class="block">
                        <span class="text-[11px] text-slate-400">Cancha / Sede (opcional)</span>
                        <input
                          v-model="form.venue"
                          type="text"
                          placeholder="Ej. Miguel Alemán"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                        />
                      </label>

                      <label class="block">
                        <span class="text-[11px] text-slate-400">Local</span>
                        <select
                          v-model.number="form.homeTeamId"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        >
                          <option :value="0" disabled>Selecciona local</option>
                          <option
                            v-for="t in filteredTeams"
                            :key="getTeamId(t)"
                            :value="getTeamId(t)"
                          >
                            {{ getTeamName(t) }}
                          </option>
                        </select>
                      </label>

                      <label class="block">
                        <span class="text-[11px] text-slate-400">Visitante</span>
                        <select
                          v-model.number="form.awayTeamId"
                          class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        >
                          <option :value="0" disabled>Selecciona visitante</option>
                          <option
                            v-for="t in filteredTeams"
                            :key="getTeamId(t)"
                            :value="getTeamId(t)"
                            :disabled="getTeamId(t) === form.homeTeamId"
                          >
                            {{ getTeamName(t) }}
                          </option>
                        </select>
                      </label>
                    </div>

                    <div class="mt-4 flex items-center gap-2">
                      <button
                        class="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!canSubmit"
                        @click="submitCreate()"
                      >
                        Guardar partido
                      </button>

                      <button
                        class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                        @click="resetForm()"
                      >
                        Limpiar
                      </button>
                    </div>

                    <p v-if="createError" class="mt-3 text-sm text-red-300">
                      {{ createError }}
                    </p>
                    <p v-if="createOk" class="mt-3 text-sm text-emerald-300">
                      Partido creado ✅
                    </p>
                  </div>
                </div>

                <!-- Right: lista de equipos -->
                <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h4 class="text-sm font-semibold text-white">
                        Equipos disponibles
                      </h4>
                      <p class="text-xs text-slate-400 mt-1">
                        Se filtran por rama/categoría y búsqueda.
                      </p>
                    </div>
                    <span class="text-[11px] text-slate-400">
                      {{ filteredTeams.length }} equipo(s)
                    </span>
                  </div>

                  <div class="mt-4">
                    <div v-if="teamsPending || catsPending" class="text-sm text-slate-300">
                      Cargando catálogos...
                    </div>

                    <div v-else class="max-h-[520px] overflow-auto pr-1">
                      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <button
                          v-for="t in filteredTeams"
                          :key="getTeamId(t)"
                          type="button"
                          class="group rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950 px-3 py-3 text-left transition"
                          @click="quickPick(t)"
                          :title="`Click para usar como Local/Visitante`"
                        >
                          <div class="text-sm font-semibold text-slate-100">
                            {{ getTeamName(t) }}
                          </div>
                          <div class="mt-1 text-[11px] text-slate-400">
                            Cat: {{ getCategoryLabelForTeam(t) }}
                          </div>
                          <div class="mt-1 text-[11px] text-slate-500">
                            Rama: {{ getTeamBranch(t) || '—' }}
                          </div>

                          <div class="mt-3 flex items-center gap-2">
                            <span
                              class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                              :class="getTeamId(t) === form.homeTeamId ? 'bg-emerald-500/15 text-emerald-200' : 'bg-slate-800 text-slate-300'"
                            >
                              Local
                            </span>
                            <span
                              class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                              :class="getTeamId(t) === form.awayTeamId ? 'bg-blue-500/15 text-blue-200' : 'bg-slate-800 text-slate-300'"
                            >
                              Visitante
                            </span>
                          </div>
                        </button>
                      </div>

                      <div v-if="filteredTeams.length === 0" class="text-sm text-slate-300">
                        No hay equipos con esos filtros.
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-3">
                    <p class="text-xs text-slate-400">
                      Tip: dale click a un equipo para ponerlo rápido como Local/Visitante.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- footer (BOTÓN ÚNICO PARA CERRAR Y VOLVER) -->
            <div class="px-5 py-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">
                Rama/Categoría provienen del backend
              </span>
              <button
                class="inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white"
                @click="closeCreate()"
              >
                Cerrar y volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuthz } from '@/composables/useAuthz'

const { isAdmin, isAuthenticated, login } = useAuthz()

/**
 * ✅ AJUSTA ESTOS 2 ENDPOINTS SI EN TU API SE LLAMAN DIFERENTE
 * - categories: /categories
 * - teams: /teams
 */
const { data: categories, pending: catsPending } = useApi<any[]>('/categories')
const { data: teams, pending: teamsPending } = useApi<any[]>('/teams')

const categoriesCount = computed(() =>
  Array.isArray(categories.value) ? categories.value.length : 0
)
const teamsCount = computed(() =>
  Array.isArray(teams.value) ? teams.value.length : 0
)

/** Helpers robustos */
const getCategoryId = (c: any) => Number(c?.categoryId ?? c?.id ?? c?.category_id ?? 0)
const getCategoryName = (c: any) => String(c?.name ?? c?.categoryName ?? c?.category_name ?? 'Categoría')
const getCategoryBranch = (c: any) =>
  String(c?.branch ?? c?.rama ?? c?.gender ?? c?.gen ?? c?.division ?? '').trim()

const getTeamId = (t: any) => Number(t?.teamId ?? t?.id ?? t?.team_id ?? 0)
const getTeamName = (t: any) => String(t?.name ?? t?.teamName ?? t?.team_name ?? 'Equipo')
const getTeamCategoryId = (t: any) => Number(t?.categoryId ?? t?.category_id ?? t?.category?.id ?? 0)
const getTeamBranch = (t: any) =>
  String(t?.branch ?? t?.rama ?? t?.gender ?? t?.gen ?? t?.category?.branch ?? '').trim()

/** Modal state */
const createOpen = ref(false)
const createOk = ref(false)
const createError = ref('')

const openCreate = () => {
  if (!isAuthenticated.value) return login()
  if (!isAdmin.value) return
  createOk.value = false
  createError.value = ''
  createOpen.value = true
}
const closeCreate = () => {
  createOpen.value = false
}

/** Filtros */
const selectedBranch = ref<string>('')
const selectedCategoryId = ref<number>(0)
const teamSearch = ref('')

const branchOptions = computed<string[]>(() => {
  const cats = Array.isArray(categories.value) ? categories.value : []
  const set = new Set<string>()
  for (const c of cats) {
    const b = getCategoryBranch(c)
    if (b) set.add(b)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredCategories = computed<any[]>(() => {
  const cats = Array.isArray(categories.value) ? categories.value : []
  if (!selectedBranch.value) return cats
  return cats.filter((c) => getCategoryBranch(c) === selectedBranch.value)
})

watch(selectedBranch, () => {
  selectedCategoryId.value = 0
})

const filteredTeams = computed<any[]>(() => {
  const all = Array.isArray(teams.value) ? teams.value : []
  const q = teamSearch.value.trim().toLowerCase()

  return all.filter((t) => {
    if (selectedBranch.value) {
      const tb = getTeamBranch(t)
      const okBranch = tb ? tb === selectedBranch.value : true
      if (!okBranch) return false
    }

    if (selectedCategoryId.value && selectedCategoryId.value !== 0) {
      if (getTeamCategoryId(t) !== selectedCategoryId.value) return false
    }

    if (q) {
      const name = getTeamName(t).toLowerCase()
      if (!name.includes(q)) return false
    }

    return true
  })
})

const getCategoryLabelForTeam = (t: any) => {
  const catId = getTeamCategoryId(t)
  const cats = Array.isArray(categories.value) ? categories.value : []
  const found = cats.find((c) => getCategoryId(c) === catId)
  return found ? getCategoryName(found) : (catId ? `#${catId}` : '—')
}

/** Form */
const form = reactive({
  date: '',
  time: '',
  venue: '',
  homeTeamId: 0,
  awayTeamId: 0,
})

const resetForm = () => {
  form.date = ''
  form.time = ''
  form.venue = ''
  form.homeTeamId = 0
  form.awayTeamId = 0
  createOk.value = false
  createError.value = ''
}

const canSubmit = computed(() => {
  return (
    isAdmin.value &&
    form.date &&
    form.time &&
    form.homeTeamId > 0 &&
    form.awayTeamId > 0 &&
    form.homeTeamId !== form.awayTeamId
  )
})

const quickPick = (t: any) => {
  const id = getTeamId(t)
  if (!id) return

  if (!form.homeTeamId) {
    form.homeTeamId = id
    return
  }
  if (!form.awayTeamId && id !== form.homeTeamId) {
    form.awayTeamId = id
    return
  }
  if (id !== form.homeTeamId) form.awayTeamId = id
}

const submitCreate = async () => {
  createOk.value = false
  createError.value = ''

  if (!canSubmit.value) {
    createError.value = 'Completa fecha, hora y selecciona equipos distintos.'
    return
  }

  const payload = {
    date: form.date,
    time: form.time,
    venue: form.venue || null,
    homeTeamId: form.homeTeamId,
    awayTeamId: form.awayTeamId,
    categoryId:
      selectedCategoryId.value && selectedCategoryId.value !== 0
        ? selectedCategoryId.value
        : null,
    branch: selectedBranch.value || null,
    status: 'SCHEDULED',
  }

  try {
    await $fetch('/api/games', {
      method: 'POST',
      body: payload,
    })
    createOk.value = true
  } catch (e: any) {
    createError.value =
      e?.data?.message ||
      e?.message ||
      'No se pudo crear el partido. Revisa endpoint/payload en backend.'
  }
}
</script>
