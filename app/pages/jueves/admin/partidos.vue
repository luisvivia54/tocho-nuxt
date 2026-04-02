<template>
  <main class="min-h-screen bg-[#030817] text-slate-50">
    <JuevesHeader />

    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-[#030817]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_25%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(217,70,239,0.12),transparent_24%)]" />
    </div>

    <section class="pt-24 md:pt-28">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <header class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              Tochero5 · Consola Admin
            </p>

            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Partidos
            </h1>

            <p class="mt-3 max-w-3xl text-sm text-slate-400 md:text-base">
              Flujo: Categoría → Local y Visitante → Fecha/Hora → Jornada → Cancha → Finalizar + Stats
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="pendingMatches"
              @click="refreshMatchesNow"
            >
              {{ pendingMatches ? "Actualizando..." : "Actualizar" }}
            </button>

            <NuxtLink
              to="/"
              class="inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-100"
            >
              Inicio
            </NuxtLink>
          </div>
        </header>

        <div v-if="feedback.text" class="mt-6">
          <div class="rounded-2xl border px-4 py-3 text-sm" :class="feedbackClass">
            {{ feedback.text }}
          </div>
        </div>

        <!-- Crear partido -->
        <section class="mt-10 overflow-hidden rounded-[30px] border border-white/10 bg-[#071125]/90 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div class="h-[5px] w-full bg-[linear-gradient(90deg,#38bdf8_0%,#818cf8_45%,#d946ef_100%)]" />

          <div class="p-5 md:p-6">
            <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Crear partido
                </p>
                <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-white">
                  Nuevo partido
                </h2>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span class="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  Equipos:
                  <span class="ml-1 font-bold text-white">{{ teamsCount }}</span>
                </span>

                <span class="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  Partidos:
                  <span class="ml-1 font-bold text-white">{{ matchesCount }}</span>
                </span>

                <button
                  type="button"
                  class="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-semibold text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100"
                  @click="resetCreateForm"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div class="md:col-span-4">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Categoría (rama + gender)
                </label>

                <select
                  v-model="form.categoryId"
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                >
                  <option value="">— Selecciona —</option>
                  <option
                    v-for="category in categoryOptions"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.label }}
                  </option>
                </select>

                <label class="mt-3 inline-flex items-center gap-3 text-sm text-slate-300">
                  <input
                    v-model="form.filterTeamsByCategory"
                    type="checkbox"
                    class="h-4 w-4 rounded border-white/20 bg-[#020817] text-sky-400 focus:ring-sky-400/30"
                  />
                  Filtrar equipos por esta categoría
                </label>
              </div>

              <div class="md:col-span-4">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Local
                </label>

                <input
                  v-model.trim="form.homeQuery"
                  list="admin-home-teams"
                  type="text"
                  placeholder="Buscar equipo local..."
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />

                <datalist id="admin-home-teams">
                  <option
                    v-for="team in homeSuggestions"
                    :key="`home-${team.id}`"
                    :value="team.name"
                  />
                </datalist>
              </div>

              <div class="md:col-span-4">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Visitante
                </label>

                <input
                  v-model.trim="form.awayQuery"
                  list="admin-away-teams"
                  type="text"
                  placeholder="Buscar equipo visitante..."
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />

                <datalist id="admin-away-teams">
                  <option
                    v-for="team in awaySuggestions"
                    :key="`away-${team.id}`"
                    :value="team.name"
                  />
                </datalist>

                <button
                  type="button"
                  class="mt-3 h-10 w-full rounded-2xl border border-white/10 bg-white/[0.02] text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-slate-200"
                  @click="swapTeams"
                >
                  ⇄ Intercambiar
                </button>
              </div>

              <div class="md:col-span-3">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Fecha
                </label>

                <input
                  v-model="form.date"
                  type="date"
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Hora
                </label>

                <input
                  v-model="form.time"
                  type="time"
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Jornada
                </label>

                <input
                  v-model.trim="form.round"
                  type="text"
                  inputmode="numeric"
                  placeholder="0"
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />
              </div>

              <div class="md:col-span-3">
                <label class="mb-2 block text-sm font-semibold text-slate-300">
                  Cancha / Sede (opcional)
                </label>

                <input
                  v-model.trim="form.venue"
                  type="text"
                  placeholder="Ej. Miguel Alemán"
                  class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                />
              </div>

              <div class="flex items-end gap-3 md:col-span-2">
                <button
                  type="button"
                  class="h-12 flex-1 rounded-2xl bg-[linear-gradient(90deg,#38bdf8_0%,#d946ef_100%)] px-5 text-sm font-extrabold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.28)] transition hover:brightness-110"
                  :disabled="creating"
                  @click="handleCreateMatch"
                >
                  {{ creating ? "Creando..." : "Crear partido" }}
                </button>

                <button
                  type="button"
                  class="h-12 rounded-2xl border border-white/12 bg-white/[0.03] px-5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.05]"
                  @click="resetCreateForm"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Lista -->
        <section class="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[#071125]/90 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div class="h-[5px] w-full bg-[linear-gradient(90deg,#facc15_0%,#a3e635_28%,#22d3ee_100%)]" />

          <div class="p-5 md:p-6">
            <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 class="text-3xl font-extrabold tracking-tight text-white">
                  Partidos
                </h2>
                <p class="mt-2 text-sm text-slate-400">
                  Lista ligera. Finaliza y agrega stats por jugador.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-300">
                    Estatus
                  </label>

                  <select
                    v-model="statusFilter"
                    class="h-12 min-w-[220px] rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                  >
                    <option value="ALL">Todos</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="FINAL">FINAL</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-300">
                    Buscar equipo
                  </label>

                  <input
                    v-model.trim="listSearch"
                    type="text"
                    placeholder="Ej. Gators..."
                    class="h-12 min-w-[260px] rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="pendingMatches"
              class="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-5 text-sm text-slate-400"
            >
              Cargando partidos...
            </div>

            <div
              v-else-if="matchesError"
              class="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-5 text-sm text-rose-200"
            >
              No se pudieron cargar los partidos.
            </div>

            <div
              v-else-if="filteredMatches.length === 0"
              class="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-5 text-sm text-slate-400"
            >
              No hay resultados.
            </div>

            <div v-else class="space-y-4">
              <article
                v-for="match in filteredMatches"
                :key="match.mergeKey"
                class="rounded-[24px] border border-white/10 bg-[#091328] px-5 py-5 transition hover:border-sky-400/20 hover:bg-[#0b1730]"
              >
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div class="min-w-0 flex-1">
                    <h3 class="truncate text-2xl font-extrabold tracking-tight text-white">
                      {{ match.home }} vs {{ match.away }}
                    </h3>

                    <p class="mt-2 text-sm text-slate-400">
                      {{ match.date }}
                      ·
                      {{ match.time }}
                      <template v-if="match.categoryLabel"> · {{ match.categoryLabel }}</template>
                      <template v-if="match.branchLabel"> · {{ match.branchLabel }}</template>
                      <template v-if="match.roundLabel"> · Jornada: {{ match.roundLabel }}</template>
                      · Cancha: {{ match.venue || "-" }}
                      <template v-if="match.rawId"> · ID: {{ match.rawId }}</template>
                    </p>

                    <p
                      v-if="match.homeTeamId || match.awayTeamId"
                      class="mt-1 text-xs text-slate-500"
                    >
                      <template v-if="match.homeTeamId">HomeID: {{ match.homeTeamId }}</template>
                      <template v-if="match.awayTeamId"> · AwayID: {{ match.awayTeamId }}</template>
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center gap-3">
                    <div
                      v-if="match.status === 'FINAL' && match.homeScore !== null && match.awayScore !== null"
                      class="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-extrabold text-emerald-100"
                    >
                      <span>{{ match.homeScore }}</span>
                      <span class="text-emerald-300/80">-</span>
                      <span>{{ match.awayScore }}</span>
                    </div>

                    <span
                      class="inline-flex items-center rounded-full px-4 py-2 text-sm font-extrabold"
                      :class="statusPillClass(match.status)"
                    >
                      {{ match.status }}
                    </span>

                    <button
                      type="button"
                      class="rounded-full border border-rose-400/25 bg-rose-400/10 px-5 py-2.5 text-sm font-bold text-rose-100 transition hover:bg-rose-400/15"
                      :disabled="!match.rawId || deletingId === match.rawId"
                      @click="handleDeleteMatch(match)"
                    >
                      {{ deletingId === match.rawId ? "Borrando..." : "Borrar" }}
                    </button>

                    <button
                      type="button"
                      class="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-slate-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      :disabled="match.status === 'FINAL' || !match.rawId"
                      @click="toggleFinalizePanel(match)"
                    >
                      {{ finalizePanelId === match.mergeKey ? "Cancelar FINAL" : "Finalizar" }}
                    </button>
                  </div>
                </div>

                <div
                  v-if="finalizePanelId === match.mergeKey"
                  class="mt-4 rounded-[24px] border border-white/10 bg-[#0b1730] p-4"
                >
                  <p class="text-sm font-semibold text-slate-200">
                    Captura el score final para cerrar el partido.
                  </p>

                  <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <div>
                      <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {{ match.home }}
                      </label>
                      <input
                        v-model.trim="finalizeDraft.homeScore"
                        type="number"
                        min="0"
                        inputmode="numeric"
                        class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                      />
                    </div>

                    <div>
                      <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {{ match.away }}
                      </label>
                      <input
                        v-model.trim="finalizeDraft.awayScore"
                        type="number"
                        min="0"
                        inputmode="numeric"
                        class="h-12 w-full rounded-2xl border border-white/12 bg-[#020817] px-4 text-sm text-white outline-none transition focus:border-sky-400/40 focus:bg-[#061024]"
                      />
                    </div>

                    <div class="flex items-end gap-3">
                      <button
                        type="button"
                        class="h-12 rounded-2xl bg-[linear-gradient(90deg,#facc15_0%,#22d3ee_100%)] px-5 text-sm font-extrabold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="finalizingId === match.rawId"
                        @click="confirmFinalizeMatch(match)"
                      >
                        {{ finalizingId === match.rawId ? "Guardando..." : "Guardar FINAL" }}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { useAsyncData } from "#imports"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

type FeedbackType = "info" | "success" | "error"

type FeedbackState = {
  type: FeedbackType
  text: string
}

type CategoryOption = {
  id: string
  label: string
  code: string
  gender: string
}

type TeamOption = {
  id: string
  name: string
  shortName: string
  logoUrl: string
  leagueId: number | null
  categoryId: string
  code: string
  gender: string
}

type AdminMatchRow = {
  rawId: string
  mergeKey: string
  leagueId: number | null
  timestamp: number
  date: string
  time: string
  home: string
  away: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  venue: string
  roundValue: string
  roundLabel: string
  categoryLabel: string
  branchLabel: string
  status: string
}

const JUEVES_LEAGUE_ID = 2
const UNKNOWN_TIMESTAMP = Number.MAX_SAFE_INTEGER
const nuxtApp = useNuxtApp() as any

const feedback = ref<FeedbackState>({
  type: "info",
  text: "",
})
const creating = ref(false)
const deletingId = ref("")
const finalizePanelId = ref("")
const finalizingId = ref("")
const resolvedSeasonId = ref<number | null>(null)
const finalizeDraft = reactive({
  homeScore: "0",
  awayScore: "0",
})

const statusFilter = ref<"ALL" | "SCHEDULED" | "FINAL" | "CANCELLED">("ALL")
const listSearch = ref("")

const form = reactive({
  categoryId: "",
  homeQuery: "",
  awayQuery: "",
  date: "",
  time: "",
  round: "",
  venue: "",
  filterTeamsByCategory: true,
})

const { data: categoriesData } = await useAsyncData<CategoryOption[]>(
  "admin-jueves-partidos-categories-ui-fixed-v2",
  async () => {
    const raw = await $fetch<any>("/api/t5/categories", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => [])

    return uniqueCategories(
      toList(raw)
        .map(normalizeCategory)
        .filter((item) => item.id && item.label)
    )
  }
)

const { data: teamsData } = await useAsyncData<TeamOption[]>(
  "admin-jueves-partidos-teams-ui-fixed-v2",
  async () => {
    const byList = await $fetch<any>("/api/t5/teams/list", {
      query: { leagueId: JUEVES_LEAGUE_ID },
    }).catch(() => null)

    const byDefault = byList
      ? null
      : await $fetch<any>("/api/t5/teams", {
          query: { leagueId: JUEVES_LEAGUE_ID },
        }).catch(() => [])

    const source = byList ?? byDefault ?? []

    return uniqueTeams(
      toList(source)
        .map(normalizeTeam)
        .filter((team) => team.id)
        .filter((team) => team.leagueId === null || team.leagueId === JUEVES_LEAGUE_ID)
    )
  }
)

const {
  data: matchesData,
  pending: pendingMatches,
  error: matchesError,
  refresh: refreshMatches,
} = await useAsyncData<AdminMatchRow[]>(
  "admin-jueves-partidos-list-ui-fixed-v2",
  async () => {
    const [scheduledRaw, finalRaw] = await Promise.all([
      $fetch<any>("/api/t5/games", {
        query: { leagueId: JUEVES_LEAGUE_ID },
      }).catch(() => []),
      $fetch<any>("/api/t5/gamesFinal", {
        query: { leagueId: JUEVES_LEAGUE_ID, all: true },
      }).catch(() => []),
    ])

    const scheduled = toList(scheduledRaw).map((row) => normalizeMatch(row, "SCHEDULED"))
    const finals = toList(finalRaw).map((row) => normalizeMatch(row, "FINAL"))

    const merged = new Map<string, AdminMatchRow>()

    for (const row of [...scheduled, ...finals]) {
      if (row.leagueId !== null && row.leagueId !== JUEVES_LEAGUE_ID) continue

      const existing = merged.get(row.mergeKey)

      if (!existing) {
        merged.set(row.mergeKey, row)
        continue
      }

      merged.set(row.mergeKey, mergeMatchRows(existing, row))
    }

    return Array.from(merged.values()).sort((a, b) => a.timestamp - b.timestamp)
  }
)

const categoryOptions = computed<CategoryOption[]>(() => categoriesData.value ?? [])
const teamOptions = computed<TeamOption[]>(() => teamsData.value ?? [])
const matches = computed<AdminMatchRow[]>(() => matchesData.value ?? [])

const teamsCount = computed(() => teamOptions.value.length)
const matchesCount = computed(() => matches.value.length)

const selectedCategory = computed<CategoryOption | null>(() => {
  return categoryOptions.value.find((item) => item.id === form.categoryId) ?? null
})

const eligibleTeams = computed<TeamOption[]>(() => {
  let rows = [...teamOptions.value]

  if (form.filterTeamsByCategory && selectedCategory.value) {
    const current = selectedCategory.value

    rows = rows.filter((team) => {
      const byCategoryId =
        !!team.categoryId && String(team.categoryId) === String(current.id)

      const byCode =
        !!team.code && !!current.code && team.code === current.code

      const byGender =
        !!team.gender && !!current.gender && team.gender === current.gender

      return byCategoryId || byCode || byGender
    })
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name, "es"))
})

const homeSuggestions = computed(() => {
  return filterTeamSuggestions(eligibleTeams.value, form.homeQuery, form.awayQuery)
})

const awaySuggestions = computed(() => {
  return filterTeamSuggestions(eligibleTeams.value, form.awayQuery, form.homeQuery)
})

const filteredMatches = computed<AdminMatchRow[]>(() => {
  const q = normalizeText(listSearch.value)

  return matches.value.filter((match) => {
    const byStatus = statusFilter.value === "ALL" || match.status === statusFilter.value
    const bySearch =
      !q ||
      normalizeText(
        `${match.home} ${match.away} ${match.categoryLabel} ${match.branchLabel} ${match.venue}`
      ).includes(q)

    return byStatus && bySearch
  })
})

const feedbackClass = computed(() => {
  if (feedback.value.type === "success") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
  }

  if (feedback.value.type === "error") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-100"
  }

  return "border-sky-400/20 bg-sky-400/10 text-sky-100"
})

