<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Mi equipo</p>
            <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">Mi equipo</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Aquí verás tus equipos como capitán o admin, y podrás entrar a editar sus datos.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink
              to="/jueves"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              ← Volver al inicio
            </NuxtLink>

            <NuxtLink
              v-if="canCreate"
              to="/jueves/registro"
              class="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110"
            >
              Registrar equipo
            </NuxtLink>
          </div>
        </header>

        <div
          v-if="statusMsg"
          class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          {{ statusMsg }}
        </div>

        <div
          v-if="errorMsg"
          class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
        >
          {{ errorMsg }}
        </div>

        <div v-if="!kcReady" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Inicializando sesión…</p>
          <p class="mt-1 text-sm text-slate-400">Espera a que Keycloak esté listo.</p>
        </div>

        <div v-else-if="!isAuthenticated" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p class="font-semibold text-white">Necesitas iniciar sesión</p>
          <p class="mt-1 text-sm text-slate-400">Debes autenticarte para ver tus equipos.</p>

          <button
            type="button"
            class="mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white"
            @click="login"
          >
            Iniciar sesión
          </button>
        </div>

        <div v-else class="mt-6 space-y-6">
          <!-- SUMMARY -->
          <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Rol</p>
                <p class="mt-2 text-2xl font-extrabold text-white">{{ roleLabel }}</p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Equipos como capitán</p>
                <p class="mt-2 text-2xl font-extrabold text-white">{{ totalTeamsCount }} / {{ effectiveMaxTeams }}</p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">¿Puede crear equipo?</p>
                <p class="mt-2 text-2xl font-extrabold" :class="canCreate ? 'text-emerald-300' : 'text-rose-300'">
                  {{ canCreate ? 'Sí' : 'No' }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <p class="text-sm text-slate-400">
                <template v-if="totalTeamsCount > 0">
                  Tienes {{ totalTeamsCount }} equipo(s) registrado(s) a tu nombre en ambas ligas.
                  <span class="text-slate-500">Abajo se muestran solo {{ visibleTeams.length }} de la liga de jueves.</span>
                </template>
                <template v-else>
                  Todavía no tienes equipos registrados.
                </template>
              </p>

              <button
                type="button"
                class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                :disabled="loading"
                @click="loadTeams"
              >
                {{ loading ? 'Actualizando…' : 'Actualizar' }}
              </button>
            </div>
          </section>

          <!-- TEAMS -->
          <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div v-if="loading" class="text-sm text-slate-400">Cargando tus equipos…</div>

            <div v-else-if="visibleTeams.length === 0" class="rounded-2xl border border-white/10 bg-[#0B1020]/60 p-5">
              <p class="text-lg font-bold text-white">Aún no tienes equipos de jueves</p>
              <p class="mt-2 text-sm text-slate-400">
                Puedes registrar uno nuevo desde la pestaña de registro.
              </p>

              <NuxtLink
                v-if="canCreate"
                to="/jueves/registro"
                class="mt-4 inline-flex rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white"
              >
                Registrar equipo
              </NuxtLink>
            </div>

            <div v-else class="grid gap-4 md:grid-cols-2">
              <article
                v-for="team in visibleTeams"
                :key="team.id"
                class="rounded-3xl border p-5 transition"
                :class="highlightId === team.id
                  ? 'border-orange-400/40 bg-orange-500/10 shadow-[0_10px_28px_rgba(249,115,22,0.12)]'
                  : 'border-white/10 bg-[#0B1020]/70 hover:bg-[#0D1325]'"
              >
                <div class="flex items-start gap-4">
                  <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08101E]">
                    <img
                      v-if="team.logoUrl"
                      :src="team.logoUrl"
                      :alt="team.name"
                      class="max-h-12 max-w-12 object-contain"
                    />
                    <span v-else class="text-sm font-extrabold text-orange-300">
                      {{ initials(team.name) }}
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-2xl font-extrabold text-white">{{ team.name }}</p>
                    <p class="mt-1 text-sm text-slate-400">
                      ID: {{ team.id }}
                      <span class="text-slate-600">·</span>
                      Liga: {{ team.leagueId ?? "—" }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-if="team.shortName"
                        class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                      >
                        {{ team.shortName }}
                      </span>

                      <span
                        v-if="team.categoryName"
                        class="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200"
                      >
                        {{ team.categoryName }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <NuxtLink
                    :to="`/jueves/equipos?highlight=${team.id}`"
                    class="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-orange-100"
                  >
                    Ver equipo
                  </NuxtLink>

                  <NuxtLink
                    :to="`/jueves/registro?teamId=${team.id}`"
                    class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Editar datos
                  </NuxtLink>

                  <span class="text-sm text-slate-500">Temporada: {{ team.seasonId ?? "—" }}</span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useNuxtApp, useRoute, useRuntimeConfig, useState } from "#imports"
import { useAuthz } from "~/composables/useAuthz"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

type HeadersMap = Record<string, string>

type TeamCard = {
  id: number
  name: string
  shortName: string
  logoUrl: string
  leagueId: number | null
  seasonId: number | null
  categoryName: string
}

const JUEVES_LEAGUE_ID = 2

function normalizeApiBase(v: string) {
  const s = String(v || "").trim().replace(/\/+$/, "")
  if (!s) return "https://tocho5-api.tochero5.mx/api"
  return s.endsWith("/api") ? s : `${s}/api`
}

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x
  if (x && Array.isArray(x.content)) return x.content
  if (x && Array.isArray(x.items)) return x.items
  if (x && Array.isArray(x.data)) return x.data
  if (x && Array.isArray(x.teams)) return x.teams
  return []
}

