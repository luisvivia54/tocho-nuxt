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
            Liga de Jueves · Partidos
          </div>

          <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Calendario de Partidos</h1>
          <p class="mt-4 text-slate-400">Consulta partidos programados y finalizados desde el backend.</p>
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
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="m in filteredMatches"
            :key="m.id"
            class="rounded-[24px] border border-white/8 bg-white/[0.03] px-6 py-5"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div class="text-lg font-black text-white">
                  {{ m.home }} <span class="mx-2 text-orange-400">vs</span> {{ m.away }}
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  {{ m.date }} · {{ m.time }}
                  <span v-if="m.venue"> · {{ m.venue }}</span>
                </div>
              </div>

              <div class="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Liga de Jueves
              </div>
            </div>
          </div>

          <div v-if="pendingGames" class="text-sm text-slate-400">Cargando partidos...</div>
          <div v-else-if="gamesError" class="text-sm text-rose-300">No se pudieron cargar partidos.</div>
          <div v-else-if="filteredMatches.length === 0" class="text-sm text-slate-400">No hay resultados.</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Facebook, Instagram } from "lucide-vue-next"
import { useJuevesData, type UiMatch } from "~/composables/useJuevesData"

const route = useRoute()
const mobileOpen = ref(false)

const { leagueKey, toList, toUiMatch } = useJuevesData()

const matchStatus = ref<"SCHEDULED" | "FINISHED" | "ALL">("SCHEDULED")
const search = ref("")

const { data: gamesData, pending: pendingGames, error: gamesError } =
  await useAsyncData("jueves-partidos-page", async () => {
    const wantScheduled = matchStatus.value !== "FINISHED"
    const wantFinished = matchStatus.value !== "SCHEDULED"

    const [scheduled, finished] = await Promise.all([
      wantScheduled
        ? $fetch<any>("/api/t5/games", {
            query: { league: leagueKey, leagueKey, status: "SCHEDULED", sort: "startTime,asc", limit: 80 },
          }).catch(() => [])
        : [],
      wantFinished
        ? $fetch<any>("/api/t5/gamesFinal", {
            query: { league: leagueKey, leagueKey, sort: "startTime,desc", limit: 80 },
          }).catch(() => [])
        : [],
    ])

    const merged = [...toList(scheduled), ...toList(finished)]
    return merged.map(toUiMatch)
  }, { watch: [matchStatus] })

const matches = computed<UiMatch[]>(() => gamesData.value ?? [])

const filteredMatches = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return matches.value
  return matches.value.filter((m) => `${m.home} ${m.away}`.toLowerCase().includes(q))
})
</script>