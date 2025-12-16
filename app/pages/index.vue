<template>
  <main class="bg-[#F3F4FF] text-slate-900 min-h-screen">
    <!-- Ya NO hay header aquí, solo contenido de la home -->

    <!-- ========== HERO + CARRUSEL ========== -->
    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-6xl mx-auto container-pad px-6">
        <!-- Carrusel con IMG real -->
        <div class="w-full rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.40)] bg-slate-900">
          <div class="relative w-full" style="aspect-ratio: 16/5;">
            <img :src="currentSlideSrc" alt="tochero5liga" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Controles del carrusel -->
        <div class="mt-3 flex items-center justify-center gap-4">
          <button class="carousel-arrow bg-white shadow" @click="prevSlide">
            <span class="text-xs text-slate-700">&larr;</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="slide.id"
              class="carousel-dot border border-slate-300"
              :class="idx === currentSlide ? 'carousel-dot--active bg-blue-500 border-blue-500' : 'bg-white'"
              @click="goToSlide(idx)"
            />
          </div>

          <button class="carousel-arrow bg-white shadow" @click="nextSlide">
            <span class="text-xs text-slate-700">&rarr;</span>
          </button>
        </div>

        <!-- Overlay card (azul claro) -->
        <div class="relative -mt-20 sm:-mt-24">
          <div
            class="p-6 md:p-8 bg-blue-50 text-slate-900 border border-blue-100 rounded-[26px] shadow-[0_18px_40px_rgba(37,99,235,0.25)]"
          >
            <div class="grid md:grid-cols-5 gap-6 items-start">
              <div class="md:col-span-3">
                <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Temporada 2025
                </h1>
                <p class="mt-2 text-slate-700">
                  Resultados, posiciones y registros en un solo lugar.
                </p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <NuxtLink
                    to="/estadisticas"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                  >
                    Ver estadísticas
                  </NuxtLink>
                  <NuxtLink
                    to="/registro"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50"
                  >
                    Registrar equipo
                  </NuxtLink>
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 shadow-sm">
                  <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Próximo juego
                  </div>
                  <div class="mt-1 text-sm text-slate-700">
                    Aún no hay juegos programados.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Texto introductorio -->
        <div class="mt-10">
          <h2 class="font-display text-2xl font-extrabold mb-1 text-slate-900">
            TOCHERO5LIGA
          </h2>
          <p class="text-slate-600">
            ENTÉRATE DE TODO LO QUE ESTÁ PASANDO EN EL TORNEO.
          </p>
        </div>

        <!-- ========== TOP 5 POSICIONES (desde backend) ========== -->
        <div
          class="mt-8 rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
            <div class="flex items-center gap-3">
              <h3 class="font-display font-extrabold text-white">Top 5 · Posiciones</h3>
              <span class="hidden sm:inline text-xs text-white/80 font-medium">ACTUALIZADO</span>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
              @click="refresh()"
            >
              Refrescar
            </button>
          </div>

          <!-- Filtros -->
          <div class="px-5 py-4 bg-white border-b border-slate-200/70">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <!-- Categoría -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Categoría (code)
                </label>
                <select
                  v-model="selectedCategoryCode"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <!-- Rama -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Rama (gender)
                </label>
                <select
                  v-model="selectedGender"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="VARONIL">Varonil</option>
                  <option value="FEMENIL">Femenil</option>
                  <option value="MIXTO">Mixto</option>
                </select>
              </div>

              <!-- Acciones -->
              <div class="flex gap-2 sm:justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  @click="refresh()"
                >
                  Refrescar
                </button>
              </div>
            </div>

            <!-- Ruta actual -->
            <div class="mt-3 flex flex-wrap gap-2 items-center">
              <span class="text-[11px] text-slate-500">Consultando:</span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                {{ pointsUrl }}
              </span>
            </div>
          </div>

          <div class="bg-white overflow-x-auto">
            <div v-if="pending" class="px-4 py-3 text-sm text-slate-500">
              Cargando posiciones...
            </div>
            <div v-else-if="error" class="px-4 py-3 text-sm text-red-600">
              Error al cargar las posiciones.
            </div>

            <template v-else>
              <table class="min-w-[880px] w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-500 border-b border-slate-200/80">
                    <th class="px-3 py-2">Rk</th>
                    <th class="px-3 py-2">Equipo</th>
                    <th class="px-3 py-2">PJ</th>
                    <th class="px-3 py-2">PG</th>
                    <th class="px-3 py-2">GF</th>
                    <th class="px-3 py-2">Pts</th>
                    <th class="px-3 py-2">Índice</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in topPositions"
                    :key="row.rank"
                    class="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                  >
                    <td class="px-3 py-2 font-semibold text-slate-800">{{ row.rank }}</td>
                    <td class="px-3 py-2">{{ row.teamName }}</td>
                    <td class="px-3 py-2">{{ row.gamesPlayed }}</td>
                    <td class="px-3 py-2">{{ row.wins }}</td>
                    <td class="px-3 py-2">{{ row.goalsFor }}</td>
                    <td class="px-3 py-2">{{ row.points }}</td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {{ formatEfficiency(row.wins, row.gamesPlayed) }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="topPositions.length === 0">
                    <td colspan="7" class="px-3 py-3 text-sm text-slate-500">
                      Aún no hay posiciones registradas (o no hay datos para esos filtros).
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </div>

        <!-- ========== PATROCINADORES (mismo color que Top 5) ========== -->
        <section id="patrocinadores" class="mt-12">
          <div
            class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
          >
            <!-- Header con MISMO gradient que Top 5 -->
            <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#2563EB]">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">
                  aliados de la liga
                </p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Patrocinadores oficiales
                </h2>
              </div>
              <div class="hidden sm:block text-xs text-blue-50/85 text-right">
                <p>Espacios limitados para patrocinio.</p>
                <p>Escríbenos en Instagram para colaborar.</p>
              </div>
            </div>

            <!-- Contenido claro -->
            <div class="px-6 py-8 bg-white text-slate-900">
              <div class="grid gap-8 md:grid-cols-3 items-stretch">
                <!-- Texto + CTA -->
                <div class="md:col-span-2 flex flex-col justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold tracking-[0.2em] text-blue-500 uppercase">
                      Patrocinador destacado
                    </p>
                    <h4 class="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {{ activeSponsor.name }}
                    </h4>
                    <p class="mt-2 text-sm text-slate-700">
                      {{ activeSponsor.description }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700"
                      >
                        {{ activeSponsor.tagline }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700"
                      >
                        {{ activeSponsor.label }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center gap-3">
                    <a
                      :href="activeSponsor.url"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)]"
                    >
                      Visitar sitio
                      <span class="ml-1 text-xs">↗</span>
                    </a>
                    <p class="text-[11px] text-slate-500">
                      Toca una tarjeta abajo para cambiar de patrocinador.
                    </p>
                  </div>
                </div>

                <!-- Logo grande + mini stats -->
                <div class="flex flex-col items-center justify-center gap-4">
                  <div
                    class="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-blue-400 via-white to-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.7)]"
                  >
                    <img
                      v-if="activeSponsor.logo"
                      :src="activeSponsor.logo"
                      :alt="activeSponsor.name"
                      class="max-w-[70%] max-h-[70%] object-contain"
                      loading="lazy"
                    />
                    <span v-else class="text-sm font-display font-bold text-slate-900">
                      {{ activeSponsor.name }}
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-2 w-full text-[10px] text-slate-700">
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">Promos</div>
                      <div class="mt-1 opacity-80">Jugadores y staff</div>
                    </div>
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">Activaciones</div>
                      <div class="mt-1 opacity-80">En campo</div>
                    </div>
                    <div class="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-center">
                      <div class="font-semibold text-xs text-slate-900">MVP</div>
                      <div class="mt-1 opacity-80">Premios especiales</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selector de patrocinadores -->
              <div class="mt-6 border-t border-slate-200 pt-4">
                <p class="text-[11px] text-slate-500 mb-2">
                  Patrocinadores oficiales · desliza o toca una tarjeta
                </p>
                <div class="flex gap-3 overflow-x-auto pb-1">
                  <button
                    v-for="(sponsor, idx) in sponsors"
                    :key="sponsor.id"
                    type="button"
                    class="group flex items-center gap-3 rounded-2xl border px-3 py-2 min-w-[190px] transition-all"
                    :class="idx === activeSponsorIndex ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'"
                    @click="setActiveSponsor(idx)"
                  >
                    <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                      <img
                        v-if="sponsor.logo"
                        :src="sponsor.logo"
                        :alt="sponsor.name"
                        class="w-full h-full object-contain"
                        loading="lazy"
                      />
                      <span v-else class="text-[11px] font-semibold text-slate-700">
                        {{ sponsor.name }}
                      </span>
                    </div>
                    <div class="text-left">
                      <div class="text-xs font-semibold text-slate-900">{{ sponsor.name }}</div>
                      <div class="text-[11px] text-slate-500">{{ sponsor.tagline }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-3 text-[11px] text-slate-500 text-right">
            ¿Quieres patrocinar? Escríbenos por Instagram @tochero5liga
          </p>
        </section>
      </div>

      <!-- FOOTER / UBICACIÓN -->
      <div class="mt-14 bg-[#E0E7FF]">
        <div class="max-w-6xl mx-auto container-pad px-6 py-10">
          <div class="grid md:grid-cols-5 gap-6 items-start">
            <div class="md:col-span-2 space-y-2">
              <h2 class="font-display text-2xl font-extrabold text-slate-900">Ubicación</h2>
              <p class="opacity-95 text-slate-800">FES Acatlán · Entrada Principal (peatonal)</p>
              <p class="text-sm opacity-90 text-slate-700">
                Abre el mapa para ver la ruta exacta.
              </p>

              <!-- ✅ Botón apuntando a TU shortlink -->
              <a
                class="inline-flex items-center gap-2 mt-3 rounded-xl px-3 py-2 text-sm bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                :href="mapsOpenUrl"
                target="_blank"
                rel="noopener"
              >
                Abrir en Google Maps
              </a>
            </div>

            <div class="md:col-span-3">
              <div class="aspect-video rounded-[26px] overflow-hidden border border-white/70 shadow-lg bg-black/10">
                <!-- ✅ IFRAME usando embed real (no el shortlink) -->
                <iframe
                  class="w-full h-full"
                  :src="mapsEmbedSrc"
                  style="border:0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <hr class="mt-8 mb-4 border-slate-300/70" />

          <div class="flex items-center justify-between text-sm text-slate-600">
            <span>© 2025 tochero5liga</span>

            <span class="inline-flex items-center gap-2 opacity-90 hover:opacity-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
              </svg>
              <span>@tochero5liga</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useApi } from '@/composables/useApi'

/* ===================== MAPA (apunta al shortlink) ===================== */
const mapsShortUrl = 'https://maps.app.goo.gl/zKNYRashoqHAMJwP9'

// ✅ Coordenadas del destino real de ese shortlink (para que el iframe SÍ cargue)
const mapsLat = 19.4820973
const mapsLng = -99.2446694

// ✅ Esto sí funciona en iframe
const mapsEmbedSrc = computed(() => {
  return `https://www.google.com/maps?q=${mapsLat},${mapsLng}&z=17&output=embed`
})

// ✅ Botón abre tu shortlink tal cual
const mapsOpenUrl = mapsShortUrl

/* ===================== FILTROS (rama y categoría) ===================== */
type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO'

const categoryOptions = [
  { label: 'Libre', value: 'Libre' },
  { label: '+35', value: '+35' },
  { label: 'U-8', value: 'U8' },
  { label: 'U-10', value: 'U10' },
  { label: 'U-12', value: 'U12' },
  { label: 'U-14', value: 'U14' },
  { label: 'U-16', value: 'U16' }
]

const selectedCategoryCode = ref<'all' | string>('all')
const selectedGender = ref<'all' | Gender>('all')

const pointsUrl = computed(() => {
  const params = new URLSearchParams()
  if (selectedCategoryCode.value !== 'all') params.set('categoryCode', selectedCategoryCode.value)
  if (selectedGender.value !== 'all') params.set('gender', selectedGender.value)
  const qs = params.toString()
  return qs ? `/points?${qs}` : '/points'
})

const clearFilters = () => {
  selectedCategoryCode.value = 'all'
  selectedGender.value = 'all'
}

/* ===================== RAW DEL BACKEND (/points) ===================== */
type ApiStandingAny = Partial<{
  // snake_case
  standing_id: number
  season_id: number
  category_id: number
  team_id: number
  points_for: number
  points_against: number
  table_points: number
  team_name: string

  // camelCase
  standingId: number
  seasonId: number
  categoryId: number
  teamId: number
  pointsFor: number
  pointsAgainst: number
  tablePoints: number
  teamName: string

  // filtros (ideal que el back lo mande)
  gender: string
  categoryCode: string

  // comunes
  gp: number
  wins: number
  losses: number
  draws: number
}>

/* Fetch reactivo por filtros */
const { data: standings, pending, error, refresh } = useApi<ApiStandingAny[]>(pointsUrl)

/* ========= VIEW MODEL PARA LA TABLA ========= */
interface StandingRow {
  rank: number
  teamName: string
  gamesPlayed: number
  wins: number
  goalsFor: number
  points: number
}

const topPositions = computed<StandingRow[]>(() => {
  const raw = standings.value as unknown
  if (!Array.isArray(raw)) return []
  const rows = raw as ApiStandingAny[]

  const toNum = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)

  return rows
    .slice()
    .sort((a, b) => {
      const aPts = toNum(a.table_points ?? a.tablePoints)
      const bPts = toNum(b.table_points ?? b.tablePoints)
      if (bPts !== aPts) return bPts - aPts

      const aFor = toNum(a.points_for ?? a.pointsFor)
      const bFor = toNum(b.points_for ?? b.pointsFor)
      return bFor - aFor
    })
    .slice(0, 5)
    .map((row, idx) => ({
      rank: idx + 1,
      teamName: (row.team_name ?? row.teamName ?? '—') as string,
      gamesPlayed: toNum(row.gp),
      wins: toNum(row.wins),
      goalsFor: toNum(row.points_for ?? row.pointsFor),
      points: toNum(row.table_points ?? row.tablePoints)
    }))
})

const calcEfficiencyValue = (wins: number, gamesPlayed: number): number => {
  if (!gamesPlayed || gamesPlayed <= 0) return 0
  const eff = (wins / gamesPlayed) * 100
  if (!Number.isFinite(eff) || eff < 0) return 0
  if (eff > 100) return 100
  return eff
}

const formatEfficiency = (wins: number, gamesPlayed: number): string => {
  const eff = calcEfficiencyValue(wins, gamesPlayed)
  const txt = eff.toFixed(1)
  return (txt.endsWith('.0') ? txt.slice(0, -2) : txt) + '%'
}

/* ========= HERO CARRUSEL ========= */
interface HeroSlide {
  id: string
  src: string
}

const heroSlides = ref<HeroSlide[]>([
  { id: 'slide-1', src: '/img/sponsors/foto_1.jpg' }
])

const currentSlide = ref(0)
const currentSlideSrc = computed(() => heroSlides.value[currentSlide.value]?.src ?? '')

let intervalId: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  if (heroSlides.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < heroSlides.value.length) {
    currentSlide.value = index
  }
}

