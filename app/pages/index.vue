<template>
  <main class="min-h-screen text-slate-50">
    <!-- BG principal -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-[#050816]" />

      <div
        class="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_28%,rgba(16,185,129,0.20),transparent_58%)]"
      />

      <div
        class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_85%,rgba(251,146,60,0.14),transparent_55%)]"
      />

      <!-- Logo Tochero5 de fondo general -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          :src="logoBg"
          alt=""
          aria-hidden="true"
          class="h-[420px] w-[420px] object-contain opacity-[0.14] mix-blend-screen brightness-[1.55] contrast-[1.12] sm:h-[560px] sm:w-[560px] md:h-[720px] md:w-[720px] lg:h-[900px] lg:w-[900px]"
        />
      </div>

      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.10)_45%,rgba(5,8,22,0.40)_100%)]" />

      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.72) 100%);"
      />

      <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#050816]" />
    </div>

    <!-- HEADER -->
    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/25 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NuxtLink to="/" class="group flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition group-hover:border-emerald-300/30 group-hover:bg-black/55"
          >
            <img :src="brandLogo" alt="Tochero5" class="h-8 w-8 object-contain" />
          </div>

          <span class="text-sm font-semibold text-slate-200">
            Tochero<span class="text-emerald-300">5</span>Liga
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex">
          <button
            type="button"
            class="group relative text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
            :class="activeNav === 'inicio' ? 'text-white' : ''"
            @click="scrollTo('inicio')"
          >
            INICIO
            <span
              class="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-emerald-300 transition group-hover:scale-x-100"
              :class="activeNav === 'inicio' ? 'scale-x-100' : ''"
            />
          </button>

          <NuxtLink
            to="/domingo"
            class="group relative text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
          >
            LIGA DE DOMINGO
            <span
              class="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-emerald-300/70 transition group-hover:scale-x-100"
            />
          </NuxtLink>

          <NuxtLink
            to="/jueves"
            class="group relative text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
          >
            LIGA DE JUEVES
            <span
              class="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-emerald-300/70 transition group-hover:scale-x-100"
            />
          </NuxtLink>

          <button
            type="button"
            class="group relative text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
            :class="activeNav === 'contacto' ? 'text-white' : ''"
            @click="scrollTo('contacto')"
          >
            CONTÁCTANOS
            <span
              class="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-emerald-300 transition group-hover:scale-x-100"
              :class="activeNav === 'contacto' ? 'scale-x-100' : ''"
            />
          </button>
        </nav>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/40 p-2 text-slate-200 md:hidden"
          :aria-expanded="mobileOpen ? 'true' : 'false'"
          aria-label="Abrir menú"
          @click="mobileOpen = !mobileOpen"
        >
          <svg
            v-if="!mobileOpen"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div v-if="mobileOpen" class="border-t border-white/5 bg-black/60 backdrop-blur-xl md:hidden">
        <div class="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div class="mb-3 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
            <div
              class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40"
            >
              <img :src="brandLogo" alt="Tochero5" class="h-8 w-8 object-contain" />
            </div>
            <span class="text-sm font-semibold text-slate-200">
              Tochero<span class="text-emerald-300">5</span>Liga
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <button
              class="rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 hover:bg-white/5"
              @click="scrollTo('inicio'); mobileOpen=false"
            >
              INICIO
            </button>
            <NuxtLink
              to="/domingo"
              class="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 hover:bg-white/5"
              @click="mobileOpen=false"
            >
              LIGA DE DOMINGO
            </NuxtLink>
            <NuxtLink
              to="/jueves"
              class="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 hover:bg-white/5"
              @click="mobileOpen=false"
            >
              LIGA DE JUEVES
            </NuxtLink>
            <button
              class="rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 hover:bg-white/5"
              @click="scrollTo('contacto'); mobileOpen=false"
            >
              CONTÁCTANOS
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section id="inicio" class="relative pt-24 md:pt-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="min-h-[72vh] py-10 md:py-14 flex flex-col items-center justify-center text-center">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-300" />
            <span>TEMPORADA {{ season }} ACTIVA</span>
          </div>

          <h1 class="mt-6 font-extrabold leading-[0.95] tracking-tight">
            <span class="block text-4xl sm:text-5xl md:text-7xl text-white">Donde se vive la liga</span>
            <span class="mt-2 block text-4xl sm:text-5xl md:text-7xl text-emerald-300">Tochero5</span>
          </h1>

          <p class="mt-6 max-w-2xl text-sm sm:text-base text-slate-300">
            Elige cuál liga quieres ver: la Liga de Dominical o la Liga nocturna (jueves)
          </p>

          <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink
              to="/domingo"
              class="group inline-flex items-center justify-center gap-3 rounded-full bg-emerald-300 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-slate-900 shadow-[0_18px_60px_rgba(16,185,129,0.25)] hover:brightness-105 transition"
            >
              <span class="h-2 w-2 rounded-full bg-slate-900/80" />
              LIGA DOMINICAL
              <span class="transition-transform group-hover:translate-x-0.5">→</span>
            </NuxtLink>

            <NuxtLink
              to="/jueves"
              class="group inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-black/25 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-white hover:bg-black/35 transition"
            >
              <span class="h-2 w-2 rounded-full bg-amber-300" />
              LIGA NOCTURNA (JUEVES)
              <span class="transition-transform group-hover:translate-x-0.5">→</span>
            </NuxtLink>
          </div>

          

          <div class="mt-14 flex flex-col items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-400">
            
            <div class="relative h-10 w-[2px] rounded-full bg-white/15">
              <div class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NUESTRAS LIGAS -->
    <section id="ligas" class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">NUESTRAS LIGAS</p>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <NuxtLink
            to="/domingo"
            class="group relative overflow-hidden rounded-[28px] border bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.40)]"
            :class="['border-sky-400/20 hover:border-sky-400/35']"
          >
            <div class="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_35%_20%,rgba(56,189,248,0.22),transparent_55%)]" />
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(56,189,248,0.12),transparent_60%)]" />

            <div class="relative bg-black/20">
              <div class="h-[360px] w-full">
                <img :src="domingoBg" alt="Liga de Domingo" class="h-full w-full object-contain" />
              </div>
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div class="relative p-8 md:p-10">
              

              <h3 class="mt-4 text-3xl font-extrabold text-white">Liga Dominical</h3>
              <p class="mt-3 max-w-md text-sm text-slate-300">
                Competencia de élite. Equipos consolidados, intensidad y el mejor ambiente cada domingo.
              </p>

              <div class="mt-8 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-slate-200 opacity-80 group-hover:opacity-100 transition">
                EXPLORAR <span class="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/jueves"
            class="group relative overflow-hidden rounded-[28px] border bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.40)]"
            :class="['border-orange-400/20 hover:border-orange-400/35']"
          >
            <div class="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_35%_20%,rgba(251,146,60,0.22),transparent_55%)]" />
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(251,146,60,0.12),transparent_60%)]" />

            <div class="relative bg-black/20">
              <div class="h-[360px] w-full">
                <img :src="juevesBg" alt="Liga de Jueves" class="h-full w-full object-contain" />
              </div>
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div class="relative p-8 md:p-10">
              

              <h3 class="mt-4 text-3xl font-extrabold text-white">Liga Nocturna (Jueves)</h3>
              <p class="mt-3 max-w-md text-sm text-slate-300">
                Talento en crecimiento, ritmo dinámico y una liga diseñada para competir y desarrollarse.
              </p>

              <div class="mt-8 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-slate-200 opacity-80 group-hover:opacity-100 transition">
                EXPLORAR <span class="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- PRÓXIMOS ENCUENTROS -->
    <section class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex items-center gap-4">
              <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
              <p class="text-xs uppercase tracking-[0.22em] text-slate-400">PRÓXIMOS ENCUENTROS</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="selectedLeague === 'domingo'
                ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="toggleLeague('domingo')"
            >
              DOMINGO
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="selectedLeague === 'jueves'
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="toggleLeague('jueves')"
            >
              JUEVES
            </button>
          </div>
        </div>

        <div class="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
          <div v-if="matchesPending" class="px-6 py-6 text-sm text-slate-400">
            Cargando próximos encuentros...
          </div>

          <div v-else-if="matchesError" class="px-6 py-6 text-sm text-rose-200">
            No se pudieron cargar desde el backend. Mostrando datos de ejemplo.
          </div>

          <template v-else>
            <div
              v-for="m in paginatedFilteredMatches"
              :key="m.id"
              class="flex flex-col gap-3 border-b border-white/5 px-6 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div class="flex items-center gap-4">
                <div
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em]"
                  :class="m.league === 'domingo'
                    ? 'bg-emerald-300/12 text-emerald-200'
                    : 'bg-amber-300/12 text-amber-200'"
                >
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="m.league === 'domingo' ? 'bg-emerald-300' : 'bg-amber-300'"
                  />
                  {{ m.leagueLabel }}
                </div>

                <div class="text-sm text-slate-300">
                  <div class="font-semibold text-white">{{ m.date }}</div>
                  <div class="text-xs text-slate-400">{{ m.time }}</div>
                </div>
              </div>

              <div class="flex-1 text-center text-base font-bold text-white">
                {{ m.home }} <span class="mx-3 text-slate-500">vs</span> {{ m.away }}
              </div>

              <div class="flex justify-end text-slate-400">›</div>
            </div>

            <div v-if="filteredMatches.length === 0" class="px-6 py-6 text-sm text-slate-400">
              No hay próximos encuentros para este filtro.
            </div>

            <div
              v-if="filteredMatches.length > 0"
              class="flex flex-col gap-3 border-t border-white/5 px-6 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div class="text-sm text-slate-400">
                Mostrando
                <span class="font-semibold text-white">{{ matchRangeStart }}</span>
                -
                <span class="font-semibold text-white">{{ matchRangeEnd }}</span>
                de
                <span class="font-semibold text-white">{{ filteredMatches.length }}</span>
                partidos
              </div>

              <div v-if="matchTotalPages > 1" class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
                  :class="matchPage === 1
                    ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100'"
                  :disabled="matchPage === 1"
                  @click="goToMatchPage(matchPage - 1)"
                >
                  Anterior
                </button>

                <button
                  v-for="page in visibleMatchPages"
                  :key="page"
                  type="button"
                  class="h-10 min-w-10 rounded-full border px-3 text-sm font-extrabold transition"
                  :class="page === matchPage
                    ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-slate-100'"
                  @click="goToMatchPage(page)"
                >
                  {{ page }}
                </button>

                <button
                  type="button"
                  class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
                  :class="matchPage === matchTotalPages
                    ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100'"
                  :disabled="matchPage === matchTotalPages"
                  @click="goToMatchPage(matchPage + 1)"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- PATROCINADORES -->
    <section class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">PATROCINADORES</p>
        </div>

        <div class="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] md:p-8">
          <div class="flex flex-wrap items-center justify-center gap-8 md:gap-10">
            <div v-for="s in sponsors" :key="s.id" class="flex h-24 w-40 items-center justify-center">
              <a
                v-if="s.url"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-full w-full items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
              >
                <img :src="s.logo" :alt="s.name" class="max-h-full max-w-full object-contain" />
              </a>

              <img
                v-else
                :src="s.logo"
                :alt="s.name"
                class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
        <!-- CONTACTO -->
    <section id="contacto" class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">CONTACTO</p>
        </div>

        <div class="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
          <div class="grid grid-cols-1 gap-0 md:grid-cols-2">
            <!-- Teléfono -->
            <div class="border-b border-white/5 p-8 md:border-b-0 md:border-r md:border-white/5 md:p-10">
              <div class="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-200">
                <span class="h-2 w-2 rounded-full bg-emerald-300" />
                WhatsApp / Teléfono
              </div>

              <h3 class="mt-5 text-2xl font-extrabold text-white md:text-3xl">
                Contáctanos directo
              </h3>

              <p class="mt-3 max-w-md text-sm text-slate-300">
                Escríbenos para informes, inscripción de equipos, dudas sobre partidos o detalles de la liga.
              </p>

              <a
                href="tel:5541427772"
                class="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-base font-bold text-white transition hover:border-emerald-300/30 hover:bg-black/35"
              >
                <span class="text-emerald-300">📞</span>
                55 4142 7772
              </a>
            </div>

            <!-- Instagram -->
            <div class="p-8 md:p-10">
              <div class="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-fuchsia-200">
                <span class="h-2 w-2 rounded-full bg-fuchsia-300" />
                Instagram
              </div>

              <h3 class="mt-5 text-2xl font-extrabold text-white md:text-3xl">
                Síguenos en redes
              </h3>

              <p class="mt-3 max-w-md text-sm text-slate-300">
                Mantente al tanto de noticias, partidos, contenido y actualizaciones de Tochero5.
              </p>

              <a
                href="https://www.instagram.com/tochero5liga"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-base font-bold text-white transition hover:border-fuchsia-300/30 hover:bg-black/35"
              >
                <span class="text-fuchsia-300">📷</span>
                @tochero5liga
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

        <!-- FOOTER -->
    <footer class="border-t border-white/5 py-10">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img :src="brandLogo" alt="Tochero5" class="h-8 w-8 object-contain" />
            </div>
            <div class="text-sm text-slate-300">
              <div class="font-semibold text-slate-200">Temporada {{ season }}</div>
              <div class="text-xs text-slate-500">Portal central</div>
            </div>
          </div>

          <div class="text-xs text-slate-500">
            © {{ season }} Tochero5Liga. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  </main>
  <ChatWidget />
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, useAsyncData } from "#imports";

