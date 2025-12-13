<template>
    <main class="bg-slate-950 min-h-screen text-slate-50">
      <section class="pt-24 md:pt-28 lg:pt-32">
        <div class="max-w-6xl mx-auto px-6">
          <!-- HEADER -->
          <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div class="space-y-2">
              <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Tochero5 · Calendario oficial
              </p>
              <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
                Partidos de la temporada
              </h1>
              <p class="text-sm text-slate-300 max-w-xl">
                Consulta los próximos encuentros, resultados finales y el detalle de
                cada partido por categoría y rama.
              </p>
            </div>
  
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition"
            >
              ← Volver al inicio
            </NuxtLink>
          </header>
  
          <!-- FILTROS -->
          <section
            class="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 md:px-5 md:py-4 shadow-[0_18px_45px_rgba(15,23,42,0.85)]"
          >
            <div class="flex flex-wrap items-center gap-3 md:gap-4">
              <!-- Jornada -->
              <div class="space-y-1">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Jornada
                </p>
                <div
                  class="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200"
                >
                  <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                  <span class="font-medium">Jornada 3</span>
                  <span class="text-slate-500">·</span>
                  <button
                    type="button"
                    class="text-[11px] text-blue-300 hover:text-blue-200 underline underline-offset-2"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
  
              <!-- Categoría -->
              <div class="space-y-1">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Categoría
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-blue-500/70 bg-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-100"
                  >
                    +35
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500"
                  >
                    U-16
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
  
              <!-- Rama -->
              <div class="space-y-1">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Rama
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-emerald-500/70 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-100"
                  >
                    Mixto
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500"
                  >
                    Femenil
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500"
                  >
                    Varonil
                  </button>
                </div>
              </div>
  
              <!-- Estado -->
              <div class="space-y-1">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Estado
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500"
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-amber-500/70 bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-100"
                  >
                    En juego
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-100"
                  >
                    Finalizado
                  </button>
                </div>
              </div>
  
              <!-- Buscador -->
              <div class="ml-auto w-full md:w-auto md:flex-1">
                <label class="sr-only">Buscar equipo</label>
                <div
                  class="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                >
                  <span class="text-slate-500">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar equipo..."
                    class="w-full bg-transparent outline-none placeholder:text-slate-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </section>
  
          <!-- LISTA DE PARTIDOS -->
          <section class="space-y-6">
            <!-- Día 1 -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span class="h-px flex-1 bg-slate-800"></span>
                <span class="uppercase tracking-[0.16em]">
                  Sábado · 18 Enero · 2025
                </span>
                <span class="h-px flex-1 bg-slate-800"></span>
              </div>
  
              <!-- Partido EN JUEGO -->
              <article
                class="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-[0_22px_60px_rgba(15,23,42,0.95)]"
              >
                <!-- Glow lateral -->
                <div
                  class="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 via-emerald-300 to-cyan-400 shadow-[0_0_35px_rgba(45,212,191,0.75)]"
                ></div>
  
                <div class="px-4 md:px-6 py-4 md:py-5">
                  <!-- Header partido -->
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2 text-[11px] text-slate-300">
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/70 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-100"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        En juego · Q3
                      </span>
                      <span class="text-slate-500">·</span>
                      <span>Campo 1</span>
                      <span class="text-slate-500">·</span>
                      <span>Jornada 3</span>
                    </div>
  
                    <div class="text-right text-[11px] text-slate-300">
                      <p class="font-semibold text-slate-100">19:30 H</p>
                      <p class="text-slate-500">Kickoff</p>
                    </div>
                  </div>
  
                  <!-- Contenido principal -->
                  <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                    <!-- Local -->
                    <div class="flex items-center gap-3">
                      <div
                        class="h-11 w-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center overflow-hidden"
                      >
                        <span class="text-[12px] font-bold text-emerald-300">T5</span>
                      </div>
                      <div class="min-w-0">
                        <p
                          class="text-sm md:text-base font-semibold text-slate-50 truncate"
                        >
                          Inges United
                        </p>
                        <p class="text-[11px] text-slate-400">
                          +35 · Mixto
                        </p>
                      </div>
                    </div>
  
                    <!-- Marcador -->
                    <div class="flex flex-col items-center justify-center min-w-[90px]">
                      <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                        Marcador
                      </p>
                      <p class="text-2xl md:text-3xl font-extrabold text-slate-50">
                        21<span class="text-slate-500 mx-1 text-lg">–</span>14
                      </p>
                      <p class="text-[11px] text-emerald-300 mt-0.5">
                        Drive en curso · 2&10
                      </p>
                    </div>
  
                    <!-- Visitante -->
                    <div class="flex items-center justify-end gap-3">
                      <div class="text-right min-w-0">
                        <p
                          class="text-sm md:text-base font-semibold text-slate-50 truncate"
                        >
                          Ranas del Sur
                        </p>
                        <p class="text-[11px] text-slate-400">
                          +35 · Mixto
                        </p>
                      </div>
                      <div
                        class="h-11 w-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center overflow-hidden"
                      >
                        <span class="text-[12px] font-bold text-cyan-300">RS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
  
              <!-- Partido PROGRAMADO -->
              <article
                class="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 md:px-6 py-4 md:py-4 hover:border-blue-500/70 hover:bg-slate-900 transition shadow-[0_18px_45px_rgba(15,23,42,0.75)]"
              >
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div class="flex items-center gap-2 text-[11px] text-slate-300">
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-blue-500/8 border border-blue-400/60 px-2.5 py-0.5 text-[10px] font-semibold text-blue-100"
                    >
                      Programado
                    </span>
                    <span class="text-slate-500">·</span>
                    <span>Campo 2</span>
                    <span class="text-slate-500">·</span>
                    <span>Jornada 3</span>
                  </div>
                  <div class="text-right text-[11px] text-slate-300">
                    <p class="font-semibold text-slate-100">20:30 H</p>
                    <p class="text-slate-500">Arranca en 45 min</p>
                  </div>
                </div>
  
                <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                  <!-- Local -->
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden"
                    >
                      <span class="text-[11px] font-bold text-amber-300">DC</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-50 truncate">
                        Diablos Coapa
                      </p>
                      <p class="text-[11px] text-slate-400">
                        U-16 · Varonil
                      </p>
                    </div>
                  </div>
  
                  <!-- Marcador vacío -->
                  <div class="flex flex-col items-center justify-center min-w-[90px]">
                    <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                      Horario
                    </p>
                    <p class="text-lg md:text-xl font-bold text-slate-50">
                      20:30
                    </p>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      A la espera de kickoff
                    </p>
                  </div>
  
                  <!-- Visitante -->
                  <div class="flex items-center justify-end gap-3">
                    <div class="text-right min-w-0">
                      <p class="text-sm font-semibold text-slate-50 truncate">
                        Coyotes Norte
                      </p>
                      <p class="text-[11px] text-slate-400">
                        U-16 · Varonil
                      </p>
                    </div>
                    <div
                      class="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden"
                    >
                      <span class="text-[11px] font-bold text-rose-300">CN</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
  
            <!-- Día 2 (ejemplo resultados finales) -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-4">
                <span class="h-px flex-1 bg-slate-800"></span>
                <span class="uppercase tracking-[0.16em]">
                  Domingo · 12 Enero · 2025
                </span>
                <span class="h-px flex-1 bg-slate-800"></span>
              </div>
  
              <!-- Partido FINALIZADO -->
              <article
                class="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 md:px-6 py-4 md:py-4 shadow-[0_14px_38px_rgba(15,23,42,0.85)]"
              >
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div class="flex items-center gap-2 text-[11px] text-slate-300">
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-emerald-500/8 border border-emerald-400/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-100"
                    >
                      Finalizado
                    </span>
                    <span class="text-slate-500">·</span>
                    <span>Campo 1</span>
                    <span class="text-slate-500">·</span>
                    <span>Jornada 2</span>
                  </div>
                  <div class="text-right text-[11px] text-slate-300">
                    <p class="font-semibold text-slate-100">18:00 H</p>
                    <p class="text-slate-500">Marcador final</p>
                  </div>
                </div>
  
                <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                  <!-- Local -->
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden"
                    >
                      <span class="text-[11px] font-bold text-sky-300">WS</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-50 truncate">
                        Warriors Sur
                      </p>
                      <p class="text-[11px] text-slate-400">
                        +35 · Mixto
                      </p>
                    </div>
                  </div>
  
                  <!-- Marcador final -->
                  <div class="flex flex-col items-center justify-center min-w-[90px]">
                    <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                      Marcador final
                    </p>
                    <p class="text-2xl md:text-3xl font-extrabold text-slate-50">
                      34<span class="text-slate-500 mx-1 text-lg">–</span>27
                    </p>
                    <p class="text-[11px] text-emerald-300 mt-0.5">
                      Ganó Warriors Sur
                    </p>
                  </div>
  
                  <!-- Visitante -->
                  <div class="flex items-center justify-end gap-3">
                    <div class="text-right min-w-0">
                      <p class="text-sm font-semibold text-slate-50 truncate">
                        Ghosts Norte
                      </p>
                      <p class="text-[11px] text-slate-400">
                        +35 · Mixto
                      </p>
                    </div>
                    <div
                      class="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden"
                    >
                      <span class="text-[11px] font-bold text-fuchsia-300">GN</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  </template>
  