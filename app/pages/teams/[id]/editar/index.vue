<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import { useTeamEditor } from '@/composables/useTeamEditor'

const route = useRoute()
const teamId = computed(() => Number(route.params.id) || 0)

const editor = useTeamEditor(teamId)
const { isAuthenticated, loadError, loading, onLoginClick, teamDisplayName } = editor

const detailRoute = computed(() => `/teams/${teamId.value}`)
const options = computed(() => [
  {
    title: 'Editar equipo',
    description: 'Nombre, colores, logo, galería y la salida del equipo.',
    to: `/teams/${teamId.value}/editar/equipo`,
    accent: 'from-sky-500/20 via-cyan-400/10 to-transparent',
    badge: 'Identidad',
  },
  {
    title: 'Editar roster',
    description: 'Altas, cambios y bajas de jugadoras o jugadores en una vista enfocada.',
    to: `/teams/${teamId.value}/editar/roster`,
    accent: 'from-amber-400/20 via-orange-400/10 to-transparent',
    badge: 'Integrantes',
  },
])

async function hydrate() {
  await editor.loadForHub()
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await hydrate()
  }
})

watch(
  () => isAuthenticated.value,
  async (value) => {
    if (value) {
      await hydrate()
    }
  }
)
</script>

<template>
  <main class="min-h-screen bg-[#020617] pt-24 text-slate-50 md:pt-28 lg:pt-32">
    <div class="mx-auto max-w-5xl container-pad px-6 pb-16">
      <header class="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Edición simplificada
          </p>
          <h1 class="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">
            {{ teamDisplayName }}
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-400">
            Elige una sola tarea por pantalla para editar con menos ruido y mejor enfoque.
          </p>
        </div>

        <NuxtLink
          :to="detailRoute"
          class="inline-flex items-center rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700"
        >
          ← Volver al detalle
        </NuxtLink>
      </header>

      <div
        v-if="!isAuthenticated"
        class="mt-8 rounded-[28px] border border-slate-700 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.45)]"
      >
        <p class="text-lg font-semibold text-white">Inicia sesión para editar tu equipo</p>
        <p class="mt-2 max-w-xl text-sm text-slate-400">
          Necesitas entrar con tu cuenta para abrir las pantallas de edición.
        </p>

        <button
          type="button"
          class="mt-5 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          @click="onLoginClick"
        >
          Entrar con mi cuenta
        </button>
      </div>

      <div
        v-else-if="loading"
        class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300"
      >
        Cargando información del equipo…
      </div>

      <div
        v-else-if="loadError"
        class="mt-8 rounded-2xl border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-100"
      >
        {{ loadError }}
      </div>

      <section v-else class="mt-8 space-y-5">
        <div class="rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-5 shadow-[0_24px_70px_rgba(15,23,42,0.45)]">
          <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Selecciona una edición</p>
          <p class="mt-3 max-w-2xl text-sm text-slate-300">
            Para mantenerlo claro, la baja del equipo vive dentro de <span class="font-semibold text-white">Editar equipo</span> y los jugadores viven dentro de <span class="font-semibold text-white">Editar roster</span>.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <NuxtLink
            v-for="option in options"
            :key="option.to"
            :to="option.to"
            class="group overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/95 shadow-[0_24px_70px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-white/20"
          >
            <div class="bg-gradient-to-br px-6 py-5" :class="option.accent">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                {{ option.badge }}
              </p>
              <h2 class="mt-3 text-2xl font-extrabold text-white">
                {{ option.title }}
              </h2>
              <p class="mt-3 max-w-sm text-sm text-slate-300">
                {{ option.description }}
              </p>
            </div>

            <div class="flex items-center justify-between px-6 py-5">
              <span class="text-sm font-semibold text-white">Abrir pantalla</span>
              <span class="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-white">→</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </main>
</template>
