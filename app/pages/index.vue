<!-- app/pages/index.vue -->
<template>
  <main class="bg-[#F3F4FF] text-slate-900 min-h-screen">
    <!-- ========== HERO + CARRUSEL ========== -->
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6">
        <!-- Carrusel con IMG real -->
        <div
          class="w-full rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.40)] bg-slate-900"
        >
          <div class="relative w-full" style="aspect-ratio: 16/5">
            <img :src="currentSlideSrc" alt="tochero5liga" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Controles del carrusel -->
        <div class="mt-3 flex items-center justify-center gap-4">
          <button class="carousel-arrow bg-white shadow" @click="prevSlide">
            <span class="text-xs text-slate-700">&larr;</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              class="carousel-dot border border-slate-300"
              :class="idx === currentSlide ? 'carousel-dot--active bg-blue-500 border-blue-500' : 'bg-white'"
              @click="goToSlide(idx)"
            />
          </div>

          <button class="carousel-arrow bg-white shadow" @click="nextSlide">
            <span class="text-xs text-slate-700">&rarr;</span>
          </button>
        </div>

        <!-- Overlay card (azul claro) -->
        <div class="relative -mt-20 sm:-mt-24">
          <div
            class="p-6 md:p-8 bg-blue-50 text-slate-900 border border-blue-100 rounded-[26px] shadow-[0_18px_40px_rgba(37,99,235,0.25)]"
          >
            <div class="grid md:grid-cols-5 gap-6 items-start">
              <div class="md:col-span-3">
                <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Temporada 2025
                </h1>
                <p class="mt-2 text-slate-700">Resultados, posiciones y registros en un solo lugar.</p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <NuxtLink
                    to="/estadisticas"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                  >
                    Ver estadísticas
                  </NuxtLink>
                  <NuxtLink
                    to="/registro"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50"
                  >
                    Registrar equipo
                  </NuxtLink>
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 shadow-sm">
                  <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Próximo juego</div>
                  <div class="mt-1 text-sm text-slate-700">Aún no hay juegos programados.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Texto introductorio -->
        <div class="mt-10">
          <h2 class="font-display text-2xl font-extrabold mb-1 text-slate-900">TOCHERO5LIGA</h2>
          <p class="text-slate-600">ENTÉRATE DE TODO LO QUE ESTÁ PASANDO EN EL TORNEO.</p>
        </div>

        <!-- ========== TOP 5 POSICIONES (desde backend) ========== -->
        <div
          class="mt-8 rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
            <div class="flex items-center gap-3">
              <h3 class="font-display font-extrabold text-white">Top 5 · Posiciones</h3>
              <span class="hidden sm:inline text-xs text-white/80 font-medium">ACTUALIZADO</span>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
              @click="refresh()"
            >
              Refrescar
            </button>
          </div>

          <!-- Filtros -->
          <div class="px-5 py-4 bg-white border-b border-slate-200/70">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <!-- Categoría -->
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

              <!-- Rama -->
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

              <!-- Acciones -->
              <div class="flex gap-2 sm:justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  @click="refresh()"
                >
                  Refrescar
                </button>
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

          <div class="bg-white overflow-x-auto">
            <div v-if="pending" class="px-4 py-3 text-sm text-slate-500">Cargando posiciones...</div>
            <div v-else-if="error" class="px-4 py-3 text-sm text-red-600">Error al cargar las posiciones.</div>

            <template v-else>
              <table class="min-w-[880px] w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-500 border-b border-slate-200/80">
                    <th class="px-3 py-2">Rk</th>
                    <th class="px-3 py-2">Equipo</th>
                    <th class="px-3 py-2">PJ</th>
                    <th class="px-3 py-2">PG</th>
                    <th class="px-3 py-2">GF</th>
                    <th class="px-3 py-2">Pts</th>
                    <th class="px-3 py-2">Índice</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in topPositions"
                    :key="row.rank"
                    class="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                  >
                    <td class="px-3 py-2 font-semibold text-slate-800">{{ row.rank }}</td>
                    <td class="px-3 py-2">{{ row.teamName }}</td>
                    <td class="px-3 py-2">{{ row.gamesPlayed }}</td>
                    <td class="px-3 py-2">{{ row.wins }}</td>
                    <td class="px-3 py-2">{{ row.goalsFor }}</td>
                    <td class="px-3 py-2">{{ row.points }}</td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {{ formatEfficiency(row.wins, row.gamesPlayed) }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="topPositions.length === 0">
                    <td colspan="7" class="px-3 py-3 text-sm text-slate-500">
                      Aún no hay posiciones registradas (o no hay datos para esos filtros).
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </div>

        <!-- ========== REGLAMENTOS (3) ========== -->
        <section id="reglamentos" class="mt-12">
          <div class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden">
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">reglamentos oficiales</p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">Reglas y normativa de la liga</h2>
              </div>

              <div class="hidden sm:flex items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">3 documentos</span>
                <a href="#patrocinadores" class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                  Ver patrocinadores →
                </a>
              </div>
            </div>

            <div class="px-6 py-8">
              <div class="grid gap-4 md:grid-cols-3">
                <article
                  v-for="doc in reglamentos"
                  :key="doc.id"
                  class="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden
                         shadow-[0_14px_35px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                         transition-shadow"
                >
                  <div class="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

                  <div class="p-5">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                          {{ doc.category }}
                        </p>
                        <h3 class="mt-1 font-display text-lg font-extrabold text-slate-900 leading-tight">
                          {{ doc.title }}
                        </h3>
                        <p class="mt-2 text-sm text-slate-600">{{ doc.subtitle }}</p>
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
                          <span>{{ b }}</span>
                        </li>
                      </ul>
                    </details>

                    <div class="mt-4 flex items-center gap-2">
                      <NuxtLink
                        :to="doc.href"
                        external
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                              bg-blue-600 hover:bg-blue-500 text-white
                              shadow-[0_10px_25px_rgba(37,99,235,0.35)]
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Ver reglamento <span class="ml-1 text-xs">↗</span>
                      </NuxtLink>

                      <NuxtLink
                        :to="doc.href"
                        external
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
                      </NuxtLink>
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

        <!-- ========== PATROCINADORES (SIMPLE CARRUSEL CON ÉNFASIS) ========== -->
        <section id="patrocinadores" class="mt-12">
          <div class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden">
            <!-- Header (mismo gradiente) -->
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">aliados de la liga</p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">Patrocinadores</h2>
              </div>
              <div class="hidden sm:block text-xs text-blue-50/85 text-right">
                <p>Desliza / usa flechas</p>
                <p>El del centro es el destacado</p>
              </div>
            </div>

            <div class="px-6 py-8 bg-white">
              <!-- Controles -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    @click="prevSponsor"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    @click="nextSponsor"
                  >
                    →
                  </button>
                </div>

                <div class="text-right">
                  <p class="text-xs text-slate-500">Destacado</p>
                  <p class="text-sm font-extrabold text-slate-900">{{ activeSponsor.name }}</p>
                </div>
              </div>

              <!-- Carrusel 3 tarjetas (prev / active / next) -->
              <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                <button
                  v-for="(s, idx) in visibleSponsors"
                  :key="`${s.id}-${idx}`"
                  type="button"
                  class="text-left rounded-3xl border transition-all duration-300 overflow-hidden"
                  :class="sponsorCardClass(idx)"
                  @click="idx !== 1 ? setActiveSponsorById(s.id) : undefined"
                >
                  <div class="p-5 h-full flex flex-col">
                    <!-- top -->
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-[11px] uppercase tracking-[0.22em]" :class="idx === 1 ? 'text-blue-600' : 'text-slate-500'">
                          {{ idx === 1 ? 'patrocinador destacado' : 'patrocinador' }}
                        </p>
                        <h3 class="mt-1 font-display font-extrabold leading-tight"
                            :class="idx === 1 ? 'text-2xl text-slate-900' : 'text-lg text-slate-800'">
                          {{ s.name }}
                        </h3>
                        <p class="mt-1 text-sm text-slate-600 line-clamp-2">{{ s.tagline }}</p>
                      </div>

                      <span
                        class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        :class="idx === 1 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-700 border border-slate-200'"
                      >
                        {{ s.label }}
                      </span>
                    </div>

                    <!-- logo -->
                    <div class="mt-4 flex-1 flex items-center justify-center">
                      <div
                        class="w-full rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center"
                        :class="idx === 1 ? 'h-40 sm:h-44' : 'h-28 sm:h-32'"
                      >
                        <img
                          v-if="s.logo"
                          :src="s.logo"
                          :alt="s.name"
                          class="max-h-[75%] max-w-[75%] object-contain"
                          loading="lazy"
                        />
                        <div v-else class="text-sm font-semibold text-slate-500 px-6 text-center">
                          Logo pendiente
                        </div>
                      </div>
                    </div>

                    <!-- desc + cta -->
                    <p class="mt-4 text-sm text-slate-700 line-clamp-2">
                      {{ s.description }}
                    </p>

                    <div class="mt-4 flex items-center justify-between gap-3">
                      <span class="text-[11px] text-slate-500">
                        {{ idx === 1 ? 'Toca los lados para cambiar' : 'Toca para destacar' }}
                      </span>

                      <a
                        v-if="idx === 1 && !!activeSponsor.url"
                        :href="activeSponsor.url"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold
                               bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                        @click.stop
                      >
                        Visitar ↗
                      </a>

                      <span
                        v-else-if="idx === 1 && !activeSponsor.url"
                        class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold
                               bg-slate-100 text-slate-500 border border-slate-200"
                        title="Aún no hay enlace"
                      >
                        Sin enlace
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              <!-- dots -->
              <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  v-for="sp in sponsors"
                  :key="sp.id"
                  type="button"
                  class="h-2.5 w-2.5 rounded-full border transition"
                  :class="sp.id === activeSponsor.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 hover:border-slate-400'"
                  :aria-label="`Ir a ${sp.name}`"
                  @click="setActiveSponsorById(sp.id)"
                />
              </div>
            </div>
          </div>

          <p class="mt-3 text-[11px] text-slate-500 text-right">
            ¿Quieres patrocinar? Escríbenos por Instagram @tochero5liga
          </p>
        </section>
      </div>

      <!-- FOOTER / UBICACIÓN -->
      <div class="mt-14 bg-[#E0E7FF]">
        <div class="max-w-6xl mx-auto container-pad px-6 py-10">
          <div class="grid md:grid-cols-5 gap-6 items-start">
            <div class="md:col-span-2 space-y-2">
              <h2 class="font-display text-2xl font-extrabold text-slate-900">Ubicación</h2>
              <p class="opacity-95 text-slate-800">FES Acatlán · Entrada Principal (peatonal)</p>
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

            <div class="md:col-span-3">
              <div class="aspect-video rounded-[26px] overflow-hidden border border-white/70 shadow-lg bg-black/10">
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

          <div class="flex items-center justify-between text-sm text-slate-600">
            <span>© 2025 tochero5liga</span>

            <span class="inline-flex items-center gap-2 opacity-90 hover:opacity-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
              </svg>
              <span>@tochero5liga</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useApi } from '@/composables/useApi'

/* ===================== MAPA (apunta al shortlink) ===================== */
const mapsShortUrl = 'https://maps.app.goo.gl/zKNYRashoqHAMJwP9'
const mapsLat = 19.4820973
const mapsLng = -99.2446694

const mapsEmbedSrc = computed(() => `https://www.google.com/maps?q=${mapsLat},${mapsLng}&z=17&output=embed`)
const mapsOpenUrl = mapsShortUrl

/* ===================== FILTROS (rama y categoría) ===================== */
type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO'

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

const pointsUrl = computed(() => {
  const params = new URLSearchParams()
  if (selectedCategoryCode.value !== 'all') params.set('categoryCode', selectedCategoryCode.value)
  if (selectedGender.value !== 'all') params.set('gender', selectedGender.value)
  const qs = params.toString()
  return qs ? `/points?${qs}` : '/points'
})

const clearFilters = () => {
  selectedCategoryCode.value = 'all'
  selectedGender.value = 'all'
}

/* ===================== RAW DEL BACKEND (/points) ===================== */
type ApiStandingAny = Partial<{
  standing_id: number
  season_id: number
  category_id: number
  team_id: number
  points_for: number
  points_against: number
  table_points: number
  team_name: string

  standingId: number
  seasonId: number
  categoryId: number
  teamId: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  teamName: string

  gender: string
  categoryCode: string

  gp: number
  wins: number
  losses: number
  draws: number
}>

const { data: standings, pending, error, refresh } = useApi<ApiStandingAny[]>(pointsUrl)

interface StandingRow {
  rank: number
  teamName: string
  gamesPlayed: number
  wins: number
  goalsFor: number
  points: number
}

const topPositions = computed<StandingRow[]>(() => {
  const raw = standings.value as unknown
  if (!Array.isArray(raw)) return []
  const rows = raw as ApiStandingAny[]

  const toNum = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)

  return rows
    .slice()
    .sort((a, b) => {
      const aPts = toNum(a.table_points ?? a.tablePoints)
      const bPts = toNum(b.table_points ?? b.tablePoints)
      if (bPts !== aPts) return bPts - aPts
      const aFor = toNum(a.points_for ?? a.pointsFor)
      const bFor = toNum(b.points_for ?? b.pointsFor)
      return bFor - aFor
    })
    .slice(0, 5)
    .map((row, idx) => ({
      rank: idx + 1,
      teamName: String(row.team_name ?? row.teamName ?? '—'),
      gamesPlayed: toNum(row.gp),
      wins: toNum(row.wins),
      goalsFor: toNum(row.points_for ?? row.pointsFor),
      points: toNum(row.table_points ?? row.tablePoints)
    }))
})