watch(
  () => form.categoryId,
  () => {
    if (!form.filterTeamsByCategory) return

    const homeStillExists = eligibleTeams.value.some(
      (team) => normalizeText(team.name) === normalizeText(form.homeQuery)
    )
    const awayStillExists = eligibleTeams.value.some(
      (team) => normalizeText(team.name) === normalizeText(form.awayQuery)
    )

    if (!homeStillExists) form.homeQuery = ""
    if (!awayStillExists) form.awayQuery = ""
  }
)

async function refreshMatchesNow() {
  await refreshMatches()
}

function resetCreateForm() {
  form.categoryId = ""
  form.homeQuery = ""
  form.awayQuery = ""
  form.date = ""
  form.time = ""
  form.round = ""
  form.venue = ""
  form.filterTeamsByCategory = true
}

function swapTeams() {
  const currentHome = form.homeQuery
  form.homeQuery = form.awayQuery
  form.awayQuery = currentHome
}

function statusPillClass(status: string) {
  if (status === "FINAL") {
    return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
  }

  if (status === "CANCELLED") {
    return "border border-rose-400/20 bg-rose-400/10 text-rose-200"
  }

  return "border border-sky-400/20 bg-sky-400/10 text-sky-200"
}

async function handleCreateMatch() {
  feedback.value = { type: "info", text: "" }

  const homeTeam = resolveTeamByName(form.homeQuery)
  const awayTeam = resolveTeamByName(form.awayQuery)

  if (!form.categoryId) {
    feedback.value = { type: "error", text: "Selecciona una categoría." }
    return
  }

  if (!homeTeam) {
    feedback.value = { type: "error", text: "Selecciona un equipo local válido." }
    return
  }

  if (!awayTeam) {
    feedback.value = { type: "error", text: "Selecciona un equipo visitante válido." }
    return
  }

  if (homeTeam.id === awayTeam.id) {
    feedback.value = { type: "error", text: "Local y visitante no pueden ser el mismo equipo." }
    return
  }

  if (!form.date || !form.time) {
    feedback.value = { type: "error", text: "Completa fecha y hora." }
    return
  }

  const matchDateUtc = localDateTimeToUtcIso(form.date, form.time)
  if (!matchDateUtc) {
    feedback.value = { type: "error", text: "Fecha u hora inválidas." }
    return
  }

  creating.value = true

  try {
    const seasonId = await ensureSeasonId()
    const headers = await authHeaders()
    const roundLabel = form.round ? String(form.round).trim() : undefined
    const venue = String(form.venue ?? "").trim()
    const payload = {
      league_id: JUEVES_LEAGUE_ID,
      leagueId: JUEVES_LEAGUE_ID,
      ...(seasonId ? { season_id: seasonId, seasonId } : {}),
      category_id: Number(form.categoryId),
      categoryId: Number(form.categoryId),
      home_team_id: Number(homeTeam.id),
      homeTeamId: Number(homeTeam.id),
      away_team_id: Number(awayTeam.id),
      awayTeamId: Number(awayTeam.id),
      match_date_utc: matchDateUtc,
      matchDateUtc: matchDateUtc,
      ...(roundLabel ? { round_label: roundLabel, roundLabel, round: roundLabel, matchday: roundLabel, week: roundLabel } : {}),
      ...(venue ? { venue, field: venue, location: venue } : {}),
    }

    const response = await $fetch<any>("/api/t5/games", {
      method: "POST",
      headers,
      body: payload,
    })

    const newId = String(firstValue(response, ["game_id", "gameId", "id"]) || "").trim()
    feedback.value = {
      type: "success",
      text: newId ? `Partido creado correctamente (ID ${newId}).` : "Partido creado correctamente.",
    }
    resetCreateForm()
    await refreshMatches()
  } catch (error: any) {
    feedback.value = {
      type: "error",
      text: extractApiError(error, "No se pudo crear el partido. Verifica tu sesión de admin."),
    }
  } finally {
    creating.value = false
  }
}

