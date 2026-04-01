<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Redirección</p>
          <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">
            Redirigiendo…
          </h1>
          <p class="mt-3 text-sm text-slate-400">
            El registro sigue viviendo dentro de
            <span class="font-extrabold text-white">Mi equipo</span>, pero la edición ahora abre pantallas separadas.
          </p>

          <div class="mt-6">
            <NuxtLink
              :to="targetRoute"
              class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110"
            >
              Ir a Mi equipo
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { navigateTo, useRoute } from "#imports"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

const route = useRoute()

const isEditMode = computed(() => {
  return (
    String(route.query.edit ?? "") === "1" ||
    String(route.query.mode ?? "") === "edit" ||
    !!route.query.teamId
  )
})

const targetRoute = computed(() => {
  const editTeamId = Number(route.query.teamId ?? 0) || 0

  if (isEditMode.value && editTeamId > 0) {
    return {
      path: `/jueves/equipos/${editTeamId}/editar`,
    }
  }

  const query: Record<string, string> = {}
  query.view = "register"

  if (route.query.from != null) {
    query.from = String(route.query.from)
  }

  return {
    path: "/jueves/mi-equipo",
    query,
  }
})

await navigateTo(targetRoute.value, { replace: true })
</script>
