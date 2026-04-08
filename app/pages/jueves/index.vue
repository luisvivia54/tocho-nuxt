<template>
  <main class="min-h-screen text-slate-50">
    <JuevesHeader />

    <!-- BG -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30"
        :style="{ backgroundImage: `url(${heroBackgroundSrc})` }"
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
        <img :src="heroBackgroundSrc" alt="Hero stadium" class="h-full w-full object-cover" />
      </div>

      <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <ScrollReveal>
          <div class="pill-badge" style="border-color: hsla(28, 100%, 55%, 0.3)">
            <span class="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {{ heroBadge }}
          </div>
        </ScrollReveal>

        <ScrollReveal :delay="100">
          <h1 class="font-display font-900 max-w-4xl text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span class="text-foreground">{{ heroTitleLine1 }}</span>
            <br />
            <span class="text-accent">{{ heroTitleLine2 }}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal :delay="200">
          <p class="text-base md:text-lg text-muted-foreground">
            {{ heroSponsorPrefix }}
            <span class="font-semibold text-accent">{{ heroSponsorName }}</span>
          </p>
        </ScrollReveal>

        <ScrollReveal :delay="300">
          <div class="mt-2 flex flex-col items-center gap-4 sm:flex-row">
            <NuxtLink
              :to="heroPrimaryTo"
              class="btn-hero inline-flex items-center justify-center gap-3 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:brightness-110"
              style="min-height: 52px"
            >
              {{ heroPrimaryLabel }} <span aria-hidden="true">→</span>
            </NuxtLink>

            <NuxtLink :to="heroSecondaryTo" class="btn-hero-secondary">
              {{ heroSecondaryLabel }} <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- SPONSORS -->
    <section class="py-12">
      <div class="section-container">
        <ScrollReveal>
          <div class="eyebrow justify-center mb-8">{{ sponsorsTitle }}</div>
        </ScrollReveal>

        <ScrollReveal :delay="150">
          <div class="flex flex-wrap items-center justify-center gap-10">
            <div v-for="s in sponsors" :key="s.id" class="flex h-24 w-40 items-center justify-center">
              <a
                v-if="s.url"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-full w-full items-center justify-center"
              >
                <img
                  :src="s.logo"
                  :alt="s.name"
                  class="max-h-full max-w-full object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                />
              </a>

              <img
                v-else
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

        <div v-else-if="matches.length === 0" class="text-sm text-muted-foreground">
          No hay partidos de la liga de jueves para mostrar.
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

              <div class="mt-2 text-[11px] text-muted-foreground sm:mt-0 sm:text-right">
                Cancha: <span class="text-slate-200">{{ match.venue || "-" }}</span>
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
          <div class="eyebrow justify-center mb-10">{{ galleryTitle }}</div>
        </ScrollReveal>

        <ScrollReveal :delay="150">
          <div
            class="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/12 bg-black/30"
            style="aspect-ratio: 16/9"
          >
            <div
              class="flex h-full transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentPhoto * 100}%)` }"
            >
              <div
                v-for="(photo, i) in photos"
                :key="`${photo}-${i}`"
                class="flex h-full w-full flex-shrink-0 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)] p-2 sm:p-3"
              >
                <img
                  :src="photo"
                  :alt="`Torneo foto ${i + 1}`"
                  class="h-full w-full rounded-2xl object-contain"
                />
              </div>
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
              {{ venueTitle }}
            </h2>
            <p class="text-sm text-muted-foreground">{{ venueSubtitle }}</p>
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
              {{ mapsLabel }}
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useAsyncData, useRuntimeConfig } from "#imports"
import ScrollReveal from "~/components/ScrollReveal.vue"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

type UiMatchCard = {
  id: string
  timestamp: number
  date: string
  time: string
  venue: string
  home: string
  away: string
  homeLogo?: string
  awayLogo?: string
  homeShort?: string
  awayShort?: string
  seasonValue: string
  seasonLabel: string
  categoryValue: string
  categoryLabel: string
  branchValue: string
  branchLabel: string
  roundValue: string
  roundLabel: string
  status: string
  leagueId: number | null
}

