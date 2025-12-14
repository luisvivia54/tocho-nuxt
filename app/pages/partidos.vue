<template>
  <main class="bg-slate-950 min-h-screen text-slate-50">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto px-6">
        <!-- HEADER -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div class="space-y-2">
            <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Tochero5 · Calendario oficial
            </p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">
              Partidos de la temporada
            </h1>
            <p class="text-sm text-slate-300 max-w-xl">
              Filtra por jornada, categoría y rama.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="refresh()"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              ⟳ Refrescar
            </button>

            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              ← Volver al inicio
            </NuxtLink>
          </div>
        </header>

        <!-- FILTROS -->
        <section
          class="mb-6 rounded-3xl border border-slate-800/70 bg-slate-900/45 px-4 py-4 md:px-6 shadow-[0_18px_45px_rgba(0,0,0,0.30)]"
        >
          <div class="grid gap-4 md:grid-cols-12">
            <!-- Jornada -->
            <div class="md:col-span-6">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Jornada</p>
                <button
                  type="button"
                  @click="roundPick = 'ALL'"
                  class="text-[11px] font-semibold text-slate-300 hover:text-slate-100 underline underline-offset-4"
                >
                  Limpiar
                </button>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <div class="seg-wrap">
                  <button type="button" @click="roundPick = 'ALL'" :class="segBtn(roundPick === 'ALL')">
                    Todas
                  </button>

                  <button
                    v-for="r in roundOptions"
                    :key="r.round"
                    type="button"
                    @click="roundPick = r.round"
                    :class="segBtn(roundPick === r.round, 'amber')"
                    :title="`${r.count} partido(s)`"
                  >
                    J{{ r.round }}
                    <span class="ml-2 count-pill">{{ r.count }}</span>
                  </button>
                </div>

                <div class="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2">
                  <span class="text-slate-500 text-xs">#</span>
                  <input
                    v-model.trim="roundInput"
                    type="text"
                    inputmode="numeric"
                    placeholder="Ej. 3"
                    class="w-20 bg-transparent outline-none placeholder:text-slate-500 text-xs text-slate-100"
                    @keydown.enter.prevent="applyRoundInput()"
                  />
                  <button
                    type="button"
                    class="text-[11px] font-semibold text-blue-200 hover:text-blue-100 underline underline-offset-4"
                    @click="applyRoundInput()"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>

            <!-- Categoría -->
            <div class="md:col-span-3">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Categoría</p>
                <button
                  type="button"
                  @click="categoria = 'ALL'"
                  class="text-[11px] font-semibold text-slate-300 hover:text-slate-100 underline underline-offset-4"
                >
                  Limpiar
                </button>
              </div>

              <div class="seg-wrap">
                <button type="button" @click="categoria = 'ALL'" :class="segBtn(categoria === 'ALL')">
                  Todas
                </button>

                <button
                  v-for="opt in categoriaOptions"
                  :key="opt.value"
                  type="button"
                  @click="categoria = opt.value"
                  :disabled="opt.count === 0"
                  :class="segBtn(categoria === opt.value, 'emerald', opt.count === 0)"
                  :title="opt.count ? `${opt.count} partido(s)` : 'Sin partidos'"
                >
                  {{ niceGender(opt.value) }}
                  <span class="ml-2 count-pill">{{ opt.count }}</span>
                </button>
              </div>
            </div>

            <!-- Rama -->
            <div class="md:col-span-3">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Rama</p>
                <button
                  type="button"
                  @click="rama = 'ALL'"
                  class="text-[11px] font-semibold text-slate-300 hover:text-slate-100 underline underline-offset-4"
                  :disabled="!canPickRama"
                  :class="!canPickRama ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  Limpiar
                </button>
              </div>

              <div class="seg-wrap">
                <button
                  type="button"
                  @click="rama = 'ALL'"
                  :disabled="!canPickRama"
                  :class="segBtn(rama === 'ALL', 'base', !canPickRama)"
                  :title="!canPickRama ? 'Elige categoría primero' : ''"
                >
                  Todas
                </button>

                <button
                  v-for="opt in ramaOptions"
                  :key="opt.value"
                  type="button"
                  @click="rama = opt.value"
                  :disabled="!canPickRama"
                  :class="segBtn(rama === opt.value, 'blue', !canPickRama)"
                  :title="!canPickRama ? 'Elige categoría primero' : `${opt.count} partido(s)`"
                >
                  {{ opt.value }}
                  <span class="ml-2 count-pill">{{ opt.count }}</span>
                </button>
              </div>

              <p v-if="!canPickRama" class="mt-2 text-[11px] text-slate-500">
                Selecciona una categoría para habilitar rama.
              </p>
            </div>

            <!-- Estado / Contadores -->
            <div class="md:col-span-12">
              <div class="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p class="text-[11px] text-slate-400">
                  <span v-if="pending">Cargando partidos…</span>
                  <span v-else>
                    Mostrando
                    <span class="text-slate-100 font-semibold">{{ renderedCount }}</span>
                    de
                    <span class="text-slate-100 font-semibold">{{ filteredTotal }}</span>
                    partido(s)
                  </span>
                </p>

                <div
                  v-if="needsRama"
                  class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100"
                >
                  ⚠️ Selecciona la rama.
                </div>

                <button
                  type="button"
                  @click="resetFilters()"
                  class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/40 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-900/60 hover:border-slate-500 transition"
                >
                  Limpiar filtros
                </button>
              </div>

              <p v-if="errorMsg" class="mt-2 text-xs text-rose-300">
                {{ errorMsg }}
              </p>
            </div>
          </div>
        </section>

        <!-- LISTA -->
        <section class="space-y-6">
          <div v-if="!pending && filteredTotal === 0" class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p class="text-sm text-slate-200 font-semibold">No hay partidos con esos filtros.</p>
            <p class="text-xs text-slate-400 mt-1">Cambia jornada / categoría / rama o limpia filtros.</p>
          </div>

          <div v-for="group in grouped" :key="group.key" class="space-y-3">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="h-px flex-1 bg-slate-800"></span>
              <span class="uppercase tracking-[0.16em]">{{ group.label }}</span>
              <span class="h-px flex-1 bg-slate-800"></span>
            </div>

            <article
              v-for="g in group.items"
              :key="g.id"
              class="rounded-3xl border border-slate-800/80 bg-slate-900/55 px-4 md:px-6 py-4 md:py-5 hover:border-slate-600 transition shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
              style="content-visibility:auto; contain-intrinsic-size: 220px;"
            >
              <!-- Header -->
              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
                  <span :class="badgeClass(g.status)">
                    <span v-if="upper(g.status) === 'SCHEDULED'" class="h-1.5 w-1.5 rounded-full bg-blue-300" />
                    <span v-else-if="upper(g.status) === 'FINAL'" class="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {{ statusLabel(g.status) }}
                  </span>

                  <span class="text-slate-500">·</span>
                  <span class="text-slate-200 font-medium">{{ g.categoryName }}</span>

                  <span class="text-slate-500" v-if="g.gender">·</span>
                  <span v-if="g.gender">{{ niceGender(g.gender) }}</span>

                  <span class="text-slate-500" v-if="g.round">·</span>
                  <span v-if="g.round">Jornada: {{ g.round }}</span>

                  <span class="text-slate-500" v-if="g.code">·</span>
                  <span v-if="g.code">Rama: {{ g.code }}</span>
                </div>

                <div class="text-right text-[11px] text-slate-300">
                  <p class="font-semibold text-slate-100">{{ g.timeLabel }}</p>
                  <p class="text-slate-500">{{ timeHintMs(g.ms, g.status) }}</p>
                </div>
              </div>

              <!-- Main -->
              <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                <!-- Local -->
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-12 w-12 rounded-2xl bg-slate-950/60 border border-slate-700/70 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="g.homeLogo"
                      :src="g.homeLogo"
                      :alt="g.homeName"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span v-else class="text-[12px] font-extrabold text-blue-200">
                      {{ initials(g.homeShort || g.homeName || 'T5') }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <p class="text-sm md:text-base font-semibold text-slate-50 truncate">
                      {{ g.homeName }}
                    </p>
                    <p class="text-[11px] text-slate-400 truncate">
                      {{ g.homeShort || '—' }}
                    </p>
                  </div>
                </div>

                <!-- Centro -->
                <div class="flex flex-col items-center justify-center min-w-[120px]">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">Horario</p>
                  <p class="text-lg md:text-xl font-bold text-slate-50">{{ g.timeLabel }}</p>
                  <p class="text-[11px] mt-0.5 text-slate-500">
                    {{ upper(g.status) === 'FINAL' ? 'Partido finalizado' : 'A la espera de kickoff' }}
                  </p>
                </div>

                <!-- Visitante -->
                <div class="flex items-center justify-end gap-3 min-w-0">
                  <div class="text-right min-w-0">
                    <p class="text-sm md:text-base font-semibold text-slate-50 truncate">
                      {{ g.awayName }}
                    </p>
                    <p class="text-[11px] text-slate-400 truncate">
                      {{ g.awayShort || '—' }}
                    </p>
                  </div>

                  <div class="h-12 w-12 rounded-2xl bg-slate-950/60 border border-slate-700/70 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="g.awayLogo"
                      :src="g.awayLogo"
                      :alt="g.awayName"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span v-else class="text-[12px] font-extrabold text-emerald-200">
                      {{ initials(g.awayShort || g.awayName || 'T5') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer (sin botón detalle) -->
              <div class="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                <p class="truncate">
                  ID: <span class="text-slate-200 font-semibold">{{ g.id }}</span>
                  <span class="text-slate-600">·</span>
                  Temporada: <span class="text-slate-200 font-semibold">{{ g.seasonId }}</span>
                </p>

                <span class="text-slate-500">
                  {{ upper(g.status) === 'FINAL' ? 'Final' : 'Programado' }}
                </span>
              </div>
            </article>
          </div>

          <!-- LOAD MORE -->
          <div v-if="!pending && filteredTotal > renderedCount" class="pt-2">
            <button
              type="button"
              @click="renderLimit += 80"
              class="w-full rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition"
            >
              Cargar más ({{ Math.min(80, filteredTotal - renderedCount) }})
            </button>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { markRaw, shallowRef, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO' | string

type Team = {
  teamId: number
  name?: string
  shortName?: string
  logoUrl?: string
}

type Category = {
  id: number
  name?: string
  code?: string
  gender?: Gender
}

type Game = {
  game_id: number
  season_id: number
  status: string
  match_date_utc: string
  round_la?: string | null
  roundLabel?: string | null
  homeTeam?: Team | null
  awayTeam?: Team | null
  category?: Category | null
  home_team?: string | null
  away_team?: string | null
}

type VMGame = {
  id: number
  seasonId: number
  status: string
  ms: number
  dateKey: string
  dayLabel: string
  timeLabel: string
  round: string | null
  gender: string | null
  code: string | null
  categoryName: string
  homeName: string
  awayName: string
  homeShort: string
  awayShort: string
  homeLogo: string | null
  awayLogo: string | null
}

type Group = { key: string; label: string; items: VMGame[] }

const config = useRuntimeConfig()
const API_BASE = (config.public as any)?.apiBase || 'https://tocho5-api.tochero5.mx/api'

/** filtros */
const roundPick = ref<'ALL' | string>('ALL')
const roundInput = ref('')
const categoria = ref<'ALL' | Gender>('ALL')
const rama = ref<'ALL' | string>('ALL')

const canPickRama = computed(() => categoria.value !== 'ALL')
const needsRama = computed(() => categoria.value !== 'ALL' && rama.value === 'ALL')

watch(categoria, () => {
  rama.value = 'ALL'
})

/** rendimiento DOM */
const renderLimit = ref(80)
watch([roundPick, categoria, rama], () => (renderLimit.value = 80))

/** “ahora” controlado (evita Date.now() por item y reduce jank) */
const nowMs = ref(0)
let tmr: any = null
onMounted(() => {
  nowMs.value = Date.now()
  tmr = setInterval(() => (nowMs.value = Date.now()), 60_000)
})
onBeforeUnmount(() => {
  if (tmr) clearInterval(tmr)
})

/** formatters (instancia única) */
const timeFmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  hour: '2-digit',
  minute: '2-digit',
})
const weekdayFmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  weekday: 'long',
})
const dateFmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