function toggleFinalizePanel(match: AdminMatchRow) {
  feedback.value = { type: "info", text: "" }

  if (!match.rawId) {
    feedback.value = {
      type: "error",
      text: `No se puede finalizar ${match.home} vs ${match.away} porque no tiene ID de partido.`,
    }
    return
  }

  if (finalizePanelId.value === match.mergeKey) {
    closeFinalizePanel()
    return
  }

  finalizePanelId.value = match.mergeKey
  finalizeDraft.homeScore = String(match.homeScore ?? 0)
  finalizeDraft.awayScore = String(match.awayScore ?? 0)
}

async function handleDeleteMatch(match: AdminMatchRow) {
  feedback.value = { type: "info", text: "" }

  const gameId = Number(match.rawId || 0)
  if (!gameId) {
    feedback.value = {
      type: "error",
      text: `No se puede borrar ${match.home} vs ${match.away} porque no tiene ID de partido.`,
    }
    return
  }

  if (import.meta.client) {
    const msg =
      match.status === "FINAL"
        ? `¿Eliminar el partido ${match.home} vs ${match.away}? Esto lo revierte y lo marca como CANCELLED.`
        : `¿Borrar el partido ${match.home} vs ${match.away}? Esta acción elimina el registro.`

    if (!window.confirm(msg)) return
  }

  deletingId.value = match.rawId

  try {
    const headers = await authHeaders()
    const endpoint =
      match.status === "FINAL"
        ? `/api/t5/admin/games/${gameId}`
        : `/api/t5/games/${gameId}`

    await $fetch(endpoint, {
      method: "DELETE",
      headers,
    })

    feedback.value = {
      type: "success",
      text:
        match.status === "FINAL"
          ? `Partido ${match.home} vs ${match.away} revertido correctamente.`
          : `Partido ${match.home} vs ${match.away} borrado correctamente.`,
    }
    if (finalizePanelId.value === match.mergeKey) closeFinalizePanel()
    await refreshMatches()
  } catch (error: any) {
    feedback.value = {
      type: "error",
      text: extractApiError(error, "No se pudo borrar el partido. Verifica tu sesión de admin."),
    }
  } finally {
    deletingId.value = ""
  }
}

