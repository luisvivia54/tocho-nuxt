<template>
  <main class="min-h-screen text-slate-50">
    <!-- HEADER INFALIBLE -->
    <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#050816]/88 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex h-20 items-center justify-between gap-6">
          <!-- Left -->
          <NuxtLink to="/jueves" class="flex items-center gap-3">
            <span class="text-[2rem] font-black leading-none tracking-tight text-orange-400">T5</span>
            <span class="text-[1.1rem] font-medium text-slate-300">Liga de Jueves</span>
          </NuxtLink>

          <!-- Center -->
          <nav class="hidden md:flex items-center gap-12">
            <NuxtLink
              to="/jueves"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Inicio
              <span
                v-if="route.path === '/jueves'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/partidos"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/partidos' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Partidos
              <span
                v-if="route.path === '/jueves/partidos'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/equipos"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/equipos' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Equipos
              <span
                v-if="route.path === '/jueves/equipos'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>

            <NuxtLink
              to="/jueves/estadisticas"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
              :class="route.path === '/jueves/estadisticas' ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Estadísticas
              <span
                v-if="route.path === '/jueves/estadisticas'"
                class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
              />
            </NuxtLink>
          </nav>

          <!-- Right -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-slate-400 hover:text-slate-200"
            >
              ← Volver
            </NuxtLink>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 transition hover:text-slate-200"
              aria-label="Instagram"
            >
              <Instagram class="h-5 w-5" />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 transition hover:text-slate-200"
              aria-label="Facebook"
            >
              <Facebook class="h-5 w-5" />
            </a>
          </div>

          <!-- Mobile -->
          <button
            type="button"
            class="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            @click="mobileOpen = !mobileOpen"
          >
            Menú
          </button>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileOpen" class="md:hidden pb-4">
          <div class="flex flex-col gap-2">
            <NuxtLink
              to="/jueves"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Inicio
            </NuxtLink>

            <NuxtLink
              to="/jueves/partidos"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Partidos
            </NuxtLink>

            <NuxtLink
              to="/jueves/equipos"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Equipos
            </NuxtLink>

            <NuxtLink
              to="/jueves/estadisticas"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              Estadísticas
            </NuxtLink>

            <NuxtLink
              to="/"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              ← Volver
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- BG -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30"
        :style="{ backgroundImage: `url(${stadiumBg})` }"
      />
      <div class="absolute inset-0 bg-[#050816]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_28%)]" />
    </div>

    <!-- HERO -->
    <section class="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-28">
      <div
        class="absolute inset-0 flex items-center justify-center transition-opacity duration-100"
        :style="{ opacity: heroOpacity * 0.14 }"
      >
        <img :src="tocherosLogo" alt="Hero stadium" class="h-full w-full object-cover" />
      </div>

      <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <ScrollReveal>
          <div class="pill-badge" style="border-color: hsla(28, 100%, 55%, 0.3)">
            <span class="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Liga de Jueves · Desarrollo
          </div>
        </ScrollReveal>

        <ScrollReveal :delay="100">
          <h1 class="font-display font-900 max-w-4xl text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span class="text-foreground">Toda la liga al</span>
            <br />
            <span class="text-accent">alcance de tu mano</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal :delay="200">
          <p class="text-base md:text-lg text-muted-foreground">
            Patrocinado por <span class="font-semibold text-accent">Dicass</span>
          </p>
        </ScrollReveal>

        <ScrollReveal :delay="300">
          <div class="mt-2 flex flex-col items-center gap-4 sm:flex-row">
            <NuxtLink
              to="/jueves/partidos"
              class="btn-hero inline-flex items-center justify-center gap-3 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:brightness-110"
              style="min-height: 52px"
            >
              Ver Partidos <span aria-hidden="true">→</span>
            </NuxtLink>

            <NuxtLink to="/jueves/equipos" class="btn-hero-secondary">
              Ver Equipos <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- SPONSORS -->
    <section class="py-12">
      <div class="section-container">
        <ScrollReveal>
          <div class="eyebrow justify-center mb-8">Patrocinadores</div>
        </ScrollReveal>

        <ScrollReveal :delay="150">
          <div class="flex flex-wrap items-center justify-center gap-10">
            <div v-for="s in sponsors" :key="s.name" class="flex h-24 w-40 items-center justify-center">
              <img
                :src="s.logo"
                :alt="s.name"
                class="max-h-full max-w-full object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- MATCHES -->
    <section class="py-16">
      <div class="section-container">
        <ScrollReveal>
          <div class="eyebrow mb-8">Próximos Partidos</div>
        </ScrollReveal>

        <div v-if="pendingGames" class="text-sm text-muted-foreground">Cargando partidos...</div>

        <div v-else-if="gamesError" class="text-sm text-rose-300">
          No se pudieron cargar partidos del backend.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2">
          <ScrollReveal v-for="(match, i) in matches" :key="match.id || i" :delay="i * 100">
            <div class="match-row flex-col sm:flex-row text-center sm:text-left">
              <div class="flex items-center justify-center gap-3 text-base font-display tracking-wider text-foreground">
                <span>{{ match.home }}</span>
                <span class="text-accent text-sm font-bold">VS</span>
                <span>{{ match.away }}</span>
              </div>

              <div class="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground sm:mt-0">
                <span class="flex items-center gap-1">📅 {{ match.date }}</span>
                <span class="flex items-center gap-1">🕒 {{ match.time }}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- PHOTOS -->
    <section class="py-16">
      <div class="section-container">
        <ScrollReveal>
          <div class="eyebrow justify-center mb-10">Fotos del Torneo</div>
        </ScrollReveal>

        <ScrollReveal :delay="150">
          <div class="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/12" style="aspect-ratio: 16/9">
            <div
              class="flex h-full transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentPhoto * 100}%)` }"
            >
              <img
                v-for="(photo, i) in photos"
                :key="i"
                :src="photo"
                :alt="`Torneo foto ${i + 1}`"
                class="h-full w-full flex-shrink-0 object-cover"
              />
            </div>

            <button
              type="button"
              @click="prevPhoto"
              class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-3 text-foreground backdrop-blur-sm transition hover:bg-background"
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              type="button"
              @click="nextPhoto"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-3 text-foreground backdrop-blur-sm transition hover:bg-background"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          <div class="mt-4 flex justify-center gap-2">
            <button
              v-for="(_, i) in photos"
              :key="i"
              type="button"
              @click="currentPhoto = i"
              class="h-2 rounded-full transition-all"
              :class="i === currentPhoto ? 'w-6 bg-accent' : 'w-2 bg-muted-foreground/40'"
              :aria-label="`Ir a foto ${i + 1}`"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- MAP -->
    <section class="py-16">
      <div class="section-container">
        <ScrollReveal>
          <div class="mb-8 text-center">
            <h2 class="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              <span class="mr-2 inline-block text-accent">📍</span>
              Sede del Torneo
            </h2>
            <p class="text-sm text-muted-foreground">Encuentra la ubicación del torneo aquí</p>
          </div>
        </ScrollReveal>

        <ScrollReveal :delay="150">
          <div class="overflow-hidden rounded-3xl border border-white/12">
            <iframe
              :src="mapsEmbed"
              width="100%"
              height="430"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación del torneo"
              class="w-full"
            />
          </div>

          <div class="mt-4 text-center">
            <a
              :href="mapsLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent transition-colors hover:text-accent/80"
            >
              📍 Abrir en Google Maps
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="py-8">
      <div class="section-container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center gap-3">
          <span class="font-display text-lg font-bold text-foreground">
            <span class="text-accent">T5</span>
          </span>
          <span class="text-xs text-muted-foreground">Liga de Jueves · Temporada 2026</span>
        </div>
        <p class="text-xs text-muted-foreground/60">© 2026 Tochero5Liga. Todos los derechos reservados.</p>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { Facebook, Instagram } from "lucide-vue-next"