/** fetch 1 vez: scheduled + finals */
const { data, pending, error, refresh } = useAsyncData<Game[]>(
  'games-calendar-fast-v2',
  async () => {
    const [scheduled, finals] = await Promise.all([
      $fetch<Game[]>(`${API_BASE}/games`).catch(() => []),
      $fetch<Game[]>(`${API_BASE}/gamesFinal`).catch(() => []),
    ])
    const map = new Map<number, Game>()
    for (const g of [...scheduled, ...finals]) map.set(g.game_id, g)
    return Array.from(map.values())
  }
)

const errorMsg = computed(() => (error.value ? 'Error cargando partidos. Revisa el endpoint o logs del back.' : ''))

/** VM + contadores precalculados (1 sola vez por carga) */
const vmAll = shallowRef<VMGame[]>(markRaw([]))
const roundCounts = shallowRef<Record<string, number>>(markRaw({}))
const genderCounts = shallowRef<Record<string, number>>(markRaw({}))
const ramaCountsByGender = shallowRef<Record<string, Record<string, number>>>(markRaw({}))

watch(
  data,
  (raw) => {
    const list = raw ?? []
    const out: VMGame[] = []
    const rc: Record<string, number> = {}
    const gc: Record<string, number> = {}
    const rbg: Record<string, Record<string, number>> = {}

    const dayLabelCache = new Map<string, string>()

    for (const g of list) {
      const ms = toUtcMs(g.match_date_utc)
      const d = new Date(ms)
      const dateKey = d.toISOString().slice(0, 10)

      let dayLabel = dayLabelCache.get(dateKey)
      if (!dayLabel) {
        const anchor = new Date(`${dateKey}T12:00:00Z`)
        dayLabel = `${capitalize(weekdayFmt.format(anchor))} · ${dateFmt.format(anchor)}`
        dayLabelCache.set(dateKey, dayLabel)
      }

      const round = roundNumber(g)
      const gen = g.category?.gender ? upper(g.category.gender) : null
      const code = g.category?.code ? String(g.category.code) : null

      if (round) rc[round] = (rc[round] ?? 0) + 1
      if (gen) gc[gen] = (gc[gen] ?? 0) + 1
      if (gen && code) {
  const bucket = (rbg[gen] ??= {}) // asegura el objeto
  bucket[code] = (bucket[code] ?? 0) + 1
}
      const homeName = (g.home_team ?? g.homeTeam?.name ?? 'Local').trim()
      const awayName = (g.away_team ?? g.awayTeam?.name ?? 'Visitante').trim()

      out.push({
        id: g.game_id,
        seasonId: g.season_id,
        status: g.status,
        ms,
        dateKey,
        dayLabel,
        timeLabel: timeFmt.format(d),
        round,
        gender: gen,
        code,
        categoryName: (g.category?.name ?? `Categoría ${g.category?.id ?? ''}`).trim(),
        homeName,
        awayName,
        homeShort: (g.homeTeam?.shortName ?? '').trim(),
        awayShort: (g.awayTeam?.shortName ?? '').trim(),
        homeLogo: g.homeTeam?.logoUrl ?? null,
        awayLogo: g.awayTeam?.logoUrl ?? null,
      })
    }

    out.sort((a, b) => a.ms - b.ms)

    vmAll.value = markRaw(out)
    roundCounts.value = markRaw(rc)
    genderCounts.value = markRaw(gc)
    ramaCountsByGender.value = markRaw(rbg)
  },
  { immediate: true }
)

