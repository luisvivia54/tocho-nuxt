<template>
  <main class="min-h-screen bg-[#020617] text-slate-50">
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
              class="text-[0.95rem] font-extrabold uppercase tracking-[0.24em] text-slate-400 hover:text-slate-200"
            >
              Inicio
            </NuxtLink>

            <NuxtLink
              to="/jueves/partidos"
              class="text-[0.95rem] font-extrabold uppercase tracking-[0.24em] text-slate-400 hover:text-slate-200"
            >
              Partidos
            </NuxtLink>

            <NuxtLink
              to="/jueves/equipos"
              class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] text-white"
            >
              Equipos
              <span class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400" />
            </NuxtLink>

            <NuxtLink
              to="/jueves/estadisticas"
              class="text-[0.95rem] font-extrabold uppercase tracking-[0.24em] text-slate-400 hover:text-slate-200"
            >
              Estadísticas
            </NuxtLink>
          </nav>

          <NuxtLink
            to="/jueves/equipos"
            class="hidden text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-slate-400 hover:text-slate-200 md:inline-flex"
          >
            ← Volver
          </NuxtLink>
        </div>
      </div>
    </header>

    <section class="pt-28 md:pt-32">
      <div class="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div class="mb-6 flex items-center justify-between gap-3">
          <NuxtLink
            to="/jueves/equipos"
            class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            ← Volver a equipos
          </NuxtLink>

          <p class="text-[11px] text-slate-500">
            ID equipo:
            <span class="font-mono text-slate-300">#{{ teamId }}</span>
          </p>
        </div>

        <div
          v-if="pendingDetail"
          class="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-400"
        >
          Cargando información del equipo...
        </div>

        <div
          v-else-if="detailError"
          class="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200"
        >
          No se pudo cargar el detalle del equipo.
        </div>

        <div
          v-else-if="!team"
          class="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-400"
        >
          No se encontró el equipo.
        </div>

        <template v-else>
          <!-- HERO -->
          <section
            class="relative overflow-hidden rounded-[32px] border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
            :style="heroStyle"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%,rgba(2,6,23,0.22))]" />

            <div class="relative grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8">
              <div class="flex items-start justify-center">
                <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-inner md:h-28 md:w-28">
                  <img
                    v-if="team.logoUrl"
                    :src="team.logoUrl"
                    :alt="team.name"
                    class="max-h-24 max-w-full object-contain"
                  />
                  <span v-else class="px-2 text-center text-base font-extrabold text-white">
                    {{ team.shortName || getInitials(team.name) }}
                  </span>
                </div>
              </div>

              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.24em] text-white/75">
                  Liga de Jueves
                </p>

                <h1 class="mt-2 break-words text-4xl font-extrabold text-white md:text-5xl">
                  {{ team.name }}
                </h1>

                <p
                  v-if="team.shortName"
                  class="mt-2 text-[12px] font-bold uppercase tracking-[0.24em] text-white/75"
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
                    class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold"
                    :class="team.isActive
                      ? 'border-emerald-400/30 bg-emerald-500/12 text-emerald-200'
                      : 'border-slate-400/30 bg-slate-500/12 text-slate-200'"
                  >
                    <span class="h-2 w-2 rounded-full" :class="team.isActive ? 'bg-emerald-400' : 'bg-slate-400'" />
                    {{ team.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- CONTENIDO -->
          <div class="mt-6 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <section class="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div class="flex h-full flex-col justify-center">
                <p class="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400">
                  Capitán
                </p>

                <h2 class="mt-4 text-3xl font-extrabold leading-tight text-white">
                  {{ team.captainName }}
                </h2>

                <p class="mt-4 text-sm leading-7 text-slate-400">
                  Responsable principal del equipo dentro de la Liga de Jueves.
                </p>
              </div>
            </section>

            <section class="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-xl font-extrabold text-white">Miembros del equipo</h2>
                  <p class="mt-1 text-xs text-slate-400">
                    {{ players.length }} jugador{{ players.length === 1 ? '' : 'es' }} registrados.
                  </p>
                </div>
              </div>

              <div v-if="players.length === 0" class="mt-5 text-sm text-slate-400">
                Aún no hay jugadores registrados en este equipo.
              </div>

              <div v-else class="mt-5 space-y-3">
                <article
                  v-for="player in players"
                  :key="player.id"
                  class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900">
                    <img
                      v-if="player.photoUrl"
                      :src="player.photoUrl"
                      :alt="player.fullName"
                      class="h-full w-full object-cover"
                    />
                    <span v-else class="text-[11px] font-bold text-slate-100">
                      {{ getInitials(player.fullName) }}
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-white">
                      {{ player.fullName }}
                    </p>
                    <p class="mt-1 text-[11px] text-slate-400">
                      <span v-if="player.jerseyNumber !== null && player.jerseyNumber !== undefined">
                        #{{ player.jerseyNumber }}
                      </span>

                      <span
                        v-if="player.jerseyNumber !== null && player.jerseyNumber !== undefined && getAgeFromBirthdate(player.birthdate) !== null"
                        class="mx-1"
                      >
                        ·
                      </span>

                      <span v-if="getAgeFromBirthdate(player.birthdate) !== null">
                        {{ getAgeFromBirthdate(player.birthdate) }} años
                      </span>
                    </p>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, useAsyncData, useRoute } from "#imports"

type CaptainDto = {
  id?: number
  fullName?: string
  name?: string
}

type TeamCategory = {
  id?: number
  name?: string
  label?: string
  title?: string
  code?: string
  gender?: string
}

type ApiTeam = {
  id?: number
  teamId?: number
  name?: string
  teamName?: string
  shortName?: string | null
  logoUrl?: string | null
  logo?: string | null
  colorPrimary?: string | null
  colorSecondary?: string | null
  isActive?: boolean | null
  active?: boolean | null
  description?: string | null
  teamDescription?: string | null
  about?: string | null
  bio?: string | null
  captain?: CaptainDto | string | null
  captainName?: string | null
  category?: TeamCategory | null
  categoryName?: string | null
  categoryCode?: string | null
  categoryGender?: string | null
}

type Player = {
  id: number
  fullName: string
  jerseyNumber: number | null
  birthdate: string | null
  photoUrl: string | null
}

type TeamDetailResponse = {
  team?: ApiTeam | null
  players?: Player[]
}

type UiTeamDetail = {
  id: number | null
  name: string
  shortName: string
  logoUrl: string | null
  colorPrimary: string
  colorSecondary: string
  isActive: boolean
  captainName: string
  categoryLabel: string
  branchLabel: string
}

const route = useRoute()
const teamId = computed(() => String(route.params.id ?? ""))

const { data: detailData, pending: pendingDetail, error: detailError } =
  await useAsyncData(
    () => `jueves-team-detail-${teamId.value}`,
    async () => {
      return await $fetch<TeamDetailResponse | ApiTeam>(`/api/t5/teams/${teamId.value}/detail`).catch(() => null)
    },
    { watch: [teamId] }
  )

const rawPayload = computed<any>(() => detailData.value ?? null)

const rawTeam = computed<ApiTeam | null>(() => {
  const payload = rawPayload.value
  if (!payload || typeof payload !== "object") return null
  return (payload.team ?? payload) as ApiTeam
})

const team = computed<UiTeamDetail | null>(() => {
  const source = rawTeam.value
  if (!source) return null

  const categoryName =
    firstValue(source, [
      "category.name",
      "category.label",
      "category.title",
      "categoryName",
    ]) || ""

  const categoryCode =
    normalizeCodeValue(
      firstValue(source, [
        "category.code",
        "categoryCode",
      ])
    ) || ""

  const categoryGender =
    normalizeGenderValue(
      firstValue(source, [
        "category.gender",
        "categoryGender",
      ])
    ) || ""

  const categoryLabel = categoryName || niceGender(categoryGender) || categoryCode
  const branchLabel = categoryCode || niceGender(categoryGender)

  return {
    id: toNullableNumber(firstValue(source, ["teamId", "id"])),
    name: firstValue(source, ["name", "teamName"]) || "Equipo",
    shortName: firstValue(source, ["shortName"]) || "",
    logoUrl: normalizeUrl(firstValue(source, ["logoUrl", "logo"]) || null),
    colorPrimary: normalizeColor(firstValue(source, ["colorPrimary"]) || "#f97316"),
    colorSecondary: normalizeColor(firstValue(source, ["colorSecondary"]) || "#1e293b"),
    isActive: toBoolean(firstValue(source, ["isActive", "active"]), true),
    captainName: getCaptainName(source),
    categoryLabel,
    branchLabel,
  }
})

const players = computed<Player[]>(() => {
  const payload = rawPayload.value
  const source = Array.isArray(payload?.players) ? payload.players : []

  return source.map((player: any) => ({
    id: Number(player?.id ?? 0),
    fullName: String(player?.fullName ?? player?.name ?? "Jugador"),
    jerseyNumber: toNullableNumber(player?.jerseyNumber),
    birthdate: player?.birthdate ? String(player.birthdate) : null,
    photoUrl: normalizeUrl(
      firstValue(player, ["photoUrl", "photo_url", "imageUrl", "image", "avatar"]) || null
    ),
  }))
})

const primaryColor = computed(() => team.value?.colorPrimary || "#f97316")
const secondaryColor = computed(() => team.value?.colorSecondary || "#1e293b")

const heroStyle = computed(() => {
  return {
    backgroundImage: `
      radial-gradient(circle at 0% 0%, ${primaryColor.value}, transparent 55%),
      radial-gradient(circle at 100% 100%, ${secondaryColor.value}, transparent 55%),
      linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))
    `,
  }
})

function normalizeUrl(url: string | null) {
  if (!url || url === "NULL") return null
  return url
}

function normalizeColor(value: string) {
  const color = String(value || "").trim()
  if (!color) return "#f97316"
  if (color.startsWith("#")) return color

  const hexOnly = color.replace(/[^0-9a-fA-F]/g, "")
  if (hexOnly.length === 6) return `#${hexOnly}`
  if (hexOnly.length === 3) return `#${hexOnly}`

  return color
}

function toNullableNumber(value: any): number | null {
  if (value === null || value === undefined || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function toBoolean(value: any, fallback = true) {
  if (typeof value === "boolean") return value
  if (value === null || value === undefined || value === "") return fallback

  const v = normalizeText(String(value))
  if (["false", "0", "inactive", "inactivo"].includes(v)) return false
  if (["true", "1", "active", "activo"].includes(v)) return true
  return fallback
}

function getInitials(name: string) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function getAgeFromBirthdate(birthdate: string | null) {
  if (!birthdate) return null

  const date = new Date(birthdate)
  if (Number.isNaN(date.getTime())) return null

  const now = new Date()
  let age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1
  }

  return age
}

function niceGender(gender: string) {
  const x = String(gender || "").toUpperCase()
  if (x === "VARONIL") return "Varonil"
  if (x === "FEMENIL") return "Femenil"
  if (x === "MIXTO") return "Mixto"
  return gender
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

function readPath(obj: any, path: string) {
  return path.split(".").reduce((acc: any, key) => {
    if (acc === null || acc === undefined) return undefined
    return acc[key]
  }, obj)
}

function getCaptainName(source: ApiTeam) {
  const captain = source?.captain
  if (typeof captain === "string" && captain.trim()) return captain.trim()
  if (captain && typeof captain === "object") {
    return String(captain.fullName || captain.name || "").trim() || "Por definir"
  }

  const direct = firstValue(source, ["captainName"])
  return direct || "Por definir"
}
</script>