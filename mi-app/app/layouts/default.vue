<template>
  <div class="bg-[#020617] text-slate-50 min-h-screen">
    <!-- HEADER GLOBAL -->
    <header
      class="fixed top-0 inset-x-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur"
    >
<<<<<<< HEAD
      <nav class="max-w-6xl mx-auto container-pad px-6 py-4 flex items-center justify-between">
       <!-- LOGO -->
<NuxtLink to="/" class="flex items-center gap-3" @click="closeMobile">
  <!-- Imagen (reemplaza el T5) -->
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

          <a
            href="https://www.instagram.com/tochero5liga"
            target="_blank"
            rel="noopener"
            class="opacity-80 hover:opacity-100 text-slate-100"
            aria-label="Instagram"
=======
      <nav
        class="max-w-6xl mx-auto container-pad px-6 py-3 flex items-center justify-between gap-4"
      >
        <!-- Logo / brand -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <span
            class="w-9 h-9 rounded-xl grid place-items-center bg-[rgba(37,99,235,.18)] text-[13px] font-extrabold text-blue-400"
          >
            T5
          </span>
          <div class="flex flex-col">
            <span class="text-xs font-semibold text-slate-50 leading-tight">
              tochero5liga
            </span>
            <span class="text-[10px] text-slate-400 leading-tight">
              Resultados · Equipos · Calendario
            </span>
          </div>
        </NuxtLink>

        <!-- Navegación -->
        <div class="flex items-center gap-4 text-xs md:text-sm">
          <NuxtLink
            to="/equipos"
            class="text-slate-300 hover:text-white transition"
          >
            Equipos
          </NuxtLink>

          <NuxtLink
            to="/estadisticas"
            class="text-slate-300 hover:text-white transition"
          >
            Estadísticas
          </NuxtLink>

          <NuxtLink
            to="/registro"
            class="text-slate-300 hover:text-white transition"
          >
            Registro
          </NuxtLink>

          <NuxtLink
            to="/mi-equipo"
            class="text-slate-300 hover:text-white transition"
          >
            Mi equipo
          </NuxtLink>

          <!-- NUEVA PESTAÑA SOLO PARA ADMIN -->
          <NuxtLink
            v-if="isAdmin"
            to="/admin/partidos"
            class="inline-flex items-center gap-1 rounded-full border border-blue-500/70 px-3 py-1 text-[11px] font-semibold text-blue-100 bg-blue-600/20 hover:bg-blue-600/35 transition"
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
          >
            Partidos (Admin)
          </NuxtLink>

<<<<<<< HEAD
=======
          <!-- Botón login / logout -->
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
          <button
            type="button"
            class="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            @click="handleAuth"
          >
<<<<<<< HEAD
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
=======
            {{ isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión' }}
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
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
    <main class="pt-20 md:pt-24">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import { computed, watch, ref, onBeforeUnmount } from 'vue'
import { useNuxtApp, useState, useRoute } from '#imports'
import { useAuthz } from '~/composables/useAuthz'
import { useBackendUser } from '~/composables/useBackendUser'

// ----- Mobile menu state -----
const mobileOpen = ref(false)
const toggleMobile = () => (mobileOpen.value = !mobileOpen.value)
const closeMobile = () => (mobileOpen.value = false)

// Cierra menú al navegar
const route = useRoute()
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false)
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
const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz()

const showRegistro = computed(() => kcReady.value && isAuthenticated.value)
const showMiEquipo = computed(() => kcReady.value && isAuthenticated.value)

const onAuthClick = () => {
  const nuxtApp = useNuxtApp()
  const kc = (nuxtApp as any).$kc
  if (typeof window === 'undefined' || !kc) return
=======
import { computed } from 'vue'
import { useAuthz } from '@/composables/useAuthz'

// Lo tipamos como any para que TypeScript no se queje aunque la definición
// de useAuthz no esté perfecta.
const authz: any = useAuthz()

const isAuthenticated = computed<boolean>(() => !!authz?.isAuthenticated?.value)
const isAdmin = computed<boolean>(() => !!authz?.isAdmin?.value)
>>>>>>> 529f021 (Cambios admin partidos + ajustes)

const handleAuth = () => {
  if (isAuthenticated.value) {
    authz?.logout && authz.logout()
  } else {
    authz?.login && authz.login()
  }
}
<<<<<<< HEAD

// ----- Sync /api/me -----
const { backendUserSynced: meSynced, syncBackendUser: syncMe } = useBackendUser()

watch(
  () => ({ ready: kcReady.value, auth: isAuthenticated.value }),
  async ({ ready, auth }) => {
    if (ready && auth && !meSynced.value) await syncMe()
  },
  { immediate: true }
)
=======
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
</script>
