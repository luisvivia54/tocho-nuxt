<!-- app/pages/jueves.vue -->
<template>
  <main class="min-h-screen text-slate-50">
    <!-- BG stadium -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-80"
        :style="{ backgroundImage: `url(${stadiumBg})` }"
      />
      <div class="absolute inset-0 bg-black/35" />
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.92) 100%);"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#050816]" />
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_55%_28%,rgba(16,185,129,0.25),transparent_58%)]" />
      <div class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_45%_28%,rgba(251,146,60,0.40),transparent_58%)]" />
    </div>

    <!-- ✅ HEADER Lovable (MISMO LOOK) pero ahora NO navega a domingo; controla tabs internas -->
    <header class="glass-header">
      <div class="section-container flex items-center justify-between h-16 md:h-[72px]">
        <!-- Logo -->
        <NuxtLink
          to="/jueves"
          class="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground"
          @click="menuOpen = false"
        >
          <span class="text-accent">T5</span>
          <span class="hidden sm:inline text-sm font-medium text-muted-foreground">Liga de Jueves</span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            type="button"
            class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
            :class="view === 'partidos' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="goInicio()"
          >
            Inicio
            <span v-if="view === 'partidos'" class="absolute bottom-0 left-1/2 -translate-x-1/2">
              <span class="block h-px w-5 bg-accent" />
            </span>
          </button>

          <button
            type="button"
            class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
            :class="view === 'partidos' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="setView('partidos')"
          >
            Partidos
            <span v-if="view === 'partidos'" class="absolute bottom-0 left-1/2 -translate-x-1/2">
              <span class="block h-px w-5 bg-accent" />
            </span>
          </button>

          <button
            type="button"
            class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
            :class="view === 'equipos' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="setView('equipos')"
          >
            Equipos
            <span v-if="view === 'equipos'" class="absolute bottom-0 left-1/2 -translate-x-1/2">
              <span class="block h-px w-5 bg-accent" />
            </span>
          </button>

          <button
            type="button"
            class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
            :class="view === 'estadisticas' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="setView('estadisticas')"
          >
            Estadísticas
            <span v-if="view === 'estadisticas'" class="absolute bottom-0 left-1/2 -translate-x-1/2">
              <span class="block h-px w-5 bg-accent" />
            </span>
          </button>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver
          </NuxtLink>

          <div class="flex items-center gap-3">
            <a
              href="https://www.instagram.com/p/DVChsjbjRg-/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground transition-colors hover:text-accent"
            >
              <Instagram :size="18" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground transition-colors hover:text-accent"
            >
              <Facebook :size="18" />
            </a>
          </div>

          <button class="md:hidden text-foreground" @click="menuOpen = !menuOpen">
            <X v-if="menuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <nav
        v-if="menuOpen"
        class="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3"
      >
        <button
          type="button"
          class="text-xs font-semibold uppercase tracking-[0.15em]"
          :class="view === 'partidos' ? 'text-accent' : 'text-muted-foreground'"
          @click="goInicio()"
        >
          Inicio
        </button>

        <button
          type="button"
          class="text-xs font-semibold uppercase tracking-[0.15em]"
          :class="view === 'partidos' ? 'text-accent' : 'text-muted-foreground'"
          @click="setView('partidos')"
        >
          Partidos
        </button>

        <button
          type="button"
          class="text-xs font-semibold uppercase tracking-[0.15em]"
          :class="view === 'equipos' ? 'text-accent' : 'text-muted-foreground'"
          @click="setView('equipos')"
        >
          Equipos
        </button>

        <button
          type="button"
          class="text-xs font-semibold uppercase tracking-[0.15em]"
          :class="view === 'estadisticas' ? 'text-accent' : 'text-muted-foreground'"
          @click="setView('estadisticas')"
        >
          Estadísticas
        </button>

        <NuxtLink
          to="/"
          class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mt-2"
          @click="menuOpen=false"
        >
          ← Volver al inicio
        </NuxtLink>
      </nav>
    </header>

    <!-- HERO -->
    <section class="pt-24 md:pt-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="py-10 md:py-12">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200"
          >
            <span class="h-2 w-2 rounded-full bg-orange-300" />
            <span>LIGA DE JUEVES · TEMPORADA {{ season }}</span>
          </div>

          <h1 class="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95] tracking-tight">
            <span class="text-white">Liga de</span>
            <span class="text-orange-300"> Jueves</span>
          </h1>

          <p class="mt-4 max-w-2xl text-sm sm:text-base text-slate-300">
            Partidos, equipos y estadísticas en tiempo real desde el backend.
          </p>

          <!-- mini stats -->
          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ teamsCount }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                Equipos (activos)
              </div>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ upcomingCount }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                Partidos (backend)
              </div>
            </div>
            <div class="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ season }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-100">
                Temporada
              </div>
            </div>
          </div>

          <!-- Tabs (INTERNAS como antes) -->
          <div class="mt-10 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="view==='partidos'
                ? 'border-orange-300/40 bg-orange-300/15 text-orange-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="view='partidos'"
            >
              Partidos
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="view==='equipos'
                ? 'border-orange-300/40 bg-orange-300/15 text-orange-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="view='equipos'"
            >
              Equipos
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition"
              :class="view==='estadisticas'
                ? 'border-orange-300/40 bg-orange-300/15 text-orange-200'
                : 'border-white/10 bg-black/20 text-slate-300 hover:bg-black/30'"
              @click="view='estadisticas'"
            >
              Estadísticas
            </button>

            <button
              type="button"
              class="ml-auto rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300 hover:bg-black/30 transition"
              @click="refreshAll"
            >
              Refrescar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="pb-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <!-- PARTIDOS -->
        <div
          v-if="view==='partidos'"
          class="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]"
        >
          <div class="px-6 py-5 border-b border-white/5">
            <div class="flex items-center gap-3">
              <div class="h-[2px] w-10 rounded-full bg-orange-300/80" />
              <p class="text-xs uppercase tracking-[0.22em] text-slate-300">Encuentros</p>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              Conectado al backend vía <code class="text-slate-300">/api/t5/games</code> y <code class="text-slate-300">/api/t5/gamesFinal</code>.
            </p>
          </div>

          <div v-if="pendingGames" class="px-6 py-6 text-sm text-slate-400">Cargando partidos...</div>

          <div v-else-if="gamesError" class="px-6 py-6 text-sm text-rose-200">
            No se pudieron cargar partidos del backend.
          </div>

          <template v-else>
            <div
              v-for="m in matches"
              :key="m.id"
              class="flex flex-col gap-3 border-b border-white/5 px-6 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div class="flex items-center gap-4">
                <div class="inline-flex items-center gap-2 rounded-full bg-orange-300/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-orange-200">
                  <span class="h-2 w-2 rounded-full bg-orange-300" />
                  JUEVES
                </div>

                <div class="text-sm text-slate-300">
                  <div class="font-semibold text-white">{{ m.date }}</div>
                  <div class="text-xs text-slate-400">{{ m.time }} <span v-if="m.venue">· {{ m.venue }}</span></div>
                </div>
              </div>

              <div class="flex-1 text-center text-base font-bold text-white">
                {{ m.home }} <span class="mx-3 text-slate-500">vs</span> {{ m.away }}
              </div>

              <div class="flex justify-end text-slate-400">›</div>
            </div>

            <div v-if="matches.length === 0" class="px-6 py-6 text-sm text-slate-400">
              No hay partidos para mostrar (el backend está regresando vacío).
            </div>
          </template>
        </div>

        <!-- EQUIPOS -->
        <div
          v-else-if="view==='equipos'"
          class="mt-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]"
        >
          <div class="px-6 py-5 border-b border-white/5">
            <div class="flex items-center gap-3">
              <div class="h-[2px] w-10 rounded-full bg-orange-300/80" />
              <p class="text-xs uppercase tracking-[0.22em] text-slate-300">Equipos</p>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              Conectado al backend (si existe) vía <code class="text-slate-300">/api/t5/teams</code>. Si viene vacío, se arma desde los partidos.
            </p>
          </div>

          <div v-if="pendingTeams" class="px-6 py-6 text-sm text-slate-400">Cargando equipos...</div>

          <div v-else-if="teamsError" class="px-6 py-6 text-sm text-rose-200">
            No se pudieron cargar equipos del backend (o el endpoint no existe).
          </div>

          <template v-else>
            <div class="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="t in teams"
                :key="t.id"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <div class="text-sm font-extrabold text-white truncate">{{ t.name }}</div>
                <div class="mt-1 text-xs text-slate-400" v-if="t.category">{{ t.category }}</div>
              </div>

              <div v-if="teams.length === 0" class="text-sm text-slate-400">
                No hay equipos para mostrar.
              </div>
            </div>
          </template>
        </div>

        <!-- ESTADÍSTICAS -->
        <div
          v-else
          class="mt-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]"
        >
          <div class="px-6 py-5 border-b border-white/5">
            <div class="flex items-center gap-3">
              <div class="h-[2px] w-10 rounded-full bg-orange-300/80" />
              <p class="text-xs uppercase tracking-[0.22em] text-slate-300">Estadísticas</p>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              Aquí conectamos standings/goleo cuando me digas los endpoints exactos.
            </p>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div class="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div class="text-3xl font-extrabold text-white">{{ teamsCount }}</div>
                <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">Equipos</div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div class="text-3xl font-extrabold text-white">{{ upcomingCount }}</div>
                <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">Partidos (backend)</div>
              </div>
              <div class="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-6">
                <div class="text-3xl font-extrabold text-white">{{ lastUpdatedLabel }}</div>
                <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-100">Última actualización</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-12 rounded-[34px] border border-white/10 bg-white/5 px-8 py-12 text-center shadow-[0_26px_110px_rgba(0,0,0,0.45)]">
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">LIGA DE JUEVES</p>
          <h3 class="mt-4 text-4xl font-extrabold text-white">Listo para jugar</h3>
          <p class="mt-4 mx-auto max-w-2xl text-sm leading-7 text-slate-400">
            Cuando me pases los endpoints de standings / stats, lo dejamos 100% completo.
          </p>
          <div class="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <NuxtLink to="/" class="rounded-full border border-white/12 bg-black/25 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-white hover:bg-black/35 transition">
              Volver al Home →
            </NuxtLink>
            <NuxtLink to="/domingo" class="rounded-full bg-emerald-300 px-7 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.20em] text-slate-900 hover:brightness-105 transition">
              Ir a Liga Domingo →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/5 py-10">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="text-xs text-slate-500">© {{ season }} Tochero5Liga. Todos los derechos reservados.</div>
          <a
            href="https://www.instagram.com/tochero5liga"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-300 hover:text-white"
          >
            Instagram @tochero5liga
          </a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { Instagram, Facebook, Menu, X } from "lucide-vue-next";