const calcEfficiencyValue = (wins: number, gamesPlayed: number): number => {
  if (!gamesPlayed || gamesPlayed <= 0) return 0
  const eff = (wins / gamesPlayed) * 100
  if (!Number.isFinite(eff) || eff < 0) return 0
  if (eff > 100) return 100
  return eff
}

const formatEfficiency = (wins: number, gamesPlayed: number): string => {
  const eff = calcEfficiencyValue(wins, gamesPlayed)
  const txt = eff.toFixed(1)
  return (txt.endsWith('.0') ? txt.slice(0, -2) : txt) + '%'
}

/* ===================== HERO CARRUSEL ===================== */
interface HeroSlide {
  id: string
  src: string
}

const heroSlides = ref<HeroSlide[]>([
  { id: 'slide-1', src: '/img/sponsors/foto_1.jpg' }
])

const currentSlide = ref(0)
const currentSlideSrc = computed(() => heroSlides.value[currentSlide.value]?.src ?? '')

let intervalId: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < heroSlides.value.length) currentSlide.value = index
}

onMounted(() => {
  if (heroSlides.value.length > 1) intervalId = setInterval(nextSlide, 7000)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})

/* ===================== PATROCINADORES (FIX TS: sin undefined) ===================== */
interface Sponsor {
  id: string
  name: string
  logo: string
  tagline: string
  description: string
  url: string
  label: string
}

