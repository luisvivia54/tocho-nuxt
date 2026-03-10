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
          <p class="mt-4 text-slate-400">Listado de equipos conectados al backend.</p>
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
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="team in paginatedTeams"
            :key="team.id"
            class="rounded-[24px] border border-white/8 bg-white/[0.03] p-6"
          >
            <div class="text-xl font-extrabold text-white">{{ team.name }}</div>
            <div v-if="team.category" class="mt-2 text-sm text-slate-400">{{ team.category }}</div>
          </div>
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
import { useJuevesData, type UiTeam } from "~/composables/useJuevesData"

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

      return list.map((t: any) => ({
        id: String(pick(t, ["id", "teamId"]) ?? t?.name ?? Math.random()),
        name: String(pick(t, ["name", "teamName"]) ?? "Equipo"),
        category: pick(t, ["category.name", "categoryName", "division.name"]),
      })) as UiTeam[]
    } catch {
      return []
    }
  }, { watch: [activeOnly] })

const filteredTeams = computed<UiTeam[]>(() => {
  const q = search.value.toLowerCase()
  if (!q) return teamsData.value ?? []
  return (teamsData.value ?? []).filter((t) => t.name.toLowerCase().includes(q))
})

const totalTeamPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTeams.value.length / ITEMS_PER_PAGE))
})

const paginatedTeams = computed<UiTeam[]>(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredTeams.value.slice(start, end)
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

watch([search, activeOnly], () => {
  currentPage.value = 1
})

watch(totalTeamPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

function goToTeamPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalTeamPages.value)
}
</script>