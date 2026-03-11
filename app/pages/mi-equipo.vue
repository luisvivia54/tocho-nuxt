<!-- app/pages/mi-equipo.vue -->
<template>
  <section class="pt-24 md:pt-28 lg:pt-32">
    <div class="max-w-5xl mx-auto container-pad px-6">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
            Mi equipo
          </h1>
          <p class="mt-2 text-slate-600 text-base">
            Aquí verás tus equipos como capitán y tus permisos en la liga.
          </p>
        </div>

        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>

      <!-- Estado de sesión -->
      <div v-if="!kcReady" class="mb-4 text-sm text-slate-500">
        Inicializando sesión…
      </div>

      <div
        v-else-if="!isAuthenticated"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        Debes iniciar sesión para ver tu equipo.
      </div>

      <!-- Contenido principal -->
      <div
        v-if="kcReady && isAuthenticated"
        class="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 md:p-7 space-y-4"
      >
        <div v-if="loading" class="text-sm text-slate-500">
          Cargando información de tu equipo…
        </div>

        <div v-else-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <div v-else-if="summary">
          <!-- Resumen -->
          <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 mb-5 md:flex-row md:items-start md:justify-between">
            <div class="min-w-[140px]">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Rol
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.role }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Equipos como capitán
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.currentTeams }} / {{ summary.maxTeamsAllowed }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                ¿Puede crear equipo?
              </p>
              <p
                class="mt-1 text-[14px] font-semibold"
                :class="summary.canCreateTeam ? 'text-green-600' : 'text-red-600'"
              >
                {{ summary.canCreateTeam ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>

          <!-- Mensajes según privilegios -->
          <div v-if="!summary.hasCaptainPrivileges" class="text-sm text-slate-600">
            No tienes rol de capitán. Si crees que esto es un error, contacta al administrador de la liga.
          </div>

          <template v-else>
            <!-- Caso: puede crear equipo y aún no tiene -->
            <div
              v-if="summary.currentTeams === 0 && summary.canCreateTeam"
              class="space-y-3"
            >
              <p class="text-sm text-slate-600">
                Aún no has registrado un equipo. Puedes crear uno nuevo desde el panel de registro.
              </p>

              <NuxtLink
                to="/registro"
                class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
              >
                Crear equipo
              </NuxtLink>
            </div>

            <!-- Caso: ya tiene al menos un equipo -->
            <div
              v-else-if="summary.currentTeams > 0"
              class="space-y-4"
            >
              <p class="text-sm text-slate-600">
                Ya tienes {{ summary.currentTeams }} equipo(s) registrado(s) como capitán.
              </p>

              <div class="grid gap-3 md:grid-cols-2">
                <article
                  v-for="team in normalizedTeams"
                  :key="team.teamId"
                  class="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between"
                >
                  <div>
                    <h2 class="font-display text-lg md:text-xl font-extrabold text-slate-900">
                      {{ team.name }}
                    </h2>

                    <p class="mt-2 text-xs text-slate-500">
                      ID: {{ team.id || team.teamId }} · Liga: {{ team.leagueId ?? 'N/A' }}
                    </p>
                  </div>

                  <div class="mt-4 flex flex-wrap items-center gap-2">
                    <NuxtLink
                      :to="`/teams/${team.teamId}`"
                      class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500"
                    >
                      Ver equipo
                    </NuxtLink>

                    <NuxtLink
                      :to="`/teams/${team.teamId}/editar`"
                      class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
                    >
                      Editar datos
                    </NuxtLink>

                    <p class="text-xs text-slate-500">
                      ID: {{ team.teamId }} · Liga: {{ team.leagueId ?? 'N/A' }}
                    </p>
                  </div>
                </article>
              </div>

              <p
                v-if="!summary.canCreateTeam && summary.currentTeams >= summary.maxTeamsAllowed"
                class="mt-2 text-xs text-slate-500"
              >
                Ya alcanzaste tu límite de equipos. Si necesitas registrar otro, contacta al admin.
              </p>
            </div>
          </template>
        </div>

        <div v-else class="text-sm text-slate-500">
          No se encontró información de tu equipo por ahora.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useState } from '#imports'
import { useAuthz } from '@/composables/useAuthz'
import { useMyTeam } from '@/composables/useMyTeam'

const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz()
const { summary, loading, error, loadMyTeam } = useMyTeam()

const normalizedTeams = computed(() => {
  const teams = summary.value?.teams ?? []
  return teams.map((team: any) => ({
    teamId: Number(team?.teamId ?? team?.id ?? 0),
    id: Number(team?.id ?? team?.teamId ?? 0),
    leagueId: team?.leagueId ?? null,
    name: String(team?.name ?? 'Equipo'),
  }))
})

watch(
  () => ({ ready: kcReady.value, auth: isAuthenticated.value }),
  ({ ready, auth }) => {
    if (ready && auth) {
      loadMyTeam()
    }
  },
  { immediate: true }
)
</script>