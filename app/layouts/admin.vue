<!--
  app/layouts/admin.vue
  Layout de admin unificado para ambas ligas.

  - Detecta la liga desde la ruta:
      /jueves/admin/*  → liga = 'jueves'   (acento naranja)
      /domingo/admin/* → liga = 'domingo'  (acento emerald)
  - Expone el acento como CSS vars (--liga-accent, --liga-accent-soft, ...)
    para que cualquier descendiente pueda usarlo con `bg-[var(--liga-accent)]`,
    `text-[var(--liga-accent)]`, `ring-[var(--liga-accent-ring)]`, etc.
  - Mobile-first: topbar compacto con liga switcher segmentado + dock inferior
    de 5 secciones. Desktop: sidebar izquierdo con el switcher arriba.
  - Usa el mismo modelo de auth que `default.vue` / `LigaBHeader.vue`
    (useAuthz + $kc de Keycloak).
-->

<template>
  <div
    class="liga-admin-root min-h-screen bg-[#050B1A] font-body text-slate-100"
    :data-liga="liga"
  >
    <!-- ============================================================== -->
    <!-- BG sutil con el color de la liga (no distrae)                   -->
    <!-- ============================================================== -->
    <div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 bg-[#050B1A]" />
      <div
        class="absolute inset-0 opacity-70"
        style="background: radial-gradient(1100px 520px at 85% -10%, var(--liga-accent-glow), transparent 60%);"
      />
      <div
        class="absolute inset-0 opacity-50"
        style="background: radial-gradient(900px 500px at -10% 110%, rgba(37,99,235,0.16), transparent 60%);"
      />
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,26,0)_0%,rgba(5,11,26,0.6)_70%,rgba(3,7,18,0.95)_100%)]" />
    </div>

    <!-- ============================================================== -->
    <!-- TOPBAR MOBILE                                                    -->
    <!-- ============================================================== -->
    <header
      class="sticky top-0 z-40 border-b border-white/8 bg-[#060E21]/85 backdrop-blur-xl lg:hidden"
    >
      <div class="px-4 pt-3 pb-2">
        <!-- Fila 1: logo + salir + user -->
        <div class="flex items-center justify-between gap-3">
          <NuxtLink :to="publicHome" class="flex min-w-0 items-center gap-2.5">
            <span
              class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10"
              aria-hidden="true"
            >
              <img src="/img/sponsors/Tochero5.JPG" alt="Tochero5" class="h-full w-full object-cover" />
            </span>
            <div class="min-w-0 leading-tight">
              <p class="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Admin
              </p>
              <p
                class="truncate text-[15px] font-extrabold text-white"
              >
                tochero<span class="text-[var(--liga-accent)]">5</span>liga
              </p>
            </div>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="publicHome"
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/10"
            >
              ← Sitio
            </NuxtLink>
            <button
              v-if="kcReady && isAuthenticated"
              type="button"
              class="rounded-full bg-white/5 p-2 text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
              aria-label="Cerrar sesión"
              @click="onLogout"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 17l5-5-5-5M20 12H9M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Fila 2: Liga switcher grande, inconfundible -->
        <div
          class="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/8 bg-[#0A1428] p-1.5"
          role="tablist"
          aria-label="Seleccionar liga"
        >
          <button
            v-for="opt in ligaOptions"
            :key="opt.id"
            type="button"
            role="tab"
            :aria-selected="liga === opt.id"
            class="relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.18em] transition"
            :class="
              liga === opt.id
                ? 'text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
                : 'text-slate-400 hover:text-slate-200'
            "
            :style="liga === opt.id
              ? `background:${opt.color};`
              : ''"
            @click="switchLiga(opt.id)"
          >
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :style="liga === opt.id ? 'background:#fff' : `background:${opt.color}`"
              aria-hidden="true"
            />
            <span>{{ opt.shortLabel }}</span>
          </button>
        </div>

        <!-- Fila 3: breadcrumb actual -->
        <div class="mt-3 flex items-center justify-between gap-3">
          <p class="truncate text-[11px] uppercase tracking-[0.22em] text-slate-400">
            <span>{{ ligaName }}</span>
            <span class="mx-2 text-slate-600">/</span>
            <span class="text-[var(--liga-accent)]">{{ currentSection?.label ?? 'Admin' }}</span>
          </p>
        </div>
      </div>
    </header>

    <!-- ============================================================== -->
    <!-- SHELL DESKTOP: sidebar + main                                    -->
    <!-- ============================================================== -->
    <div class="lg:flex lg:min-h-screen">
      <!-- ======= SIDEBAR (desktop) ======= -->
      <aside
        class="sticky top-0 z-30 hidden h-screen w-64 shrink-0 border-r border-white/8 bg-[#060E21]/85 backdrop-blur-xl lg:flex lg:flex-col"
      >
        <!-- Logo -->
        <div class="flex items-center gap-3 border-b border-white/8 px-5 py-5">
          <NuxtLink :to="publicHome" class="flex min-w-0 items-center gap-3">
            <span
              class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10"
              aria-hidden="true"
            >
              <img src="/img/sponsors/Tochero5.JPG" alt="Tochero5" class="h-full w-full object-cover" />
            </span>
            <div class="min-w-0 leading-tight">
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Panel Admin</p>
              <p class="truncate text-[17px] font-extrabold text-white">
                tochero<span class="text-[var(--liga-accent)]">5</span>liga
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Liga switcher: card muy claro, imposible confundir -->
        <div class="px-4 pt-5">
          <p class="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Gestionando
          </p>
          <div
            class="overflow-hidden rounded-2xl border border-white/8 bg-[#0A1428]"
            role="tablist"
            aria-label="Seleccionar liga"
          >
            <!-- Header del switcher: muestra la liga activa -->
            <div
              class="flex items-center gap-3 border-b border-white/8 px-4 py-3"
              :style="`background:linear-gradient(90deg, ${currentLigaColorSoft} 0%, transparent 100%);`"
            >
              <span
                class="grid h-9 w-9 place-items-center rounded-xl text-sm font-black text-white shadow-inner"
                :style="`background:${currentLigaColor}`"
              >
                {{ liga === 'jueves' ? 'J' : 'D' }}
              </span>
              <div class="min-w-0 leading-tight">
                <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Liga activa</p>
                <p class="truncate text-sm font-extrabold text-white">{{ ligaName }}</p>
              </div>
            </div>

            <!-- Tabs para cambiar -->
            <div class="grid grid-cols-2 gap-1 p-1.5">
              <button
                v-for="opt in ligaOptions"
                :key="opt.id"
                type="button"
                role="tab"
                :aria-selected="liga === opt.id"
                class="flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] transition"
                :class="
                  liga === opt.id
                    ? 'text-white shadow-[0_6px_18px_rgba(0,0,0,0.40)]'
                    : 'text-slate-400 hover:text-slate-200'
                "
                :style="liga === opt.id ? `background:${opt.color};` : ''"
                @click="switchLiga(opt.id)"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :style="liga === opt.id ? 'background:#fff' : `background:${opt.color}`"
                  aria-hidden="true"
                />
                {{ opt.shortLabel }}
              </button>
            </div>
          </div>
        </div>

        <!-- Nav principal -->
        <nav class="mt-5 flex-1 space-y-1 overflow-y-auto px-3 pb-6" aria-label="Secciones admin">
          <NuxtLink
            v-for="sec in sections"
            :key="sec.key"
            :to="adminPath(sec.key)"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
            :class="isActive(sec.key) ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'"
            :style="isActive(sec.key)
              ? `background:var(--liga-accent-soft);box-shadow:inset 0 0 0 1px var(--liga-accent-ring);`
              : ''"
          >
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/5 transition group-hover:bg-white/8"
              :style="isActive(sec.key)
                ? `background:var(--liga-accent);border-color:transparent;color:#fff;`
                : ''"
            >
              <component :is="sec.icon" class="h-[18px] w-[18px]" />
            </span>
            <span class="truncate">{{ sec.label }}</span>
            <span
              v-if="isActive(sec.key)"
              class="ml-auto h-2 w-2 shrink-0 rounded-full"
              :style="`background:var(--liga-accent);`"
              aria-hidden="true"
            />
          </NuxtLink>
        </nav>

        <!-- Footer: volver al sitio + logout -->
        <div class="border-t border-white/8 px-3 py-3">
          <NuxtLink
            :to="publicHome"
            class="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Ver {{ ligaName }}
          </NuxtLink>

          <button
            v-if="kcReady && isAuthenticated"
            type="button"
            class="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-200"
            @click="onLogout"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 17l5-5-5-5M20 12H9M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Salir
          </button>
        </div>
      </aside>

      <!-- ======= MAIN ======= -->
      <main class="flex w-full min-w-0 flex-1 flex-col pb-24 lg:pb-0">
        <!-- Topbar desktop -->
        <div
          class="sticky top-0 z-20 hidden border-b border-white/8 bg-[#060E21]/75 backdrop-blur-xl lg:block"
        >
          <div class="flex items-center justify-between gap-4 px-6 py-4 xl:px-8">
            <div class="min-w-0">
              <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {{ ligaName }} · Admin
              </p>
              <h1 class="mt-0.5 truncate text-xl font-extrabold text-white xl:text-2xl">
                {{ currentSection?.pageTitle ?? 'Panel' }}
              </h1>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="kcReady && isAuthenticated && isAdmin"
                class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                :style="`border-color:var(--liga-accent-ring);background:var(--liga-accent-soft);color:var(--liga-accent);`"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :style="`background:var(--liga-accent);`"
                  aria-hidden="true"
                />
                Sesión admin
              </span>
            </div>
          </div>
        </div>

        <!-- Slot de página -->
        <div class="flex-1">
          <slot />
        </div>
      </main>
    </div>

    <!-- ============================================================== -->
    <!-- DOCK INFERIOR MOBILE                                             -->
    <!-- ============================================================== -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#060E21]/90 backdrop-blur-xl lg:hidden"
      aria-label="Navegación admin"
    >
      <div
        class="mx-auto grid max-w-xl grid-cols-5 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2"
      >
        <NuxtLink
          v-for="sec in sections"
          :key="sec.key + '-dock'"
          :to="adminPath(sec.key)"
          class="relative flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] transition"
          :class="isActive(sec.key) ? 'text-[var(--liga-accent)]' : 'text-slate-400 active:text-slate-200'"
        >
          <span
            v-if="isActive(sec.key)"
            class="absolute inset-x-3 top-0 h-[2px] rounded-full"
            :style="`background:var(--liga-accent);`"
            aria-hidden="true"
          />
          <component :is="sec.icon" class="h-5 w-5" />
          <span>{{ sec.shortLabel ?? sec.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, markRaw, onMounted } from 'vue'
import { useNuxtApp, useRoute, useRouter, useState } from '#imports'
import { useAuthz } from '~/composables/useAuthz'

type Liga = 'domingo' | 'jueves'
type SectionKey = 'inicio' | 'partidos' | 'usuarios' | 'jugadores' | 'equipos'

// ---------------------------------------------------------------------------
// Liga detection (por ruta). Default: domingo.
// ---------------------------------------------------------------------------
const route = useRoute()
const router = useRouter()

const liga = computed<Liga>(() => {
  return route.path.startsWith('/jueves') ? 'jueves' : 'domingo'
})

const ligaName = computed(() => (liga.value === 'jueves' ? 'Liga Nocturna' : 'Liga Dominical'))

const ligaOptions: { id: Liga; shortLabel: string; color: string }[] = [
  { id: 'domingo', shortLabel: 'Dominical', color: '#10b981' },
  { id: 'jueves', shortLabel: 'Nocturna', color: '#fb923c' },
]

const currentLigaColor = computed(() => (liga.value === 'jueves' ? '#fb923c' : '#10b981'))
const currentLigaColorSoft = computed(() =>
  liga.value === 'jueves' ? 'rgba(251,146,60,0.18)' : 'rgba(16,185,129,0.18)'
)

const publicHome = computed(() => (liga.value === 'jueves' ? '/jueves' : '/domingo'))

function ligaBase(target: Liga) {
  return target === 'jueves' ? '/jueves/admin' : '/domingo/admin'
}

function adminPath(section: SectionKey, target: Liga = liga.value) {
  const base = ligaBase(target)
  // inicio es la raíz del panel (pages/*/admin/index.vue)
  return section === 'inicio' ? base : `${base}/${section}`
}

