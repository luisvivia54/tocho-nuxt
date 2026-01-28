<!-- app/pages/estadisticas.vue -->
<template>
  <main class="min-h-screen bg-[#F3F4FF] text-slate-900">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6 pb-10">
        <!-- Tabs internas -->
        <div class="mb-5 flex items-center gap-2">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold border transition"
            :class="view === 'equipos'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
            @click="setView('equipos')"
          >
            Equipos
          </button>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold border transition"
            :class="view === 'jugadores'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
            @click="setView('jugadores')"
          >
            Jugadores
          </button>
        </div>

        <!-- =========================
             VIEW: EQUIPOS
             ========================= -->
        <div v-if="view === 'equipos'">
          <!-- HEADER -->
          <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="min-w-0">
              <h1 class="font-display text-3xl font-extrabold text-slate-900">
                Estadísticas de equipos
              </h1>
              <p class="mt-2 text-slate-600 max-w-2xl">
                Partidos jugados, ganados, perdidos, puntos a favor y en contra, diferencia e índice de victorias.
              </p>

              <!-- FILTROS -->
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- ✅ Temporada -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    Temporada
                  </label>
                  <select
                    v-model="seasonPick"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL">Todas</option>
                    <option v-for="s in seasonOptions" :key="s.id" :value="String(s.id)">
                      {{ s.name }}
                    </option>
                  </select>
                  <p class="mt-1 text-[11px] text-slate-500">
                    Default: <span class="font-semibold text-slate-700">{{ defaultSeasonLabel }}</span>
                  </p>
                </div>

                <!-- Categoría (categoryCode) -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    Categoría (code)
                  </label>
                  <select
                    v-model="selectedCategoryCode"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                      {{ cat.label }}
                    </option>
                  </select>
                </div>

                <!-- Rama (gender) -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    Rama (gender)
                  </label>
                  <select
                    v-model="selectedGender"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="VARONIL">Varonil</option>
                    <option value="FEMENIL">Femenil</option>
                    <option value="MIXTO">Mixto</option>
                  </select>
                </div>

                <!-- Buscar + acciones -->
                <div class="flex flex-col gap-2">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                      Buscar equipo
                    </label>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Ej. Buhos, Aguilas…"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      @click="clearTeamFilters"
                    >
                      Limpiar filtros
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      @click="refreshStandings()"
                    >
                      Refrescar
                    </button>
                  </div>
                </div>
              </div>

              <!-- Ruta actual -->
              <div class="mt-3 flex flex-wrap gap-2 items-center">
                <span class="text-[11px] text-slate-500">Consultando:</span>
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                  {{ pointsUrl }}
                </span>
              </div>
            </div>

            <NuxtLink
              to="/"
              class="hidden sm:inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              ← Volver al inicio
            </NuxtLink>
          </header>

          <!-- ESTADOS -->
          <div v-if="pendingStandings" class="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Cargando estadísticas...
          </div>

          <div v-else-if="errorStandings" class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error al cargar estadísticas.
          </div>

          <!-- CONTENIDO -->
          <div v-else class="mt-6">
            <!-- Vacío -->
            <div
              v-if="filteredRows.length === 0"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600"
            >
              No hay equipos que coincidan con los filtros / búsqueda actual.
              <div class="mt-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearTeamFilters"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <!-- MOBILE: Cards -->
            <div v-else class="md:hidden space-y-3">
              <article
                v-for="row in filteredRows"
                :key="row.key"
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 truncate">{{ row.teamName }}</p>
                    <p class="mt-1 text-xs text-slate-600">
                      Temporada:
                      <span class="font-semibold text-slate-800">{{ row.seasonName }}</span>
                      · Categoría:
                      <span class="font-semibold text-slate-800">{{ row.categoryCode || '—' }}</span>
                      · Rama:
                      <span class="font-semibold text-slate-800">{{ prettyDivision(row.gender) }}</span>
                    </p>
                  </div>

                  <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    {{ row.winRate }}
                  </span>
                </div>

                <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">PJ</p>
                    <p class="font-semibold text-slate-900">{{ row.gp }}</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">G</p>
                    <p class="font-semibold text-slate-900">{{ row.wins }}</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">P</p>
                    <p class="font-semibold text-slate-900">{{ row.losses }}</p>
                  </div>

                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">PF</p>
                    <p class="font-semibold text-slate-900">{{ row.pointsFor }}</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">PC</p>
                    <p class="font-semibold text-slate-900">{{ row.pointsAgainst }}</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 px-3 py-2">
                    <p class="text-slate-500">Diff</p>
                    <p class="font-semibold" :class="row.diff >= 0 ? 'text-emerald-700' : 'text-red-700'">
                      {{ row.diff }}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <!-- DESKTOP: Tabla -->
            <div class="hidden md:block rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-x-auto">
              <table class="min-w-[1020px] w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-500 border-b border-slate-200/80">
                    <th class="px-3 py-2">Equipo</th>
                    <th class="px-3 py-2">Temporada</th>
                    <th class="px-3 py-2">Categoría</th>
                    <th class="px-3 py-2">Rama</th>
                    <th class="px-3 py-2">PJ</th>
                    <th class="px-3 py-2">G</th>
                    <th class="px-3 py-2">P</th>
                    <th class="px-3 py-2">PF</th>
                    <th class="px-3 py-2">PC</th>
                    <th class="px-3 py-2">Diff</th>
                    <th class="px-3 py-2">Índice</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in filteredRows"
                    :key="row.key"
                    class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td class="px-3 py-2 font-semibold text-slate-900">{{ row.teamName }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.seasonName }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.categoryCode || '—' }}</td>

                    <td class="px-3 py-2">
                      <span
                        class="text-xs font-semibold px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-blue-50 text-blue-700': row.gender === 'VARONIL',
                          'bg-pink-50 text-pink-700': row.gender === 'FEMENIL',
                          'bg-emerald-50 text-emerald-700': row.gender === 'MIXTO',
                          'bg-slate-100 text-slate-700': !row.gender
                        }"
                      >
                        {{ prettyDivision(row.gender) }}
                      </span>
                    </td>

                    <td class="px-3 py-2 text-slate-800">{{ row.gp }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.wins }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.losses }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.pointsFor }}</td>
                    <td class="px-3 py-2 text-slate-800">{{ row.pointsAgainst }}</td>

                    <td class="px-3 py-2">
                      <span
                        class="px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="row.diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                      >
                        {{ row.diff }}
                      </span>
                    </td>

                    <td class="px-3 py-2">
                      <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {{ row.winRate }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="filteredRows.length === 0">
                    <td colspan="11" class="px-3 py-3 text-sm text-slate-500">
                      No hay equipos que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Volver mobile -->
            <div class="sm:hidden mt-4">
              <NuxtLink
                to="/"
                class="inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                ← Volver al inicio
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- =========================
             VIEW: JUGADORES
             ========================= -->
        <div v-else>
          <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div class="min-w-0">
              <h1 class="font-display text-3xl font-extrabold text-slate-900">Jugadores</h1>
              <p class="mt-2 text-slate-600 max-w-2xl">
                Ranking por impacto (TD + INT + PA + SACK). Paginado de 10 en 10.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              @click="refreshPlayersAll"
            >
              ⟳ Refrescar
            </button>
          </header>

          <!-- filtros -->
          <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div class="md:col-span-5">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Equipo</label>
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

              <div class="md:col-span-3">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Número</label>
                <input
                  v-model.trim="numberPick"
                  inputmode="numeric"
                  placeholder="Ej. 7"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="md:col-span-4">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Nombre</label>
                <input
                  v-model.trim="namePick"
                  placeholder="Escribe para buscar..."
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="md:col-span-12 flex flex-wrap items-center gap-2 pt-1">
                <p class="text-[11px] text-slate-500">
                  Mostrando <span class="text-slate-900 font-semibold">{{ sortedPlayers.length }}</span> jugador(es)
                </p>
              </div>
            </div>
          </div>

          <!-- estados -->
          <div
            v-if="pendingPlayersAny"
            class="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
          >
            Cargando jugadores...
          </div>

          <div
            v-else-if="errorPlayersAny"
            class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Error al cargar jugadores / equipos.
          </div>

          <!-- lista -->
          <div v-else class="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="text-sm text-slate-600">
                Mostrando <span class="font-semibold text-slate-900">{{ rangeLabel }}</span>
                de <span class="font-semibold text-slate-900">{{ sortedPlayers.length }}</span>
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

                <button
                  class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                  @click="clearPlayerFilters"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div v-if="pagedPlayers.length === 0" class="px-4 py-6 text-sm text-slate-600">
              No hay jugadores para esos filtros.
            </div>

            <div v-else class="p-4 space-y-3">
              <article
                v-for="(p, idx) in pagedPlayers"
                :key="p.id"
                class="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition p-4"
              >
                <div class="flex flex-col md:flex-row md:items-center gap-4">
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 grid place-items-center shrink-0">
                      <span class="text-sm font-extrabold text-slate-700 tabular-nums">
                        {{ pageStartIndex + idx + 1 }}
                      </span>
                    </div>

                    <div class="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        v-if="p.photoUrl"
                        :src="p.photoUrl"
                        :alt="p.fullName"
                        class="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span v-else class="text-[12px] font-extrabold text-slate-700">
                        {{ initials(p.fullName) }}
                      </span>
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                        <p class="font-semibold text-slate-900 truncate max-w-[520px]">
                          {{ p.fullName }}
                        </p>
                        <span v-if="p.number" class="text-slate-500 font-semibold">#{{ p.number }}</span>

                        <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          IMP: <span class="ml-1 text-slate-900 tabular-nums">{{ impact(p) }}</span>
                        </span>
                      </div>

                      <p class="mt-0.5 text-[12px] text-slate-700 truncate">
                        {{ p.teamName || '—' }}
                        <span v-if="p.teamMeta" class="text-slate-500"> · {{ p.teamMeta }}</span>
                      </p>

                      <p class="text-[11px] text-slate-500 truncate">
                        {{ p.gender || '—' }}<span v-if="p.categoryCode"> · {{ p.categoryCode }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="w-full md:w-auto">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div class="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">INT</p>
                        <p class="mt-0.5 text-lg font-extrabold text-fuchsia-700 tabular-nums">{{ p.stats.int }}</p>
                      </div>

                      <div class="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">TD</p>
                        <p class="mt-0.5 text-lg font-extrabold text-violet-700 tabular-nums">{{ p.stats.td }}</p>
                      </div>

                      <div class="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">PA</p>
                        <p class="mt-0.5 text-lg font-extrabold text-sky-700 tabular-nums">{{ p.stats.pa }}</p>
                      </div>

                      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">SACK</p>
                        <p class="mt-0.5 text-lg font-extrabold text-emerald-700 tabular-nums">{{ p.stats.sack }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <div class="text-[11px] text-slate-500">
                Total: <span class="font-semibold text-slate-900">{{ sortedPlayers.length }}</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  :disabled="page <= 1"
                  @click="page = Math.max(1, page - 1)"
                >
                  ← Anterior
                </button>

                <button
                  class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  :disabled="page >= totalPages"
                  @click="page = Math.min(totalPages, page + 1)"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 text-xs text-slate-500">
            Nota: si tu backend no manda stats por jugador aún, se verán en 0. Cuando tengas endpoint real, solo mapeamos campos.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, useRuntimeConfig, useAsyncData } from '#imports'
import { useApi } from '@/composables/useApi'

/* =========================
   Tabs / query param
========================= */
type View = 'equipos' | 'jugadores'
const route = useRoute()
const router = useRouter()

const view = ref<View>(route.query.view === 'jugadores' ? 'jugadores' : 'equipos')

watch(
  () => route.query.view,
  (v) => {
    view.value = v === 'jugadores' ? 'jugadores' : 'equipos'
  }
)

function setView(v: View) {
  view.value = v
  const q: any = { ...route.query }
  if (v === 'jugadores') q.view = 'jugadores'
  else delete q.view
  router.replace({ query: q })
}

/* =========================
   API BASE (1 sola vez)
========================= */
const config = useRuntimeConfig()
const API_BASE = ((config.public as any)?.apiBase as string) || 'https://tocho5-api.tochero5.mx/api'

/* =========================
   EQUIPOS
========================= */
type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO'

interface ApiStanding {
  standingId: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  gp: number
  wins: number
  losses: number
  draws: number
  teamName: string
  gender: Gender | string
  teamId: number
  categoryId: number
  seasonId: number
  categoryCode: string
  seasonName?: string
}

interface RowVM {
  key: string
  teamName: string
  gender: Gender | string
  categoryCode: string
  seasonId: number
  seasonName: string
  gp: number
  wins: number
  losses: number
  draws: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  diff: number
  winRate: string
}

const DEFAULT_SEASON_ID = 2
const seasonPick = ref<'ALL' | string>(String(DEFAULT_SEASON_ID))

type SeasonOpt = { id: number; name: string }

const { data: seasonsRaw } = useAsyncData<any[]>(
  'seasons-stats-lite',
  async () => {
    const try1 = await $fetch<any>(`${API_BASE}/seasons/list`).catch(() => null)
    if (Array.isArray(try1)) return try1
    const try2 = await $fetch<any>(`${API_BASE}/seasons`).catch(() => [])
    return Array.isArray(try2) ? try2 : []
  },
  { server: false, default: () => [] }
)

const seasonOptions = computed<SeasonOpt[]>(() => {
  const list = Array.isArray(seasonsRaw.value) ? seasonsRaw.value : []
  const out = list
    .map((s: any) => {
      const id = Number(s?.id ?? s?.seasonId ?? s?.season_id ?? 0) || 0
      const name = String(s?.name ?? s?.seasonName ?? s?.title ?? `Temporada #${id}`).trim()
      return { id, name }
    })
    .filter((s) => s.id > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  return out
})

const seasonsMap = computed<Record<number, string>>(() => {
  const m: Record<number, string> = {}
  for (const s of seasonOptions.value) m[s.id] = s.name
  return m
})

const defaultSeasonLabel = computed(() => seasonsMap.value[DEFAULT_SEASON_ID] || `Temporada #${DEFAULT_SEASON_ID}`)

const categoryOptions = [
  { label: 'Libre', value: 'Libre' },
  { label: '+35', value: '+35' },
  { label: 'U-8', value: 'U8' },
  { label: 'U-10', value: 'U10' },
  { label: 'U-12', value: 'U12' },
  { label: 'U-14', value: 'U14' },
  { label: 'U-16', value: 'U16' }
]

const selectedCategoryCode = ref<'all' | string>('all')
const selectedGender = ref<'all' | Gender>('all')
const searchQuery = ref('')

const pointsUrl = computed(() => {
  const params = new URLSearchParams()

  // ✅ seasonId
  if (seasonPick.value !== 'ALL') params.set('seasonId', seasonPick.value)

  if (selectedCategoryCode.value !== 'all') params.set('categoryCode', selectedCategoryCode.value)
  if (selectedGender.value !== 'all') params.set('gender', selectedGender.value)

  const qs = params.toString()
  return qs ? `/points?${qs}` : '/points'
})

const { data: standings, pending: pendingStandings, error: errorStandings, refresh: refreshStandings } =
  useApi<ApiStanding[]>(pointsUrl)

// ✅ por si tu backend aún no filtra: filtramos aquí también
const allRows = computed<RowVM[]>(() => {
  const raw = standings.value as unknown
  if (!Array.isArray(raw)) return []
  const rows = raw as ApiStanding[]

  const sp = seasonPick.value === 'ALL' ? 0 : Number(seasonPick.value || 0)

  return rows
    .filter((s) => (sp ? Number(s.seasonId || 0) === sp : true))
    .slice()
    .sort((a, b) => (b.tablePoints ?? 0) - (a.tablePoints ?? 0))
    .map((s) => {
      const gp = s.gp ?? 0
      const wins = s.wins ?? 0
      const losses = s.losses ?? 0
      const draws = s.draws ?? 0
      const pointsFor = s.pointsFor ?? 0
      const pointsAgainst = s.pointsAgainst ?? 0
      const diff = pointsFor - pointsAgainst

      const rate = gp > 0 ? (wins / gp) * 100 : 0
      const winRate =
        Number.isFinite(rate) && rate >= 0
          ? (rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1)) + '%'
          : '0%'

      const sid = Number(s.seasonId || 0)
      const sName =
        String(s.seasonName ?? '').trim() ||
        (sid ? (seasonsMap.value[sid] || `Temporada #${sid}`) : '—')

      return {
        key: `${s.teamId}-${s.seasonId}-${s.categoryId}`,
        teamName: s.teamName ?? '—',
        gender: s.gender ?? '—',
        categoryCode: s.categoryCode ?? '—',
        seasonId: sid,
        seasonName: sName,
        gp,
        wins,
        losses,
        draws,
        pointsFor,
        pointsAgainst,
        tablePoints: s.tablePoints ?? 0,
        diff,
        winRate
      }
    })
})

const filteredRows = computed<RowVM[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRows.value
  return allRows.value.filter((r) => (r.teamName || '').toLowerCase().includes(q))
})

const clearTeamFilters = () => {
  seasonPick.value = String(DEFAULT_SEASON_ID)
  selectedCategoryCode.value = 'all'
  selectedGender.value = 'all'
  searchQuery.value = ''
}

watch(pointsUrl, () => refreshStandings())

const prettyDivision = (division: string | null | undefined): string => {
  if (!division) return '—'
  const up = division.toUpperCase()
  if (up === 'VARONIL') return 'Varonil'
  if (up === 'FEMENIL') return 'Femenil'
  if (up === 'MIXTO') return 'Mixto'
  return division
}

/* =========================
   JUGADORES (API_BASE + $fetch)
========================= */
const API_TEAMS = `${API_BASE}/teams`
const API_PLAYERS = `${API_BASE}/players`

type TeamVM = { teamId: number; name: string; shortName?: string }
type PlayerStats = { td: number; int: number; pa: number; sack: number; rec: number }

type PlayerVM = {
  id: number
  fullName: string
  number?: number | null
  photoUrl?: string | null
  teamId?: number | null
  teamName?: string
  teamMeta?: string
  gender?: string
  categoryCode?: string
  stats: PlayerStats
}

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

const { data: teamsData, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'stats-players-teams',
  async () => {
    if (view.value !== 'jugadores') return []
    const raw = await $fetch<any>(API_TEAMS)
    return unwrapList<any>(raw)
  },
  { default: () => [], watch: [view] }
)

const teamsVm = computed<TeamVM[]>(() => {
  const list = unwrapList<any>(teamsData.value)
  return list
    .map((x) => ({
      teamId: Number(x.teamId ?? x.team_id ?? x.id),
      name: String(x.name ?? x.teamName ?? 'Equipo'),
      shortName: x.shortName ?? x.short_name ?? ''
    }))
    .filter((t) => Number.isFinite(t.teamId))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const teamById = computed(() => {
  const m = new Map<number, TeamVM>()
  for (const t of teamsVm.value) m.set(t.teamId, t)
  return m
})

const teamByNameLower = computed(() => {
  const m = new Map<string, TeamVM>()
  for (const t of teamsVm.value) {
    m.set(String(t.name).toLowerCase(), t)
    if (t.shortName) m.set(String(t.shortName).toLowerCase(), t)
  }
  return m
})

async function fetchPlayersFallbackFromTeams(): Promise<any[]> {
  const teams = teamsVm.value
  if (!teams.length) return []

  const chunks = await Promise.all(
    teams.map(async (t) => {
      try {
        const raw = await $fetch<any>(`${API_TEAMS}/${t.teamId}/players`)
        const list = unwrapList<any>(raw)
        return list.map((p) => ({ ...p, __teamId: t.teamId, __teamName: t.name }))
      } catch {
        return []
      }
    })
  )

  return chunks.flat()
}

const { data: playersData, pending: playersPending, error: playersErr, refresh: refreshPlayers } = useAsyncData(
  'stats-players-all',
  async () => {
    if (view.value !== 'jugadores') return []

    try {
      const raw = await $fetch<any>(API_PLAYERS)
      const list = unwrapList<any>(raw)
      if (list.length) return list
    } catch {
      // ignore
    }

    return await fetchPlayersFallbackFromTeams()
  },
  { default: () => [], watch: [view, teamsData] }
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

      const number = (x.number ?? x.jerseyNumber ?? x.jersey_number ?? x.num ?? null) as any

      let teamId = Number(x.teamId ?? x.team_id ?? x.team?.teamId ?? x.team?.id ?? x.__teamId ?? 0) || null
      let teamName = String(x.teamName ?? x.team_name ?? x.team?.name ?? x.__teamName ?? '').trim() || ''

      if (!teamId && teamName) {
        const tGuess = teamByNameLower.value.get(teamName.toLowerCase())
        if (tGuess) teamId = tGuess.teamId
      }

      const t = teamId ? teamById.value.get(teamId) : undefined
      if (!teamName && t?.name) teamName = t.name

      const td = toNum(x.td ?? x.tds ?? x.touchdowns ?? x.stats?.td ?? x.stats?.tds)
      const it = toNum(x.int ?? x.interceptions ?? x.stats?.int ?? x.stats?.interceptions)
      const pa = toNum(x.pa ?? x.passingTd ?? x.passing_td ?? x.stats?.pa ?? x.stats?.passingTd)
      const sack = toNum(x.sack ?? x.sacks ?? x.stats?.sack ?? x.stats?.sacks)
      const rec = toNum(x.rec ?? x.receptions ?? x.stats?.rec ?? x.stats?.receptions)

      const gender = x.gender ?? x.team?.gender ?? ''
      const categoryCode = x.categoryCode ?? x.category_code ?? x.team?.code ?? ''

      return {
        id,
        fullName,
        number: number == null ? null : toNum(number),
        photoUrl: x.photoUrl ?? x.photo_url ?? x.photo ?? x.avatarUrl ?? null,
        teamId,
        teamName: teamName || undefined,
        teamMeta: '',
        gender: gender ? upper(gender) : '',
        categoryCode: categoryCode ? String(categoryCode) : '',
        stats: { td, int: it, pa, sack, rec }
      } satisfies PlayerVM
    })
    .filter((p) => Number.isFinite(p.id))
})