type HeroButton = {
  label: string
  to: string
}

type SponsorItem = {
  id: string
  name: string
  logo: string
  url: string
}

type GalleryImage = {
  id: string
  src: string
}

type JuevesHomeConfig = {
  hero: {
    badge: string
    titleLine1: string
    titleLine2: string
    sponsorPrefix: string
    sponsorName: string
    backgroundImage: string
    primaryButton: HeroButton
    secondaryButton: HeroButton
  }
  sponsors: {
    title: string
    items: SponsorItem[]
  }
  gallery: {
    title: string
    images: GalleryImage[]
  }
  venue: {
    title: string
    subtitle: string
    embedUrl: string
    mapsUrl: string
    mapsLabel: string
  }
}

const JUEVES_LEAGUE_ID = 2
const JUEVES_APPLE_MAPS_URL = "https://maps.apple/p/sY5VihqTvutxjP"
const JUEVES_EMBED_URL = "https://www.google.com/maps?q=19.502404014796983,-99.1401616313347&z=17&output=embed"
const LEGACY_JUEVES_MAP_URLS = new Set([
  "https://maps.app.goo.gl/FLdwnEMaoJvpMuEDA",
  "https://maps.app.goo.gl/zKNYRashoqHAMJwP9",
])

function normalizeApiBase(v: string) {
  const s = String(v || "").trim().replace(/\/+$/, "")
  if (!s) return "https://tocho5-api.tochero5.mx/api"
  return s.endsWith("/api") ? s : `${s}/api`
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

function normalizeVenueMapsUrl(value: string) {
  const url = String(value || "").trim()
  if (!url || LEGACY_JUEVES_MAP_URLS.has(url)) return JUEVES_APPLE_MAPS_URL
  return url
}

function normalizeVenueEmbedUrl(value: string) {
  const url = String(value || "").trim()
  if (!url) return JUEVES_EMBED_URL
  if (url.includes("3732.6!2d-103.4!3d20.65")) return JUEVES_EMBED_URL
  return url
}

const DEFAULT_HOME: JuevesHomeConfig = {
  hero: {
    badge: "LIGA DE JUEVES",
    titleLine1: "Toda la liga al",
    titleLine2: "alcance de tu mano",
    sponsorPrefix: "Patrocinado por",
    sponsorName: "Dicass",
    backgroundImage: "/img/hero-stadium.jpg",
    primaryButton: {
      label: "VER PARTIDOS",
      to: "/jueves/partidos",
    },
    secondaryButton: {
      label: "VER EQUIPOS",
      to: "/jueves/equipos",
    },
  },
  sponsors: {
    title: "PATROCINADORES",
    items: [
      { id: "dicass", name: "Dicass", logo: "/img/sponsors/dicass-logo.png", url: "https://dicass.com.mx/" },
      { id: "blitzflag", name: "BlitzFlag", logo: "/img/sponsors/blitzflag-logo.png", url: "" },
      { id: "under-armour", name: "Under Armour", logo: "/img/sponsors/underarmour-logo.png", url: "https://www.underarmour.com.mx/" },
      { id: "medimex", name: "Fundación Medimex", logo: "/img/sponsors/medimex-logo.png", url: "" },
    ],
  },
  gallery: {
    title: "FOTOS DEL TORNEO",
    images: [
      { id: "gal-1", src: "/img/carrusel4.jpg" },
      { id: "gal-2", src: "/img/carrusel5.jpg" },
      { id: "gal-3", src: "/img/carrusel6.jpg" },
      { id: "gal-4", src: "/img/liga-jueves2.png" },
    ],
  },
  venue: {
    title: "Sede del Torneo",
    subtitle: "Encuentra la ubicación del torneo aquí",
    embedUrl: JUEVES_EMBED_URL,
    mapsUrl: JUEVES_APPLE_MAPS_URL,
    mapsLabel: "📍 ABRIR UBICACIÓN",
  },
}

function safeApplyParsed(parsed: any): JuevesHomeConfig {
  const merged: JuevesHomeConfig = clone(DEFAULT_HOME)
  const raw = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed

  if (raw && typeof raw === "object") {
    if (raw.hero && typeof raw.hero === "object") {
      merged.hero.badge = String(raw.hero.badge ?? merged.hero.badge)
      merged.hero.titleLine1 = String(raw.hero.titleLine1 ?? raw.hero.title ?? merged.hero.titleLine1)
      merged.hero.titleLine2 = String(raw.hero.titleLine2 ?? raw.hero.subtitle ?? merged.hero.titleLine2)
      merged.hero.sponsorPrefix = String(raw.hero.sponsorPrefix ?? merged.hero.sponsorPrefix)
      merged.hero.sponsorName = String(raw.hero.sponsorName ?? merged.hero.sponsorName)
      merged.hero.backgroundImage = String(
        raw.hero.backgroundImage ??
          raw.hero.image ??
          raw.hero.images?.[0]?.src ??
          merged.hero.backgroundImage
      )

      if (raw.hero.primaryButton && typeof raw.hero.primaryButton === "object") {
        merged.hero.primaryButton.label = String(raw.hero.primaryButton.label ?? merged.hero.primaryButton.label)
        merged.hero.primaryButton.to = String(raw.hero.primaryButton.to ?? merged.hero.primaryButton.to)
      }

      if (raw.hero.secondaryButton && typeof raw.hero.secondaryButton === "object") {
        merged.hero.secondaryButton.label = String(raw.hero.secondaryButton.label ?? merged.hero.secondaryButton.label)
        merged.hero.secondaryButton.to = String(raw.hero.secondaryButton.to ?? merged.hero.secondaryButton.to)
      }
    }

    if (raw.sponsors && typeof raw.sponsors === "object" && !Array.isArray(raw.sponsors)) {
      merged.sponsors.title = String(raw.sponsors.title ?? merged.sponsors.title)

      if (Array.isArray(raw.sponsors.items)) {
        merged.sponsors.items = raw.sponsors.items
          .filter((x: any) => x && typeof x === "object")
          .map((x: any) => ({
            id: String(x.id ?? `sp-${Math.random().toString(16).slice(2)}`),
            name: String(x.name ?? ""),
            logo: String(x.logo ?? ""),
            url: String(x.url ?? ""),
          }))
      }
    } else if (Array.isArray(raw.sponsors)) {
      merged.sponsors.items = raw.sponsors
        .filter((x: any) => x && typeof x === "object")
        .map((x: any) => ({
          id: String(x.id ?? `sp-${Math.random().toString(16).slice(2)}`),
          name: String(x.name ?? ""),
          logo: String(x.logo ?? ""),
          url: String(x.url ?? ""),
        }))
    }

    if (raw.gallery && typeof raw.gallery === "object") {
      merged.gallery.title = String(raw.gallery.title ?? merged.gallery.title)

      if (Array.isArray(raw.gallery.images)) {
        merged.gallery.images = raw.gallery.images
          .filter((x: any) => x && typeof x === "object")
          .map((x: any) => ({
            id: String(x.id ?? `gal-${Math.random().toString(16).slice(2)}`),
            src: String(x.src ?? ""),
          }))
      }
    }

    if (raw.venue && typeof raw.venue === "object") {
      merged.venue.title = String(raw.venue.title ?? merged.venue.title)
      merged.venue.subtitle = String(raw.venue.subtitle ?? merged.venue.subtitle)
      merged.venue.embedUrl = normalizeVenueEmbedUrl(String(raw.venue.embedUrl ?? merged.venue.embedUrl))
      merged.venue.mapsUrl = normalizeVenueMapsUrl(String(raw.venue.mapsUrl ?? merged.venue.mapsUrl))
      merged.venue.mapsLabel = String(raw.venue.mapsLabel ?? merged.venue.mapsLabel)
    } else if (raw.location && typeof raw.location === "object") {
      merged.venue.embedUrl = normalizeVenueEmbedUrl(String(raw.location.embedUrl ?? merged.venue.embedUrl))
      merged.venue.mapsUrl = normalizeVenueMapsUrl(String(raw.location.mapsUrl ?? merged.venue.mapsUrl))
    }
  }

  if (!Array.isArray(merged.sponsors.items) || merged.sponsors.items.length === 0) {
    merged.sponsors.items = clone(DEFAULT_HOME.sponsors.items)
  }

  if (!Array.isArray(merged.gallery.images) || merged.gallery.images.length === 0) {
    merged.gallery.images = clone(DEFAULT_HOME.gallery.images)
  }

  return merged
}

const runtime = useRuntimeConfig()
const API_BASE = normalizeApiBase(((runtime.public as any)?.apiBase as string) || "https://tocho5-api.tochero5.mx")
const HOME_CONFIG_ENDPOINT = `${API_BASE}/site-configs/jueves-home`

const { data: homeConfigData } = await useAsyncData(
  "jueves-home-config",
  async () => {
    try {
      const raw = await $fetch<any>(HOME_CONFIG_ENDPOINT)
      return safeApplyParsed(raw)
    } catch {
      return clone(DEFAULT_HOME)
    }
  }
)

const homeConfig = computed<JuevesHomeConfig>(() => {
  return safeApplyParsed(homeConfigData.value ?? DEFAULT_HOME)
})

const heroBackgroundSrc = computed(() => homeConfig.value.hero.backgroundImage || DEFAULT_HOME.hero.backgroundImage)
const heroBadge = computed(() => homeConfig.value.hero.badge || DEFAULT_HOME.hero.badge)
const heroTitleLine1 = computed(() => homeConfig.value.hero.titleLine1 || DEFAULT_HOME.hero.titleLine1)
const heroTitleLine2 = computed(() => homeConfig.value.hero.titleLine2 || DEFAULT_HOME.hero.titleLine2)
const heroSponsorPrefix = computed(() => homeConfig.value.hero.sponsorPrefix || DEFAULT_HOME.hero.sponsorPrefix)
const heroSponsorName = computed(() => homeConfig.value.hero.sponsorName || DEFAULT_HOME.hero.sponsorName)
const heroPrimaryLabel = computed(() => homeConfig.value.hero.primaryButton.label || DEFAULT_HOME.hero.primaryButton.label)
const heroPrimaryTo = computed(() => homeConfig.value.hero.primaryButton.to || DEFAULT_HOME.hero.primaryButton.to)
const heroSecondaryLabel = computed(() => homeConfig.value.hero.secondaryButton.label || DEFAULT_HOME.hero.secondaryButton.label)
const heroSecondaryTo = computed(() => homeConfig.value.hero.secondaryButton.to || DEFAULT_HOME.hero.secondaryButton.to)

const sponsorsTitle = computed(() => homeConfig.value.sponsors.title || DEFAULT_HOME.sponsors.title)
const sponsors = computed(() => {
  return homeConfig.value.sponsors.items.length ? homeConfig.value.sponsors.items : DEFAULT_HOME.sponsors.items
})

const galleryTitle = computed(() => homeConfig.value.gallery.title || DEFAULT_HOME.gallery.title)
const photos = computed(() => {
  const arr = homeConfig.value.gallery.images
    .map((x) => String(x.src || "").trim())
    .filter(Boolean)

  return arr.length ? arr : DEFAULT_HOME.gallery.images.map((x) => x.src)
})

const venueTitle = computed(() => homeConfig.value.venue.title || DEFAULT_HOME.venue.title)
const venueSubtitle = computed(() => homeConfig.value.venue.subtitle || DEFAULT_HOME.venue.subtitle)
const mapsEmbed = computed(() => homeConfig.value.venue.embedUrl || DEFAULT_HOME.venue.embedUrl)
const mapsLink = computed(() => homeConfig.value.venue.mapsUrl || DEFAULT_HOME.venue.mapsUrl)
const mapsLabel = computed(() => homeConfig.value.venue.mapsLabel || DEFAULT_HOME.venue.mapsLabel)

const {
  data: gamesData,
  pending: pendingGames,
  error: gamesError,
} = await useAsyncData(
  "jueves-home-games",
  async () => {
    const scheduled = await $fetch<any>("/api/t5/games", {
      query: {
        leagueId: JUEVES_LEAGUE_ID,
      },
    }).catch(() => [])

    return toList(scheduled)
      .map(toUiMatchCard)
      .filter((match) => match.leagueId === null || match.leagueId === JUEVES_LEAGUE_ID)
      .sort((a, b) => a.timestamp - b.timestamp)
  }
)

const matches = computed<UiMatchCard[]>(() => {
  return (gamesData.value ?? []).slice(0, 4)
})

const heroOpacity = ref(1)
const currentPhoto = ref(0)

function nextPhoto() {
  const total = photos.value.length
  if (!total) return
  currentPhoto.value = currentPhoto.value === total - 1 ? 0 : currentPhoto.value + 1
}

function prevPhoto() {
  const total = photos.value.length
  if (!total) return
  currentPhoto.value = currentPhoto.value === 0 ? total - 1 : currentPhoto.value - 1
}

watch(
  () => photos.value.length,
  (len) => {
    if (len <= 0) {
      currentPhoto.value = 0
      return
    }
    if (currentPhoto.value > len - 1) {
      currentPhoto.value = 0
    }
  },
  { immediate: true }
)

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

function toList(value: any): any[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.data)) return value.data
  return []
}

