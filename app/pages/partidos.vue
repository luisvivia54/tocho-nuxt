<template>
  <main class="bg-slate-950 min-h-screen text-slate-50 overflow-x-hidden">
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div class="space-y-2">
            <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">Tochero5</p>
            <h1 class="font-display text-3xl md:text-4xl font-extrabold text-white">Partidos</h1>
            <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-900/55 px-3 py-1.5">
              <span class="text-[11px] uppercase tracking-[0.16em] text-slate-400">Temporada</span>
              <span class="text-[12px] font-semibold text-slate-100">{{ currentSeasonLabel }}</span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2">
            <button type="button" @click="refresh()" class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition touch-manipulation">⟳ Refrescar</button>
            <NuxtLink to="/" class="inline-flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-700/70 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition touch-manipulation md:ml-0 sm:col-span-2">← Inicio</NuxtLink>
          </div>
        </header>

        <section class="mb-6 rounded-3xl border border-slate-800/70 bg-slate-900/45 p-4 md:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.30)] overflow-hidden">
          <div class="grid gap-4 md:grid-cols-12 min-w-0">
            <div class="md:col-span-4 min-w-0">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Temporada</p>
                <span class="text-[11px] text-slate-500">Predeterminada: #{{ DEFAULT_SEASON_ID }}</span>
              </div>
              <div class="rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2">
                <select v-model="seasonPick" class="w-full appearance-none bg-transparent outline-none text-xs text-slate-100">
                  <option v-for="s in seasonOptions" :key="s.id" :value="String(s.id)" style="background: white; color: #0f172a;">{{ s.name }}</option>
                </select>
              </div>
              <p class="mt-2 text-[11px] text-slate-500">Nota: se quitó "Todas las temporadas".</p>
            </div>

            <div class="md:col-span-4 min-w-0">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Categoría</p>
                <button type="button" @click="categoria = 'ALL'" class="text-[11px] font-semibold text-slate-300 hover:text-slate-100 underline underline-offset-4">Limpiar</button>
              </div>
              <div class="seg-wrap">
                <button type="button" @click="categoria = 'ALL'" :class="segBtn(categoria === 'ALL')">Todas</button>
                <button v-for="opt in categoriaOptions" :key="opt.value" type="button" @click="categoria = opt.value" :disabled="opt.count === 0" :class="segBtn(categoria === opt.value, 'emerald', opt.count === 0)" :title="opt.count ? `${opt.count} partido(s)` : 'Sin partidos'">
                  {{ niceGender(opt.value) }}<span class="ml-2 count-pill">{{ opt.count }}</span>
                </button>
              </div>
            </div>

            <div class="md:col-span-4 min-w-0">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Rama</p>
                <button type="button" @click="rama = 'ALL'" class="text-[11px] font-semibold text-slate-300 hover:text-slate-100 underline underline-offset-4" :disabled="!canPickRama" :class="!canPickRama ? 'opacity-40 cursor-not-allowed' : ''">Limpiar</button>
              </div>
              <div class="seg-wrap">
                <button type="button" @click="rama = 'ALL'" :disabled="!canPickRama" :class="segBtn(rama === 'ALL', 'base', !canPickRama)" :title="!canPickRama ? 'Elige categoría primero' : ''">Todas</button>
                <button v-for="opt in ramaOptions" :key="opt.value" type="button" @click="rama = opt.value" :disabled="!canPickRama" :class="segBtn(rama === opt.value, 'blue', !canPickRama)" :title="!canPickRama ? 'Elige categoría primero' : `${opt.count} partido(s)`">
                  {{ opt.value }}<span class="ml-2 count-pill">{{ opt.count }}</span>
                </button>
              </div>
              <p v-if="!canPickRama" class="mt-2 text-[11px] text-slate-500">Selecciona una categoría para habilitar rama.</p>
              <p v-else-if="needsRama" class="mt-2 text-[11px] text-amber-200">⚠️ Para ver partidos de esa categoría, selecciona la rama.</p>
            </div>

            <div class="md:col-span-12 min-w-0">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Jornada</p>
                <button type="button" @click="roundPick = 'ALL'" class="text-[11px] font-semibold underline underline-offset-4" :class="canPickRound ? 'text-slate-300 hover:text-slate-100' : 'text-slate-500 cursor-not-allowed'" :disabled="!canPickRound" :title="!canPickRound ? 'Elige categoría y rama primero' : ''">Limpiar</button>
              </div>
              <div class="rounded-3xl border border-slate-800/70 bg-slate-950/35 p-3 md:p-4" :class="!canPickRound ? 'opacity-60' : ''">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 min-w-0">
                  <div class="flex-1 min-w-0">
                    <div class="seg-wrap">
                      <button type="button" @click="roundPick = 'ALL'" :disabled="!canPickRound" :class="segBtn(roundPick === 'ALL', 'base', !canPickRound)" :title="!canPickRound ? 'Elige categoría y rama primero' : ''">Todas</button>
                      <button v-for="r in roundOptions" :key="r.round" type="button" @click="roundPick = r.round" :disabled="!canPickRound" :class="segBtn(roundPick === r.round, 'amber', !canPickRound)" :title="!canPickRound ? 'Elige categoría y rama primero' : `${r.count} partido(s)`">
                        J{{ r.round }}<span class="ml-2 count-pill">{{ r.count }}</span>
                      </button>
                    </div>
                    <p v-if="!canPickRound" class="mt-2 text-[11px] text-slate-500">Para habilitar jornadas: elige <b class="text-slate-200">categoría</b> y <b class="text-slate-200">rama</b>.</p>
                  </div>
                  <div class="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 self-start md:self-auto">
                    <span class="text-slate-500 text-xs">#</span>
                    <input v-model.trim="roundInput" type="text" inputmode="numeric" placeholder="Ej. 3" class="w-20 bg-transparent outline-none placeholder:text-slate-500 text-xs text-slate-100" :disabled="!canPickRound" @keydown.enter.prevent="applyRoundInput()" />
                    <button type="button" class="text-[11px] font-semibold underline underline-offset-4" :class="canPickRound ? 'text-blue-200 hover:text-blue-100' : 'text-slate-500 cursor-not-allowed'" :disabled="!canPickRound" @click="applyRoundInput()">Aplicar</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-12 min-w-0">
              <div class="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p class="text-[11px] text-slate-400">
                  <span v-if="pending">Cargando partidos…</span>
                  <span v-else>
                    Mostrando <span class="text-slate-100 font-semibold">{{ renderedCount }}</span> de <span class="text-slate-100 font-semibold">{{ filteredTotal }}</span> partido(s)
                    <span v-if="filteredTotal > 0" class="text-slate-600">·</span>
                    <span v-if="filteredTotal > 0" class="text-slate-300">Página <span class="text-slate-100 font-semibold">{{ page }}</span>/<span class="text-slate-100 font-semibold">{{ totalPages }}</span></span>
                  </span>
                </p>
                <button type="button" @click="resetFilters()" class="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/40 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-900/60 hover:border-slate-500 transition">Limpiar filtros</button>
              </div>
              <p v-if="errorMsg" class="mt-2 text-xs text-rose-300">{{ errorMsg }}</p>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div v-if="!pending && filteredTotal === 0" class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p class="text-sm text-slate-200 font-semibold">No hay partidos con esos filtros.</p>
            <p class="text-xs text-slate-400 mt-1">Elige categoría → rama → (opcional) jornada, o limpia filtros.</p>
          </div>

          <div v-for="group in grouped" :key="group.key" class="space-y-3">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="h-px flex-1 bg-slate-800"></span>
              <span class="uppercase tracking-[0.16em]">{{ group.label }}</span>
              <span class="h-px flex-1 bg-slate-800"></span>
            </div>

            <article v-for="g in group.items" :key="g.id" class="rounded-3xl border border-slate-800/80 bg-slate-900/55 p-4 md:px-6 md:py-5 hover:border-slate-600 transition shadow-[0_12px_32px_rgba(0,0,0,0.22)]" style="content-visibility:auto; contain-intrinsic-size: 240px;">
              <div class="flex items-start justify-between gap-3 mb-3">
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
                  <span class="text-slate-500" v-if="g.code">·</span>
                  <span v-if="g.code">Rama: {{ g.code }}</span>
                  <span class="text-slate-500" v-if="g.round">·</span>
                  <span v-if="g.round">J{{ g.round }}</span>
                </div>
                <div class="text-right text-[11px] text-slate-300 shrink-0">
                  <p class="font-semibold text-slate-100">{{ g.timeLabel }}</p>
                  <p class="text-slate-500">{{ timeHintMs(g.ms, g.status) }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-12 w-12 rounded-2xl bg-slate-950/60 border border-slate-700/70 flex items-center justify-center overflow-hidden shrink-0">
                    <img v-if="g.homeLogo" :src="g.homeLogo" :alt="g.homeName" class="h-full w-full object-cover" loading="lazy" decoding="async" />
                    <span v-else class="text-[12px] font-extrabold text-blue-200">{{ initials(g.homeShort || g.homeName || 'T5') }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-slate-50 truncate">{{ g.homeName }}</p>
                    <p class="text-[11px] text-slate-400 truncate">{{ g.homeShort || '—' }}</p>
                  </div>
                </div>

                <div class="flex flex-col items-center justify-center sm:min-w-[140px]">
                  <template v-if="g.isFinal">
                    <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">Marcador</p>
                    <div class="inline-flex items-center gap-3 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-2">
                      <span class="text-3xl font-extrabold text-slate-50 tabular-nums">{{ g.homeScore ?? '—' }}</span>
                      <span class="text-slate-500 font-bold">-</span>
                      <span class="text-3xl font-extrabold text-slate-50 tabular-nums">{{ g.awayScore ?? '—' }}</span>
                    </div>
                    <p class="text-[11px] mt-1 text-slate-500">Partido finalizado</p>
                  </template>
                  <template v-else>
                    <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-0.5">Horario</p>
                    <p class="text-xl font-bold text-slate-50">{{ g.timeLabel }}</p>
                    <p class="text-[11px] mt-0.5 text-slate-500">A la espera de kickoff</p>
                  </template>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3 min-w-0">
                  <div class="sm:hidden h-px flex-1 bg-slate-800/70"></div>
                  <div class="text-right min-w-0">
                    <p class="text-base font-semibold text-slate-50 truncate">{{ g.awayName }}</p>
                    <p class="text-[11px] text-slate-400 truncate">{{ g.awayShort || '—' }}</p>
                  </div>
                  <div class="h-12 w-12 rounded-2xl bg-slate-950/60 border border-slate-700/70 flex items-center justify-center overflow-hidden shrink-0">
                    <img v-if="g.awayLogo" :src="g.awayLogo" :alt="g.awayName" class="h-full w-full object-cover" loading="lazy" decoding="async" />
                    <span v-else class="text-[12px] font-extrabold text-emerald-200">{{ initials(g.awayShort || g.awayName || 'T5') }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">
                <p class="truncate">
                  ID: <span class="text-slate-200 font-semibold">{{ g.id }}</span>
                  <span class="text-slate-600">·</span>
                  Temporada: <span class="text-slate-200 font-semibold">{{ g.seasonName || (g.seasonId ? `Temporada #${g.seasonId}` : '—') }}</span>
                </p>
                <span class="text-slate-500">{{ g.isFinal ? 'Final' : 'Programado' }}</span>
              </div>
            </article>
          </div>

          <div v-if="!pending && filteredTotal > 0" class="pt-2">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <p class="text-[11px] text-slate-400">
                Mostrando <span class="text-slate-100 font-semibold">{{ pageRangeLabel }}</span> de <span class="text-slate-100 font-semibold">{{ filteredTotal }}</span>
              </p>
              <div class="grid grid-cols-2 sm:flex items-center gap-2 w-full md:w-auto">
                <button type="button" @click="prevPage()" :disabled="page <= 1" class="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation">← Anterior</button>
                <button type="button" @click="nextPage()" :disabled="page >= totalPages" class="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900/70 hover:border-slate-500 transition disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation">Siguiente →</button>
                <div class="col-span-2 sm:col-span-1 flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-950/50 px-3 py-2 w-full sm:w-auto">
                  <span class="text-[11px] text-slate-400">Página</span>
                  <input v-model.trim="pageInput" type="text" inputmode="numeric" class="w-12 bg-transparent outline-none text-xs text-slate-100 text-center tabular-nums" @keydown.enter.prevent="applyPageInput()" />
                  <span class="text-[11px] text-slate-500">/ {{ totalPages }}</span>
                  <button type="button" class="text-[11px] font-semibold text-blue-200 hover:text-blue-100 underline underline-offset-4" @click="applyPageInput()">Ir</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { markRaw, shallowRef, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO' | string
type Season = { id: number; name: string }
type VMGame = {
  id: number; seasonId: number; seasonName: string; status: string
  ms: number; dateKey: string; dayLabel: string; timeLabel: string
  round: string | null; gender: string | null; code: string | null
  categoryName: string; homeName: string; awayName: string
  homeShort: string; awayShort: string
  homeLogo: string | null; awayLogo: string | null
  isFinal: boolean; homeScore: number | null; awayScore: number | null
}
type Group = { key: string; label: string; items: VMGame[] }

const config = useRuntimeConfig()
const API_BASE = ((config.public as any)?.apiBase as string || 'https://tocho5-api.tochero5.mx/api')
  .trim().replace(/\/+$/, '').replace(/\/api$/, '') + '/api'

// ← ÚNICO LUGAR PARA CAMBIAR
const LEAGUE_ID         = 1
const DEFAULT_SEASON_ID = 2

const seasonPick = ref<string>(String(DEFAULT_SEASON_ID))
const roundPick  = ref<'ALL' | string>('ALL')
const roundInput = ref('')
const categoria  = ref<'ALL' | Gender>('ALL')
const rama       = ref<'ALL' | string>('ALL')

const canPickRama  = computed(() => categoria.value !== 'ALL')
const needsRama    = computed(() => categoria.value !== 'ALL' && rama.value === 'ALL')
const canPickRound = computed(() => categoria.value !== 'ALL' && rama.value !== 'ALL' && !needsRama.value)

watch(categoria, () => { rama.value = 'ALL'; roundPick.value = 'ALL'; roundInput.value = '' })
watch(rama,      () => { roundPick.value = 'ALL'; roundInput.value = '' })

const pageSize  = ref(5)
const page      = ref(1)
const pageInput = ref('1')
watch([seasonPick, roundPick, categoria, rama], () => { page.value = 1; pageInput.value = '1' })

const nowMs = ref(0)
let tmr: any = null
onMounted(() => { nowMs.value = Date.now(); tmr = setInterval(() => (nowMs.value = Date.now()), 60_000) })
onBeforeUnmount(() => { if (tmr) clearInterval(tmr) })

const timeFmt    = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit' })
const weekdayFmt = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', weekday: 'long' })
const dateFmt    = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: 'long', year: 'numeric' })

// ← seasons con leagueId
const { data: seasonsRaw } = useAsyncData<any[]>(
  `seasons-lite-league-${LEAGUE_ID}`,
  async () => {
    const try1 = await $fetch<any>(`${API_BASE}/seasons/list?leagueId=${LEAGUE_ID}`).catch(() => null)
    if (Array.isArray(try1)) return try1
    const try2 = await $fetch<any>(`${API_BASE}/seasons?leagueId=${LEAGUE_ID}`).catch(() => [])
    return Array.isArray(try2) ? try2 : []
  },
  { server: false }
)

const seasonsMap = computed<Record<number, string>>(() => {
  const out: Record<number, string> = {}
  for (const s of (seasonsRaw.value ?? [])) {
    const id = Number(s?.id ?? s?.seasonId ?? s?.season_id ?? 0) || 0
    if (!id) continue
    out[id] = String(s?.name ?? s?.seasonName ?? s?.title ?? `Temporada #${id}`).trim()
  }
  return out
})

function seasonKey(name: string) {
  return String(name || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ')
}

const seasonNameToId = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {}
  for (const s of (seasonsRaw.value ?? [])) {
    const id   = Number(s?.id ?? s?.seasonId ?? s?.season_id ?? 0) || 0
    const name = String(s?.name ?? s?.seasonName ?? s?.title ?? '').trim()
    if (id && name) out[seasonKey(name)] = id
  }
  return out
})

// ← games con leagueId
const { data, pending, error, refresh } = useAsyncData<any[]>(
  `games-calendar-league-${LEAGUE_ID}`,
  async () => {
    const [scheduled, finals] = await Promise.all([
      $fetch<any>(`${API_BASE}/games?leagueId=${LEAGUE_ID}`).catch(() => []),
      $fetch<any>(`${API_BASE}/gamesFinal?leagueId=${LEAGUE_ID}&all=true`).catch(() => []),
    ])
    const all = [...(Array.isArray(scheduled) ? scheduled : []), ...(Array.isArray(finals) ? finals : [])]
    const map = new Map<number, any>()
    for (const g of all) {
      const id = Number(g?.game_id ?? g?.gameId ?? g?.id ?? 0)
      if (id) map.set(id, g)
    }
    return Array.from(map.values())
  },
  { server: false }
)

const errorMsg = computed(() => error.value ? 'Error cargando partidos. Revisa el endpoint o logs del back.' : '')

const vmAll = shallowRef<VMGame[]>(markRaw([]))

watch([data, seasonsMap, seasonNameToId], ([raw]) => {
  const list = raw ?? []
  const out: VMGame[] = []
  const dayLabelCache = new Map<string, string>()

  for (const g of list) {
    const id = Number(g?.game_id ?? g?.gameId ?? g?.id ?? 0)
    if (!id) continue

    let seasonId   = Number(g?.season_id ?? g?.seasonId ?? g?.season?.id ?? 0) || 0
    let seasonName = String(g?.seasonName ?? g?.season?.name ?? '').trim()
      || (seasonId ? (seasonsMap.value[seasonId] || `Temporada #${seasonId}`) : '')

    if (!seasonId && seasonName) seasonId = seasonNameToId.value[seasonKey(seasonName)] || 0
    if (!seasonName && seasonId) seasonName = seasonsMap.value[seasonId] || `Temporada #${seasonId}`

    const iso     = String(g?.match_date_utc ?? g?.matchDateUtc ?? g?.match_date ?? '').trim()
    const ms      = toUtcMs(iso)
    const d       = new Date(ms || Date.now())
    const dateKey = (ms ? d.toISOString() : new Date().toISOString()).slice(0, 10)

    let dayLabel = dayLabelCache.get(dateKey)
    if (!dayLabel) {
      const anchor = new Date(`${dateKey}T12:00:00Z`)
      dayLabel = `${capitalize(weekdayFmt.format(anchor))} · ${dateFmt.format(anchor)}`
      dayLabelCache.set(dateKey, dayLabel)
    }

    const round    = roundNumber(g)
    const gen      = g.category?.gender ? upper(g.category.gender) : null
    const code     = g.category?.code   ? String(g.category.code)  : null
    const homeName = String(g.home_team ?? g.homeTeam?.name ?? 'Local').trim()
    const awayName = String(g.away_team ?? g.awayTeam?.name ?? 'Visitante').trim()

    const rawStatus = String(g?.status ?? '').trim()
    const hasScore  = g?.homeScore != null || g?.awayScore != null || g?.home_score != null || g?.away_score != null
    const status    = upper(rawStatus) || (hasScore ? 'FINAL' : 'SCHEDULED')
    const isFinal   = status === 'FINAL'
    const homeScore = isFinal ? Number(g.homeScore ?? g.home_score ?? null) : null
    const awayScore = isFinal ? Number(g.awayScore ?? g.away_score ?? null) : null

    out.push({
      id, seasonId, seasonName, status,
      ms: ms || 0, dateKey, dayLabel,
      timeLabel: timeFmt.format(d),
      round, gender: gen, code,
      categoryName: String(g.category?.name ?? `Categoría ${g.category?.id ?? ''}`).trim(),
      homeName, awayName,
      homeShort: String(g.homeTeam?.shortName ?? '').trim(),
      awayShort: String(g.awayTeam?.shortName ?? '').trim(),
      homeLogo:  g.homeTeam?.logoUrl ?? null,
      awayLogo:  g.awayTeam?.logoUrl ?? null,
      isFinal,
      homeScore: Number.isFinite(homeScore as any) ? homeScore : null,
      awayScore: Number.isFinite(awayScore as any) ? awayScore : null,
    })
  }

  out.sort((a, b) => {
    const ra = statusRank(a.status), rb = statusRank(b.status)
    if (ra !== rb) return ra - rb
    if (ra <= 1) return (a.ms || 0) - (b.ms || 0)
    return (b.ms || 0) - (a.ms || 0)
  })

  vmAll.value = markRaw(out)
  page.value = 1
  pageInput.value = '1'
}, { immediate: true })

// seasonOptions solo con las que devuelve el back (ya filtradas por leagueId)
const seasonOptions = computed<Season[]>(() => {
  const merged = new Map<number, string>()
  for (const s of (seasonsRaw.value ?? [])) {
    const id   = Number(s?.id ?? s?.seasonId ?? s?.season_id ?? 0) || 0
    const name = String(s?.name ?? s?.seasonName ?? s?.title ?? `Temporada #${id}`).trim()
    if (id && name) merged.set(id, name)
  }
  if (!merged.has(DEFAULT_SEASON_ID)) {
    merged.set(DEFAULT_SEASON_ID, seasonsMap.value[DEFAULT_SEASON_ID] || `Temporada #${DEFAULT_SEASON_ID}`)
  }
  const arr = Array.from(merged.entries()).map(([id, name]) => ({ id, name }))
  arr.sort((a, b) => {
    if (a.id === DEFAULT_SEASON_ID) return -1
    if (b.id === DEFAULT_SEASON_ID) return 1
    return a.name.localeCompare(b.name, 'es')
  })
  return arr
})

watch(seasonOptions, (opts) => {
  if (!opts.some(x => String(x.id) === String(seasonPick.value))) {
    seasonPick.value = String(DEFAULT_SEASON_ID)
  }
}, { immediate: true })

const currentSeasonLabel = computed(() => {
  const sp = safeSeasonId()
  return seasonsMap.value[sp] || seasonOptions.value.find(x => x.id === sp)?.name || `Temporada #${sp}`
})

const seasonScopedGames = computed(() => {
  const sp       = safeSeasonId()
  const label    = seasonsMap.value[sp] || seasonOptions.value.find(x => x.id === sp)?.name || `Temporada #${sp}`
  const labelKey = seasonKey(label)
  return vmAll.value.filter(g => {
    const gid = Number(g.seasonId || 0)
    if (gid) return gid === sp
    return seasonKey(g.seasonName || '') === labelKey
  })
})

const categoriaOptions = computed(() => {
  const base: Gender[] = ['VARONIL', 'FEMENIL', 'MIXTO']
  const gc: Record<string, number> = {}
  for (const g of seasonScopedGames.value) {
    const gen = upper(g.gender ?? '')
    if (gen) gc[gen] = (gc[gen] ?? 0) + 1
  }
  return base.map(v => ({ value: v, count: gc[upper(v)] ?? 0 }))
})

const ramaOptions = computed(() => {
  if (categoria.value === 'ALL') return []
  const gen = upper(categoria.value)
  const map: Record<string, number> = {}
  for (const g of seasonScopedGames.value) {
    if (upper(g.gender ?? '') !== gen) continue
    const code = upper(g.code ?? '')
    if (code) map[code] = (map[code] ?? 0) + 1
  }
  return Object.entries(map).map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value))
})

