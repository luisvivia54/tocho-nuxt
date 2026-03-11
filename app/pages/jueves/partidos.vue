<template>
  <main class="min-h-screen text-slate-50">
    <!-- HEADER -->
    <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#050816]/88 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex h-20 items-center justify-between gap-6">
          <NuxtLink to="/jueves" class="flex items-center gap-3">
            <span class="text-[2rem] font-black leading-none tracking-tight text-orange-400">T5</span>
            <span class="text-[1.1rem] font-medium text-slate-300">Liga de Jueves</span>
          </NuxtLink>

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
              :class="route.path.startsWith('/jueves/equipos') ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Equipos
              <span
                v-if="route.path.startsWith('/jueves/equipos')"
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

          <button
            type="button"
            class="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            @click="mobileOpen = !mobileOpen"
          >
            Menú
          </button>
        </div>

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

    <div class="fixed inset-0 -z-10 bg-[#020617]" />

    <section class="border-b border-white/6 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
            <span class="h-2 w-2 rounded-full bg-orange-400" />
            Liga de Jueves · Partidos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Calendario de Partidos</h1>
          <p class="mt-4 text-slate-400">
            Consulta partidos programados y finalizados desde el backend.
          </p>
        </div>

        <div class="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]"
              :class="matchStatus === 'SCHEDULED' ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : 'border-white/10 bg-white/5 text-slate-300'"
              @click="matchStatus = 'SCHEDULED'"
            >
              Programados
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]"
              :class="matchStatus === 'FINISHED' ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : 'border-white/10 bg-white/5 text-slate-300'"
              @click="matchStatus = 'FINISHED'"
            >
              Finalizados
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]"
              :class="matchStatus === 'ALL' ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : 'border-white/10 bg-white/5 text-slate-300'"
              @click="matchStatus = 'ALL'"
            >
              Todos
            </button>
          </div>

          <input
            v-model.trim="search"
            type="text"
            placeholder="Buscar equipo..."
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 md:w-72"
          />
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div class="grid grid-cols-1 gap-5">
          <article
            v-for="m in paginatedMatches"
            :key="m.id"
            class="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%)]" />

            <div class="relative p-5 md:p-6">
              <div class="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] md:items-center">
                <!-- LOCAL -->
                <div class="flex min-w-0 items-center gap-4">
                  <div class="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-slate-950/35 shadow-inner">
                    <img
                      v-if="m.homeLogo"
                      :src="m.homeLogo"
                      :alt="m.home"
                      loading="lazy"
                      class="h-14 w-14 object-contain"
                    />
                    <span v-else class="text-sm font-extrabold uppercase text-white">
                      {{ m.homeShort || getTeamInitials(m.home) }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <p class="break-words text-xl font-extrabold leading-tight text-white md:text-2xl">
                      {{ m.home }}
                    </p>
                  </div>
                </div>

                <!-- CENTRO -->
                <div class="flex flex-col items-center justify-center text-center md:px-3">
                  <span class="text-[0.72rem] font-extrabold uppercase tracking-[0.34em] text-orange-300">
                    VS
                  </span>

                  <div class="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] md:text-xs">
                    <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 font-semibold text-slate-200">
                      {{ m.date }}
                    </span>

                    <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 font-semibold text-slate-200">
                      {{ m.time }}
                    </span>

                    <span
                      class="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 font-semibold text-orange-100"
                    >
                      Liga de Jueves
                    </span>
                  </div>

                  <div v-if="m.venue" class="mt-2 text-[11px] font-medium text-slate-400 md:text-xs">
                    {{ m.venue }}
                  </div>
                </div>

                <!-- VISITANTE -->
                <div class="flex min-w-0 items-center gap-4 md:justify-end">
                  <div class="min-w-0 md:text-right">
                    <p class="break-words text-xl font-extrabold leading-tight text-white md:text-2xl">
                      {{ m.away }}
                    </p>
                  </div>

                  <div class="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-slate-950/35 shadow-inner">
                    <img
                      v-if="m.awayLogo"
                      :src="m.awayLogo"
                      :alt="m.away"
                      loading="lazy"
                      class="h-14 w-14 object-contain"
                    />
                    <span v-else class="text-sm font-extrabold uppercase text-white">
                      {{ m.awayShort || getTeamInitials(m.away) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div v-if="pendingGames" class="text-sm text-slate-400">Cargando partidos...</div>
          <div v-else-if="gamesError" class="text-sm text-rose-300">No se pudieron cargar partidos.</div>
          <div v-else-if="filteredMatches.length === 0" class="text-sm text-slate-400">No hay resultados.</div>
        </div>

        <div
          v-if="!pendingGames && !gamesError && filteredMatches.length > 0"
          class="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 md:flex-row md:items-center md:justify-between"
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

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
              :class="currentPage === 1
                ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'"
              :disabled="currentPage === 1"
              @click="goToMatchPage(currentPage - 1)"
            >
              Anterior
            </button>

            <button
              v-for="page in visibleMatchPages"
              :key="page"
              type="button"
              class="h-10 min-w-10 rounded-full border px-3 text-sm font-extrabold transition"
              :class="page === currentPage
                ? 'border-orange-400/40 bg-orange-400/15 text-orange-200'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/30 hover:bg-orange-400/10 hover:text-slate-100'"
              @click="goToMatchPage(page)"
            >
              {{ page }}
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
              :class="currentPage === totalMatchPages
                ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'"
              :disabled="currentPage === totalMatchPages"
              @click="goToMatchPage(currentPage + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Facebook, Instagram } from "lucide-vue-next"
import { useJuevesData, type UiMatch } from "~/composables/useJuevesData"

type UiMatchCard = UiMatch & {
  homeLogo?: string
  awayLogo?: string
  homeShort?: string
  awayShort?: string
}

const ITEMS_PER_PAGE = 10

const route = useRoute()
const mobileOpen = ref(false)

const { leagueKey, toList, toUiMatch } = useJuevesData()

const matchStatus = ref<"SCHEDULED" | "FINISHED" | "ALL">("SCHEDULED")
const search = ref("")
const currentPage = ref(1)

const { data: gamesData, pending: pendingGames, error: gamesError } =
  await useAsyncData("jueves-partidos-page", async () => {
    const wantScheduled = matchStatus.value !== "FINISHED"
    const wantFinished = matchStatus.value !== "SCHEDULED"

    const [scheduled, finished] = await Promise.all([
      wantScheduled
        ? $fetch<any>("/api/t5/games", {
            query: {
              league: leagueKey,
              leagueKey,
              status: "SCHEDULED",
              sort: "startTime,asc",
              limit: 120,
            },
          }).catch(() => [])
        : [],
      wantFinished
        ? $fetch<any>("/api/t5/gamesFinal", {
            query: {
              league: leagueKey,
              leagueKey,
              sort: "startTime,desc",
              limit: 120,
            },
          }).catch(() => [])
        : [],
    ])

    const merged = [...toList(scheduled), ...toList(finished)]

    return merged.map((game: any) => {
      const ui = toUiMatch(game)

      return {
        ...ui,
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
      } as UiMatchCard
    })
  }, { watch: [matchStatus] })

const matches = computed<UiMatchCard[]>(() => gamesData.value ?? [])

const filteredMatches = computed<UiMatchCard[]>(() => {
  const q = search.value.toLowerCase()
  if (!q) return matches.value

  return matches.value.filter((m) => {
    return `${m.home} ${m.away}`.toLowerCase().includes(q)
  })
})

const totalMatchPages = computed(() => {
  return Math.max(1, Math.ceil(filteredMatches.value.length / ITEMS_PER_PAGE))
})

const paginatedMatches = computed<UiMatchCard[]>(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredMatches.value.slice(start, start + ITEMS_PER_PAGE)
})

const matchRangeStart = computed(() => {
  if (!filteredMatches.value.length) return 0
  return (currentPage.value - 1) * ITEMS_PER_PAGE + 1
})

const matchRangeEnd = computed(() => {
  return Math.min(currentPage.value * ITEMS_PER_PAGE, filteredMatches.value.length)
})

const visibleMatchPages = computed<number[]>(() => {
  const total = totalMatchPages.value
  const current = currentPage.value

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  if (current <= 3) {
    start = 1
    end = 5
  }

  if (current >= total - 2) {
    start = total - 4
    end = total
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

watch([search, matchStatus], () => {
  currentPage.value = 1
})

watch(totalMatchPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

function goToMatchPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalMatchPages.value)
}

function getTeamInitials(name: string) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function firstValue(obj: any, paths: string[]): string {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value)
    }
  }
  return ""
}

function readPath(obj: any, path: string) {
  return path.split(".").reduce((acc: any, key) => {
    if (acc === null || acc === undefined) return undefined
    return acc[key]
  }, obj)
}
</script>