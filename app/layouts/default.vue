<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen bg-background text-foreground font-body" :class="{ 'pb-24 sm:pb-0': isAdmin }">
    <!-- HEADER GLOBAL -->
    <header class="glass-header relative z-[80] overflow-visible">
      <nav class="section-container relative overflow-visible flex items-center justify-between py-4">
        <!-- LOGO -->
        <NuxtLink to="/" class="flex items-center gap-3" @click="closeMobile">
          <span
            class="w-9 h-9 rounded-xl overflow-hidden bg-primary/15 ring-1 ring-primary/20 shadow-sm"
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

          <span class="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
            tochero<span class="text-primary">5</span>liga
          </span>
        </NuxtLink>

        <!-- NAV DESKTOP -->
        <div class="hidden sm:flex items-center gap-6 text-sm">
          <NuxtLink to="/partidos" class="text-muted-foreground hover:text-foreground transition">
            Partidos
          </NuxtLink>
          <NuxtLink to="/equipos" class="text-muted-foreground hover:text-foreground transition">
            Equipos
          </NuxtLink>
          <NuxtLink to="/estadisticas" class="text-muted-foreground hover:text-foreground transition">
            Estadísticas
          </NuxtLink>

          <NuxtLink
            v-if="showRegistro"
            to="/registro"
            class="text-muted-foreground hover:text-foreground transition"
          >
            Registro
          </NuxtLink>

          <NuxtLink
            v-if="showMiEquipo"
            to="/mi-equipo"
            class="text-muted-foreground hover:text-foreground transition"
          >
            Mi equipo
          </NuxtLink>

          <!-- ✅ Admin (dropdown) -->
          <div v-if="isAdmin" class="relative z-[90]" ref="adminWrap">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/70 bg-[#0A1022] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:border-fuchsia-400 hover:bg-[#0E1630] transition"
              :aria-expanded="adminOpen ? 'true' : 'false'"
              aria-haspopup="menu"
              @click="toggleAdmin"
            >
              <svg class="w-4 h-4 text-slate-100" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              <svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                class="absolute right-0 top-full mt-3 z-[120] w-72 overflow-hidden rounded-2xl border border-fuchsia-500/70 bg-[#07101F] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                role="menu"
               >
                <div class="border-b border-white/10 bg-[#0A1428] px-4 py-4">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-400">Panel Admin</p>
                  <p class="mt-1 text-sm font-semibold text-white">Accesos rápidos</p>
                </div>

                <div class="p-2 grid gap-1.5">
                  <NuxtLink
                    to="/admin/inicio"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                    :class="isActive('/admin/inicio') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-11 w-11 rounded-xl border border-fuchsia-500/50 bg-[#0D1930] grid place-items-center shrink-0">
                      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14.8 12.8 19 8.6l1.4 1.4-4.2 4.2-2.2.8.8-2.2Z"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">Inicio</p>
                      <p class="text-[11px] text-slate-400">Editar Home</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/partidos"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                    :class="isActive('/admin/partidos') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-11 w-11 rounded-xl border border-fuchsia-500/50 bg-[#0D1930] grid place-items-center shrink-0">
                      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 3h8v3H8V3z" stroke="currentColor" stroke-width="1.6" />
                        <path d="M6 6h12v15H6V6z" stroke="currentColor" stroke-width="1.6" />
                        <path
                          d="M9 10h6M9 14h6M9 18h6"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">Partidos</p>
                      <p class="text-[11px] text-slate-400">Administración</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/usuarios"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                    :class="isActive('/admin/usuarios') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-11 w-11 rounded-xl border border-fuchsia-500/50 bg-[#0D1930] grid place-items-center shrink-0">
                      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6" />
                        <path
                          d="M22 21v-2a4 4 0 0 0-3-3.87"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                        <path
                          d="M16 3.13a4 4 0 0 1 0 7.75"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">Usuarios</p>
                      <p class="text-[11px] text-slate-400">Roles / acceso</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/jugadores"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                    :class="isActive('/admin/jugadores') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-11 w-11 rounded-xl border border-fuchsia-500/50 bg-[#0D1930] grid place-items-center shrink-0">
                      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6" />
                        <path
                          d="M3 21a9 9 0 0 1 18 0"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">Jugadores</p>
                      <p class="text-[11px] text-slate-400">Gestión</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/equipos"
                    class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-100 transition hover:bg-white/8"
                    :class="isActive('/admin/equipos') ? 'bg-white/10 ring-1 ring-white/10' : ''"
                    @click="adminOpen = false"
                  >
                    <span class="h-11 w-11 rounded-xl border border-fuchsia-500/50 bg-[#0D1930] grid place-items-center shrink-0">
                      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">Equipos</p>
                      <p class="text-[11px] text-slate-400">Borrar / limpiar</p>
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
            class="opacity-80 hover:opacity-100 text-muted-foreground hover:text-foreground transition"
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
            class="rounded-2xl px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 text-sm font-semibold transition shadow-sm"
            @click="onAuthClick"
          >
            {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
          </button>

          <span v-else class="text-xs text-muted-foreground">Inicializando…</span>
        </div>

        <!-- NAV MOBILE -->
        <div class="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            class="rounded-2xl px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:brightness-110 transition active:scale-[0.99]"
            :aria-expanded="mobileOpen ? 'true' : 'false'"
            aria-controls="mobile-menu"
            @click="toggleMobile"
          >
            <span class="inline-flex items-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Menú
            </span>
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
          <div class="fixed inset-0 z-40 bg-black/60" @click="closeMobile" />

          <!-- dropdown -->
          <div id="mobile-menu" class="absolute top-full inset-x-0 z-50">
            <div class="mx-4 mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#07101F] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
              <div class="p-3 grid gap-1 text-sm">
                <NuxtLink to="/partidos" class="px-3 py-2 rounded-2xl text-slate-100 hover:bg-white/8" @click="closeMobile">
                  Partidos
                </NuxtLink>
                <NuxtLink to="/equipos" class="px-3 py-2 rounded-2xl text-slate-100 hover:bg-white/8" @click="closeMobile">
                  Equipos
                </NuxtLink>
                <NuxtLink to="/estadisticas" class="px-3 py-2 rounded-2xl text-slate-100 hover:bg-white/8" @click="closeMobile">
                  Estadísticas
                </NuxtLink>

                <NuxtLink
                  v-if="showRegistro"
                  to="/registro"
                  class="px-3 py-2 rounded-2xl text-slate-100 hover:bg-white/8"
                  @click="closeMobile"
                >
                  Registro
                </NuxtLink>

                <NuxtLink
                  v-if="showMiEquipo"
                  to="/mi-equipo"
                  class="px-3 py-2 rounded-2xl text-slate-100 hover:bg-white/8"
                  @click="closeMobile"
                >
                  Mi equipo
                </NuxtLink>
              </div>

              <div class="px-4 pb-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <a
                  href="https://www.instagram.com/tochero5liga"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
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
                  class="rounded-2xl px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 text-sm font-semibold transition shadow-sm"
                  @click="onAuthClick(); closeMobile()"
                >
                  {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
                </button>

                <span v-else class="text-xs text-slate-400">Inicializando…</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- CONTENIDO DE LAS PÁGINAS -->
    <slot />

    <!-- ✅ Dock admin móvil (solo admins) -->
    <div v-if="isAdmin" class="sm:hidden fixed bottom-0 inset-x-0 z-30" aria-label="Admin dock">
      <div class="mx-auto max-w-6xl px-4 pb-3">
        <div class="rounded-2xl border border-white/10 bg-[#07101F] px-2 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div class="grid grid-cols-5 gap-2">
            <NuxtLink
              to="/admin/inicio"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/inicio') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 10.5 12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.8 12.8 19 8.6l1.4 1.4-4.2 4.2-2.2.8.8-2.2Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              Inicio
            </NuxtLink>

            <NuxtLink
              to="/admin/partidos"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/partidos') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
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
              :class="isActive('/admin/usuarios') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M22 21v-2a4 4 0 0 0-3-3.87"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              Usuarios
            </NuxtLink>

            <NuxtLink
              to="/admin/jugadores"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/jugadores') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" stroke-width="1.6"/>
                <path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              Jugadores
            </NuxtLink>

            <NuxtLink
              to="/admin/equipos"
              class="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition"
              :class="isActive('/admin/equipos') ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'"
            >
              <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Equipos
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