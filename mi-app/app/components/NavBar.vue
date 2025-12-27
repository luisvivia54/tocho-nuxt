<template>
  <header class="navbar fixed top-0 inset-x-0 z-40">
    <nav class="max-w-6xl mx-auto container-pad px-6 py-4 flex items-center justify-between">
      <!-- Logo (pon el tuyo) -->
      <NuxtLink to="/" class="font-display font-extrabold text-slate-100 tracking-wide">
        TOCHERO5
      </NuxtLink>

      <div class="flex items-center gap-6 text-sm font-medium">
        <NuxtLink to="/equipos" class="nav-link">Equipos</NuxtLink>
        <NuxtLink to="/estadisticas" class="nav-link">Estadísticas</NuxtLink>
        <NuxtLink to="/registro" class="nav-link">Registro</NuxtLink>
        <NuxtLink to="/mi-equipo" class="nav-link">Mi equipo</NuxtLink>

        <!-- SOLO ADMIN -->
        <NuxtLink
          v-if="isAdmin"
          to="/admin/partidos"
          class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold
                 text-slate-100 hover:text-white hover:bg-slate-800/80 transition"
        >
          Partidos (Admin)
        </NuxtLink>
      </div>

      <!-- Auth buttons -->
      <div class="flex items-center gap-2">
        <template v-if="!isAuthenticated">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold
                   bg-white text-slate-900 hover:bg-slate-100 transition"
            @click="onLogin"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold
                   bg-blue-600 text-white hover:bg-blue-500 transition"
            @click="onRegister"
          >
            Registrarse
          </button>
        </template>

        <template v-else>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold
                   border border-slate-700 text-slate-100 hover:bg-slate-800/70 transition"
            @click="onLogout"
          >
            Cerrar sesión
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthz } from '@/composables/useAuthz'

const { isAuthenticated, isAdmin, login, register, logout } = useAuthz()

const onLogin = () => login(window.location.href)
const onRegister = () => register(window.location.href)
const onLogout = () => logout()
</script>
