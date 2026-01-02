<template>
  <main class="min-h-screen bg-[#050816] text-slate-50">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <!-- HEADER -->
        <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Tochero5 · Consola Admin</p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">Partidos</h1>
            <p class="mt-1 text-sm text-slate-400">
              Flujo: <b>Categoría</b> → <b>Local</b> y <b>Visitante</b> → <b>Fecha/Hora</b> → <b>Cancha</b> → Finalizar + Stats
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="hardRefresh()"
              class="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500"
            >
              ⟳ Actualizar
            </button>

            <NuxtLink
              to="/"
              class="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500"
            >
              Inicio
            </NuxtLink>
          </div>
        </header>

        <!-- GATES -->
        <div v-if="!kcReady" class="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-lg backdrop-blur">
          <p class="text-sm font-semibold text-slate-100">Inicializando sesión…</p>
          <p class="mt-1 text-xs text-slate-400">Espera a que Keycloak esté listo.</p>
        </div>

        <div v-else-if="!isAdmin" class="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 shadow-lg backdrop-blur">
          <p class="text-sm font-semibold text-rose-100">Acceso denegado</p>
          <p class="mt-1 text-xs text-rose-200/80">Tu usuario no tiene rol <b>admin</b>.</p>
        </div>

        <!-- ADMIN UI -->
        <div v-else class="mt-8 space-y-6">
          <!-- CREATE / EDIT -->
          <section class="rounded-2xl border border-slate-700 bg-slate-900/60 shadow-lg backdrop-blur overflow-hidden">
            <div class="h-1.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500"></div>

            <div class="p-4 sm:p-5">
              <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    {{ editingId ? `Editando juego #${editingId}` : 'Crear partido' }}
                  </p>
                  <h2 class="mt-1 text-base font-semibold text-white">
                    {{ editingId ? 'Editar partido' : 'Nuevo partido' }}
                  </h2>
                </div>

                <div class="flex items-center gap-2">
                  <div class="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                    Equipos: <span class="text-slate-100 font-semibold">{{ teams.length }}</span>
                    · Partidos: <span class="text-slate-100 font-semibold">{{ gamesVm.length }}</span>
                  </div>

                  <button
                    type="button"
                    @click="clearForm()"
                    class="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500"
                  >
                    {{ editingId ? 'Cancelar' : 'Limpiar' }}
                  </button>
                </div>
              </div>

              <!-- FORM GRID -->
              <div class="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <!-- Category -->
                <div class="lg:col-span-4">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Categoría (rama + gender)</label>
                  <select
                    v-model.number="form.categoryId"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option :value="0">— Selecciona —</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      {{ categoryLabel(c) }}
                    </option>
                  </select>

                  <label class="mt-3 inline-flex items-center gap-2 text-xs text-slate-300 select-none">
                    <input type="checkbox" v-model="filterTeamsByCategory" class="accent-blue-500" />
                    Filtrar equipos por esta categoría
                  </label>

                  <p v-if="catHint" class="mt-2 text-[11px] text-slate-400">
                    Seleccionada: <span class="text-slate-100 font-semibold">{{ catHint }}</span>
                  </p>
                </div>

                <!-- Home -->
                <div class="lg:col-span-4">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Local</label>

                  <div class="relative">
                    <input
                      v-model.trim="homeInput"
                      @focus="homeOpen = true"
                      @blur="closeHomeLater()"
                      placeholder="Buscar equipo local…"
                      class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <button
                      v-if="homeTeamId"
                      type="button"
                      @click="clearHome()"
                      class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- suggestions (máx 5) -->
                  <div
                    v-if="homeOpen && homeSuggestions.length"
                    class="mt-2 rounded-xl border border-slate-700 bg-slate-950/70 overflow-hidden"
                  >
                    <button
                      v-for="t in homeSuggestions"
                      :key="`h-${t.teamId}`"
                      type="button"
                      @mousedown.prevent="pickHome(t)"
                      class="w-full text-left px-3 py-2 hover:bg-white/5 flex items-start gap-3"
                    >
                      <div class="h-8 w-8 rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                        <img v-if="t.logoUrl" :src="t.logoUrl" :alt="t.name" class="h-full w-full object-cover" />
                        <span v-else class="text-[11px] font-extrabold text-slate-200">
                          {{ initials(t.shortName || t.name || 'L') }}
                        </span>
                      </div>

                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-white truncate">{{ t.name }}</p>

                        <!-- ✅ EXACTO estilo ejemplo: team.category.code / team.category.gender -->
                        <div class="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                          <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            Rama:
                            <strong class="text-white/95">{{ (t.category?.code || '—').toUpperCase() }}</strong>
                          </span>

                          <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            Categoría:
                            <strong class="text-white/95">{{ niceGender((t.category?.gender || '—').toUpperCase()) }}</strong>
                          </span>

                          <span v-if="t.category?.name" class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            <strong class="text-white/95 truncate max-w-[14rem]">{{ t.category.name }}</strong>
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  <p v-if="homeTeam" class="mt-2 text-[11px] text-slate-400">
                    Seleccionado: <span class="text-slate-100 font-semibold">{{ homeTeam.name }}</span>
                    <span class="text-slate-500">·</span>
                    Rama <span class="text-slate-100 font-semibold">{{ homeTeam.category?.code || '—' }}</span>
                    <span class="text-slate-500">·</span>
                    {{ niceGender(homeTeam.category?.gender || '—') }}
                  </p>
                </div>

                <!-- Away -->
                <div class="lg:col-span-4">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Visitante</label>

                  <div class="relative">
                    <input
                      v-model.trim="awayInput"
                      @focus="awayOpen = true"
                      @blur="closeAwayLater()"
                      placeholder="Buscar equipo visitante…"
                      class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    />
                    <button
                      v-if="awayTeamId"
                      type="button"
                      @click="clearAway()"
                      class="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 text-xs hover:border-slate-500"
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    v-if="awayOpen && awaySuggestions.length"
                    class="mt-2 rounded-xl border border-slate-700 bg-slate-950/70 overflow-hidden"
                  >
                    <button
                      v-for="t in awaySuggestions"
                      :key="`a-${t.teamId}`"
                      type="button"
                      @mousedown.prevent="pickAway(t)"
                      class="w-full text-left px-3 py-2 hover:bg-white/5 flex items-start gap-3"
                    >
                      <div class="h-8 w-8 rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                        <img v-if="t.logoUrl" :src="t.logoUrl" :alt="t.name" class="h-full w-full object-cover" />
                        <span v-else class="text-[11px] font-extrabold text-slate-200">
                          {{ initials(t.shortName || t.name || 'V') }}
                        </span>
                      </div>

                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-white truncate">{{ t.name }}</p>

                        <div class="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                          <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            Rama:
                            <strong class="text-white/95">{{ (t.category?.code || '—').toUpperCase() }}</strong>
                          </span>

                          <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            Categoría:
                            <strong class="text-white/95">{{ niceGender((t.category?.gender || '—').toUpperCase()) }}</strong>
                          </span>

                          <span v-if="t.category?.name" class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-slate-100">
                            <strong class="text-white/95 truncate max-w-[14rem]">{{ t.category.name }}</strong>
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  <p v-if="awayTeam" class="mt-2 text-[11px] text-slate-400">
                    Seleccionado: <span class="text-slate-100 font-semibold">{{ awayTeam.name }}</span>
                    <span class="text-slate-500">·</span>
                    Rama <span class="text-slate-100 font-semibold">{{ awayTeam.category?.code || '—' }}</span>
                    <span class="text-slate-500">·</span>
                    {{ niceGender(awayTeam.category?.gender || '—') }}
                  </p>

                  <button
                    type="button"
                    @click="swapTeams()"
                    :disabled="!homeTeamId || !awayTeamId"
                    class="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500 disabled:opacity-40"
                  >
                    ⇄ Intercambiar
                  </button>
                </div>
              </div>

              <!-- Fecha/Hora/Cancha + Actions -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div class="md:col-span-3">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-300 text-sm">📅</span>
                    <input
                      v-model="form.date"
                      type="date"
                      class="date-time w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 pl-9 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Hora</label>
                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-300 text-sm">🕒</span>
                    <input
                      v-model="form.time"
                      type="time"
                      class="date-time w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 pl-9 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="md:col-span-4">
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Cancha / Sede (opcional)</label>
                  <input
                    v-model.trim="form.field"
                    placeholder="Ej. Miguel Alemán"
                    class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="md:col-span-3 flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    @click="saveGame()"
                    :disabled="saving"
                    class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ saving ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Crear partido') }}
                  </button>

                  <button
                    type="button"
                    @click="clearForm()"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-2.5 text-xs font-semibold text-slate-100 hover:border-slate-500"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div v-if="formError" class="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {{ formError }}
              </div>
              <div v-if="formOk" class="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                {{ formOk }}
              </div>
            </div>
          </section>

          <!-- GAMES LIST -->
          <section class="rounded-2xl border border-slate-700 bg-slate-900/60 shadow-lg backdrop-blur overflow-hidden">
            <div class="h-1.5 bg-gradient-to-r from-amber-300 to-cyan-400"></div>

            <div class="p-4 sm:p-5">
              <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 class="text-base font-semibold text-white">Partidos</h2>
                  <p class="mt-1 text-xs text-slate-400">Lista ligera (ver más). Finaliza y agrega stats por jugador.</p>
                </div>

                <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div class="sm:w-44">
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Estatus</label>
                    <select
                      v-model="gameStatusPick"
                      class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ALL">Todos</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="FINAL">FINAL</option>
                    </select>
                  </div>

                  <div class="flex-1 md:w-72">
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Buscar equipo</label>
                    <div class="relative">
                      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">🔍</span>
                      <input
                        v-model.trim="gameQuery"
                        placeholder="Ej. Gators…"
                        class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <div v-if="gamesPending" class="text-sm text-slate-300">Cargando partidos…</div>
                <div v-else-if="gamesError" class="text-sm text-rose-300">Error cargando partidos.</div>

                <div v-else>
                  <div v-if="visibleGames.length === 0" class="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-4 text-sm text-slate-300">
                    <p class="font-semibold text-slate-100">Sin resultados</p>
                    <p class="mt-1 text-slate-400">No hay partidos con esos filtros.</p>
                  </div>

                  <div v-else class="space-y-2">
                    <div
                      v-for="g in visibleGames"
                      :key="g.id"
                      class="rounded-xl border border-slate-700 bg-slate-950/40 p-3"
                    >
                      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-white truncate">
                            {{ g.homeName }} <span class="text-slate-500">vs</span> {{ g.awayName }}
                          </p>
                          <p class="mt-0.5 text-[11px] text-slate-400 truncate">
                            <span class="text-slate-200 font-semibold">{{ g.dateLabel }}</span>
                            · {{ g.timeLabel }}
                            <span class="text-slate-600">·</span>
                            {{ g.categoryLabel || '—' }}
                            <span class="text-slate-600">·</span>
                            Cancha: <span class="text-slate-200">{{ g.field || '—' }}</span>
                            <span class="text-slate-600">·</span>
                            ID: <span class="text-slate-200 font-semibold">{{ g.id }}</span>
                          </p>
                        </div>

                        <div class="flex items-center gap-2">
                          <span
                            class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                            :class="upper(g.status) === 'FINAL'
                              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                              : 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'"
                          >
                            <span class="h-1.5 w-1.5 rounded-full" :class="upper(g.status) === 'FINAL' ? 'bg-emerald-400' : 'bg-cyan-400'"></span>
                            {{ upper(g.status) }}
                          </span>

                          <span
                            v-if="upper(g.status) === 'FINAL' && g.homeScore != null && g.awayScore != null"
                            class="text-[11px] font-extrabold text-emerald-200"
                          >
                            {{ g.homeScore }} - {{ g.awayScore }}
                          </span>

                          <button
                            type="button"
                            class="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:border-slate-500"
                            @click="loadForEdit(g)"
                          >
                            Editar
                          </button>

                          <button
                            v-if="upper(g.status) !== 'FINAL'"
                            type="button"
                            class="rounded-xl bg-white px-3 py-2 text-[11px] font-extrabold text-slate-900 hover:bg-amber-100"
                            @click="openFinish(g)"
                          >
                            Finalizar
                          </button>
                        </div>
                      </div>

                      <!-- FINALIZAR PANEL -->
                      <div v-if="finishPanelId === g.id" class="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                        <div class="flex items-center justify-between gap-2">
                          <p class="text-xs font-semibold text-emerald-100">Finalizar (guardar como FINAL)</p>
                          <button
                            type="button"
                            class="text-[11px] font-semibold text-emerald-100/80 hover:text-emerald-100 underline underline-offset-4"
                            @click="closeFinish()"
                          >
                            Cerrar
                          </button>
                        </div>

                        <div class="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-[11px] font-semibold text-emerald-100/80 mb-1">Puntos Local</label>
                            <input
                              v-model.number="finishHomeScore"
                              type="number"
                              min="0"
                              class="w-full rounded-xl border border-emerald-500/30 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label class="block text-[11px] font-semibold text-emerald-100/80 mb-1">Puntos Visitante</label>
                            <input
                              v-model.number="finishAwayScore"
                              type="number"
                              min="0"
                              class="w-full rounded-xl border border-emerald-500/30 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <!-- ✅ STATS INDIVIDUALES (solo seleccionar jugador del roster real) -->
                        <div class="mt-4 rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                          <div class="flex items-center justify-between gap-2">
                            <div>
                              <p class="text-xs font-semibold text-slate-100">Estadísticas individuales</p>
                              <p class="text-[11px] text-slate-400">
                                INT · TD · PASS_TD · SACK. Jugador: solo seleccionar del roster (se carga con /teams/&lt;id&gt;/detail)
                              </p>
                            </div>
                            <button
                              type="button"
                              class="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:border-slate-500"
                              @click="statsOpen = !statsOpen"
                            >
                              {{ statsOpen ? 'Ocultar' : 'Agregar' }}
                            </button>
                          </div>

                          <div v-if="statsOpen" class="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div class="md:col-span-3">
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Tipo</label>
                              <select
                                v-model="statDraft.kind"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="TD">TD (Anotación)</option>
                                <option value="PASS_TD">PASS_TD (Pase de TD)</option>
                                <option value="INT">INT (Intercepción)</option>
                                <option value="SACK">SACK</option>
                              </select>
                            </div>

                            <div class="md:col-span-2">
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Equipo</label>
                              <select
                                v-model="statDraft.side"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="HOME">Local</option>
                                <option value="AWAY">Visitante</option>
                              </select>
                            </div>

                            <div class="md:col-span-5">
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Jugador (solo seleccionar)</label>
                              <select
                                v-model.number="statDraft.playerId"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option :value="0">— Selecciona jugador —</option>

                                <option
                                  v-for="p in currentRosterOptions"
                                  :key="p.id"
                                  :value="p.id"
                                >
                                  {{ playerOptionLabel(p) }}
                                </option>
                              </select>

                              <p v-if="rosterHint" class="mt-1 text-[11px] text-amber-200">{{ rosterHint }}</p>
                            </div>

                            <div class="md:col-span-1">
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Qty</label>
                              <input
                                v-model.number="statDraft.qty"
                                type="number"
                                min="1"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div class="md:col-span-1">
                              <button
                                type="button"
                                class="w-full rounded-xl bg-white px-3 py-2.5 text-[11px] font-extrabold text-slate-900 hover:bg-amber-100 disabled:opacity-40"
                                :disabled="!canAddStat"
                                @click="addStatForGame(g)"
                              >
                                + Add
                              </button>
                            </div>
                          </div>

                          <!-- list -->
                          <div v-if="finishStats.length" class="mt-3 space-y-2">
                            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                              <span class="text-slate-400">Resumen:</span>
                              <span class="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                                TD: <b class="text-slate-100">{{ countKind('TD') }}</b>
                              </span>
                              <span class="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                                PASS_TD: <b class="text-slate-100">{{ countKind('PASS_TD') }}</b>
                              </span>
                              <span class="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                                INT: <b class="text-slate-100">{{ countKind('INT') }}</b>
                              </span>
                              <span class="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                                SACK: <b class="text-slate-100">{{ countKind('SACK') }}</b>
                              </span>
                            </div>

                            <div
                              v-for="s in finishStats"
                              :key="s.id"
                              class="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 flex items-center justify-between gap-3"
                            >
                              <div class="min-w-0">
                                <p class="text-xs font-semibold text-slate-100 truncate">
                                  <span class="text-slate-400">[{{ s.kind }}]</span>
                                  {{ s.playerName }}
                                  <span v-if="s.jerseyNumber != null" class="text-slate-400">#{{ s.jerseyNumber }}</span>
                                  <span class="text-slate-400">·</span>
                                  <span class="text-slate-300">{{ s.side === 'HOME' ? 'Local' : 'Visitante' }}</span>
                                  <span class="text-slate-400">·</span>
                                  <span class="text-amber-200 font-extrabold">x{{ s.qty }}</span>
                                </p>
                              </div>

                              <button
                                type="button"
                                class="rounded-lg border border-slate-700 bg-slate-950/40 px-2 py-1 text-[11px] font-semibold text-slate-100 hover:border-slate-500"
                                @click="removeStat(g.id, s.id)"
                              >
                                Quitar
                              </button>
                            </div>

                            <div class="flex items-center justify-end">
                              <button
                                type="button"
                                class="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:border-slate-500"
                                @click="clearStats(g.id)"
                              >
                                Limpiar stats
                              </button>
                            </div>

                            <p v-if="statsWarn" class="text-xs text-amber-200">{{ statsWarn }}</p>
                            <p v-if="statsOk" class="text-xs text-emerald-200">{{ statsOk }}</p>
                          </div>
                        </div>

                        <div class="mt-3 flex flex-wrap gap-2 justify-end">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            :disabled="finishing"
                            @click="finishGame(g)"
                          >
                            {{ finishing ? 'Guardando…' : 'Guardar FINAL' }}
                          </button>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-2.5 text-xs font-semibold text-slate-100 hover:border-slate-500"
                            @click="loadForEditAndFinal(g)"
                          >
                            Abrir en formulario
                          </button>
                        </div>

                        <p v-if="finishError" class="mt-2 text-xs text-rose-200">{{ finishError }}</p>
                        <p v-if="finishOk" class="mt-2 text-xs text-emerald-200">{{ finishOk }}</p>
                      </div>
                    </div>

                    <!-- show more -->
                    <div class="pt-2 flex items-center justify-between">
                      <p class="text-[11px] text-slate-400">
                        Mostrando <span class="text-slate-100 font-semibold">{{ visibleGames.length }}</span> de
                        <span class="text-slate-100 font-semibold">{{ filteredGamesVm.length }}</span>
                      </p>

                      <button
                        v-if="filteredGamesVm.length > gamesVisible"
                        type="button"
                        @click="gamesVisible += 20"
                        class="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="teamsPending" class="mt-3 text-xs text-slate-400">Cargando equipos…</p>
              <p v-else-if="teamsError" class="mt-3 text-xs text-rose-300">Error cargando equipos.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, shallowRef } from 'vue'