definePageMeta({ layout: false });

const season = 2026;
const teamsTotal = 26;
const gamesSeason = 52;

const DOMINGO_LEAGUE_ID = 1;
const JUEVES_LEAGUE_ID = 2;
const MATCHES_PER_PAGE = 5;

const brandLogo = "/img/sponsors/Tochero5.JPG";
const logoBg = "/img/sponsors/Tochero5.JPG";

const domingoBg = "/img/liga-domingo.png";
const juevesBg = "/img/liga-jueves.png";

const mobileOpen = ref(false);

const sponsors = [
  { id: "dicass", name: "Dicass", logo: "/img/sponsors/dicass-logo.png", url: "https://dicass.com.mx/" },
  { id: "blitzflag", name: "BlitzFlag", logo: "/img/sponsors/blitzflag-logo.png", url: "" },
  { id: "under-armour", name: "Under Armour", logo: "/img/sponsors/underarmour-logo.png", url: "https://www.underarmour.com.mx/" },
  { id: "medimex", name: "Fundación Medimex", logo: "/img/sponsors/medimex-logo.png", url: "" },
];

const activeNav = ref<"inicio" | "ligas" | "contacto">("inicio");

function scrollTo(id: "inicio" | "ligas" | "contacto") {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onScroll() {
  const y = window.scrollY || 0;
  const ligasTop = document.getElementById("ligas")?.offsetTop ?? 999999;
  const contactoTop = document.getElementById("contacto")?.offsetTop ?? 999999;

  if (y + 160 >= contactoTop) activeNav.value = "contacto";
  else if (y + 160 >= ligasTop) activeNav.value = "ligas";
  else activeNav.value = "inicio";
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

type Match = {
  id: string;
  league: "domingo" | "jueves";
  leagueLabel: string;
  date: string;
  time: string;
  home: string;
  away: string;
  timestamp: number;
};

const selectedLeague = ref<null | "domingo" | "jueves">(null);
const matchPage = ref(1);

const fallbackMatches: Match[] = [
  { id: "m1", league: "domingo", leagueLabel: "DOMINGO", date: "20 Mar", time: "19:00", home: "Águilas Doradas", away: "Tigres del Norte", timestamp: 1 },
  { id: "m2", league: "jueves", leagueLabel: "JUEVES", date: "20 Mar", time: "16:00", home: "Guerreros Unidos", away: "Titanes del Sur", timestamp: 2 },
  { id: "m3", league: "domingo", leagueLabel: "DOMINGO", date: "21 Mar", time: "20:30", home: "Leones Salvajes", away: "Halcones Negros", timestamp: 3 },
  { id: "m4", league: "jueves", leagueLabel: "JUEVES", date: "21 Mar", time: "17:30", home: "Vikingos Azules", away: "Espartanos Rojos", timestamp: 4 },
  { id: "m5", league: "domingo", leagueLabel: "DOMINGO", date: "22 Mar", time: "10:00", home: "Lobos FC", away: "Panteras Elite", timestamp: 5 },
  { id: "m6", league: "jueves", leagueLabel: "JUEVES", date: "22 Mar", time: "20:30", home: "Búhos Negros", away: "Dragones", timestamp: 6 },
  { id: "m7", league: "domingo", leagueLabel: "DOMINGO", date: "23 Mar", time: "11:30", home: "Raptors", away: "Titanes", timestamp: 7 },
];

function fmtDateMX(dt: any) {
  if (!dt) {
    return { date: "Por definir", time: "Por definir" };
  }

  const parsed = new Date(dt);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "Por definir", time: "Por definir" };
  }

  const date = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
  })
    .format(parsed)
    .replace(".", "");

  const time = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);

  return { date, time };
}

