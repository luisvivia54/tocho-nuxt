<!-- app/pages/mi-equipo.vue -->
<template>
  <section class="pt-12 md:pt-14 lg:pt-16">
    <div class="mx-auto max-w-5xl container-pad px-6">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-slate-900 md:text-4xl">
            Mi equipo
          </h1>
          <p class="mt-2 text-base text-slate-600">
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
        v-else-if="!authOk"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        Debes iniciar sesión para ver tu equipo.
      </div>

      <!-- Contenido principal -->
      <div
        v-if="kcReady && authOk"
        class="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-7"
      >
        <div v-if="loading" class="text-sm text-slate-500">
          Cargando información de tu equipo…
        </div>

        <div v-else-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <div v-else-if="summary">
          <!-- Resumen -->
          <div class="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div class="min-w-[140px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rol
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.role }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Equipos como capitán
              </p>
              <p class="mt-1 text-[14px] font-semibold text-slate-800">
                {{ summary.currentTeams }} / {{ summary.maxTeamsAllowed }}
              </p>
            </div>

            <div class="min-w-[180px]">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Crear equipo
              </NuxtLink>
            </div>

            <!-- Caso: ya tiene al menos un equipo -->
            <div v-else-if="normalizedTeams.length > 0" class="space-y-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p class="text-sm text-slate-600">
                  Ya tienes {{ normalizedTeams.length }} equipo(s) registrado(s) como capitán.
                </p>

                <NuxtLink
                  v-if="summary.canCreateTeam"
                  to="/registro"
                  class="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  + Registrar otro equipo
                </NuxtLink>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <article
                  v-for="team in normalizedTeams"
                  :key="team.teamId"
                  class="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div class="flex min-h-[140px] flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <h2 class="truncate font-display text-lg font-extrabold text-slate-900 md:text-xl">
                            {{ team.name }}
                          </h2>

                          <p class="mt-2 text-xs text-slate-500">
                            ID: {{ team.teamId }} · Liga: {{ team.leagueId ?? DEFAULT_LEAGUE_ID }}
                          </p>
                        </div>

                        <span
                          class="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          Capitán
                        </span>
                      </div>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-2">
                      <NuxtLink
                        :to="buildViewLink(team)"
                        class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                      >
                        Ver equipo
                      </NuxtLink>

                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                        @click="toggleEditMenu(team.teamId)"
                      >
                        {{ editMenuTeamId === team.teamId ? 'Cerrar edición' : 'Editar equipo' }}
                      </button>

                      <p class="text-xs text-slate-500">
                        ID: {{ team.teamId }} · Liga: {{ team.leagueId ?? DEFAULT_LEAGUE_ID }}
                      </p>
                    </div>
                  </div>

                  <!-- Menú de edición estilo jueves -->
                  <transition
                    enter-active-class="transition duration-150 ease-out"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1"
                  >
                    <div
                      v-if="editMenuTeamId === team.teamId"
                      class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div class="flex flex-col gap-3">
                        <div>
                          <p class="text-sm font-semibold text-slate-900">
                            Editar equipo: {{ team.name }}
                          </p>
                          <p class="mt-1 text-xs text-slate-500">
                            Este flujo usa el editor del registro, igual que en la lógica de jueves.
                          </p>
                        </div>

                        <div class="grid gap-2 sm:grid-cols-2">
                          <NuxtLink
                            :to="buildRegistroEditLink(team)"
                            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                          >
                            Abrir editor
                          </NuxtLink>

                          <NuxtLink
                            :to="buildViewLink(team)"
                            class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Ver detalle
                          </NuxtLink>
                        </div>

                        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          Si la ruta vieja <span class="font-semibold">/teams/{{ team.teamId }}/editar</span> te estaba fallando,
                          este botón entra por el flujo de edición del registro.
                        </div>
                      </div>
                    </div>
                  </transition>
                </article>
              </div>

              <p
                v-if="!summary.canCreateTeam && summary.currentTeams >= summary.maxTeamsAllowed"
                class="mt-2 text-xs text-slate-500"
              >
                Ya alcanzaste tu límite de equipos. Si necesitas registrar otro, contacta al admin.
              </p>
            </div>

            <div v-else class="text-sm text-slate-500">
              No se encontraron equipos válidos en tu resumen.
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
import { computed, watch, ref } from 'vue'
import { useState } from '#imports'
import { useAuthz } from '@/composables/useAuthz'
import { useMyTeam } from '@/composables/useMyTeam'

const DEFAULT_LEAGUE_ID = 1

const kcReady = useState<boolean>('kcReady', () => false)
const { isAuthenticated } = useAuthz()
const { summary, loading, error, loadMyTeam } = useMyTeam()

const editMenuTeamId = ref<number | null>(null)

const authOk = computed(() => {
  const raw = isAuthenticated as any
  if (typeof raw === 'boolean') return raw
  if (raw && typeof raw === 'object' && 'value' in raw) return !!raw.value
  return false
})

const normalizedTeams = computed(() => {
  const teams = Array.isArray(summary.value?.teams) ? summary.value.teams : []

  const mapped = teams
    .map((team: any) => {
      const teamId = Number(team?.teamId ?? team?.id ?? 0)
      const id = Number(team?.id ?? team?.teamId ?? 0)
      const leagueId = Number(team?.leagueId ?? team?.league_id ?? DEFAULT_LEAGUE_ID) || DEFAULT_LEAGUE_ID
      const name = String(team?.name ?? team?.teamName ?? 'Equipo').trim() || 'Equipo'

      return {
        teamId,
        id,
        leagueId,
        name,
      }
    })
    .filter((team) => Number.isFinite(team.teamId) && team.teamId > 0)

  const unique = new Map<number, { teamId: number; id: number; leagueId: number; name: string }>()

  for (const team of mapped) {
    if (!unique.has(team.teamId)) {
      unique.set(team.teamId, team)
    }
  }

  return Array.from(unique.values())
})

function toggleEditMenu(teamId: number) {
  editMenuTeamId.value = editMenuTeamId.value === teamId ? null : teamId
}

function buildViewLink(team: { teamId: number }) {
  return `/teams/${team.teamId}`
}

function buildRegistroEditLink(team: { teamId: number; leagueId?: number | null }) {
  const leagueId = team.leagueId ?? DEFAULT_LEAGUE_ID

  return {
    path: '/registro',
    query: {
      edit: '1',
      mode: 'edit',
      teamId: String(team.teamId),
      editTeamId: String(team.teamId),
      leagueId: String(leagueId),
      from: 'mi-equipo',
    },
  }
}

watch(
  () => ({ ready: kcReady.value, auth: authOk.value }),
  ({ ready, auth }) => {
    if (ready && auth) {
      loadMyTeam()
    }
  },
  { immediate: true }
)

watch(
  normalizedTeams,
  (teams) => {
    if (editMenuTeamId.value && !teams.some((team) => team.teamId === editMenuTeamId.value)) {
      editMenuTeamId.value = null
    }
  },
  { immediate: true }
)
</script>