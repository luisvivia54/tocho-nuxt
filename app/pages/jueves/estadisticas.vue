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
            Liga de Jueves · Estadísticas
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Estadísticas</h1>
          <p class="mt-4 text-slate-400">Resumen general conectado al backend.</p>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div class="rounded-[24px] border border-white/8 bg-white/[0.03] p-6">
            <div class="text-4xl font-extrabold text-white">{{ teamsCount }}</div>
            <div class="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">Equipos</div>
          </div>

          <div class="rounded-[24px] border border-white/8 bg-white/[0.03] p-6">
            <div class="text-4xl font-extrabold text-white">{{ scheduledCount }}</div>
            <div class="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">Programados</div>
          </div>

          <div class="rounded-[24px] border border-white/8 bg-white/[0.03] p-6">
            <div class="text-4xl font-extrabold text-white">{{ finishedCount }}</div>
            <div class="mt-2 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">Finalizados</div>
          </div>
        </div>

        <div class="mt-8 rounded-[24px] border border-white/8 bg-white/[0.03] p-6">
          <div class="text-lg font-bold text-white">Última actualización</div>
          <div class="mt-2 text-slate-400">{{ lastUpdated }}</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Facebook, Instagram } from "lucide-vue-next"
import { useJuevesData } from "~/composables/useJuevesData"

const route = useRoute()
const mobileOpen = ref(false)

const { leagueKey, toList } = useJuevesData()

const { data: statsData } = await useAsyncData("jueves-stats-page", async () => {
  const [teams, scheduled, finished] = await Promise.all([
    $fetch<any>("/api/t5/teams", { query: { league: leagueKey, leagueKey, isActive: true } }).catch(() => []),
    $fetch<any>("/api/t5/games", { query: { league: leagueKey, leagueKey, status: "SCHEDULED", limit: 200 } }).catch(() => []),
    $fetch<any>("/api/t5/gamesFinal", { query: { league: leagueKey, leagueKey, limit: 200 } }).catch(() => []),
  ])

  return {
    teamsCount: toList(teams).length,
    scheduledCount: toList(scheduled).length,
    finishedCount: toList(finished).length,
  }
})

const teamsCount = computed(() => statsData.value?.teamsCount ?? 0)
const scheduledCount = computed(() => statsData.value?.scheduledCount ?? 0)
const finishedCount = computed(() => statsData.value?.finishedCount ?? 0)

const lastUpdated = computed(() =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date())
)
</script>