import { useNuxtApp, useRuntimeConfig, useState, useAsyncData } from '#imports'
import { useAuthz } from '~/composables/useAuthz'

/** =========================
 *  AUTH (Keycloak)
 *  ========================= */
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)
const authz: any = useAuthz()

const isAdmin = computed<boolean>(() => {
  const v = authz?.isAdmin
  if (typeof v === 'boolean') return v
  if (v && typeof v === 'object' && 'value' in v) return !!v.value

  const kc = (nuxtApp as any).$kc
  const roles: string[] =
    kc?.tokenParsed?.realm_access?.roles ||
    kc?.tokenParsed?.resource_access?.['nuxt-app']?.roles ||
    []
  return roles.map((r) => String(r).toLowerCase()).includes('admin')
})

/** =========================
 *  API
 *  ========================= */
const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'
const DEFAULT_SEASON_ID = Number((config.public as any)?.seasonId ?? 1)

const API_GAMES = `${API_BASE}/games`
const API_GAMES_FINAL = `${API_BASE}/gamesFinal`
const API_TEAMS = `${API_BASE}/teams`
const API_TEAMS_LIST = `${API_BASE}/teams/list`
const API_CATEGORIES = `${API_BASE}/categories`

// (opcional) si ya existe en tu backend
const PLAYER_STATS_URL = (gameId: number) => `${API_GAMES}/${gameId}/player-stats`