/** opciones */
const roundOptions = computed(() => {
  const entries = Object.entries(roundCounts.value)
    .map(([round, count]) => ({ round, count }))
    .sort((a, b) => Number(a.round) - Number(b.round))
  return entries
})

const categoriaOptions = computed(() => {
  const base: Gender[] = ['VARONIL', 'FEMENIL', 'MIXTO']
  const gc = genderCounts.value
  return base.map((v) => ({ value: v, count: gc[upper(v)] ?? 0 }))
})

const ramaOptions = computed(() => {
  if (categoria.value === 'ALL') return []
  const gen = upper(categoria.value)
  const map = ramaCountsByGender.value[gen] || {}
  return Object.entries(map)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value))
})

/** agrupado + contadores SIN side-effects */
const groupedState = computed(() => {
  const rp = roundPick.value === 'ALL' ? null : normalizeRound(roundPick.value)
  const cg = categoria.value === 'ALL' ? null : upper(categoria.value)
  const rc = rama.value === 'ALL' ? null : upper(rama.value)

  // si eligió categoría pero no rama -> no render
  if (needsRama.value) return { groups: [] as Group[], total: 0, rendered: 0 }

  const limit = renderLimit.value
  const groups: Group[] = []
  const byKey: Record<string, Group> = {}

  let total = 0
  let rendered = 0

  for (const g of vmAll.value) {
    if (rp && normalizeRound(g.round ?? '') !== rp) continue
    if (cg && upper(g.gender ?? '') !== cg) continue
    if (cg && rc && upper(g.code ?? '') !== rc) continue

    total++
    if (rendered >= limit) continue

    let grp = byKey[g.dateKey]
    if (!grp) {
      grp = { key: g.dateKey, label: g.dayLabel, items: [] }
      byKey[g.dateKey] = grp
      groups.push(grp)
    }
    grp.items.push(g)
    rendered++
  }

  return { groups, total, rendered }
})

