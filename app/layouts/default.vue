<!-- app/layouts/default.vue -->
<template>
  <div class="bg-[#F3F4FF] text-slate-900 min-h-screen" :class="{ 'pb-24 sm:pb-0': isAdmin }">
    <!-- HEADER GLOBAL -->
    <header
      class="navbar fixed top-0 inset-x-0 z-40 bg-gradient-to-r from-[#111827] to-[#1F2937] text-white shadow-lg"
    >
      <nav class="max-w-6xl mx-auto container-pad px-6 py-4 flex items-center justify-between">
        <!-- LOGO -->
        <NuxtLink to="/" class="flex items-center gap-3" @click="closeMobile">
          <span
            class="w-9 h-9 rounded-xl overflow-hidden bg-[rgba(59,130,246,.25)] ring-1 ring-white/10 shadow-sm"
            aria-hidden="true"
          >
            <img
              src="/img/sponsors/Tochero5.JPG"
              alt="Tochero5"
              class="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </span>

          <span class="font-display text-xl sm:text-2xl font-extrabold tracking-wide text-white">
            tochero<span class="text-blue-400">5</span>liga
          </span>
        </NuxtLink>

        <!-- NAV DESKTOP -->
        <div class="hidden sm:flex items-center gap-5 text-sm text-slate-100">
          <NuxtLink to="/partidos" class="hover:text-white transition">Partidos</NuxtLink>
          <NuxtLink to="/equipos" class="hover:text-white transition">Equipos</NuxtLink>
          <NuxtLink to="/estadisticas" class="hover:text-white transition">Estadísticas</NuxtLink>

          <NuxtLink v-if="showRegistro" to="/registro" class="hover:text-white transition">
            Registro
          </NuxtLink>

          <NuxtLink v-if="showMiEquipo" to="/mi-equipo" class="hover:text-white transition">
            Mi equipo
          </NuxtLink>

          <!-- ✅ NUEVO: Admin (dropdown) -->
          <div v-if="isAdmin" class="relative" ref="adminWrap">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold
                     bg-white/10 border border-white/15 hover:bg-white/15 transition"
              :aria-expanded="adminOpen ? 'true' : 'false'"
              aria-haspopup="menu"
              @click="toggleAdmin"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.5 12.5l1.7 1.7 3.8-4.2"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Admin
              <svg class="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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
                v-if="adminOpen"
                class="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden border border-white/10
                       bg-[#0B1220]/95 backdrop-blur shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                role="menu"
              >
                <div class="px-4 py-3 border-b border-white/10">
                  <p class="text-[11px] uppercase tracking-[0.22em] text-slate-300/90">Panel Admin</p>
                  <p class="text-xs text-slate-300/80">Accesos rápidos</p>
                </div>

                <div class="p-2 grid gap-1">
                  <NuxtLink
                    to="/admin/partidos"
                    class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
                    :class="isActive('/admin/partidos') ? 'bg-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-9 w-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 3h8v3H8V3z" stroke="currentColor" stroke-width="1.6" />
                        <path d="M6 6h12v15H6V6z" stroke="currentColor" stroke-width="1.6" />
                        <path d="M9 10h6M9 14h6M9 18h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold truncate">Partidos</p>
                      <p class="text-[11px] text-slate-300/80">Administración</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/usuarios"
                    class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
                    :class="isActive('/admin/usuarios') ? 'bg-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-9 w-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold truncate">Usuarios</p>
                      <p class="text-[11px] text-slate-300/80">Roles / acceso</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/jugadores"
                    class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
                    :class="isActive('/admin/jugadores') ? 'bg-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-9 w-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6"/>
                        <path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold truncate">Jugadores</p>
                      <p class="text-[11px] text-slate-300/80">Gestión</p>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <a
            href="https://www.instagram.com/tochero5liga"
            target="_blank"
            rel="noopener"
            class="opacity-80 hover:opacity-100 text-slate-100"
            aria-label="Instagram"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
              <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
            </svg>
          </a>

          <button
            v-if="kcReady"
            class="rounded-xl px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-400 text-sm font-semibold"
            @click="onAuthClick"
          >
            {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
          </button>

          <span v-else class="text-xs text-slate-300">Inicializando…</span>
        </div>

        <!-- NAV MOBILE -->
        <div class="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-500 text-white px-3 py-2 text-sm font-semibold shadow-sm active:scale-[0.99]"
            :aria-expanded="mobileOpen ? 'true' : 'false'"
            aria-controls="mobile-menu"
            @click="toggleMobile"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Menú
          </button>
        </div>
      </nav>

      <!-- PANEL MOBILE -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="mobileOpen" class="sm:hidden">
          <!-- backdrop -->
          <div class="fixed inset-0 z-40 bg-black/40" @click="closeMobile" />

          <!-- dropdown -->
          <div id="mobile-menu" class="absolute top-full inset-x-0 z-50">
            <div
              class="mx-4 mt-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1220] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            >
              <div class="p-3 grid gap-1 text-sm text-slate-100">
                <NuxtLink to="/partidos" class="px-3 py-2 rounded-xl hover:bg-white/10" @click="closeMobile">
                  Partidos
                </NuxtLink>
                <NuxtLink to="/equipos" class="px-3 py-2 rounded-xl hover:bg-white/10" @click="closeMobile">
                  Equipos
                </NuxtLink>
                <NuxtLink
                  to="/estadisticas"
                  class="px-3 py-2 rounded-xl hover:bg-white/10"
                  @click="closeMobile"
                >
                  Estadísticas
                </NuxtLink>

                <NuxtLink
                  v-if="showRegistro"
                  to="/registro"
                  class="px-3 py-2 rounded-xl hover:bg-white/10"
                  @click="closeMobile"
                >
                  Registro
                </NuxtLink>

                <NuxtLink
                  v-if="showMiEquipo"
                  to="/mi-equipo"
                  class="px-3 py-2 rounded-xl hover:bg-white/10"
                  @click="closeMobile"
                >
                  Mi equipo
                </NuxtLink>

                <!-- ✅ Ya NO metemos las rutas admin aquí (ahora van en el dock inferior / dropdown desktop) -->
              </div>

              <div class="px-4 pb-4 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <a
                  href="https://www.instagram.com/tochero5liga"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 text-sm text-slate-100/90 hover:text-white"
                  @click="closeMobile"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6" />
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6" />
                    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                  </svg>
                  Instagram
                </a>

                <button
                  v-if="kcReady"
                  class="rounded-xl px-3 py-2 bg-blue-500 text-white hover:bg-blue-400 text-sm font-semibold"
                  @click="onAuthClick(); closeMobile()"
                >
                  {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
                </button>

                <span v-else class="text-xs text-slate-300">Inicializando…</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- CONTENIDO DE LAS PÁGINAS -->
    <slot />

    <!-- ✅ NUEVO: Dock admin móvil (solo admins) -->
    <div
      v-if="isAdmin"
      class="sm:hidden fixed bottom-0 inset-x-0 z-30"
      aria-label="Admin dock"
    >
      <div class="mx-auto max-w-6xl px-4 pb-3">
        <div
          class="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B1220]/95 to-[#0F1A33]/95
                 backdrop-blur shadow-[0_18px_50px_rgba(0,0,0,0.35)] px-2 py-2"
        >
          <div class="grid grid-cols-3 gap-2">
            <NuxtLink
              to="/admin/partidos"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/partidos') ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 3h8v3H8V3z" stroke="currentColor" stroke-width="1.6" />
                <path d="M6 6h12v15H6V6z" stroke="currentColor" stroke-width="1.6" />
                <path d="M9 10h6M9 14h6M9 18h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              Partidos
            </NuxtLink>

            <NuxtLink
              to="/admin/usuarios"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/usuarios') ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              Usuarios
            </NuxtLink>

            <NuxtLink
              to="/admin/jugadores"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/jugadores') ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6"/>
                <path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              Jugadores
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onBeforeUnmount, onMounted } from 'vue'
import { useNuxtApp, useState, useRoute } from '#imports'
import { useAuthz } from '~/composables/useAuthz'
import { useBackendUser } from '~/composables/useBackendUser'

// ----- Mobile menu state -----
const mobileOpen = ref(false)
const toggleMobile = () => (mobileOpen.value = !mobileOpen.value)
const closeMobile = () => (mobileOpen.value = false)

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    adminOpen.value = false
  }
)

