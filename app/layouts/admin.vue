<!-- app/layouts/admin.vue -->
<template>
  <div
    class="liga-admin-root min-h-screen bg-[#050B1A] font-body text-slate-100"
    :data-liga="liga"
  >
    <!-- Fondo -->
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
    </div>

    <!-- HEADER DESKTOP / TABLET -->
    <header
      class="sticky top-0 z-50 border-b border-white/8 bg-[#060E21]/92 backdrop-blur-xl"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <nav class="flex h-20 items-center justify-between gap-4">
          <!-- Logo -->
          <NuxtLink
            :to="publicHome"
            class="flex min-w-0 shrink-0 items-center gap-3"
            @click="closeMobileMenu"
          >
            <span
              class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-black/35 ring-1 ring-white/10"
            >
              <img
                src="/img/sponsors/Tochero5.JPG"
                alt="Tochero5"
                class="h-full w-full object-cover"
              />
            </span>

            <span
              class="hidden truncate text-[1.35rem] font-black tracking-tight text-white sm:block"
            >
              tochero<span class="text-[var(--liga-accent)]">5</span>liga
            </span>

            <span class="block truncate text-lg font-black text-white sm:hidden">
              {{ liga === 'jueves' ? 'Liga de Jueves' : 'Liga Dominical' }}
            </span>
          </NuxtLink>

          <!-- Public nav desktop -->
          <div class="hidden items-center gap-7 lg:flex">
            <NuxtLink
              v-for="item in publicNav"
              :key="item.to"
              :to="item.to"
              class="relative whitespace-nowrap text-[0.92rem] font-bold text-slate-300 transition hover:text-white"
              :class="isPublicActive(item.to) ? 'text-white' : ''"
            >
              {{ item.label }}

              <span
                v-if="isPublicActive(item.to)"
                class="absolute -bottom-[29px] left-1/2 h-[2px] w-9 -translate-x-1/2 rounded-full bg-[var(--liga-accent)]"
              />
            </NuxtLink>
          </div>

          <!-- Actions desktop -->
          <div class="hidden shrink-0 items-center gap-3 lg:flex">
            <!-- Admin dropdown -->
            <div ref="adminWrap" class="relative">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:border-[var(--liga-accent-ring)] hover:bg-white/[0.07]"
                :aria-expanded="adminOpen ? 'true' : 'false'"
                aria-haspopup="menu"
                @click="toggleAdmin"
              >
                <svg class="h-4 w-4 text-[var(--liga-accent)]" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.5 12.5l1.7 1.7 3.8-4.2"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                Admin

                <svg
                  class="h-4 w-4 text-slate-300 transition"
                  :class="adminOpen ? 'rotate-180' : ''"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-120 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
              >
                <div
                  v-if="adminOpen"
                  class="absolute right-0 top-full z-[100] mt-3 w-[330px] overflow-hidden rounded-[24px] border border-white/10 bg-[#07101F] shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
                  role="menu"
                >
                  <div class="border-b border-white/10 px-5 py-4">
                    <p class="text-[11px] font-black uppercase tracking-[0.34em] text-slate-400">
                      Panel Admin
                    </p>
                    <p class="mt-1 text-sm font-bold text-white">
                      Accesos rápidos
                    </p>
                  </div>

                  <div class="grid gap-1.5 p-2.5">
                    <NuxtLink
                      v-for="sec in sections"
                      :key="sec.key"
                      :to="adminPath(sec.key)"
                      class="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-slate-100 transition hover:bg-white/[0.06]"
                      :class="isAdminActive(sec.key) ? 'bg-white/[0.08] ring-1 ring-white/10' : ''"
                      @click="closeAdmin"
                    >
                      <div class="flex min-w-0 items-center gap-3">
                        <span
                          class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#0D1930] text-slate-200 transition group-hover:text-white"
                          :class="isAdminActive(sec.key) ? 'text-[var(--liga-accent)]' : ''"
                        >
                          <component :is="sec.icon" class="h-5 w-5" />
                        </span>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-black text-white">
                            {{ sec.label }}
                          </p>
                          <p class="truncate text-[11px] text-slate-400">
                            {{ sec.help }}
                          </p>
                        </div>
                      </div>

                      <svg class="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-300" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          stroke-width="1.9"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>

            <a
              href="https://www.instagram.com/tochero5liga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener"
              class="text-white/70 transition hover:text-white"
              aria-label="Instagram"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
              </svg>
            </a>

            <NuxtLink
              to="/"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-[var(--liga-accent-ring)] hover:bg-white/[0.07] hover:text-white"
              aria-label="Ir al home general"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>

            <button
              v-if="kcReady && isAuthenticated"
              type="button"
              class="rounded-full bg-[var(--liga-accent)] px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_var(--liga-accent-glow)] transition hover:brightness-110"
              @click="onLogout"
            >
              Cerrar sesión
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            type="button"
            class="inline-flex items-center gap-3 rounded-full bg-[var(--liga-accent)] px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_var(--liga-accent-glow)] transition hover:brightness-110 lg:hidden"
            :aria-expanded="mobileOpen ? 'true' : 'false'"
            aria-label="Abrir menú"
            @click="toggleMobileMenu"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Menú
          </button>
        </nav>

        <!-- Mobile menu panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div v-if="mobileOpen" class="lg:hidden">
            <div class="fixed inset-0 z-40 bg-black/60" @click="closeMobileMenu" />

            <div class="absolute inset-x-0 top-full z-50">
              <div class="mx-4 mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#07101F] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div class="grid gap-1 p-3 text-sm">
                  <NuxtLink
                    v-for="item in publicNav"
                    :key="`${item.to}-mobile`"
                    :to="item.to"
                    class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/[0.08]"
                    @click="closeMobileMenu"
                  >
                    {{ item.label }}
                  </NuxtLink>

                  <NuxtLink
                    to="/"
                    class="rounded-2xl px-3 py-2 text-slate-100 hover:bg-white/[0.08]"
                    @click="closeMobileMenu"
                  >
                    Home
                  </NuxtLink>
                </div>

                <div class="flex items-center justify-between gap-3 border-t border-white/10 px-4 pb-4 pt-3">
                  <a
                    href="https://www.instagram.com/tochero5liga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                    @click="closeMobileMenu"
                  >
                    Instagram
                  </a>

                  <button
                    v-if="kcReady && isAuthenticated"
                    type="button"
                    class="rounded-2xl bg-[var(--liga-accent)] px-5 py-2.5 text-sm font-black text-white"
                    @click="onLogout"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>

    <!-- CONTENIDO -->
    <main class="min-w-0 pb-24 lg:pb-0">
      <slot />
    </main>

    <!-- DOCK ADMIN SOLO MOBILE -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden"
      aria-label="Navegación admin móvil"
    >
      <div
        class="mx-auto max-w-xl rounded-[999px] border border-white/10 bg-[#060E21]/92 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl"
      >
        <div class="grid grid-cols-6 gap-1">
          <NuxtLink
            v-for="sec in sections"
            :key="`${sec.key}-dock`"
            :to="adminPath(sec.key)"
            class="group flex flex-col items-center justify-center gap-1 rounded-[999px] px-1 py-2 text-[10px] font-black uppercase tracking-[0.06em] transition"
            :class="
              isAdminActive(sec.key)
                ? 'bg-white/[0.08] text-[var(--liga-accent)]'
                : 'text-slate-400 hover:bg-white/[0.04] active:bg-white/[0.06]'
            "
          >
            <span
              class="grid h-9 w-9 place-items-center rounded-full transition"
              :class="
                isAdminActive(sec.key)
                  ? 'bg-[var(--liga-accent-soft)] text-[var(--liga-accent)] ring-1 ring-[var(--liga-accent-ring)]'
                  : 'text-slate-400 group-hover:text-slate-200'
              "
            >
              <component :is="sec.icon" class="h-5 w-5" />
            </span>

            <span class="leading-none">
              {{ sec.shortLabel }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, markRaw, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useNuxtApp, useRoute, useRouter, useState } from "#imports"