function toUiMatchCard(game: any): UiMatchCard {
  const startRaw = firstValue(game, [
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
  ])

  const { timestamp, date, time } = formatDateParts(startRaw)

  const home = firstValue(game, [
    "homeTeam.name",
    "home_team.name",
    "home.name",
    "homeName",
    "localTeam.name",
    "teamHome.name",
  ]) || "Local"

  const away = firstValue(game, [
    "awayTeam.name",
    "away_team.name",
    "away.name",
    "awayName",
    "visitorTeam.name",
    "teamAway.name",
  ]) || "Visitante"

  const seasonId = firstNumber(game, [
    "season.id",
    "seasonId",
    "temporada.id",
  ])

  const seasonLabel =
    firstValue(game, [
      "season.name",
      "seasonName",
      "season.label",
      "season.title",
      "temporada.nombre",
      "temporada.name",
      "temporada",
    ]) || (seasonId !== null ? `Temporada ${seasonId}` : "Sin temporada")

  const seasonValue = buildSeasonValue(seasonId, seasonLabel)

  const branchValue = normalizeCodeValue(
    firstValue(game, [
      "category.code",
      "categoryCode",
      "code",
      "division.code",
      "branch.code",
      "rama.code",
    ])
  )

  const categoryValue = normalizeGenderValue(
    firstValue(game, [
      "category.gender",
      "gender",
      "categoryGender",
      "division.gender",
      "rama.gender",
    ])
  )

  const rawRound = firstValue(game, [
    "roundLabel",
    "round",
    "roundNumber",
    "week",
    "weekNumber",
    "jornada",
    "jornada.numero",
    "matchday",
    "gameDay",
  ])

  const roundValue = normalizeRoundValue(rawRound)
  const roundLabel = formatRoundLabel(rawRound)

  const status = normalizeStatus(
    firstValue(game, [
      "status",
      "gameStatus",
      "matchStatus",
    ]) || "SCHEDULED"
  )

  return {
    id: String(firstValue(game, ["game_id", "gameId", "id"]) || `${home}-${away}-${timestamp}`),
    timestamp,
    date,
    time,
    venue: String(firstValue(game, [
      "venue",
      "field",
      "location",
      "court",
      "stadium",
    ]) || "").trim(),
    home,
    away,
    homeLogo: firstValue(game, [
      "homeTeam.logoUrl",
      "homeTeam.logo",
      "home_team.logo_url",
      "home_team.logoUrl",
      "home.logoUrl",
      "localTeam.logoUrl",
      "local.logoUrl",
    ]),
    awayLogo: firstValue(game, [
      "awayTeam.logoUrl",
      "awayTeam.logo",
      "away_team.logo_url",
      "away_team.logoUrl",
      "away.logoUrl",
      "visitorTeam.logoUrl",
      "visitor.logoUrl",
    ]),
    homeShort: firstValue(game, [
      "homeTeam.shortName",
      "home_team.short_name",
      "home.shortName",
      "localTeam.shortName",
    ]),
    awayShort: firstValue(game, [
      "awayTeam.shortName",
      "away_team.short_name",
      "away.shortName",
      "visitorTeam.shortName",
    ]),
    seasonValue,
    seasonLabel,
    categoryValue,
    categoryLabel: categoryValue ? formatGenderLabel(categoryValue) : "Sin categoría",
    branchValue,
    branchLabel: branchValue || "Sin rama",
    roundValue,
    roundLabel,
    status,
    leagueId: firstNumber(game, [
      "leagueId",
      "league_id",
      "league.league_id",
      "league.leagueId",
      "league.id",
    ]),
  }
}

