<template>
  <main class="min-h-screen text-slate-50">
    <JuevesHeader />

    <div class="fixed inset-0 -z-10 bg-[#020617]" />

    <section class="border-b border-white/6 pt-24">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div class="max-w-3xl">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300"
          >
            <span class="h-2 w-2 rounded-full bg-orange-400" />
            Liga de Jueves · Partidos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Calendario de Partidos</h1>
          <p class="mt-4 text-slate-400">
            Filtra partidos por temporada, categoría, rama y jornada.
          </p>
        </div>

        <div class="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] md:p-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Temporada
              </label>
              <select
                v-model="selectedSeason"
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              >
                <option value="ALL">Todas</option>
                <option v-for="option in seasonOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Categoría
              </label>
              <select
                v-model="selectedCategory"
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              >
                <option value="ALL">Todas</option>
                <option v-for="option in categoryOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Rama
              </label>
              <select
                v-model="selectedBranch"
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              >
                <option value="ALL">Todas</option>
                <option v-for="option in branchOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Jornada
              </label>
              <select
                v-model="selectedRound"
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              >
                <option value="ALL">Todas</option>
                <option v-for="option in roundOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Buscar equipo
              </label>
              <input
                v-model.trim="search"
                type="text"
                placeholder="Buscar equipo..."
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              />
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-100">
              {{ filteredMatches.length }} resultados
            </span>

            <button
              type="button"
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-200 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div class="grid grid-cols-1 gap-5">
          <article
            v-for="m in paginatedMatches"
            :key="m.id"
            class="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%)]" />

            <div class="relative p-5 md:p-6">
              <div class="mb-5 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {{ m.date }}
                </span>

                <span class="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {{ m.time }}
                </span>

                <span class="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold text-orange-100">
                  {{ m.seasonLabel }}
                </span>

                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                  {{ m.categoryLabel }}
                </span>

                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                  {{ m.branchLabel }}
                </span>

                <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                  {{ m.roundLabel }}
                </span>

                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold"
                  :class="m.status === 'FINISHED'
                    ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                    : 'border border-sky-400/20 bg-sky-400/10 text-sky-200'"
                >
                  {{ m.status === 'FINISHED' ? 'Finalizado' : 'Programado' }}
                </span>
              </div>

              <div class="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] md:items-center">
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

                <div class="flex flex-col items-center justify-center text-center md:px-3">
                  <span class="text-[0.72rem] font-extrabold uppercase tracking-[0.34em] text-orange-300">
                    VS
                  </span>

                  <div v-if="m.venue" class="mt-3 text-[11px] font-medium text-slate-400 md:text-xs">
                    {{ m.venue }}
                  </div>
                </div>

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
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"
import { useJuevesData, type UiMatch } from "~/composables/useJuevesData"

type FilterValue = "ALL" | string

type UiMatchCard = UiMatch & {
  homeLogo?: string
  awayLogo?: string
  homeShort?: string
  awayShort?: string
  seasonLabel: string
  categoryLabel: string
  branchLabel: string
  roundLabel: string
  status: string
}

const ITEMS_PER_PAGE = 10

const search = ref("")
const currentPage = ref(1)

const selectedSeason = ref<FilterValue>("ALL")
const selectedCategory = ref<FilterValue>("ALL")
const selectedBranch = ref<FilterValue>("ALL")
const selectedRound = ref<FilterValue>("ALL")

const { leagueKey, toList, toUiMatch } = useJuevesData()

