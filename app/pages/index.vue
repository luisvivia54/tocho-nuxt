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
                  Temporada 2026
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

              <!-- ========== PRÓXIMOS JUEGOS (SLIDER LIMPIO 1/2) ========== -->
              <!-- ========== PRÓXIMOS JUEGOS (1 A LA VEZ · UX/UI) ========== -->
<div class="md:col-span-2">
  <div
    class="rounded-2xl border border-blue-100 bg-white/70 p-4 md:p-5
           shadow-[0_12px_28px_rgba(15,23,42,0.10)] backdrop-blur"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Próximo juego
          </p>

          <span
            v-if="upcomingTotal > 0"
            class="inline-flex items-center rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-extrabold text-blue-700"
          >
            {{ upcomingIndex + 1 }} / {{ upcomingTotal }}
          </span>
        </div>

        <p class="mt-1 text-[12px] text-slate-600">
          Un partido a la vez, con todos los detalles.
        </p>
      </div>

      <!-- Flechas -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-blue-200
                 text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="prevUpcoming()"
          :disabled="upcomingTotal <= 1"
          title="Anterior"
        >
          ←
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-blue-200
                 text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="nextUpcoming()"
          :disabled="upcomingTotal <= 1"
          title="Siguiente"
        >
          →
        </button>
      </div>
    </div>

    <!-- Estados -->
    <div
      v-if="gamesPending"
      class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
    >
      Cargando próximos juegos…
    </div>

    <div
      v-else-if="!activeUpcoming"
      class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600"
    >
      Aún no hay juegos programados.
    </div>

    <!-- Card PRO -->
    <article
      v-else
      class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white
             shadow-[0_14px_35px_rgba(15,23,42,0.10)]"
    >
      <!-- Top bar -->
      <div class="p-4 md:p-5 border-b border-slate-200 bg-gradient-to-r from-white to-blue-50/40">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <!-- Left: chips -->
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold leading-none"
                :class="String(activeUpcoming.status).toUpperCase() === 'LIVE'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-blue-200 bg-blue-50 text-blue-800'"
              >
                {{ String(activeUpcoming.status).toUpperCase() === 'LIVE' ? 'EN JUEGO' : 'PROGRAMADO' }}
              </span>

              <span
                class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {{ activeUpcoming.categoryName }}
              </span>

              <span
                v-if="activeUpcoming.genderLabel"
                class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {{ activeUpcoming.genderLabel }}
              </span>

              <span
                v-if="activeUpcoming.code"
                class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {{ activeUpcoming.code }}
              </span>

              <span
                v-if="activeUpcoming.round"
                class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                Jornada {{ activeUpcoming.round }}
              </span>
            </div>

            <p class="mt-2 text-sm font-extrabold text-slate-900 leading-tight">
              {{ activeUpcoming.dateLabel }}
            </p>
          </div>

          <!-- Right: time + countdown -->
          <div class="text-right shrink-0">
            <p class="text-2xl md:text-[28px] font-extrabold text-slate-900 tabular-nums leading-none whitespace-nowrap">
              {{ activeUpcoming.timeLabel }}
            </p>


          </div>
        </div>
      </div>

      <!-- Matchup -->
      <div class="p-4 md:p-5">
        <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 md:gap-4">
          <!-- HOME -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <div class="absolute -inset-2 rounded-3xl bg-blue-500/10 blur-xl"></div>
              <div
                class="relative h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center"
              >
                <img
                  v-if="activeUpcoming.homeLogo"
                  :src="activeUpcoming.homeLogo"
                  :alt="activeUpcoming.homeName"
                  class="h-full w-full object-contain p-1.5"
                  loading="lazy"
                  decoding="async"
                />
                <span v-else class="text-sm font-extrabold text-blue-700">
                  {{ initials(activeUpcoming.homeName) }}
                </span>
              </div>
            </div>

            <div class="min-w-0">
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Local</p>
              <p class="text-base font-extrabold text-slate-900 truncate">
                {{ activeUpcoming.homeName }}
              </p>
            </div>
          </div>

          <!-- VS -->
          <div class="flex flex-col items-center justify-center px-1">
            <span class="text-[11px] font-extrabold text-slate-400">VS</span>
            <span class="mt-1 h-1 w-10 rounded-full bg-slate-200"></span>
          </div>

          <!-- AWAY -->
          <div class="flex items-center justify-end gap-3 min-w-0">
            <div class="min-w-0 text-right">
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Visitante</p>
              <p class="text-base font-extrabold text-slate-900 truncate">
                {{ activeUpcoming.awayName }}
              </p>
            </div>

            <div class="relative shrink-0">
              <div class="absolute -inset-2 rounded-3xl bg-emerald-500/10 blur-xl"></div>
              <div
                class="relative h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center"
              >
                <img
                  v-if="activeUpcoming.awayLogo"
                  :src="activeUpcoming.awayLogo"
                  :alt="activeUpcoming.awayName"
                  class="h-full w-full object-contain p-1.5"
                  loading="lazy"
                  decoding="async"
                />
                <span v-else class="text-sm font-extrabold text-emerald-700">
                  {{ initials(activeUpcoming.awayName) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Meta -->
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">ID Partido</p>
            <p class="mt-0.5 text-sm font-extrabold text-slate-900 tabular-nums">{{ activeUpcoming.id }}</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Temporada</p>
            <p class="mt-0.5 text-sm font-extrabold text-slate-900">
              {{ activeUpcoming.seasonId ? `Temporada ${activeUpcoming.seasonId}` : '—' }}
            </p>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            to="/partidos"
            class="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-extrabold
                   bg-blue-600 text-white hover:bg-blue-500
                   shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
          >
            Ver todos los partidos
          </NuxtLink>


        </div>

        <!-- Dots -->
        <div v-if="upcomingTotal > 1" class="mt-4 flex items-center justify-center gap-1.5">
          <button
            v-for="(_, i) in upcomingTotal"
            :key="i"
            type="button"
            class="h-2.5 w-2.5 rounded-full border border-blue-200"
            :class="i === upcomingIndex ? 'bg-blue-600 border-blue-600' : 'bg-white hover:bg-blue-50'"
            @click="goToUpcoming(i)"
            :title="`Ir al juego ${i + 1}`"
          />
        </div>
      </div>
    </article>
  </div>
</div>
<!-- /PRÓXIMOS JUEGOS -->

              <!-- /Próximos juegos -->
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
                    <th class="px-3 py-2">J</th>
                    <th class="px-3 py-2">G</th>
                    <th class="px-3 py-2">PF</th>
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

        <!-- ========== PATROCINADORES (NUEVO DISEÑO: destacado + lista) ========== -->
        <section id="patrocinadores" class="mt-12">
          <div
            class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">aliados de la liga</p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">Patrocinadores oficiales</h2>
              </div>

              <!-- Flechas (opcional) -->
              <div class="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                  @click="prevSponsor"
                >
                  ←
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                  @click="nextSponsor"
                >
                  →
                </button>
              </div>
            </div>

            <div class="px-6 py-8 bg-white">
              <!-- Destacado -->
              <div
                class="rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_14px_35px_rgba(15,23,42,0.08)] overflow-hidden"
              >
                <div class="p-5 sm:p-6 md:p-7">
                  <p class="text-[11px] uppercase tracking-[0.22em] font-semibold text-slate-500">
                    patrocinador destacado
                  </p>

                  <div class="mt-2 grid md:grid-cols-12 gap-6 items-center">
                    <!-- Info -->
                    <div class="md:col-span-7">
                      <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        {{ activeSponsor.name }}
                      </h3>

                      <p class="mt-2 text-slate-700 max-w-xl">
                        {{ activeSponsor.description }}
                      </p>

                      <div class="mt-4 flex flex-wrap gap-2">
                        <span
                          v-if="activeSponsor.tagline"
                          class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          {{ activeSponsor.tagline }}
                        </span>

                        <span
                          v-if="activeSponsor.label"
                          class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800"
                        >
                          {{ activeSponsor.label }}
                        </span>
                      </div>

                      <div class="mt-5 flex flex-wrap items-center gap-2">
                        <a
                          v-if="activeSponsor.url"
                          :href="activeSponsor.url"
                          target="_blank"
                          rel="noopener"
                          class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                                 bg-blue-600 hover:bg-blue-500 text-white
                                 shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                        >
                          Visitar sitio ↗
                        </a>

                        <span
                          v-else
                          class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                                 bg-slate-100 text-slate-500 border border-slate-200"
                        >
                          Sin enlace
                        </span>

                        <span class="text-[11px] text-slate-500">
                          Toca una tarjeta abajo para cambiar el destacado.
                        </span>
                      </div>
                    </div>

                    <!-- Logo -->
                    <div class="md:col-span-5 flex md:justify-end justify-center">
                      <div class="relative">
                        <div
                          class="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-blue-500/10 blur-2xl absolute -inset-6"
                        ></div>

                        <div
                          class="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-white border border-slate-200
                                 shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden grid place-items-center relative"
                        >
                          <img
                            v-if="activeSponsor.logo"
                            :src="activeSponsor.logo"
                            :alt="activeSponsor.name"
                            class="h-[70%] w-[70%] object-contain"
                            loading="lazy"
                          />
                          <span v-else class="text-xs font-semibold text-slate-500 px-4 text-center">
                            Logo pendiente
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- mini footer -->
                <div class="px-5 sm:px-6 md:px-7 py-3 border-t border-slate-200 bg-white">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[11px] text-slate-500">
                      Aliados oficiales · Tochero5liga
                    </p>
                    <p class="text-[11px] text-slate-500">
                      Sponsor {{ activeSponsorIndex + 1 }} de {{ sponsors.length || 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Lista de patrocinadores -->
              <div class="mt-6">
                <div class="flex items-end justify-between gap-3">
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.22em] font-semibold text-slate-500">
                      patrocinadores actuales
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                      Desliza (mobile) o haz clic para destacar.
                    </p>
                  </div>

                  <a
                    href="https://www.instagram.com/tochero5liga/"
                    target="_blank"
                    rel="noopener"
                    class="hidden sm:inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    ¿Quieres patrocinar? ↗
                  </a>
                </div>

                <div class="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  <button
                    v-for="sp in sponsors"
                    :key="sp.id"
                    type="button"
                    class="min-w-[240px] sm:min-w-[260px] rounded-2xl border bg-white p-4 text-left
                           shadow-[0_10px_25px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)]
                           transition-shadow"
                    :class="sp.id === activeSponsor.id ? 'border-blue-300 ring-2 ring-blue-200/60' : 'border-slate-200'"
                    @click="setActiveSponsorById(sp.id)"
                  >
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center">
                        <img
                          v-if="sp.logo"
                          :src="sp.logo"
                          :alt="sp.name"
                          class="h-[70%] w-[70%] object-contain"
                          loading="lazy"
                        />
                        <span v-else class="text-[11px] font-extrabold text-slate-600">
                          {{ sp.name.slice(0, 2).toUpperCase() }}
                        </span>
                      </div>

                      <div class="min-w-0">
                        <p class="font-extrabold text-slate-900 truncate">{{ sp.name }}</p>
                        <p class="text-xs text-slate-600 truncate">{{ sp.tagline }}</p>
                      </div>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-if="sp.label"
                        class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {{ sp.label }}
                      </span>

                      <span
                        class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
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

/* ===================== PRÓXIMOS JUEGOS (SLIDER 1/2) ===================== */
type ApiTeamLite = Partial<{ name: string; shortName: string; logoUrl: string }>
type ApiCategoryLite = Partial<{ id: number; name: string; code: string; gender: string }>

type ApiGameLite = Partial<{
  game_id: number
  gameId: number
  id: number

  season_id: number
  seasonId: number

  status: string

  match_date_utc: string
  matchDateUtc: string
  match_date: string

  round_la: string | null
  roundLabel: string | null

  home_team: string | null
  away_team: string | null

  homeTeam: ApiTeamLite | null
  awayTeam: ApiTeamLite | null
  category: ApiCategoryLite | null
}>

type UpcomingVM = {
  id: number
  seasonId: number
  status: 'SCHEDULED' | 'LIVE' | string
  ms: number
  dateLabel: string
  timeLabel: string
  round: string | null

  gender: string | null
  genderLabel: string | null
  code: string | null
  categoryName: string

  homeName: string
  awayName: string
  homeLogo: string | null
  awayLogo: string | null
}

const { data: gamesRaw, pending: gamesPending } = useApi<ApiGameLite[]>('/games')

const nowMs = ref(0)
let nowTimer: any = null

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

onBeforeUnmount(() => {
  if (nowTimer) clearInterval(nowTimer)
})

function upper(v: any) {
  return String(v ?? '').toUpperCase()
}

function toUtcMs(matchUtc: string) {
  const s = String(matchUtc || '').trim()
  if (!s) return 0
  const hasTZ = s.endsWith('Z') || /[+-]\d\d:\d\d$/.test(s)
  return new Date(hasTZ ? s : `${s}Z`).getTime()
}

function roundNumber(g: any): string | null {
  const raw = String(g?.roundLabel ?? g?.round_la ?? '').trim()
  if (!raw) return null
  const digits = raw.match(/\d+/g)?.join('') ?? ''
  if (!digits) return null
  return String(parseInt(digits, 10))
}

function niceGenderLabel(g: string | null) {
  const x = upper(g)
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g ? String(g) : null
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function kickoffHint(ms: number, status: string) {
  const st = upper(status)
  if (st === 'LIVE') return 'Jugándose ahora'
  const diff = ms - (nowMs.value || Date.now())
  if (!Number.isFinite(diff)) return '—'
  if (diff <= 0) return 'En breve'
  const mins = Math.round(diff / 60000)
  const hrs = Math.round(diff / 3600000)
  const days = Math.round(diff / 86400000)
  if (mins <= 59) return `En ${mins} min`
  if (hrs <= 48) return `En ${hrs} h`
  return `En ${days} día(s)`
}

const upcomingGames = computed<UpcomingVM[]>(() => {
  const raw = gamesRaw.value as unknown
  if (!Array.isArray(raw)) return []

  const list = raw as ApiGameLite[]
  const cutoff = (nowMs.value || Date.now()) - 20 * 60_000

  const out: UpcomingVM[] = []

  for (const g of list) {
    const id = Number(g?.game_id ?? g?.gameId ?? g?.id ?? 0)
    if (!id) continue

    const iso = String(g?.match_date_utc ?? g?.matchDateUtc ?? g?.match_date ?? '').trim()
    const ms = toUtcMs(iso)
    if (!ms) continue

    const st = upper(g?.status ?? '')
    if (!(st === 'SCHEDULED' || st === 'LIVE')) continue
    if (ms < cutoff) continue

    const d = new Date(ms)
    const dateLabelRaw = gameDateFmt.format(d)
    const dateLabel = dateLabelRaw.replace('.', '').replace(/^\w/, (c) => c.toUpperCase())

    const categoryName = String(g?.category?.name ?? `Categoría ${g?.category?.id ?? ''}`).trim()
    const gender = g?.category?.gender ? upper(g.category.gender) : null
    const code = g?.category?.code ? String(g.category.code) : null

    const homeName = String(g?.home_team ?? g?.homeTeam?.name ?? 'Local').trim()
    const awayName = String(g?.away_team ?? g?.awayTeam?.name ?? 'Visitante').trim()

    out.push({
      id,
      seasonId: Number(g?.season_id ?? g?.seasonId ?? 0) || 0,
      status: (st as any) || 'SCHEDULED',
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
      homeLogo: (g?.homeTeam as any)?.logoUrl ?? null,
      awayLogo: (g?.awayTeam as any)?.logoUrl ?? null
    })
  }

  out.sort((a, b) => a.ms - b.ms)
  return out
})
/* ===================== PRÓXIMOS JUEGOS (1 A LA VEZ) ===================== */
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

const goToUpcoming = (i: number) => {
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

/* ===================== PATROCINADORES (NUEVO DISEÑO) ===================== */
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
    description: 'Dicass acompaña a jugadores y familias con activaciones, alimentos y experiencias dentro del deportivo.',
    url: 'https://dicass.com.mx/',
    label: 'Patrocinador principal'
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

let sponsorsIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (sponsors.value.length > 1) sponsorsIntervalId = setInterval(() => nextSponsor(), 9000)
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
