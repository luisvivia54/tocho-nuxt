<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useTeamEditor } from '@/composables/useTeamEditor'

const route = useRoute()
const router = useRouter()
const teamId = computed(() => Number(route.params.id) || 0)

const editor = useTeamEditor(teamId)
const {
  activePhotosCount,
  addPhotoSlot,
  categoryName,
  cleanupPreviews,
  colorPrimary,
  colorSecondary,
  deactivateTeam,
  deleteConfirmText,
  deletePhrase,
  deleteTypedOk,
  deleting,
  errorMessage,
  isAuthenticated,
  leagueName,
  loadError,
  loading,
  logoPreview,
  onCarouselPhotoChange,
  onLoginClick,
  onLogoChange,
  photos,
  saveTeamDetails,
  saving,
  seasonName,
  successMessage,
  teamDisplayName,
  teamName,
  teamShortName,
  toggleRemovePhoto,
  removeNewPhotoSlot,
} = editor

const selectionRoute = computed(() => `/teams/${teamId.value}/editar`)
const detailRoute = computed(() => `/teams/${teamId.value}`)

async function hydrate() {
  await editor.loadForTeamEdit()
}

async function onSubmit() {
  await saveTeamDetails()
}

async function onDeleteTeam() {
  const ok = await deactivateTeam()
  if (ok) {
    await router.push('/teams')
  }
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
          <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Gestión de equipo
          </p>
          <h1 class="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">
            Editar equipo
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-400">
            Ajusta la identidad del equipo, el logo, los colores y la galería sin mezclarlo con el roster.
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
        <p class="text-lg font-semibold text-white">Inicia sesión para editar tu equipo</p>
        <p class="mt-2 max-w-xl text-sm text-slate-400">
          Necesitas entrar con tu cuenta para modificar el nombre, logo, colores o fotos del equipo.
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

      <form
        v-else
        class="mt-8 space-y-8"
        @submit.prevent="onSubmit"
      >
        <section class="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/95 shadow-[0_24px_70px_rgba(15,23,42,0.55)]">
          <div class="border-b border-white/10 bg-gradient-to-r from-sky-500/20 via-cyan-400/10 to-transparent px-6 py-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
              Datos base
            </p>
            <h2 class="mt-2 text-2xl font-extrabold text-white">
              {{ teamDisplayName }}
            </h2>
            <p class="mt-2 text-sm text-slate-400">
              Mantén aquí solo lo esencial del equipo. El roster vive en una pantalla aparte.
            </p>
          </div>

          <div class="grid gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div class="space-y-5">
              <div class="grid gap-4 md:grid-cols-3">
                <div class="md:col-span-2">
                  <label class="mb-1 block text-xs font-semibold text-slate-300">Nombre del equipo</label>
                  <input
                    v-model="teamName"
                    type="text"
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60"
                    placeholder="Ej. Leonas del Valle"
                  >
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-300">Nombre corto</label>
                  <input
                    v-model="teamShortName"
                    type="text"
                    class="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60"
                    placeholder="Ej. LEO"
                  >
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Liga</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ leagueName }}</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Temporada</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ seasonName }}</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Categoría</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ categoryName }}</p>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-300">Color primario</label>
                  <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1120] px-3 py-2">
                    <input
                      v-model="colorPrimary"
                      type="color"
                      class="h-10 w-10 rounded-xl border border-white/10 bg-transparent"
                    >
                    <input
                      v-model="colorPrimary"
                      type="text"
                      class="flex-1 bg-transparent text-sm text-slate-100 outline-none"
                    >
                  </div>
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-300">Color secundario</label>
                  <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1120] px-3 py-2">
                    <input
                      v-model="colorSecondary"
                      type="color"
                      class="h-10 w-10 rounded-xl border border-white/10 bg-transparent"
                    >
                    <input
                      v-model="colorSecondary"
                      type="text"
                      class="flex-1 bg-transparent text-sm text-slate-100 outline-none"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <div class="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Logo
                </p>
                <p class="mt-2 text-sm text-slate-400">
                  Si subes uno nuevo, reemplazará al actual al guardar.
                </p>

                <div class="mt-5 flex items-center gap-4">
                  <div
                    class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-[#0B1120]"
                  >
                    <img
                      v-if="logoPreview"
                      :src="logoPreview"
                      alt="Logo del equipo"
                      class="h-full w-full object-contain"
                    >
                    <span v-else class="px-3 text-center text-[11px] text-slate-500">Sin logo</span>
                  </div>

                  <label class="flex-1 rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-4 text-sm text-slate-300 transition hover:border-sky-400/40">
                    <span class="block font-semibold text-white">Cambiar logo</span>
                    <span class="mt-1 block text-xs text-slate-400">PNG o JPG, idealmente liviano.</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-500/15 file:px-3 file:py-2 file:font-semibold file:text-sky-100 hover:file:bg-sky-500/25"
                      @change="onLogoChange"
                    >
                  </label>
                </div>
              </div>

              <div class="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/6 to-white/[0.02] p-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Vista rápida
                </p>

                <div
                  class="mt-4 rounded-[24px] border border-white/10 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  :style="{
                    background: `linear-gradient(135deg, ${colorPrimary} 0%, ${colorSecondary} 140%)`,
                  }"
                >
                  <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-950/70">
                    Identidad visual
                  </p>
                  <p class="mt-2 text-2xl font-black text-slate-950">
                    {{ teamDisplayName }}
                  </p>
                  <p class="mt-2 text-sm text-slate-950/80">
                    Esta vista te ayuda a validar contraste y presencia antes de guardar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-[30px] border border-white/10 bg-slate-900/95 px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.45)]">
          <div class="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                Galería
              </p>
              <h2 class="mt-2 text-xl font-extrabold text-white">Fotos del carrusel</h2>
              <p class="mt-2 text-sm text-slate-400">
                Sube o reemplaza imágenes destacadas del equipo. Activas: {{ activePhotosCount }} / 5.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10"
              @click="addPhotoSlot"
            >
              + Agregar foto
            </button>
          </div>

          <div
            v-if="photos.length === 0"
            class="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400"
          >
            Aún no hay fotos cargadas. Puedes agregar la primera desde aquí.
          </div>

          <div v-else class="mt-5 space-y-4">
            <article
              v-for="(photo, index) in photos"
              :key="photo.localId"
              :class="[
                'grid gap-4 rounded-[26px] border px-4 py-4 md:grid-cols-[minmax(0,1.1fr)_220px]',
                photo.markedForDeletion ? 'border-red-500/40 bg-red-950/25' : 'border-white/10 bg-white/5',
              ]"
            >
              <div>
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
                      {{ index + 1 }}
                    </span>
                    <span
                      v-if="photo.isNew && !photo.photoId"
                      class="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-100"
                    >
                      Nueva
                    </span>
                    <span
                      v-if="photo.markedForDeletion"
                      class="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-red-100"
                    >
                      Se eliminará
                    </span>
                  </div>

                  <button
                    type="button"
                    class="text-[11px] font-semibold text-slate-400 hover:text-red-200"
                    @click="photo.isNew && !photo.photoId ? removeNewPhotoSlot(index) : toggleRemovePhoto(index)"
                  >
                    {{
                      photo.isNew && !photo.photoId
                        ? 'Quitar'
                        : photo.markedForDeletion
                          ? 'Deshacer'
                          : 'Eliminar'
                    }}
                  </button>
                </div>

                <label class="mt-4 block rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-4 text-sm text-slate-300 transition hover:border-cyan-400/40">
                  <span class="block font-semibold text-white">Cambiar imagen</span>
                  <span class="mt-1 block text-xs text-slate-400">Si no eliges archivo, la imagen actual se conserva.</span>
                  <input
                    type="file"
                    accept="image/*"
                    :disabled="photo.markedForDeletion"
                    class="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-500/15 file:px-3 file:py-2 file:font-semibold file:text-cyan-100 hover:file:bg-cyan-500/25 disabled:opacity-50"
                    @change="onCarouselPhotoChange(index, $event)"
                  >
                </label>
              </div>

              <div class="overflow-hidden rounded-[24px] border border-dashed border-white/10 bg-[#0B1120]">
                <img
                  v-if="photo.newPreview || photo.currentUrl"
                  :src="photo.newPreview || photo.currentUrl || ''"
                  alt="Foto del carrusel"
                  class="h-full min-h-[160px] w-full object-cover"
                >
                <div v-else class="flex h-full min-h-[160px] items-center justify-center px-4 text-center text-xs text-slate-500">
                  Sin imagen seleccionada
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="rounded-[30px] border border-red-500/25 bg-red-950/20 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200/80">
            Zona de peligro
          </p>
          <h2 class="mt-2 text-xl font-extrabold text-red-50">Eliminar equipo</h2>
          <p class="mt-2 max-w-2xl text-sm text-red-100/75">
            Esta acción desactiva el equipo. Si estás segura o seguro, escribe la palabra de confirmación y continúa.
          </p>

          <div class="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div class="rounded-2xl border border-red-500/20 bg-black/15 px-4 py-4 text-sm text-red-50/80">
              La palabra requerida es <span class="font-black text-white">{{ deletePhrase }}</span>. Solo úsala cuando de verdad quieras sacar al equipo del flujo activo.
            </div>

            <div class="space-y-3">
              <input
                v-model="deleteConfirmText"
                type="text"
                class="w-full rounded-2xl border border-red-500/30 bg-[#14070B] px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/70"
                :placeholder="deletePhrase"
                autocomplete="off"
                spellcheck="false"
              >

              <button
                type="button"
                class="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="deleting || saving || !deleteTypedOk"
                @click="onDeleteTeam"
              >
                <span v-if="deleting">Eliminando…</span>
                <span v-else>Eliminar equipo</span>
              </button>
            </div>
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
            class="inline-flex items-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
          >
            <span v-if="saving">Guardando cambios…</span>
            <span v-else>Guardar equipo</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