const grouped = computed(() => groupedState.value.groups)
const filteredTotal = computed(() => groupedState.value.total)
const renderedCount = computed(() => groupedState.value.rendered)

/** acciones */
function resetFilters() {
  roundPick.value = 'ALL'
  roundInput.value = ''
  categoria.value = 'ALL'
  rama.value = 'ALL'
  renderLimit.value = 80
}

function applyRoundInput() {
  const v = normalize(roundInput.value)
  if (!v) {
    roundPick.value = 'ALL'
    return
  }
  const digits = v.replace(/\D+/g, '')
  const n = digits ? String(parseInt(digits, 10)) : v
  roundPick.value = n
}

/* ---------- helpers UI ---------- */
function segBtn(active: boolean, tone: 'base' | 'blue' | 'emerald' | 'amber' = 'base', disabled = false) {
  const base =
    'inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-semibold transition select-none'
  const off = 'border-transparent text-slate-300 hover:bg-slate-900/60 hover:text-slate-100'
  const dis = 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-300'
  if (disabled) return `${base} ${off} ${dis}`
  if (!active) return `${base} ${off}`
  const tones: Record<string, string> = {
    base: 'border-slate-600/70 bg-slate-900 text-white',
    blue: 'border-blue-400/50 bg-blue-500/15 text-blue-100',
    emerald: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100',
    amber: 'border-amber-400/50 bg-amber-500/15 text-amber-100',
  }
  return `${base} ${tones[tone]}`
}