import { computed, ref } from "#imports";

definePageMeta({ layout: false });

const stadiumBg = "/img/hero-stadium.jpg";
const season = 2026;

// ✅ tabs internas como antes
type View = "partidos" | "equipos" | "estadisticas";
const view = ref<View>("partidos");

// ✅ header mobile
const menuOpen = ref(false);

function setView(v: View) {
  view.value = v;
  menuOpen.value = false;
}
function goInicio() {
  setView("partidos");
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

// ✅ FIJO: esta página SIEMPRE es jueves
const leagueKey = "jueves" as const;

type UiMatch = {
  id: string;
  date: string;
  time: string;
  home: string;
  away: string;
  venue?: string;
};

type UiTeam = { id: string; name: string; category?: string };

function fmtDateMX(dt: any) {
  const d = dt ? new Date(dt) : new Date();
  const date = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
  }).format(d).replace(".", "");
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

function toList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.content)) return raw.content;
  if (raw && Array.isArray(raw.items)) return raw.items;
  return [];
}

function toUiMatch(g: any): UiMatch {
  const home = pick(g, ["homeTeam.name", "home_team.name", "homeName", "localTeam.name", "teamHome.name", "home_team"]) || "Local";
  const away = pick(g, ["awayTeam.name", "away_team.name", "awayName", "visitorTeam.name", "teamAway.name", "away_team"]) || "Visitante";
  const dt = pick(g, ["startTime", "dateTime", "kickoff", "gameDate", "date", "matchDateUtc", "match_date_utc", "match_date"]) || new Date().toISOString();
  const { date, time } = fmtDateMX(dt);
  const venue = pick(g, ["venue", "field", "cancha", "location.name"]);

  return {
    id: String(pick(g, ["id", "gameId", "game_id"]) ?? `${dt}-${home}-${away}`),
    date,
    time,
    home: String(home),
    away: String(away),
    venue: venue ? String(venue) : undefined,
  };
}

