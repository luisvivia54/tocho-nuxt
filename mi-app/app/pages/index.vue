<template>
  <main class="bg-[#F3F4FF] text-slate-900 min-h-screen">
    <!-- Ya NO hay header aquí, solo contenido de la home -->

    <!-- ========== HERO + CARRUSEL ========== -->
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6">
        <!-- Carrusel con IMG real -->
        <div class="w-full rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.40)] bg-slate-900">
          <div class="relative w-full" style="aspect-ratio: 16/5;">
            <img :src="currentSlideSrc" alt="tochero5liga" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Controles del carrusel -->
        <div class="mt-3 flex items-center justify-center gap-4">
          <button class="carousel-arrow bg-white shadow" type="button" @click="prevSlide">
            <span class="text-xs text-slate-700">&larr;</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              type="button"
              class="carousel-dot border border-slate-300"
              :class="idx === currentSlide ? 'carousel-dot--active bg-blue-500 border-blue-500' : 'bg-white'"
              @click="goToSlide(idx)"
              :aria-label="`Ir a slide ${idx + 1}`"
            />
          </div>

          <button class="carousel-arrow bg-white shadow" type="button" @click="nextSlide">
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
                <p class="mt-2 text-slate-700">
                  Resultados, posiciones y registros en un solo lugar.
                </p>
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
                  <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Próximo juego
                  </div>
                  <div class="mt-1 text-sm text-slate-700">
                    Aún no hay juegos programados.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Texto introductorio -->
        <div class="mt-10">
          <h2 class="font-display text-2xl font-extrabold mb-1 text-slate-900">
            TOCHERO5LIGA
          </h2>
          <p class="text-slate-600">
            ENTÉRATE DE TODO LO QUE ESTÁ PASANDO EN EL TORNEO.
          </p>
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
            <div v-if="pending" class="px-4 py-3 text-sm text-slate-500">
              Cargando posiciones...
            </div>
            <div v-else-if="error" class="px-4 py-3 text-sm text-red-600">
              Error al cargar las posiciones.
            </div>

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
<<<<<<< HEAD
                      Aún no hay posiciones registradas (o no hay datos para esos filtros).
=======
                      Aún no hay posiciones registradas.
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </div>

<<<<<<< HEAD
        <!-- ========== PATROCINADORES (mismo color que Top 5) ========== -->
=======
        <!-- ========== PATROCINADORES ========= -->
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
        <section id="patrocinadores" class="mt-12">
          <div
            class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
          >
<<<<<<< HEAD
            <!-- Header con MISMO gradient que Top 5 -->
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
=======
            <div
              class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]"
            >
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">
                  aliados de la liga
                </p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Patrocinadores oficiales
                </h2>
              </div>
<<<<<<< HEAD
              <div class="hidden sm:block text-xs text-blue-50/85 text-right">
                <p>Espacios limitados para patrocinio.</p>
                <p>Escríbenos en Instagram para colaborar.</p>
              </div>
            </div>

            <!-- Contenido claro -->
            <div class="px-6 py-8 bg-white text-slate-900">
              <div class="grid gap-8 md:grid-cols-3 items-stretch">
                <!-- Texto + CTA -->
                <div class="md:col-span-2 flex flex-col justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold tracking-[0.2em] text-blue-500 uppercase">
                      Patrocinador destacado