function switchLiga(target: Liga) {
  if (liga.value === target) return
  // conservar la sección actual al cambiar de liga
  const current = currentSection.value?.key ?? 'inicio'
  router.push(adminPath(current, target))
}

// ---------------------------------------------------------------------------
// Secciones + iconos (componentes inline, sin dependencias)
// ---------------------------------------------------------------------------
const IconHome = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    [
      h('path', {
        d: 'M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linejoin': 'round',
      }),
    ]
  )

const IconBall = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    [
      h('path', {
        d: 'M3 11a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z',
        stroke: 'currentColor',
        'stroke-width': '1.7',
      }),
      h('path', {
        d: 'M12 7v10M8 9l8 6M16 9l-8 6',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linecap': 'round',
      }),
    ]
  )

const IconUsers = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    [
      h('path', {
        d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linecap': 'round',
      }),
      h('circle', { cx: '9', cy: '7', r: '4', stroke: 'currentColor', 'stroke-width': '1.7' }),
      h('path', {
        d: 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 10.87',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linecap': 'round',
      }),
    ]
  )

const IconPlayer = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    [
      h('circle', { cx: '12', cy: '7', r: '3.5', stroke: 'currentColor', 'stroke-width': '1.7' }),
      h('path', {
        d: 'M5 21a7 7 0 0 1 14 0',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linecap': 'round',
      }),
    ]
  )

