<template>
  <div class="min-h-screen bg-[#050816] text-slate-100">
    <main class="px-4 pb-36 pt-6 sm:px-6 lg:px-8 lg:pb-14">
      <section class="mx-auto max-w-7xl">
        <!-- Header -->
        <section
          class="mb-7 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-7"
        >
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="section-kicker">Panel Admin</p>

              <h1 class="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Nueva temporada
              </h1>

              <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Crea una nueva temporada para Liga Dominical y define las categorías disponibles para los equipos.
              </p>
            </div>

            <NuxtLink to="/domingo/admin" class="small-secondary-btn">
              Volver al panel
            </NuxtLink>
          </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <!-- Season form -->
          <section
            class="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-7"
          >
            <div class="mb-6">
              <p class="section-kicker">Temporada</p>
              <h2 class="mt-2 text-2xl font-black text-white">
                Datos principales
              </h2>
              <p class="mt-2 text-sm leading-6 text-slate-400">
                Información básica para identificar la nueva temporada y controlar el periodo de registro.
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="field sm:col-span-2">
                <span class="field-label">Nombre de temporada *</span>
                <input
                  v-model="seasonForm.name"
                  class="field-input"
                  placeholder="Temporada 2026"
                />
              </label>

              <label class="field">
                <span class="field-label">Código interno *</span>
                <input
                  v-model="seasonForm.code"
                  class="field-input uppercase"
                  placeholder="TEMP_2026_DOMINGO"
                />
              </label>

              <label class="field">
                <span class="field-label">Año *</span>
                <input
                  v-model.number="seasonForm.year"
                  type="number"
                  class="field-input"
                  placeholder="2026"
                />
              </label>

              <label class="field">
                <span class="field-label">Inicio de registros</span>
                <input
                  v-model="seasonForm.registrationStartsAt"
                  type="date"
                  class="field-input"
                />
              </label>

              <label class="field">
                <span class="field-label">Cierre de registros</span>
                <input
                  v-model="seasonForm.registrationEndsAt"
                  type="date"
                  class="field-input"
                />
              </label>

              <label class="field">
                <span class="field-label">Inicio de temporada</span>
                <input
                  v-model="seasonForm.startsAt"
                  type="date"
                  class="field-input"
                />
              </label>

              <label class="field">
                <span class="field-label">Límite de equipos</span>
                <input
                  v-model.number="seasonForm.teamLimit"
                  type="number"
                  class="field-input"
                  placeholder="10"
                />
              </label>

              <label class="field sm:col-span-2">
                <span class="field-label">Descripción / notas</span>
                <textarea
                  v-model="seasonForm.description"
                  class="field-input min-h-[88px] resize-none"
                  placeholder="Ej. Temporada de apertura 2026 para Liga Dominical..."
                />
              </label>
            </div>

            <div class="mt-5 grid gap-3">
              <label class="check-card">
                <input v-model="seasonForm.setAsCurrent" type="checkbox" class="check-input" />
                <span>
                  <span class="check-title">Marcar como temporada actual</span>
                  <span class="check-help">La nueva temporada quedará como la activa de Liga Dominical.</span>
                </span>
              </label>

              <label class="check-card">
                <input v-model="seasonForm.archivePreviousSeason" type="checkbox" class="check-input" />
                <span>
                  <span class="check-title">Cerrar temporada anterior</span>
                  <span class="check-help">Mantiene el histórico, pero evita mezclar equipos anteriores con la nueva temporada.</span>
                </span>
              </label>

              <label class="check-card">
                <input v-model="seasonForm.allowTeamCreation" type="checkbox" class="check-input" />
                <span>
                  <span class="check-title">Permitir registro de equipos</span>
                  <span class="check-help">Activa el flujo para que los capitanes puedan registrar equipos en esta temporada.</span>
                </span>
              </label>
            </div>

            <div class="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                class="small-primary-btn"
                :disabled="savingDraft"
                @click="saveDraft"
              >
                {{ savingDraft ? "Guardando..." : "Guardar" }}
              </button>

              <button
                type="button"
                class="small-primary-btn"
                :disabled="creatingSeason"
                @click="createSeason"
              >
                {{ creatingSeason ? "Creando..." : "Crear temporada" }}
              </button>

              <button type="button" class="small-danger-btn" @click="deleteDraft">
                Borrar
              </button>
            </div>

            <p v-if="successMessage" class="success-msg">
              {{ successMessage }}
            </p>

            <p v-if="errorMessage" class="error-msg">
              {{ errorMessage }}
            </p>
          </section>

          <!-- Categories form -->
          <section
            class="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-7"
          >
            <div class="mb-6">
              <p class="section-kicker">Categorías / subs</p>
              <h2 class="mt-2 text-2xl font-black text-white">
                Crear nueva categoría
              </h2>
              <p class="mt-2 text-sm leading-6 text-slate-400">
                Agrega categorías como Libre, 35+, U-8, U-10, Mixto, Femenil o Varonil.
              </p>
            </div>

            <div class="mb-5 flex flex-wrap gap-2">
              <button
                v-for="preset in categoryPresets"
                :key="preset.code"
                type="button"
                class="chip-btn"
                @click="loadPreset(preset)"
              >
                Usar {{ preset.label }}
              </button>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="field">
                <span class="field-label">Nombre *</span>
                <input
                  v-model="categoryForm.label"
                  class="field-input"
                  placeholder="Libre"
                />
              </label>

              <label class="field">
                <span class="field-label">Código interno *</span>
                <input
                  v-model="categoryForm.code"
                  class="field-input uppercase"
                  placeholder="LIBRE"
                />
              </label>

              <label class="field">
                <span class="field-label">Tipo *</span>
                <select v-model="categoryForm.type" class="field-input">
                  <option value="CATEGORY">Categoría</option>
                  <option value="SUB">Sub</option>
                </select>
              </label>

              <label class="field">
                <span class="field-label">Rama / género *</span>
                <select v-model="categoryForm.gender" class="field-input">
                  <option value="MIXTO">Mixto</option>
                  <option value="FEMENIL">Femenil</option>
                  <option value="VARONIL">Varonil</option>
                </select>
              </label>

              <label class="field">
                <span class="field-label">Rango de edad</span>
                <input
                  v-model="categoryForm.ageRange"
                  class="field-input"
                  placeholder="Ej. Libre o hasta 10 años"
                />
              </label>

              <label class="field">
                <span class="field-label">Máximo de equipos</span>
                <input
                  v-model.number="categoryForm.maxTeams"
                  type="number"
                  class="field-input"
                  placeholder="10"
                />
              </label>

              <label class="field sm:col-span-2">
                <span class="field-label">Notas</span>
                <textarea
                  v-model="categoryForm.notes"
                  class="field-input min-h-[78px] resize-none"
                  placeholder="Ej. Categoría abierta para equipos mixtos..."
                />
              </label>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <button type="button" class="small-secondary-btn" @click="newCategory">
                Nueva categoría
              </button>

              <button type="button" class="small-primary-btn" @click="saveCategory">
                {{ editingCategoryId ? "Guardar cambios" : "Guardar categoría" }}
              </button>

              <button
                type="button"
                class="small-danger-btn"
                :disabled="!editingCategoryId"
                @click="deleteCategory"
              >
                Borrar categoría
              </button>
            </div>

            <div class="mt-7">
              <p class="section-kicker">Categorías agregadas</p>

              <div v-if="categories.length" class="mt-3 space-y-2">
                <button
                  v-for="category in categories"
                  :key="category.localId"
                  type="button"
                  class="category-row"
                  :class="editingCategoryId === category.localId ? 'category-row--active' : ''"
                  @click="editCategory(category.localId)"
                >
                  <span>
                    <span class="block text-sm font-extrabold text-white">
                      {{ category.label }} · {{ category.gender }}
                    </span>
                    <span class="mt-0.5 block text-xs text-slate-400">
                      {{ category.code }} · {{ category.maxTeams }} equipos máximo
                    </span>
                  </span>

                  <span class="rounded-full border border-white/10 px-3 py-1 text-[11px] font-extrabold text-slate-300">
                    Editar
                  </span>
                </button>
              </div>

              <p v-else class="mt-3 rounded-2xl border border-white/10 bg-[#0b1222] px-4 py-4 text-sm text-slate-400">
                Aún no has guardado ninguna categoría.
              </p>
            </div>
          </section>
        </div>

        <!-- Payload preview -->
        <section
          class="mt-6 rounded-[28px] border border-white/10 bg-[#020617] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-7"
        >
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="section-kicker">Payload para backend</p>
              <h2 class="mt-2 text-xl font-black text-white">
                Vista previa de datos
              </h2>
              <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Esto es solo una vista previa de la información que después se puede mandar al backend para guardar en base de datos.
              </p>
            </div>

            <button type="button" class="small-secondary-btn" @click="copyPayload">
              Copiar JSON
            </button>
          </div>

          <pre class="max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-5 text-slate-300">{{ JSON.stringify(payloadPreview, null, 2) }}</pre>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