=======
              <div class="hidden sm:flex flex-col text-right text-[11px] text-blue-50/85">
                <span>1 patrocinador a la vez.</span>
                <span>Rotan automáticamente durante la temporada.</span>
              </div>
            </div>

            <div class="px-6 py-7 sm:py-8 bg-white text-slate-900">
              <div class="grid lg:grid-cols-[minmax(0,1.3fr),minmax(260px,0.9fr)] gap-8 items-center">
                <!-- Texto -->
                <div class="space-y-4">
                  <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                    <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Patrocinador activo
                    </span>
                  </div>

                  <div>
                    <h3 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {{ activeSponsor.name }}
                    </h3>
                    <p class="mt-2 text-sm sm:text-base text-slate-700">
                      {{ activeSponsor.tagline }}
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                    </p>
                    <h4 class="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {{ activeSponsor.name }}
                    </h4>
                    <p class="mt-2 text-sm text-slate-700">
                      {{ activeSponsor.description }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700"
                      >
                        {{ activeSponsor.tagline }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700"
                      >
                        {{ activeSponsor.label }}
                      </span>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div class="mt-4 flex items-center gap-3">
=======
                  <p class="text-sm text-slate-700 leading-relaxed">
                    {{ activeSponsor.description }}
                  </p>

                  <div class="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-[11px] font-semibold"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      {{ activeSponsor.label }}
                    </span>

>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                    <a
                      :href="activeSponsor.url"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)]"
                    >
                      Visitar sitio
                      <span class="ml-1 text-xs">↗</span>
                    </a>
                    <p class="text-[11px] text-slate-500">
                      Toca una tarjeta abajo para cambiar de patrocinador.
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                <!-- Logo grande + mini stats -->
                <div class="flex flex-col items-center justify-center gap-4">
=======
                <!-- Logo + controles -->
                <div class="flex flex-col items-center gap-5">
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                  <div
                    class="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-blue-400 via-white to-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.7)]"
                  >
                    <img
                      v-if="activeSponsor.logo"
                      :src="activeSponsor.logo"
                      :alt="activeSponsor.name"
                      class="max-w-[70%] max-h-[70%] object-contain"
                      loading="lazy"
                    />
                    <span v-else class="text-sm font-display font-bold text-slate-900">
                      {{ activeSponsor.name }}
                    </span>
                  </div>

<<<<<<< HEAD
                  <div class="grid grid-cols-3 gap-2 w-full text-[10px] text-slate-700">
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">Promos</div>
                      <div class="mt-1 opacity-80">Jugadores y staff</div>
                    </div>
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">Activaciones</div>
                      <div class="mt-1 opacity-80">En campo</div>
                    </div>
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">MVP</div>
                      <div class="mt-1 opacity-80">Premios especiales</div>
=======
                  <div class="flex flex-col items-center gap-3 w-full">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                        @click="prevSponsor"
                      >
                        <span class="text-sm text-slate-700">&larr;</span>
                      </button>
                      <span class="text-[11px] text-slate-500">
                        {{ activeSponsorIndex + 1 }} / {{ sponsors.length }}
                      </span>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                        @click="nextSponsor"
                      >
                        <span class="text-sm text-slate-700">&rarr;</span>
                      </button>
                    </div>

                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        v-for="(s, idx) in sponsors"
                        :key="s.id"
                        type="button"
                        class="h-1.5 rounded-full transition-all"
                        :class="idx === activeSponsorIndex ? 'w-5 bg-blue-500' : 'w-2 bg-slate-300 hover:bg-slate-400'"
                        @click="setActiveSponsor(idx)"
                        :aria-label="`Ir a patrocinador ${s.name}`"
                      />
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                    </div>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <!-- Selector de patrocinadores -->
              <div class="mt-6 border-t border-slate-200 pt-4">
                <p class="text-[11px] text-slate-500 mb-2">
                  Patrocinadores oficiales · desliza o toca una tarjeta
=======
              <div class="mt-6 pt-4 border-t border-slate-200">
                <p class="text-[11px] text-slate-500 mb-2">
                  Patrocinadores oficiales · toca una tarjeta para cambiar de patrocinador
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                </p>
                <div class="flex gap-3 overflow-x-auto pb-1">
                  <button
                    v-for="(sponsor, idx) in sponsors"
                    :key="sponsor.id"
                    type="button"
                    class="group flex items-center gap-3 rounded-2xl border px-3 py-2 min-w-[190px] transition-all"
                    :class="idx === activeSponsorIndex ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'"
                    @click="setActiveSponsor(idx)"
                  >
<<<<<<< HEAD
                    <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden">
=======
                    <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-slate-200">
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                      <img
                        v-if="sponsor.logo"
                        :src="sponsor.logo"
                        :alt="sponsor.name"
                        class="w-full h-full object-contain"
                        loading="lazy"
                      />
                      <span v-else class="text-[11px] font-semibold text-slate-700">
