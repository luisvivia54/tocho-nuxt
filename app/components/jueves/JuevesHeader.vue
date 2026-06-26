<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#050816]/88 backdrop-blur-xl">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between gap-5">
        <!-- Logo / Brand -->
        <NuxtLink
          to="/jueves"
          class="group flex shrink-0 items-center gap-3 whitespace-nowrap"
          @click="closeAllMenus"
        >
          <span
            class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-orange-400/20 bg-white/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition group-hover:border-orange-300/35 group-hover:bg-white/[0.07]"
          >
            <img
              :src="brandLogo"
              alt="Tochero5"
              class="h-9 w-9 object-contain"
            />
          </span>

          <span class="hidden text-[1.75rem] font-black tracking-tight text-white sm:inline-flex">
            tochero<span class="text-orange-400">5</span>liga
          </span>

          <span class="text-[1rem] font-semibold text-slate-200 sm:hidden">
            Liga de Jueves
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-9">
          <NuxtLink
            v-for="item in visibleNav"
            :key="item.to"
            :to="item.to"
            class="relative whitespace-nowrap text-[0.95rem] font-semibold transition"
            :class="isActive(item.to) ? 'text-white' : 'text-slate-300 hover:text-white'"
            @click="closeAllMenus"
          >
            {{ item.label }}

            <span
              v-if="isActive(item.to)"
              class="absolute -bottom-[29px] left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-orange-400"
            />
          </NuxtLink>
        </nav>

        <!-- Desktop right -->
        <div class="hidden shrink-0 items-center gap-4 lg:flex">
          <!-- Admin dropdown desktop -->
          <div
            v-if="kcReady && isAuthenticated && isAdmin"
            ref="adminMenuWrap"
            class="relative"
          >
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:border-orange-300/35 hover:bg-orange-500/10"
              :aria-expanded="adminMenuOpen ? 'true' : 'false'"
              aria-haspopup="menu"
              @click.stop="toggleAdminMenu"
            >
              <ShieldCheck class="h-4 w-4 text-orange-300" />
              Admin
              <ChevronDown
                class="h-4 w-4 text-slate-300 transition-transform duration-200"
                :class="adminMenuOpen ? 'rotate-180' : ''"
              />
            </button>

            <Transition name="admin-dropdown">
              <div
                v-if="adminMenuOpen"
                class="absolute right-0 top-[calc(100%+14px)] z-[140] w-[335px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050c1b] text-white shadow-[0_22px_70px_rgba(0,0,0,0.45)]"
                role="menu"
              >
                <div class="border-b border-white/10 px-5 py-4">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Panel Admin
                  </p>
                  <p class="mt-1 text-[0.95rem] font-extrabold text-white">
                    Accesos rápidos
                  </p>
                </div>

                <div class="space-y-1 px-4 py-4">
                  <NuxtLink
                    v-for="item in adminLinks"
                    :key="item.to"
                    :to="item.to"
                    class="group flex items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-white/[0.04]"
                    :class="isActive(item.to) ? 'bg-orange-500/10' : ''"
                    role="menuitem"
                    @click="closeAllMenus"
                  >
                    <span
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition"
                      :class="
                        isActive(item.to)
                          ? 'border-orange-300/35 bg-orange-400/15 text-orange-200'
                          : 'border-white/10 bg-[#0b1730] text-slate-100 group-hover:border-orange-300/25 group-hover:text-orange-200'
                      "
                    >
                      <component :is="item.icon" class="h-5 w-5" />
                    </span>

                    <span class="min-w-0">
                      <span class="block truncate text-[0.95rem] font-extrabold text-white">
                        {{ item.label }}
                      </span>
                      <span class="block truncate text-xs text-slate-400">
                        {{ item.help }}
                      </span>
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <a
            href="https://www.instagram.com/tochero5liga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-300 transition hover:text-white"
            aria-label="Instagram"
          >
            <Instagram class="h-5 w-5" />
          </a>

          <NuxtLink
            to="/"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-orange-300/35 hover:bg-orange-500/10 hover:text-white"
            aria-label="Ir al home principal"
            title="Ir al home principal"
            @click="closeAllMenus"
          >
            <House class="h-5 w-5" />
          </NuxtLink>

          <template v-if="kcReady && !isAuthenticated">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogin"
            >
              Entrar
            </button>
          </template>

          <template v-else-if="kcReady && isAuthenticated">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </template>
        </div>

        <!-- Mobile button -->
        <button
          type="button"
          class="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition hover:brightness-110 lg:hidden"
          :aria-expanded="mobileOpen ? 'true' : 'false'"
          aria-haspopup="dialog"
          aria-label="Abrir menú"
          @click="toggleMobileMenu"
        >
          <Menu class="h-5 w-5" />
          <span>Menú</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile admin dock -->
  <nav
    v-if="kcReady && isAuthenticated && isAdmin"
    class="fixed inset-x-3 bottom-4 z-[90] rounded-[28px] border border-white/10 bg-[#050c1b] px-2 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.55)] sm:inset-x-4 lg:hidden"
    aria-label="Accesos admin móviles"
  >
    <div class="grid grid-cols-6 gap-1">
      <NuxtLink
        v-for="item in mobileAdminDockLinks"
        :key="`${item.to}-mobile-dock`"
        :to="item.to"
        class="group flex min-w-0 flex-col items-center justify-center rounded-2xl px-1 py-2 transition hover:bg-white/[0.04]"
        :class="isActive(item.to) ? 'text-orange-300' : 'text-slate-400'"
        @click="closeAllMenus"
      >
        <component
          :is="item.icon"
          class="mb-1 h-5 w-5 transition"
          :class="isActive(item.to) ? 'text-orange-300' : 'text-slate-400 group-hover:text-slate-200'"
        />

        <span
          class="truncate text-[10px] font-extrabold leading-tight sm:text-[11px]"
          :class="isActive(item.to) ? 'text-orange-200' : 'text-slate-400 group-hover:text-slate-200'"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>

  <!-- Mobile overlay -->
  <Teleport to="body">
    <Transition name="mobile-fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[110] bg-black/58 backdrop-blur-[2px] lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile menu estilo domingo: SIN links admin -->
    <Transition name="mobile-panel">
      <section
        v-if="mobileOpen"
        class="fixed inset-x-4 top-[96px] z-[120] overflow-hidden rounded-[30px] border border-white/10 bg-[#050c1b] text-white shadow-[0_22px_70px_rgba(0,0,0,0.48)] sm:inset-x-6 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menú Liga de Jueves"
      >
        <div class="max-h-[calc(100dvh-120px)] overflow-y-auto">
          <div class="px-5 py-6 sm:px-7">
            <div class="space-y-1">
              <NuxtLink
                v-for="item in visibleNav"
                :key="`${item.to}-mobile`"
                :to="item.to"
                class="block rounded-2xl px-2 py-3 text-[1.05rem] font-semibold transition hover:bg-white/[0.04]"
                :class="isActive(item.to) ? 'text-orange-300' : 'text-slate-100'"
                @click="closeAllMenus"
              >
                {{ item.label }}
              </NuxtLink>

              <NuxtLink
                to="/"
                class="mt-2 flex items-center gap-4 rounded-2xl px-2 py-3 text-[1.05rem] font-semibold text-slate-100 transition hover:bg-white/[0.04]"
                @click="closeAllMenus"
              >
                <House class="h-5 w-5 text-slate-100" />
                <span>Home</span>
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-5 sm:px-7">
            <a
              href="https://www.instagram.com/tochero5liga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-[1.05rem] font-semibold text-slate-200 transition hover:text-white"
              aria-label="Instagram"
            >
              <Instagram class="h-6 w-6" />
              <span>Instagram</span>
            </a>

            <template v-if="kcReady && !isAuthenticated">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="authActionLoading"
                @click="handleLogin"
              >
                Iniciar Sesión
              </button>
            </template>

            <template v-else-if="kcReady && isAuthenticated">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="authActionLoading"
                @click="handleLogout"
              >
                Cerrar sesión
              </button>
            </template>
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import {
  CalendarPlus,
  ChevronDown,
  ClipboardList,
  House,
  Instagram,
  Menu,
  ShieldCheck,
  Trash2,
  User,
  Users,
} from "lucide-vue-next"
import { useRoute, useNuxtApp } from "#app"
import { useAuthz } from "~/composables/useAuthz"
import { useBackendUser } from "~/composables/useBackendUser"

