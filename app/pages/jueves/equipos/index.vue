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

          <nav class="hidden items-center gap-12 md:flex">
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

          <div class="hidden items-center gap-6 md:flex">
            <NuxtLink
              to="/"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100"
              aria-label="Ir al home"
              title="Ir al home"
            >
              <Home class="h-5 w-5" />
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
            class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 md:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            Menú
          </button>
        </div>

        <div v-if="mobileOpen" class="pb-4 md:hidden">
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
              class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
              @click="mobileOpen = false"
            >
              <Home class="h-4 w-4" />
              Home
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="fixed inset-0 -z-10 bg-[#020617]" />

    <!-- HERO / FILTROS -->
    <section class="border-b border-white/6 pt-24">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div class="max-w-3xl">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300"
          >
            <span class="h-2 w-2 rounded-full bg-orange-400" />
            Liga de Jueves · Equipos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Equipos</h1>
          <p class="mt-4 text-slate-400">
            Filtra equipos por categoría, rama y estatus. La vista carga primero lo esencial y completa filtros en segundo plano.
          </p>
        </div>

        <div class="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] md:p-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                Estatus
              </label>
              <select
                v-model="selectedStatus"
                class="w-full rounded-2xl border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 focus:bg-[#0d1428]"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
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

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-100">
              {{ filteredTeams.length }} resultados
            </span>

            <span
              v-if="metaLoading"
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300"
            >
              Cargando filtros…
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
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="team in paginatedTeams"
            :key="team.id"
            role="button"
            tabindex="0"
            class="group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.30)] focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            :style="getCardGradientStyle(team)"
            @click="openTeam(team.id)"
            @keydown.enter.prevent="openTeam(team.id)"
            @keydown.space.prevent="openTeam(team.id)"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%,rgba(2,6,23,0.18))]" />

            <div class="relative flex min-h-[230px] flex-col justify-between p-6">
              <div class="flex items-start gap-4">
                <div class="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-slate-950/30 shadow-inner">
                  <img
                    v-if="team.logoUrl"
                    :src="team.logoUrl"
                    :alt="team.name"
                    loading="lazy"
                    class="h-14 w-14 object-contain"
                  />
                  <span v-else class="px-2 text-center text-base font-extrabold text-white">
                    {{ team.shortName || getTeamInitials(team.name) }}
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <h2 class="truncate text-[1.95rem] font-extrabold leading-none text-white md:text-[2.05rem]">
                    {{ team.name }}
                  </h2>

                  <p
                    v-if="team.shortName"
                    class="mt-2 truncate text-[12px] font-bold uppercase tracking-[0.24em] text-white/75"
                  >
                    {{ team.shortName }}
                  </p>

                  <div class="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      v-if="team.categoryLabel && team.categoryLabel !== 'Sin categoría'"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      {{ team.categoryLabel }}
                    </span>

                    <span
                      v-if="team.branchLabel && team.branchLabel !== 'Sin rama'"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      {{ team.branchLabel }}
                    </span>

                    <span
                      v-if="team.divisionLabel"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      División: {{ team.divisionLabel }}
                    </span>

                    <span
                      class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold"
                      :class="team.isActive
                        ? 'border-emerald-400/30 bg-emerald-500/12 text-emerald-200'
                        : 'border-slate-400/30 bg-slate-500/12 text-slate-200'"
                    >
                      <span
                        class="h-2 w-2 rounded-full"
                        :class="team.isActive ? 'bg-emerald-400' : 'bg-slate-400'"
                      />
                      {{ team.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between gap-3">
                <div class="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">
                  Ver equipo
                </div>

                <div class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition duration-300 group-hover:translate-x-1 group-hover:border-white/30">
                  →
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-if="pendingTeams" class="mt-6 text-sm text-slate-400">Cargando equipos...</div>
        <div v-else-if="teamsError" class="mt-6 text-sm text-rose-300">No se pudieron cargar equipos.</div>
        <div v-else-if="filteredTeams.length === 0" class="mt-6 text-sm text-slate-400">No hay equipos.</div>

        <div
          v-if="!pendingTeams && !teamsError && filteredTeams.length > 0"
          class="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 md:flex-row md:items-center md:justify-between"
        >
          <div class="text-sm text-slate-400">
            Mostrando
            <span class="font-semibold text-white">{{ teamRangeStart }}</span>
            -
            <span class="font-semibold text-white">{{ teamRangeEnd }}</span>
            de
            <span class="font-semibold text-white">{{ filteredTeams.length }}</span>
            equipos
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
              :class="currentPage === 1
                ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'"
              :disabled="currentPage === 1"
              @click="goToTeamPage(currentPage - 1)"
            >
              Anterior
            </button>

            <button
              v-for="page in visibleTeamPages"
              :key="page"
              type="button"
              class="h-10 min-w-10 rounded-full border px-3 text-sm font-extrabold transition"
              :class="page === currentPage
                ? 'border-orange-400/40 bg-orange-400/15 text-orange-200'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/30 hover:bg-orange-400/10 hover:text-slate-100'"
              @click="goToTeamPage(page)"
            >
              {{ page }}
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
              :class="currentPage === totalTeamPages
                ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'"
              :disabled="currentPage === totalTeamPages"
              @click="goToTeamPage(currentPage + 1)"
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
import { Facebook, Home, Instagram } from "lucide-vue-next"
import { useJuevesData } from "~/composables/useJuevesData"

type FilterValue = "ALL" | string
type TeamStatusValue = "ALL" | "ACTIVE" | "INACTIVE"

type TeamMeta = {
  categoryLabel: string
  branchLabel: string
  divisionLabel: string
  isActive: boolean
}

type UiTeamCard = {
  id: string
  name: string
  shortName?: string
  logoUrl?: string
  colorPrimary?: string
  colorSecondary?: string
  isActive: boolean
  categoryLabel: string
  branchLabel: string
  divisionLabel?: string
}

const ITEMS_PER_PAGE = 10
const META_CONCURRENCY = 4
const META_CACHE_PREFIX = "jueves-team-meta-v1:"

const route = useRoute()
const mobileOpen = ref(false)
const search = ref("")
const currentPage = ref(1)
const selectedCategory = ref<FilterValue>("ALL")
const selectedBranch = ref<FilterValue>("ALL")
const selectedStatus = ref<TeamStatusValue>("ALL")
const metaLoading = ref(false)

const { leagueKey, toList, pick } = useJuevesData()

const { data: teamsData, pending: pendingTeams, error: teamsError } =
  await useAsyncData("jueves-equipos-page-hybrid", async () => {
    try {
      const raw = await $fetch<any>("/api/t5/teams", {
        query: {
          league: leagueKey,
          leagueKey,
        },
      })

      const list = toList(raw)

      return list
        .map((t: any) => {
          const id = String(pick(t, ["teamId", "id"]) ?? "").trim()
          if (!id) return null

          return {
            id,
            name: String(pick(t, ["name", "teamName"]) ?? "Equipo"),
            shortName: String(pick(t, ["shortName"]) ?? ""),
            logoUrl: String(
              pick(t, ["logoUrl", "logo", "imageUrl", "image", "teamLogo", "teamLogoUrl"]) ?? ""
            ),
            colorPrimary: normalizeColor(String(pick(t, ["colorPrimary"]) ?? "")),
            colorSecondary: normalizeColor(String(pick(t, ["colorSecondary"]) ?? "")),
            isActive: Boolean(pick(t, ["isActive", "active"]) ?? true),
            categoryLabel: "",
            branchLabel: "",
            divisionLabel: "",
          } as UiTeamCard
        })
        .filter((team): team is UiTeamCard => team !== null)
    } catch {
      return []
    }
  })

const teams = ref<UiTeamCard[]>([])

watch(
  () => teamsData.value,
  (value) => {
    teams.value = [...(value ?? [])]
  },
  { immediate: true }
)

const categoryOptions = computed(() =>
  uniqueSorted(
    teams.value
      .map((t) => t.categoryLabel)
      .filter((value) => value && value !== "Sin categoría")
  )
)

const branchOptions = computed(() =>
  uniqueSorted(
    teams.value
      .map((t) => t.branchLabel)
      .filter((value) => value && value !== "Sin rama")
  )
)

const filteredTeams = computed<UiTeamCard[]>(() => {
  const q = normalizeText(search.value)

  return teams.value.filter((t) => {
    const matchesCategory =
      selectedCategory.value === "ALL" || t.categoryLabel === selectedCategory.value

    const matchesBranch =
      selectedBranch.value === "ALL" || t.branchLabel === selectedBranch.value

    const matchesStatus =
      selectedStatus.value === "ALL" ||
      (selectedStatus.value === "ACTIVE" && t.isActive) ||
      (selectedStatus.value === "INACTIVE" && !t.isActive)

    const matchesSearch =
      !q ||
      normalizeText(
        `${t.name} ${t.shortName || ""} ${t.categoryLabel || ""} ${t.branchLabel || ""} ${t.divisionLabel || ""}`
      ).includes(q)

    return matchesCategory && matchesBranch && matchesStatus && matchesSearch
  })
})

const totalTeamPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTeams.value.length / ITEMS_PER_PAGE))
})