type CategoryType = "SUB" | "CATEGORY"
type Gender = "MIXTO" | "FEMENIL" | "VARONIL"
type Currency = "MXN" | "USD"

type CategoryForm = {
  localId: string
  label: string
  code: string
  type: CategoryType
  gender: Gender
  ageRange: string
  maxTeams: number
  registrationFee: number
  currency: Currency
  notes: string
}

type CategoryPreset = Omit<CategoryForm, "localId" | "notes" | "registrationFee" | "currency">

const DOMINGO_LEAGUE_ID = 1
const DRAFT_STORAGE_KEY = "domingo-new-season-draft"

const savingDraft = ref(false)
const creatingSeason = ref(false)
const successMessage = ref("")
const errorMessage = ref("")
const editingCategoryId = ref<string | null>(null)

const currentYear = new Date().getFullYear()

const seasonForm = reactive({
  leagueId: DOMINGO_LEAGUE_ID,
  name: `Temporada ${currentYear}`,
  code: `TEMP_${currentYear}_DOMINGO`,
  year: currentYear,
  registrationStartsAt: "",
  registrationEndsAt: "",
  startsAt: "",
  teamLimit: 10,
  description: "",
  setAsCurrent: true,
  archivePreviousSeason: true,
  allowTeamCreation: true,
})