const IconShield = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    [
      h('path', {
        d: 'M12 3l8 3v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-3z',
        stroke: 'currentColor',
        'stroke-width': '1.7',
        'stroke-linejoin': 'round',
      }),
    ]
  )

type Section = {
  key: SectionKey
  label: string
  shortLabel?: string
  pageTitle: string
  icon: any
}

// markRaw para que Vue no haga reactivo al componente funcional
const sections: Section[] = [
  { key: 'inicio', label: 'Inicio', shortLabel: 'Inicio', pageTitle: 'Página de inicio', icon: markRaw(IconHome) },
  { key: 'partidos', label: 'Partidos', shortLabel: 'Partidos', pageTitle: 'Administrar partidos', icon: markRaw(IconBall) },
  { key: 'usuarios', label: 'Usuarios', shortLabel: 'Usuarios', pageTitle: 'Usuarios y accesos', icon: markRaw(IconUsers) },
  { key: 'jugadores', label: 'Jugadores', shortLabel: 'Jugadores', pageTitle: 'Gestión de jugadores', icon: markRaw(IconPlayer) },
  { key: 'equipos', label: 'Equipos', shortLabel: 'Equipos', pageTitle: 'Gestión de equipos', icon: markRaw(IconShield) },
]

function isActive(key: SectionKey) {
  const target = adminPath(key)
  // Inicio = raíz del panel: solo activa en la ruta exacta
  if (key === 'inicio') return route.path === target || route.path === `${target}/`
  return route.path === target || route.path.startsWith(`${target}/`)
}

