<template>
  <main class="bg-[#F3F4FF] text-slate-900 min-h-[100dvh] w-full overflow-x-hidden">
    <!-- ========== HERO + CARRUSEL ========== -->
    <section class="pt-24 md:pt-28 lg:pt-32">
      <!-- ✅ FIX: sin container-pad (evita padding doble) + padding mobile más pequeño -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full min-w-0">
        <!-- Carrusel con IMG real -->
        <div class="w-full max-w-full rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.40)] bg-slate-900">
          <!-- ✅ SWIPE AREA -->
          <div
            class="relative w-full max-w-full hero-swipe aspect-[16/9] sm:aspect-[16/6] lg:aspect-[16/5]"
            @pointerdown="onHeroPointerDown"
            @pointermove="onHeroPointerMove"
            @pointerup="onHeroPointerUp"
            @pointercancel="onHeroPointerCancel"
            @pointerleave="onHeroPointerLeave"
          >
            <Transition name="fade" mode="out-in">
              <img
                :key="currentSlideSrc"
                :src="currentSlideSrc"
                alt="tochero5liga"
                class="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </Transition>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0"></div>

            <!-- Tap zones (mobile) -->
            <button type="button" class="tapzone left" aria-label="Anterior" @click="prevSlide" />
            <button type="button" class="tapzone right" aria-label="Siguiente" @click="nextSlide" />
          </div>
        </div>

        <!-- Controles del carrusel -->
        <div class="mt-3 flex items-center justify-center gap-3 sm:gap-4 max-w-full">
          <button class="carousel-arrow bg-white shadow hidden sm:inline-flex" @click="prevSlide" aria-label="Anterior">
            <span class="text-xs text-slate-700">&larr;</span>
          </button>

          <!-- ✅ FIX: wrap para evitar overflow raro -->
          <div class="flex flex-wrap items-center justify-center gap-2 max-w-full">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              class="carousel-dot border border-slate-300 shrink-0"
              :class="idx === currentSlide ? 'carousel-dot--active bg-blue-600 border-blue-600' : 'bg-white'"
              @click="goToSlide(idx)"
              :aria-label="`Ir a slide ${idx + 1}`"
            />
          </div>

          <button class="carousel-arrow bg-white shadow hidden sm:inline-flex" @click="nextSlide" aria-label="Siguiente">
            <span class="text-xs text-slate-700">&rarr;</span>
          </button>
        </div>

        <!-- Overlay card -->
        <!-- ✅ FIX: menos negativo en móvil + overflow hidden -->
        <div class="relative -mt-16 sm:-mt-24 w-full max-w-full">
          <div class="w-full max-w-full overflow-hidden p-5 sm:p-6 md:p-8 bg-blue-50 text-slate-900 border border-blue-100 rounded-[26px] shadow-[0_18px_40px_rgba(37,99,235,0.25)]">
            <!-- ✅ FIX: min-w-0 para que nada empuje -->
            <div class="grid md:grid-cols-5 gap-6 items-start min-w-0">
              <div class="md:col-span-3 min-w-0">
                <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 break-words">
                  {{ homeHeroTitle }}
                </h1>
                <p class="mt-2 text-slate-700 break-words">{{ homeHeroSubtitle }}</p>

                <div class="mt-4 flex flex-wrap gap-3">
                  <NuxtLink
                    to="/registro"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                  >
                    Registrar equipo
                  </NuxtLink>
                  <NuxtLink
                    to="/mi-equipo"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50"
                  >
                    Agregar jugador
                  </NuxtLink>
                </div>

                <p v-if="homeCfgError" class="mt-3 text-[11px] text-rose-700 break-words">
                  {{ homeCfgError }}
                </p>
              </div>

              <!-- PRÓXIMOS JUEGOS -->
              <div class="md:col-span-2 min-w-0 w-full">
                <div class="rounded-2xl border border-blue-100 bg-white p-4 md:p-5 shadow-[0_10px_22px_rgba(15,23,42,0.08)] overflow-hidden w-full max-w-full">
                  <!-- Header -->
                  <div class="flex items-center justify-between gap-3 min-w-0">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 min-w-0 flex-wrap">
                        <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 shrink-0">
                          {{ activeUpcoming?.isPast ? 'Último partido' : 'Próximo juego' }}
                        </p>

                        <span
                          v-if="upcomingTotal > 0"
                          class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-extrabold text-slate-700 shrink-0"
                        >
                          {{ upcomingIndex + 1 }} / {{ upcomingTotal }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        @click="prevUpcoming()"
                        :disabled="upcomingTotal <= 1"
                        title="Anterior"
                        aria-label="Anterior"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        @click="nextUpcoming()"
                        :disabled="upcomingTotal <= 1"
                        title="Siguiente"
                        aria-label="Siguiente"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="gamesPendingUI"
                    class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
                  >
                    Cargando próximos juegos…
                  </div>

                  <div
                    v-else-if="!activeUpcoming"
                    class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
                  >
                    Aún no hay juegos programados para <b>{{ selectedSeasonLabel }}</b>.
                    <div class="mt-2 text-[11px] text-slate-500">
                      (Tip: si sí existen en el admin, revisa que el juego tenga fecha y estatus programado.)
                    </div>
                  </div>

                  <div
                    v-else
                    class="mt-4 upcoming-swipe w-full max-w-full"
                    @pointerdown="onUpcomingPointerDown"
                    @pointermove="onUpcomingPointerMove"
                    @pointerup="onUpcomingPointerUp"
                    @pointercancel="onUpcomingPointerCancel"
                    @pointerleave="onUpcomingPointerLeave"
                  >
                    <Transition name="lift" mode="out-in">
                      <article
                        :key="activeUpcoming?.id"
                        class="relative w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
                      >
                        <div class="px-4 py-3 border-b border-slate-200">
                          <div class="flex items-start justify-between gap-3 min-w-0">
                            <div class="min-w-0 flex-1">
                              <p class="text-[11px] font-semibold text-slate-500 break-words clamp-2">
                                {{ activeUpcoming.categoryName }}
                                <template v-if="activeUpcoming.code"> · {{ activeUpcoming.code }}</template>
                                <template v-if="activeUpcoming.genderLabel"> · {{ activeUpcoming.genderLabel }}</template>
                                <template v-if="activeUpcoming.round"> · Jornada {{ activeUpcoming.round }}</template>
                              </p>

                              <p class="mt-1 text-sm font-extrabold text-slate-900 break-words">
                                {{ activeUpcoming.dateLabel }}
                              </p>
                            </div>

                            <div class="shrink-0 text-right">
                              <p class="text-xl md:text-[22px] font-extrabold text-slate-900 tabular-nums leading-none whitespace-nowrap">
                                {{ activeUpcoming.timeLabel }}
                              </p>
                              <p
                                class="mt-1 text-[11px] font-semibold whitespace-nowrap"
                                :class="activeUpcoming.isPast ? 'text-amber-600' : 'text-slate-500'"
                              >
                                {{ activeUpcoming.isPast
                                  ? 'YA JUGADO'
                                  : (String(activeUpcoming.status).toUpperCase() === 'LIVE' ? 'EN JUEGO' : 'PROGRAMADO') }}
                              </p>
                              <p class="mt-1 text-[11px] text-slate-500 whitespace-nowrap">
                                Cancha: <span class="font-semibold text-slate-700">{{ activeUpcoming.venue || '-' }}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="px-4 py-3 min-w-0">
                          <div class="space-y-3 min-w-0">
                            <div class="grid grid-cols-[44px_1fr] gap-3 items-start min-w-0">
                              <div class="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                                <img
                                  v-if="activeUpcoming.homeLogo"
                                  :src="activeUpcoming.homeLogo"
                                  :alt="activeUpcoming.homeName"
                                  class="h-full w-full object-contain p-1.5"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <span v-else class="text-[12px] font-extrabold text-slate-700">
                                  {{ initials(activeUpcoming.homeName) }}
                                </span>
                              </div>

                              <div class="min-w-0">
                                <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Local</p>
                                <p class="mt-0.5 text-[13px] font-extrabold text-slate-900 leading-snug break-words clamp-2">
                                  {{ activeUpcoming.homeName }}
                                </p>
                              </div>
                            </div>

                            <div class="h-px bg-slate-200"></div>

                            <div class="grid grid-cols-[44px_1fr] gap-3 items-start min-w-0">
                              <div class="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                                <img
                                  v-if="activeUpcoming.awayLogo"
                                  :src="activeUpcoming.awayLogo"
                                  :alt="activeUpcoming.awayName"
                                  class="h-full w-full object-contain p-1.5"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <span v-else class="text-[12px] font-extrabold text-slate-700">
                                  {{ initials(activeUpcoming.awayName) }}
                                </span>
                              </div>

                              <div class="min-w-0">
                                <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Visitante</p>
                                <p class="mt-0.5 text-[13px] font-extrabold text-slate-900 leading-snug break-words clamp-2">
                                  {{ activeUpcoming.awayName }}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div
                            v-if="activeUpcoming.isPast"
                            class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800"
                          >
                            Aún no hay partidos con fecha futura registrados. Este fue el último programado.
                          </div>

                          <div class="mt-3 flex items-center justify-between gap-2 min-w-0">
                            <p class="text-[11px] text-slate-500 min-w-0 truncate">
                              {{ activeUpcoming.seasonName || selectedSeasonLabel }} · ID {{ activeUpcoming.id }}
                            </p>

                            <NuxtLink
                              to="/partidos"
                              class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-[12px] font-extrabold bg-slate-900 text-white hover:bg-slate-800 shrink-0"
                              @pointerdown.stop
                              @pointerup.stop
                              @click.stop
                            >
                              Partidos →
                            </NuxtLink>
                          </div>

                          <!-- ✅ FIX: dots con wrap para que NUNCA desborden -->
                          <div v-if="upcomingTotal > 1" class="mt-3 flex max-w-full flex-wrap items-center justify-center gap-1.5">
                            <button
                              v-for="(_, i) in upcomingTotal"
                              :key="i"
                              type="button"
                              class="h-2 w-2 rounded-full border border-slate-300 shrink-0"
                              :class="i === upcomingIndex ? 'bg-slate-900 border-slate-900' : 'bg-white hover:bg-slate-50'"
                              @click="goToUpcoming(i)"
                              @pointerdown.stop
                              :title="`Ir al juego ${i + 1}`"
                            />
                          </div>
                        </div>
                      </article>
                    </Transition>
                  </div>
                </div>
              </div>
              <!-- /PRÓXIMOS JUEGOS -->
            </div>
          </div>
        </div>

        <!-- Texto introductorio -->
        <div class="mt-10 w-full max-w-full">
          <h2 class="font-display text-2xl font-extrabold mb-1 text-slate-900 break-words">{{ homeIntroTitle }}</h2>
          <p class="text-slate-600 break-words">{{ homeIntroSubtitle }}</p>
        </div>

        <!-- ========== TOP 5 POSICIONES ========== -->
        <div class="mt-8 w-full max-w-full rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] min-w-0">
            <div class="flex items-center gap-3 min-w-0">
              <h3 class="font-display font-extrabold text-white truncate">Top 5 · Posiciones</h3>
              <span class="inline-flex items-center rounded-full bg-white/15 px-2 py-1 text-[11px] font-extrabold text-white shrink-0" title="Temporada seleccionada">
                {{ selectedSeasonLabel }}
              </span>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 shrink-0"
              @click="refreshStandings()"
            >
              Refrescar
            </button>
          </div>

          <div class="px-5 py-4 bg-white border-b border-slate-200/70">
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end min-w-0">
              <div class="min-w-0">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Temporada (season)
                </label>
                <select
                  v-model.number="selectedSeasonId"
                  class="w-full max-w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="s in seasonOptions" :key="s.value" :value="s.value">
                    {{ s.label }}
                  </option>
                </select>
              </div>

              <div class="min-w-0">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Categoría (code)
                </label>
                <select
                  v-model="selectedCategoryCode"
                  class="w-full max-w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <div class="min-w-0">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Rama (gender)
                </label>
                <select
                  v-model="selectedGender"
                  class="w-full max-w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="VARONIL">Varonil</option>
                  <option value="FEMENIL">Femenil</option>
                  <option value="MIXTO">Mixto</option>
                </select>
              </div>

              <div class="flex gap-2 sm:justify-end flex-wrap">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters()"
                >
                  Limpiar
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

          <div class="bg-white w-full max-w-full">
            <div v-if="standingsPending" class="px-5 py-4 text-sm text-slate-500">
              Cargando posiciones...
            </div>

            <div v-else-if="standingsError" class="px-5 py-4 text-sm text-red-600 break-words">
              Error al cargar las posiciones: {{ standingsError }}
            </div>

            <template v-else>
              <ul v-if="topPositions.length" class="sm:hidden divide-y divide-slate-100">
                <li v-for="row in topPositions" :key="row.rank" class="p-4">
                  <div class="flex items-start justify-between gap-3 min-w-0">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700 shrink-0">
                          #{{ row.rank }}
                        </span>
                        <div class="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                          <img
                            v-if="row.logo"
                            :src="row.logo"
                            :alt="row.teamName"
                            class="h-full w-full object-contain p-1"
                            loading="lazy"
                          />
                          <span v-else class="text-[10px] font-extrabold text-blue-700">{{ initials(row.teamName) }}</span>
                        </div>
                        <p class="font-extrabold text-slate-900 truncate min-w-0">{{ row.teamName }}</p>
                      </div>

                      <div class="mt-2 grid grid-cols-4 gap-2">
                        <div class="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PJ</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.gamesPlayed }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PG</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.wins }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PP</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.losses }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PTS</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.points }}</p>
                        </div>
                      </div>

                      <div class="mt-2 grid grid-cols-3 gap-2">
                        <div class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PF</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.pointsFor }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PC</p>
                          <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ row.pointsAgainst }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                          <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">DIF</p>
                          <p class="text-sm font-extrabold tabular-nums" :class="row.diff > 0 ? 'text-emerald-700' : row.diff < 0 ? 'text-rose-700' : 'text-slate-800'">
                            {{ formatDiff(row.diff) }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="shrink-0 text-right">
                      <p class="text-[10px] uppercase tracking-wide font-extrabold text-slate-500">PCT</p>

                      <div class="mt-1 inline-flex items-center justify-end">
                        <span class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[12px] font-extrabold text-slate-900 tabular-nums shadow-sm">
                          {{ formatPct(row.pct) }}
                        </span>
                      </div>

                      <div class="mt-2 w-24 ml-auto">
                        <div class="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div class="h-full rounded-full bg-blue-600" :style="{ width: pctWidth(row.pct) }"></div>
                        </div>
                        <p class="mt-1 text-[10px] font-semibold text-slate-500 tabular-nums text-right">
                          {{ pctToLabel(row.pct) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="hidden sm:block overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-slate-500 border-b border-slate-200/80">
                      <th class="px-4 py-3">Rk</th>
                      <th class="px-4 py-3">Equipo</th>
                      <th class="px-4 py-3">PJ</th>
                      <th class="px-4 py-3">PG</th>
                      <th class="px-4 py-3">PP</th>
                      <th class="px-4 py-3">PF</th>
                      <th class="px-4 py-3">PC</th>
                      <th class="px-4 py-3">DIF</th>
                      <th class="px-4 py-3">PTS</th>
                      <th class="px-4 py-3">PCT</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="row in topPositions" :key="row.rank" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
                      <td class="px-4 py-3 font-extrabold text-slate-900 tabular-nums">#{{ row.rank }}</td>

                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                            <img
                              v-if="row.logo"
                              :src="row.logo"
                              :alt="row.teamName"
                              class="h-full w-full object-contain p-1"
                              loading="lazy"
                            />
                            <span v-else class="text-[11px] font-extrabold text-blue-700">{{ initials(row.teamName) }}</span>
                          </div>
                          <span class="font-semibold text-slate-900 truncate min-w-0">{{ row.teamName }}</span>
                        </div>
                      </td>

                      <td class="px-4 py-3 tabular-nums">{{ row.gamesPlayed }}</td>
                      <td class="px-4 py-3 tabular-nums">{{ row.wins }}</td>
                      <td class="px-4 py-3 tabular-nums">{{ row.losses }}</td>
                      <td class="px-4 py-3 tabular-nums">{{ row.pointsFor }}</td>
                      <td class="px-4 py-3 tabular-nums">{{ row.pointsAgainst }}</td>

                      <td class="px-4 py-3 tabular-nums font-semibold" :class="row.diff > 0 ? 'text-emerald-700' : row.diff < 0 ? 'text-rose-700' : 'text-slate-700'">
                        {{ formatDiff(row.diff) }}
                      </td>

                      <td class="px-4 py-3 font-extrabold tabular-nums">{{ row.points }}</td>

                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                          <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold text-slate-900 tabular-nums">
                            {{ formatPct(row.pct) }}
                          </span>

                          <div class="min-w-[92px]">
                            <div class="h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div class="h-full rounded-full bg-blue-600" :style="{ width: pctWidth(row.pct) }"></div>
                            </div>
                            <p class="mt-1 text-[10px] font-semibold text-slate-500 tabular-nums text-right">
                              {{ pctToLabel(row.pct) }}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="topPositions.length === 0">
                      <td colspan="10" class="px-4 py-4 text-sm text-slate-500">
                        Aún no hay posiciones registradas (o no hay datos para esos filtros).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="topPositions.length === 0" class="sm:hidden px-5 py-5 text-sm text-slate-500">
                Aún no hay posiciones registradas (o no hay datos para esos filtros).
              </div>
            </template>
          </div>
        </div>

        <!-- ========== TOP 5 JUGADORES ========== -->
        <div class="mt-8 w-full max-w-full rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] min-w-0">
            <div class="flex items-center gap-3 min-w-0">
              <h3 class="font-display font-extrabold text-white truncate">Top 5 · Jugadores</h3>
              <span class="inline-flex items-center rounded-full bg-white/15 px-2 py-1 text-[11px] font-extrabold text-white shrink-0" title="Temporada seleccionada">
                {{ selectedSeasonLabel }}
              </span>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 shrink-0"
              @click="refreshTopPlayers()"
            >
              Refrescar
            </button>
          </div>

          <div class="bg-white w-full max-w-full">
            <div v-if="topPlayersPendingUI" class="px-5 py-4 text-sm text-slate-500">
              Cargando jugadores...
            </div>

            <div v-else-if="topPlayersError" class="px-5 py-4 text-sm text-red-600 break-words">
              Error al cargar jugadores.
            </div>

            <template v-else>
              <ul v-if="topPlayers.length" class="divide-y divide-slate-100">
                <li
                  v-for="p in topPlayers"
                  :key="p.key"
                  class="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3 min-w-0"
                >
                  <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700 shrink-0">
                    #{{ p.rank }}
                  </span>

                  <div class="h-9 w-9 rounded-full border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                    <img
                      v-if="p.photoUrl"
                      :src="p.photoUrl"
                      :alt="p.fullName"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span v-else class="text-[10px] font-extrabold text-blue-700">{{ initials(p.fullName) }}</span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-slate-900 truncate text-sm">{{ p.fullName }}</p>
                    <p class="text-[11px] text-slate-500 truncate">
                      {{ p.teamName || 'Sin equipo' }}<span v-if="p.number !== null && p.number !== undefined"> · #{{ p.number }}</span>
                    </p>
                  </div>

                  <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span class="inline-flex flex-col items-center rounded-lg bg-fuchsia-50 border border-fuchsia-100 px-2 py-1 min-w-[34px]">
                      <span class="text-[9px] font-bold uppercase text-fuchsia-500">INT</span>
                      <span class="text-xs font-extrabold text-fuchsia-700 tabular-nums">{{ p.stats.int }}</span>
                    </span>
                    <span class="inline-flex flex-col items-center rounded-lg bg-violet-50 border border-violet-100 px-2 py-1 min-w-[34px]">
                      <span class="text-[9px] font-bold uppercase text-violet-500">TD</span>
                      <span class="text-xs font-extrabold text-violet-700 tabular-nums">{{ p.stats.td }}</span>
                    </span>
                    <span class="inline-flex flex-col items-center rounded-lg bg-sky-50 border border-sky-100 px-2 py-1 min-w-[34px]">
                      <span class="text-[9px] font-bold uppercase text-sky-500">PA</span>
                      <span class="text-xs font-extrabold text-sky-700 tabular-nums">{{ p.stats.pa }}</span>
                    </span>
                    <span class="inline-flex flex-col items-center rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-1 min-w-[34px]">
                      <span class="text-[9px] font-bold uppercase text-emerald-500">SACK</span>
                      <span class="text-xs font-extrabold text-emerald-700 tabular-nums">{{ p.stats.sack }}</span>
                    </span>
                    <span class="inline-flex items-center rounded-full bg-slate-900 text-white px-2.5 py-1 text-[11px] font-extrabold">
                      IMP {{ p.impact }}
                    </span>
                  </div>
                </li>
              </ul>

              <div v-else class="px-5 py-5 text-sm text-slate-500">
                Aún no hay estadísticas de jugadores para esta temporada.
              </div>
            </template>
          </div>
        </div>

        <!-- ========== REGLAMENTOS (3) ========== -->
        <section id="reglamentos" class="mt-12">
          <div class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden w-full max-w-full">
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] min-w-0">
              <div class="min-w-0">
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">reglamentos oficiales</p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1 break-words">Reglas y normativa de la liga</h2>
              </div>

              <div class="hidden sm:flex items-center gap-2 shrink-0">
                <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">3 documentos</span>
                <a href="#patrocinadores" class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                  Ver patrocinadores →
                </a>
              </div>
            </div>

            <div class="px-4 sm:px-6 py-8">
              <div class="grid gap-4 md:grid-cols-3">
                <article
                  v-for="doc in reglamentos"
                  :key="doc.id"
                  class="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden
                         shadow-[0_14px_35px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                         transition-shadow"
                >
                  <div class="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

                  <div class="p-5 min-w-0">
                    <div class="flex items-start justify-between gap-3 min-w-0">
                      <div class="min-w-0">
                        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                          {{ doc.category }}
                        </p>
                        <h3 class="mt-1 font-display text-lg font-extrabold text-slate-900 leading-tight break-words">
                          {{ doc.title }}
                        </h3>
                        <p class="mt-2 text-sm text-slate-600 break-words">{{ doc.subtitle }}</p>
                      </div>

                      <div class="shrink-0 flex flex-col items-end gap-2">
                        <span
                          class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                          :class="doc.type === 'PDF'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-sky-200 bg-sky-50 text-sky-700'"
                        >
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-200">
                            <svg v-if="doc.type === 'PDF'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/>
                              <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" stroke-width="1.7"/>
                              <path d="M8 14h8M8 17h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                            </svg>
                            <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/>
                              <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" stroke-width="1.7"/>
                              <path d="M8 15h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                            </svg>
                          </span>
                          {{ doc.type }}
                        </span>

                        <span class="text-[11px] text-slate-500">{{ doc.meta }}</span>
                      </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2">
                      <span
                        v-for="tag in doc.tags"
                        :key="tag"
                        class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <details class="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                      <summary class="cursor-pointer select-none text-xs font-semibold text-slate-700">
                        Resumen rápido
                        <span class="text-[11px] text-slate-500 font-medium">· (toca para ver)</span>
                      </summary>
                      <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li v-for="b in doc.bullets" :key="b" class="flex gap-2">
                          <span class="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span class="break-words">{{ b }}</span>
                        </li>
                      </ul>
                    </details>

                    <div class="mt-4 flex items-center gap-2">
                      <a
                        :href="doc.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                               bg-blue-600 hover:bg-blue-500 text-white
                               shadow-[0_10px_25px_rgba(37,99,235,0.35)]
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Ver reglamento <span class="ml-1 text-xs">↗</span>
                      </a>

                      <a
                        :href="doc.href"
                        :download="doc.downloadName"
                        class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold
                               bg-white border border-slate-200 text-slate-800 hover:bg-slate-50
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title="Descargar"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                          <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </div>

              <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-sm text-slate-700">
                  Tip: si estás en celular, usa <span class="font-semibold">“Ver reglamento”</span> para abrirlo en una pestaña nueva.
                  También puedes descargarlo con el ícono.
                </p>
              </div>
            </div>
          </div>

          <p class="mt-3 text-[11px] text-slate-500 text-right">
            Si tienes dudas de reglas, pregunta al staff o revisa el documento correspondiente.
          </p>
        </section>

        <!-- ========== PATROCINADORES ========== -->
        <section id="patrocinadores" class="mt-12">
          <div class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden w-full max-w-full">
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] min-w-0">
              <div class="min-w-0">
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">aliados de la liga</p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1 break-words">Patrocinadores oficiales</h2>
              </div>

              <div class="hidden sm:flex items-center gap-2 shrink-0">
                <button type="button" class="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15" @click="prevSponsor">←</button>
                <button type="button" class="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15" @click="nextSponsor">→</button>
              </div>
            </div>

            <div class="px-4 sm:px-6 py-8 bg-white">
              <!-- Destacado -->
              <div class="rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_14px_35px_rgba(15,23,42,0.08)] overflow-hidden w-full max-w-full">
                <div class="p-5 sm:p-6 md:p-7">
                  <p class="text-[11px] uppercase tracking-[0.22em] font-semibold text-slate-500">
                    patrocinador destacado
                  </p>

                  <div class="mt-2 grid md:grid-cols-12 gap-6 items-center min-w-0">
                    <div class="md:col-span-7 min-w-0">
                      <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight break-words">
                        {{ activeSponsor.name }}
                      </h3>

                      <p class="mt-2 text-slate-700 max-w-xl break-words">
                        {{ activeSponsor.description }}
                      </p>

                      <div class="mt-4 flex flex-wrap gap-2">
                        <span v-if="activeSponsor.tagline" class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
                          {{ activeSponsor.tagline }}
                        </span>

                        <span v-if="activeSponsor.label" class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                          {{ activeSponsor.label }}
                        </span>
                      </div>

                      <div class="mt-5 flex flex-wrap items-center gap-2">
                        <a
                          v-if="activeSponsor.url"
                          :href="activeSponsor.url"
                          target="_blank"
                          rel="noopener"
                          class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                        >
                          Visitar sitio ↗
                        </a>

                        <span v-else class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Sin enlace
                        </span>

                        <span class="text-[11px] text-slate-500">
                          Toca una tarjeta abajo para cambiar el destacado.
                        </span>
                      </div>
                    </div>

                    <!-- ✅ FIX: overflow-hidden para que el blur NO genere scroll horizontal en mobile -->
                    <div class="md:col-span-5 flex md:justify-end justify-center">
                      <div class="relative overflow-hidden">
                        <div class="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-blue-500/10 blur-2xl absolute -inset-6"></div>

                        <div class="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-white border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden grid place-items-center relative">
                          <img v-if="activeSponsor.logo" :src="activeSponsor.logo" :alt="activeSponsor.name" class="h-[70%] w-[70%] object-contain" loading="lazy" />
                          <span v-else class="text-xs font-semibold text-slate-500 px-4 text-center">Logo pendiente</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-5 sm:px-6 md:px-7 py-3 border-t border-slate-200 bg-white">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[11px] text-slate-500">Aliados oficiales · Tochero5liga</p>
                    <p class="text-[11px] text-slate-500">Sponsor {{ activeSponsorIndex + 1 }} de {{ sponsors.length || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <div class="flex items-end justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[11px] uppercase tracking-[0.22em] font-semibold text-slate-500">patrocinadores actuales</p>
                    <p class="mt-1 text-sm text-slate-600">Desliza (mobile) o haz clic para destacar.</p>
                  </div>

                  <a href="https://www.instagram.com/tochero5liga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener"
                    class="hidden sm:inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 shrink-0">
                    ¿Quieres patrocinar? ↗
                  </a>
                </div>

                <!-- ✅ FIX: quitamos -mx-1 en móvil (eso suele provocar overflow en algunos devices) -->
                <div class="mt-4 flex gap-3 overflow-x-auto pb-2 px-1 max-w-full">
                  <button
                    v-for="sp in sponsors"
                    :key="sp.id"
                    type="button"
                    class="min-w-[220px] sm:min-w-[260px] rounded-2xl border bg-white p-4 text-left shadow-[0_10px_25px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)] transition-shadow"
                    :class="sp.id === activeSponsor.id ? 'border-blue-300 ring-2 ring-blue-200/60' : 'border-slate-200'"
                    @click="setActiveSponsorById(sp.id)"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center shrink-0">
                        <img v-if="sp.logo" :src="sp.logo" :alt="sp.name" class="h-[70%] w-[70%] object-contain" loading="lazy" />
                        <span v-else class="text-[11px] font-extrabold text-slate-600">{{ sp.name.slice(0, 2).toUpperCase() }}</span>
                      </div>

                      <div class="min-w-0">
                        <p class="font-extrabold text-slate-900 truncate">{{ sp.name }}</p>
                        <p class="text-xs text-slate-600 truncate">{{ sp.tagline }}</p>
                      </div>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span v-if="sp.label" class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {{ sp.label }}
                      </span>

                      <span class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        Ver perfil →
                      </span>
                    </div>
                  </button>
                </div>

                <p class="mt-3 text-[11px] text-slate-500 text-right">
                  ¿Quieres patrocinar? Escríbenos por Instagram @tochero5liga
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- FOOTER / UBICACIÓN -->
      <div class="mt-14 bg-[#E0E7FF]">
        <!-- ✅ FIX: padding mobile más pequeño -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full min-w-0">
          <div class="grid md:grid-cols-5 gap-6 items-start min-w-0">
            <div class="md:col-span-2 space-y-2 min-w-0">
              <h2 class="font-display text-2xl font-extrabold text-slate-900">Ubicación</h2>
              <p class="opacity-95 text-slate-800 break-words">{{ homeLocationAddress }}</p>
              <p class="text-sm opacity-90 text-slate-700">Abre el mapa para ver la ruta exacta.</p>

              <a
                class="inline-flex items-center gap-2 mt-3 rounded-xl px-3 py-2 text-sm bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                :href="mapsOpenUrl"
                target="_blank"
                rel="noopener"
              >
                Abrir en Google Maps
              </a>
            </div>

            <div class="md:col-span-3 min-w-0">
              <div class="aspect-video rounded-[26px] overflow-hidden border border-white/70 shadow-lg bg-black/10 w-full max-w-full">
                <iframe
                  class="w-full h-full"
                  :src="mapsEmbedSrc"
                  style="border: 0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <hr class="mt-8 mb-4 border-slate-300/70" />

          <div class="flex items-center justify-between text-sm text-slate-600 gap-3 min-w-0">
            <span class="min-w-0 break-words">{{ homeLocationCopyright }}</span>

            <span class="inline-flex items-center gap-2 opacity-90 hover:opacity-100 shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
              </svg>
              <span class="whitespace-nowrap">{{ homeLocationInstagram }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- <ChatWidget /> -->
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRuntimeConfig, useAsyncData } from '#imports'
import { normalizeApiBase } from '../../composables/useApiBase'
import { useCurrentSeason } from '../../composables/useCurrentSeason'

useHead({
  htmlAttrs: {
    class: 'page-home',
  },
  bodyAttrs: {
    class: 'page-home',
  },
})

/* ===================== API_BASE ===================== */
const config = useRuntimeConfig()
const API_BASE = normalizeApiBase(config.public.apiBase)
const HOME_CFG_ENDPOINT = `${API_BASE}/site-configs/home`
const LEAGUE_ID = 1

function withLeague(query = {}) {
  return {
    ...query,
    leagueId: LEAGUE_ID,
  }
}

async function leagueGet(path, query = {}) {
  return await $fetch(`${API_BASE}${path}`, {
    query: withLeague(query),
  })
}

/* ===================== HOME CONFIG (desde backend) ===================== */
function uid(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}
function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

const HOME_DEFAULTS = {
  schemaVersion: 1,
  hero: {
    title: 'Temporada 2026',
    subtitle: 'Resultados, posiciones y registros en un solo lugar.',
    images: [
      { id: 'carrusel-1', src: '/img/carrusel1.jpg' },
      { id: 'carrusel-2', src: '/img/carrusel2.jpg' },
      { id: 'carrusel-3', src: '/img/carrusel3.jpg' }
    ]
  },
  intro: {
    title: 'TOCHERO5LIGA',
    subtitle: 'ENTÉRATE DE TODO LO QUE ESTÁ PASANDO EN EL TORNEO.'
  },
  sponsors: [
    {
      id: 'dicass',
      name: 'DICASS',
      logo: '/img/sponsors/dicass-logo.png',
      url: 'https://dicass.com.mx/',
      tagline: 'Innovación para el juego y el bienestar.',
      description: 'Dicass acompaña a jugadores y familias con activaciones, alimentos y experiencias dentro del deportivo.',
      label: 'Patrocinador principal'
    }
  ],
  location: {
    address: 'FES Acatlán · Entrada Principal (peatonal)',
    mapsUrl: 'https://maps.app.goo.gl/zKNYRashoqHAMJwP9',
    instagram: '@tochero5liga',
    copyright: '© 2026 tochero5liga'
  }
}

function normalizeHomeData(data) {
  const merged = clone(HOME_DEFAULTS)

  if (data && typeof data === 'object') {
    if (data.hero && typeof data.hero === 'object') {
      merged.hero.title = String(data.hero.title ?? merged.hero.title)
      merged.hero.subtitle = String(data.hero.subtitle ?? merged.hero.subtitle)

      if (Array.isArray(data.hero.images)) {
        merged.hero.images = data.hero.images
          .filter((x) => x && typeof x === 'object')
          .map((x) => ({
            id: String(x.id ?? uid('carrusel')),
            src: String(x.src ?? '')
          }))
          .filter((x) => x.src)
      }
    }

    if (data.intro && typeof data.intro === 'object') {
      merged.intro.title = String(data.intro.title ?? merged.intro.title)
      merged.intro.subtitle = String(data.intro.subtitle ?? merged.intro.subtitle)
    }

    if (Array.isArray(data.sponsors)) {
      merged.sponsors = data.sponsors
        .filter((x) => x && typeof x === 'object')
        .map((x) => ({
          id: String(x.id ?? uid('sp')),
          name: String(x.name ?? ''),
          logo: String(x.logo ?? ''),
          url: String(x.url ?? ''),
          tagline: String(x.tagline ?? ''),
          description: String(x.description ?? ''),
          label: String(x.label ?? '')
        }))
    }

    if (data.location && typeof data.location === 'object') {
      merged.location.address = String(data.location.address ?? merged.location.address)
      merged.location.mapsUrl = String(data.location.mapsUrl ?? merged.location.mapsUrl)
      merged.location.instagram = String(data.location.instagram ?? merged.location.instagram)
      merged.location.copyright = String(data.location.copyright ?? merged.location.copyright)
    }
  }

  if (!Array.isArray(merged.hero.images) || merged.hero.images.length === 0) {
    merged.hero.images = clone(HOME_DEFAULTS.hero.images)
  }
  if (!Array.isArray(merged.sponsors)) merged.sponsors = []
  return merged
}

const homeCfg = ref(clone(HOME_DEFAULTS))
const homeCfgError = ref('')

async function loadHomeConfig() {
  homeCfgError.value = ''
  try {
    const res = await $fetch(HOME_CFG_ENDPOINT).catch(() => null)
    const payload = (res && typeof res === 'object' && 'data' in res) ? res.data : res
    const merged = normalizeHomeData(payload)

    homeCfg.value = merged
    heroSlides.value = merged.hero.images.map((x) => ({ id: x.id, src: x.src }))
    if (heroSlides.value.length === 0) heroSlides.value = clone(HOME_DEFAULTS.hero.images)
    currentSlide.value = 0

    sponsors.value = Array.isArray(merged.sponsors) ? merged.sponsors : []
    if (!sponsors.value.length) sponsors.value = clone(HOME_DEFAULTS.sponsors)
    activeSponsorIndex.value = 0
  } catch (e) {
    homeCfg.value = clone(HOME_DEFAULTS)
    heroSlides.value = clone(HOME_DEFAULTS.hero.images)
    sponsors.value = clone(HOME_DEFAULTS.sponsors)
    homeCfgError.value = 'No se pudo cargar la configuración del home (usando defaults).'
  }
}

let onVisHandler = null

onMounted(() => {
  loadHomeConfig()

  onVisHandler = () => {
    if (document.visibilityState === 'visible') loadHomeConfig()
  }
  document.addEventListener('visibilitychange', onVisHandler)
})

const homeHeroTitle = computed(() => String(homeCfg.value?.hero?.title ?? HOME_DEFAULTS.hero.title))
const homeHeroSubtitle = computed(() => String(homeCfg.value?.hero?.subtitle ?? HOME_DEFAULTS.hero.subtitle))
const homeIntroTitle = computed(() => String(homeCfg.value?.intro?.title ?? HOME_DEFAULTS.intro.title))
const homeIntroSubtitle = computed(() => String(homeCfg.value?.intro?.subtitle ?? HOME_DEFAULTS.intro.subtitle))

const homeLocationAddress = computed(() => String(homeCfg.value?.location?.address ?? HOME_DEFAULTS.location.address))
const homeLocationInstagram = computed(() => String(homeCfg.value?.location?.instagram ?? HOME_DEFAULTS.location.instagram))
const homeLocationCopyright = computed(() => String(homeCfg.value?.location?.copyright ?? HOME_DEFAULTS.location.copyright))

/* ===================== MAPA ===================== */
const mapsShortUrl = 'https://maps.app.goo.gl/zKNYRashoqHAMJwP9'
const mapsLat = 19.4820973
const mapsLng = -99.2446694
const mapsEmbedSrc = computed(() => `https://www.google.com/maps?q=${mapsLat},${mapsLng}&z=17&output=embed`)
const mapsOpenUrl = computed(() => String(homeCfg.value?.location?.mapsUrl || mapsShortUrl))

/* ===================== HELPERS ===================== */
function toNum(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0
}
function upper(v) {
  return String(v ?? '').trim().toUpperCase()
}
function initials(text) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}
const formatDiff = (n) => {
  const x = Number(n) || 0
  return x > 0 ? `+${x}` : `${x}`
}
const formatPct = (pct) => {
  const x = Number(pct)
  if (!Number.isFinite(x) || x <= 0) return '0.000'
  return x.toFixed(3)
}
const clamp01 = (n) => Math.min(1, Math.max(0, Number(n) || 0))
const pctToLabel = (pct) => `${(clamp01(pct) * 100).toFixed(1)}%`
const pctWidth = (pct) => `${Math.round(clamp01(pct) * 100)}%`

/* ===================== SEASONS DINÁMICAS =====================
   La temporada "actual" viene de /seasons/current (vía useCurrentSeason),
   la misma fuente única de verdad que ya usan admin/partidos.vue y
   jueves/admin/jugadores.vue. Después de un rollover de temporada, ese
   endpoint cambia solo, así que esta página se mueve a la temporada nueva
   sin tocar código — ya no se asume "la de mayor id" ni se hardcodea nada
   salvo el fallback final si /seasons/current no responde. */
const DEFAULT_SEASON_ID = 9
const selectedSeasonId = ref(DEFAULT_SEASON_ID)
let seasonAutoSelected = false

const { currentSeasonId } = useCurrentSeason(LEAGUE_ID, DEFAULT_SEASON_ID)

watch(
  currentSeasonId,
  (id) => {
    if (!id) return
    seasonAutoSelected = true
    selectedSeasonId.value = id
  },
  { immediate: true }
)

const { data: seasonsRaw } = useAsyncData(
  'seasons-home-lite-league-1',
  async () => {
    const try1 = await leagueGet('/seasons/list').catch(() => null)
    if (Array.isArray(try1)) return try1
    const try2 = await leagueGet('/seasons').catch(() => [])
    return Array.isArray(try2) ? try2 : []
  },
  { server: false, default: () => [] }
)

const seasonOptions = computed(() => {
  const raw = seasonsRaw.value
  if (!Array.isArray(raw) || raw.length === 0) {
    return [
      { label: `Temporada ${DEFAULT_SEASON_ID} (Actual)`, value: DEFAULT_SEASON_ID },
      { label: 'Temporada 6', value: 6 },
      { label: 'Temporada 2', value: 2 },
      { label: 'Temporada 1', value: 1 }
    ]
  }

  const tmp = []
  for (const s of raw) {
    const id = Number(s?.season_id ?? s?.seasonId ?? s?.id ?? 0) || 0
    if (!id) continue
    const baseLabel = String(s?.name ?? s?.label ?? s?.season_name ?? `Temporada ${id}`).trim()
    tmp.push({ value: id, label: baseLabel || `Temporada ${id}` })
  }

  tmp.sort((a, b) => b.value - a.value)
  const seen = new Set()
  const out = []
  for (const o of tmp) {
    if (seen.has(o.value)) continue
    seen.add(o.value)
    // "Actual" = la temporada que reporta /seasons/current; si aún no
    // resolvió, se asume temporalmente la de mayor id (primera del orden desc)
    const isActual = currentSeasonId.value
      ? o.value === currentSeasonId.value
      : out.length === 0
    out.push({ value: o.value, label: isActual ? `${o.label} (Actual)` : o.label })
  }
  return out
})

watch(
  seasonOptions,
  (opts) => {
    if (opts.length === 0) return

    // Primer arribo de datos reales: saltar a la temporada más reciente
    // por id como estimación inicial; el watch de currentSeasonId de
    // arriba la corrige en cuanto /seasons/current resuelva.
    if (!seasonAutoSelected) {
      seasonAutoSelected = true
      selectedSeasonId.value = opts[0]?.value ?? DEFAULT_SEASON_ID
      return
    }

    const has = opts.some((o) => o.value === selectedSeasonId.value)
    if (has) return
    selectedSeasonId.value = opts[0]?.value ?? DEFAULT_SEASON_ID
  },
  { immediate: true }
)

const seasonsMap = computed(() => {
  const m = {}
  for (const s of seasonOptions.value) m[s.value] = s.label
  return m
})

const selectedSeasonLabel = computed(() => seasonsMap.value[selectedSeasonId.value] || `Temporada ${selectedSeasonId.value}`)

/* ===================== TOP 5 POSICIONES ===================== */
const categoryOptions = [
  { label: 'Libre', value: 'Libre' },
  { label: '35+', value: '35+' },
  { label: 'U-8', value: 'U8' },
  { label: 'U-10', value: 'U10' },
  { label: 'U-12', value: 'U12' },
  { label: 'U-14', value: 'U14' },
  { label: 'U-16', value: 'U16' }
]

const selectedCategoryCode = ref('all')
const selectedGender = ref('all')

const normalizedCategoryCode = computed(() => {
  const v = String(selectedCategoryCode.value || 'all').trim()
  if (v === 'all') return 'all'
  if (v === '+35') return '35+'
  return v
})

const pointsParams = computed(() => {
  const p = { seasonId: String(selectedSeasonId.value) }
  if (normalizedCategoryCode.value !== 'all') p.categoryCode = normalizedCategoryCode.value
  if (selectedGender.value !== 'all') p.gender = selectedGender.value
  return p
})

const { data: teamsMetaRaw } = useAsyncData(
  'teams-home-top5-league-1',
  async () => {
    const res = await leagueGet('/teams/list').catch(() => null)
    return Array.isArray(res) ? res : []
  },
  { server: false, default: () => [] }
)

const teamLogoById = computed(() => {
  const map = new Map()
  for (const t of (teamsMetaRaw.value || [])) {
    const id = toNum(t?.teamId ?? t?.team_id ?? t?.id)
    if (id > 0) map.set(id, pickLogo(t))
  }
  return map
})

const standings = ref([])
const standingsPending = ref(false)
const standingsError = ref(null)

function safeGp(row) {
  const gp = toNum(row?.gp)
  if (gp > 0) return gp
  return toNum(row?.wins) + toNum(row?.losses) + toNum(row?.draws)
}
function rowSeasonId(r) {
  return toNum(r?.season_id ?? r?.seasonId)
}
function rowTeamKey(r) {
  const id = toNum(r?.team_id ?? r?.teamId)
  if (id > 0) return `id:${id}`
  const name = String(r?.team_name ?? r?.teamName ?? '').trim().toUpperCase()
  return name ? `name:${name}` : `name:—`
}
async function tryFetchPoints(params) {
  const res = await leagueGet('/points', params).catch(() => null)
  return Array.isArray(res) ? res : null
}
async function tryFetchPointsRaw(paramsQS) {
  const qs = paramsQS ? `${paramsQS}&leagueId=${encodeURIComponent(String(LEAGUE_ID))}` : `leagueId=${encodeURIComponent(String(LEAGUE_ID))}`
  const url = `${API_BASE}/points?${qs}`
  const res = await $fetch(url).catch(() => null)
  return Array.isArray(res) ? res : null
}
async function fetchStandingsWithFallback() {
  const baseParams = { ...pointsParams.value }
  let data = await tryFetchPoints(baseParams)

  const cat = baseParams.categoryCode
  if (data && data.length === 0 && cat === '35+') {
    const alt = { ...baseParams, categoryCode: '+35' }
    const altData = await tryFetchPoints(alt)
    if (altData && altData.length > 0) data = altData
  }
  if (data && data.length === 0 && cat === '+35') {
    const alt = { ...baseParams, categoryCode: '35+' }
    const altData = await tryFetchPoints(alt)
    if (altData && altData.length > 0) data = altData
  }

  if (data && data.length === 0 && (cat === '35+' || cat === '+35')) {
    const seasonId = encodeURIComponent(String(baseParams.seasonId || ''))
    const genderQS = baseParams.gender ? `&gender=${encodeURIComponent(baseParams.gender)}` : ''

    const tries = []
    if (cat === '35+') {
      tries.push(`seasonId=${seasonId}&categoryCode=35%2B${genderQS}`)
      tries.push(`seasonId=${seasonId}&categoryCode=35+${genderQS}`)
    } else {
      tries.push(`seasonId=${seasonId}&categoryCode=%2B35${genderQS}`)
      tries.push(`seasonId=${seasonId}&categoryCode=+35${genderQS}`)
    }

    for (const qs of tries) {
      const altData = await tryFetchPointsRaw(qs)
      if (altData && altData.length > 0) {
        data = altData
        break
      }
    }
  }

  const sidWanted = Number(baseParams.seasonId || 0) || 0
  const filtered = (data ?? []).filter((r) => {
    const sid = rowSeasonId(r)
    if (!sid) return true
    return sid === sidWanted
  })

  return filtered
}

const refreshStandings = async () => {
  standingsPending.value = true
  standingsError.value = null
  try {
    standings.value = await fetchStandingsWithFallback()
  } catch (e) {
    standings.value = []
    standingsError.value = e?.message ?? 'Error desconocido'
  } finally {
    standingsPending.value = false
  }
}

let standingsTO = null
const scheduleStandingsReload = () => {
  if (standingsTO) clearTimeout(standingsTO)
  standingsTO = setTimeout(() => refreshStandings(), 180)
}

watch([selectedSeasonId, normalizedCategoryCode, selectedGender], () => scheduleStandingsReload(), { immediate: true })

const clearFilters = () => {
  // Preferir /seasons/current; si aún no resolvió, usar la de mayor id
  // (seasonOptions viene ordenado desc)
  selectedSeasonId.value = currentSeasonId.value || seasonOptions.value[0]?.value || DEFAULT_SEASON_ID
  selectedCategoryCode.value = 'all'
  selectedGender.value = 'MIXTO'
  scheduleStandingsReload()
}

const topPositions = computed(() => {
  const raw = Array.isArray(standings.value) ? standings.value : []
  if (raw.length === 0) return []

  const ded = new Map()

  for (const row of raw) {
    const wins = toNum(row?.wins)
    const losses = toNum(row?.losses)
    const gp = safeGp(row)

    const pf = toNum(row?.points_for ?? row?.pointsFor)
    const pa = toNum(row?.points_against ?? row?.pointsAgainst)
    const pts = toNum(row?.table_points ?? row?.tablePoints)

    const diff = pf - pa
    const pct = gp > 0 ? wins / gp : 0

    const teamId = toNum(row?.team_id ?? row?.teamId)
    const logo = pickLogo(row?.team) ?? (teamId > 0 ? teamLogoById.value.get(teamId) || null : null)

    const item = {
      rank: 0,
      teamId,
      teamName: String(row?.team_name ?? row?.teamName ?? '—'),
      logo,
      gamesPlayed: gp,
      wins,
      losses,
      pointsFor: pf,
      pointsAgainst: pa,
      diff,
      points: pts,
      pct
    }

    const key = rowTeamKey(row)
    const prev = ded.get(key)
    if (!prev) ded.set(key, item)
    else {
      const prevScore = prev.points * 100000 + prev.diff * 100 + prev.pointsFor
      const nextScore = item.points * 100000 + item.diff * 100 + item.pointsFor
      if (nextScore > prevScore) ded.set(key, item)
    }
  }

  const mapped = Array.from(ded.values())
  mapped.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.diff !== a.diff) return b.diff - a.diff
    return b.pointsFor - a.pointsFor
  })

  return mapped.slice(0, 5).map((r, idx) => ({ ...r, rank: idx + 1 }))
})

