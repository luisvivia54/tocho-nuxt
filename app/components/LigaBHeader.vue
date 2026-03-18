<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#050816]/88 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-6">
      <div class="flex h-20 items-center justify-between gap-6">
        <!-- Left -->
        <NuxtLink to="/jueves" class="flex items-center gap-3">
          <span class="text-[2rem] font-black tracking-tight text-orange-400 leading-none">T5</span>
          <span class="text-[1.1rem] font-medium text-slate-300">Liga de Jueves</span>
        </NuxtLink>

        <!-- Center -->
        <nav class="hidden md:flex items-center gap-10">
          <NuxtLink
            v-for="item in visibleNav"
            :key="item.to"
            :to="item.to"
            class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
            :class="isActive(item.to) ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ item.label }}
            <span
              v-if="isActive(item.to)"
              class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
            />
          </NuxtLink>
        </nav>

        <!-- Right -->
        <div class="hidden md:flex items-center gap-4">
          <template v-if="kcReady && isAuthenticated && isAdmin">
            <span
              class="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-200"
            >
              Admin
            </span>
          </template>

          <template v-if="kcReady && !isAuthenticated">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-200 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleRegister"
            >
              Registro Admin
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogin"
            >
              Entrar
            </button>
          </template>

          <template v-else-if="kcReady && isAuthenticated && isAdmin">
            <NuxtLink
              to="/jueves/admin"
              class="inline-flex items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-100 transition hover:border-orange-300/50 hover:bg-orange-400/15"
            >
              Panel Admin
            </NuxtLink>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogout"
            >
              Salir
            </button>
          </template>

          <NuxtLink
            to="/"
            class="text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-slate-400 hover:text-slate-200"
          >
            ← Volver
          </NuxtLink>

          <a href="#" class="text-slate-400 hover:text-slate-200" aria-label="Instagram">IG</a>
          <a href="#" class="text-slate-400 hover:text-slate-200" aria-label="Facebook">FB</a>
        </div>

        <!-- Mobile -->
        <button
          type="button"
          class="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
          @click="open = !open"
        >
          Menú
        </button>
      </div>

      <div v-if="open" class="md:hidden pb-4">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="item in visibleNav"
            :key="item.to + '-m'"
            :to="item.to"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
            @click="open = false"
          >
            {{ item.label }}
          </NuxtLink>

          <template v-if="kcReady && !isAuthenticated">
            <button
              type="button"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleRegister"
            >
              Registro Admin
            </button>

            <button
              type="button"
              class="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-left text-sm font-semibold text-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogin"
            >
              Entrar
            </button>
          </template>

          <template v-else-if="kcReady && isAuthenticated && isAdmin">
            <div
              class="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200"
            >
              Admin autenticado
            </div>

            <NuxtLink
              to="/jueves/admin"
              class="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm font-semibold text-orange-100"
              @click="open = false"
            >
              Panel Admin
            </NuxtLink>

            <button
              type="button"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="authActionLoading"
              @click="handleLogout"
            >
              Salir
            </button>
          </template>

          <NuxtLink
            to="/"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
            @click="open = false"
          >
            ← Volver
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useNuxtApp } from "#app"
import { useAuthz } from "~/composables/useAuthz"
import { useBackendUser } from "~/composables/useBackendUser"

type NavItem = {
  label: string
  to: string
}

const route = useRoute()
const nuxtApp = useNuxtApp()
const open = ref(false)
const authActionLoading = ref(false)

const { isAuthenticated, isAdmin } = useAuthz()
const { syncBackendUser } = useBackendUser()

const { $kc, $kcReady } = nuxtApp as any

const kcReady = computed<boolean>(() => Boolean($kcReady?.value))

const baseNav: NavItem[] = [
  { label: "Inicio", to: "/jueves" },
  { label: "Partidos", to: "/jueves/partidos" },
  { label: "Equipos", to: "/jueves/equipos" },
  { label: "Estadísticas", to: "/jueves/estadisticas" },
]

const adminNav: NavItem[] = [
  { label: "Admin", to: "/jueves/admin" },
  { label: "Equipos Admin", to: "/jueves/admin/equipos" },
  { label: "Partidos Admin", to: "/jueves/admin/partidos" },
]

const visibleNav = computed<NavItem[]>(() => {
  return isAdmin.value ? [...baseNav, ...adminNav] : baseNav
})

watch(
  () => isAuthenticated.value,
  async (loggedIn) => {
    if (loggedIn) {
      await syncBackendUser()
    }
  },
  { immediate: true }
)

function isActive(path: string) {
  if (path === "/jueves") return route.path === "/jueves"
  return route.path === path || route.path.startsWith(path + "/")
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

async function handleRegister() {
  try {
    authActionLoading.value = true
    await $kc?.register?.({
      redirectUri: `${window.location.origin}/jueves`,
    })
  } catch (error) {
    console.error("Error al abrir registro:", error)
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
</script>