const sponsors = ref<Sponsor[]>([
  {
    id: 'dicass',
    name: 'DICASS',
    logo: '/img/sponsors/dicass-logo.png',
    tagline: 'Innovación para el juego y el bienestar.',
    description: 'Activaciones, alimentos y experiencias dentro del deportivo.',
    url: 'https://dicass.com.mx/',
    label: 'Patrocinador principal'
  },
  {
    id: 'marti',
    name: 'Martí',
    logo: '/img/sponsors/marti-logo.png',
    tagline: 'Todo para el deporte.',
    description: 'Equipo y accesorios para entrenar y competir.',
    url: 'https://www.marti.mx/',
    label: 'Aliado'
  },
  {
    id: 'ruffles',
    name: 'Ruffles',
    logo: '/img/sponsors/ruffles-logo.png',
    tagline: 'Sabor para la jornada.',
    description: 'Snacks para el after-game y activaciones.',
    url: 'https://ruffles.com.mx/lmx/',
    label: 'Aliado'
  },
  {
    id: 'under-armour',
    name: 'Under Armour',
    logo: '/img/sponsors/underarmour-logo.png',
    tagline: 'Performance gear.',
    description: 'Ropa y accesorios de alto rendimiento.',
    url: 'https://www.underarmour.com.mx/',
    label: 'Aliado'
  },
  {
    id: 'blitz',
    name: 'Blitz',
    logo: '/img/sponsors/blitzflag-logo.png',
    tagline: 'Entrena fuerte.',
    description: 'Accesorios y equipo para entrenamientos.',
    url: 'https://www.instagram.com/blitzflag?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'Aliado'
  },
  {
    id: 'medimex',
    name: 'Medimex',
    logo: '/img/sponsors/medimex-logo.png',
    tagline: 'Salud deportiva.',
    description: 'Atención y soporte para atletas.',
    url: 'https://www.instagram.com/plan.medimex?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'Aliado'
  }
])