/* ===================== TOP 5 JUGADORES =====================
   Misma lógica de agrupación/impacto que estadisticas.vue (suma
   TD+INT+PA+SACK por personKey), pero sin el filtrado defensivo por
   equipo: /stats/players?leagueId=1&seasonId=X ya viene filtrado por
   el backend, así que no hace falta cruzarlo contra teams/list salvo
   para mostrar el nombre del equipo. Se reutiliza teamsMetaRaw, que
   ya se pedía para los logos del Top 5 de posiciones. */
const teamNameById = computed(() => {
  const map = new Map()
  for (const t of (teamsMetaRaw.value || [])) {
    const id = toNum(t?.teamId ?? t?.team_id ?? t?.id)
    if (id > 0) map.set(id, String(t?.name || '').trim())
  }
  return map
})

const {
  data: topPlayersRaw,
  pending: topPlayersPending,
  error: topPlayersError,
  refresh: refreshTopPlayers,
} = useAsyncData(
  'top5-players-league-1',
  async () => {
    const res = await leagueGet('/stats/players', { seasonId: selectedSeasonId.value }).catch(() => null)
    return Array.isArray(res) ? res : []
  },
  { server: false, default: () => [], watch: [selectedSeasonId] }
)

const topPlayersPendingUI = computed(() => topPlayersPending.value || import.meta.server)