/** =========================
 *  TYPES
 *  ========================= */
type Category = { id: number; name: string; code: string; gender: string }
type Team = {
  teamId: number
  name: string
  shortName?: string
  logoUrl?: string | null
  categoryId?: number | null
  category?: Category | null
}
type TeamLite = { teamId: number; name?: string | null }

type GameApi = {
  game_id: number
  season_id: number
  status: string
  match_date_utc: string
  category_id?: number
  category?: { id?: number; name?: string; code?: string; gender?: string } | null
  homeTeam?: TeamLite | null
  awayTeam?: TeamLite | null
  homeScore?: number | null
  awayScore?: number | null
  field?: string | null
  location?: string | null
}

type GameVM = {
  id: number
  status: string
  match_date_utc: string
  dateLabel: string
  timeLabel: string
  homeName: string
  awayName: string
  categoryLabel: string
  seasonId?: number
  categoryId?: number
  homeTeamId?: number
  awayTeamId?: number
  field?: string
  homeScore?: number | null
  awayScore?: number | null
}

// players (como tu vista team detail)
type Player = {
  id: number
  fullName: string
  jerseyNumber: number | null
  photoUrl?: string | null
}
type TeamDetailResponse = {
  team: any
  players: Player[]
  lastGames: any[]
  gallery: any[]
}