function closeFinalizePanel() {
  finalizePanelId.value = ""
  finalizeDraft.homeScore = "0"
  finalizeDraft.awayScore = "0"
}

async function confirmFinalizeMatch(match: AdminMatchRow) {
  feedback.value = { type: "info", text: "" }

  const gameId = Number(match.rawId || 0)
  if (!gameId) {
    feedback.value = {
      type: "error",
      text: `No se puede finalizar ${match.home} vs ${match.away} porque no tiene ID de partido.`,
    }
    return
  }

  const homeScore = Number(finalizeDraft.homeScore)
  const awayScore = Number(finalizeDraft.awayScore)

  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore < 0 || awayScore < 0) {
    feedback.value = {
      type: "error",
      text: "Captura scores válidos para finalizar el partido.",
    }
    return
  }

  finalizingId.value = match.rawId

  try {
    const headers = await authHeaders()
    await $fetch("/api/t5/partido/update", {
      method: "POST",
      headers,
      body: {
        game_id: String(gameId),
        gameId,
        id: gameId,
        home_score: homeScore,
        homeScore,
        away_score: awayScore,
        awayScore,
      },
    })

    feedback.value = {
      type: "success",
      text: `Partido ${match.home} vs ${match.away} finalizado con score ${homeScore} - ${awayScore}.`,
    }
    closeFinalizePanel()
    await refreshMatches()
  } catch (error: any) {
    feedback.value = {
      type: "error",
      text: extractApiError(error, "No se pudo finalizar el partido. Verifica tu sesión de admin."),
    }
  } finally {
    finalizingId.value = ""
  }
}