const topPlayers = computed(() => {
  const raw = Array.isArray(topPlayersRaw.value) ? topPlayersRaw.value : []
  if (raw.length === 0) return []

  const groups = new Map()

  for (const p of raw) {
    const key = String(p?.personKey || '').trim() || `id:${toNum(p?.playerId)}`
    const teamId = toNum(p?.teamId)

    const rowStats = {
      td: toNum(p?.td),
      int: toNum(p?.intercep),
      pa: toNum(p?.passTd),
      sack: toNum(p?.sacks),
    }
    const rowImpact = rowStats.td + rowStats.int + rowStats.pa + rowStats.sack

    let g = groups.get(key)
    if (!g) {
      g = {
        key,
        fullName: String(p?.fullName || 'Jugador').trim(),
        photoUrl: p?.photoUrl || null,
        number: p?.number ?? null,
        teamId,
        teamName: teamNameById.value.get(teamId) || '',
        stats: { td: 0, int: 0, pa: 0, sack: 0 },
        bestImpact: -1,
      }
      groups.set(key, g)
    }

    g.stats.td += rowStats.td
    g.stats.int += rowStats.int
    g.stats.pa += rowStats.pa
    g.stats.sack += rowStats.sack

    if (!g.photoUrl && p?.photoUrl) g.photoUrl = p.photoUrl

    // Equipo/número representativo = donde tuvo más impacto individual
    // (misma convención que la vista de jugadores de estadisticas.vue)
    if (rowImpact > g.bestImpact) {
      g.bestImpact = rowImpact
      g.teamId = teamId
      g.teamName = teamNameById.value.get(teamId) || g.teamName
      if (p?.number != null) g.number = p.number
    }
  }

  const list = Array.from(groups.values()).map((g) => ({
    ...g,
    impact: g.stats.td + g.stats.int + g.stats.pa + g.stats.sack,
  }))

  list.sort((a, b) => {
    if (b.impact !== a.impact) return b.impact - a.impact
    return a.fullName.localeCompare(b.fullName, 'es')
  })

  return list.slice(0, 5).map((p, idx) => ({ ...p, rank: idx + 1 }))
})

