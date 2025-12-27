<template>
  <div class="bg-[#020617] text-slate-50 min-h-screen">
    <!-- HEADER GLOBAL -->
    <header
      class="fixed top-0 inset-x-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur"
    >
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
          >
            Partidos (Admin)
          </NuxtLink>

          <!-- Botón login / logout -->
          <button
            type="button"
            class="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            @click="handleAuth"
          >
            {{ isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión' }}
          </button>
        </div>
      </nav>
    </header>

    <!-- CONTENIDO DE LAS PÁGINAS -->
    <main class="pt-20 md:pt-24">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthz } from '@/composables/useAuthz'

// Lo tipamos como any para que TypeScript no se queje aunque la definición
// de useAuthz no esté perfecta.
const authz: any = useAuthz()

const isAuthenticated = computed<boolean>(() => !!authz?.isAuthenticated?.value)
const isAdmin = computed<boolean>(() => !!authz?.isAdmin?.value)

const handleAuth = () => {
  if (isAuthenticated.value) {
    authz?.logout && authz.logout()
  } else {
    authz?.login && authz.login()
  }
}
</script>