function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function toList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

function getTimestamp(raw: any) {
  const dt =
    pick(raw, [
      "matchDateUtc",
      "match_date_utc",
      "gameStatus.matchDateUtc",
      "gameStatus.match_date_utc",
      "status.matchDateUtc",
      "status.match_date_utc",
      "startTime",
      "start_time",
      "dateTime",
      "date_time",
      "kickoff",
      "gameDate",
      "game_date",
      "date",
      "scheduledAt",
      "scheduled_at",
      "fecha",
      "fechaHora",
      "fecha_hora",
    ]);

  if (!dt) return Number.MAX_SAFE_INTEGER;

  const parsed = new Date(String(dt)).getTime();
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function toUiMatch(g: any, league: "domingo" | "jueves"): Match {
  const home =
    pick(g, [
      "homeTeam.name",
      "home_team.name",
      "homeName",
      "localTeam.name",
      "teamHome.name",
      "home.name",
      "home_team",
    ]) || "Local";

  const away =
    pick(g, [
      "awayTeam.name",
      "away_team.name",
      "awayName",
      "visitorTeam.name",
      "teamAway.name",
      "away.name",
      "away_team",
    ]) || "Visitante";

  const dt =
    pick(g, [
      "matchDateUtc",
      "match_date_utc",
      "gameStatus.matchDateUtc",
      "gameStatus.match_date_utc",
      "status.matchDateUtc",
      "status.match_date_utc",
      "startTime",
      "start_time",
      "dateTime",
      "date_time",
      "kickoff",
      "gameDate",
      "game_date",
      "date",
      "scheduledAt",
      "scheduled_at",
      "fecha",
      "fechaHora",
      "fecha_hora",
    ]);

  const { date, time } = fmtDateMX(dt);

  return {
    id: String(pick(g, ["id", "gameId", "game_id"]) ?? `${league}-${dt}-${home}-${away}`),
    league,
    leagueLabel: league.toUpperCase(),
    date,
    time,
    home,
    away,
    timestamp: getTimestamp(g),
  };
}

const { data: apiMatches, pending: matchesPending, error: matchesError } = await useAsyncData(
  "home-upcoming-split",
  async () => {
    const [domingoRaw, juevesRaw] = await Promise.all([
      $fetch<any>("/api/t5/games", {
        query: { leagueId: DOMINGO_LEAGUE_ID },
      }).catch(() => []),
      $fetch<any>("/api/t5/games", {
        query: { leagueId: JUEVES_LEAGUE_ID },
      }).catch(() => []),
    ]);

    const domingoMatches = toList(domingoRaw).map((item) => toUiMatch(item, "domingo"));
    const juevesMatches = toList(juevesRaw).map((item) => toUiMatch(item, "jueves"));

    return [...domingoMatches, ...juevesMatches].sort((a, b) => a.timestamp - b.timestamp);
  },
  { server: true }
);

const matches = computed<Match[]>(() => {
  if (matchesError.value) return fallbackMatches;
  return apiMatches.value ?? [];
});

const filteredMatches = computed(() => {
  if (!selectedLeague.value) return matches.value;
  return matches.value.filter((m) => m.league === selectedLeague.value);
});

const matchTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredMatches.value.length / MATCHES_PER_PAGE));
});

const matchRangeStart = computed(() => {
  if (!filteredMatches.value.length) return 0;
  return (matchPage.value - 1) * MATCHES_PER_PAGE + 1;
});

const matchRangeEnd = computed(() => {
  return Math.min(matchPage.value * MATCHES_PER_PAGE, filteredMatches.value.length);
});

const paginatedFilteredMatches = computed(() => {
  const start = (matchPage.value - 1) * MATCHES_PER_PAGE;
  return filteredMatches.value.slice(start, start + MATCHES_PER_PAGE);
});

const visibleMatchPages = computed<number[]>(() => {
  const total = matchTotalPages.value;
  const current = matchPage.value;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  if (current <= 3) {
    start = 1;
    end = 5;
  }

  if (current >= total - 2) {
    start = total - 4;
    end = total;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

watch([selectedLeague, matches], () => {
  matchPage.value = 1;
});

watch(matchTotalPages, (pages) => {
  if (matchPage.value > pages) matchPage.value = pages;
});

function goToMatchPage(page: number) {
  matchPage.value = Math.min(Math.max(page, 1), matchTotalPages.value);
}

function toggleLeague(league: "domingo" | "jueves") {
  selectedLeague.value = selectedLeague.value === league ? null : league;
}
</script>