/* ===================== HERO CARRUSEL ===================== */
const heroSlides = ref(clone(HOME_DEFAULTS.hero.images))
const currentSlide = ref(0)
const currentSlideSrc = computed(() => heroSlides.value[currentSlide.value]?.src ?? '')

let intervalId = null
const HERO_AUTOPLAY_MS = 7000

const nextSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}
const prevSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}
const goToSlide = (index) => {
  if (index >= 0 && index < heroSlides.value.length) currentSlide.value = index
}
const stopHeroAuto = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
}
const startHeroAuto = () => {
  stopHeroAuto()
  if (heroSlides.value.length > 1) intervalId = setInterval(nextSlide, HERO_AUTOPLAY_MS)
}
onMounted(() => startHeroAuto())

/* ✅ SWIPE HERO */
let heroPointerId = null
let heroStartX = 0
let heroStartY = 0
let heroDx = 0
let heroDy = 0
let heroIsDown = false
let heroIsSwipe = false

const HERO_SWIPE_ACTIVATE_PX = 10
const HERO_SWIPE_TRIGGER_PX = 55

function resetHeroSwipe() {
  heroPointerId = null
  heroStartX = 0
  heroStartY = 0
  heroDx = 0
  heroDy = 0
  heroIsDown = false
  heroIsSwipe = false
}

