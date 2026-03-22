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
                <option v-for="option in seasonOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
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
                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
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
                <option v-for="option in branchOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
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
                <option v-for="option in roundOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
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
                  :class="statusPillClass(m.status)"
                >
                  {{ statusLabel(m.status) }}
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
import { computed, ref, watch, useAsyncData } from "#imports"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

type FilterValue = "ALL" | string

type OptionItem = {
  value: string
  label: string
}

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

const JUEVES_LEAGUE_ID = 2
const ITEMS_PER_PAGE = 10

const search = ref("")
const currentPage = ref(1)

const selectedSeason = ref<FilterValue>("ALL")
const selectedCategory = ref<FilterValue>("ALL")
const selectedBranch = ref<FilterValue>("ALL")
const selectedRound = ref<FilterValue>("ALL")

const backendMatchQuery = computed(() => ({
  leagueId: JUEVES_LEAGUE_ID,
  code: selectedBranch.value === "ALL" ? undefined : selectedBranch.value,
  gender: selectedCategory.value === "ALL" ? undefined : selectedCategory.value,
}))

const { data: seasonsRaw } = await useAsyncData(
  "jueves-seasons-page",
  async () => {
    return await $fetch<any>("/api/t5/seasons/list", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])
  }
)

const { data: categoriesRaw } = await useAsyncData(
  "jueves-categories-page",
  async () => {
    return await $fetch<any>("/api/t5/categories", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])
  }
)

const {
  data: gamesData,
  pending: pendingGames,
  error: gamesError,
} = await useAsyncData(
  "jueves-partidos-page",
  async () => {
    const query = backendMatchQuery.value

    const [scheduled, finished] = await Promise.all([
      $fetch<any>("/api/t5/games", {
        query: {
          leagueId: query.leagueId,
          code: query.code,
          gender: query.gender,
        },
      }).catch(() => []),
      $fetch<any>("/api/t5/gamesFinal", {
        query: {
          leagueId: query.leagueId,
          code: query.code,
          gender: query.gender,
          all: true,
        },
      }).catch(() => []),
    ])

    const merged = [...toList(scheduled), ...toList(finished)]
    const unique = new Map<string, UiMatchCard>()

    for (const game of merged) {
      const parsed = toUiMatchCard(game)
      const existing = unique.get(parsed.id)

      if (!existing) {
        unique.set(parsed.id, parsed)
        continue
      }

      if (normalizeStatus(existing.status) !== "FINISHED" && normalizeStatus(parsed.status) === "FINISHED") {
        unique.set(parsed.id, parsed)
      }
    }

    return Array.from(unique.values())
      .filter((match) => match.leagueId === null || match.leagueId === JUEVES_LEAGUE_ID)
      .sort((a, b) => a.timestamp - b.timestamp)
  },
  {
    watch: [backendMatchQuery],
  }
)

const matches = computed<UiMatchCard[]>(() => gamesData.value ?? [])

const seasonOptions = computed<OptionItem[]>(() => {
  const fromApi = toList(seasonsRaw.value)
    .map((season: any) => {
      const seasonId = firstNumber(season, ["id", "seasonId"])
      const label =
        firstValue(season, ["name", "label", "title", "seasonName"]) ||
        (seasonId !== null ? `Temporada ${seasonId}` : "")

      if (!label) return null

      return {
        value: buildSeasonValue(seasonId, label),
        label: String(label).trim(),
      }
    })
    .filter(Boolean) as OptionItem[]

  const fromRows = matches.value
    .filter((m) => m.seasonValue && m.seasonLabel)
    .map((m) => ({
      value: m.seasonValue,
      label: m.seasonLabel,
    }))

  return uniqueOptions([...fromApi, ...fromRows])
    .filter((option) => !isExcludedSeasonOption(option))
    .sort((a, b) => a.label.localeCompare(b.label, "es"))
})

const categoryOptions = computed<OptionItem[]>(() => {
  const fromApi = toList(categoriesRaw.value)
    .map((category: any) => {
      const gender = normalizeGenderValue(firstValue(category, ["gender"]))
      if (!gender) return null

      return {
        value: gender,
        label: formatGenderLabel(gender),
      }
    })
    .filter(Boolean) as OptionItem[]

  const fromRows = matches.value
    .filter((m) => m.categoryValue && m.categoryLabel)
    .map((m) => ({
      value: m.categoryValue,
      label: m.categoryLabel,
    }))

  return uniqueOptions([...fromApi, ...fromRows]).sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )
})