// stats
type StatKind = 'TD' | 'PASS_TD' | 'INT' | 'SACK'
type StatSide = 'HOME' | 'AWAY'
type StatEntry = {
  id: string
  kind: StatKind
  side: StatSide
  playerId: number
  playerName: string
  jerseyNumber: number | null
  qty: number
}

/** =========================
 *  HELPERS
 *  ========================= */
function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  return []
}
function upper(v: any) {
  return String(v ?? '').trim().toUpperCase()
}
function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}
function toLocalDateTime(iso: string) {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` }
}
function localToUtcIso(date: string, time: string) {
  const d = new Date(`${date}T${time}:00`)
  return d.toISOString()
}
function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}
function categoryLabel(c: Category) {
  return `${c.name} · ${niceGender(c.gender)} · ${String(c.code).toUpperCase()}`
}

/** =========================
 *  FETCH CATEGORIES
 *  ========================= */
const { data: catData } = useAsyncData('admin-categories-lite-v3', async () => {
  try {
    const raw = await $fetch(API_CATEGORIES)
    return unwrapList<any>(raw)
  } catch {
    return []
  }
})

const categories = computed<Category[]>(() => {
  const list = unwrapList<any>(catData.value)
  return list
    .map((x) => ({
      id: Number(x.id ?? x.categoryId ?? x.category_id),
      name: String(x.name ?? x.categoryName ?? `Categoría ${x.id ?? x.categoryId ?? x.category_id}`),
      code: String(x.code ?? ''),
      gender: String(x.gender ?? ''),
    }))
    .filter((c) => Number.isFinite(c.id))
})

const categoryById = computed(() => {
  const m = new Map<number, Category>()
  for (const c of categories.value) m.set(c.id, c)
  return m
})

/** =========================
 *  FETCH TEAMS (try /teams/list, fallback /teams)
 *  ========================= */
async function fetchTeamsSmart() {
  try {
    const raw = await $fetch(API_TEAMS_LIST)
    return unwrapList<any>(raw)
  } catch {
    const raw = await $fetch(API_TEAMS)
    return unwrapList<any>(raw)
  }
}

const { data: teamsRaw, pending: teamsPending, error: teamsErr, refresh: refreshTeams } = useAsyncData(
  'admin-teams-lite-v3',
  fetchTeamsSmart
)
const teamsError = computed(() => !!teamsErr.value)

const teams = computed<Team[]>(() => {
  const list = unwrapList<any>(teamsRaw.value)
  const catMap = categoryById.value

  return list.map((x) => {
    const teamId = Number(x.teamId ?? x.team_id ?? x.id)
    const name = String(x.name ?? x.teamName ?? 'Equipo')
    const shortName = String(x.shortName ?? x.short_name ?? '')
    const logoUrl = x.logoUrl ?? x.logo_url ?? x.photoUrl ?? x.photo_url ?? null

    // 🔥 importante: category como en tu ejemplo: team.category.code / team.category.gender
    const cid = Number(x.categoryId ?? x.category_id ?? x.category?.id ?? 0) || null
    const catFromApi = x.category
      ? {
          id: Number(x.category.id ?? cid ?? 0),
          name: String(x.category.name ?? ''),
          code: String(x.category.code ?? ''),
          gender: String(x.category.gender ?? ''),
        }
      : null

    const catFromMap = cid ? catMap.get(cid) : null

    // también cubre projections: code / gender sueltos
    const codeLoose = String(x.code ?? x.categoryCode ?? '').trim()
    const genderLoose = String(x.gender ?? x.categoryGender ?? '').trim()

    const mergedCat: Category | null = (() => {
      const base = (catFromApi?.id ? catFromApi : null) || (catFromMap?.id ? catFromMap : null)
      if (!base && !cid && !codeLoose && !genderLoose) return null

      return {
        id: Number(base?.id ?? cid ?? 0) || 0,
        name: String(base?.name ?? x.categoryName ?? ''),
        code: String(codeLoose || base?.code || ''),
        gender: String(genderLoose || base?.gender || ''),
      }
    })()

    return {
      teamId,
      name,
      shortName,
      logoUrl,
      categoryId: cid,
      category: mergedCat,
    }
  })
})

/** =========================
 *  FETCH GAMES (merge /games + /gamesFinal)
 *  ========================= */
const { data: gamesRaw, pending: gamesPending, error: gamesErr, refresh: refreshGames } = useAsyncData(
  'admin-games-lite-v3',
  async () => {
    const [scheduled, finals] = await Promise.all([
      $fetch<GameApi[]>(API_GAMES).catch(() => []),
      $fetch<GameApi[]>(API_GAMES_FINAL).catch(() => []),
    ])

    const map = new Map<number, GameApi>()
    for (const g of [...unwrapList<any>(scheduled), ...unwrapList<any>(finals)]) {
      const id = Number(g.game_id ?? g.gameId ?? g.id)
      if (!id) continue
      map.set(id, g as any)
    }
    return Array.from(map.values())
  }
)
const gamesError = computed(() => !!gamesErr.value)

// ⚡️ store ya transformado para evitar recomputes pesados
const gamesVm = shallowRef<GameVM[]>([])

watch(
  [gamesRaw, categoryById],
  () => {
    const list = unwrapList<any>(gamesRaw.value)
    const catMap = categoryById.value

    gamesVm.value = list.map((g: any) => {
      const id = Number(g.game_id ?? g.gameId ?? g.id)
      const iso = String(g.match_date_utc ?? g.matchDateUtc ?? g.match_date ?? '')
      const status = String(g.status ?? 'SCHEDULED')

      const d = iso ? new Date(iso) : new Date()
      const dateLabel = d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
      const timeLabel = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

      const homeName = String(g.home_team ?? g.homeTeam?.name ?? 'Local')
      const awayName = String(g.away_team ?? g.awayTeam?.name ?? 'Visitante')

      const categoryId = Number(g.category_id ?? g.categoryId ?? g.category?.id ?? 0) || undefined
      const cat = categoryId ? catMap.get(categoryId) : null

      const catName = g.category?.name ?? cat?.name
      const catGender = g.category?.gender ?? cat?.gender
      const catCode = g.category?.code ?? cat?.code

      const categoryLabel = [catName, catGender ? niceGender(catGender) : null, catCode ? String(catCode).toUpperCase() : null]
        .filter(Boolean)
        .join(' · ')

      return {
        id,
        status,
        match_date_utc: iso,
        dateLabel,
        timeLabel,
        homeName,
        awayName,
        categoryLabel,
        seasonId: Number(g.season_id ?? g.seasonId ?? 0) || undefined,
        categoryId,
        homeTeamId: Number(g.home_team_id ?? g.homeTeamId ?? g.homeTeam?.teamId ?? 0) || undefined,
        awayTeamId: Number(g.away_team_id ?? g.awayTeamId ?? g.awayTeam?.teamId ?? 0) || undefined,
        field: String(g.field ?? g.location ?? ''),
        homeScore: g.homeScore ?? g.home_score ?? null,
        awayScore: g.awayScore ?? g.away_score ?? null,
      }
    })
  },
  { immediate: true }
)

/** =========================
 *  FORM
 *  ========================= */
const editingId = ref<number | null>(null)
const homeTeamId = ref<number | null>(null)
const awayTeamId = ref<number | null>(null)

const homeTeam = computed(() => teams.value.find((t) => t.teamId === homeTeamId.value) || null)
const awayTeam = computed(() => teams.value.find((t) => t.teamId === awayTeamId.value) || null)

const form = ref({
  seasonId: DEFAULT_SEASON_ID,
  categoryId: 0,
  date: '',
  time: '',
  field: '',
})

const catHint = computed(() => {
  const c = categories.value.find((x) => x.id === Number(form.value.categoryId))
  return c ? categoryLabel(c) : ''
})

const saving = ref(false)
const formError = ref('')
const formOk = ref('')

function clearForm() {
  editingId.value = null
  homeTeamId.value = null
  awayTeamId.value = null
  homeInput.value = ''
  awayInput.value = ''
  homeOpen.value = false
  awayOpen.value = false
  form.value = { seasonId: DEFAULT_SEASON_ID, categoryId: 0, date: '', time: '', field: '' }
  formError.value = ''
  formOk.value = ''
}

function loadForEdit(g: GameVM) {
  editingId.value = g.id
  homeTeamId.value = g.homeTeamId ?? null
  awayTeamId.value = g.awayTeamId ?? null

  if (g.match_date_utc) {
    const dt = toLocalDateTime(g.match_date_utc)
    form.value.date = dt.date
    form.value.time = dt.time
  } else {
    form.value.date = ''
    form.value.time = ''
  }

  form.value.seasonId = g.seasonId ?? DEFAULT_SEASON_ID
  form.value.categoryId = g.categoryId ?? form.value.categoryId
  form.value.field = String(g.field ?? '')

  homeInput.value = homeTeam.value?.name || ''
  awayInput.value = awayTeam.value?.name || ''
  formOk.value = ''
  formError.value = ''
}

function validateForm() {
  if (!form.value.categoryId || form.value.categoryId < 1) return 'Selecciona categoría del partido.'
  if (!homeTeamId.value) return 'Selecciona equipo Local.'
  if (!awayTeamId.value) return 'Selecciona equipo Visitante.'
  if (homeTeamId.value === awayTeamId.value) return 'Local y Visitante no pueden ser el mismo equipo.'
  if (!form.value.date) return 'Falta la fecha.'
  if (!form.value.time) return 'Falta la hora.'
  return ''
}

async function saveGame() {
  formError.value = ''
  formOk.value = ''
  const msg = validateForm()
  if (msg) return (formError.value = msg)

  saving.value = true
  try {
    const isoUtc = localToUtcIso(form.value.date, form.value.time)
    const seasonId = Number(form.value.seasonId || DEFAULT_SEASON_ID)

    const payload: any = {
      season_id: seasonId,
      seasonId,
      category_id: form.value.categoryId,
      categoryId: form.value.categoryId,
      match_date_utc: isoUtc,
      matchDateUtc: isoUtc,
      status: 'SCHEDULED',
      field: form.value.field,
      location: form.value.field,
      home_team_id: homeTeamId.value,
      homeTeamId: homeTeamId.value,
      away_team_id: awayTeamId.value,
      awayTeamId: awayTeamId.value,
    }

    if (editingId.value) {
      await $fetch(`${API_GAMES}/${editingId.value}`, { method: 'PUT', body: payload })
      formOk.value = `Partido actualizado (ID ${editingId.value}).`
    } else {
      await $fetch(API_GAMES, { method: 'POST', body: payload })
      formOk.value = 'Partido creado.'
    }

    await refreshGames()
    const ok = formOk.value
    clearForm()
    formOk.value = ok
    setTimeout(() => (formOk.value = ''), 1500)
  } catch (e: any) {
    formError.value = e?.data?.message || e?.message || 'No se pudo guardar. Revisa el backend.'
  } finally {
    saving.value = false
  }
}

function swapTeams() {
  const a = homeTeamId.value
  homeTeamId.value = awayTeamId.value
  awayTeamId.value = a
  const tmp = homeInput.value
  homeInput.value = awayInput.value
  awayInput.value = tmp
}

/** =========================
 *  TEAM PICKER (ultra ligero)
 *  ========================= */
const filterTeamsByCategory = ref(true)

const homeInput = ref('')
const awayInput = ref('')
const homeOpen = ref(false)
const awayOpen = ref(false)

// debounce super corto
const homeQ = ref('')
const awayQ = ref('')
let homeT: any = null
let awayT: any = null
watch(homeInput, (v) => {
  clearTimeout(homeT)
  homeT = setTimeout(() => (homeQ.value = String(v || '').trim().toLowerCase()), 120)
})
watch(awayInput, (v) => {
  clearTimeout(awayT)
  awayT = setTimeout(() => (awayQ.value = String(v || '').trim().toLowerCase()), 120)
})

// index por categoria para no filtrar arrays grandes en cada keypress
const teamsByCategoryId = computed(() => {
  const m = new Map<number, Team[]>()
  for (const t of teams.value) {
    const cid = Number(t.categoryId || 0)
    if (!cid) continue
    if (!m.has(cid)) m.set(cid, [])
    m.get(cid)!.push(t)
  }
  return m
})

const poolTeams = computed(() => {
  if (!filterTeamsByCategory.value) return teams.value
  const catId = Number(form.value.categoryId || 0)
  if (!catId) return teams.value
  return teamsByCategoryId.value.get(catId) || []
})

function suggest(q: string, excludeId: number | null) {
  const query = q.trim()
  const arr = poolTeams.value
  const out: Team[] = []
  const LIMIT = 5

  if (!query) {
    for (const t of arr) {
      if (t.teamId === excludeId) continue
      out.push(t)
      if (out.length >= LIMIT) break
    }
    return out
  }

  for (const t of arr) {
    if (t.teamId === excludeId) continue
    const name = (t.name || '').toLowerCase()
    const short = (t.shortName || '').toLowerCase()
    if (name.includes(query) || short.includes(query)) out.push(t)
    if (out.length >= LIMIT) break
  }
  return out
}

const homeSuggestions = computed(() => suggest(homeQ.value, awayTeamId.value))
const awaySuggestions = computed(() => suggest(awayQ.value, homeTeamId.value))

function pickHome(t: Team) {
  homeTeamId.value = t.teamId
  homeInput.value = t.name
  homeOpen.value = false
}
function pickAway(t: Team) {
  awayTeamId.value = t.teamId
  awayInput.value = t.name
  awayOpen.value = false
}
function clearHome() {
  homeTeamId.value = null
  homeInput.value = ''
}
function clearAway() {
  awayTeamId.value = null
  awayInput.value = ''
}
function closeHomeLater() {
  setTimeout(() => (homeOpen.value = false), 100)
}
function closeAwayLater() {
  setTimeout(() => (awayOpen.value = false), 100)
}

/** =========================
 *  GAMES FILTERS + LIMIT
 *  ========================= */
const gameStatusPick = ref<'ALL' | 'SCHEDULED' | 'FINAL'>('SCHEDULED')
const gameQuery = ref('')
const gamesVisible = ref(20)

const filteredGamesVm = computed(() => {
  const q = gameQuery.value.toLowerCase().trim()
  const s = gameStatusPick.value

  const sorted = [...gamesVm.value].sort((a, b) => {
    const da = a.match_date_utc ? new Date(a.match_date_utc).getTime() : 0
    const db = b.match_date_utc ? new Date(b.match_date_utc).getTime() : 0
    return da - db
  })

  return sorted.filter((g) => {
    const st = upper(g.status)
    if (s !== 'ALL' && st !== s) return false
    if (!q) return true
    const a = String(g.homeName || '').toLowerCase()
    const b = String(g.awayName || '').toLowerCase()
    return a.includes(q) || b.includes(q)
  })
})

const visibleGames = computed(() => filteredGamesVm.value.slice(0, gamesVisible.value))
watch([gameStatusPick, gameQuery], () => (gamesVisible.value = 20))

/** =========================
 *  FINALIZAR + STATS (players from /teams/{id}/detail)
 *  ========================= */
const finishPanelId = ref<number | null>(null)
const finishHomeScore = ref<number>(0)
const finishAwayScore = ref<number>(0)
const finishing = ref(false)
const finishError = ref('')
const finishOk = ref('')

const statsByGame = ref<Record<number, StatEntry[]>>({})
const statsOpen = ref(true)
const statsWarn = ref('')
const statsOk = ref('')

const rosterCache = ref<Record<number, Player[]>>({})
const rosterLoading = ref<Set<number>>(new Set())
const rosterHint = ref('')

async function ensureRoster(teamId: number) {
  if (!teamId) return
  if (rosterCache.value[teamId]?.length) return
  if (rosterLoading.value.has(teamId)) return

  rosterLoading.value.add(teamId)
  rosterHint.value = ''
  try {
    const raw = await $fetch<TeamDetailResponse>(`${API_BASE}/teams/${teamId}/detail`)
    const players = Array.isArray(raw?.players) ? raw.players : []
    rosterCache.value = { ...rosterCache.value, [teamId]: players }
  } catch (e) {
    rosterHint.value = `No se pudo cargar roster de team #${teamId} (endpoint /teams/${teamId}/detail).`
    rosterCache.value = { ...rosterCache.value, [teamId]: [] }
  } finally {
    rosterLoading.value.delete(teamId)
  }
}