<<<<<<< HEAD
                        {{ sponsor.name }}
                      </span>
                    </div>
                    <div class="text-left">
                      <div class="text-xs font-semibold text-slate-900">{{ sponsor.name }}</div>
                      <div class="text-[11px] text-slate-500">{{ sponsor.tagline }}</div>
=======
                        {{ s.name }}
                      </span>
                    </div>
                    <div class="text-left">
                      <div class="text-xs font-semibold text-slate-900">{{ s.name }}</div>
                      <div class="text-[11px] text-slate-500">{{ s.tagline }}</div>
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-3 text-[11px] text-slate-500 text-right">
            ¿Quieres patrocinar? Escríbenos por Instagram @tochero5liga
          </p>
        </section>
<<<<<<< HEAD
=======

        <!-- ========== REGLAMENTO ========== -->
        <section id="reglamento" class="mt-12">
          <div
            class="rounded-[26px] bg-slate-900 text-slate-50 overflow-hidden shadow-[0_20px_45px_rgba(15,23,42,0.55)] border border-slate-800"
          >
            <div class="px-5 py-4 bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#1d4ed8] border-b border-slate-800">
              <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-200 uppercase">
                reglas oficiales
              </p>
              <div class="mt-1 flex flex-wrap items-center justify-between gap-3">
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-slate-50">
                  Reglamento Tochero5Liga · Flag 5 vs 5
                </h2>
                <a
                  href="/docs/reglamento-flag-2023.pdf"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-blue-300/60 bg-blue-500/10 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-blue-100 hover:bg-blue-500/20"
                >
                  Ver reglamento completo (PDF)
                  <span class="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            <div class="px-6 py-7 sm:py-8">
              <div class="grid lg:grid-cols-[minmax(0,1.2fr),minmax(260px,0.9fr)] gap-8 items-start">
                <div class="space-y-5">
                  <p class="text-sm text-slate-200/90">
                    Usamos el reglamento oficial de Flag Football. Aquí tienes un resumen rápido para que jugadores y coaches tengan claro
                    cómo se juega la liga.
                  </p>

                  <div class="flex flex-wrap gap-2 mt-1">
                    <button
                      v-for="section in ruleSections"
                      :key="section.id"
                      type="button"
                      class="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold transition"
                      :class="section.id === activeRuleId
                        ? 'bg-blue-500 text-white shadow-[0_0_0_1px_rgba(191,219,254,0.6)]'
                        : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'"
                      @click="setActiveRule(section.id)"
                    >
                      {{ section.title }}
                    </button>
                  </div>

                  <div class="mt-2 space-y-3">
                    <h3 class="text-xs font-semibold tracking-[0.18em] uppercase text-blue-200">
                      {{ activeRule.subtitle }}
                    </h3>
                    <ul class="space-y-2 text-sm text-slate-100/90">
                      <li v-for="(item, idx) in activeRule.bullets" :key="idx" class="flex gap-2">
                        <span class="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="space-y-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 p-4">
                  <h3 class="text-sm font-semibold text-slate-50 flex items-center gap-2">
                    <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/60 text-[11px]">
                      i
                    </span>
                    Puntos clave del partido
                  </h3>
                  <dl class="space-y-2 text-[13px] text-slate-200">
                    <div class="flex items-start justify-between gap-3">
                      <dt class="font-semibold text-slate-100">Formato</dt>
                      <dd class="text-right">
                        Juegos 5 vs 5 en campo de flag. Plantel amplio para rotaciones durante la temporada.
                      </dd>
                    </div>
                    <div class="flex items-start justify-between gap-3">
                      <dt class="font-semibold text-slate-100">Duración</dt>
                      <dd class="text-right">
                        Partido estándar dividido en 2 mitades con administración de reloj por oficiales.
                      </dd>
                    </div>
                    <div class="flex items-start justify-between gap-3">
                      <dt class="font-semibold text-slate-100">Estilo de juego</dt>
                      <dd class="text-right">
                        Sin contacto: sin bloqueos ni tacleos. La jugada termina al quitar el flag o salir del campo.
                      </dd>
                    </div>
                  </dl>

                  <div class="mt-3 rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-3 text-[11px] text-slate-300 space-y-1.5">
                    <p class="font-semibold text-slate-100">Tip para capitanes</p>
                    <p>
                      Antes del primer juego, comparte este resumen y el PDF completo en el chat de tu equipo. Así todos llegan con el mismo
                      entendimiento del reglamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
      </div>

      <!-- FOOTER / UBICACIÓN -->
      <div class="mt-14 bg-[#E0E7FF]">
        <div class="max-w-6xl mx-auto container-pad px-6 py-10">
          <div class="grid md:grid-cols-5 gap-6 items-start">
            <div class="md:col-span-2 space-y-2">
