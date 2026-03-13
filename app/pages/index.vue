<template>
  <main class="min-h-screen text-slate-50">
    <!-- BG principal -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <!-- Base oscura -->
      <div class="absolute inset-0 bg-[#050816]" />

      <!-- Glow verde -->
      <div
        class="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_28%,rgba(16,185,129,0.20),transparent_58%)]"
      />

      <!-- Glow naranja -->
      <div
        class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_85%,rgba(251,146,60,0.14),transparent_55%)]"
      />

      <!-- Logo Tochero5 de fondo -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          :src="logoBg"
          alt=""
          aria-hidden="true"
          class="h-[360px] w-[360px] object-contain opacity-[0.38] mix-blend-screen brightness-[1.6] contrast-[1.15] sm:h-[480px] sm:w-[480px] md:h-[620px] md:w-[620px] lg:h-[760px] lg:w-[760px]"
        />
      </div>

      <!-- Viñeta más suave -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.72) 100%);"
      />

      <!-- Gradiente vertical suave -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#050816]" />
    </div>

    <!-- HEADER -->
    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/25 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40"
          >
            <span class="text-sm font-extrabold tracking-tight text-emerald-300">T5</span>
          </div>
          <span class="text-sm font-semibold text-slate-200">
            Tochero<span class="text-emerald-300">5</span>Liga
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
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

        <!-- Mobile -->
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

      <!-- Mobile panel -->
      <div v-if="mobileOpen" class="border-t border-white/5 bg-black/60 backdrop-blur-xl md:hidden">
        <div class="mx-auto max-w-6xl px-4 py-3 sm:px-6">
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

          <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-300">
            <div><span class="font-bold text-white">{{ teamsTotal }}</span> <span class="opacity-75">Equipos</span></div>
            <div><span class="font-bold text-white">{{ gamesSeason }}</span> <span class="opacity-75">Partidos</span></div>
            <div><span class="font-bold text-white">{{ season }}</span> <span class="opacity-75">Temporada</span></div>
          </div>

          <div class="mt-14 flex flex-col items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-400">
            <span>SCROLL</span>
            <div class="relative h-10 w-[2px] rounded-full bg-white/15">
              <div class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RESUMEN -->
    <section class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Resumen de temporada</p>

        <div class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.35)] text-center">
            <div class="text-5xl font-extrabold text-white">{{ teamsTotal }}</div>
            <div class="mt-3 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-300">EQUIPOS TOTALES</div>
            <div class="mt-2 text-sm text-slate-400">Domingo + Jueves</div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.35)] text-center">
            <div class="text-5xl font-extrabold text-white">{{ gamesSeason }}</div>
            <div class="mt-3 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-300">PARTIDOS POR TEMPORADA</div>
            <div class="mt-2 text-sm text-slate-400">{{ rounds }} Jornadas</div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.35)] text-center">
            <div class="text-5xl font-extrabold text-white">{{ season }}</div>
            <div class="mt-3 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-300">TEMPORADA ACTUAL</div>
            <div class="mt-2 text-sm text-slate-400">En curso</div>
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
              <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-200">
                <span class="h-2 w-2 rounded-full bg-sky-300" />
                PROFESIONAL
              </div>

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
              <div class="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-200">
                <span class="h-2 w-2 rounded-full bg-orange-300" />
                DESARROLLO
              </div>

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
              v-for="opt in filters"
              :key="opt.value"
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="matchFilter === opt.value
                ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="matchFilter = opt.value"
            >
              {{ opt.label }}
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
              v-for="m in filteredMatches"
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
                  <span class="h-2 w-2 rounded-full" :class="m.league === 'domingo' ? 'bg-emerald-300' : 'bg-amber-300'" />
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
          </template>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="rounded-[34px] border border-white/10 bg-white/5 px-8 py-14 text-center shadow-[0_26px_110px_rgba(0,0,0,0.45)]">
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">TEMPORADA {{ season }}</p>
          <h3 class="mt-4 text-4xl font-extrabold text-white">La competencia te espera</h3>
          <p class="mt-4 mx-auto max-w-2xl text-sm leading-7 text-slate-400">
            Dos ligas, un mismo espíritu competitivo. Elige tu camino y vive la emoción del flag football.
          </p>

          <div class="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <NuxtLink
              to="/domingo"
              class="rounded-full bg-emerald-300 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-slate-900 hover:brightness-105 transition"
            >
              IR A LIGA DOMINICAL →
            </NuxtLink>
            <NuxtLink
              to="/jueves"
              class="rounded-full border border-white/12 bg-black/25 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-white hover:bg-black/35 transition"
            >
              IR A LIGA NOCTURNA (JUEVES) →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer id="contacto" class="border-t border-white/5 py-10">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40">
              <span class="text-sm font-extrabold tracking-tight text-emerald-300">T5</span>
            </div>
            <div class="text-sm text-slate-300">
              <div class="font-semibold text-slate-200">Temporada {{ season }}</div>
              <div class="text-xs text-slate-500">Portal central</div>
            </div>
          </div>

          <a
            href="https://www.instagram.com/tochero5liga"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
          >
            INSTAGRAM @TOCHERO5LIGA
          </a>

          <div class="text-xs text-slate-500">
            © {{ season }} Tochero5Liga. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  </main>
  <ChatWidget/>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "#imports";