const categories = ref<CategoryForm[]>([])
const categoryForm = reactive<CategoryForm>(createEmptyCategory())

const categoryPresets: CategoryPreset[] = [
  {
    label: "Libre",
    code: "LIBRE",
    type: "CATEGORY",
    gender: "MIXTO",
    ageRange: "Libre",
    maxTeams: 10,
  },
  {
    label: "35+",
    code: "35PLUS",
    type: "CATEGORY",
    gender: "MIXTO",
    ageRange: "35 años o más",
    maxTeams: 10,
  },
  {
    label: "U-8",
    code: "U8",
    type: "SUB",
    gender: "MIXTO",
    ageRange: "Hasta 8 años",
    maxTeams: 8,
  },
  {
    label: "U-10",
    code: "U10",
    type: "SUB",
    gender: "MIXTO",
    ageRange: "Hasta 10 años",
    maxTeams: 8,
  },
  {
    label: "U-12",
    code: "U12",
    type: "SUB",
    gender: "MIXTO",
    ageRange: "Hasta 12 años",
    maxTeams: 8,
  },
  {
    label: "Mixto",
    code: "MIXTO",
    type: "CATEGORY",
    gender: "MIXTO",
    ageRange: "Libre",
    maxTeams: 10,
  },
  {
    label: "Femenil",
    code: "FEMENIL",
    type: "CATEGORY",
    gender: "FEMENIL",
    ageRange: "Libre",
    maxTeams: 10,
  },
  {
    label: "Varonil",
    code: "VARONIL",
    type: "CATEGORY",
    gender: "VARONIL",
    ageRange: "Libre",
    maxTeams: 10,
  },
]

const payloadPreview = computed(() => {
  return {
    leagueId: seasonForm.leagueId,
    season: {
      name: seasonForm.name.trim(),
      code: normalizeCode(seasonForm.code),
      year: Number(seasonForm.year),
      registrationStartsAt: seasonForm.registrationStartsAt || null,
      registrationEndsAt: seasonForm.registrationEndsAt || null,
      startsAt: seasonForm.startsAt || null,
      teamLimit: Number(seasonForm.teamLimit || 0),
      description: seasonForm.description.trim() || null,
      setAsCurrent: seasonForm.setAsCurrent,
      archivePreviousSeason: seasonForm.archivePreviousSeason,
      allowTeamCreation: seasonForm.allowTeamCreation,
    },
    categories: categories.value.map((category) => ({
      label: category.label.trim(),
      code: normalizeCode(category.code),
      type: category.type,
      gender: category.gender,
      ageRange: category.ageRange.trim() || null,
      maxTeams: Number(category.maxTeams || 0),
      registrationFee: Number(category.registrationFee || 0),
      currency: category.currency,
      notes: category.notes.trim() || null,
    })),
  }
})

onMounted(() => {
  loadDraft()
})

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
}

function createEmptyCategory(): CategoryForm {
  return {
    localId: createLocalId(),
    label: "",
    code: "",
    type: "CATEGORY",
    gender: "MIXTO",
    ageRange: "",
    maxTeams: 10,
    registrationFee: 0,
    currency: "MXN",
    notes: "",
  }
}

function normalizeCode(value: string) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "")
}

function setCategoryForm(value: CategoryForm) {
  Object.assign(categoryForm, JSON.parse(JSON.stringify(value)))
}