import ScrollReveal from "~/components/ScrollReveal.vue"

type UiMatch = {
  id: string
  home: string
  away: string
  date: string
  time: string
}

const route = useRoute()
const mobileOpen = ref(false)

const stadiumBg = "/img/hero-stadium.jpg"
const tocherosLogo = "/img/hero-stadium.jpg"
const dicassLogo = "/img/sponsors/dicass-logo.png"
const blitzflagLogo = "/img/sponsors/blitzflag-logo.png"
const martiLogo = "/img/sponsors/underarmour-logo.png"
const medimexLogo = "/img/sponsors/medimex-logo.png"

const sponsors = [
  { name: "Dicass", logo: dicassLogo },
  { name: "BlitzFlag", logo: blitzflagLogo },
  { name: "Under Armour", logo: martiLogo },
  { name: "Fundación Medimex", logo: medimexLogo },
]

function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj)
    if (v !== undefined && v !== null && v !== "") return v
  }
  return undefined
}

function toList(raw: any): any[] {
  if (Array.isArray(raw)) return raw
  if (raw && Array.isArray(raw.content)) return raw.content
  if (raw && Array.isArray(raw.items)) return raw.items
  if (raw && Array.isArray(raw.data)) return raw.data
  return []
}

function fmtDateMX(dt: any) {
  const d = dt ? new Date(dt) : new Date()

  const date = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d).replace(".", "")

  const time = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d)

  return { date, time }
}

