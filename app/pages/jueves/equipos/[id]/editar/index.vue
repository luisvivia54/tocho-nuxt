<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import JuevesHeader from '~/components/jueves/JuevesHeader.vue'
import { useJuevesTeamEditor } from '~/composables/useJuevesTeamEditor'

const route = useRoute()
const teamId = computed(() => Number(route.params.id) || 0)
const editor = useJuevesTeamEditor(teamId)
const { isAuthenticated, loadError, loading, teamDisplayName } = editor

const detailRoute = computed(() => `/jueves/equipos/${teamId.value}`)
const options = computed(() => [
  {
    title: 'Editar equipo',
    description: 'Nombre, colores, logo, categoría y la baja del equipo.',
    to: `/jueves/equipos/${teamId.value}/editar/equipo`,
    accent: 'from-orange-500/20 via-amber-400/10 to-transparent',
    badge: 'Identidad',
  },
  {
    title: 'Editar roster',
    description: 'Altas, cambios y bajas de jugadores en una vista enfocada.',
    to: `/jueves/equipos/${teamId.value}/editar/roster`,
    accent: 'from-white/10 via-slate-200/5 to-transparent',
    badge: 'Integrantes',
  },
])

async function hydrate() {
  await editor.loadForEdit()
}

onMounted(async () => {
  if (teamId.value) {
    await hydrate()
  }
})

watch(
  () => teamId.value,
  async (value) => {
    if (value) await hydrate()
  }
)
</script>

<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <header class="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Edición simplificada</p>
            <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">{{ teamDisplayName }}</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Elige una sola tarea por pantalla para editar con menos ruido y más claridad.
            </p>
          </div>

          <NuxtLink
            :to="detailRoute"
            class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            ← Volver al detalle
          </NuxtLink>
        </header>

        <div
          v-if="loading"
          class="mt-8 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400"
        >
          Cargando información del equipo…
        </div>

        <div
          v-else-if="loadError"
          class="mt-8 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100"
        >
          {{ loadError }}
        </div>

        <section v-else class="mt-8 space-y-5">
          <div
            v-if="!isAuthenticated"
            class="rounded-3xl border border-amber-400/20 bg-amber-500/10 px-6 py-4 text-sm text-amber-100"
          >
            Puedes abrir las pantallas de edición ahora mismo, pero para guardar cambios necesitarás iniciar sesión.
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p class="text-[11px] uppercase tracking-[0.22em] text-slate-400">Selecciona una edición</p>
            <p class="mt-3 max-w-2xl text-sm text-slate-300">
              Para mantenerlo simple, la baja del equipo vive dentro de <span class="font-extrabold text-white">Editar equipo</span> y los jugadores viven dentro de <span class="font-extrabold text-white">Editar roster</span>.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <NuxtLink
              v-for="option in options"
              :key="option.to"
              :to="option.to"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/75 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-1 hover:border-white/20"
            >
              <div class="bg-gradient-to-br px-6 py-5" :class="option.accent">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-300">{{ option.badge }}</p>
                <h2 class="mt-3 text-2xl font-extrabold text-white">{{ option.title }}</h2>
                <p class="mt-3 max-w-sm text-sm text-slate-300">{{ option.description }}</p>
              </div>

              <div class="flex items-center justify-between px-6 py-5">
                <span class="text-sm font-semibold text-white">Abrir pantalla</span>
                <span class="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-white">→</span>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