<<<<<<< HEAD
              <h2 class="font-display text-2xl font-extrabold text-slate-900">Ubicación</h2>
              <p class="opacity-95 text-slate-800">Deportivo Miguel Alemán</p>
=======
              <h2 class="font-display text-2xl font-extrabold text-slate-900">
                Ubicación
              </h2>
              <p class="opacity-95 text-slate-800">
                Deportivo Miguel Alemán
              </p>
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
              <p class="text-sm opacity-90 text-slate-700">
                Lindavista S/N, Gustavo A. Madero, CDMX
              </p>
              <a
                class="inline-flex items-center gap-2 mt-3 rounded-xl px-3 py-2 text-sm bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                href="https://www.google.com/maps?q=deportivo%20miguel%20alem%C3%A1n&output=embed"
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
                  src="https://www.google.com/maps?q=deportivo%20miguel%20alem%C3%A1n&output=embed"
                  style="border:0"
                  loading="lazy"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

<<<<<<< HEAD
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
/**
 * Soporta camelCase y snake_case para que “se vea” aunque tu back esté mezclado.
 * (Aun así, abajo te dejo cómo ajustar el back bien con filtros.)
 */
type ApiStandingAny = Partial<{
  // snake_case
=======
/* ========= BACKEND (/points) ========= */
interface ApiStanding {
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
  standing_id: number
  season_id: number
  category_id: number
  team_id: number
  points_for: number
  points_against: number
  table_points: number
  team_name: string

  // camelCase
  standingId: number
  seasonId: number
  categoryId: number
  teamId: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  teamName: string

  // filtros (ideal que el back lo mande)
  gender: string
  categoryCode: string

  // comunes
  gp: number
  wins: number
  losses: number
  draws: number
}>

/* Fetch reactivo por filtros */
const { data: standings, pending, error, refresh } = useApi<ApiStandingAny[]>(pointsUrl)

interface StandingRow {
  rank: number
  teamName: string
  gamesPlayed: number
  wins: number
  goalsFor: number
  points: number
}

<<<<<<< HEAD
=======
const config = useRuntimeConfig()
const apiBase = (config.public?.apiBase || '').toString()

// 👇 Ya no dependemos de useApi. Esto evita el pedo de imports/alias.
const { data: standings, pending, error } = await useFetch<ApiStanding[]>('/points', {
  baseURL: apiBase,
  key: 'home-standings',
})

>>>>>>> 529f021 (Cambios admin partidos + ajustes)
const topPositions = computed<StandingRow[]>(() => {
  const raw = standings.value
  if (!Array.isArray(raw)) return []
<<<<<<< HEAD
  const rows = raw as ApiStandingAny[]

  const toNum = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)
=======
>>>>>>> 529f021 (Cambios admin partidos + ajustes)

  return raw
    .slice()
    .sort((a, b) => {
<<<<<<< HEAD
      const aPts = toNum(a.table_points ?? a.tablePoints)
      const bPts = toNum(b.table_points ?? b.tablePoints)
      if (bPts !== aPts) return bPts - aPts

      const aFor = toNum(a.points_for ?? a.pointsFor)
      const bFor = toNum(b.points_for ?? b.pointsFor)
      return bFor - aFor
=======
      if ((b.table_points ?? 0) !== (a.table_points ?? 0)) {
        return (b.table_points ?? 0) - (a.table_points ?? 0)
      }
      return (b.points_for ?? 0) - (a.points_for ?? 0)
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
    })
    .slice(0, 5)
    .map((row, idx) => ({
      rank: idx + 1,
      teamName: (row.team_name ?? row.teamName ?? '—') as string,
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

/* ========= HERO CARRUSEL ========= */
interface HeroSlide {
  id: string
  src: string
}

const heroSlides = ref<HeroSlide[]>([
<<<<<<< HEAD
  { id: 'slide-1', src: '/img/sponsors/foto_1.jpg' }
=======
  { id: 'slide-1', src: '/img/sponsors/foto-1.png' },
  // Si tienes más imágenes, agrégalas así:
  // { id: 'slide-2', src: '/img/sponsors/foto-2.png' },
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
])

const currentSlide = ref(0)
const currentSlideSrc = computed(() => heroSlides.value[currentSlide.value]?.src ?? '')

let intervalId: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
<<<<<<< HEAD
  if (heroSlides.value.length === 0) return
=======
  if (!heroSlides.value.length) return
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
  currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < heroSlides.value.length) {
    currentSlide.value = index
  }
}

onMounted(() => {
  if (heroSlides.value.length > 1) {
    intervalId = setInterval(nextSlide, 7000)
  }
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})

/* ========= PATROCINADORES ========= */
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
    description:
      'Dicass acompaña a jugadores y familias con activaciones, alimentos y experiencias dentro del deportivo.',
    url: 'https://dicass.com.mx/',
<<<<<<< HEAD
    label: 'Patrocinador principal'
  }
])

