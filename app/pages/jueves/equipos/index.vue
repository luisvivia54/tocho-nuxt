<template>
  <main class="min-h-screen text-slate-50">
    <JuevesHeader />

    <div class="fixed inset-0 -z-10 bg-[#020617]" />

    <section class="border-b border-white/6 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div class="max-w-3xl">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300"
          >
            <span class="h-2 w-2 rounded-full bg-orange-400" />
            Liga de Jueves · Equipos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Equipos</h1>
          <p class="mt-4 text-slate-400">
            Consulta los equipos registrados y entra al detalle para ver capitán y miembros.
          </p>
        </div>

        <div
          class="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] md:p-5"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div class="space-y-2">
              <label class="block text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Temporada
              </label>
              <select
                v-model="selectedSeason"
                :disabled="!hasSeasonMeta"
                class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                :class="filterSelectClass(!hasSeasonMeta)"
              >
                <option value="ALL">
                  {{ hasSeasonMeta ? 'Todas' : 'No disponible' }}
                </option>
                <option
                  v-for="option in seasonOptions"
                  :key="option.value"
                  :value="option.value"
                >
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
                :disabled="!hasCategoryMeta"
                class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                :class="filterSelectClass(!hasCategoryMeta)"
              >
                <option value="ALL">
                  {{ hasCategoryMeta ? 'Todas' : 'No disponible' }}
                </option>
                <option
                  v-for="option in categoryOptions"
                  :key="option.value"
                  :value="option.value"
                >
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
                :disabled="!hasBranchMeta"
                class="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                :class="filterSelectClass(!hasBranchMeta)"
              >
                <option value="ALL">
                  {{ hasBranchMeta ? 'Todas' : 'No disponible' }}
                </option>
                <option
                  v-for="option in branchOptions"
                  :key="option.value"
                  :value="option.value"
                >
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

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-100"
            >
              {{ filteredTeams.length }} resultados
            </span>

            <button
              type="button"
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-200 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>

          <p
            v-if="!hasAnyMeta"
            class="mt-4 text-xs text-amber-200/90"
          >
            Este endpoint solo trae datos básicos del equipo. Temporada, categoría y rama no vienen en la respuesta, por eso esos filtros están deshabilitados.
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-10">
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

            <div class="relative flex min-h-[210px] flex-col justify-between p-6">
              <div class="flex items-start gap-4">
                <div
                  class="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-slate-950/30 shadow-inner"
                >
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
                      v-if="team.categoryLabel"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      Categoría: {{ team.categoryLabel }}
                    </span>

                    <span
                      v-if="team.branchLabel"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      Rama: {{ team.branchLabel }}
                    </span>

                    <span
                      v-if="team.seasonLabel"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      {{ team.seasonLabel }}
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

                <div
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition duration-300 group-hover:translate-x-1 group-hover:border-white/30"
                >
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
              :class="
                currentPage === 1
                  ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'
              "
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
              :class="
                page === currentPage
                  ? 'border-orange-400/40 bg-orange-400/15 text-orange-200'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/30 hover:bg-orange-400/10 hover:text-slate-100'
              "
              @click="goToTeamPage(page)"
            >
              {{ page }}
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition"
              :class="
                currentPage === totalTeamPages
                  ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-600'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100'
              "
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
import { computed, ref, watch } from "vue"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"
import { useJuevesData } from "~/composables/useJuevesData"

type FilterValue = "ALL" | string

type OptionItem = {
  label: string
  value: string
}

type UiTeamCard = {
  id: string
  name: string
  shortName?: string
  categoryLabel: string
  categoryValue: string
  branchLabel: string
  branchValue: string
  seasonLabel: string
  seasonValue: string
  logoUrl?: string
  colorPrimary?: string
  colorSecondary?: string
  isActive: boolean
}

const ITEMS_PER_PAGE = 9

const search = ref("")
const currentPage = ref(1)