const paginatedTeams = computed<UiTeamCard[]>(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredTeams.value.slice(start, start + ITEMS_PER_PAGE)
})

const teamRangeStart = computed(() => {
  if (!filteredTeams.value.length) return 0
  return (currentPage.value - 1) * ITEMS_PER_PAGE + 1
})

const teamRangeEnd = computed(() => {
  return Math.min(currentPage.value * ITEMS_PER_PAGE, filteredTeams.value.length)
})

const visibleTeamPages = computed<number[]>(() => {
  const total = totalTeamPages.value
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

watch([search, selectedCategory, selectedBranch, selectedStatus], () => {
  currentPage.value = 1
})

watch(totalTeamPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

watch(
  () => teams.value.length,
  async (len) => {
    if (len > 0) {
      await enrichTeamsMeta()
    }
  },
  { immediate: true }
)

async function enrichTeamsMeta() {
  if (!teams.value.length) return

  metaLoading.value = true

  const queue: string[] = teams.value
    .map((team) => team.id)
    .filter((id): id is string => Boolean(id))

  let index = 0

  const worker = async () => {
    while (index < queue.length) {
      const currentIndex = index++
      const teamId = queue[currentIndex]
      if (!teamId) continue
      await enrichSingleTeam(teamId)
    }
  }

  const workers = Array.from(
    { length: Math.min(META_CONCURRENCY, queue.length) },
    () => worker()
  )

  await Promise.allSettled(workers)
  metaLoading.value = false
}

async function enrichSingleTeam(teamId: string) {
  const teamIndex = teams.value.findIndex((t) => t.id === teamId)
  if (teamIndex === -1) return

  const cached = readMetaCache(teamId)
  if (cached) {
    applyMetaToTeam(teamId, cached)
    return
  }

  try {
    const detail = await $fetch<any>(`/api/t5/teams/${teamId}/detail`, {
      query: { league: leagueKey, leagueKey },
    })

    const detailTeam = detail?.team ?? {}

    const categoryLabel =
      String(
        pick(detailTeam, [
          "category.name",
          "categoryName",
          "categoria.nombre",
          "categoria",
        ]) ?? ""
      ).trim() || "Sin categoría"

    const branchLabel =
      formatBranch(
        String(
          pick(detailTeam, [
            "category.gender",
            "gender",
            "categoryGender",
            "branch.name",
            "branchName",
            "rama.nombre",
            "rama",
          ]) ?? ""
        ).trim()
      ) || "Sin rama"

    let divisionLabel = String(
      pick(detailTeam, [
        "division.name",
        "divisionName",
        "category.code",
        "categoryCode",
        "code",
      ]) ?? ""
    ).trim()

    if (
      divisionLabel &&
      categoryLabel &&
      normalizeText(divisionLabel) === normalizeText(categoryLabel)
    ) {
      divisionLabel = ""
    }

    const currentTeam = teams.value[teamIndex]

    const meta: TeamMeta = {
      categoryLabel,
      branchLabel,
      divisionLabel: formatDivision(divisionLabel),
      isActive: Boolean(pick(detailTeam, ["isActive", "active"]) ?? currentTeam?.isActive ?? true),
    }

    writeMetaCache(teamId, meta)
    applyMetaToTeam(teamId, meta)
  } catch {
    // no-op
  }
}

function applyMetaToTeam(teamId: string, meta: TeamMeta) {
  const idx = teams.value.findIndex((t) => t.id === teamId)
  if (idx === -1) return

  const current = teams.value[idx]
  if (!current) return

  const updated: UiTeamCard = {
    id: current.id,
    name: current.name,
    shortName: current.shortName,
    logoUrl: current.logoUrl,
    colorPrimary: current.colorPrimary,
    colorSecondary: current.colorSecondary,
    isActive: meta.isActive,
    categoryLabel: meta.categoryLabel,
    branchLabel: meta.branchLabel,
    divisionLabel: meta.divisionLabel,
  }

  teams.value[idx] = updated
}

function readMetaCache(teamId: string): TeamMeta | null {
  if (typeof window === "undefined") return null

  try {
    const raw = sessionStorage.getItem(`${META_CACHE_PREFIX}${teamId}`)
    return raw ? (JSON.parse(raw) as TeamMeta) : null
  } catch {
    return null
  }
}

function writeMetaCache(teamId: string, meta: TeamMeta) {
  if (typeof window === "undefined") return

  try {
    sessionStorage.setItem(`${META_CACHE_PREFIX}${teamId}`, JSON.stringify(meta))
  } catch {
    // no-op
  }
}

function goToTeamPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalTeamPages.value)
}

function resetFilters() {
  selectedCategory.value = "ALL"
  selectedBranch.value = "ALL"
  selectedStatus.value = "ALL"
  search.value = ""
  currentPage.value = 1
}

function normalizeColor(value: string): string {
  const color = String(value || "").trim()
  if (!color) return ""
  if (color.startsWith("#")) return color

  const hexOnly = color.replace(/[^0-9a-fA-F]/g, "")
  if (hexOnly.length === 6) return `#${hexOnly}`
  if (hexOnly.length === 3) return `#${hexOnly}`

  return color
}

function getCardGradientStyle(team: UiTeamCard) {
  const primary = team.colorPrimary || "#0f172a"
  const secondary = team.colorSecondary || "#1e293b"

  return {
    backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})`,
    backgroundBlendMode: "soft-light",
  }
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

function formatBranch(value: string) {
  const v = String(value || "").trim()
  const upper = v.toUpperCase()

  if (upper === "VARONIL") return "Varonil"
  if (upper === "FEMENIL") return "Femenil"
  if (upper === "MIXTO") return "Mixto"

  return v
}

function formatDivision(value: string) {
  const v = String(value || "").trim()
  if (!v) return ""
  if (/^[A-Z0-9 -]+$/i.test(v)) return v.toUpperCase()
  return v
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"))
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

async function openTeam(id: string) {
  if (!id) return
  await navigateTo(`/jueves/equipos/${id}`)
}
</script>