const roundOptions = computed(() => {
  if (!canPickRound.value) return []
  const gen  = upper(categoria.value)
  const code = upper(rama.value)
  const rc: Record<string, number> = {}
  for (const g of seasonScopedGames.value) {
    if (upper(g.gender ?? '') !== gen) continue
    if (upper(g.code ?? '') !== code) continue
    const r = g.round ? normalizeRound(g.round) : ''
    if (r) rc[r] = (rc[r] ?? 0) + 1
  }
  return Object.entries(rc).map(([round, count]) => ({ round, count })).sort((a, b) => Number(a.round) - Number(b.round))
})

const filteredAll = computed(() => {
  const sp       = safeSeasonId()
  const label    = seasonsMap.value[sp] || seasonOptions.value.find(x => x.id === sp)?.name || `Temporada #${sp}`
  const labelKey = seasonKey(label)
  const rp       = roundPick.value === 'ALL' ? null : normalizeRound(roundPick.value)
  const cg       = categoria.value === 'ALL' ? null : upper(categoria.value)
  const rc       = rama.value === 'ALL'      ? null : upper(rama.value)

  if (needsRama.value) return [] as VMGame[]

  const out: VMGame[] = []
  for (const g of vmAll.value) {
    const gid = Number(g.seasonId || 0)
    if (gid) { if (gid !== sp) continue }
    else     { if (seasonKey(g.seasonName || '') !== labelKey) continue }
    if (cg && upper(g.gender ?? '') !== cg) continue
    if (cg && rc && upper(g.code ?? '') !== rc) continue
    if (rp && canPickRound.value && normalizeRound(g.round ?? '') !== rp) continue
    out.push(g)
  }
  return out
})