const statDraft = ref<{ kind: StatKind; side: StatSide; playerId: number; qty: number }>({
  kind: 'TD',
  side: 'HOME',
  playerId: 0,
  qty: 1,
})

const finishStats = computed<StatEntry[]>(() => {
  const gid = finishPanelId.value
  if (!gid) return []
  return statsByGame.value[gid] || []
})

function countKind(kind: StatKind) {
  let total = 0
  for (const s of finishStats.value) if (s.kind === kind) total += Number(s.qty || 0)
  return total
}

const currentGame = computed(() => {
  const gid = finishPanelId.value
  if (!gid) return null
  return gamesVm.value.find((x) => x.id === gid) || null
})

const homeRoster = computed(() => {
  const g = currentGame.value
  const id = g?.homeTeamId || 0
  return rosterCache.value[id] || []
})
const awayRoster = computed(() => {
  const g = currentGame.value
  const id = g?.awayTeamId || 0
  return rosterCache.value[id] || []
})

const currentRosterOptions = computed(() => {
  return statDraft.value.side === 'HOME' ? homeRoster.value : awayRoster.value
})

function playerOptionLabel(p: Player) {
  const jersey = p.jerseyNumber != null ? `#${p.jerseyNumber} · ` : ''
  return `${jersey}${p.fullName}`
}

