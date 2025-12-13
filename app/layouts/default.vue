<template>
  <div class="bg-[#F3F4FF] text-slate-900 min-h-screen">
    <!-- HEADER GLOBAL -->
    <header
      class="navbar fixed top-0 inset-x-0 z-40 bg-gradient-to-r from-[#111827] to-[#1F2937] text-white shadow-lg"
    >
      <nav class="max-w-6xl mx-auto container-pad px-6 py-4 flex items-center justify-between">
        <!-- LOGO -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <span
            class="w-9 h-9 rounded-xl grid place-items-center bg-[rgba(59,130,246,.25)] text-[13px] font-extrabold text-blue-300"
          >
            T5
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

          <!-- 🔐 Registro solo cuando hay sesión -->
          <NuxtLink
            v-if="showRegistro"
            to="/registro"
            class="hover:text-white transition"
          >
            Registro
          </NuxtLink>

          <!-- 🔐 Mi equipo solo cuando hay sesión -->
          <NuxtLink
            v-if="showMiEquipo"
            to="/mi-equipo"
            class="hover:text-white transition"
          >
            Mi equipo
          </NuxtLink>

          <!-- Instagram -->
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

          <!-- ✅ ÚNICO botón Entrar / Cerrar sesión -->
          <button
            v-if="kcReady"
            class="rounded-xl px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-400 text-sm font-semibold"
            @click="onAuthClick"
          >
            {{ isAuthenticated ? 'Cerrar sesión' : 'Entrar' }}
          </button>

          <!-- Mientras Keycloak inicializa (1–2 seg) -->
          <span v-else class="text-xs text-slate-300">
            Inicializando…
          </span>
        </div>

        <!-- NAV MOBILE (por ahora sin lógica de auth) -->
        <div class="flex items-center gap-2 sm:hidden">
          <button class="inline-flex items-center rounded-lg bg-blue-500 text-white px-3 py-1.5 text-sm">
            Menú
          </button>
        </div>
      </nav>
    </header>

    <!-- CONTENIDO DE LAS PÁGINAS -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNuxtApp, useState } from '#imports'

// Importamos desde app/composables (una sola carpeta)
import { useAuthz } from '../composables/useAuthz'
import { useBackendUser } from '../composables/useBackendUser'

// 1) kcReady viene del mismo useState que se usa en el plugin de Keycloak
const kcReady = useState<boolean>('kcReady', () => false)

// 2) Info de autenticación centralizada
const { isAuthenticated } = useAuthz()

// 3) Mostrar Registro / Mi equipo solo si hay sesión
const showRegistro = computed(() => kcReady.value && isAuthenticated.value)
const showMiEquipo = computed(() => kcReady.value && isAuthenticated.value)

// 4) Acción del botón Entrar / Cerrar sesión
const onAuthClick = () => {
  const nuxtApp = useNuxtApp()
  const kc = (nuxtApp as any).$kc

  if (typeof window === 'undefined' || !kc) return

  if (isAuthenticated.value) {
    kc.logout({ redirectUri: window.location.origin })
  } else {
    kc.login({ redirectUri: window.location.href })
  }
}

// 5) Sincronizar usuario en backend (llama /api/me una sola vez)
const {
  backendUserSynced: meSynced,
  syncBackendUser: syncMe,
} = useBackendUser()

watch(
  () => ({
    ready: kcReady.value,
    auth: isAuthenticated.value,
  }),
  async ({ ready, auth }) => {
    if (ready && auth && !meSynced.value) {
      await syncMe()
    }
  },
  { immediate: true }
)
</script>