const { data: gamesData, pending: pendingGames, error: gamesError } =
  await useAsyncData("jueves-partidos-page", async () => {
    const [scheduled, finished] = await Promise.all([
      $fetch<any>("/api/t5/games", {
        query: {
          league: leagueKey,
          leagueKey,
          status: "SCHEDULED",
          sort: "startTime,asc",
          limit: 200,
        },
      }).catch(() => []),
      $fetch<any>("/api/t5/gamesFinal", {
        query: {
          league: leagueKey,
          leagueKey,
          sort: "startTime,desc",
          limit: 200,
        },
      }).catch(() => []),
    ])

    const merged = [...toList(scheduled), ...toList(finished)]

    return merged.map((game: any) => {
      const ui = toUiMatch(game)

      const status = normalizeText(
        firstValue(game, [
          "status",
          "gameStatus",
          "matchStatus",
        ]) || "SCHEDULED"
      )

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
        seasonLabel: pickLabel(game, [
          "season.name",
          "seasonName",
          "season.label",
          "season.title",
          "temporada.nombre",
          "temporada",
        ], "Sin temporada"),
        categoryLabel: pickLabel(game, [
          "category.name",
          "categoryName",
          "category.label",
          "categoria.nombre",
          "categoria",
        ], "Sin categoría"),
        branchLabel: pickLabel(game, [
          "branch.name",
          "branchName",
          "gender",
          "rama.nombre",
          "rama",
        ], "Sin rama"),
        roundLabel: pickRoundLabel(game),
        status,
      } as UiMatchCard
    })
  })

const matches = computed<UiMatchCard[]>(() => gamesData.value ?? [])

const seasonOptions = computed(() => uniqueSorted(matches.value.map((m) => m.seasonLabel)))
const categoryOptions = computed(() => uniqueSorted(matches.value.map((m) => m.categoryLabel)))
const branchOptions = computed(() => uniqueSorted(matches.value.map((m) => m.branchLabel)))
const roundOptions = computed(() => {
  const labels = uniqueSorted(matches.value.map((m) => m.roundLabel))
  return labels.sort(sortRoundLabels)
})

const filteredMatches = computed<UiMatchCard[]>(() => {
  const q = normalizeText(search.value)

  return matches.value.filter((m) => {
    const matchesSeason =
      selectedSeason.value === "ALL" || m.seasonLabel === selectedSeason.value

    const matchesCategory =
      selectedCategory.value === "ALL" || m.categoryLabel === selectedCategory.value

    const matchesBranch =
      selectedBranch.value === "ALL" || m.branchLabel === selectedBranch.value

    const matchesRound =
      selectedRound.value === "ALL" || m.roundLabel === selectedRound.value

    const matchesSearch =
      !q ||
      normalizeText(`${m.home} ${m.away} ${m.venue || ""}`).includes(q)

    return matchesSeason && matchesCategory && matchesBranch && matchesRound && matchesSearch
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

watch(
  [search, selectedSeason, selectedCategory, selectedBranch, selectedRound],
  () => {
    currentPage.value = 1
  }
)

watch(totalMatchPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

function goToMatchPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalMatchPages.value)
}

function resetFilters() {
  selectedSeason.value = "ALL"
  selectedCategory.value = "ALL"
  selectedBranch.value = "ALL"
  selectedRound.value = "ALL"
  search.value = ""
  currentPage.value = 1
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

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"))
}

function pickLabel(obj: any, paths: string[], fallback: string) {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value).trim()
    }
  }
  return fallback
}

function pickRoundLabel(obj: any) {
  const raw = firstValue(obj, [
    "round",
    "roundNumber",
    "week",
    "weekNumber",
    "jornada",
    "jornada.numero",
    "matchday",
    "gameDay",
  ])

  if (!raw) return "Sin jornada"

  const clean = String(raw).trim()

  if (/^\d+$/.test(clean)) {
    return `Jornada ${clean}`
  }

  return clean.toLowerCase().startsWith("jornada") ? clean : `Jornada ${clean}`
}

function sortRoundLabels(a: string, b: string) {
  const numA = extractRoundNumber(a)
  const numB = extractRoundNumber(b)

  if (numA !== null && numB !== null) return numA - numB
  if (numA !== null) return -1
  if (numB !== null) return 1

  return a.localeCompare(b, "es")
}

function extractRoundNumber(value: string) {
  const match = String(value).match(/(\d+)/)
  return match ? Number(match[1]) : null
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
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