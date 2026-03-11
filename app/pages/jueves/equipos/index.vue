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
            Liga de Jueves · Equipos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Equipos</h1>
          <p class="mt-4 text-slate-400">
            Consulta los equipos registrados y entra al detalle para ver capitán, descripción y miembros.
          </p>
        </div>

        <div class="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]"
              :class="activeOnly ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : 'border-white/10 bg-white/5 text-slate-300'"
              @click="activeOnly = true"
            >
              Activos
            </button>

            <button
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]"
              :class="!activeOnly ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : 'border-white/10 bg-white/5 text-slate-300'"
              @click="activeOnly = false"
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
                      v-if="team.categoryLabel"
                      class="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                    >
                      Categoría: {{ team.categoryLabel }}
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
import { Facebook, Instagram } from "lucide-vue-next"
import { useJuevesData } from "~/composables/useJuevesData"

type UiTeamCard = {
  id: string
  name: string
  shortName?: string
  categoryLabel?: string
  divisionLabel?: string
  logoUrl?: string
  colorPrimary?: string
  colorSecondary?: string
  isActive: boolean
}

const ITEMS_PER_PAGE = 10

const route = useRoute()
const mobileOpen = ref(false)

const { leagueKey, toList, pick } = useJuevesData()

const activeOnly = ref(true)
const search = ref("")
const currentPage = ref(1)

const { data: teamsData, pending: pendingTeams, error: teamsError } =
  await useAsyncData("jueves-equipos-page", async () => {
    try {
      const raw = await $fetch<any>("/api/t5/teams", {
        query: {
          league: leagueKey,
          leagueKey,
          ...(activeOnly.value ? { isActive: true } : {}),
        },
      })

      const list = toList(raw)

      return list.map((t: any) => {
        const rawCategory = firstNonEmpty([
          pick(t, ["category.gender", "gender", "categoryGender"]),
          pick(t, ["category.name", "categoryName"]),
        ])

        const rawDivision = firstNonEmpty([
          pick(t, ["division.name", "divisionName"]),
          pick(t, ["category.code", "categoryCode", "code"]),
        ])

        const categoryLabel = formatCategory(rawCategory)
        let divisionLabel = formatDivision(rawDivision)

        if (categoryLabel && divisionLabel && categoryLabel.toLowerCase() === divisionLabel.toLowerCase()) {
          divisionLabel = ""
        }

        return {
          id: String(pick(t, ["teamId", "id"]) ?? t?.name ?? Math.random()),
          name: String(pick(t, ["name", "teamName"]) ?? "Equipo"),
          shortName: String(pick(t, ["shortName"]) ?? ""),
          categoryLabel,
          divisionLabel,
          logoUrl: String(
            pick(t, ["logoUrl", "logo", "imageUrl", "image", "teamLogo", "teamLogoUrl"]) ?? ""
          ),
          colorPrimary: normalizeColor(String(pick(t, ["colorPrimary"]) ?? "")),
          colorSecondary: normalizeColor(String(pick(t, ["colorSecondary"]) ?? "")),
          isActive: Boolean(pick(t, ["isActive", "active"]) ?? true),
        } as UiTeamCard
      })
    } catch {
      return []
    }
  }, { watch: [activeOnly] })

const filteredTeams = computed<UiTeamCard[]>(() => {
  const q = search.value.toLowerCase()
  if (!q) return teamsData.value ?? []

  return (teamsData.value ?? []).filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      (t.shortName || "").toLowerCase().includes(q) ||
      (t.categoryLabel || "").toLowerCase().includes(q) ||
      (t.divisionLabel || "").toLowerCase().includes(q)
    )
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

watch([search, activeOnly], () => {
  currentPage.value = 1
})

watch(totalTeamPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

function goToTeamPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalTeamPages.value)
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
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function firstNonEmpty(values: any[]) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value)
    }
  }
  return ""
}

function formatCategory(value: string) {
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
  if (/^[A-Z0-9\- ]+$/i.test(v)) return v.toUpperCase()
  return v
}

async function openTeam(id: string) {
  await navigateTo(`/jueves/equipos/${id}`)
}
</script>