const onHeroPointerDown = (e) => {
  if (heroSlides.value.length <= 1) return
  heroIsDown = true
  heroIsSwipe = false
  heroPointerId = e.pointerId
  heroStartX = e.clientX
  heroStartY = e.clientY
  heroDx = 0
  heroDy = 0
  stopHeroAuto()

  const el = e.currentTarget
  if (el?.setPointerCapture) {
    try { el.setPointerCapture(e.pointerId) } catch {}
  }
}
const onHeroPointerMove = (e) => {
  if (!heroIsDown || heroPointerId === null || e.pointerId !== heroPointerId) return
  heroDx = e.clientX - heroStartX
  heroDy = e.clientY - heroStartY

  if (!heroIsSwipe) {
    const ax = Math.abs(heroDx)
    const ay = Math.abs(heroDy)
    if (ax > HERO_SWIPE_ACTIVATE_PX && ax > ay * 1.2) heroIsSwipe = true
  }
}
const onHeroPointerUp = (e) => {
  if (!heroIsDown || heroPointerId === null || e.pointerId !== heroPointerId) return
  const dx = heroDx
  const dy = heroDy
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)

  if (heroIsSwipe && ax > HERO_SWIPE_TRIGGER_PX && ax > ay) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }

  resetHeroSwipe()
  startHeroAuto()
}
const onHeroPointerCancel = () => {
  if (!heroIsDown) return
  resetHeroSwipe()
  startHeroAuto()
}
const onHeroPointerLeave = () => {
  if (!heroIsDown) return
  resetHeroSwipe()
  startHeroAuto()
}

