<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import { useTeamEditor } from '@/composables/useTeamEditor'

const route = useRoute()
const teamId = computed(() => Number(route.params.id) || 0)

const editor = useTeamEditor(teamId)
const {
  addPlayer,
  cleanupPreviews,
  errorMessage,
  isAuthenticated,
  loadError,
  loading,
  onLoginClick,
  onPlayerPhotoChange,
  players,
  removeNewPlayerCard,
  saveRoster,
  saving,
  successMessage,
  teamDisplayName,
  toggleRemovePlayer,
} = editor

const selectionRoute = computed(() => `/teams/${teamId.value}/editar`)
const detailRoute = computed(() => `/teams/${teamId.value}`)

async function hydrate() {
  await editor.loadForRosterEdit()
}

async function onSubmit() {
  await saveRoster()
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

onBeforeUnmount(() => {
  cleanupPreviews()
})
</script>

<template>
  <main class="min-h-screen bg-[#020617] pt-24 text-slate-50 md:pt-28 lg:pt-32">
    <div class="mx-auto max-w-5xl container-pad px-6 pb-16">
      <header class="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300/80">
            Gestión de equipo
          </p>
          <h1 class="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">
            Editar roster
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-400">
            Agrega, actualiza o elimina integrantes en una pantalla enfocada solo en el roster.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            :to="selectionRoute"
            class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            ← Volver a opciones
          </NuxtLink>

          <NuxtLink
            :to="detailRoute"
            class="inline-flex items-center rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
          >
            Ver equipo
          </NuxtLink>
        </div>
      </header>

      <div
        v-if="!isAuthenticated"
        class="mt-8 rounded-[28px] border border-slate-700 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.45)]"
      >
        <p class="text-lg font-semibold text-white">Inicia sesión para editar el roster</p>
        <p class="mt-2 max-w-xl text-sm text-slate-400">
          Necesitas entrar con tu cuenta para administrar jugadoras y jugadores del equipo.
        </p>

        <button
          type="button"
          class="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300"
          @click="onLoginClick"
        >
          Entrar con mi cuenta
        </button>
      </div>

      <div
        v-else-if="loading"
        class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300"
      >
        Cargando roster…
      </div>

      <div
        v-else-if="loadError"
        class="mt-8 rounded-2xl border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-100"
      >
        {{ loadError }}
      </div>

      <form
        v-else
        class="mt-8 space-y-8"
        @submit.prevent="onSubmit"
      >
        <section class="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/95 shadow-[0_24px_70px_rgba(15,23,42,0.55)]">
          <div class="border-b border-white/10 bg-gradient-to-r from-amber-400/18 via-orange-400/10 to-transparent px-6 py-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200/80">
              Roster activo
            </p>
            <div class="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 class="text-2xl font-extrabold text-white">{{ teamDisplayName }}</h2>
                <p class="mt-2 text-sm text-slate-400">
                  {{ players.length }} integrante{{ players.length === 1 ? '' : 's' }} en edición.
                </p>
              </div>

              <button
                type="button"
                class="inline-flex items-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
                @click="addPlayer"
              >
                + Agregar integrante
              </button>
            </div>
          </div>

          <div
            v-if="players.length === 0"
            class="px-6 py-10 text-center"
          >
            <div class="mx-auto max-w-xl rounded-[28px] border border-dashed border-white/10 bg-white/5 px-6 py-8">
              <p class="text-lg font-semibold text-white">Todavía no hay integrantes</p>
              <p class="mt-2 text-sm text-slate-400">
                Empieza agregando el primer jugador o jugadora para construir el roster.
              </p>
              <button
                type="button"
                class="mt-5 inline-flex items-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300"
                @click="addPlayer"
              >
                Crear primera tarjeta
              </button>
            </div>
          </div>

          <div v-else class="space-y-4 px-6 py-6">
            <article
              v-for="(player, index) in players"
              :key="player.localId"
              :class="[
                'rounded-[28px] border px-4 py-4 md:px-5 md:py-5',
                player.markedForDeletion ? 'border-red-500/40 bg-red-950/25' : 'border-white/10 bg-white/5',
              ]"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
                    {{ index + 1 }}
                  </span>

                  <span
                    v-if="player.isNew && !player.playerId"
                    class="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-100"
                  >
                    Nuevo
                  </span>

                  <span
                    v-if="player.markedForDeletion"
                    class="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-red-100"
                  >
                    Se eliminará
                  </span>
                </div>

                <div class="flex flex-col items-start gap-1 lg:items-end">
                  <button
                    type="button"
                    class="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-left text-[11px] font-semibold text-red-100 hover:bg-red-500/20"
                    @click="player.isNew && !player.playerId ? removeNewPlayerCard(index) : toggleRemovePlayer(index)"
                  >
                    {{
                      player.isNew && !player.playerId
                        ? 'Quitar tarjeta'
                        : player.markedForDeletion
                          ? 'Deshacer eliminación'
                          : 'Eliminar integrante'
                    }}
                  </button>

                  <p
                    v-if="player.markedForDeletion"
                    class="text-[11px] text-red-200/80"
                  >
                    Se eliminará cuando guardes el roster.
                  </p>
                </div>
              </div>

              <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_240px]">
                <div class="space-y-4">
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-slate-300">
                      Nombre completo
                    </label>
                    <input
                      v-model="player.fullName"
                      type="text"
                      :disabled="player.markedForDeletion"
                      class="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300/70 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ej. María López"
                    >
                  </div>

                  <div class="grid gap-4 md:grid-cols-[minmax(0,2fr)_140px]">
                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-300">CURP</label>
                      <input
                        v-model="player.curp"
                        type="text"
                        :disabled="player.markedForDeletion"
                        class="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm uppercase tracking-[0.08em] text-slate-100 outline-none transition focus:border-amber-300/70 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="CURP"
                      >
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-semibold text-slate-300">Jersey</label>
                      <input
                        v-model.number="player.jerseyNumber"
                        type="number"
                        min="0"
                        :disabled="player.markedForDeletion"
                        class="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300/70 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="10"
                      >
                    </div>
                  </div>

                  <label class="block rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-4 text-sm text-slate-300 transition hover:border-amber-300/35">
                    <span class="block font-semibold text-white">Foto del integrante</span>
                    <span class="mt-1 block text-xs text-slate-400">Si no subes archivo nuevo, la foto actual se mantiene.</span>
                    <input
                      type="file"
                      accept="image/*"
                      :disabled="player.markedForDeletion"
                      class="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-amber-400/15 file:px-3 file:py-2 file:font-semibold file:text-amber-100 hover:file:bg-amber-400/25 disabled:opacity-50"
                      @change="onPlayerPhotoChange(index, $event)"
                    >
                  </label>
                </div>

                <div class="overflow-hidden rounded-[24px] border border-dashed border-white/10 bg-[#0B1120]">
                  <img
                    v-if="player.photoPreview"
                    :src="player.photoPreview"
                    alt="Foto del jugador"
                    class="h-full min-h-[220px] w-full object-cover"
                  >
                  <div v-else class="flex h-full min-h-[220px] items-center justify-center px-4 text-center text-xs text-slate-500">
                    Sin foto cargada
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div
          v-if="successMessage"
          class="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-red-500/50 bg-red-950/35 px-4 py-3 text-sm text-red-100"
        >
          {{ errorMessage }}
        </div>

        <div class="flex flex-wrap justify-end gap-3">
          <NuxtLink
            :to="selectionRoute"
            class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10"
          >
            Cancelar
          </NuxtLink>

          <button
            type="submit"
            class="inline-flex items-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
          >
            <span v-if="saving">Guardando roster…</span>
            <span v-else>Guardar roster</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>