import { useAuthz } from "~/composables/useAuthz"

type Liga = "domingo" | "jueves"
type SectionKey = "inicio" | "temporadas" | "partidos" | "usuarios" | "jugadores" | "equipos"

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

const mobileOpen = ref(false)
const adminOpen = ref(false)
const adminWrap = ref<HTMLElement | null>(null)

const kcReady = useState<boolean>("kcReady", () => false)
const { isAuthenticated, isAdmin } = useAuthz() as any

const liga = computed<Liga>(() => {
  if (route.path.startsWith("/jueves")) return "jueves"
  return "domingo"
})

const publicHome = computed(() => {
  return liga.value === "jueves" ? "/jueves" : "/domingo"
})

const publicNav = computed(() => {
  if (liga.value === "jueves") {
    return [
      { label: "Inicio", to: "/jueves" },
      { label: "Partidos", to: "/jueves/partidos" },
      { label: "Equipos", to: "/jueves/equipos" },
      { label: "Estadísticas", to: "/jueves/estadisticas" },
      { label: "Registro", to: "/jueves/mi-equipo" },
    ]
  }

  return [
    { label: "Inicio", to: "/domingo" },
    { label: "Partidos", to: "/partidos" },
    { label: "Equipos", to: "/equipos" },
    { label: "Estadísticas", to: "/estadisticas" },
    { label: "Registro", to: "/mi-equipo" },
  ]
})