/* ===================== PRÓXIMOS JUEGOS ===================== */
function pickArrayFromResponse(res) {
  if (Array.isArray(res)) return res
  if (res && Array.isArray(res.content)) return res.content
  if (res && Array.isArray(res.items)) return res.items
  if (res && Array.isArray(res.data)) return res.data
  return []
}

async function fetchGamesAny(seasonId) {
  const sid = Number(seasonId || 0) || 0
  const tries = [
    { path: '/games/upcoming', query: { seasonId: sid } },
    { path: '/games', query: { seasonId: sid } },
    { path: '/games', query: {} }
  ]

  for (const item of tries) {
    const res = await leagueGet(item.path, item.query).catch(() => null)
    const arr = pickArrayFromResponse(res)
    if (Array.isArray(arr) && arr.length) return arr
  }
  return []
}

const { data: gamesRaw, pending: gamesPending, refresh: refreshGames } = useAsyncData(
  'games-home-upcoming-league-1',
  () => fetchGamesAny(selectedSeasonId.value),
  { server: false, default: () => [] }
)

// Mismo fix que en estadisticas.vue: este fetch es { server: false }, así que
// en SSR reporta pending=false aunque no haya datos, mientras el cliente sí
// arranca en pending=true al hidratar — eso producía un mismatch de
// hidratación en este widget. Forzamos "pendiente" también en el servidor.
const gamesPendingUI = computed(() => gamesPending.value || import.meta.server)