type NavItem = {
  label: string
  to: string
}

type AdminItem = {
  label: string
  help: string
  to: string
  icon: any
}

const brandLogo = "/img/sponsors/Tochero5.JPG"

const route = useRoute()
const nuxtApp = useNuxtApp()

const mobileOpen = ref(false)
const adminMenuOpen = ref(false)
const adminMenuWrap = ref<HTMLElement | null>(null)
const authActionLoading = ref(false)

const { isAuthenticated, isAdmin } = useAuthz() as any
const { syncBackendUser } = useBackendUser()

const { $kc, $kcReady } = nuxtApp as any

const kcReady = computed<boolean>(() => Boolean($kcReady?.value))

const visibleNav = computed<NavItem[]>(() => {
  return [
    {
      label: "Inicio",
      to: "/jueves",
    },
    {
      label: "Partidos",
      to: "/jueves/partidos",
    },
    {
      label: "Equipos",
      to: "/jueves/equipos",
    },
    {
      label: "Estadísticas",
      to: "/jueves/estadisticas",
    },
    {
      label: "Registro",
      to: kcReady.value && isAuthenticated.value ? "/jueves/mi-equipo" : "/jueves/registro",
    },
  ]
})

const adminLinks: AdminItem[] = [
  {
    label: "Inicio",
    help: "Editar Home",
    to: "/jueves/admin",
    icon: House,
  },
  {
    label: "Temporadas",
    help: "Crear nueva temporada",
    to: "/jueves/admin/temporadas",
    icon: CalendarPlus,
  },
  {
    label: "Partidos",
    help: "Administración",
    to: "/jueves/admin/partidos",
    icon: ClipboardList,
  },
  {
    label: "Usuarios",
    help: "Roles / acceso",
    to: "/jueves/admin/usuarios",
    icon: Users,
  },
  {
    label: "Jugadores",
    help: "Gestión",
    to: "/jueves/admin/jugadores",
    icon: User,
  },
  {
    label: "Equipos",
    help: "Borrar / limpiar",
    to: "/jueves/admin/equipos",
    icon: Trash2,
  },
]