const canAddStat = computed(() => {
  const pid = Number(statDraft.value.playerId || 0)
  const qty = Number(statDraft.value.qty || 0)
  return pid > 0 && qty >= 1
})

function addStatForGame(g: GameVM) {
  statsWarn.value = ''
  statsOk.value = ''

  const gid = g.id
  const pid = Number(statDraft.value.playerId || 0)
  const qty = Math.max(1, Number(statDraft.value.qty || 1))

  const roster = statDraft.value.side === 'HOME' ? (rosterCache.value[g.homeTeamId || 0] || []) : (rosterCache.value[g.awayTeamId || 0] || [])
  const p = roster.find((x) => Number(x.id) === pid)

  if (!p) {
    statsWarn.value = 'Selecciona un jugador válido del roster.'
    return
  }

  const entry: StatEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: statDraft.value.kind,
    side: statDraft.value.side,
    playerId: pid,
    playerName: p.fullName,
    jerseyNumber: p.jerseyNumber ?? null,
    qty,
  }

  const prev = statsByGame.value[gid] || []
  statsByGame.value = { ...statsByGame.value, [gid]: [...prev, entry] }

  // reset rápido
  statDraft.value.playerId = 0
  statDraft.value.qty = 1
}

function removeStat(gameId: number, statId: string) {
  const prev = statsByGame.value[gameId] || []
  statsByGame.value = { ...statsByGame.value, [gameId]: prev.filter((x) => x.id !== statId) }
}