function resolveTeamByName(name: string) {
  const normalized = normalizeText(name)

  return eligibleTeams.value.find((team) => normalizeText(team.name) === normalized) ?? null
}

function filterTeamSuggestions(source: TeamOption[], query: string, excludedName: string) {
  const normalizedQuery = normalizeText(query)
  const normalizedExcluded = normalizeText(excludedName)

  return source
    .filter((team) => normalizeText(team.name) !== normalizedExcluded)
    .filter((team) => {
      if (!normalizedQuery) return true
      return normalizeText(team.name).includes(normalizedQuery)
    })
    .slice(0, 50)
}

function normalizeCategory(row: any): CategoryOption {
  const id = String(firstValue(row, ["category_id", "id", "categoryId"]) || "")
  const code = normalizeCodeValue(firstValue(row, ["code", "categoryCode"]))
  const gender = normalizeGenderValue(firstValue(row, ["gender", "categoryGender"]))

  return {
    id,
    label: [code || "Sin rama", gender ? formatGenderLabel(gender) : "Sin gender"].join(" · "),
    code,
    gender,
  }
}

function normalizeTeam(row: any): TeamOption {
  const fallbackName =
    firstValue(row, ["name", "team_name", "teamName", "nombre"]) || "Equipo"

  return {
    id: String(firstValue(row, ["team_id", "id", "teamId"]) || ""),
    name: fallbackName,
    shortName: firstValue(row, ["shortName", "short_name", "abreviacion", "abbr"]),
    logoUrl: firstValue(row, ["logoUrl", "logo_url", "logo", "image"]),
    leagueId: firstNumber(row, ["leagueId", "league_id", "league.id"]),
    categoryId: String(firstValue(row, ["categoryId", "category_id", "category.id"]) || ""),
    code: normalizeCodeValue(firstValue(row, ["code", "category.code", "categoryCode"])),
    gender: normalizeGenderValue(firstValue(row, ["gender", "category.gender", "categoryGender"])),
  }
}