// ✅ Juegos: merge /games + /gamesFinal
const { data: gamesData, pending: pendingGames, error: gamesError, refresh: refreshGames } =
  await useAsyncData("jueves-games-merged", async () => {
    const [a, b] = await Promise.all([
      $fetch<any>("/api/t5/games", { query: { league: leagueKey, leagueKey } }).catch(() => []),
      $fetch<any>("/api/t5/gamesFinal", { query: { league: leagueKey, leagueKey } }).catch(() => []),
    ]);

    const list = [...toList(a), ...toList(b)];

    // dedupe por id si existe
    const map = new Map<string, any>();
    for (const g of list) {
      const id = String(pick(g, ["id", "gameId", "game_id"]) ?? "");
      const key = id ? `id:${id}` : `k:${JSON.stringify(g).slice(0, 80)}`;
      map.set(key, g);
    }

    return Array.from(map.values()).map(toUiMatch) as UiMatch[];
  });

const matches = computed(() => gamesData.value ?? []);
const upcomingCount = computed(() => matches.value.length);

// ✅ Equipos: intenta endpoint, si no, fallback desde partidos
const { data: teamsData, pending: pendingTeams, error: teamsError, refresh: refreshTeams } =
  await useAsyncData("jueves-teams", async () => {
    try {
      const raw = await $fetch<any>("/api/t5/teams", { query: { league: leagueKey, leagueKey, isActive: true } });
      const list = toList(raw);
      return list.map((t: any) => ({
        id: String(pick(t, ["id", "teamId"]) ?? t?.name ?? Math.random()),
        name: String(pick(t, ["name", "teamName"]) ?? "Equipo"),
        category: pick(t, ["category.name", "categoryName", "division.name"]),
      })) as UiTeam[];
    } catch {
      return null as any;
    }
  });

const derivedTeams = computed<UiTeam[]>(() => {
  const map = new Map<string, UiTeam>();
  for (const m of matches.value) {
    if (m.home) map.set(m.home, { id: m.home, name: m.home });
    if (m.away) map.set(m.away, { id: m.away, name: m.away });
  }
  return Array.from(map.values());
});

const teams = computed(() => {
  const t = teamsData.value as UiTeam[] | null | undefined;
  return t && t.length > 0 ? t : derivedTeams.value;
});

const teamsCount = computed(() => teams.value.length);

const lastUpdatedLabel = computed(() => {
  const d = new Date();
  return new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
});

function refreshAll() {
  refreshGames();
  refreshTeams();
}
</script>