const filteredTotal  = computed(() => filteredAll.value.length)
const totalPages     = computed(() => Math.max(1, Math.ceil(filteredTotal.value / pageSize.value)))

watch([filteredTotal, totalPages], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
  if (page.value < 1) page.value = 1
  pageInput.value = String(page.value)
})

const pageSlice = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredAll.value.slice(start, start + pageSize.value)
})

const grouped = computed(() => {
  const groups: Group[] = []
  const byKey: Record<string, Group> = {}
  for (const g of pageSlice.value) {
    let grp = byKey[g.dateKey]
    if (!grp) { grp = { key: g.dateKey, label: g.dayLabel, items: [] }; byKey[g.dateKey] = grp; groups.push(grp) }
    grp.items.push(g)
  }
  return groups
})

const renderedCount  = computed(() => pageSlice.value.length)
const pageRangeLabel = computed(() => {
  if (filteredTotal.value === 0) return '0–0'
  const start = (page.value - 1) * pageSize.value + 1
  const end   = Math.min(page.value * pageSize.value, filteredTotal.value)
  return `${start}–${end}`
})

function resetFilters() {
  seasonPick.value = String(DEFAULT_SEASON_ID)
  roundPick.value  = 'ALL'; roundInput.value = ''
  categoria.value  = 'ALL'; rama.value = 'ALL'
  page.value = 1; pageInput.value = '1'
}