function buildSeasonValue(seasonId: number | null, seasonLabel: string) {
  if (seasonId !== null) return `SEASON_${seasonId}`
  return `LABEL_${normalizeText(seasonLabel)}`
}

function formatRoundLabel(raw: unknown) {
  const clean = String(raw || "").trim()

  if (!clean) return "Sin jornada"

  const normalized = normalizeRoundValue(clean)

  if (/^\d+$/.test(normalized)) {
    return `Jornada ${normalized}`
  }

  if (clean.toLowerCase().startsWith("jornada")) {
    return clean
  }

  return clean
}

function normalizeRoundValue(raw: unknown) {
  const clean = String(raw || "").trim()
  if (!clean) return ""
  const normalized = normalizeText(clean).replace(/^jornada\s+/, "").trim()
  return normalized.toUpperCase()
}

function formatGenderLabel(value: string) {
  const normalized = normalizeGenderValue(value)

  if (normalized === "VARONIL") return "Varonil"
  if (normalized === "FEMENIL") return "Femenil"
  if (normalized === "MIXTO") return "Mixto"

  return value
}

function normalizeGenderValue(value: unknown) {
  const normalized = normalizeText(String(value || "")).toUpperCase()

  if (!normalized) return ""
  if (normalized === "MASCULINO" || normalized === "MALE") return "VARONIL"
  if (normalized === "FEMENINO" || normalized === "FEMALE") return "FEMENIL"

  return normalized
}

