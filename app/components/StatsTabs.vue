<!-- app/components/StatsTabs.vue -->
<template>
  <div class="flex items-center gap-2">
    <NuxtLink
      :to="{ path: '/estadisticas' }"
      class="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold border transition"
      :class="active === 'equipos'
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'"
    >
      Equipos
    </NuxtLink>

    <NuxtLink
      :to="{ path: '/estadisticas', query: { view: 'jugadores' } }"
      class="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold border transition"
      :class="active === 'jugadores'
        ? 'border-slate-900 bg-slate-900 text-white'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'"
    >
      Jugadores
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const active = computed<'equipos' | 'jugadores'>(() => {
  return route.query.view === 'jugadores' ? 'jugadores' : 'equipos'
})
</script>