function applyRoundInput() {
  if (!canPickRound.value) return
  const v = (roundInput.value ?? '').trim()
  if (!v) { roundPick.value = 'ALL'; return }
  const digits = v.replace(/\D+/g, '')
  roundPick.value = digits ? String(parseInt(digits, 10)) : v
}

function prevPage() { page.value = Math.max(1, page.value - 1); pageInput.value = String(page.value) }
function nextPage() { page.value = Math.min(totalPages.value, page.value + 1); pageInput.value = String(page.value) }
function applyPageInput() {
  const digits = (pageInput.value ?? '').trim().replace(/\D+/g, '')
  const n = digits ? parseInt(digits, 10) : 1
  page.value = Math.min(totalPages.value, Math.max(1, n))
  pageInput.value = String(page.value)
}

function segBtn(active: boolean, tone: 'base' | 'blue' | 'emerald' | 'amber' = 'base', disabled = false) {
  const base = 'inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-semibold transition select-none touch-manipulation whitespace-nowrap'
  const off  = 'border-transparent text-slate-300 hover:bg-slate-900/60 hover:text-slate-100'
  const dis  = 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-300'
  if (disabled) return `${base} ${off} ${dis}`
  if (!active)  return `${base} ${off}`
  const tones: Record<string, string> = {
    base:    'border-slate-600/70 bg-slate-900 text-white',
    blue:    'border-blue-400/50 bg-blue-500/15 text-blue-100',
    emerald: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100',
    amber:   'border-amber-400/50 bg-amber-500/15 text-amber-100',
  }
  return `${base} ${tones[tone]}`
}