function clearStats(gameId: number) {
  statsByGame.value = { ...statsByGame.value, [gameId]: [] }
  statsWarn.value = ''
  statsOk.value = ''
}

async function openFinish(g: GameVM) {
  finishPanelId.value = g.id
  finishHomeScore.value = Number(g.homeScore ?? 0)
  finishAwayScore.value = Number(g.awayScore ?? 0)
  finishError.value = ''
  finishOk.value = ''
  statsWarn.value = ''
  statsOk.value = ''
  statsOpen.value = true
  rosterHint.value = ''

  // ✅ carga roster real como tu ejemplo /teams/{id}/detail
  const h = g.homeTeamId || 0
  const a = g.awayTeamId || 0
  if (h) await ensureRoster(h)
  if (a) await ensureRoster(a)

  // si no hay roster, avisar
  if (h && (rosterCache.value[h]?.length ?? 0) === 0) rosterHint.value = `Roster local vacío o no cargó (team #${h}).`
  if (a && (rosterCache.value[a]?.length ?? 0) === 0) rosterHint.value = `Roster visitante vacío o no cargó (team #${a}).`

  statDraft.value.side = 'HOME'
  statDraft.value.playerId = 0
  statDraft.value.qty = 1
}

function closeFinish() {
  finishPanelId.value = null
  finishError.value = ''
  finishOk.value = ''
  statsWarn.value = ''
  statsOk.value = ''
  rosterHint.value = ''
}