function normalizeCodeValue(value: unknown) {
  return String(value || "").trim().toUpperCase()
}

function normalizeStatus(value: unknown) {
  return String(value || "").trim().toUpperCase()
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function firstValue(obj: any, paths: string[]) {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value).trim()
    }
  }
  return ""
}

function firstNumber(obj: any, paths: string[]) {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value === null || value === undefined || String(value).trim() === "") continue

    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function readPath(obj: any, path: string) {
  return path.split(".").reduce((acc: any, key) => {
    if (acc === null || acc === undefined) return undefined
    return acc[key]
  }, obj)
}

function normalizeDateInput(raw: unknown): string {
  if (raw === null || raw === undefined) return ""

  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? "" : raw.toISOString()
  }

  const value = String(raw).trim()
  if (!value) return ""

  if (/^\d{13}$/.test(value)) {
    const ms = Number(value)
    return Number.isFinite(ms) ? new Date(ms).toISOString() : ""
  }

  if (/^\d{10}$/.test(value)) {
    const sec = Number(value)
    return Number.isFinite(sec) ? new Date(sec * 1000).toISOString() : ""
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00`
  }

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return value.replace(" ", "T")
  }

  return value
}

function formatDateParts(raw: unknown) {
  const normalized = normalizeDateInput(raw)

  if (!normalized) {
    return {
      timestamp: Number.MAX_SAFE_INTEGER,
      date: "Por definir",
      time: "Por definir",
    }
  }

  const safeDate = new Date(normalized)

  if (Number.isNaN(safeDate.getTime())) {
    return {
      timestamp: Number.MAX_SAFE_INTEGER,
      date: "Por definir",
      time: "Por definir",
    }
  }

  return {
    timestamp: safeDate.getTime(),
    date: new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(safeDate).replace(".", ""),
    time: new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(safeDate),
  }
}
</script>
