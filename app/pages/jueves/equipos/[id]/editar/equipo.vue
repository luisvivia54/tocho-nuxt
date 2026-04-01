<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import JuevesHeader from '~/components/jueves/JuevesHeader.vue'
import { useJuevesTeamEditor } from '~/composables/useJuevesTeamEditor'

const route = useRoute()
const router = useRouter()
const teamId = computed(() => Number(route.params.id) || 0)
const editor = useJuevesTeamEditor(teamId)
const {
  categories,
  categoriesLoading,
  cleanupPreviews,
  deactivateTeam,
  deleting,
  errorMessage,
  loadError,
  loading,
  niceGender,
  onLogoChange,
  saveTeamDetails,
  saving,
  selectedCategory,
  successMessage,
  team,
  teamDisplayName,
  uploading,
} = editor
const deleteAgreement = ref(false)

const selectionRoute = computed(() => `/jueves/equipos/${teamId.value}/editar`)
const detailRoute = computed(() => `/jueves/equipos/${teamId.value}`)

async function hydrate() {
  await editor.loadForEdit()
}

async function onSubmit() {
  await saveTeamDetails()
}

async function onDeleteTeam() {
  if (!deleteAgreement.value) {
    errorMessage.value = 'Debes confirmar que estás de acuerdo en desactivar este equipo.'
    return
  }

  const ok = await deactivateTeam()
  if (ok) {
    await router.push('/jueves/mi-equipo')
  }
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
            <h1 class="mt-2 text-3xl font-extrabold text-white md:text-4xl">Editar equipo</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-400">
              Ajusta identidad, colores, logo y categoría sin mezclarlo con el roster.
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
          Cargando información del equipo…
        </div>

        <form
          v-else
          class="mt-6 space-y-6"
          @submit.prevent="onSubmit"
        >
          <section class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div class="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Identidad</p>
                <h2 class="mt-2 text-xl font-extrabold text-white">{{ teamDisplayName }}</h2>
                <p class="mt-1 text-sm text-slate-400">
                  Aquí solo editas los datos del equipo. El roster vive en otra pantalla.
                </p>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div class="md:col-span-8">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre del equipo</label>
                <input
                  v-model.trim="team.name"
                  type="text"
                  placeholder="Ej. Tigres del Norte"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                >
              </div>

              <div class="md:col-span-4">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre corto</label>
                <input
                  v-model.trim="team.shortName"
                  type="text"
                  placeholder="Ej. TIG"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                >
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Categoría</label>
                <select
                  v-model.number="team.categoryId"
                  :disabled="categoriesLoading"
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60 disabled:opacity-50"
                >
                  <option :value="0">{{ categoriesLoading ? 'Cargando…' : 'Selecciona categoría' }}</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }} · {{ niceGender(category.gender) }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Rama</label>
                <input
                  :value="selectedCategory?.code?.toUpperCase() || '—'"
                  disabled
                  class="w-full rounded-2xl border border-white/10 bg-[#0B1020]/70 px-4 py-3 text-sm text-slate-400"
                >
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color primario</label>
                <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                  <input v-model="team.primaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent">
                  <input v-model.trim="team.primaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#F97316">
                </div>
              </div>

              <div class="md:col-span-6">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Color secundario</label>
                <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020] px-3 py-2">
                  <input v-model="team.secondaryColor" type="color" class="h-10 w-10 rounded-xl border border-white/10 bg-transparent">
                  <input v-model.trim="team.secondaryColor" type="text" class="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="#FFFFFF">
                </div>
              </div>

              <div class="md:col-span-8">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Logo del equipo</label>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <input
                    v-model.trim="team.logoUrl"
                    type="text"
                    placeholder="https://... o /img/..."
                    class="flex-1 rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400/60"
                  >
                  <label class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">
                    {{ uploading ? 'Subiendo…' : 'Elegir archivo' }}
                    <input type="file" accept="image/*" class="hidden" @change="onLogoChange">
                  </label>
                </div>
              </div>

              <div class="md:col-span-4">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Vista rápida</label>
                <div class="flex h-[116px] items-center justify-center rounded-3xl border border-white/10 bg-[#0B1020]">
                  <img v-if="team.logoUrl" :src="team.logoUrl" :alt="teamDisplayName" class="max-h-24 max-w-[120px] object-contain">
                  <span v-else class="text-sm text-slate-500">Sin logo</span>
                </div>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                class="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] hover:brightness-110 disabled:opacity-50"
                :disabled="saving || uploading || deleting"
              >
                {{ saving ? 'Guardando…' : 'Guardar equipo' }}
              </button>
            </div>
          </section>

          <section class="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p class="text-[11px] uppercase tracking-[0.22em] text-rose-300/80">Zona de peligro</p>
            <h3 class="mt-2 text-xl font-extrabold text-white">Borrar equipo</h3>
            <p class="mt-2 text-sm text-slate-300">
              Esta acción hará un soft delete del equipo actual.
            </p>

            <label class="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                v-model="deleteAgreement"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-white/20 bg-[#08101E] text-orange-500 focus:ring-orange-400"
              >
              <span class="text-sm text-slate-200">
                Confirmo que estoy de acuerdo en desactivar este equipo.
              </span>
            </label>

            <div class="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-extrabold text-rose-100 hover:bg-rose-500/15 disabled:opacity-50"
                :disabled="!deleteAgreement || deleting || saving"
                @click="onDeleteTeam"
              >
                {{ deleting ? 'Desactivando…' : 'Sí, borrar equipo' }}
              </button>
            </div>
          </section>
        </form>
      </div>
    </section>
  </main>
</template>