function adminPath(section: SectionKey, target: Liga = liga.value) {
  if (target === "jueves") {
    const base = "/jueves/admin"
    return section === "inicio" ? base : `${base}/${section}`
  }

  if (section === "inicio") return "/admin/inicio"
  if (section === "temporadas") return "/domingo/admin/temporadas"

  return `/admin/${section}`
}

function redirectDomingoPlaceholders() {
  if (!import.meta.client) return

  const cleanPath = route.path.replace(/\/+$/, "")

  if (cleanPath === "/domingo/admin") {
    router.replace("/admin/inicio")
    return
  }

  const map: Record<string, string> = {
    "/domingo/admin/partidos": "/admin/partidos",
    "/domingo/admin/usuarios": "/admin/usuarios",
    "/domingo/admin/jugadores": "/admin/jugadores",
    "/domingo/admin/equipos": "/admin/equipos",
  }

  for (const [from, to] of Object.entries(map)) {
    if (cleanPath === from || cleanPath.startsWith(`${from}/`)) {
      router.replace(cleanPath.replace(from, to))
      return
    }
  }
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
    adminOpen.value = false
    redirectDomingoPlaceholders()
  },
  { immediate: true }
)

watch(mobileOpen, (open) => {
  if (typeof document === "undefined") return
  document.documentElement.style.overflow = open ? "hidden" : ""
  document.body.style.overflow = open ? "hidden" : ""
})

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobileMenu() {
  mobileOpen.value = false
}

function toggleAdmin() {
  adminOpen.value = !adminOpen.value
}

function closeAdmin() {
  adminOpen.value = false
}

function isPublicActive(path: string) {
  if (path === "/domingo") return route.path === "/domingo"
  if (path === "/jueves") return route.path === "/jueves"

  return route.path === path || route.path.startsWith(`${path}/`)
}

function isAdminActive(key: SectionKey) {
  const target = adminPath(key)

  if (key === "inicio") {
    if (liga.value === "jueves") {
      return route.path === "/jueves/admin" || route.path === "/jueves/admin/"
    }

    return route.path === "/admin/inicio" || route.path === "/admin/inicio/"
  }

  return route.path === target || route.path.startsWith(`${target}/`)
}

