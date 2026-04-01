<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import JuevesHeader from '~/components/jueves/JuevesHeader.vue'
import { useJuevesTeamEditor } from '~/composables/useJuevesTeamEditor'

const route = useRoute()
const teamId = computed(() => Number(route.params.id) || 0)
const editor = useJuevesTeamEditor(teamId)
const {
  addPlayer,
  cleanupPreviews,
  errorMessage,
  loadError,
  loading,
  onPlayerPhotoChange,
  saveRoster,
  saving,
  successMessage,
  team,
  teamDisplayName,
  validPlayers,
} = editor

const selectionRoute = computed(() => `/jueves/equipos/${teamId.value}/editar`)
const detailRoute = computed(() => `/jueves/equipos/${teamId.value}`)

async function hydrate() {
  await editor.loadForEdit()
}

async function onSubmit() {
  await saveRoster()
}

onMounted(async () => {
  if (teamId.value) await hydrate()
})

watch(
  () => teamId.value,
  async (value) => {
    if (value) await hydrate()
  }
)

onBeforeUnmount(() => {
  cleanupPreviews()
})
</script>

<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <JuevesHeader />

    <section class="pt-24 md:pt-28 lg:pt-32">
      <div class="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <header class="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Gestión de equipo</p>
            <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">Editar roster</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Agrega, actualiza o quita integrantes en una pantalla dedicada solo al roster.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <NuxtLink
              :to="selectionRoute"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              ← Volver a opciones
            </NuxtLink>
            <NuxtLink
              :to="detailRoute"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Ver equipo
            </NuxtLink>
          </div>
        </header>

        <div
          v-if="successMessage"
          class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="errorMessage || loadError"
          class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 whitespace-pre-line"
        >
          {{ errorMessage || loadError }}
        </div>

        <div
          v-if="loading"
          class="mt-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400"
        >
          Cargando roster…
        </div>

        <form
          v-else
          class="mt-6 space-y-6"
          @submit.prevent="onSubmit"
        >
          <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Integrantes</p>
                <h3 class="mt-2 text-xl font-extrabold text-white">{{ teamDisplayName }}</h3>
                <p class="mt-1 text-sm text-slate-400">
                  Se enviarán <span class="font-extrabold text-white">{{ validPlayers.length }}</span> / {{ team.players.length }} integrantes completos.
                </p>
              </div>
              <button
                type="button"
                class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                @click="addPlayer"
              >
                + Agregar integrante
              </button>
            </div>

            <div v-if="team.players.length === 0" class="mt-4 rounded-2xl border border-white/10 bg-[#0B1020]/50 px-4 py-4 text-sm text-slate-400">
              No has agregado integrantes todavía.
            </div>

            <div v-else class="mt-4 space-y-3">
              <div v-for="(player, index) in team.players" :key="player.id" class="rounded-3xl border p-4" :class="player.markedForDeletion ? 'border-rose-400/20 bg-rose-500/10' : 'border-white/10 bg-[#0B1020]/70'">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-white">Jugador {{ index + 1 }}</p>
                    <span v-if="player.isNew" class="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-100">Nuevo</span>
                    <span v-if="player.markedForDeletion" class="rounded-full border border-rose-400/20 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-100">Se eliminará</span>
                  </div>
                  <button
                    type="button"
                    class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/15"
                    @click="editor.removePlayer(index)"
                  >
                    {{ player.isNew && !player.playerId ? 'Quitar' : player.markedForDeletion ? 'Deshacer' : 'Eliminar' }}
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
                  <div class="md:col-span-5">
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre completo</label>
                    <input v-model.trim="player.fullName" type="text" placeholder="Nombre del jugador" :disabled="player.markedForDeletion" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60 disabled:opacity-50">
                  </div>

                  <div class="md:col-span-4">
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">CURP</label>
                    <input v-model.trim="player.curp" type="text" placeholder="CURP" :disabled="player.markedForDeletion" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 uppercase outline-none transition focus:border-orange-400/60 disabled:opacity-50">
                  </div>

                  <div class="md:col-span-3">
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Jersey</label>
                    <input v-model.trim="player.jerseyNumber" type="text" placeholder="Opcional" :disabled="player.markedForDeletion" class="w-full rounded-2xl border border-white/10 bg-[#08101E] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60 disabled:opacity-50">
                  </div>

                  <div class="md:col-span-8">
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Foto del jugador</label>
                    <p class="mb-2 text-xs text-slate-500">Sin foto, este integrante no se enviará.</p>
                    <input
                      type="file"
                      accept="image/*"
                      :disabled="player.markedForDeletion"
                      class="block w-full text-xs text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-white/15 disabled:opacity-50"
                      @change="onPlayerPhotoChange(index, $event)"
                    >
                  </div>

                  <div class="md:col-span-4">
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista previa</label>
                    <div class="flex h-[72px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#08101E]">
                      <img
                        v-if="player.photoPreview"
                        :src="player.photoPreview"
                        alt="Foto"
                        class="h-full w-full object-cover"
                      >
                      <span v-else class="text-xs text-slate-500">Sin foto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                class="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110 disabled:opacity-50"
                :disabled="saving"
              >
                {{ saving ? 'Guardando…' : 'Guardar roster' }}
              </button>
            </div>
          </section>
        </form>
      </div>
    </section>
  </main>
</template>