function newCategory() {
  editingCategoryId.value = null
  setCategoryForm(createEmptyCategory())
  clearMessages()
}

function resetCategoryFormWithoutClearingMessages() {
  editingCategoryId.value = null
  setCategoryForm(createEmptyCategory())
}

function loadPreset(preset: CategoryPreset) {
  const next = createEmptyCategory()

  Object.assign(next, {
    ...preset,
    localId: editingCategoryId.value || createLocalId(),
    registrationFee: 0,
    currency: "MXN",
    notes: "",
  })

  setCategoryForm(next)
  clearMessages()
}

function validateCategory() {
  if (!categoryForm.label.trim()) return "El nombre de la categoría es obligatorio."
  if (!categoryForm.code.trim()) return "El código interno de la categoría es obligatorio."
  if (categoryForm.maxTeams <= 0) return "El máximo de equipos debe ser mayor a 0."

  return ""
}

function saveCategory() {
  clearMessages()

  const validation = validateCategory()
  if (validation) {
    errorMessage.value = validation
    return
  }

  const normalizedCode = normalizeCode(categoryForm.code)

  const duplicate = categories.value.find(
    (category) =>
      normalizeCode(category.code) === normalizedCode &&
      category.localId !== editingCategoryId.value
  )

  if (duplicate) {
    errorMessage.value = "Ya existe una categoría con ese código interno."
    return
  }

  const cleanCategory: CategoryForm = {
    ...JSON.parse(JSON.stringify(categoryForm)),
    code: normalizedCode,
  }

  if (editingCategoryId.value) {
    const index = categories.value.findIndex(
      (category) => category.localId === editingCategoryId.value
    )

    if (index !== -1) {
      categories.value[index] = cleanCategory
    }

    successMessage.value = "Categoría actualizada correctamente."
  } else {
    cleanCategory.localId = createLocalId()
    categories.value.push(cleanCategory)
    successMessage.value = "Categoría guardada correctamente."
  }

  resetCategoryFormWithoutClearingMessages()
}

function editCategory(localId: string) {
  const found = categories.value.find((category) => category.localId === localId)
  if (!found) return

  editingCategoryId.value = localId
  setCategoryForm(found)
  clearMessages()
}

function deleteCategory() {
  if (!editingCategoryId.value) return

  categories.value = categories.value.filter(
    (category) => category.localId !== editingCategoryId.value
  )

  resetCategoryFormWithoutClearingMessages()
  successMessage.value = "Categoría eliminada."
}

function validateSeason() {
  if (!seasonForm.name.trim()) return "El nombre de temporada es obligatorio."
  if (!seasonForm.code.trim()) return "El código interno de temporada es obligatorio."
  if (!seasonForm.year) return "El año es obligatorio."
  if (seasonForm.teamLimit <= 0) return "El límite de equipos debe ser mayor a 0."
  if (!categories.value.length) {
    return "Agrega y guarda al menos una categoría antes de crear la temporada."
  }

  return ""
}

function clearMessages() {
  successMessage.value = ""
  errorMessage.value = ""
}

async function saveDraft() {
  clearMessages()

  try {
    savingDraft.value = true

    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        seasonForm,
        categories: categories.value,
      })
    )

    successMessage.value = "Guardado en borrador."
  } catch (error) {
    console.error("Error al guardar:", error)
    errorMessage.value = "No se pudo guardar."
  } finally {
    savingDraft.value = false
  }
}

function loadDraft() {
  try {
    const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!rawDraft) return

    const draft = JSON.parse(rawDraft)

    if (draft?.seasonForm) {
      Object.assign(seasonForm, draft.seasonForm)
      seasonForm.leagueId = DOMINGO_LEAGUE_ID
    }

    if (Array.isArray(draft?.categories)) {
      categories.value = draft.categories
    }

    if (Array.isArray(draft?.subs)) {
      categories.value = draft.subs
    }
  } catch (error) {
    console.error("Error al cargar borrador:", error)
  }
}

async function createSeason() {
  clearMessages()

  const validation = validateSeason()
  if (validation) {
    errorMessage.value = validation
    return
  }

  try {
    creatingSeason.value = true

    /**
     * Aquí después conectas el backend.
     *
     * Endpoint recomendado:
     * POST /api/seasons/cycle
     *
     * Body:
     * payloadPreview.value
     */

    console.log("Payload para crear temporada:", payloadPreview.value)

    successMessage.value = "Temporada lista. Falta conectar con backend/base de datos."
  } catch (error) {
    console.error("Error al crear temporada:", error)
    errorMessage.value = "No se pudo crear la temporada."
  } finally {
    creatingSeason.value = false
  }
}