definePageMeta({ layout: false });

const season = 2026;
const teamsTotal = 26;
const gamesSeason = 52;
const rounds = 18;

// Logo de fondo
const logoBg = "/img/sponsors/Tochero5.JPG";

const domingoBg = "/img/liga-domingo.png";
const juevesBg = "/img/liga-jueves.png";

const mobileOpen = ref(false);

// Nav highlight por scroll
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

/** UI Match */
type Match = {
  id: string;
  league: "domingo" | "jueves";
  leagueLabel: string;
  date: string;
  time: string;
  home: string;
  away: string;
};

const filters = [
  { label: "TODOS", value: "all" },
  { label: "DOMINGO", value: "domingo" },
  { label: "JUEVES", value: "jueves" },
] as const;

const matchFilter = ref<"all" | "domingo" | "jueves">("all");

const fallbackMatches: Match[] = [
  { id: "m1", league: "domingo", leagueLabel: "DOMINGO", date: "20 Mar", time: "19:00", home: "Águilas Doradas", away: "Tigres del Norte" },
  { id: "m2", league: "jueves", leagueLabel: "JUEVES", date: "20 Mar", time: "16:00", home: "Guerreros Unidos", away: "Titanes del Sur" },
  { id: "m3", league: "domingo", leagueLabel: "DOMINGO", date: "21 Mar", time: "20:30", home: "Leones Salvajes", away: "Halcones Negros" },
  { id: "m4", league: "jueves", leagueLabel: "JUEVES", date: "21 Mar", time: "17:30", home: "Vikingos Azules", away: "Espartanos Rojos" },
];

function fmtDateMX(dt: any) {
  const d = dt ? new Date(dt) : new Date();
  const date = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
  })
    .format(d)
    .replace(".", "");
  const time = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { date, time };
}

function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function normalizeLeague(v: any): "domingo" | "jueves" | null {
  const s = String(v ?? "").toLowerCase();
  if (!s) return null;
  if (s.includes("jueves") || s.includes("thu") || s.includes("thursday")) return "jueves";
  if (s.includes("domingo") || s.includes("sun") || s.includes("sunday")) return "domingo";
  return null;
}

function toUiMatch(g: any): Match {
  const home = pick(g, ["homeTeam.name", "home_team.name", "homeName", "localTeam.name", "teamHome.name"]) || "Local";
  const away = pick(g, ["awayTeam.name", "away_team.name", "awayName", "visitorTeam.name", "teamAway.name"]) || "Visitante";
  const dt = pick(g, ["startTime", "dateTime", "kickoff", "gameDate", "date"]) || new Date().toISOString();

  const leagueRaw =
    pick(g, ["league", "leagueKey", "category.name", "category.slug", "categoryName", "division.name", "season.name"]) || "";
  const league = normalizeLeague(leagueRaw) || "domingo";

  const { date, time } = fmtDateMX(dt);

  return {
    id: String(pick(g, ["id", "gameId"]) ?? `${league}-${dt}-${home}-${away}`),
    league,
    leagueLabel: league.toUpperCase(),
    date,
    time,
    home,
    away,
  };
}

const { data: apiMatches, pending: matchesPending, error: matchesError } = await useAsyncData(
  "home-upcoming",
  async () => {
    const raw = await $fetch<any>("/api/t5/games", {
      query: { status: "SCHEDULED", limit: 20, sort: "startTime,asc" },
    });

    const list = Array.isArray(raw) ? raw : raw?.content || raw?.items || [];
    return (list || []).map(toUiMatch) as Match[];
  },
  { server: true }
);

const matches = computed<Match[]>(() => {
  if (matchesError.value) return fallbackMatches;
  return apiMatches.value ?? [];
});

const filteredMatches = computed(() => {
  const arr = matches.value;
  if (matchFilter.value === "all") return arr;
  return arr.filter((m) => m.league === matchFilter.value);
});
</script>