function normalizeMatch(row: any, sourceStatus: "SCHEDULED" | "FINAL"): AdminMatchRow {
  const startRaw = firstValue(row, [
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
  ])

  const { timestamp, date, time } = formatDateParts(startRaw)

  const home =
    firstValue(row, [
      "homeTeam.name",
      "home_team.name",
      "home.name",
      "homeName",
      "localTeam.name",
      "teamHome.name",
      "home_team",
    ]) || "Local"

  const away =
    firstValue(row, [
      "awayTeam.name",
      "away_team.name",
      "away.name",
      "awayName",
      "visitorTeam.name",
      "teamAway.name",
      "away_team",
    ]) || "Visitante"

  const rawRound = firstValue(row, [
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

  const categoryValue = normalizeGenderValue(
    firstValue(row, [
      "category.gender",
      "gender",
      "categoryGender",
      "division.gender",
      "rama.gender",
    ])
  )

  const branchValue = normalizeCodeValue(
    firstValue(row, [
      "category.code",
      "categoryCode",
      "code",
      "division.code",
      "branch.code",
      "rama.code",
    ])
  )

  const homeScore = firstNumber(row, [
    "homeScore",
    "scoreHome",
    "home_score",
    "score_home",
    "localScore",
    "scoreLocal",
    "local_score",
    "score_local",
    "result.home",
    "result.local",
    "score.home",
    "score.local",
    "marcadorLocal",
    "team1Score",
    "score1",
    "pointsHome",
    "homePoints",
  ])

  const awayScore = firstNumber(row, [
    "awayScore",
    "scoreAway",
    "away_score",
    "score_away",
    "visitorScore",
    "scoreVisitor",
    "visitor_score",
    "score_visitor",
    "result.away",
    "result.visitor",
    "score.away",
    "score.visitor",
    "marcadorVisitante",
    "team2Score",
    "score2",
    "pointsAway",
    "awayPoints",
  ])

  const homeTeamId = String(
    firstValue(row, [
      "homeTeam.id",
      "home_team.id",
      "homeTeamId",
      "teamHome.id",
      "home_id",
      "homeId",
    ]) || ""
  )

  const awayTeamId = String(
    firstValue(row, [
      "awayTeam.id",
      "away_team.id",
      "awayTeamId",
      "teamAway.id",
      "away_id",
      "awayId",
    ]) || ""
  )

  const rawId = String(firstValue(row, ["game_id", "gameId", "id", "matchId", "match_id"]) || "")

  const extractedStatus = normalizeStatus(
    firstValue(row, [
      "status",
      "gameStatus.status",
      "gameStatus",
      "matchStatus",
      "game_status",
      "match_status",
    ])
  )

  const leagueId = firstNumber(row, [
    "leagueId",
    "league_id",
    "league.id",
    "league.league_id",
    "league.leagueId",
  ])

  const status = sourceStatus === "FINAL" ? "FINAL" : extractedStatus || "SCHEDULED"

  const mergeKey = buildAdminMatchMergeKey({
    rawId,
    leagueId,
    timestamp,
    home,
    away,
    homeTeamId,
    awayTeamId,
    roundValue,
  })

  return {
    rawId,
    mergeKey,
    leagueId,
    timestamp,
    date,
    time,
    home,
    away,
    homeTeamId,
    awayTeamId,
    homeScore,
    awayScore,
    venue: String(firstValue(row, ["venue", "field", "location", "court", "stadium"]) || "").trim(),
    roundValue,
    roundLabel: formatRoundLabel(rawRound),
    categoryLabel: categoryValue ? formatGenderLabel(categoryValue) : "Sin categoría",
    branchLabel: branchValue || "Sin rama",
    status,
  }
}

function buildAdminMatchMergeKey(input: {
  rawId: string
  leagueId: number | null
  timestamp: number
  home: string
  away: string
  homeTeamId: string
  awayTeamId: string
  roundValue: string
}) {
  if (input.rawId) {
    return `ID|${input.rawId}`
  }

  const teamPart =
    input.homeTeamId && input.awayTeamId
      ? `${input.homeTeamId}|${input.awayTeamId}`
      : `${normalizeText(input.home)}|${normalizeText(input.away)}`

  return [
    String(input.leagueId ?? JUEVES_LEAGUE_ID),
    teamPart,
    String(input.timestamp),
    input.roundValue || "NO_ROUND",
  ].join("|")
}

function mergeMatchRows(a: AdminMatchRow, b: AdminMatchRow): AdminMatchRow {
  const aIsFinal = a.status === "FINAL"
  const bIsFinal = b.status === "FINAL"
  const primary = bIsFinal && !aIsFinal ? b : a
  const secondary = primary === a ? b : a

  return {
    rawId: primary.rawId || secondary.rawId,
    mergeKey: primary.mergeKey || secondary.mergeKey,
    leagueId: primary.leagueId ?? secondary.leagueId,
    timestamp: primary.timestamp !== UNKNOWN_TIMESTAMP ? primary.timestamp : secondary.timestamp,
    date: primary.date !== "Por definir" ? primary.date : secondary.date,
    time: primary.time !== "Por definir" ? primary.time : secondary.time,
    home: primary.home || secondary.home,
    away: primary.away || secondary.away,
    homeTeamId: primary.homeTeamId || secondary.homeTeamId,
    awayTeamId: primary.awayTeamId || secondary.awayTeamId,
    homeScore: primary.homeScore ?? secondary.homeScore,
    awayScore: primary.awayScore ?? secondary.awayScore,
    venue: primary.venue || secondary.venue,
    roundValue: primary.roundValue || secondary.roundValue,
    roundLabel: primary.roundLabel !== "—" ? primary.roundLabel : secondary.roundLabel,
    categoryLabel: primary.categoryLabel !== "Sin categoría" ? primary.categoryLabel : secondary.categoryLabel,
    branchLabel: primary.branchLabel !== "Sin rama" ? primary.branchLabel : secondary.branchLabel,
    status: aIsFinal || bIsFinal ? "FINAL" : primary.status,
  }
}

function uniqueCategories(items: CategoryOption[]) {
  const map = new Map<string, CategoryOption>()

  for (const item of items) {
    if (!item.id) continue
    if (!map.has(item.id)) map.set(item.id, item)
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "es"))
}

function uniqueTeams(items: TeamOption[]) {
  const map = new Map<string, TeamOption>()

  for (const item of items) {
    if (!item.id) continue
    if (!map.has(item.id)) {
      map.set(item.id, item)
      continue
    }

    const existing = map.get(item.id)!
    map.set(item.id, {
      ...existing,
      shortName: existing.shortName || item.shortName,
      logoUrl: existing.logoUrl || item.logoUrl,
      categoryId: existing.categoryId || item.categoryId,
      code: existing.code || item.code,
      gender: existing.gender || item.gender,
    })
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "es"))
}