// Evita scroll del fondo cuando el menú está abierto
watch(mobileOpen, (open) => {
  if (typeof window === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  document.documentElement.style.overflow = ''
})

// ----- Keycloak / Auth -----
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz() as any

const showRegistro = computed(() => kcReady.value && !!isAuthenticated.value)
const showMiEquipo = computed(() => kcReady.value && !!isAuthenticated.value)

// ✅ Detectar rol admin desde el token
const isAdmin = computed<boolean>(() => {
  if (!kcReady.value || !isAuthenticated.value) return false
  const kc = (nuxtApp as any).$kc
  const tp = kc?.tokenParsed as any
  if (!tp) return false

  const realmRoles: string[] = tp?.realm_access?.roles ?? []
  const azp = tp?.azp
  const clientKey = azp || 'nuxt-app'
  const clientRoles: string[] =
    tp?.resource_access?.[clientKey]?.roles ?? tp?.resource_access?.['nuxt-app']?.roles ?? []

  const roles = [...realmRoles, ...clientRoles].map((r) => String(r).toLowerCase())
  return roles.includes('admin')
})

const onAuthClick = () => {
  const kc = (nuxtApp as any).$kc
  if (typeof window === 'undefined' || !kc) return

  if (isAuthenticated.value) {
    kc.logout({ redirectUri: window.location.origin })
  } else {
    kc.login({ redirectUri: window.location.href })
  }
}

// ----- Sync /api/me -----
const { backendUserSynced: meSynced, syncBackendUser: syncMe } = useBackendUser()
watch(
  () => ({ ready: kcReady.value, auth: isAuthenticated.value }),
  async ({ ready, auth }) => {
    if (ready && auth && !meSynced.value) await syncMe()
  },
  { immediate: true }
)

/* =========================
   Admin dropdown (desktop)
========================= */
const adminOpen = ref(false)
const adminWrap = ref<HTMLElement | null>(null)

const toggleAdmin = () => (adminOpen.value = !adminOpen.value)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function onDocClick(e: MouseEvent) {
  if (!adminOpen.value) return
  const el = adminWrap.value
  const target = e.target as Node | null
  if (el && target && !el.contains(target)) adminOpen.value = false
}

onMounted(() => {
  if (typeof window === 'undefined') return
  document.addEventListener('click', onDocClick, { capture: true })
})
onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  document.removeEventListener('click', onDocClick, { capture: true } as any)
})
</script>