function toUiMatch(g: any): UiMatch {
  const home =
    pick(g, ["homeTeam.name", "home_team.name", "homeName", "localTeam.name", "teamHome.name", "home_team"]) || "Local"

  const away =
    pick(g, ["awayTeam.name", "away_team.name", "awayName", "visitorTeam.name", "teamAway.name", "away_team"]) || "Visitante"

  const dt =
    pick(g, ["startTime", "dateTime", "kickoff", "gameDate", "date", "matchDateUtc", "match_date_utc", "match_date"]) ||
    new Date().toISOString()

  const { date, time } = fmtDateMX(dt)

  return {
    id: String(pick(g, ["id", "gameId", "game_id"]) ?? `${dt}-${home}-${away}`),
    home: String(home),
    away: String(away),
    date,
    time,
  }
}

const { data: gamesData, pending: pendingGames, error: gamesError } = await useAsyncData(
  "jueves-home-games",
  async () => {
    const raw = await $fetch<any>("/api/t5/games", {
      query: {
        league: "jueves",
        leagueKey: "jueves",
        status: "SCHEDULED",
        sort: "startTime,asc",
        limit: 10,
      },
    }).catch(() => [])

    return toList(raw).map(toUiMatch).slice(0, 4)
  }
)

const fallbackMatches: UiMatch[] = [
  { id: "1", home: "Águilas", away: "Halcones", date: "1 mar 2026", time: "10:00 a. m." },
  { id: "2", home: "Leones", away: "Tigres", date: "1 mar 2026", time: "12:00 p. m." },
  { id: "3", home: "Lobos", away: "Toros", date: "8 mar 2026", time: "10:00 a. m." },
  { id: "4", home: "Pumas", away: "Jaguares", date: "8 mar 2026", time: "12:00 p. m." },
]

const matches = computed<UiMatch[]>(() => {
  const real = gamesData.value ?? []
  return real.length > 0 ? real : fallbackMatches
})

const photos = [
  "/img/carrusel1.jpg",
  "/img/carrusel2.jpg",
  "/img/carrusel3.jpg",
  "/img/liga-jueves.png",
]

const mapsEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.6!2d-103.4!3d20.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDM5JzAwLjAiTiAxMDPCsDI0JzAwLjAiVw!5e0!3m2!1ses!2smx!4v1700000000000"
const mapsLink = "https://maps.app.goo.gl/FLdwnEMaoJvpMuEDA"

const heroOpacity = ref(1)
const currentPhoto = ref(0)

function nextPhoto() {
  currentPhoto.value = currentPhoto.value === photos.length - 1 ? 0 : currentPhoto.value + 1
}

function prevPhoto() {
  currentPhoto.value = currentPhoto.value === 0 ? photos.length - 1 : currentPhoto.value - 1
}

let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => {
    heroOpacity.value = Math.max(0, 1 - window.scrollY / 500)
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener("scroll", onScroll)
})
</script>