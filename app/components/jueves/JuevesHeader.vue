<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#050816]/88 backdrop-blur-xl">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div class="flex h-20 items-center justify-between gap-4">
        <!-- Left -->
        <NuxtLink to="/jueves" class="flex shrink-0 items-center gap-3 whitespace-nowrap">
          <span class="text-[2rem] font-black leading-none tracking-tight text-orange-400">T5</span>
          <span class="text-[1rem] font-medium text-slate-300 lg:text-[1.08rem]">Liga de Jueves</span>
        </NuxtLink>

        <!-- Center desktop nav -->
        <nav class="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
          <NuxtLink
            v-for="item in desktopNav"
            :key="item.to"
            :to="item.to"
            class="relative whitespace-nowrap text-[0.84rem] font-extrabold uppercase tracking-[0.18em] transition xl:text-[0.9rem]"
            :class="isActive(item.to) ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ item.label }}
            <span
              v-if="isActive(item.to)"
              class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
            />
          </NuxtLink>
        </nav>

        <!-- Right desktop -->
        <div class="hidden shrink-0 items-center gap-3 lg:flex">
          <template v-if="kcReady && !isAuthenticated">
            <button
              type="button"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogin"
            >
              Entrar
            </button>
          </template>

          <template v-else-if="kcReady && isAuthenticated">
            <!-- Dropdown admin -->
            <div v-if="isAdmin" ref="adminMenuWrap" class="relative">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-orange-400/35 bg-gradient-to-r from-orange-500/18 to-orange-400/10 px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-orange-100 shadow-[0_10px_28px_rgba(249,115,22,0.16)] transition hover:border-orange-300/55 hover:from-orange-500/24 hover:to-orange-400/16 hover:text-white"
                :aria-expanded="adminMenuOpen ? 'true' : 'false'"
                aria-haspopup="menu"
                @click="toggleAdminMenu"
              >
                Panel Admin
                <ChevronDown
                  class="h-4 w-4 transition-transform duration-200"
                  :class="adminMenuOpen ? 'rotate-180' : ''"
                />
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-120 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="adminMenuOpen"
                  class="absolute right-0 z-[130] mt-3 w-[308px] overflow-hidden rounded-2xl border border-white/10 bg-[#071225] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                  role="menu"
                >
                  <div class="border-b border-white/10 px-4 py-3">
                    <p class="text-[11px] font-extrabold uppercase tracking-[0.22em] text-orange-300">
                      Panel Admin
                    </p>
                    <p class="text-xs text-slate-400">Accesos rápidos</p>
                  </div>

                  <div class="grid gap-1 p-2">
                    <NuxtLink
                      v-for="item in adminLinks"
                      :key="item.to"
                      :to="item.to"
                      class="menu-item"
                      :class="isActive(item.to) ? 'menu-item--active' : ''"
                      @click="closeAdminMenu"
                    >
                      <span class="menu-ic">
                        <component :is="item.icon" class="h-5 w-5" />
                      </span>

                      <div class="min-w-0">
                        <p class="truncate font-extrabold text-white">{{ item.label }}</p>
                        <p class="truncate text-[11px] text-slate-400">{{ item.help }}</p>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogout"
            >
              Salir
            </button>
          </template>

          <NuxtLink
            to="/"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-300/40 hover:bg-orange-500/10 hover:text-white"
            aria-label="Ir al home"
            title="Ir al home"
          >
            <House class="h-5 w-5" />
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

        <!-- Mobile / tablet button -->
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 lg:hidden"
          aria-label="Abrir menú"
          @click="toggleMobileMenu"
        >
          <Menu class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile overlay -->
    <Transition name="mobile-fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[110] bg-[#020617]/78 backdrop-blur-sm lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile drawer -->
    <Transition name="mobile-drawer">
      <aside
        v-if="mobileOpen"
        class="fixed right-0 top-0 z-[120] h-[100dvh] w-[88vw] max-w-[390px] overflow-hidden border-l border-white/10 bg-[#050816] shadow-[-24px_0_80px_rgba(2,6,23,0.65)] lg:hidden"
      >
        <div class="flex h-full flex-col">
          <!-- Drawer top -->
          <div class="border-b border-white/10 bg-[#050816]/95 px-4 py-4 backdrop-blur-xl">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="text-[2rem] font-black leading-none tracking-tight text-orange-400">T5</span>
                <div class="leading-tight">
                  <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-orange-300/90">
                    Menú
                  </p>
                  <p class="text-[1rem] font-semibold text-white">Liga de Jueves</p>
                </div>
              </div>

              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                aria-label="Cerrar menú"
                @click="closeMobileMenu"
              >
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Drawer content -->
          <div class="flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <!-- Main nav -->
            <div class="space-y-3">
              <NuxtLink
                v-for="item in desktopNav"
                :key="`${item.to}-mobile`"
                :to="item.to"
                class="group flex items-center justify-between rounded-[22px] border px-4 py-4 transition"
                :class="
                  isActive(item.to)
                    ? 'border-orange-400/45 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(255,255,255,0.03))] shadow-[0_0_30px_rgba(249,115,22,0.10)]'
                    : 'border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] hover:border-white/20 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]'
                "
                @click="closeMobileMenu"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <span
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition"
                    :class="
                      isActive(item.to)
                        ? 'border-orange-300/40 bg-orange-400/10 text-orange-300'
                        : 'border-white/10 bg-white/[0.04] text-slate-100'
                    "
                  >
                    <component :is="item.icon" class="h-5 w-5" />
                  </span>

                  <div class="min-w-0">
                    <p class="truncate text-[1rem] font-extrabold" :class="isActive(item.to) ? 'text-white' : 'text-slate-100'">
                      {{ item.label }}
                    </p>
                    <p class="mt-0.5 text-xs text-slate-400">
                      {{ item.help }}
                    </p>
                  </div>
                </div>

                <ChevronRight class="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
              </NuxtLink>
            </div>

            <!-- Auth actions -->
            <div class="mt-6 space-y-3">
              <template v-if="kcReady && !isAuthenticated">
                <button
                  type="button"
                  class="flex w-full items-center justify-center rounded-2xl border border-orange-400/35 bg-gradient-to-r from-orange-500/20 to-orange-400/12 px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-100 shadow-[0_10px_24px_rgba(249,115,22,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="authActionLoading"
                  @click="handleLogin"
                >
                  Entrar
                </button>
              </template>

              <template v-else-if="kcReady && isAuthenticated">
                <template v-if="isAdmin">
                  <div class="rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
                    <p class="px-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-orange-300">
                      Panel Admin
                    </p>
                    <p class="px-1 pt-1 text-xs text-slate-400">Accesos rápidos</p>

                    <div class="mt-3 space-y-2">
                      <NuxtLink
                        v-for="item in adminLinks"
                        :key="`${item.to}-mobile-admin`"
                        :to="item.to"
                        class="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1222] px-3 py-3 transition hover:border-white/20 hover:bg-[#0d1629]"
                        @click="closeMobileMenu"
                      >
                        <div class="flex min-w-0 items-center gap-3">
                          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100">
                            <component :is="item.icon" class="h-5 w-5" />
                          </span>

                          <div class="min-w-0">
                            <p class="truncate text-sm font-extrabold text-white">
                              {{ item.label }}
                            </p>
                            <p class="truncate text-[11px] text-slate-400">
                              {{ item.help }}
                            </p>
                          </div>
                        </div>

                        <ChevronRight class="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
                      </NuxtLink>
                    </div>
                  </div>
                </template>

                <button
                  type="button"
                  class="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="authActionLoading"
                  @click="handleLogout"
                >
                  Salir
                </button>
              </template>
            </div>

            <!-- Footer shortcuts -->
            <div class="mt-6 border-t border-white/10 pt-4">
              <div class="grid grid-cols-1 gap-3">
                <NuxtLink
                  to="/"
                  class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.05]"
                  @click="closeMobileMenu"
                >
                  <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100">
                    <House class="h-5 w-5" />
                  </span>
                  <span>Ir al home principal</span>
                </NuxtLink>

                <div class="flex items-center gap-3 px-1 pt-1">
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    aria-label="Instagram"
                  >
                    <Instagram class="h-5 w-5" />
                  </a>

                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    aria-label="Facebook"
                  >
                    <Facebook class="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Facebook,
  House,
  Instagram,
  Menu,
  Shield,
  Ticket,
  Trash2,
  User,
  UserRound,
  Users,
  X,
} from "lucide-vue-next"
import { useRoute, useNuxtApp } from "#app"
import { useAuthz } from "~/composables/useAuthz"
import { useBackendUser } from "~/composables/useBackendUser"