const teamPick = ref<'ALL' | string>('ALL')
const numberPick = ref('')
const namePick = ref('')

const filteredPlayers = computed(() => {
  const tPick = teamPick.value
  const qNum = numberPick.value.trim()
  const qName = namePick.value.toLowerCase().trim()

  return playersVm.value.filter((p) => {
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
    return true
  })
})

function impact(p: PlayerVM) {
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

const sortedPlayers = computed(() => filteredPlayers.value.slice().sort((a, b) => impact(b) - impact(a)))

function clearPlayerFilters() {
  teamPick.value = 'ALL'
  numberPick.value = ''
  namePick.value = ''
}

/* pagination 10 */
const pageSize = 10
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(sortedPlayers.value.length / pageSize)))

watch([teamPick, numberPick, namePick], () => (page.value = 1))
watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pageStartIndex = computed(() => (page.value - 1) * pageSize)
const pageEndIndex = computed(() => Math.min(sortedPlayers.value.length, pageStartIndex.value + pageSize))
const pagedPlayers = computed(() => sortedPlayers.value.slice(pageStartIndex.value, pageEndIndex.value))

const rangeLabel = computed(() => {
  const total = sortedPlayers.value.length
  if (!total) return '0 - 0'
  return `${pageStartIndex.value + 1} - ${pageEndIndex.value}`
})

const pendingPlayersAny = computed(() => view.value === 'jugadores' && (!!teamsPending.value || !!playersPending.value))
const errorPlayersAny = computed(() => view.value === 'jugadores' && (!!teamsErr.value || !!playersErr.value))

async function refreshPlayersAll() {
  await refreshTeams()
  await refreshPlayers()
}
</script>