const mobileAdminDockLinks: AdminItem[] = [
  {
    label: "Inicio",
    help: "Editar Home",
    to: "/jueves/admin",
    icon: House,
  },
  {
    label: "Temp.",
    help: "Crear temporada",
    to: "/jueves/admin/temporadas",
    icon: CalendarPlus,
  },
  {
    label: "Partidos",
    help: "Administración",
    to: "/jueves/admin/partidos",
    icon: ClipboardList,
  },
  {
    label: "Usuarios",
    help: "Roles / acceso",
    to: "/jueves/admin/usuarios",
    icon: Users,
  },
  {
    label: "Jugadores",
    help: "Gestión",
    to: "/jueves/admin/jugadores",
    icon: User,
  },
  {
    label: "Equipos",
    help: "Borrar / limpiar",
    to: "/jueves/admin/equipos",
    icon: Trash2,
  },
]

watch(
  () => isAuthenticated.value,
  async (loggedIn) => {
    if (loggedIn) {
      await syncBackendUser()
    }
  },
  { immediate: true }
)

watch(
  () => route.path,
  () => {
    closeAllMenus()
  }
)

watch(mobileOpen, (open) => {
  if (typeof document === "undefined") return

  document.documentElement.style.overflow = open ? "hidden" : ""
  document.body.style.overflow = open ? "hidden" : ""
})

function isActive(path: string) {
  if (path === "/jueves") return route.path === "/jueves"

  return route.path === path || route.path.startsWith(path + "/")
}

function toggleMobileMenu() {
  adminMenuOpen.value = false
  mobileOpen.value = !mobileOpen.value
}

function closeMobileMenu() {
  mobileOpen.value = false
}

function toggleAdminMenu() {
  mobileOpen.value = false
  adminMenuOpen.value = !adminMenuOpen.value
}

function closeAllMenus() {
  mobileOpen.value = false
  adminMenuOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (!adminMenuOpen.value) return

  const wrap = adminMenuWrap.value
  const target = e.target as Node | null

  if (wrap && target && !wrap.contains(target)) {
    adminMenuOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeAllMenus()
  }
}

async function handleLogin() {
  try {
    authActionLoading.value = true
    await $kc?.login?.({
      redirectUri: `${window.location.origin}/jueves`,
    })
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
  } finally {
    authActionLoading.value = false
  }
}

async function handleLogout() {
  try {
    authActionLoading.value = true
    await $kc?.logout?.({
      redirectUri: `${window.location.origin}/jueves`,
    })
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
  } finally {
    authActionLoading.value = false
  }
}

onMounted(() => {
  if (typeof document === "undefined") return

  document.addEventListener("click", onDocClick, { capture: true })
  document.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  if (typeof document === "undefined") return

  document.removeEventListener("click", onDocClick, { capture: true } as any)
  document.removeEventListener("keydown", onKeydown)

  document.documentElement.style.overflow = ""
  document.body.style.overflow = ""
})
</script>

<style scoped>
.admin-dropdown-enter-active,
.admin-dropdown-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.admin-dropdown-enter-from,
.admin-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
}

.mobile-panel-enter-active,
.mobile-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.mobile-panel-enter-from,
.mobile-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>