function deleteDraft() {
  const confirmed = window.confirm("¿Seguro que quieres borrar este formulario?")
  if (!confirmed) return

  localStorage.removeItem(DRAFT_STORAGE_KEY)

  seasonForm.leagueId = DOMINGO_LEAGUE_ID
  seasonForm.name = `Temporada ${currentYear}`
  seasonForm.code = `TEMP_${currentYear}_DOMINGO`
  seasonForm.year = currentYear
  seasonForm.registrationStartsAt = ""
  seasonForm.registrationEndsAt = ""
  seasonForm.startsAt = ""
  seasonForm.teamLimit = 10
  seasonForm.description = ""
  seasonForm.setAsCurrent = true
  seasonForm.archivePreviousSeason = true
  seasonForm.allowTeamCreation = true

  categories.value = []
  resetCategoryFormWithoutClearingMessages()

  successMessage.value = "Formulario borrado."
}

async function copyPayload() {
  clearMessages()

  try {
    await navigator.clipboard.writeText(JSON.stringify(payloadPreview.value, null, 2))
    successMessage.value = "JSON copiado."
  } catch (error) {
    console.error("Error al copiar JSON:", error)
    errorMessage.value = "No se pudo copiar el JSON."
  }
}
</script>

<style scoped>
.section-kicker {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--liga-accent, rgb(59 130 246));
}

.field {
  display: grid;
  gap: 8px;
}

.field-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--liga-accent, rgb(59 130 246));
}

.field-input {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.045);
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 750;
  color: white;
  outline: none;
}

.field-input::placeholder {
  color: rgb(148 163 184);
}

.field-input:focus {
  border-color: var(--liga-accent-ring, rgb(59 130 246 / 0.55));
  box-shadow: 0 0 0 3px var(--liga-accent-soft, rgb(59 130 246 / 0.14));
}

select.field-input {
  appearance: none;
}

.check-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(11 18 34);
  padding: 14px;
  border-radius: 18px;
}

.check-input {
  margin-top: 4px;
  height: 16px;
  width: 16px;
  accent-color: var(--liga-accent, rgb(59 130 246));
}

.check-title {
  display: block;
  font-size: 14px;
  font-weight: 900;
  color: white;
}

.check-help {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.55;
  color: rgb(148 163 184);
}

.small-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--liga-accent, rgb(37 99 235));
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 900;
  color: white;
  box-shadow: 0 10px 24px rgb(37 99 235 / 0.22);
  transition: filter 0.18s ease, opacity 0.18s ease;
}

.small-primary-btn:hover {
  filter: brightness(1.08);
}

.small-primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.small-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 900;
  color: rgb(226 232 240);
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.small-secondary-btn:hover {
  border-color: var(--liga-accent-ring, rgb(59 130 246 / 0.35));
  background: var(--liga-accent-soft, rgb(59 130 246 / 0.1));
  color: white;
}

.small-danger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgb(251 113 133 / 0.25);
  background: rgb(244 63 94 / 0.1);
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 900;
  color: rgb(255 228 230);
  transition: background 0.18s ease, opacity 0.18s ease;
}

.small-danger-btn:hover {
  background: rgb(244 63 94 / 0.16);
}

.small-danger-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.chip-btn {
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  padding: 8px 13px;
  font-size: 12px;
  font-weight: 900;
  color: rgb(226 232 240);
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.chip-btn:hover {
  border-color: var(--liga-accent-ring, rgb(59 130 246 / 0.35));
  background: var(--liga-accent-soft, rgb(59 130 246 / 0.1));
  color: white;
}

.category-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: #0b1222;
  padding: 12px 16px;
  text-align: left;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.category-row:hover,
.category-row--active {
  border-color: var(--liga-accent-ring, rgb(59 130 246 / 0.35));
  background: var(--liga-accent-soft, rgb(59 130 246 / 0.1));
}

.success-msg {
  margin-top: 16px;
  border-radius: 18px;
  border: 1px solid rgb(52 211 153 / 0.25);
  background: rgb(16 185 129 / 0.1);
  padding: 12px 14px;
  font-size: 14px;
  color: rgb(209 250 229);
}

.error-msg {
  margin-top: 16px;
  border-radius: 18px;
  border: 1px solid rgb(251 113 133 / 0.25);
  background: rgb(244 63 94 / 0.1);
  padding: 12px 14px;
  font-size: 14px;
  color: rgb(255 228 230);
}
</style>