function badgeClass(st: string) {
  const base = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold'
  const s = upper(st)
  if (s === 'SCHEDULED') return `${base} bg-blue-500/8 border-blue-400/60 text-blue-100`
  if (s === 'FINAL') return `${base} bg-emerald-500/8 border-emerald-400/60 text-emerald-100`
  return `${base} bg-slate-500/10 border-slate-400/40 text-slate-200`
}

function statusLabel(st: string) {
  const s = upper(st)
  if (s === 'SCHEDULED') return 'Programado'
  if (s === 'FINAL') return 'Finalizado'
  if (s === 'LIVE') return 'En juego'
  return st
}

function niceGender(g: string) {
  const x = upper(g)
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}

function timeHintMs(ms: number, status: string) {
  const st = upper(status)
  if (st === 'FINAL') return 'Marcador final'
  const diff = ms - (nowMs.value || Date.now())
  if (diff < 0) return 'Hora pasada'
  const mins = Math.round(diff / 60000)
  const hrs = Math.round(diff / 3600000)
  const days = Math.round(diff / 86400000)
  if (mins <= 59) return `Arranca en ${mins} min`
  if (hrs <= 48) return `Arranca en ${hrs} h`
  return `En ${days} día(s)`
}

/* ---------- helpers data ---------- */
function normalize(v: string) {
  const x = (v ?? '').trim()
  return x.length ? x : ''
}
function upper(v: any) {
  return String(v ?? '').toUpperCase()
}
function toUtcMs(matchUtc: string) {
  const s = String(matchUtc || '').trim()
  if (!s) return 0
  const hasTZ = s.endsWith('Z') || /[+-]\d\d:\d\d$/.test(s)
  return new Date(hasTZ ? s : `${s}Z`).getTime()
}
function normalizeRound(v: any) {
  const raw = String(v ?? '').trim()
  if (!raw) return ''
  const digits = raw.match(/\d+/g)?.join('') ?? ''
  if (!digits) return raw
  return String(parseInt(digits, 10))
}
function roundNumber(g: any): string | null {
  const raw = String(g?.roundLabel ?? g?.round_la ?? '').trim()
  if (!raw) return null
  const digits = raw.match(/\d+/g)?.join('') ?? ''
  if (!digits) return null
  return String(parseInt(digits, 10))
}
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
</script>

<style scoped>
.seg-wrap {
  display: inline-flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  border-radius: 1rem;
  border: 1px solid rgba(51, 65, 85, 0.7);
  background: rgba(2, 6, 23, 0.55);
  padding: 0.35rem;
}

.count-pill {
  border-radius: 9999px;
  border: 1px solid rgba(51, 65, 85, 0.7);
  background: rgba(2, 6, 23, 0.55);
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  line-height: 1;
  color: rgba(226, 232, 240, 0.95);
}
</style>