function badgeClass(st: string) {
  const base = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold'
  const s = upper(st)
  if (s === 'SCHEDULED') return `${base} bg-blue-500/8 border-blue-400/60 text-blue-100`
  if (s === 'FINAL')     return `${base} bg-emerald-500/8 border-emerald-400/60 text-emerald-100`
  return `${base} bg-slate-500/10 border-slate-400/40 text-slate-200`
}

function statusLabel(st: string) {
  const s = upper(st)
  if (s === 'SCHEDULED') return 'Programado'
  if (s === 'FINAL')     return 'Finalizado'
  if (s === 'LIVE')      return 'En juego'
  return st
}

function niceGender(g: string) {
  const x = upper(g)
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO')   return 'Mixto'
  return g
}

function initials(text: string) {
  const s = String(text || '').trim()
  if (!s) return 'T5'
  return s.split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function timeHintMs(ms: number, status: string) {
  if (upper(status) === 'FINAL') return 'Marcador final'
  const diff = ms - (nowMs.value || Date.now())
  if (diff < 0) return 'Hora pasada'
  const mins = Math.round(diff / 60000)
  const hrs  = Math.round(diff / 3600000)
  const days = Math.round(diff / 86400000)
  if (mins <= 59) return `Arranca en ${mins} min`
  if (hrs  <= 48) return `Arranca en ${hrs} h`
  return `En ${days} día(s)`
}

function upper(v: any)  { return String(v ?? '').toUpperCase() }
function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s }

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
  return digits ? String(parseInt(digits, 10)) : raw
}