const activeSponsorIndex = ref(0)
const activeSponsor = computed<Sponsor>(() => sponsors.value[activeSponsorIndex.value]!)
=======
    label: 'Patrocinador principal',
  },
  {
    id: 'marti',
    name: 'Martí',
    // ✅ FIX: te faltaba la extensión
    logo: '/img/sponsors/marti-logopng.png',
    tagline: 'Todo para vivir el deporte.',
    description:
      'Martí equipa a la liga con uniformes, tenis y artículos deportivos para cada jornada.',
    url: 'https://www.marti.mx/',
    label: 'Aliado deportivo',
  },
  {
    id: 'ruffles',
    name: 'Ruffles',
    logo: '/img/sponsors/ruffles-logo.png',
    tagline: 'La botana oficial del tocho.',
    description:
      'Ruffles está presente en las gradas y sidelines con las papas oficiales de la liga.',
    url: 'https://www.ruffles.com.mx/lmx/',
    label: 'Patrocinador oficial',
  },
  // Si no tienes logos de estos todavía, puedes borrarlos sin pedo:
  {
    id: 'under-armour',
    name: 'Under Armour',
    logo: '/img/sponsors/underarmour-logo.png',
    tagline: 'Rendimiento para cada jugada.',
    description:
      'Under Armour impulsa a los atletas de Tochero5Liga con prendas de alto rendimiento dentro y fuera del campo.',
    url: 'https://www.underarmour.com.mx/es-mx/',
    label: 'Aliado de alto rendimiento',
  },
  {
    id: 'blitz',
    name: 'Blitz',
    logo: '/img/sponsors/blitz-logo.png',
    tagline: 'Equipamiento listo para el impacto.',
    description:
      'Blitz apoya con equipamiento especializado para proteger y potenciar a los jugadores en cada snap.',
    url: 'https://blitz.com',
    label: 'Patrocinador técnico',
  },
  {
    id: 'medimex',
    name: 'Medimex',
    logo: '/img/sponsors/medimex-logo.png',
    tagline: 'Salud y prevención al servicio del deporte.',
    description:
      'Medimex cuida a jugadores y familias con servicios de salud y prevención durante la temporada.',
    url: 'https://medimexsalud.com/',
    label: 'Aliado en salud',
  },
  {
    id: 'prostandard',
    name: 'Pro Standard',
    logo: '/img/sponsors/prostandard-logo.png',
    tagline: 'Estilo y nivel profesional en cada prenda.',
    description:
      'Pro Standard viste a la comunidad de Tochero5Liga con ropa inspirada en el deporte profesional.',
    url: 'https://teamprostandard.mx/',
    label: 'Marca de estilo oficial',
  },
])

