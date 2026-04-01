<!-- app/pages/registro.vue -->
<template>
  <main class="min-h-screen bg-[#F3F4FF] text-slate-900 pt-12 md:pt-14 lg:pt-16">
    <div class="mx-auto max-w-5xl container-pad px-6 pb-16">
      <div class="rounded-[26px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.10)]">
        <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600">
          Mi equipo
        </p>
        <h1 class="mt-2 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Redirigiendo…
        </h1>
        <p class="mt-3 text-sm text-slate-600">
          El registro sigue viviendo dentro de <strong>Mi equipo</strong>, pero la edición ahora abre pantallas separadas.
        </p>

        <div class="mt-6">
          <NuxtLink
            :to="targetRoute"
            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Ir a Mi equipo
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { navigateTo, useRoute } from '#imports'

const route = useRoute()

const isEditMode = computed(() => {
  return (
    String(route.query.edit ?? '') === '1' ||
    String(route.query.mode ?? '') === 'edit' ||
    !!route.query.teamId ||
    !!route.query.editTeamId
  )
})

const targetRoute = computed(() => {
  const editTeamId = Number(route.query.teamId ?? route.query.editTeamId ?? 0) || 0

  if (isEditMode.value && editTeamId > 0) {
    return {
      path: `/teams/${editTeamId}/editar`,
    }
  }

  const query: Record<string, string> = {}

  query.view = 'register'

  if (route.query.from != null) {
    query.from = String(route.query.from)
  }

  return {
    path: '/mi-equipo',
    query,
  }
})

await navigateTo(targetRoute.value, { replace: true })
</script>