const selectedSeason = ref<FilterValue>("ALL")
const selectedCategory = ref<FilterValue>("ALL")
const selectedBranch = ref<FilterValue>("ALL")

const { leagueKey, toList } = useJuevesData()

const { data: teamsData, pending: pendingTeams, error: teamsError } =
  await useAsyncData<UiTeamCard[]>("jueves-equipos-page", async () => {
    try {
      const raw = await $fetch<any>("/api/t5/teams", {
        query: {
          league: leagueKey,
          leagueKey,
        },
      })

      const list = toList(raw)

      console.log("TOTAL EQUIPOS:", list.length)
      console.log("PRIMER TEAM JUEVES:", list?.[0])

      return list
        .map((team: any) => {
          const flattened = flattenObject(team)

          const categoryRaw = findExactMeta(flattened, [
            "category.name",
            "categoryName",
            "division.name",
            "divisionName",
            "category",
            "division",
            "categoria",
          ])

          const branchRaw = findExactMeta(flattened, [
            "category.gender",
            "categoryGender",
            "gender",
            "branch",
            "branchName",
            "rama",
            "sexo",
          ])

          const seasonRaw = findExactMeta(flattened, [
            "season.name",
            "seasonName",
            "temporada.name",
            "temporada",
            "season",
          ])

          const categoryLabel = stringValue(categoryRaw)
          const branchLabel = formatBranchLabel(stringValue(branchRaw))
          const seasonLabel = stringValue(seasonRaw)

          return {
            id: String(firstNonEmpty([team?.teamId, team?.id]) ?? "").trim(),
            name: String(firstNonEmpty([team?.name, team?.teamName, "Equipo"]) ?? "").trim(),
            shortName: String(firstNonEmpty([team?.shortName, team?.alias]) ?? "").trim(),
            categoryLabel,
            categoryValue: normalizeText(categoryLabel),
            branchLabel,
            branchValue: normalizeText(branchLabel),
            seasonLabel,
            seasonValue: normalizeText(seasonLabel),
            logoUrl: String(
              firstNonEmpty([
                team?.logoUrl,
                team?.logo,
                team?.imageUrl,
                team?.image,
                team?.teamLogo,
                team?.teamLogoUrl,
              ]) ?? ""
            ).trim(),
            colorPrimary: normalizeColor(String(firstNonEmpty([team?.colorPrimary]) ?? "")),
            colorSecondary: normalizeColor(String(firstNonEmpty([team?.colorSecondary]) ?? "")),
            isActive: toBoolean(firstNonEmpty([team?.isActive, team?.active, true])),
          }
        })
        .filter((team) => team.id && team.name)
    } catch (error) {
      console.error("Error cargando equipos:", error)
      return []
    }
  })

const allTeams = computed<UiTeamCard[]>(() => teamsData.value ?? [])

const seasonOptions = computed<OptionItem[]>(() =>
  buildOptions(allTeams.value.map((team) => ({
    label: team.seasonLabel,
    value: team.seasonValue,
  })))
)

const categoryOptions = computed<OptionItem[]>(() =>
  buildOptions(allTeams.value.map((team) => ({
    label: team.categoryLabel,
    value: team.categoryValue,
  })))
)

const branchOptions = computed<OptionItem[]>(() =>
  buildOptions(allTeams.value.map((team) => ({
    label: team.branchLabel,
    value: team.branchValue,
  })))
)

const hasSeasonMeta = computed(() => seasonOptions.value.length > 0)
const hasCategoryMeta = computed(() => categoryOptions.value.length > 0)
const hasBranchMeta = computed(() => branchOptions.value.length > 0)
const hasAnyMeta = computed(() => hasSeasonMeta.value || hasCategoryMeta.value || hasBranchMeta.value)