onMounted(() => {
  if (heroSlides.value.length > 1) {
    intervalId = setInterval(nextSlide, 7000)
  }
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})

/* ========= PATROCINADORES ========= */
interface Sponsor {
  id: string
  name: string
  logo: string
  tagline: string
  description: string
  url: string
  label: string
}

const sponsors = ref<Sponsor[]>([
  {
    id: 'dicass',
    name: 'DICASS',
    logo: '/img/sponsors/dicass-logo.png',
    tagline: 'Innovación para el juego y el bienestar.',
    description:
      'Dicass acompaña a jugadores y familias con activaciones, alimentos y experiencias dentro del deportivo.',
    url: 'https://dicass.com.mx/',
    label: 'Patrocinador principal'
  }
])

const activeSponsorIndex = ref(0)
const activeSponsor = computed<Sponsor>(() => sponsors.value[activeSponsorIndex.value]!)

const setActiveSponsor = (idx: number) => {
  if (idx < 0 || idx >= sponsors.value.length) return
  activeSponsorIndex.value = idx
}

let sponsorsIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (sponsors.value.length > 1) {
    sponsorsIntervalId = setInterval(() => {
      activeSponsorIndex.value = (activeSponsorIndex.value + 1) % sponsors.value.length
    }, 9000)
  }
})

onBeforeUnmount(() => {
  if (sponsorsIntervalId) clearInterval(sponsorsIntervalId)
})
</script>
