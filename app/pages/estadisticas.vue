<template>
  <main class="bg-[#050816] text-slate-50 min-h-screen">
    <section class="pt-16 md:pt-16 lg:pt-16">
      <div class="max-w-6xl mx-auto container-pad px-4 sm:px-6">
        <!-- TABS -->
        <div class="mb-5 flex items-center gap-2">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold border transition"
            :class="view === 'equipos'
              ? 'bg-white text-slate-900 border-white'
              : 'bg-slate-900/70 text-slate-200 border-slate-700 hover:border-slate-500'"
            @click="setView('equipos')"
          >
            Equipos
          </button>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold border transition"
            :class="view === 'jugadores'
              ? 'bg-white text-slate-900 border-white'
              : 'bg-slate-900/70 text-slate-200 border-slate-700 hover:border-slate-500'"
            @click="setView('jugadores')"
          >
            Jugadores
          </button>
        </div>

        <!-- HEADER -->
        <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div v-once>
            <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Tochero5 · Liga domingo
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
              {{ view === 'equipos' ? 'Estadísticas de equipos' : 'Estadísticas de jugadores' }}
            </h1>
            <p class="mt-1 text-sm md:text-base text-slate-400 max-w-xl">
              {{ view === 'equipos'
                ? 'Tabla y métricas únicamente de equipos que pertenecen a la liga de domingo.'
                : 'Ranking de jugadores filtrado únicamente con equipos reales de la liga de domingo.' }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 shadow-lg backdrop-blur">
            <p class="font-semibold text-slate-100">
              {{ view === 'equipos'
                ? `${filteredRows.length} equipo${filteredRows.length === 1 ? '' : 's'}`
                : `${sortedPlayers.length} jugador${sortedPlayers.length === 1 ? '' : 'es'}` }}
            </p>
            <p class="mt-0.5">
              Filtros:
              <span class="text-slate-100 font-semibold">{{ selectedRamaLabel }}</span>
              ·
              <span class="text-slate-100 font-semibold">{{ selectedCategoriaLabel }}</span>
            </p>
          </div>
        </header>

        <!-- FILTROS GLOBALES -->
        <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              <!-- Rama -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Rama (code)</label>
                <div class="relative">
                  <select
                    v-model="selectedRama"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="categoriesPending"
                  >
                    <option value="all">Todas</option>
                    <option v-for="code in ramaOptions" :key="code" :value="code">
                      {{ code }}
                    </option>
                  </select>

                  <button
                    v-if="selectedRama !== 'all'"
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    @click="clearRama"
                    aria-label="Quitar filtro de rama"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Categoría (gender)</label>
                <div class="relative">
                  <select
                    v-model="selectedCategoria"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="categoriesPending"
                  >
                    <option value="all">Todas</option>
                    <option v-for="g in categoriaOptions" :key="g" :value="g">
                      {{ niceGender(g) }}
                    </option>
                  </select>

                  <button
                    v-if="selectedCategoria !== 'all'"
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    @click="clearCategoria"
                    aria-label="Quitar filtro de categoría"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Buscar -->
              <div v-if="view === 'equipos'">
                <label class="block text-xs font-semibold text-slate-300 mb-1">Buscar equipo</label>
                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                    🔍
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar equipo..."
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div v-else>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Buscar jugador</label>
                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                    🔍
                  </span>
                  <input
                    v-model="playerNameQuery"
                    type="text"
                    placeholder="Buscar jugador..."
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-500"
                @click="clearFilters"
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"
                @click="refreshAll"
              >
                Refrescar
              </button>
            </div>
          </div>

          <div v-if="view === 'jugadores'" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Equipo</label>
              <select
                v-model="teamPick"
                class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos</option>
                <option v-for="team in playerTeamOptions" :key="team.teamId" :value="String(team.teamId)">
                  {{ team.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Número</label>
              <input
                v-model.trim="playerNumberQuery"
                inputmode="numeric"
                placeholder="Ej. 7"
                class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Chips / estado -->
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span class="text-slate-400">Estado:</span>

            <span
              v-if="selectedRama !== 'all'"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Rama: <strong class="text-slate-100">{{ selectedRama }}</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearRama">✕</button>
            </span>

            <span
              v-if="selectedCategoria !== 'all'"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Categoría: <strong class="text-slate-100">{{ niceGender(selectedCategoria) }}</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearCategoria">✕</button>
            </span>

            <span
              v-if="view === 'equipos' && searchQuery.trim()"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Búsqueda: <strong class="text-slate-100">"{{ searchQuery.trim() }}"</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearSearch">✕</button>
            </span>

            <span
              v-if="view === 'jugadores' && playerNameQuery.trim()"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Jugador: <strong class="text-slate-100">"{{ playerNameQuery.trim() }}"</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearPlayerName">✕</button>
            </span>

            <span
              v-if="view === 'jugadores' && playerNumberQuery.trim()"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Número: <strong class="text-slate-100">{{ playerNumberQuery.trim() }}</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearPlayerNumber">✕</button>
            </span>

            <span
              v-if="categoriesError"
              class="text-amber-200"
            >
              No se pudo cargar /categories de la liga 1. El filtrado principal sigue funcionando con teams/list.
            </span>
          </div>
        </section>

        <!-- =========================
             VIEW: EQUIPOS
             ========================= -->
        <div v-if="view === 'equipos'" class="mt-6">
          <div v-if="pendingEquiposUI" class="text-sm text-slate-400">
            Cargando estadísticas de equipos...
          </div>

          <div
            v-else-if="errorEquiposUI"
            class="rounded-2xl bg-red-950/60 text-red-100 border border-red-500/60 px-4 py-3 text-sm"
          >
            Ocurrió un error al cargar estadísticas de equipos.
          </div>

          <div
            v-else-if="filteredRows.length === 0"
            class="rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
          >
            <p class="font-semibold text-slate-100">Sin resultados</p>
            <p class="mt-1 text-slate-300">
              No hay estadísticas de equipos para la combinación seleccionada.
            </p>
          </div>

          <div v-else>
            <div
              class="rounded-2xl border border-slate-700 bg-slate-900/90 shadow-lg overflow-x-auto"
            >
              <table class="min-w-[980px] w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-400 border-b border-slate-700/80">
                    <th class="px-4 py-3">Equipo</th>
                    <th class="px-4 py-3">Rama</th>
                    <th class="px-4 py-3">Categoría</th>
                    <th class="px-4 py-3">PJ</th>
                    <th class="px-4 py-3">G</th>
                    <th class="px-4 py-3">P</th>
                    <th class="px-4 py-3">E</th>
                    <th class="px-4 py-3">PF</th>
                    <th class="px-4 py-3">PC</th>
                    <th class="px-4 py-3">Diff</th>
                    <th class="px-4 py-3">PTS</th>
                    <th class="px-4 py-3">Índice</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in paginatedTeamRows"
                    :key="row.key"
                    class="border-b border-slate-800 last:border-0 hover:bg-slate-800/35"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-950/70 flex items-center justify-center shrink-0">
                          <img
                            v-if="row.logoUrl"
                            :src="row.logoUrl"
                            :alt="row.teamName"
                            class="h-full w-full object-contain"
                            loading="lazy"
                          />
                          <span v-else class="text-[11px] font-bold text-slate-200">
                            {{ initials(row.teamName) }}
                          </span>
                        </div>

                        <div class="min-w-0">
                          <p class="font-semibold text-white truncate">{{ row.teamName }}</p>
                          <p class="text-[11px] text-slate-400 truncate">
                            {{ row.shortName || 'Sin abreviatura' }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3 text-slate-200">{{ row.categoryCode || '—' }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                        :class="{
                          'bg-blue-500/10 text-blue-200 border border-blue-500/20': row.gender === 'VARONIL',
                          'bg-pink-500/10 text-pink-200 border border-pink-500/20': row.gender === 'FEMENIL',
                          'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20': row.gender === 'MIXTO',
                          'bg-slate-500/10 text-slate-200 border border-slate-500/20': !row.gender
                        }"
                      >
                        {{ niceGender(row.gender) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-200">{{ row.gp }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ row.wins }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ row.losses }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ row.draws }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ row.pointsFor }}</td>
                    <td class="px-4 py-3 text-slate-200">{{ row.pointsAgainst }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                        :class="row.diff >= 0
                          ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-200 border border-red-500/20'"
                      >
                        {{ row.diff }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-100 font-semibold">{{ row.tablePoints }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center rounded-full bg-white/10 text-white px-2 py-0.5 text-xs font-semibold border border-white/10">
                        {{ row.winRate }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- PAGINACIÓN EQUIPOS -->
            <div
              v-if="filteredRows.length > 0 && totalTeamPages > 1"
              class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400"
            >
              <p>
                Mostrando
                <span class="font-semibold text-slate-100">
                  {{ teamPageStart + 1 }}–{{ teamPageEnd }}
                </span>
                de
                <span class="font-semibold text-slate-100">
                  {{ filteredRows.length }}
                </span>
                equipos
              </p>

              <div class="flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="currentTeamPage === 1"
                  @click="currentTeamPage = Math.max(1, currentTeamPage - 1)"
                >
                  ← Anterior
                </button>

                <span class="px-2">
                  Página <span class="font-semibold text-slate-100">{{ currentTeamPage }}</span> / {{ totalTeamPages }}
                </span>

                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="currentTeamPage >= totalTeamPages"
                  @click="currentTeamPage = Math.min(totalTeamPages, currentTeamPage + 1)"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================
             VIEW: JUGADORES
             ========================= -->
        <div v-else class="mt-6">
          <div v-if="pendingPlayersAny" class="text-sm text-slate-400">
            Cargando estadísticas de jugadores...
          </div>

          <div
            v-else-if="errorPlayersAny"
            class="rounded-2xl bg-red-950/60 text-red-100 border border-red-500/60 px-4 py-3 text-sm"
          >
            Ocurrió un error al cargar estadísticas de jugadores.
          </div>

          <div
            v-else-if="sortedPlayers.length === 0"
            class="rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
          >
            <p class="font-semibold text-slate-100">Sin resultados</p>
            <p class="mt-1 text-slate-300">
              No hay jugadores para la combinación seleccionada.
            </p>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="(player, idx) in pagedPlayers"
              :key="player.id"
              class="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg hover:border-slate-500 transition"
            >
              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="h-10 w-10 rounded-2xl border border-slate-700 bg-slate-950/70 grid place-items-center shrink-0">
                    <span class="text-sm font-extrabold text-slate-200 tabular-nums">
                      {{ pageStartIndex + idx + 1 }}
                    </span>
                  </div>

                  <div class="h-12 w-12 rounded-2xl border border-slate-700 bg-slate-950/70 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      v-if="player.photoUrl"
                      :src="player.photoUrl"
                      :alt="player.fullName"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span v-else class="text-[12px] font-extrabold text-slate-200">
                      {{ initials(player.fullName) }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p class="font-semibold text-white truncate max-w-[420px]">
                        {{ player.fullName }}
                      </p>

                      <span
                        v-if="player.number !== null && player.number !== undefined"
                        class="text-slate-400 font-semibold"
                      >
                        #{{ player.number }}
                      </span>

                      <span class="inline-flex items-center rounded-full bg-white/10 text-white px-2 py-0.5 text-[11px] font-semibold border border-white/10">
                        IMP: {{ impact(player) }}
                      </span>
                    </div>

                    <p class="mt-0.5 text-[12px] text-slate-300 truncate">
                      {{ player.teamName || '—' }}
                    </p>

                    <p class="text-[11px] text-slate-500 truncate">
                      {{ player.teamCode || '—' }}<span v-if="player.gender"> · {{ niceGender(player.gender) }}</span>
                    </p>
                  </div>
                </div>

                <div class="w-full md:w-auto">
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">INT</p>
                      <p class="mt-0.5 text-lg font-extrabold text-fuchsia-200 tabular-nums">{{ player.stats.int }}</p>
                    </div>

                    <div class="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">TD</p>
                      <p class="mt-0.5 text-lg font-extrabold text-violet-200 tabular-nums">{{ player.stats.td }}</p>
                    </div>

                    <div class="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">PA</p>
                      <p class="mt-0.5 text-lg font-extrabold text-sky-200 tabular-nums">{{ player.stats.pa }}</p>
                    </div>

                    <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">SACK</p>
                      <p class="mt-0.5 text-lg font-extrabold text-emerald-200 tabular-nums">{{ player.stats.sack }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- PAGINACIÓN JUGADORES -->
            <div
              v-if="sortedPlayers.length > 0 && totalPlayerPages > 1"
              class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400"
            >
              <p>
                Mostrando
                <span class="font-semibold text-slate-100">
                  {{ pageStartIndex + 1 }}–{{ pageEndIndex }}
                </span>
                de
                <span class="font-semibold text-slate-100">
                  {{ sortedPlayers.length }}
                </span>
                jugadores
              </p>

              <div class="flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="page <= 1"
                  @click="page = Math.max(1, page - 1)"
                >
                  ← Anterior
                </button>

                <span class="px-2">
                  Página <span class="font-semibold text-slate-100">{{ page }}</span> / {{ totalPlayerPages }}
                </span>

                <button
                  type="button"
                  class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700"
                  :disabled="page >= totalPlayerPages"
                  @click="page = Math.min(totalPlayerPages, page + 1)"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRuntimeConfig, useFetch, useAsyncData, useRoute, useRouter } from '#imports'
import { normalizeApiBase } from '../composables/useApiBase'

type View = 'equipos' | 'jugadores'
type Nullable<T> = T | null

interface ApiTeam {
  teamId: number
  leagueId?: number | null
  name: string
  shortName: Nullable<string>
  colorPrimary: Nullable<string>
  colorSecondary: Nullable<string>
  logoUrl: Nullable<string>
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  code?: Nullable<string>
  categoryCode?: Nullable<string>
  gender?: Nullable<string>
  categoryGender?: Nullable<string>
  category?: Nullable<{ code?: string; gender?: string; name?: string; leagueId?: number | null }>
}

interface CategoryDto {
  id: number
  leagueId?: number | null
  name: string
  code: string
  gender: string
}

interface ApiStanding {
  standingId?: number
  teamId?: number
  teamName?: string
  shortName?: string
  gender?: string
  categoryCode?: string
  seasonId?: number
  categoryId?: number
  leagueId?: number | null
  pointsFor?: number
  pointsAgainst?: number
  tablePoints?: number
  gp?: number
  wins?: number
  losses?: number
  draws?: number
}

interface TeamRowVM {
  key: string
  teamId: number | null
  teamName: string
  shortName: string
  logoUrl: string | null
  gender: string
  categoryCode: string
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

interface PlayerStats {
  td: number
  int: number
  pa: number
  sack: number
  rec: number
}

interface PlayerVM {
  id: number
  fullName: string
  number?: number | null
  photoUrl?: string | null
  teamId?: number | null
  teamName?: string
  teamCode?: string
  gender?: string
  stats: PlayerStats
}

/* =========================
   VIEW
   ========================= */
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
  const q: Record<string, any> = { ...route.query }
  if (v === 'jugadores') q.view = 'jugadores'
  else delete q.view
  router.replace({ query: q })
}

/* =========================
   HELPERS
   ========================= */
function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  if (x && Array.isArray(x.data)) return x.data
  if (x && Array.isArray(x.results)) return x.results
  if (x?.data && Array.isArray(x.data.content)) return x.data.content
  return []
}

function toNum(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeUpper(value: unknown): string {
  return String(value || '').trim().toUpperCase()
}

function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}

function initials(text: string): string {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() || '').join('')
}

function impact(p: PlayerVM): number {
  return p.stats.td + p.stats.int + p.stats.pa + p.stats.sack
}

function stringHash(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash || 1)
}

/* =========================
   API
   ========================= */
const PAGE_LEAGUE_ID = 1

const config = useRuntimeConfig()
const API_BASE = `${normalizeApiBase(config.public.apiBase)}/`

/* =========================
   FILTROS GLOBALES
   ========================= */
const selectedRama = ref<string>('all')
const selectedCategoria = ref<string>('all')
const searchQuery = ref('')

const selectedRamaLabel = computed(() =>
  selectedRama.value === 'all' ? 'Todas las ramas' : selectedRama.value
)

const selectedCategoriaLabel = computed(() =>
  selectedCategoria.value === 'all' ? 'Todas las categorías' : niceGender(selectedCategoria.value)
)

/* =========================
   CATEGORIES
   ========================= */
const categoriesQuery = computed(() => ({
  leagueId: PAGE_LEAGUE_ID,
}))

const {
  data: categoriesRaw,
  pending: categoriesPending,
  error: categoriesError,
  refresh: refreshCategories,
} = useFetch<any>('categories', {
  baseURL: API_BASE,
  query: categoriesQuery,
  default: () => [],
})

const allCategories = computed<CategoryDto[]>(() => unwrapList<CategoryDto>(categoriesRaw.value))

const categoriesList = computed<CategoryDto[]>(() => {
  const list = allCategories.value || []
  const withLeagueMeta = list.some((c) => c?.leagueId !== null && c?.leagueId !== undefined)
  if (!withLeagueMeta) return list
  return list.filter((c) => Number(c?.leagueId) === PAGE_LEAGUE_ID)
})

const validCategoryCodes = computed<Set<string>>(() => {
  const set = new Set<string>()
  for (const c of categoriesList.value) {
    const code = normalizeUpper(c?.code)
    if (code) set.add(code)
  }
  return set
})

const validCategoryGenders = computed<Set<string>>(() => {
  const set = new Set<string>()
  for (const c of categoriesList.value) {
    const gender = normalizeUpper(c?.gender)
    if (gender) set.add(gender)
  }
  return set
})

const hasUsableCategoryCatalog = computed(() =>
  !categoriesPending.value &&
  !categoriesError.value &&
  categoriesList.value.length > 0
)

const ramaOptions = computed(() => {
  const set = new Set<string>()
  for (const c of categoriesList.value) {
    const code = normalizeUpper(c?.code)
    if (code) set.add(code)
  }
  return Array.from(set).sort()
})

const categoriaOptions = computed(() => {
  const set = new Set<string>()
  for (const c of categoriesList.value) {
    const gender = normalizeUpper(c?.gender)
    if (gender) set.add(gender)
  }
  return Array.from(set).sort()
})

/* =========================
   TEAMS (SOURCE OF TRUTH FOR DOMINGO)
   ========================= */
const teamsQuery = computed(() => ({
  leagueId: PAGE_LEAGUE_ID,
}))

const {
  data: teamsRaw,
  pending: pendingTeams,
  error: errorTeams,
  refresh: refreshTeams,
} = useFetch<any>('teams/list', {
  baseURL: API_BASE,
  query: teamsQuery,
  default: () => [],
})

const allTeams = computed<ApiTeam[]>(() => unwrapList<ApiTeam>(teamsRaw.value))

const getTeamCode = (team: ApiTeam): string => {
  const v = team.category?.code || team.categoryCode || team.code || null
  return v ? String(v).toUpperCase() : ''
}

const getTeamGender = (team: ApiTeam): string => {
  const v = team.category?.gender || team.gender || team.categoryGender || null
  return v ? String(v).toUpperCase() : ''
}

function teamBelongsToLeagueOne(team: ApiTeam): boolean {
  const teamLeagueId = toNullableNumber(team?.leagueId)
  const nestedCategoryLeagueId = toNullableNumber(team?.category?.leagueId)

  const teamCode = normalizeUpper(getTeamCode(team))
  const teamGender = normalizeUpper(getTeamGender(team))

  if (teamLeagueId !== null && teamLeagueId !== PAGE_LEAGUE_ID) {
    return false
  }

  if (nestedCategoryLeagueId !== null && nestedCategoryLeagueId !== PAGE_LEAGUE_ID) {
    return false
  }

  if (hasUsableCategoryCatalog.value) {
    if (teamCode && !validCategoryCodes.value.has(teamCode)) {
      return false
    }

    if (!teamCode && teamGender && !validCategoryGenders.value.has(teamGender)) {
      return false
    }
  }

  return true
}

const teamsList = computed<ApiTeam[]>(() => {
  return (allTeams.value || []).filter((team) => teamBelongsToLeagueOne(team))
})

const sundayTeamIds = computed(() => {
  const set = new Set<number>()
  for (const t of teamsList.value) {
    if (Number.isFinite(t.teamId)) set.add(Number(t.teamId))
  }
  return set
})

const sundayTeamNamesLower = computed(() => {
  const set = new Set<string>()
  for (const t of teamsList.value) {
    const name = String(t.name || '').trim().toLowerCase()
    const short = String(t.shortName || '').trim().toLowerCase()
    if (name) set.add(name)
    if (short) set.add(short)
  }
  return set
})

const teamById = computed(() => {
  const map = new Map<number, ApiTeam>()
  for (const t of teamsList.value) map.set(Number(t.teamId), t)
  return map
})

/* =========================
   STANDINGS
   ========================= */
const standingsQuery = computed(() => ({
  leagueId: PAGE_LEAGUE_ID,
  categoryCode: selectedRama.value === 'all' ? undefined : selectedRama.value,
  gender: selectedCategoria.value === 'all' ? undefined : selectedCategoria.value,
}))

const {
  data: standingsRaw,
  pending: pendingStandings,
  error: errorStandings,
  refresh: refreshStandings,
} = useFetch<any>('points', {
  baseURL: API_BASE,
  query: standingsQuery,
  default: () => [],
})

const standingsList = computed<ApiStanding[]>(() => unwrapList<ApiStanding>(standingsRaw.value))

function standingBelongsToSunday(row: ApiStanding): boolean {
  const rowLeagueId = toNullableNumber(row?.leagueId)
  if (rowLeagueId !== null && rowLeagueId !== PAGE_LEAGUE_ID) return false

  const rowTeamId = toNullableNumber(row?.teamId)
  if (rowTeamId !== null && sundayTeamIds.value.has(rowTeamId)) return true

  const rowName = String(row?.teamName || '').trim().toLowerCase()
  if (rowName && sundayTeamNamesLower.value.has(rowName)) return true

  const rowCode = normalizeUpper(row?.categoryCode)
  const rowGender = normalizeUpper(row?.gender)

  if (hasUsableCategoryCatalog.value) {
    if (rowCode && !validCategoryCodes.value.has(rowCode)) return false
    if (!rowCode && rowGender && !validCategoryGenders.value.has(rowGender)) return false
  }

  if (teamsList.value.length > 0) {
    return false
  }

  return true
}

// ── ÚNICO CAMBIO respecto al original ────────────────────────────────────────
// Se agregó un paso de deduplicación después del .map() para que cada equipo
// aparezca una sola vez, quedándonos con la fila de mayor tablePoints cuando
// la API devuelve varias entradas para el mismo equipo (distintas temporadas,
// stages, etc.).
const allRows = computed<TeamRowVM[]>(() => {
  const mapped = standingsList.value
    .filter((row) => standingBelongsToSunday(row))
    .map((row) => {
      const teamId = toNullableNumber(row.teamId)
      const team = teamId !== null ? teamById.value.get(teamId) : undefined

      const teamName = String(row.teamName || team?.name || '—').trim()
      const shortName = String(row.shortName || team?.shortName || '').trim()
      const categoryCode = normalizeUpper(row.categoryCode || team?.categoryCode || team?.code || team?.category?.code || '')
      const gender = normalizeUpper(row.gender || team?.gender || team?.categoryGender || team?.category?.gender || '')

      const gp = toNum(row.gp)
      const wins = toNum(row.wins)
      const losses = toNum(row.losses)
      const draws = toNum(row.draws)
      const pointsFor = toNum(row.pointsFor)
      const pointsAgainst = toNum(row.pointsAgainst)
      const tablePoints = toNum(row.tablePoints)
      const diff = pointsFor - pointsAgainst
      const rate = gp > 0 ? (wins / gp) * 100 : 0
      const winRate = Number.isInteger(rate) ? `${rate.toFixed(0)}%` : `${rate.toFixed(1)}%`

      const keyBase = teamId ?? stringHash(`${teamName}-${categoryCode}-${gender}`)

      return {
        key: `${keyBase}-${categoryCode}-${gender}`,
        teamId,
        teamName,
        shortName,
        logoUrl: team?.logoUrl || null,
        gender,
        categoryCode,
        gp,
        wins,
        losses,
        draws,
        pointsFor,
        pointsAgainst,
        tablePoints,
        diff,
        winRate,
      }
    })

  // Deduplicación: una sola fila por equipo, la de mayor tablePoints
  const seen = new Map<string, TeamRowVM>()
  for (const row of mapped) {
    const dedupeKey =
      row.teamId !== null
        ? `id:${row.teamId}`
        : `name:${row.teamName.toLowerCase()}|${row.categoryCode}|${row.gender}`

    const existing = seen.get(dedupeKey)
    if (!existing || row.tablePoints > existing.tablePoints) {
      seen.set(dedupeKey, row)
    }
  }

  return Array.from(seen.values()).sort((a, b) => {
    const byPts = b.tablePoints - a.tablePoints
    if (byPts !== 0) return byPts

    const byDiff = b.diff - a.diff
    if (byDiff !== 0) return byDiff

    const byPF = b.pointsFor - a.pointsFor
    if (byPF !== 0) return byPF

    return a.teamName.localeCompare(b.teamName, 'es')
  })
})
// ─────────────────────────────────────────────────────────────────────────────

const filteredRows = computed<TeamRowVM[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRows.value

  return allRows.value.filter((row) => {
    const name = String(row.teamName || '').toLowerCase()
    const short = String(row.shortName || '').toLowerCase()
    return name.includes(q) || short.includes(q)
  })
})

/* =========================
   PAGINACIÓN EQUIPOS
   ========================= */
const teamPageSize = 15
const currentTeamPage = ref(1)

const totalTeamPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRows.value.length / teamPageSize))
})

const teamPageStart = computed(() => {
  return filteredRows.value.length ? (currentTeamPage.value - 1) * teamPageSize : 0
})

const teamPageEnd = computed(() => {
  return Math.min(filteredRows.value.length, teamPageStart.value + teamPageSize)
})

const paginatedTeamRows = computed<TeamRowVM[]>(() => {
  return filteredRows.value.slice(teamPageStart.value, teamPageStart.value + teamPageSize)
})

watch([selectedRama, selectedCategoria, searchQuery], () => {
  currentTeamPage.value = 1
})

watch(totalTeamPages, (tp) => {
  if (currentTeamPage.value > tp) currentTeamPage.value = tp
})

const pendingEquiposUI = computed(() => pendingStandings.value || pendingTeams.value)
const errorEquiposUI = computed(() => !!errorStandings.value && filteredRows.value.length === 0)

/* =========================
   PLAYERS
   ========================= */
const playerNameQuery = ref('')
const playerNumberQuery = ref('')
const teamPick = ref<'ALL' | string>('ALL')
const page = ref(1)

const playerTeamOptions = computed(() => {
  return teamsList.value
    .filter((team) => {
      const code = normalizeUpper(getTeamCode(team))
      const gender = normalizeUpper(getTeamGender(team))

      if (selectedRama.value !== 'all' && code !== normalizeUpper(selectedRama.value)) return false
      if (selectedCategoria.value !== 'all' && gender !== normalizeUpper(selectedCategoria.value)) return false
      return true
    })
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
})

async function fetchPlayersFromCandidates(): Promise<any[]> {
  const directCandidates = [
    { path: 'stats/players', query: { leagueId: PAGE_LEAGUE_ID } },
    { path: 'players', query: { leagueId: PAGE_LEAGUE_ID } },
    { path: 'stats/players', query: {} },
    { path: 'players', query: {} },
  ]

  for (const candidate of directCandidates) {
    try {
      const raw = await $fetch<any>(candidate.path, {
        baseURL: API_BASE,
        query: candidate.query,
      })
      const list = unwrapList<any>(raw)
      if (list.length > 0) return list
    } catch {
      // ignore
    }
  }

  const fallbackChunks = await Promise.all(
    teamsList.value.map(async (team) => {
      try {
        const raw = await $fetch<any>(`teams/${team.teamId}/players`, {
          baseURL: API_BASE,
        })
        const list = unwrapList<any>(raw)
        return list.map((p) => ({
          ...p,
          __teamId: team.teamId,
          __teamName: team.name,
          __teamCode: getTeamCode(team),
          __teamGender: getTeamGender(team),
        }))
      } catch {
        return []
      }
    })
  )

  return fallbackChunks.flat()
}

const {
  data: playersRaw,
  pending: pendingPlayers,
  error: errorPlayers,
  refresh: refreshPlayers,
} = useAsyncData<any[]>(
  'domingo-stats-players',
  async () => {
    return await fetchPlayersFromCandidates()
  },
  {
    server: false,
    default: () => [],
    watch: [teamsRaw],
  }
)

function playerBelongsToSunday(raw: any): boolean {
  const rowLeagueId = toNullableNumber(raw?.leagueId ?? raw?.league_id ?? raw?.league?.id)
  if (rowLeagueId !== null && rowLeagueId !== PAGE_LEAGUE_ID) return false

  const teamId = toNullableNumber(raw?.teamId ?? raw?.team_id ?? raw?.team?.teamId ?? raw?.team?.id ?? raw?.__teamId)
  if (teamId !== null && sundayTeamIds.value.has(teamId)) return true

  const teamName = String(raw?.teamName ?? raw?.team_name ?? raw?.team?.name ?? raw?.__teamName ?? '').trim().toLowerCase()
  if (teamName && sundayTeamNamesLower.value.has(teamName)) return true

  return false
}

const playersVm = computed<PlayerVM[]>(() => {
  const unique = new Map<number, PlayerVM>()

  for (const raw of unwrapList<any>(playersRaw.value)) {
    if (!playerBelongsToSunday(raw)) continue

    const fullName =
      String(
        raw.fullName ??
        raw.full_name ??
        raw.name ??
        [raw.firstName ?? raw.first_name, raw.lastName ?? raw.last_name].filter(Boolean).join(' ')
      ).trim() || 'Jugador'

    const teamId = toNullableNumber(raw?.teamId ?? raw?.team_id ?? raw?.team?.teamId ?? raw?.team?.id ?? raw?.__teamId)
    const team = teamId !== null ? teamById.value.get(teamId) : undefined

    const teamName = String(
      raw?.teamName ??
      raw?.team_name ??
      raw?.team?.name ??
      raw?.__teamName ??
      team?.name ??
      ''
    ).trim()

    const teamCode = normalizeUpper(
      raw?.categoryCode ??
      raw?.category_code ??
      raw?.team?.code ??
      raw?.__teamCode ??
      team?.categoryCode ??
      team?.code ??
      team?.category?.code ??
      ''
    )

    const gender = normalizeUpper(
      raw?.gender ??
      raw?.team?.gender ??
      raw?.__teamGender ??
      team?.gender ??
      team?.categoryGender ??
      team?.category?.gender ??
      ''
    )

    if (selectedRama.value !== 'all' && teamCode !== normalizeUpper(selectedRama.value)) continue
    if (selectedCategoria.value !== 'all' && gender !== normalizeUpper(selectedCategoria.value)) continue

    const explicitId = toNum(raw?.playerId ?? raw?.player_id ?? raw?.id)
    const syntheticId = stringHash(`${fullName}|${teamId ?? 'x'}|${raw?.number ?? raw?.jerseyNumber ?? raw?.jersey_number ?? ''}`)
    const id = explicitId > 0 ? explicitId : syntheticId

    const stats: PlayerStats = {
      td: toNum(raw?.td ?? raw?.tds ?? raw?.touchdowns ?? raw?.stats?.td ?? raw?.stats?.tds),
      int: toNum(raw?.int ?? raw?.interceptions ?? raw?.stats?.int ?? raw?.stats?.interceptions),
      pa: toNum(raw?.pa ?? raw?.passingTd ?? raw?.passing_td ?? raw?.stats?.pa ?? raw?.stats?.passingTd),
      sack: toNum(raw?.sack ?? raw?.sacks ?? raw?.stats?.sack ?? raw?.stats?.sacks),
      rec: toNum(raw?.rec ?? raw?.receptions ?? raw?.stats?.rec ?? raw?.stats?.receptions),
    }

    unique.set(id, {
      id,
      fullName,
      number: raw?.number ?? raw?.jerseyNumber ?? raw?.jersey_number ?? raw?.num ?? null,
      photoUrl: raw?.photoUrl ?? raw?.photo_url ?? raw?.photo ?? raw?.avatarUrl ?? null,
      teamId,
      teamName: teamName || undefined,
      teamCode,
      gender,
      stats,
    })
  }

  return Array.from(unique.values())
})

const filteredPlayers = computed<PlayerVM[]>(() => {
  const nameQ = playerNameQuery.value.trim().toLowerCase()
  const numQ = playerNumberQuery.value.trim()

  return playersVm.value.filter((player) => {
    if (teamPick.value !== 'ALL') {
      const wanted = Number(teamPick.value)
      if (Number.isFinite(wanted) && player.teamId !== wanted) return false
    }

    if (nameQ) {
      const full = String(player.fullName || '').toLowerCase()
      if (!full.includes(nameQ)) return false
    }

    if (numQ) {
      const n = String(player.number ?? '')
      if (!n.includes(numQ)) return false
    }

    return true
  })
})

const sortedPlayers = computed<PlayerVM[]>(() => {
  return filteredPlayers.value
    .slice()
    .sort((a, b) => {
      const byImpact = impact(b) - impact(a)
      if (byImpact !== 0) return byImpact
      return a.fullName.localeCompare(b.fullName, 'es')
    })
})

const pageSize = 10

const totalPlayerPages = computed(() => Math.max(1, Math.ceil(sortedPlayers.value.length / pageSize)))
const pageStartIndex = computed(() => (page.value - 1) * pageSize)
const pageEndIndex = computed(() => Math.min(sortedPlayers.value.length, pageStartIndex.value + pageSize))

const pagedPlayers = computed<PlayerVM[]>(() => {
  return sortedPlayers.value.slice(pageStartIndex.value, pageEndIndex.value)
})

watch([selectedRama, selectedCategoria, playerNameQuery, playerNumberQuery, teamPick], () => {
  page.value = 1
})

watch(totalPlayerPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pendingPlayersAny = computed(() => pendingPlayers.value || pendingTeams.value)
const errorPlayersAny = computed(() => !!errorPlayers.value && playersVm.value.length === 0)

/* =========================
   ACTIONS
   ========================= */
const clearRama = () => {
  selectedRama.value = 'all'
}

const clearCategoria = () => {
  selectedCategoria.value = 'all'
}

const clearSearch = () => {
  searchQuery.value = ''
}

const clearPlayerName = () => {
  playerNameQuery.value = ''
}

const clearPlayerNumber = () => {
  playerNumberQuery.value = ''
}

const clearFilters = () => {
  selectedRama.value = 'all'
  selectedCategoria.value = 'all'
  searchQuery.value = ''
  playerNameQuery.value = ''
  playerNumberQuery.value = ''
  teamPick.value = 'ALL'
  currentTeamPage.value = 1
  page.value = 1
}

async function refreshAll() {
  await refreshCategories()
  await refreshTeams()
  await refreshStandings()
  await refreshPlayers()
}
</script>