const filteredTeams = computed<UiTeamCard[]>(() => {
  const q = normalizeText(search.value)

  return allTeams.value.filter((team) => {
    const matchesSeason =
      !hasSeasonMeta.value ||
      selectedSeason.value === "ALL" ||
      team.seasonValue === selectedSeason.value

    const matchesCategory =
      !hasCategoryMeta.value ||
      selectedCategory.value === "ALL" ||
      team.categoryValue === selectedCategory.value

    const matchesBranch =
      !hasBranchMeta.value ||
      selectedBranch.value === "ALL" ||
      team.branchValue === selectedBranch.value

    const searchable = normalizeText(
      [
        team.name,
        team.shortName,
        team.categoryLabel,
        team.branchLabel,
        team.seasonLabel,
      ]
        .filter(Boolean)
        .join(" ")
    )

    const matchesSearch = !q || searchable.includes(q)

    return matchesSeason && matchesCategory && matchesBranch && matchesSearch
  })
})

const totalTeamPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / ITEMS_PER_PAGE))
)

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

  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

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

watch([search, selectedSeason, selectedCategory, selectedBranch], () => {
  currentPage.value = 1
})

watch(
  [hasSeasonMeta, hasCategoryMeta, hasBranchMeta],
  ([seasonOk, categoryOk, branchOk]) => {
    if (!seasonOk) selectedSeason.value = "ALL"
    if (!categoryOk) selectedCategory.value = "ALL"
    if (!branchOk) selectedBranch.value = "ALL"
  },
  { immediate: true }
)

watch(totalTeamPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

function filterSelectClass(disabled: boolean) {
  return disabled
    ? "cursor-not-allowed border-white/10 bg-[#0b1223]/60 text-slate-500"
    : "border-white/10 bg-[#0b1223] text-white focus:border-orange-400/40 focus:bg-[#0d1428]"
}

function goToTeamPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalTeamPages.value)
}

function resetFilters() {
  search.value = ""
  selectedSeason.value = "ALL"
  selectedCategory.value = "ALL"
  selectedBranch.value = "ALL"
  currentPage.value = 1
}

function buildOptions(items: Array<{ label: string; value: string }>): OptionItem[] {
  const map = new Map<string, string>()

  for (const item of items) {
    const label = String(item.label || "").trim()
    const value = String(item.value || "").trim()

    if (!label || !value) continue

    if (!map.has(value)) {
      map.set(value, label)
    }
  }

  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"))
}

function flattenObject(obj: any, prefix = "", result: Record<string, any> = {}) {
  if (obj === null || obj === undefined) return result

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const nextPrefix = prefix ? `${prefix}.${index}` : String(index)
      flattenObject(item, nextPrefix, result)
    })
    return result
  }

  if (typeof obj !== "object") {
    if (prefix) result[prefix] = obj
    return result
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key]
    const nextPrefix = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === "object") {
      flattenObject(value, nextPrefix, result)
    } else {
      result[nextPrefix] = value
    }
  }

  return result
}

function findExactMeta(flattened: Record<string, any>, paths: string[]) {
  for (const path of paths) {
    const value = flattened[path]
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value
    }
  }
  return ""
}

function firstNonEmpty(values: any[]) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value
    }
  }
  return ""
}

function stringValue(value: any) {
  return String(value ?? "").trim()
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function formatBranchLabel(value: string) {
  const v = normalizeText(value)

  if (v === "varonil" || v === "masculino" || v === "male") return "Varonil"
  if (v === "femenil" || v === "femenino" || v === "female") return "Femenil"
  if (v === "mixto" || v === "mixed") return "Mixto"

  return String(value || "").trim()
}

function toBoolean(value: any) {
  if (typeof value === "boolean") return value
  const v = normalizeText(String(value))
  if (v === "false" || v === "0" || v === "inactive" || v === "inactivo") return false
  return true
}

function normalizeColor(value: string): string {
  const color = value.trim()
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

async function openTeam(id: string) {
  if (!id) return
  await navigateTo(`/jueves/equipos/${id}`)
}
</script>