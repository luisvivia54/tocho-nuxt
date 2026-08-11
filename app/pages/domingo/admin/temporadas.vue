<template>
  <div class="min-h-screen bg-[#050816] text-slate-100">
    <main class="px-4 pb-36 pt-6 sm:px-6 lg:px-8 lg:pb-14">
      <section class="mx-auto max-w-md">
        <div class="rounded-[24px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] sm:p-8">
          <div class="flex items-center justify-between gap-3">
            <p class="section-kicker">Liga Dominical</p>
            <NuxtLink to="/domingo/admin" class="back-link">Volver</NuxtLink>
          </div>

          <h1 class="mt-2 text-2xl font-black tracking-tight text-white">
            Nueva temporada
          </h1>
          <p class="mt-2 text-sm leading-6 text-slate-400">
            Arranca la siguiente temporada. Los equipos y su tabla se mueven automáticamente.
          </p>

          <form class="mt-6 grid gap-4" @submit.prevent="rollover">
            <label class="field">
              <span class="field-label">Nombre de la temporada *</span>
              <input
                v-model="name"
                class="field-input"
                placeholder="Apertura 2026"
                :disabled="loading"
                required
              >
            </label>

            <button type="submit" class="primary-btn" :disabled="loading">
              {{ loading ? "Creando..." : "Crear temporada" }}
            </button>
          </form>

          <div v-if="result" class="result-card">
            <p class="result-title">Temporada creada ✓</p>
            <p class="result-line">Equipos movidos: <strong>{{ result.equiposMovidos }}</strong></p>
            <p class="result-line">Tablas creadas: <strong>{{ result.standingsCreados }}</strong></p>
            <p v-if="currentSeasonLabel" class="result-line">
              Temporada activa: <strong>{{ currentSeasonLabel }}</strong>
            </p>
          </div>

          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRuntimeConfig } from "#imports"
import { normalizeApiBase } from "~/composables/useApiBase"
import { useAuthedFetch, AuthedFetchError } from "~/composables/useAuthedFetch"

definePageMeta({
  layout: "admin",
  middleware: "admin",
})

const DOMINGO_LEAGUE_ID = 1

type RolloverResponse = {
  newSeasonId: number
  equiposMovidos: number
  standingsCreados: number
}

const config = useRuntimeConfig()
const apiBase = normalizeApiBase((config.public as { apiBase?: string }).apiBase)
const { authedFetch } = useAuthedFetch()

const name = ref("")
const loading = ref(false)
const errorMessage = ref("")
const result = ref<RolloverResponse | null>(null)
const currentSeasonLabel = ref("")

function messageForStatus(status?: number, fallback?: string) {
  if (status === 400) return "Falta el nombre de la temporada."
  if (status === 401) return "Tu sesión expiró. Inicia sesión de nuevo."
  if (status === 403) return "No tienes permisos de administrador."
  return fallback || "No se pudo crear la temporada. Revisa que la liga tenga una temporada activa de origen."
}

async function rollover() {
  errorMessage.value = ""
  result.value = null

  const trimmed = name.value.trim()
  if (!trimmed) {
    errorMessage.value = messageForStatus(400)
    return
  }

  try {
    loading.value = true

    const res = await authedFetch<RolloverResponse>(`${apiBase}/seasons/rollover`, {
      method: "POST",
      body: { leagueId: DOMINGO_LEAGUE_ID, name: trimmed },
    })

    result.value = res
    name.value = ""
    await refreshActiveSeason(res.newSeasonId)
  } catch (error) {
    const status = error instanceof AuthedFetchError ? error.status : undefined
    const apiMsg = error instanceof AuthedFetchError ? error.message : undefined
    errorMessage.value = messageForStatus(status, apiMsg)
  } finally {
    loading.value = false
  }
}

// Tras el rollover, refrescamos la lista de temporadas (fuente del dropdown)
// y mostramos el nombre de la nueva temporada activa. /seasons/current solo
// devuelve { seasonId }, por eso usamos /seasons que sí trae { id, name }.
async function refreshActiveSeason(newSeasonId: number) {
  try {
    const seasons = await authedFetch<Array<{ id: number; name: string }>>(
      `${apiBase}/seasons?leagueId=${DOMINGO_LEAGUE_ID}`,
      { method: "GET" }
    )
    const match = Array.isArray(seasons)
      ? seasons.find((s) => s.id === newSeasonId)
      : null
    currentSeasonLabel.value = match?.name ?? ""
  } catch {
    // La temporada ya quedó creada; refrescar el estado es secundario.
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

.back-link {
  font-size: 12px;
  font-weight: 800;
  color: rgb(148 163 184);
}

.back-link:hover {
  color: white;
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
  border-radius: 14px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.045);
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 700;
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

.field-input:disabled {
  opacity: 0.6;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--liga-accent, rgb(37 99 235));
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 900;
  color: white;
  box-shadow: 0 10px 24px rgb(37 99 235 / 0.22);
  transition: filter 0.18s ease, opacity 0.18s ease;
}

.primary-btn:hover {
  filter: brightness(1.08);
}

.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.result-card {
  margin-top: 20px;
  border-radius: 16px;
  border: 1px solid rgb(52 211 153 / 0.25);
  background: rgb(16 185 129 / 0.1);
  padding: 14px 16px;
}

.result-title {
  font-size: 14px;
  font-weight: 900;
  color: rgb(209 250 229);
}

.result-line {
  margin-top: 4px;
  font-size: 13px;
  color: rgb(209 250 229);
}

.error-msg {
  margin-top: 16px;
  border-radius: 14px;
  border: 1px solid rgb(251 113 133 / 0.25);
  background: rgb(244 63 94 / 0.1);
  padding: 12px 14px;
  font-size: 14px;
  color: rgb(255 228 230);
}
</style>