function loadForEditAndFinal(g: GameVM) {
  loadForEdit(g)
  finishPanelId.value = null
}

async function tryPostPlayerStats(gameId: number) {
  const entries = statsByGame.value[gameId] || []
  if (!entries.length) return

  try {
    const payload = {
      gameId,
      entries: entries.map((e) => ({
        kind: e.kind,
        side: e.side,
        playerId: e.playerId,
        qty: e.qty,
      })),
    }
    await $fetch(PLAYER_STATS_URL(gameId), { method: 'POST', body: payload })
    statsOk.value = 'Stats individuales guardadas.'
    statsWarn.value = ''
  } catch {
    statsWarn.value = 'No se pudieron guardar stats (endpoint no existe o backend aún no soporta). El FINAL sí se guardó.'
  }
}

async function finishGame(g: GameVM) {
  finishError.value = ''
  finishOk.value = ''
  statsWarn.value = ''
  statsOk.value = ''

  const homeId = g.homeTeamId
  const awayId = g.awayTeamId
  const categoryId = g.categoryId
  if (!homeId || !awayId || !categoryId) {
    finishError.value = 'Este juego no trae IDs (home/away/category). Usa “Abrir en formulario”.'
    return
  }

  finishing.value = true
  try {
    const seasonId = Number(g.seasonId ?? DEFAULT_SEASON_ID)

    const payload: any = {
      season_id: seasonId,
      seasonId,
      category_id: categoryId,
      categoryId,
      match_date_utc: g.match_date_utc,
      matchDateUtc: g.match_date_utc,
      status: 'FINAL',
      home_team_id: homeId,
      homeTeamId: homeId,
      away_team_id: awayId,
      awayTeamId: awayId,
      homeScore: Number(finishHomeScore.value ?? 0),
      awayScore: Number(finishAwayScore.value ?? 0),
      home_score: Number(finishHomeScore.value ?? 0),
      away_score: Number(finishAwayScore.value ?? 0),
      field: g.field || '',
      location: g.field || '',
    }

    await $fetch(`${API_GAMES}/${g.id}`, { method: 'PUT', body: payload })

    finishOk.value = `Partido ${g.id} marcado como FINAL.`
    await refreshGames()

    // opcional stats (no rompe FINAL)
    await tryPostPlayerStats(g.id)

    setTimeout(() => (finishOk.value = ''), 2000)
  } catch (e: any) {
    finishError.value = e?.data?.message || e?.message || 'No se pudo finalizar. Revisa el backend.'
  } finally {
    finishing.value = false
  }
}

/** =========================
 *  REFRESH
 *  ========================= */
async function hardRefresh() {
  formOk.value = ''
  formError.value = ''
  finishOk.value = ''
  finishError.value = ''
  statsWarn.value = ''
  statsOk.value = ''
  rosterHint.value = ''
  await Promise.all([refreshTeams(), refreshGames()])
}
</script>

<style scoped>
/* iconos visibles date/time en tema oscuro */
.date-time {
  color-scheme: dark;
}
.date-time::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.95;
}
.date-time::-webkit-datetime-edit {
  color: rgba(226, 232, 240, 0.95);
}
</style>