const branchOptions = computed<OptionItem[]>(() => {
  const fromApi = toList(categoriesRaw.value)
    .map((category: any) => {
      const code = normalizeCodeValue(firstValue(category, ["code"]))
      if (!code) return null

      return {
        value: code,
        label: code,
      }
    })
    .filter(Boolean) as OptionItem[]

  const fromRows = matches.value
    .filter((m) => m.branchValue && m.branchLabel)
    .map((m) => ({
      value: m.branchValue,
      label: m.branchLabel,
    }))

  return uniqueOptions([...fromApi, ...fromRows]).sort((a, b) =>
    a.label.localeCompare(b.label, "es")
  )
})

const roundOptions = computed<OptionItem[]>(() => {
  return uniqueOptions(
    matches.value
      .filter((m) => m.roundValue)
      .map((m) => ({
        value: m.roundValue,
        label: m.roundLabel,
      }))
  ).sort(sortRoundOptions)
})

const filteredMatches = computed<UiMatchCard[]>(() => {
  const q = normalizeText(search.value)

  return matches.value.filter((m) => {
    const matchesSeason =
      selectedSeason.value === "ALL" || m.seasonValue === selectedSeason.value

    const matchesCategory =
      selectedCategory.value === "ALL" || m.categoryValue === selectedCategory.value

    const matchesBranch =
      selectedBranch.value === "ALL" || m.branchValue === selectedBranch.value

    const matchesRound =
      selectedRound.value === "ALL" || m.roundValue === selectedRound.value

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

watch(
  seasonOptions,
  (options) => {
    if (
      selectedSeason.value !== "ALL" &&
      !options.some((option) => option.value === selectedSeason.value)
    ) {
      selectedSeason.value = "ALL"
    }
  },
  { immediate: true }
)

watch(roundOptions, (options) => {
  if (
    selectedRound.value !== "ALL" &&
    !options.some((option) => option.value === selectedRound.value)
  ) {
    selectedRound.value = "ALL"
  }
})

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

function statusLabel(status: string) {
  const normalized = normalizeStatus(status)
  if (normalized === "FINISHED") return "Finalizado"
  if (normalized === "CANCELLED") return "Cancelado"
  return "Programado"
}

function statusPillClass(status: string) {
  const normalized = normalizeStatus(status)

  if (normalized === "FINISHED") {
    return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
  }

  if (normalized === "CANCELLED") {
    return "border border-rose-400/20 bg-rose-400/10 text-rose-200"
  }

  return "border border-sky-400/20 bg-sky-400/10 text-sky-200"
}

function toUiMatchCard(game: any): UiMatchCard {
  const startRaw = firstValue(game, [
    "startTime",
    "dateTime",
    "kickoff",
    "gameDate",
    "date",
    "scheduledAt",
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
    venue: firstValue(game, [
      "venue",
      "field",
      "location",
      "court",
      "stadium",
    ]),
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

function toList(value: any): any[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.data)) return value.data
  return []
}

function uniqueOptions(items: OptionItem[]) {
  const map = new Map<string, string>()

  for (const item of items) {
    const value = String(item?.value || "").trim()
    const label = String(item?.label || "").trim()

    if (!value || !label) continue
    if (!map.has(value)) map.set(value, label)
  }

  return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
}

function buildSeasonValue(seasonId: number | null, seasonLabel: string) {
  if (seasonId !== null) return `SEASON_${seasonId}`
  return `LABEL_${normalizeText(seasonLabel)}`
}

function isExcludedSeasonOption(option: OptionItem) {
  const normalizedLabel = normalizeText(option?.label || "")
  return normalizedLabel === "wt" || normalizedLabel === "temporada wt"
}

function sortRoundOptions(a: OptionItem, b: OptionItem) {
  const numA = extractRoundNumber(a.label)
  const numB = extractRoundNumber(b.label)

  if (numA !== null && numB !== null) return numA - numB
  if (numA !== null) return -1
  if (numB !== null) return 1

  return a.label.localeCompare(b.label, "es")
}

function extractRoundNumber(value: string) {
  const match = String(value || "").match(/(\d+)/)
  return match ? Number(match[1]) : null
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

function formatDateParts(raw: unknown) {
  const dateObj = raw ? new Date(String(raw)) : new Date()
  const safeDate = Number.isNaN(dateObj.getTime()) ? new Date() : dateObj

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