watch(selectedSeasonId, () => {
  upcomingIndex.value = 0
  refreshGames()
})

const nowMs = ref(0)
let nowTimer = null

const gameTimeFmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  hour: '2-digit',
  minute: '2-digit'
})
const gameDateFmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  weekday: 'short',
  day: '2-digit',
  month: 'short'
})

onMounted(() => {
  nowMs.value = Date.now()
  nowTimer = setInterval(() => (nowMs.value = Date.now()), 60_000)
})

function toUtcMs(matchUtc) {
  const s = String(matchUtc || '').trim()
  if (!s) return 0
  const hasTZ = s.endsWith('Z') || /[+-]\d\d:\d\d$/.test(s)
  return new Date(hasTZ ? s : `${s}Z`).getTime()
}

function roundNumber(g) {
  const raw = String(g?.roundLabel ?? g?.round_la ?? g?.round ?? '').trim()
  if (!raw) return null
  const digits = raw.match(/\d+/g)?.join('') ?? ''
  if (!digits) return null
  return String(parseInt(digits, 10))
}

function niceGenderLabel(g) {
  const x = upper(g)
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g ? String(g) : null
}

function normalizeStatus(st) {
  const s = upper(st)
  if (s === 'SCHEDULED' || s === 'PROGRAMADO' || s === 'UPCOMING') return 'SCHEDULED'
  if (s === 'LIVE' || s === 'IN_PROGRESS' || s === 'EN JUEGO') return 'LIVE'
  return s || 'SCHEDULED'
}

function pickSeasonId(g) {
  return toNum(
    g?.season_id ??
    g?.seasonId ??
    g?.season?.season_id ??
    g?.season?.id ??
    g?.season?.seasonId
  )
}

function pickIso(g) {
  return String(
    g?.match_date_utc ??
    g?.matchDateUtc ??
    g?.match_date ??
    g?.matchDate ??
    g?.date ??
    g?.game_date ??
    ''
  ).trim()
}

function pickLogo(team) {
  if (!team) return null
  return (
    team.logoUrl ??
    team.logo_url ??
    team.logo ??
    team.imageUrl ??
    team.image_url ??
    null
  )
}

const upcomingGames = computed(() => {
  const raw = gamesRaw.value
  if (!Array.isArray(raw)) return []

  const cutoff = (nowMs.value || Date.now()) - 20 * 60_000
  const seasonFilter = Number(selectedSeasonId.value || 0) || 0

  const future = []
  const past = []

  for (const g of raw) {
    const id = Number(g?.game_id ?? g?.gameId ?? g?.id ?? 0)
    if (!id) continue

    const iso = pickIso(g)
    const ms = toUtcMs(iso)
    if (!ms) continue

    const status = normalizeStatus(g?.status)
    if (!(status === 'SCHEDULED' || status === 'LIVE')) continue

    const sid = pickSeasonId(g)
    if (seasonFilter && sid > 0 && sid !== seasonFilter) continue

    const d = new Date(ms)
    const dateLabelRaw = gameDateFmt.format(d)
    const dateLabel = dateLabelRaw.replace('.', '').replace(/^\w/, (c) => c.toUpperCase())

    const categoryName = String(g?.category?.name ?? g?.categoryName ?? `Categoría ${g?.category?.id ?? ''}`).trim() || 'Categoría'
    const gender = g?.category?.gender ? upper(g.category.gender) : (g?.gender ? upper(g.gender) : null)
    const code = g?.category?.code ? String(g.category.code) : (g?.categoryCode ? String(g.categoryCode) : null)

    const homeName = String(g?.home_team ?? g?.homeTeam?.name ?? g?.home?.name ?? 'Local').trim()
    const awayName = String(g?.away_team ?? g?.awayTeam?.name ?? g?.away?.name ?? 'Visitante').trim()

    const homeTeam = g?.homeTeam ?? g?.home ?? null
    const awayTeam = g?.awayTeam ?? g?.away ?? null

    const entry = {
      id,
      seasonId: sid,
      seasonName: sid ? (seasonsMap.value[sid] || `Temporada ${sid}`) : null,
      status,
      ms,
      dateLabel,
      timeLabel: gameTimeFmt.format(d),
      round: roundNumber(g),
      gender,
      genderLabel: niceGenderLabel(gender),
      code,
      categoryName,
      homeName,
      awayName,
      venue: String(g?.venue ?? g?.field ?? g?.location ?? g?.court ?? g?.stadium ?? '').trim(),
      homeLogo: pickLogo(homeTeam),
      awayLogo: pickLogo(awayTeam),
      isPast: ms < cutoff
    }

    if (entry.isPast) past.push(entry)
    else future.push(entry)
  }

  future.sort((a, b) => a.ms - b.ms)
  if (future.length > 0) return future

  // No hay ningún partido con fecha futura: en vez de dejar el widget
  // vacío, mostramos el SCHEDULED más reciente que exista (marcado
  // isPast) para que "Próximo juego" nunca se sienta desconectado.
  past.sort((a, b) => b.ms - a.ms)
  return past.length > 0 ? [past[0]] : []
})