function onLogout() {
  const kc = (nuxtApp as any).$kc
  if (typeof window === "undefined" || !kc) return

  kc.logout({
    redirectUri: window.location.origin,
  })
}

function onDocClick(e: MouseEvent) {
  if (!adminOpen.value) return

  const wrap = adminWrap.value
  const target = e.target as Node | null

  if (wrap && target && !wrap.contains(target)) {
    adminOpen.value = false
  }
}

onMounted(() => {
  if (typeof document === "undefined") return
  document.addEventListener("click", onDocClick, { capture: true })
  document.documentElement.dataset.ligaAdmin = liga.value
})

onBeforeUnmount(() => {
  if (typeof document === "undefined") return
  document.removeEventListener("click", onDocClick, { capture: true } as any)
  document.documentElement.style.overflow = ""
  document.body.style.overflow = ""
})

const IconHome = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("path", {
      d: "M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linejoin": "round",
    }),
  ])

const IconCalendar = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("path", {
      d: "M8 2v4M16 2v4M4 9h16",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
    h("path", {
      d: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linejoin": "round",
    }),
    h("path", {
      d: "M12 13v5M9.5 15.5h5",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
  ])

const IconBall = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("path", {
      d: "M3 11a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z",
      stroke: "currentColor",
      "stroke-width": "1.7",
    }),
    h("path", {
      d: "M12 7v10M8 9l8 6M16 9l-8 6",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
  ])

const IconUsers = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("path", {
      d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
    h("circle", {
      cx: "9",
      cy: "7",
      r: "4",
      stroke: "currentColor",
      "stroke-width": "1.7",
    }),
    h("path", {
      d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 10.87",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
  ])

const IconPlayer = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("circle", {
      cx: "12",
      cy: "7",
      r: "3.5",
      stroke: "currentColor",
      "stroke-width": "1.7",
    }),
    h("path", {
      d: "M5 21a7 7 0 0 1 14 0",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linecap": "round",
    }),
  ])

const IconShield = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none" }, [
    h("path", {
      d: "M12 3l8 3v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-3z",
      stroke: "currentColor",
      "stroke-width": "1.7",
      "stroke-linejoin": "round",
    }),
  ])

const sections = [
  {
    key: "inicio" as SectionKey,
    label: "Inicio",
    shortLabel: "Inicio",
    help: "Editar Home",
    icon: markRaw(IconHome),
  },
  {
    key: "temporadas" as SectionKey,
    label: "Temporadas",
    shortLabel: "Temp.",
    help: "Nueva temporada",
    icon: markRaw(IconCalendar),
  },
  {
    key: "partidos" as SectionKey,
    label: "Partidos",
    shortLabel: "Part.",
    help: "Administración",
    icon: markRaw(IconBall),
  },
  {
    key: "usuarios" as SectionKey,
    label: "Usuarios",
    shortLabel: "Users",
    help: "Roles / acceso",
    icon: markRaw(IconUsers),
  },
  {
    key: "jugadores" as SectionKey,
    label: "Jugadores",
    shortLabel: "Jug.",
    help: "Gestión",
    icon: markRaw(IconPlayer),
  },
  {
    key: "equipos" as SectionKey,
    label: "Equipos",
    shortLabel: "Equipos",
    help: "Borrar / limpiar",
    icon: markRaw(IconShield),
  },
]
</script>

<style scoped>
.liga-admin-root {
  --liga-accent: #2563eb;
  --liga-accent-soft: rgba(37, 99, 235, 0.12);
  --liga-accent-ring: rgba(37, 99, 235, 0.36);
  --liga-accent-glow: rgba(37, 99, 235, 0.28);
}

.liga-admin-root[data-liga="jueves"] {
  --liga-accent: #fb923c;
  --liga-accent-soft: rgba(251, 146, 60, 0.12);
  --liga-accent-ring: rgba(251, 146, 60, 0.38);
  --liga-accent-glow: rgba(251, 146, 60, 0.30);
}
</style>