const FALLBACK_SPONSOR: Sponsor = {
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
    if (len <= 0) {
      activeSponsorIndex.value = 0
      return
    }
    if (activeSponsorIndex.value < 0) activeSponsorIndex.value = 0
    if (activeSponsorIndex.value >= len) activeSponsorIndex.value = 0
  },
  { immediate: true }
)

const activeSponsor = computed<Sponsor>(() => {
  const list = sponsors.value
  const len = list.length
  if (len <= 0) return FALLBACK_SPONSOR
  const i = ((activeSponsorIndex.value % len) + len) % len
  return list[i] ?? FALLBACK_SPONSOR
})

const visibleSponsors = computed<Sponsor[]>(() => {
  const list = sponsors.value
  const len = list.length

  if (len === 0) return [FALLBACK_SPONSOR, FALLBACK_SPONSOR, FALLBACK_SPONSOR]

  const i = ((activeSponsorIndex.value % len) + len) % len
  const cur = list[i] ?? FALLBACK_SPONSOR

  if (len === 1) return [cur, cur, cur]

  const prev = list[(i - 1 + len) % len] ?? FALLBACK_SPONSOR
  const next = list[(i + 1) % len] ?? FALLBACK_SPONSOR
  return [prev, cur, next]
})

const setActiveSponsorById = (id: string) => {
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

const sponsorCardClass = (idx: number) => {
  // idx 0 = prev, 1 = active, 2 = next
  if (idx === 1) {
    return 'border-blue-200 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.18)] ring-1 ring-blue-200/60 scale-[1.02]'
  }
  return 'border-slate-200 bg-slate-50 hover:bg-slate-100/60 opacity-90 hover:opacity-100'
}

let sponsorsIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (sponsors.value.length > 1) sponsorsIntervalId = setInterval(() => nextSponsor(), 7000)
})

onBeforeUnmount(() => {
  if (sponsorsIntervalId) clearInterval(sponsorsIntervalId)
})

/* ===================== REGLAMENTOS (3 documentos) ===================== */
type ReglamentoType = 'PDF' | 'DOCX'

interface ReglamentoDoc {
  id: string
  title: string
  subtitle: string
  category: string
  type: ReglamentoType
  meta: string
  tags: string[]
  bullets: string[]
  href: string
  downloadName: string
}

const reglamentos = ref<ReglamentoDoc[]>([
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
</script>

<style scoped>
/* Pequeñito (sin @apply para que no te marque errores) */
.carousel-arrow {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.carousel-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
}
.carousel-dot--active {
  transform: scale(1.05);
}
</style>