const currentSection = computed<Section | undefined>(() =>
  sections.find((s) => isActive(s.key))
)

// ---------------------------------------------------------------------------
// Auth (mismo patrón que LigaBHeader / default.vue)
// ---------------------------------------------------------------------------
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated, isAdmin } = useAuthz()

function onLogout() {
  const kc = (nuxtApp as any).$kc
  if (typeof window === 'undefined' || !kc) return
  kc.logout({ redirectUri: window.location.origin })
}

// ---------------------------------------------------------------------------
// SEO: marcar la liga en <html> para CSS condicional opcional
// ---------------------------------------------------------------------------
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.ligaAdmin = liga.value
  }
})
</script>

<style scoped>
/* ============================================================
   CSS VARIABLES por liga — exponemos tokens de color al slot.
   Consumible desde hijos vía: var(--liga-accent), etc.
   ============================================================ */
.liga-admin-root {
  --liga-accent: #10b981;
  --liga-accent-strong: #059669;
  --liga-accent-soft: rgba(16, 185, 129, 0.12);
  --liga-accent-ring: rgba(16, 185, 129, 0.35);
  --liga-accent-glow: rgba(16, 185, 129, 0.28);
}

.liga-admin-root[data-liga='jueves'] {
  --liga-accent: #fb923c;
  --liga-accent-strong: #f97316;
  --liga-accent-soft: rgba(251, 146, 60, 0.12);
  --liga-accent-ring: rgba(251, 146, 60, 0.35);
  --liga-accent-glow: rgba(251, 146, 60, 0.32);
}

/* Scroll más suave dentro del sidebar */
aside nav::-webkit-scrollbar {
  width: 4px;
}
aside nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}
</style>
