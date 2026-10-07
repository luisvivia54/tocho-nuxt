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

          <div
            v-if="view === 'equipos'"
            class="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 shadow-lg backdrop-blur"
          >
            <p class="font-semibold text-slate-100">
              {{ `${filteredRows.length} equipo${filteredRows.length === 1 ? '' : 's'}` }}
            </p>
            <p class="mt-0.5">
              Filtros:
              <span class="text-slate-100 font-semibold">{{ selectedRamaLabel }}</span>
              ·
              <span class="text-slate-100 font-semibold">{{ selectedCategoriaLabel }}</span>
            </p>
          </div>
        </header>

        <!-- FILTROS DE EQUIPOS (en jugadores viven dentro del panel de líderes) -->
        <section v-if="view === 'equipos'" class="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur">
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
                    <option v-for="opt in ramaOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
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
              <div>
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

          <!-- Chips / estado -->
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span class="text-slate-400">Estado:</span>

            <span
              v-if="selectedRama !== 'all'"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Rama: <strong class="text-slate-100">{{ selectedRamaOptionLabel }}</strong>
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
              v-if="searchQuery.trim()"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1"
            >
              Búsqueda: <strong class="text-slate-100">"{{ searchQuery.trim() }}"</strong>
              <button type="button" class="text-slate-300 hover:text-white" @click="clearSearch">✕</button>
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
                    class="border-b border-slate-800 last:border-0 transition"
                    :class="row.isActive ? 'hover:bg-slate-800/35' : 'bg-red-950/20 hover:bg-red-950/30'"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div
                          class="h-10 w-10 rounded-xl overflow-hidden border flex items-center justify-center shrink-0"
                          :class="row.isActive ? 'border-slate-700 bg-slate-950/70' : 'border-red-500/40 bg-slate-950/70 grayscale opacity-60'"
                        >
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
                          <div class="flex items-center gap-2 flex-wrap">
                            <p
                              class="font-semibold truncate"
                              :class="row.isActive ? 'text-white' : 'text-red-300 line-through decoration-red-500/60'"
                            >
                              {{ row.teamName }}
                            </p>
                            <span
                              v-if="!row.isActive"
                              class="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0"
                            >
                              ✕ Eliminado
                            </span>
                          </div>
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
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.gp }}</td>
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.wins }}</td>
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.losses }}</td>
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.draws }}</td>
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.pointsFor }}</td>
                    <td class="px-4 py-3 text-slate-200" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.pointsAgainst }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                        :class="[
                          row.diff >= 0
                            ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-200 border border-red-500/20',
                          !row.isActive && 'blur-[3px] select-none opacity-50'
                        ]"
                      >
                        {{ row.diff }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-100 font-semibold" :class="!row.isActive && 'blur-[3px] select-none opacity-50'">{{ row.tablePoints }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-full bg-white/10 text-white px-2 py-0.5 text-xs font-semibold border border-white/10"
                        :class="!row.isActive && 'blur-[3px] select-none opacity-50'"
                      >
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
          <!-- PANEL DE LÍDERES: categoría → rama → estadística, y búsqueda -->
          <section class="mb-4 rounded-2xl border border-slate-700 bg-slate-900/60 shadow-lg backdrop-blur">
            <div class="p-4 sm:p-5">
              <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div class="min-w-0">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Líderes</p>
                  <h2 class="mt-1 font-display text-xl md:text-2xl font-extrabold text-white">
                    <span :class="selectedPlayerStatOption.textClass">{{ selectedPlayerStatOption.name }}</span>
                    <span class="text-slate-600"> · </span>
                    <span>{{ leaderTitleLabel }}</span>
                  </h2>
                  <p class="mt-1 text-xs text-slate-400">
                    <template v-if="pendingPlayersAny">Cargando jugadores…</template>
                    <template v-else>
                      {{ sortedPlayers.length }} jugador{{ sortedPlayers.length === 1 ? '' : 'es' }}
                    </template>
                  </p>
                </div>

                <div
                  class="flex w-full md:w-auto rounded-2xl border border-slate-700 bg-slate-950/60 p-1"
                  role="tablist"
                  aria-label="Categoría"
                >
                  <button
                    v-for="tab in leaderCategoriaTabs"
                    :key="tab.value"
                    type="button"
                    role="tab"
                    :aria-selected="activeLeaderCategoria === tab.value"
                    class="flex-1 md:flex-none rounded-xl px-3 sm:px-4 py-2 text-sm font-semibold transition whitespace-nowrap"
                    :class="activeLeaderCategoria === tab.value
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'"
                    @click="leaderCategoria = tab.value"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>

              <div class="mt-4 space-y-3 border-t border-slate-700/70 pt-4">
                <!-- Rama: solo las que existen en la categoría elegida -->
                <div v-if="leaderRamaTabs.length > 2" class="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <p class="shrink-0 text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:w-24">Rama</p>
                  <div
                    class="-mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
                    role="tablist"
                    aria-label="Rama"
                  >
                    <button
                      v-for="tab in leaderRamaTabs"
                      :key="tab.value"
                      type="button"
                      role="tab"
                      :aria-selected="selectedRama === tab.value"
                      class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
                      :class="selectedRama === tab.value
                        ? 'border-white/70 bg-white/10 text-white'
                        : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'"
                      @click="selectedRama = tab.value"
                    >
                      {{ tab.label }}
                    </button>
                  </div>
                </div>

                <div class="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <p class="shrink-0 text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:w-24">Estadística</p>
                  <div
                    class="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
                    role="tablist"
                    aria-label="Estadística a mostrar"
                  >
                    <button
                      v-for="opt in playerStatOptions"
                      :key="opt.key"
                      type="button"
                      role="tab"
                      :aria-selected="selectedPlayerStat === opt.key"
                      :title="opt.name"
                      class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition"
                      :class="selectedPlayerStat === opt.key
                        ? opt.activeClass
                        : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'"
                      @click="selectedPlayerStat = opt.key"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Búsqueda y equipo -->
            <div class="flex flex-col gap-2 rounded-b-2xl border-t border-slate-700/70 bg-slate-950/40 p-3 sm:flex-row sm:items-center sm:px-5">
              <div class="relative min-w-0 flex-1">
                <svg
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="6" />
                  <path d="m14 14 4 4" stroke-linecap="round" />
                </svg>
                <input
                  v-model="playerNameQuery"
                  type="search"
                  placeholder="Buscar por nombre o número"
                  aria-label="Buscar jugador por nombre o número"
                  class="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div class="flex items-center gap-2">
                <select
                  v-model="teamPick"
                  aria-label="Equipo"
                  class="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-56 sm:flex-none"
                >
                  <option value="ALL">Todos los equipos</option>
                  <option v-for="team in playerTeamOptions" :key="team.teamId" :value="String(team.teamId)">
                    {{ team.name }}
                  </option>
                </select>

                <button
                  v-if="hasPlayerFilters"
                  type="button"
                  class="shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                  @click="clearPlayerFilters"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-50"
                  :disabled="pendingPlayersAny"
                  title="Refrescar"
                  aria-label="Refrescar"
                  @click="refreshAll"
                >
                  <svg
                    class="h-4 w-4"
                    :class="pendingPlayersAny ? 'animate-spin' : ''"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="M16 10a6 6 0 1 1-1.76-4.24M16 3v4h-4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

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
              No hay jugadores en {{ leaderTitleLabel }}<template v-if="hasPlayerFilters"> con esos filtros</template>.
            </p>
            <button
              v-if="hasPlayerFilters"
              type="button"
              class="mt-3 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
              @click="clearPlayerFilters"
            >
              Limpiar filtros
            </button>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="(player, idx) in pagedPlayers"
              :key="player.key"
              class="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg hover:border-slate-500 transition"
            >
              <div class="flex items-center gap-3 md:gap-4">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    class="h-10 w-10 rounded-2xl border grid place-items-center shrink-0"
                    :class="rankBoxClass(playerRankByKey.get(player.key) ?? pageStartIndex + idx + 1, player.stats[selectedPlayerStat])"
                  >
                    <span class="text-sm font-extrabold tabular-nums">
                      {{ player.stats[selectedPlayerStat] > 0 ? (playerRankByKey.get(player.key) ?? pageStartIndex + idx + 1) : '–' }}
                    </span>
                  </div>

                  <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border border-slate-700 bg-slate-950/70 overflow-hidden flex items-center justify-center shrink-0">
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
                      <p class="font-semibold text-white leading-snug break-words sm:truncate sm:max-w-[420px]">
                        {{ player.fullName }}
                      </p>

                      <span
                        v-if="player.number !== null && player.number !== undefined"
                        class="text-slate-400 font-semibold"
                      >
                        #{{ player.number }}
                      </span>

                      <button
                        v-if="player.teamsCount > 1"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-200 px-2 py-0.5 text-[11px] font-semibold border border-sky-500/25 hover:bg-sky-500/25 transition"
                        :aria-expanded="isPlayerExpanded(player.key)"
                        @click="togglePlayerExpanded(player.key)"
                      >
                        {{ player.teamsCount }} equipos
                        <span
                          class="inline-block transition-transform"
                          :class="isPlayerExpanded(player.key) ? 'rotate-180' : ''"
                        >▾</span>
                      </button>
                    </div>

                    <p class="mt-0.5 text-[12px] text-slate-300 truncate">
                      {{ player.teamName || '—' }}<span v-if="player.teamsCount > 1" class="text-slate-500"> · +{{ player.teamsCount - 1 }} más</span>
                    </p>

                    <p class="text-[11px] text-slate-500 truncate">
                      {{ player.teamCode || '—' }}<span v-if="player.gender"> · {{ niceGender(player.gender) }}</span>
                    </p>
                  </div>
                </div>

                <div class="shrink-0">
                  <div
                    class="rounded-2xl border px-3 py-2 min-w-[64px] md:min-w-[110px] md:px-4 text-center"
                    :class="selectedPlayerStatOption.boxClass"
                  >
                    <p class="text-[10px] uppercase tracking-[0.22em] text-slate-400">{{ selectedPlayerStatOption.label }}</p>
                    <p
                      class="mt-0.5 text-xl md:text-2xl font-extrabold tabular-nums"
                      :class="player.stats[selectedPlayerStat] > 0 ? selectedPlayerStatOption.textClass : 'text-slate-500'"
                    >
                      {{ player.stats[selectedPlayerStat] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- DESGLOSE POR EQUIPO / CATEGORÍA -->
              <div
                v-if="player.teamsCount > 1 && isPlayerExpanded(player.key)"
                class="mt-3 border-t border-slate-700/70 pt-3 space-y-2"
              >
                <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Desglose por equipo
                </p>

                <div
                  v-for="b in sortedBreakdown(player)"
                  :key="`${player.key}-${b.teamId ?? 'x'}`"
                  class="rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 flex items-center justify-between gap-3"
                >
                  <div class="min-w-0">
                    <p class="text-[12px] font-semibold text-slate-200 truncate">
                      {{ b.teamName || '—' }}
                    </p>
                    <p class="text-[10px] text-slate-500 truncate">
                      {{ b.teamCode || '—' }}<span v-if="b.gender"> · {{ niceGender(b.gender) }}</span><span v-if="b.number !== null && b.number !== undefined"> · #{{ b.number }}</span>
                    </p>
                  </div>

                  <div
                    class="rounded-lg border px-3 py-1 text-center shrink-0"
                    :class="selectedPlayerStatOption.boxClass"
                  >
                    <p class="text-[9px] uppercase tracking-[0.18em] text-slate-400">{{ selectedPlayerStatOption.label }}</p>
                    <p class="text-sm font-bold tabular-nums" :class="selectedPlayerStatOption.textClass">
                      {{ b.stats[selectedPlayerStat] }}
                    </p>
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
  levelOrder?: string | null
  displayName?: string | null
}

interface ApiStanding {
  standingId?: number
  teamId?: number
  teamName?: string
  shortName?: string
  gender?: string
  categoryCode?: string
  levelOrder?: string | null
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
  isActive: boolean
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

type PlayerStatKey = 'td' | 'int' | 'pa' | 'sack'

interface PlayerStatOption {
  key: PlayerStatKey
  label: string
  name: string
  boxClass: string
  textClass: string
  activeClass: string
}

// Estadísticas que se pueden ver en la lista de jugadores (una a la vez).
// La primera es la que aparece seleccionada por defecto.
const playerStatOptions: PlayerStatOption[] = [
  { key: 'td', label: 'TD', name: 'Touchdowns', boxClass: 'border-violet-500/20 bg-violet-500/10', textClass: 'text-violet-200', activeClass: 'border-violet-300 bg-violet-300 text-slate-950' },
  { key: 'int', label: 'INT', name: 'Intercepciones', boxClass: 'border-fuchsia-500/20 bg-fuchsia-500/10', textClass: 'text-fuchsia-200', activeClass: 'border-fuchsia-300 bg-fuchsia-300 text-slate-950' },
  { key: 'pa', label: 'PA', name: 'Pases de anotación', boxClass: 'border-sky-500/20 bg-sky-500/10', textClass: 'text-sky-200', activeClass: 'border-sky-300 bg-sky-300 text-slate-950' },
  { key: 'sack', label: 'SACK', name: 'Sacks', boxClass: 'border-emerald-500/20 bg-emerald-500/10', textClass: 'text-emerald-200', activeClass: 'border-emerald-300 bg-emerald-300 text-slate-950' },
]

// Desglose de un jugador dentro de UN equipo/categoría concreto
interface PlayerTeamStat {
  teamId: number | null
  teamName: string
  teamCode: string
  gender: string
  number?: number | null
  stats: PlayerStats
}

interface PlayerVM {
  id: number
  key: string                  // llave de agrupación (personKey del back, o fallback por id)
  fullName: string
  number?: number | null
  photoUrl?: string | null
  teamId?: number | null       // equipo representativo (el de mayor impacto)
  teamName?: string
  teamCode?: string
  gender?: string
  stats: PlayerStats           // totales sumados de todos sus equipos
  breakdown: PlayerTeamStat[]  // una entrada por equipo/categoría
  teamsCount: number
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

function impactStats(s: PlayerStats): number {
  return s.td + s.int + s.pa + s.sack
}
function impact(p: PlayerVM): number {
  return impactStats(p.stats)
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
/** "0", vacio o ausente significan "sin division". */
function normLevel(raw: unknown): string | null {
  const v = String(raw ?? '').trim()
  if (!v || v === '0') return null
  return v.toUpperCase()
}

/** Llave de rama+division: "LIBRE|A", "LIBRE|B", o "35+" si la rama no esta dividida. */
function ramaKeyOf(code: unknown, level: string | null): string {
  const c = normalizeUpper(code)
  if (!c) return ''
  return level ? `${c}|${level}` : c
}

function ramaLabelOf(code: unknown, level: string | null): string {
  const c = String(code ?? '').trim()
  if (!c) return ''
  return level ? `${c} ${level}` : c
}

// selectedRama guarda la llave completa; estas dos la parten para usarla.
const selectedRama = ref<string>('all')

const selectedRamaCode = computed(() =>
  selectedRama.value === 'all' ? null : (selectedRama.value.split('|')[0] ?? null)
)

const selectedRamaLevel = computed(() => {
  if (selectedRama.value === 'all') return null
  return normLevel(selectedRama.value.split('|')[1])
})
const selectedCategoria = ref<string>('all')
const searchQuery = ref('')

const selectedRamaLabel = computed(() =>
  selectedRama.value === 'all' ? 'Todas las ramas' : selectedRamaOptionLabel.value
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
  const map = new Map<string, string>()

  for (const c of categoriesList.value) {
    const level = normLevel(c?.levelOrder)
    const key = ramaKeyOf(c?.code, level)
    if (key && !map.has(key)) map.set(key, ramaLabelOf(c?.code, level))
  }

  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'))
})

const selectedRamaOptionLabel = computed(
  () => ramaOptions.value.find((o) => o.value === selectedRama.value)?.label ?? selectedRama.value
)

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
  categoryCode: selectedRamaCode.value ?? undefined,
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
    // El back filtra por code (devuelve A y B juntas); la division se separa aqui.
    .filter((row) => {
      const want = selectedRamaLevel.value
      if (!want) return true
      return normLevel(row?.levelOrder) === want
    })
    .map((row) => {
      const teamId = toNullableNumber(row.teamId)
      const team = teamId !== null ? teamById.value.get(teamId) : undefined

      const teamName = String(row.teamName || team?.name || '—').trim()
      const shortName = String(row.shortName || team?.shortName || '').trim()
      const categoryCode = normalizeUpper(row.categoryCode || team?.categoryCode || team?.code || team?.category?.code || '')
      const gender = normalizeUpper(row.gender || team?.gender || team?.categoryGender || team?.category?.gender || '')
      // Si no encontramos el equipo en teams/list no asumimos que está eliminado
      const isActive = team ? team.isActive !== false : true

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
        isActive,
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

// Categoría de la tabla de líderes. null = automática (la primera disponible,
// normalmente Varonil). 'all' = todas juntas.
const leaderCategoria = ref<string | null>(null)

const CATEGORIA_ORDER = ['VARONIL', 'FEMENIL', 'MIXTO']

const leaderCategoriaTabs = computed(() => {
  const tabs = categoriaOptions.value
    .slice()
    .sort((a, b) => {
      const ia = CATEGORIA_ORDER.indexOf(a)
      const ib = CATEGORIA_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b, 'es')
    })
    .map((g) => ({ value: g, label: niceGender(g) }))
  return [...tabs, { value: 'all', label: 'Todas' }]
})

const activeLeaderCategoria = computed<string>(() => {
  const tabs = leaderCategoriaTabs.value
  if (leaderCategoria.value && tabs.some((t) => t.value === leaderCategoria.value)) return leaderCategoria.value
  return tabs[0]?.value ?? 'all'
})

// Ramas disponibles dentro de la categoría elegida (p. ej. Mixto no tiene 35+).
function prettyRamaCode(code: unknown): string {
  const c = String(code ?? '').trim()
  return c.toUpperCase() === 'LIBRE' ? 'Libre' : c
}

function ramaSortKey(key: string): [number, number, string] {
  const [code = '', level = ''] = key.split('|')
  const c = code.toUpperCase()
  if (c === 'LIBRE') return [0, level.charCodeAt(0) || 0, '']
  const plus = c.match(/^(\d+)\+$/)
  if (plus) return [1, -Number(plus[1]), '']
  const under = c.match(/^U(\d+)$/)
  if (under) return [2, -Number(under[1]), '']
  return [3, 0, c]
}

const leaderRamaTabs = computed(() => {
  const gender = activeLeaderCategoria.value
  const map = new Map<string, string>()

  for (const c of categoriesList.value) {
    if (gender !== 'all' && normalizeUpper(c?.gender) !== gender) continue
    const level = normLevel(c?.levelOrder)
    const key = ramaKeyOf(c?.code, level)
    if (key && !map.has(key)) map.set(key, level ? `${prettyRamaCode(c?.code)} ${level}` : prettyRamaCode(c?.code))
  }

  const tabs = Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => {
      const ka = ramaSortKey(a.value)
      const kb = ramaSortKey(b.value)
      return ka[0] - kb[0] || ka[1] - kb[1] || ka[2].localeCompare(kb[2], 'es')
    })

  return [{ value: 'all', label: 'Todas' }, ...tabs]
})

const leaderCategoriaLabel = computed(() =>
  activeLeaderCategoria.value === 'all' ? 'Todas las categorías' : niceGender(activeLeaderCategoria.value)
)

// "Varonil · Libre A" → se usa en el título del panel.
const leaderTitleLabel = computed(() => {
  const rama = selectedRama.value === 'all'
    ? ''
    : leaderRamaTabs.value.find((t) => t.value === selectedRama.value)?.label ?? ''
  return rama ? `${leaderCategoriaLabel.value} ${rama}` : leaderCategoriaLabel.value
})

const selectedPlayerStat = ref<PlayerStatKey>(playerStatOptions[0]!.key)
const selectedPlayerStatOption = computed<PlayerStatOption>(() => {
  return playerStatOptions.find((opt) => opt.key === selectedPlayerStat.value) ?? playerStatOptions[0]!
})

// Desglose por persona expandido/colapsado (por key de agrupación)
const expandedPlayers = ref<Set<string>>(new Set())
function isPlayerExpanded(key: string): boolean {
  return expandedPlayers.value.has(key)
}
function togglePlayerExpanded(key: string): void {
  const next = new Set(expandedPlayers.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedPlayers.value = next
}

const playerTeamOptions = computed(() => {
  return teamsList.value
    .filter((team) => {
      const code = normalizeUpper(getTeamCode(team))
      const gender = normalizeUpper(getTeamGender(team))

      if (selectedRamaCode.value && code !== normalizeUpper(selectedRamaCode.value)) return false
      if (
        selectedRamaLevel.value &&
        normLevel((team as Record<string, unknown>)?.categoryLevelOrder) !== selectedRamaLevel.value
      ) {
        return false
      }
      if (activeLeaderCategoria.value !== 'all' && gender !== normalizeUpper(activeLeaderCategoria.value)) return false
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
  // Agrupamos por PERSONA. La llave preferida es personKey (hash de CURP que
  // manda el back); si no viene (endpoint viejo o fallback), caemos al id
  // numérico para que cada jugador siga siendo su propio grupo.
  const groups = new Map<string, PlayerVM>()

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

    if (selectedRamaCode.value && teamCode !== normalizeUpper(selectedRamaCode.value)) continue
    if (
      selectedRamaLevel.value &&
      normLevel((team as Record<string, unknown> | undefined)?.categoryLevelOrder) !== selectedRamaLevel.value
    ) {
      continue
    }
    if (activeLeaderCategoria.value !== 'all' && gender !== normalizeUpper(activeLeaderCategoria.value)) continue

    const explicitId = toNum(raw?.playerId ?? raw?.player_id ?? raw?.id)
    const syntheticId = stringHash(`${fullName}|${teamId ?? 'x'}|${raw?.number ?? raw?.jerseyNumber ?? raw?.jersey_number ?? ''}`)
    const id = explicitId > 0 ? explicitId : syntheticId

    // Llave de agrupación de PERSONA, en orden de preferencia:
    //  1) personKey (hash de CURP que manda el leaderboard del back)
    //  2) curp normalizada (el roster equipo-por-equipo sí trae curp)
    //  3) id de inscripción (último recurso: cada fila queda separada)
    const personKey = String(raw?.personKey ?? raw?.person_key ?? raw?.curpHash ?? '').trim()
    const curpKey = String(raw?.curp ?? raw?.CURP ?? raw?.curp_id ?? '').trim().toLowerCase()
    const groupKey = personKey || (curpKey ? `curp:${curpKey}` : `id:${id}`)

    const number = raw?.number ?? raw?.jerseyNumber ?? raw?.jersey_number ?? raw?.num ?? null
    const photoUrl = raw?.photoUrl ?? raw?.photo_url ?? raw?.photo ?? raw?.avatarUrl ?? null

    const stats: PlayerStats = {
      td: toNum(raw?.td ?? raw?.tds ?? raw?.touchdowns ?? raw?.stats?.td ?? raw?.stats?.tds),
      int: toNum(raw?.int ?? raw?.intercep ?? raw?.interceptions ?? raw?.stats?.int ?? raw?.stats?.interceptions),
      pa: toNum(raw?.pa ?? raw?.passTd ?? raw?.passingTd ?? raw?.passing_td ?? raw?.stats?.pa ?? raw?.stats?.passingTd),
      sack: toNum(raw?.sack ?? raw?.sacks ?? raw?.stats?.sack ?? raw?.stats?.sacks),
      rec: toNum(raw?.rec ?? raw?.receptions ?? raw?.stats?.rec ?? raw?.stats?.receptions),
    }

    let g = groups.get(groupKey)
    if (!g) {
      g = {
        id,
        key: groupKey,
        fullName,
        number,
        photoUrl,
        teamId,
        teamName: teamName || undefined,
        teamCode,
        gender,
        stats: { td: 0, int: 0, pa: 0, sack: 0, rec: 0 },
        breakdown: [],
        teamsCount: 0,
      }
      groups.set(groupKey, g)
    }

    // Sumar a los totales de la persona
    g.stats.td += stats.td
    g.stats.int += stats.int
    g.stats.pa += stats.pa
    g.stats.sack += stats.sack
    g.stats.rec += stats.rec

    // Conservar una foto/dorsal si el grupo aún no tiene
    if (!g.photoUrl && photoUrl) g.photoUrl = photoUrl

    // Desglose: fusionar por equipo (por si hay varias filas del mismo equipo)
    const existing = g.breakdown.find((b) => b.teamId === teamId)
    if (existing) {
      existing.stats.td += stats.td
      existing.stats.int += stats.int
      existing.stats.pa += stats.pa
      existing.stats.sack += stats.sack
      existing.stats.rec += stats.rec
    } else {
      g.breakdown.push({
        teamId,
        teamName: teamName || '—',
        teamCode,
        gender,
        number,
        stats: { ...stats },
      })
    }
  }

  const list = Array.from(groups.values())
  for (const g of list) {
    g.teamsCount = g.breakdown.length
    // Representativo = el equipo donde tiene mayor impacto
    const rep = g.breakdown.slice().sort((a, b) => impactStats(b.stats) - impactStats(a.stats))[0]
    if (rep) {
      g.teamId = rep.teamId
      g.teamName = rep.teamName && rep.teamName !== '—' ? rep.teamName : g.teamName
      g.teamCode = rep.teamCode
      g.gender = rep.gender
      if (g.number == null) g.number = rep.number ?? null
    }
  }
  return list
})

const filteredPlayers = computed<PlayerVM[]>(() => {
  const nameQ = playerNameQuery.value.trim().toLowerCase()
  const numQ = playerNumberQuery.value.trim()

  return playersVm.value.filter((player) => {
    if (teamPick.value !== 'ALL') {
      const wanted = Number(teamPick.value)
      // La persona pasa si juega en ese equipo (en cualquiera de su desglose)
      if (Number.isFinite(wanted) && !player.breakdown.some((b) => b.teamId === wanted)) return false
    }

    if (nameQ) {
      // Un solo campo: si es un número, también busca por número de jersey exacto.
      const full = String(player.fullName || '').toLowerCase()
      const isNumber = /^\d+$/.test(nameQ)
      const numberHit =
        isNumber &&
        (String(player.number ?? '') === nameQ || player.breakdown.some((b) => String(b.number ?? '') === nameQ))
      if (!full.includes(nameQ) && !numberHit) return false
    }

    if (numQ) {
      const hit =
        String(player.number ?? '').includes(numQ) ||
        player.breakdown.some((b) => String(b.number ?? '').includes(numQ))
      if (!hit) return false
    }

    return true
  })
})

// Líder = más de la estadística seleccionada. En empate, desempata el
// impacto total y luego el nombre.
function comparePlayers(a: PlayerVM, b: PlayerVM): number {
  const key = selectedPlayerStat.value
  const byStat = b.stats[key] - a.stats[key]
  if (byStat !== 0) return byStat
  const byImpact = impact(b) - impact(a)
  if (byImpact !== 0) return byImpact
  return a.fullName.localeCompare(b.fullName, 'es')
}

const sortedPlayers = computed<PlayerVM[]>(() => filteredPlayers.value.slice().sort(comparePlayers))

// Posición real dentro de la categoría/rama (sin contar búsqueda ni equipo),
// para que al buscar a alguien se vea su lugar verdadero. Empates comparten
// lugar (1, 2, 2, 4...).
const playerRankByKey = computed(() => {
  const key = selectedPlayerStat.value
  const list = playersVm.value.slice().sort(comparePlayers)
  const ranks = new Map<string, number>()
  let prevValue: number | null = null
  let prevRank = 0
  list.forEach((p, i) => {
    const rank = prevValue !== null && p.stats[key] === prevValue ? prevRank : i + 1
    ranks.set(p.key, rank)
    prevValue = p.stats[key]
    prevRank = rank
  })
  return ranks
})

function sortedBreakdown(player: PlayerVM): PlayerTeamStat[] {
  const key = selectedPlayerStat.value
  return player.breakdown.slice().sort((a, b) => b.stats[key] - a.stats[key])
}

function rankBoxClass(rank: number, value = 1): string {
  // Sin la estadística no hay posición ni medalla.
  if (value <= 0) return 'border-slate-800 bg-slate-950/40 text-slate-600'
  if (rank === 1) return 'border-amber-300 bg-amber-400 text-slate-950'
  if (rank === 2) return 'border-slate-200 bg-slate-300 text-slate-950'
  if (rank === 3) return 'border-orange-300 bg-orange-400/90 text-slate-950'
  return 'border-slate-700 bg-slate-950/70 text-slate-200'
}

const pageSize = 10

const totalPlayerPages = computed(() => Math.max(1, Math.ceil(sortedPlayers.value.length / pageSize)))
const pageStartIndex = computed(() => (page.value - 1) * pageSize)
const pageEndIndex = computed(() => Math.min(sortedPlayers.value.length, pageStartIndex.value + pageSize))

const pagedPlayers = computed<PlayerVM[]>(() => {
  return sortedPlayers.value.slice(pageStartIndex.value, pageEndIndex.value)
})

watch([selectedRama, selectedCategoria, playerNameQuery, playerNumberQuery, teamPick, selectedPlayerStat, activeLeaderCategoria], () => {
  page.value = 1
})

// Al cambiar de categoría: si la rama o el equipo elegidos no existen ahí, se quitan.
watch(activeLeaderCategoria, () => {
  if (view.value === 'jugadores' && selectedRama.value !== 'all' && !leaderRamaTabs.value.some((t) => t.value === selectedRama.value)) {
    selectedRama.value = 'all'
  }
})

watch([activeLeaderCategoria, selectedRama], () => {
  if (teamPick.value === 'ALL') return
  if (!playerTeamOptions.value.some((t) => String(t.teamId) === teamPick.value)) teamPick.value = 'ALL'
})

const hasPlayerFilters = computed(
  () => !!playerNameQuery.value.trim() || teamPick.value !== 'ALL' || selectedRama.value !== 'all'
)

function clearPlayerFilters() {
  playerNameQuery.value = ''
  playerNumberQuery.value = ''
  teamPick.value = 'ALL'
  selectedRama.value = 'all'
}

watch(totalPlayerPages, (tp) => {
  if (page.value > tp) page.value = tp
})

// El fetch de jugadores usa { server: false } (solo corre en cliente), así que
// en el servidor su `pending` reporta false aunque aún no haya datos. Eso hacía
// que SSR pintara "Sin resultados" mientras el cliente, al arrancar, esperaba
// "Cargando...", produciendo un mismatch de hidratación y un parpadeo visible.
// Forzamos "pendiente" también en el servidor para que ambos lados coincidan
// en el primer render; no cambia cuándo ni cómo se piden los datos.
const pendingPlayersAny = computed(() => pendingPlayers.value || pendingTeams.value || import.meta.server)
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

const clearFilters = () => {
  selectedRama.value = 'all'
  selectedCategoria.value = 'all'
  searchQuery.value = ''
  playerNameQuery.value = ''
  playerNumberQuery.value = ''
  teamPick.value = 'ALL'
  leaderCategoria.value = null
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