function toList(value: any): any[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.data)) return value.data
  return []
}

function normalizeStatus(value: unknown) {
  const normalized = String(value || "").trim().toUpperCase()

  if (normalized === "FINISHED") return "FINAL"
  if (normalized === "COMPLETED") return "FINAL"

  return normalized
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

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value

  const normalized = String(value || "").trim().toLowerCase()
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "active" || normalized === "current"
}

function formatRoundLabel(raw: unknown) {
  const clean = String(raw || "").trim()

  if (!clean) return "—"

  const match = clean.match(/\d+/)
  if (match) return match[0]

  return clean
}

function normalizeRoundValue(raw: unknown) {
  const clean = String(raw || "").trim()
  if (!clean) return ""
  return normalizeText(clean).replace(/^jornada\s+/, "").trim().toUpperCase()
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function localDateTimeToUtcIso(date: string, time: string) {
  const parsed = new Date(`${date}T${time}:00`)
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : ""
}

async function authHeaders(): Promise<Record<string, string>> {
  const kc = nuxtApp.$kc

  try {
    await kc?.updateToken?.(30)
  } catch {}

  const token = kc?.token as string | undefined
  if (!token) {
    throw new Error("No hay sesión activa. Inicia sesión como admin para continuar.")
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

function extractApiError(error: any, fallback: string) {
  return String(error?.data?.message || error?.message || fallback)
}

async function ensureSeasonId() {
  if (resolvedSeasonId.value) return resolvedSeasonId.value

  const raw = await $fetch<any>("/api/t5/seasons/list").catch(() => [])
  const seasons = toList(raw)
    .map((row: any) => {
      const id = firstNumber(row, ["season_id", "seasonId", "id"])
      const status = String(firstValue(row, ["status", "seasonStatus"]) || "").trim().toUpperCase()
      const current =
        toBoolean(firstValue(row, ["current", "isCurrent", "active", "isActive", "enabled"])) ||
        status === "CURRENT" ||
        status === "ACTIVE"

      return {
        id: id ?? 0,
        current,
      }
    })
    .filter((row) => Number.isFinite(row.id) && row.id > 0)
    .sort((a, b) => b.id - a.id)

  resolvedSeasonId.value = seasons.find((row) => row.current)?.id ?? seasons[0]?.id ?? null
  return resolvedSeasonId.value
}

function firstValue(obj: any, paths: string[]) {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value === null || value === undefined) continue
    if (typeof value === "object") continue

    const text = String(value).trim()
    if (text !== "") return text
  }
  return ""
}

function firstNumber(obj: any, paths: string[]) {
  for (const path of paths) {
    const value = readPath(obj, path)
    if (value === null || value === undefined) continue
    if (typeof value === "object") continue

    const text = String(value).trim()
    if (text === "") continue

    const parsed = Number(text)
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
      timestamp: UNKNOWN_TIMESTAMP,
      date: "Por definir",
      time: "Por definir",
    }
  }

  const safeDate = new Date(normalized)

  if (Number.isNaN(safeDate.getTime())) {
    return {
      timestamp: UNKNOWN_TIMESTAMP,
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
      hour12: true,
    }).format(safeDate).toLowerCase(),
  }
}
</script>