function roundNumber(g: any): string | null {
  const raw = String(g?.roundLabel ?? g?.round_la ?? '').trim()
  if (!raw) return null
  const digits = raw.match(/\d+/g)?.join('') ?? ''
  return digits ? String(parseInt(digits, 10)) : null
}

function statusRank(st: string) {
  const s = upper(st)
  if (s === 'SCHEDULED') return 0
  if (s === 'LIVE')      return 1
  if (s === 'FINAL')     return 3
  return 2
}

function safeSeasonId() {
  const n = Number(seasonPick.value || DEFAULT_SEASON_ID)
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_SEASON_ID
}
</script>

<style scoped>
.seg-wrap {
  display: flex; width: 100%; max-width: 100%; min-width: 0;
  align-items: center; gap: 0.35rem;
  border-radius: 1rem; border: 1px solid rgba(51, 65, 85, 0.7);
  background: rgba(2, 6, 23, 0.55); padding: 0.35rem;
  overflow-x: auto; overflow-y: hidden;
  -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;
  flex-wrap: nowrap;
}
@media (min-width: 768px) { .seg-wrap { overflow-x: visible; flex-wrap: wrap; } }
.count-pill {
  border-radius: 9999px; border: 1px solid rgba(51, 65, 85, 0.7);
  background: rgba(2, 6, 23, 0.55); padding: 0.125rem 0.5rem;
  font-size: 10px; line-height: 1; color: rgba(226, 232, 240, 0.95);
}
</style>