type NavItem = {
  label: string
  to: string
  help: string
  icon: any
}

type AdminItem = {
  label: string
  help: string
  to: string
  icon: any
}

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

const publicNav: NavItem[] = [
  {
    label: "Inicio",
    to: "/jueves",
    help: "Portada y novedades",
    icon: House,
  },
  {
    label: "Partidos",
    to: "/jueves/partidos",
    help: "Calendario y resultados",
    icon: CalendarDays,
  },
  {
    label: "Equipos",
    to: "/jueves/equipos",
    help: "Planteles y standings",
    icon: Shield,
  },
  {
    label: "Estadísticas",
    to: "/jueves/estadisticas",
    help: "Líderes y números",
    icon: BarChart3,
  },
]

const privateNav: NavItem[] = [
  {
    label: "Registro",
    to: "/jueves/registro",
    help: "Inscripción y pago",
    icon: Ticket,
  },
  {
    label: "Mi equipo",
    to: "/jueves/mi-equipo",
    help: "Gestiona tu roster",
    icon: UserRound,
  },
]

const desktopNav = computed<NavItem[]>(() => {
  if (kcReady.value && isAuthenticated.value) {
    return [...publicNav, ...privateNav]
  }
  return publicNav
})

const adminLinks: AdminItem[] = [
  {
    label: "Inicio",
    help: "Editar home",
    to: "/jueves/admin",
    icon: House,
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
    mobileOpen.value = false
    adminMenuOpen.value = false
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

function toggleAdminMenu() {
  adminMenuOpen.value = !adminMenuOpen.value
}

function closeAdminMenu() {
  adminMenuOpen.value = false
}

function toggleMobileMenu() {
  adminMenuOpen.value = false
  mobileOpen.value = !mobileOpen.value
}

function closeMobileMenu() {
  mobileOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (!adminMenuOpen.value) return
  const wrap = adminMenuWrap.value
  const target = e.target as Node | null
  if (wrap && target && !wrap.contains(target)) {
    adminMenuOpen.value = false
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
  if (typeof window === "undefined") return
  document.addEventListener("click", onDocClick, { capture: true })
})

onBeforeUnmount(() => {
  if (typeof window === "undefined") return
  document.removeEventListener("click", onDocClick, { capture: true } as any)
  document.documentElement.style.overflow = ""
  document.body.style.overflow = ""
})
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 14px;
  padding: 10px 10px;
  color: rgb(226, 232, 240);
  background: transparent;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.menu-item--active {
  background: rgba(249, 115, 22, 0.12);
}

.menu-ic {
  height: 38px;
  width: 38px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: rgb(251, 191, 36);
}

.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
}

.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>