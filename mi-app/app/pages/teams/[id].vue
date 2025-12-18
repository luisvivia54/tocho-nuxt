<template>
  <main class="bg-[#020617] text-slate-50 min-h-screen">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Volver -->
        <div class="mb-4 flex items-center justify-between gap-3">
          <NuxtLink
            to="/equipos"
            class="inline-flex items-center gap-2 text-xs md:text-sm text-slate-300 hover:text-white"
          >
            ← Volver a equipos
          </NuxtLink>

          <p class="text-[11px] text-slate-500">
            ID equipo:
            <span class="font-mono text-slate-300">#{{ teamId }}</span>
          </p>
        </div>

        <!-- Estados -->
        <div v-if="pending" class="mt-8 text-sm text-slate-400">
          Cargando información del equipo...
        </div>

        <div
          v-else-if="error"
          class="mt-8 rounded-2xl bg-red-950/60 text-red-100 border border-red-500/60 px-4 py-3 text-sm"
        >
          Ocurrió un error al cargar el detalle del equipo. Revisa la consola.
        </div>

        <div
          v-else-if="!team"
          class="mt-8 rounded-2xl bg-slate-900/70 border border-slate-700 px-4 py-5 text-sm text-slate-300"
        >
          No se encontró el equipo.
        </div>

        <!-- CONTENIDO PRINCIPAL -->
        <div v-else>
          <!-- HERO -->
          <header
            class="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_28px_80px_rgba(15,23,42,0.9)] mb-6"
            :style="heroGradientStyle"
          >
            <div
              class="relative px-5 md:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center"
            >
              <!-- Logo -->
              <div class="shrink-0">
                <div
                  class="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center overflow-hidden shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_20px_60px_rgba(0,0,0,0.9)]"
                >
                  <img
                    v-if="team.logoUrl"
                    :src="team.logoUrl"
                    :alt="team.name"
                    class="max-h-20 max-w-full object-contain"
                  />
                  <span
                    v-else
                    class="text-xs md:text-sm font-semibold text-slate-100 text-center px-2"
                  >
                    {{ team.shortName || 'Equipo' }}
                  </span>
                </div>
              </div>

              <!-- Info principal -->
              <div class="flex-1 min-w-0">
                <p class="text-[11px] uppercase tracking-[0.2em] text-slate-300/80">
                  Tochero5 · {{ team.season?.name || 'Temporada' }}
                </p>
                <h1
                  class="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight break-words"
                >
                  {{ team.name }}
                </h1>

                <p class="mt-1 text-sm text-slate-200/80 max-w-xl">
                  {{ subtitleText }}
                </p>

                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200">
                  <span
                    v-if="team.shortName"
                    class="inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 border border-white/15"
                  >
                    Abreviatura:
                    <span class="font-semibold">{{ team.shortName }}</span>
                  </span>

                  <span
                    v-if="team.category"
                    class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10"
                  >
                    Categoría:
                    <span class="font-semibold">{{ team.category.name }}</span>
                  </span>

                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10"
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="teamActive ? 'bg-emerald-400' : 'bg-slate-400'"
                    />
                    {{ teamActive ? 'Equipo activo' : 'Equipo inactivo' }}
                  </span>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200">
                  <span class="inline-flex items-center gap-2 text-slate-300">
                    <span class="text-[13px]">🏟️</span>
                    <span class="font-medium">
                      {{ team.season?.name || 'Temporada actual' }}
                    </span>
                  </span>

                  <span class="inline-flex items-center gap-2 text-slate-300">
                    <span class="text-[13px]">👥</span>
                    <span class="font-medium">
                      {{ players.length }} jugador{{ players.length === 1 ? '' : 'es' }}
                    </span>
                  </span>

                  <span class="inline-flex items-center gap-2 text-slate-300">
                    <span class="text-[13px]">📊</span>
                    <span class="font-medium">
                      {{ recordSummary }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Resumen a la derecha -->
              <aside class="w-full md:w-60">
                <div
                  class="rounded-2xl bg-black/40 border border-white/15 p-4 text-xs text-slate-200 space-y-3"
                >
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Ficha rápida
                  </p>

                  <div class="space-y-1">
                    <p class="text-[11px] text-slate-400">Capitán</p>
                    <p class="text-sm font-semibold text-white">
                      {{ team.captain || 'Por definir' }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <p class="text-[11px] text-slate-400">Color primario</p>
                      <div class="mt-1 flex items-center gap-2">
                        <span
                          class="h-4 w-4 rounded-full border border-white/30 shadow-inner"
                          :style="{ backgroundColor: primaryColor }"
                        ></span>
                        <span class="text-[11px] truncate">
                          {{ primaryColor }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p class="text-[11px] text-slate-400">Color secundario</p>
                      <div class="mt-1 flex items-center gap-2">
                        <span
                          class="h-4 w-4 rounded-full border border-white/30 shadow-inner"
                          :style="{ backgroundColor: secondaryColor }"
                        ></span>
                        <span class="text-[11px] truncate">
                          {{ secondaryColor }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-white/10 pt-3 text-[11px] text-slate-400">
                    ID interno:
                    <span class="font-mono text-slate-200">#{{ team.teamId }}</span>
                  </div>
                </div>
              </aside>
            </div>
          </header>

          <!-- TABS -->
          <div class="mt-2 border-b border-slate-800 flex gap-3 overflow-x-auto text-sm">
            <button
              type="button"
              class="px-3 py-2 border-b-2"
              :class="
                activeTab === 'resumen'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              "
              @click="activeTab = 'resumen'"
            >
              Resumen
            </button>

            <button
              v-if="isAdmin"
              type="button"
              class="px-3 py-2 border-b-2"
              :class="
                activeTab === 'partidos'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              "
              @click="activeTab = 'partidos'"
            >
              Partidos (Admin)
            </button>
          </div>

          <!-- TAB: RESUMEN (GALERÍA + ÚLTIMOS 3 PARTIDOS + ROSTER) -->
          <div
            v-if="activeTab === 'resumen'"
            class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] mb-10"
          >
            <!-- Columna izquierda: Galería + últimos partidos -->
            <div class="space-y-4">
              <!-- Galería / carrusel -->
              <section
                class="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5 shadow-[0_22px_60px_rgba(15,23,42,0.9)]"
              >
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 class="font-display text-lg font-semibold text-white">
                      Galería del equipo
                    </h2>
                    <p class="text-xs text-slate-400">
                      Hasta 5 imágenes destacadas del equipo.
                    </p>
                  </div>
                  <span class="text-[11px] text-slate-400">
                    {{ gallery.length }} / 5 imágenes
                  </span>
                </div>

                <div v-if="gallery.length === 0" class="text-xs text-slate-400 py-6">
                  Aún no hay fotos en la galería. Cárgalas desde el panel de administración.
                </div>

                <div v-else class="space-y-3">
                  <div
                    class="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 aspect-[16/9]"
                  >
                    <img
                      :src="gallery[currentSlide]"
                      :alt="`Foto ${currentSlide + 1} de ${team.name}`"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <div class="flex items-center justify-between gap-3 text-[11px]">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/80 px-2 py-1 hover:border-blue-400 hover:text-blue-100 transition disabled:opacity-40"
                        :disabled="gallery.length <= 1"
                        @click="showPrevSlide"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/80 px-2 py-1 hover:border-blue-400 hover:text-blue-100 transition disabled:opacity-40"
                        :disabled="gallery.length <= 1"
                        @click="showNextSlide"
                      >
                        ›
                      </button>
                    </div>

                    <div class="flex items-center gap-1">
                      <span
                        v-for="(img, index) in gallery"
                        :key="img + index"
                        class="h-1.5 rounded-full transition-all"
                        :class="[
                          'bg-slate-500/60',
                          index === currentSlide ? 'w-4 bg-blue-400' : 'w-2'
                        ]"
                      ></span>
                    </div>

                    <p class="text-right text-slate-400">
                      Foto {{ currentSlide + 1 }} de {{ gallery.length }}
                    </p>
                  </div>
                </div>
              </section>

              <!-- Últimos partidos -->
              <section
                class="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5"
              >
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 class="font-display text-lg font-semibold text-white">
                      Últimos partidos
                    </h2>
                    <p class="text-xs text-slate-400">
                      Resumen de los últimos 3 juegos registrados.
                    </p>
                  </div>
                </div>

                <div v-if="lastGames.length === 0" class="text-xs text-slate-400 py-4">
                  Aún no hay partidos registrados para este equipo.
                </div>

                <div v-else class="overflow-x-auto">
                  <table class="min-w-full text-xs">
                    <thead>
                      <tr class="text-slate-400 border-b border-slate-800">
                        <th class="py-2 pr-3 text-left font-medium">Fecha</th>
                        <th class="py-2 px-3 text-left font-medium">Rival</th>
                        <th class="py-2 px-3 text-center font-medium">Marcador</th>
                        <th class="py-2 pl-3 text-right font-medium">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="game in lastGames"
                        :key="game.gameId"
                        class="border-b border-slate-900/80 last:border-0"
                      >
                        <td class="py-2 pr-3 text-slate-200">
                          {{ formatGameDate(game.date) }}
                        </td>
                        <td class="py-2 px-3 text-slate-200">
                          {{ game.opponentName }}
                        </td>
                        <td class="py-2 px-3 text-center text-slate-100 font-semibold">
                          {{ game.scoreFor }} - {{ game.scoreAgainst }}
                        </td>
                        <td class="py-2 pl-3 text-right">
                          <span
                            :class="[
                              'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                              getResultClass(game.result)
                            ]"
                          >
                            {{ getResultLabel(game.result) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <!-- Columna derecha: Roster -->
            <section
              class="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5 shadow-[0_22px_60px_rgba(15,23,42,1)]"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 class="font-display text-lg font-semibold text-white">
                    Roster del equipo
                  </h2>
                  <p class="mt-1 text-xs text-slate-400">
                    {{ players.length }} jugador{{ players.length === 1 ? '' : 'es' }}
                    registrados.
                  </p>
                </div>
              </div>

              <div v-if="players.length === 0" class="text-xs text-slate-400 py-4">
                Aún no hay jugadores registrados en este equipo.
              </div>

              <div
                v-else
                class="space-y-2 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar"
              >
                <article
                  v-for="player in players"
                  :key="player.id"
                  class="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs hover:border-blue-500/80 hover:bg-slate-900 transition"
                >
                  <!-- Foto / iniciales -->
                  <div
                    class="h-10 w-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0"
                  >
                    <img
                      v-if="player.photoUrl"
                      :src="player.photoUrl"
                      :alt="player.fullName"
                      class="h-full w-full object-cover"
                    />
                    <span
                      v-else
                      class="text-[11px] font-semibold text-slate-100"
                    >
                      {{ player.fullName.slice(0, 2).toUpperCase() }}
                    </span>
                  </div>

                  <!-- Datos -->
                  <div class="flex-1 min-w-0">
                    <p class="text-slate-100 font-medium truncate">
                      {{ player.fullName }}
                    </p>
                    <p class="text-[11px] text-slate-400 mt-0.5">
                      <span
                        v-if="player.jerseyNumber !== null && player.jerseyNumber !== undefined"
                      >
                        #{{ player.jerseyNumber }}
                      </span>
                      <span
                        v-if="getAgeFromBirthdate(player.birthdate) !== null"
                        class="mx-1 text-slate-500"
                      >
                        ·
                      </span>
                      <span v-if="getAgeFromBirthdate(player.birthdate) !== null">
                        {{ getAgeFromBirthdate(player.birthdate) }} años
                      </span>
                    </p>
                    <p class="text-[10px] text-slate-500 truncate">
                      CURP: {{ player.curp }}
                    </p>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <!-- TAB: PARTIDOS (ADMIN) -->
          <section
            v-else-if="activeTab === 'partidos'"
            class="mt-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-6 mb-10"
          >
            <div class="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="font-display text-xl font-extrabold text-slate-50">
                  Gestión de partidos del equipo
                </h2>
                <p class="text-xs text-slate-400">
                  Solo administradores pueden crear o editar partidos. Más adelante conectamos
                  este módulo al backend.
                </p>
              </div>

              <span
                class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 px-3 py-1 text-[11px] font-semibold"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admin
              </span>
            </div>

            <!-- Si no es admin, mensaje de solo lectura -->
            <div
              v-if="!isAdmin"
              class="rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-slate-300"
            >
              Solo los administradores de la liga pueden gestionar partidos de este equipo.
            </div>

            <div v-else class="space-y-6">
              <!-- FORM NUEVO PARTIDO -->
              <div
                class="rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-4 space-y-3"
              >
                <h3 class="text-sm font-semibold text-slate-100">
                  Agregar nuevo partido
                </h3>

                <div class="grid md:grid-cols-4 gap-3 text-sm">
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-400"
                    >
                      Oponente
                    </label>
                    <input
                      v-model="newGame.opponent"
                      type="text"
                      class="rounded-lg bg-slate-950/60 border border-slate-700 px-2.5 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      placeholder="Ej. Redskins"
                    />
                  </div>

                  <div class="flex flex-col gap-1">
                    <label
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-400"
                    >
                      Fecha
                    </label>
                    <input
                      v-model="newGame.date"
                      type="date"
                      class="rounded-lg bg-slate-950/60 border border-slate-700 px-2.5 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div class="flex flex-col gap-1">
                    <label
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-400"
                    >
                      Hora
                    </label>
                    <input
                      v-model="newGame.time"
                      type="time"
                      class="rounded-lg bg-slate-950/60 border border-slate-700 px-2.5 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div class="flex flex-col gap-1">
                    <label
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-400"
                    >
                      Campo
                    </label>
                    <input
                      v-model="newGame.field"
                      type="text"
                      class="rounded-lg bg-slate-950/60 border border-slate-700 px-2.5 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      placeholder="Ej. Cancha 1"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-between mt-2">
                  <p v-if="addError" class="text-[11px] text-red-400">
                    {{ addError }}
                  </p>
                  <span v-else class="text-[11px] text-slate-500">
                    Completa los campos y guarda para registrar el partido.
                  </span>

                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 disabled:opacity-60"
                    :disabled="addingGame"
                    @click="addGame"
                  >
                    Guardar partido
                  </button>
                </div>
              </div>

              <!-- LISTA DE PARTIDOS -->
              <div
                class="rounded-xl bg-slate-900/80 border border-slate-700 overflow-hidden"
              >
                <div
                  class="px-4 py-3 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400"
                >
                  <span>Partidos del equipo (copia editable)</span>
                  <span>{{ teamGames.length }} partido(s)</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-[720px] w-full text-sm">
                    <thead>
                      <tr class="bg-slate-950/60 text-slate-400">
                        <th class="px-3 py-2 text-left">Fecha</th>
                        <th class="px-3 py-2 text-left">Hora</th>
                        <th class="px-3 py-2 text-left">Oponente</th>
                        <th class="px-3 py-2 text-left">Campo</th>
                        <th class="px-3 py-2 text-left">Estado</th>
                        <th class="px-3 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="g in teamGames"
                        :key="g.id"
                        class="border-t border-slate-800 hover:bg-slate-900/60"
                      >
                        <td class="px-3 py-2">
                          {{ g.date }}
                        </td>
                        <td class="px-3 py-2">
                          {{ g.time }}
                        </td>
                        <td class="px-3 py-2">
                          {{ g.opponent }}
                        </td>
                        <td class="px-3 py-2">
                          {{ g.field }}
                        </td>
                        <td class="px-3 py-2">
                          <button
                            type="button"
                            class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border"
                            :class="
                              g.status === 'SCHEDULED'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-400/60'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/60'
                            "
                            @click="toggleGameStatus(g)"
                          >
                            {{ g.status === 'SCHEDULED' ? 'SCHEDULED' : 'FINAL' }}
                          </button>
                        </td>
                        <td class="px-3 py-2 text-right">
                          <button
                            type="button"
                            class="text-[11px] text-red-300 hover:text-red-200"
                            @click="removeGame(g.id)"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>

                      <tr v-if="teamGames.length === 0">
                        <td
                          colspan="6"
                          class="px-3 py-4 text-center text-xs text-slate-500"
                        >
                          Aún no hay partidos registrados en esta copia local.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p class="text-[11px] text-slate-500">
                * Esta gestión es local. Después conectamos estos datos a tu API de
                Spring para guardar partidos reales.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuthRoles } from '@/composables/useAuthRoles'

interface Season {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface ApiTeam {
  teamId: number
  season: Season | null
  category: Category | null
  name: string
  shortName: string | null
  logoUrl: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  captain: string | null
}

interface Player {
  id: number
  fullName: string
  curp: string
  jerseyNumber: number | null
  birthdate: string | null
  photoUrl: string | null
}

interface LastGame {
  gameId: number
  opponentName: string
  date: string
  result: 'G' | 'P' | 'E' | string
  scoreFor: number
  scoreAgainst: number
}

interface TeamDetailResponse {
  team: ApiTeam
  players: Player[]
  lastGames: LastGame[]
  gallery: string[]
}

const route = useRoute()
const teamId = route.params.id as string

// Datos del backend
const { data, pending, error } = useApi<TeamDetailResponse>(`/teams/${teamId}/detail`)

const detail = computed<TeamDetailResponse | null>(
  () => (data.value as TeamDetailResponse) ?? null
)

const team = computed<ApiTeam | null>(() => detail.value?.team ?? null)

// Normalizar photoUrl "NULL" → null
const normalizeUrl = (url: string | null): string | null => {
  if (!url || url === 'NULL') return null
  return url
}

const players = computed<Player[]>(() => {
  const list = detail.value?.players ?? []
  return list.map((p) => ({
    ...p,
    photoUrl: normalizeUrl(p.photoUrl)
  }))
})

const lastGames = computed<LastGame[]>(() => {
  return detail.value?.lastGames?.slice(0, 3) ?? []
})

const gallery = computed<string[]>(() => {
  const list = detail.value?.gallery ?? []
  return list
    .map((url) => normalizeUrl(url))
    .filter((url): url is string => Boolean(url))
    .slice(0, 5)
})

// ===== ROLES Y TABS =====
const { isAdmin } = useAuthRoles()

type TeamTab = 'resumen' | 'partidos'
const activeTab = ref<TeamTab>('resumen')

// ===== PARTIDOS (ADMIN, LOCAL) =====
type GameStatusAdmin = 'SCHEDULED' | 'FINAL'

interface EditableGame {
  id: number
  opponent: string
  date: string
  time: string
  field: string
  status: GameStatusAdmin
}

const teamGames = ref<EditableGame[]>([])

// Inicializar copia editable a partir de lastGames
watch(
  lastGames,
  (games) => {
    teamGames.value = games.map((g) => ({
      id: g.gameId,
      opponent: g.opponentName,
      date: g.date,
      time: '20:00',
      field: 'Por definir',
      status: 'FINAL'
    }))
  },
  { immediate: true }
)

interface NewGameForm {
  opponent: string
  date: string
  time: string
  field: string
}

const newGame = ref<NewGameForm>({
  opponent: '',
  date: '',
  time: '',
  field: ''
})

const addingGame = ref(false)
const addError = ref<string | null>(null)

const addGame = () => {
  if (!isAdmin.value) return

  addError.value = null

  const { opponent, date, time, field } = newGame.value

  if (!opponent || !date || !time) {
    addError.value = 'Falta oponente, fecha u horario.'
    return
  }

  const nextId =
    teamGames.value.length > 0
      ? Math.max(...teamGames.value.map((g) => g.id)) + 1
      : 1

  teamGames.value.push({
    id: nextId,
    opponent,
    date,
    time,
    field: field || 'Por definir',
    status: 'SCHEDULED'
  })

  newGame.value = {
    opponent: '',
    date: '',
    time: '',
    field: ''
  }
}

const removeGame = (id: number) => {
  if (!isAdmin.value) return
  teamGames.value = teamGames.value.filter((g) => g.id !== id)
}

const toggleGameStatus = (game: EditableGame) => {
  if (!isAdmin.value) return
  game.status = game.status === 'SCHEDULED' ? 'FINAL' : 'SCHEDULED'
}

// Colores y hero
const primaryColor = computed(() => team.value?.colorPrimary || '#1D4ED8')
const secondaryColor = computed(() => team.value?.colorSecondary || '#22D3EE')

const heroGradientStyle = computed(() => {
  return {
    backgroundImage: `
      radial-gradient(circle at 0% 0%, ${primaryColor.value}, transparent 55%),
      radial-gradient(circle at 100% 100%, ${secondaryColor.value}, transparent 55%)
    `
  }
})

const teamActive = computed(() => true) // si luego tienes isActive en detail, cámbialo

const subtitleText = computed(() => {
  const season = team.value?.season?.name
  const category = team.value?.category?.name
  if (season && category) return `${season} · ${category}`
  if (season) return season
  if (category) return category
  return 'Roster y resultados oficiales para esta temporada.'
})

// Carrusel galería
const currentSlide = ref(0)

const showPrevSlide = () => {
  if (!gallery.value.length) return
  currentSlide.value =
    currentSlide.value === 0 ? gallery.value.length - 1 : currentSlide.value - 1
}

const showNextSlide = () => {
  if (!gallery.value.length) return
  currentSlide.value =
    currentSlide.value === gallery.value.length - 1 ? 0 : currentSlide.value + 1
}

// Resumen récord
const recordSummary = computed(() => {
  const games = lastGames.value
  if (!games.length) return 'Sin partidos recientes'
  const wins = games.filter((g) => g.result === 'G').length
  const losses = games.filter((g) => g.result === 'P').length
  const draws = games.filter((g) => g.result === 'E').length
  const base = `${wins}-${losses}${draws ? '-' + draws : ''}`
  return `${base} (últ. ${games.length})`
})

const formatGameDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getResultLabel = (code: string) => {
  if (code === 'G') return 'Ganado'
  if (code === 'P') return 'Perdido'
  if (code === 'E') return 'Empate'
  return code
}

const getResultClass = (code: string) => {
  if (code === 'G') {
    return 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/40'
  }
  if (code === 'P') {
    return 'bg-rose-500/15 text-rose-200 border border-rose-400/40'
  }
  if (code === 'E') {
    return 'bg-amber-500/15 text-amber-200 border border-amber-400/40'
  }
  return 'bg-slate-500/15 text-slate-200 border border-slate-400/40'
}

const getAgeFromBirthdate = (birthdate: string | null): number | null => {
  if (!birthdate) return null
  const date = new Date(birthdate)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1
  }
  return age
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.6);
  border-radius: 999px;
}
</style>