const activeSponsorIndex = ref(0)
const activeSponsor = computed<Sponsor>(() => sponsors.value[activeSponsorIndex.value] || sponsors.value[0])
>>>>>>> 529f021 (Cambios admin partidos + ajustes)

const setActiveSponsor = (idx: number) => {
  if (idx < 0 || idx >= sponsors.value.length) return
  activeSponsorIndex.value = idx
}

<<<<<<< HEAD
=======
const nextSponsor = () => {
  if (!sponsors.value.length) return
  activeSponsorIndex.value = (activeSponsorIndex.value + 1) % sponsors.value.length
}

const prevSponsor = () => {
  if (!sponsors.value.length) return
  activeSponsorIndex.value = (activeSponsorIndex.value - 1 + sponsors.value.length) % sponsors.value.length
}

/* ========= REGLAMENTO ========= */
interface RuleSection {
  id: string
  title: string
  subtitle: string
  bullets: string[]
}

const defaultRule: RuleSection = {
  id: 'default',
  title: 'Reglamento',
  subtitle: 'Resumen',
  bullets: [],
}

const ruleSections = ref<RuleSection[]>([
  {
    id: 'formato',
    title: 'Formato de juego',
    subtitle: 'Equipos, plantel y objetivo',
    bullets: [
      'Partidos 5 vs 5 en campo de flag; siempre hay ofensiva y defensiva claras.',
      'Se recomienda plantel amplio para rotar durante la temporada.',
      'Objetivo: avanzar el balón para cruzar la línea de gol rival y sumar más puntos.',
    ],
  },
  {
    id: 'campo-tiempo',
    title: 'Campo y tiempo',
    subtitle: 'Cómo se juega cada partido',
    bullets: [
      'Campo con zonas de anotación en cada extremo y marca de mediocampo.',
      'Partido dividido en dos mitades con reloj controlado por oficiales.',
      'El reloj puede detenerse en situaciones clave (anotaciones, tiempos fuera, cambios de posesión).',
    ],
  },
  {
    id: 'equipamiento',
    title: 'Equipamiento',
    subtitle: 'Qué es obligatorio y qué está prohibido',
    bullets: [
      'Cinturón de flags visible y jersey por dentro del short.',
      'Se recomienda calzado adecuado y uso de protector bucal.',
      'No se permiten objetos peligrosos (joyería expuesta, accesorios duros o puntiagudos).',
    ],
  },
  {
    id: 'conducta',
    title: 'Conducta y castigos',
    subtitle: 'Juego limpio',
    bullets: [
      'Sin contacto: no hay bloqueos ni tacleos; la jugada termina al quitar el flag o salir.',
      'Se sanciona contacto ilegal, protección intencional del flag y acciones antideportivas.',
      'Capitanes: responsables de hablar con oficiales y mantener el control del equipo.',
    ],
  },
])

const activeRuleId = ref<string>(ruleSections.value[0]?.id ?? defaultRule.id)

const activeRule = computed<RuleSection>(() => {
  return ruleSections.value.find((s) => s.id === activeRuleId.value) ?? defaultRule
})

const setActiveRule = (id: string) => {
  if (id === activeRuleId.value) return
  if (!ruleSections.value.some((s) => s.id === id)) return
  activeRuleId.value = id
}

/* ========= LIFECYCLE ========= */
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
let sponsorsIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (sponsors.value.length > 1) {
<<<<<<< HEAD
    sponsorsIntervalId = setInterval(() => {
      activeSponsorIndex.value = (activeSponsorIndex.value + 1) % sponsors.value.length
    }, 9000)
=======
    sponsorsIntervalId = setInterval(nextSponsor, 9000)
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
  }
})

onBeforeUnmount(() => {
<<<<<<< HEAD
=======
  if (heroIntervalId) clearInterval(heroIntervalId)
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
  if (sponsorsIntervalId) clearInterval(sponsorsIntervalId)
})
</script>

<style scoped>
.carousel-arrow {
  height: 36px;
  width: 36px;
  border-radius: 9999px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}
.carousel-arrow:hover {
  background: rgba(241, 245, 249, 1);
}
.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  transition: transform 150ms ease, width 150ms ease;
}
.carousel-dot--active {
  transform: scale(1.05);
}
</style>