function initials(text: string) {
  const s = String(text || "").trim()
  if (!s) return "T5"
  return s
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("")
}

function toNullablePositiveNumber(value: any): number | null {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

const nuxtApp = useNuxtApp()
const route = useRoute()
const runtime = useRuntimeConfig()
const kcReady = useState<boolean>("kcReady", () => false)
const { isAuthenticated } = useAuthz() as any

const API_BASE = normalizeApiBase(((runtime.public as any)?.apiBase as string) || "https://tocho5-api.tochero5.mx")
const runtimeMaxTeams = Number((runtime.public as any)?.maxTeamsPerCaptain ?? 20)

const statusMsg = ref("")
const errorMsg = ref("")
const loading = ref(false)
const teams = ref<TeamCard[]>([])

const backendTotalTeams = ref<number | null>(null)
const backendMaxTeams = ref<number | null>(null)
const backendCanCreate = ref<boolean | null>(null)
const backendRole = ref<string>("")

const highlightId = computed<number | null>(() => {
  const n = Number(route.query.highlight ?? 0)
  return Number.isFinite(n) && n > 0 ? n : null
})

const visibleTeams = computed<TeamCard[]>(() => {
  return teams.value.filter((team) => team.leagueId === JUEVES_LEAGUE_ID)
})

const totalTeamsCount = computed(() => {
  return backendTotalTeams.value ?? teams.value.length
})

const effectiveMaxTeams = computed(() => {
  return backendMaxTeams.value ?? runtimeMaxTeams
})

function login() {
  const kc = (nuxtApp as any).$kc
  if (!kc?.login) return
  kc.login({ redirectUri: window.location.href })
}

const roleLabel = computed(() => {
  if (backendRole.value) return backendRole.value

  const kc = (nuxtApp as any).$kc
  const roles: string[] =
    kc?.tokenParsed?.realm_access?.roles ||
    kc?.tokenParsed?.resource_access?.["nuxt-app"]?.roles ||
    []

  if (roles.map((r) => String(r).toLowerCase()).includes("admin")) return "ADMIN"
  if (roles.map((r) => String(r).toLowerCase()).includes("captain")) return "CAPITÁN"
  return "USUARIO"
})

const canCreate = computed(() => {
  if (backendCanCreate.value !== null) return backendCanCreate.value
  return totalTeamsCount.value < effectiveMaxTeams.value
})

async function getAccessToken(): Promise<string | null> {
  const app: any = nuxtApp as any
  const kc: any = app.$kc

  try {
    await kc?.updateToken?.(30)
  } catch {}

  if (typeof kc?.token === "string" && kc.token.length > 20) return kc.token

  if (typeof app.$kcGetToken === "function") {
    try {
      const t = await app.$kcGetToken()
      if (typeof t === "string" && t.length > 20) return t
    } catch {}
  }

  if (typeof app.$getToken === "function") {
    try {
      const t = await app.$getToken()
      if (typeof t === "string" && t.length > 20) return t
    } catch {}
  }

  return null
}

async function authHeaders(): Promise<HeadersMap> {
  const token = await getAccessToken()
  const h: HeadersMap = {}
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

function normalizeTeams(payload: any): TeamCard[] {
  const arr = unwrapList<any>(payload)

  return arr
    .map((t) => ({
      id: Number(t?.id ?? t?.teamId ?? t?.team_id ?? 0),
      name: String(t?.name ?? t?.teamName ?? t?.team_name ?? "Equipo"),
      shortName: String(t?.shortName ?? t?.short_name ?? ""),
      logoUrl: String(t?.logoUrl ?? t?.logo_url ?? t?.photoUrl ?? t?.photo_url ?? ""),
      leagueId: Number(
        t?.leagueId ??
        t?.league_id ??
        t?.league?.league_id ??
        t?.league?.leagueId ??
        t?.league?.id ??
        0
      ) || null,
      seasonId: Number(
        t?.seasonId ??
        t?.season_id ??
        t?.season?.id ??
        0
      ) || null,
      categoryName: String(
        t?.category?.name ??
        t?.categoryName ??
        t?.category_name ??
        ""
      ),
    }))
    .filter((t) => Number.isFinite(t.id) && t.id > 0)
}

function hydrateSummary(payload: any) {
  backendTotalTeams.value = toNullablePositiveNumber(
    payload?.currentTeams ??
    payload?.current_teams ??
    payload?.totalTeams ??
    payload?.total_teams
  )

  backendMaxTeams.value = toNullablePositiveNumber(
    payload?.maxTeamsAllowed ??
    payload?.max_teams_allowed ??
    payload?.maxTeams ??
    payload?.max_teams
  )

  backendCanCreate.value =
    typeof payload?.canCreateTeam === "boolean"
      ? payload.canCreateTeam
      : typeof payload?.can_create_team === "boolean"
        ? payload.can_create_team
        : null

  const rawRole = String(payload?.role ?? "").trim().toLowerCase()
  if (rawRole === "admin") backendRole.value = "ADMIN"
  else if (rawRole === "captain") backendRole.value = "CAPITÁN"
  else if (rawRole) backendRole.value = rawRole.toUpperCase()
  else backendRole.value = ""
}

function resetSummaryState() {
  backendTotalTeams.value = null
  backendMaxTeams.value = null
  backendCanCreate.value = null
  backendRole.value = ""
}

async function loadTeams() {
  loading.value = true
  errorMsg.value = ""
  statusMsg.value = ""

  try {
    const headers = await authHeaders()
    if (!headers.Authorization) throw new Error("No hay sesión activa.")

    resetSummaryState()

    const candidates = [
      { url: `${API_BASE}/teams/mine` },
      { url: `${API_BASE}/teams/me` },
      { url: `${API_BASE}/users/me/teams` },
      { url: `${API_BASE}/captain/teams` },
    ]

    let loaded = false
    let lastError: any = null

    for (const candidate of candidates) {
      try {
        const raw = await $fetch<any>(candidate.url, {
          method: "GET",
          headers,
        })

        hydrateSummary(raw)
        teams.value = normalizeTeams(raw)
        loaded = true
        break
      } catch (e: any) {
        lastError = e
        const st = e?.status || e?.statusCode
        if (st === 404) continue
        break
      }
    }

    if (!loaded && lastError) {
      throw lastError
    }

    statusMsg.value = loaded
      ? "Equipos cargados correctamente. Abajo se muestran solo los de la liga de jueves."
      : "No se encontraron equipos registrados."
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || "No se pudieron cargar tus equipos."
  } finally {
    loading.value = false
  }
}

watch(
  () => [kcReady.value, isAuthenticated.value],
  async ([ready, auth]) => {
    if (ready && auth) {
      await loadTeams()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (kcReady.value && isAuthenticated.value) {
    await loadTeams()
  }
})
</script>