const upcomingIndex = ref(0)
const upcomingTotal = computed(() => upcomingGames.value.length)

const activeUpcoming = computed(() => {
  const n = upcomingTotal.value
  if (n <= 0) return null
  const i = Math.min(Math.max(0, upcomingIndex.value), n - 1)
  return upcomingGames.value[i] ?? null
})

watch(
  () => upcomingTotal.value,
  (n) => {
    if (n <= 0) upcomingIndex.value = 0
    else if (upcomingIndex.value > n - 1) upcomingIndex.value = 0
  },
  { immediate: true }
)

const goToUpcoming = (i) => {
  const n = upcomingTotal.value
  if (n <= 0) return
  upcomingIndex.value = Math.min(Math.max(0, i), n - 1)
}
const nextUpcoming = () => {
  const n = upcomingTotal.value
  if (n <= 1) return
  upcomingIndex.value = (upcomingIndex.value + 1) % n
}
const prevUpcoming = () => {
  const n = upcomingTotal.value
  if (n <= 1) return
  upcomingIndex.value = (upcomingIndex.value - 1 + n) % n
}

let upcomingInterval = null
const UPCOMING_AUTOPLAY_MS = 6500
const startUpcomingAuto = () => {
  if (upcomingInterval) clearInterval(upcomingInterval)
  upcomingInterval = null
  if (upcomingTotal.value > 1) upcomingInterval = setInterval(() => nextUpcoming(), UPCOMING_AUTOPLAY_MS)
}
const stopUpcomingAuto = () => {
  if (upcomingInterval) clearInterval(upcomingInterval)
  upcomingInterval = null
}
watch(upcomingTotal, () => startUpcomingAuto(), { immediate: true })

let upPointerId = null
let upStartX = 0
let upStartY = 0
let upDx = 0
let upDy = 0
let upIsDown = false
let upIsSwipe = false
const UP_SWIPE_ACTIVATE_PX = 10
const UP_SWIPE_TRIGGER_PX = 45

function resetUpcomingSwipe() {
  upPointerId = null
  upStartX = 0
  upStartY = 0
  upDx = 0
  upDy = 0
  upIsDown = false
  upIsSwipe = false
}

const onUpcomingPointerDown = (e) => {
  if (upcomingTotal.value <= 1) return
  upIsDown = true
  upIsSwipe = false
  upPointerId = e.pointerId
  upStartX = e.clientX
  upStartY = e.clientY
  upDx = 0
  upDy = 0
  stopUpcomingAuto()

  const el = e.currentTarget
  if (el?.setPointerCapture) {
    try { el.setPointerCapture(e.pointerId) } catch {}
  }
}
const onUpcomingPointerMove = (e) => {
  if (!upIsDown || upPointerId === null || e.pointerId !== upPointerId) return
  upDx = e.clientX - upStartX
  upDy = e.clientY - upStartY
  if (!upIsSwipe) {
    const ax = Math.abs(upDx)
    const ay = Math.abs(upDy)
    if (ax > UP_SWIPE_ACTIVATE_PX && ax > ay * 1.2) upIsSwipe = true
  }
}
const onUpcomingPointerUp = (e) => {
  if (!upIsDown || upPointerId === null || e.pointerId !== upPointerId) return
  const dx = upDx
  const dy = upDy
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)

  if (upIsSwipe && ax > UP_SWIPE_TRIGGER_PX && ax > ay) {
    if (dx < 0) nextUpcoming()
    else prevUpcoming()
  }

  resetUpcomingSwipe()
  startUpcomingAuto()
}
const onUpcomingPointerCancel = () => {
  if (!upIsDown) return
  resetUpcomingSwipe()
  startUpcomingAuto()
}
const onUpcomingPointerLeave = () => {
  if (!upIsDown) return
  resetUpcomingSwipe()
  startUpcomingAuto()
}

/* ===================== PATROCINADORES (desde backend config) ===================== */
const sponsors = ref(clone(HOME_DEFAULTS.sponsors))

const FALLBACK_SPONSOR = {
  id: 'fallback',
  name: 'Patrocinador',
  logo: '',
  tagline: 'Próximamente',
  description: 'Patrocinador por anunciar.',
  url: '',
  label: 'Aliado'
}

const activeSponsorIndex = ref(0)

watch(
  () => sponsors.value.length,
  (len) => {
    if (len <= 0) { activeSponsorIndex.value = 0; return }
    if (activeSponsorIndex.value < 0) activeSponsorIndex.value = 0
    if (activeSponsorIndex.value >= len) activeSponsorIndex.value = 0
  },
  { immediate: true }
)

const activeSponsor = computed(() => {
  const list = sponsors.value
  const len = list.length
  if (len <= 0) return FALLBACK_SPONSOR
  const i = ((activeSponsorIndex.value % len) + len) % len
  return list[i] ?? FALLBACK_SPONSOR
})

const setActiveSponsorById = (id) => {
  const idx = sponsors.value.findIndex((x) => x.id === id)
  if (idx >= 0) activeSponsorIndex.value = idx
}
const nextSponsor = () => {
  const len = sponsors.value.length
  if (len <= 0) return
  activeSponsorIndex.value = (activeSponsorIndex.value + 1) % len
}
const prevSponsor = () => {
  const len = sponsors.value.length
  if (len <= 0) return
  activeSponsorIndex.value = (activeSponsorIndex.value - 1 + len) % len
}

let sponsorsIntervalId = null
onMounted(() => {
  if (sponsors.value.length > 1) sponsorsIntervalId = setInterval(() => nextSponsor(), 9000)
})

/* ===================== REGLAMENTOS ===================== */
const reglamentos = ref([
  {
    id: 'flag-2023',
    title: 'Reglamento Flag (2023) · Español',
    subtitle: 'Reglas base del juego: fundamentos, definiciones y dinámica.',
    category: 'Juego',
    type: 'PDF',
    meta: 'Lectura recomendada',
    tags: ['Reglas', 'Arbitraje', 'Juego limpio'],
    bullets: ['Ideal para jugadores nuevos y capitanes.', 'Úsalo como referencia rápida.', 'Recomendado antes del primer partido.'],
    href: '/reglamentos/FlagRules2023_spa.pdf',
    downloadName: 'FlagRules2023_spa.pdf'
  },
  {
    id: 'admin',
    title: 'Reglamento Administrativo',
    subtitle: 'Uniformes, cédula, rosters, pagos y sanciones administrativas.',
    category: 'Administración',
    type: 'DOCX',
    meta: 'Operación de liga',
    tags: ['Rosters', 'Pagos', 'Sanciones'],
    bullets: ['Lineamientos de uniforme y control.', 'Manejo de cédula y validación.', 'Sanciones económicas y disciplina.'],
    href: '/reglamentos/REGLAMENTO_ADMINISTRATIVO.docx',
    downloadName: 'REGLAMENTO_ADMINISTRATIVO.docx'
  },
  {
    id: 'mixto',
    title: 'Reglamento Flag Mixto',
    subtitle: 'Reglas específicas para la modalidad mixto y criterios de juego.',
    category: 'Mixto',
    type: 'PDF',
    meta: 'Modalidad oficial',
    tags: ['Mixto', 'Formato', 'Reglas específicas'],
    bullets: ['Reglas enfocadas a mixto.', 'Criterios y mecánicas propias.', 'Recomendado para capitanes y QBs.'],
    href: '/reglamentos/REGLAMENTO_FLAG_MIXTO_TOCHERO5.pdf',
    downloadName: 'REGLAMENTO_FLAG_MIXTO_TOCHERO5.pdf'
  }
])

onBeforeUnmount(() => {
  stopHeroAuto()
  stopUpcomingAuto()
  if (standingsTO) clearTimeout(standingsTO)
  if (nowTimer) clearInterval(nowTimer)
  if (sponsorsIntervalId) clearInterval(sponsorsIntervalId)
  if (onVisHandler) document.removeEventListener('visibilitychange', onVisHandler)
})
</script>

<style scoped>
.carousel-arrow {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}
.carousel-dot--active {
  transform: scale(1.12);
}

/* ✅ Swipe UX */
.hero-swipe {
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  position: relative;
}
.hero-swipe:active { cursor: grabbing; }

/* Tap zones for mobile */
.tapzone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 28%;
  background: transparent;
  border: 0;
}
.tapzone.left { left: 0; }
.tapzone.right { right: 0; }
@media (min-width: 640px) {
  .tapzone { display: none; }
}

/* Upcoming swipe zone */
.upcoming-swipe {
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .28s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.lift-enter-active, .lift-leave-active { transition: transform .22s ease, opacity .22s ease; }
.lift-enter-from { transform: translateY(6px) scale(0.99); opacity: 0; }
.lift-leave-to { transform: translateY(-6px) scale(0.99); opacity: 0; }

.clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
