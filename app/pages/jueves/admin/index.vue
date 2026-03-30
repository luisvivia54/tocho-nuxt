<template>
  <main class="min-h-screen bg-[#020617] text-slate-100">
    <JuevesHeader />

    <!-- Topbar interna -->
    <header class="sticky top-20 z-30 border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-orange-300/80">Liga de Jueves · Admin</p>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white truncate">
              Editar página de inicio
            </h1>
            <p class="mt-1 text-sm text-slate-400">
              Cambia el home real de jueves: hero, botones, patrocinadores, galería y sede.
            </p>
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              class="btn-ghost"
              @click="resetDefaults()"
              :disabled="loading || saving || uploading || !canEdit"
            >
              Restaurar
            </button>

            <button
              type="button"
              class="btn-primary"
              :disabled="saving || loading || uploading || !canEdit"
              @click="save()"
            >
              <span v-if="saving">Guardando…</span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 font-semibold"
            :class="dirty ? 'bg-amber-500/15 text-amber-200 border border-amber-400/20' : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20'"
          >
            {{ dirty ? 'Cambios sin guardar' : 'Todo guardado' }}
          </span>

          <span v-if="loading" class="text-slate-400">· Cargando…</span>
          <span v-else-if="uploading" class="text-slate-400">· Subiendo imagen…</span>
          <span v-else-if="statusMsg" class="text-slate-400">· {{ statusMsg }}</span>
        </div>
      </div>
    </header>

    <section class="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <!-- GATES -->
      <div v-if="!kcReady" class="gate-box">
        <p class="text-sm font-semibold text-white">Inicializando sesión…</p>
        <p class="mt-1 text-xs text-slate-400">Espera a que Keycloak esté listo.</p>
      </div>

      <div v-else-if="!isAuthenticated" class="gate-box">
        <p class="text-sm font-semibold text-white">Inicia sesión para editar</p>
        <p class="mt-1 text-xs text-slate-400">Necesitas autenticarte como admin.</p>

        <button type="button" class="btn-primary mt-3" @click="login()">
          Iniciar sesión
        </button>
      </div>

      <div v-else-if="!isAdmin" class="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 shadow-sm">
        <p class="text-sm font-semibold text-rose-200">Acceso denegado</p>
        <p class="mt-1 text-xs text-rose-100/80">Tu usuario no tiene rol <b>admin</b>.</p>
      </div>

      <!-- UI -->
      <div v-else class="grid lg:grid-cols-2 gap-5">
        <!-- FORM -->
        <div class="space-y-5">
          <!-- HERO -->
          <section class="card">
            <div class="card-h">
              <p class="step">1 · Hero principal</p>
              <h2 class="h2">Texto grande + fondo + botones</h2>
              <p class="p">Esto controla la primera sección que aparece en la portada de jueves.</p>
            </div>

            <div class="card-b space-y-4">
              <div class="grid gap-3">
                <div>
                  <label class="lbl">Badge superior</label>
                  <input
                    v-model="model.hero.badge"
                    class="in"
                    type="text"
                    placeholder="LIGA DE JUEVES · DESARROLLO"
                  />
                </div>

                <div class="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label class="lbl">Título línea 1</label>
                    <input
                      v-model="model.hero.titleLine1"
                      class="in"
                      type="text"
                      placeholder="Toda la liga al"
                    />
                  </div>

                  <div>
                    <label class="lbl">Título línea 2</label>
                    <input
                      v-model="model.hero.titleLine2"
                      class="in"
                      type="text"
                      placeholder="alcance de tu mano"
                    />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label class="lbl">Texto patrocinio</label>
                    <input
                      v-model="model.hero.sponsorPrefix"
                      class="in"
                      type="text"
                      placeholder="Patrocinado por"
                    />
                  </div>

                  <div>
                    <label class="lbl">Nombre patrocinador</label>
                    <input
                      v-model="model.hero.sponsorName"
                      class="in"
                      type="text"
                      placeholder="Dicass"
                    />
                  </div>
                </div>

                <div>
                  <label class="lbl">Imagen de fondo del hero</label>
                  <div class="grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <input
                      v-model="model.hero.backgroundImage"
                      class="in"
                      type="text"
                      placeholder="/img/hero-stadium.jpg o URL https://..."
                    />
                    <button
                      class="btn-ghost"
                      :disabled="uploading || !canEdit"
                      @click="pickHeroBg()"
                    >
                      {{ uploading ? 'Subiendo…' : 'Elegir archivo' }}
                    </button>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="grid sm:grid-cols-2 gap-3">
                  <div class="row">
                    <p class="text-xs font-extrabold text-white mb-3">Botón primario</p>
                    <div class="space-y-3">
                      <div>
                        <label class="lbl">Texto</label>
                        <input
                          v-model="model.hero.primaryButton.label"
                          class="in"
                          type="text"
                          placeholder="VER PARTIDOS"
                        />
                      </div>
                      <div>
                        <label class="lbl">Ruta</label>
                        <input
                          v-model="model.hero.primaryButton.to"
                          class="in"
                          type="text"
                          placeholder="/jueves/partidos"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <p class="text-xs font-extrabold text-white mb-3">Botón secundario</p>
                    <div class="space-y-3">
                      <div>
                        <label class="lbl">Texto</label>
                        <input
                          v-model="model.hero.secondaryButton.label"
                          class="in"
                          type="text"
                          placeholder="VER EQUIPOS"
                        />
                      </div>
                      <div>
                        <label class="lbl">Ruta</label>
                        <input
                          v-model="model.hero.secondaryButton.to"
                          class="in"
                          type="text"
                          placeholder="/jueves/equipos"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SPONSORS -->
          <section class="card">
            <div class="card-h">
              <p class="step">2 · Patrocinadores</p>
              <h2 class="h2">Logos del home</h2>
              <p class="p">Esta sección controla los logos visibles en la portada.</p>
            </div>

            <div class="card-b space-y-4">
              <div>
                <label class="lbl">Título de sección</label>
                <input
                  v-model="model.sponsors.title"
                  class="in"
                  type="text"
                  placeholder="PATROCINADORES"
                />
              </div>

              <div class="flex items-center justify-between gap-3 flex-wrap">
                <p class="font-extrabold text-white">Lista</p>
                <button type="button" class="btn-ghost" @click="addSponsor()">+ Agregar</button>
              </div>

              <div class="space-y-3">
                <div v-for="(sp, i) in model.sponsors.items" :key="sp.id" class="row">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-white">Patrocinador {{ i + 1 }}</p>
                      <p class="text-[11px] text-slate-400 truncate">{{ sp.name || 'Sin nombre' }}</p>
                    </div>

                    <div class="flex gap-1.5 shrink-0">
                      <button class="icon" :disabled="i === 0" @click="moveSponsor(i, -1)" title="Subir">↑</button>
                      <button class="icon" :disabled="i === model.sponsors.items.length - 1" @click="moveSponsor(i, +1)" title="Bajar">↓</button>
                      <button class="icon danger" @click="removeSponsor(i)" title="Eliminar">✕</button>
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-2 gap-2">
                    <div>
                      <label class="lbl">Nombre</label>
                      <input v-model="sp.name" class="in" type="text" placeholder="Under Armour" />
                    </div>

                    <div>
                      <label class="lbl">Link</label>
                      <input v-model="sp.url" class="in" type="text" placeholder="https://..." />
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <div>
                      <label class="lbl">Logo</label>
                      <input v-model="sp.logo" class="in" type="text" placeholder="/img/sponsors/logo.png o URL https://..." />
                    </div>
                    <button class="btn-ghost" :disabled="uploading || !canEdit" @click="pickSponsorLogo(i)">
                      {{ uploading ? 'Subiendo…' : 'Elegir archivo' }}
                    </button>
                  </div>
                </div>

                <div v-if="model.sponsors.items.length === 0" class="empty">
                  No hay patrocinadores. Agrega uno con “+ Agregar”.
                </div>
              </div>
            </div>
          </section>

          <!-- GALERIA -->
          <section class="card">
            <div class="card-h">
              <p class="step">3 · Fotos del torneo</p>
              <h2 class="h2">Galería del home</h2>
              <p class="p">Aquí administras el carrusel/galería de fotos de jueves.</p>
            </div>

            <div class="card-b space-y-4">
              <div>
                <label class="lbl">Título de sección</label>
                <input
                  v-model="model.gallery.title"
                  class="in"
                  type="text"
                  placeholder="FOTOS DEL TORNEO"
                />
              </div>

              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p class="font-extrabold text-white">Imágenes</p>
                  <p class="text-xs text-slate-400">Máximo 8. Puedes reordenar.</p>
                </div>

                <button
                  type="button"
                  class="btn-ghost"
                  @click="addGalleryImage()"
                  :disabled="model.gallery.images.length >= 8"
                >
                  + Agregar
                </button>
              </div>

              <div class="space-y-3">
                <div v-for="(img, i) in model.gallery.images" :key="img.id" class="row">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-white">Imagen {{ i + 1 }}</p>
                      <p class="text-[11px] text-slate-400 truncate">{{ img.src || 'Sin URL' }}</p>
                    </div>

                    <div class="flex gap-1.5 shrink-0">
                      <button class="icon" :disabled="i === 0" @click="moveGalleryImage(i, -1)" title="Subir">↑</button>
                      <button class="icon" :disabled="i === model.gallery.images.length - 1" @click="moveGalleryImage(i, +1)" title="Bajar">↓</button>
                      <button class="icon danger" @click="removeGalleryImage(i)" title="Eliminar">✕</button>
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <input
                      v-model="img.src"
                      class="in"
                      type="text"
                      placeholder="/img/carrusel1.jpg o URL https://..."
                    />
                    <button class="btn-ghost" :disabled="uploading || !canEdit" @click="pickGalleryImage(i)">
                      {{ uploading ? 'Subiendo…' : 'Elegir archivo' }}
                    </button>
                  </div>
                </div>

                <div v-if="model.gallery.images.length === 0" class="empty">
                  No hay imágenes en la galería. Usa “+ Agregar”.
                </div>
              </div>
            </div>
          </section>

          <!-- SEDE -->
          <section class="card">
            <div class="card-h">
              <p class="step">4 · Sede / mapa</p>
              <h2 class="h2">Ubicación del torneo</h2>
              <p class="p">Controla el bloque del mapa y el enlace a Google Maps.</p>
            </div>

            <div class="card-b space-y-3">
              <div>
                <label class="lbl">Título</label>
                <input
                  v-model="model.venue.title"
                  class="in"
                  type="text"
                  placeholder="Sede del Torneo"
                />
              </div>

              <div>
                <label class="lbl">Subtítulo</label>
                <input
                  v-model="model.venue.subtitle"
                  class="in"
                  type="text"
                  placeholder="Encuentra la ubicación del torneo aquí"
                />
              </div>

              <div>
                <label class="lbl">Google Maps Embed URL</label>
                <textarea
                  v-model="model.venue.embedUrl"
                  class="in"
                  rows="3"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>

              <div>
                <label class="lbl">Google Maps URL</label>
                <input
                  v-model="model.venue.mapsUrl"
                  class="in"
                  type="text"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>

              <div>
                <label class="lbl">Texto del enlace</label>
                <input
                  v-model="model.venue.mapsLabel"
                  class="in"
                  type="text"
                  placeholder="📍 ABRIR EN GOOGLE MAPS"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- PREVIEW -->
        <aside class="space-y-5">
          <section class="card">
            <div class="card-h">
              <p class="step">Vista previa</p>
              <h2 class="h2">Referencia rápida</h2>
              <p class="p">Solo para validar cambios visuales del home de jueves.</p>
            </div>

            <div class="card-b space-y-4">
              <!-- HERO PREVIEW -->
              <div class="overflow-hidden rounded-2xl border border-white/10 bg-[#081122]">
                <div class="relative aspect-[16/9] bg-slate-950">
                  <img
                    v-if="heroBackgroundPreview"
                    :src="heroBackgroundPreview"
                    class="h-full w-full object-cover opacity-70"
                    alt="Hero preview"
                  />
                  <div class="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/40 to-slate-950/80"></div>

                  <div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <p class="rounded-full border border-orange-400/25 bg-slate-950/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-100">
                      {{ model.hero.badge || '—' }}
                    </p>

                    <p class="mt-4 text-2xl font-extrabold text-white">
                      {{ model.hero.titleLine1 || '—' }}
                    </p>

                    <p class="text-3xl font-black text-orange-400">
                      {{ model.hero.titleLine2 || '—' }}
                    </p>

                    <p class="mt-3 text-sm text-slate-300">
                      {{ model.hero.sponsorPrefix || '—' }}
                      <span class="font-extrabold text-orange-300">{{ model.hero.sponsorName || '—' }}</span>
                    </p>

                    <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span class="rounded-xl bg-orange-400 px-3 py-2 text-[11px] font-extrabold text-[#1a1207]">
                        {{ model.hero.primaryButton.label || '—' }}
                      </span>
                      <span class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-extrabold text-white">
                        {{ model.hero.secondaryButton.label || '—' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SPONSORS PREVIEW -->
              <div class="rounded-2xl border border-white/10 bg-[#081122] p-4">
                <p class="font-extrabold text-white">{{ model.sponsors.title || 'PATROCINADORES' }}</p>
                <div class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    v-for="sp in model.sponsors.items.slice(0, 6)"
                    :key="sp.id"
                    class="rounded-2xl border border-white/10 bg-[#0b152a] p-3 grid place-items-center"
                  >
                    <img v-if="sp.logo" :src="sp.logo" class="h-10 w-24 object-contain" :alt="sp.name" />
                    <span v-else class="text-[11px] text-slate-500">Logo</span>
                  </div>
                </div>
              </div>

              <!-- GALLERY PREVIEW -->
              <div class="rounded-2xl border border-white/10 bg-[#081122] p-4">
                <p class="font-extrabold text-white">{{ model.gallery.title || 'FOTOS DEL TORNEO' }}</p>
                <div class="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 aspect-[16/9]">
                  <img
                    v-if="galleryPreviewSrc"
                    :src="galleryPreviewSrc"
                    class="h-full w-full object-cover"
                    alt="Gallery preview"
                  />
                  <div v-else class="grid h-full w-full place-items-center text-sm text-slate-500">
                    Sin imagen
                  </div>
                </div>
              </div>

              <!-- VENUE PREVIEW -->
              <div class="rounded-2xl border border-white/10 bg-[#081122] p-4">
                <p class="font-extrabold text-white">{{ model.venue.title || 'Sede del Torneo' }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ model.venue.subtitle || '—' }}</p>
                <p class="mt-3 text-xs text-slate-500 break-all">{{ model.venue.mapsUrl || '—' }}</p>
                <p class="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-300">
                  {{ model.venue.mapsLabel || '—' }}
                </p>
              </div>
            </div>
          </section>

          <div class="rounded-2xl border border-white/10 bg-[#081122] p-4 text-sm text-slate-300">
            <p class="font-extrabold text-white">Uso rápido</p>
            <ol class="mt-2 list-decimal list-inside space-y-1">
              <li>Edita los campos del home de jueves.</li>
              <li>Sube imágenes si aplica.</li>
              <li>Da click en <span class="font-semibold">Guardar</span>.</li>
              <li>Después conecta <span class="font-semibold">/jueves/index.vue</span> a este mismo endpoint.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { useRuntimeConfig, useNuxtApp, useState } from "#imports"
import { useAuthz } from "~/composables/useAuthz"
import JuevesHeader from "~/components/jueves/JuevesHeader.vue"

/* =========================
   AUTH
========================= */
const nuxtApp = useNuxtApp()
const kcReady = useState<boolean>("kcReady", () => false)
const authz: any = useAuthz()

const isAuthenticated = computed<boolean>(() => {
  const kc = (nuxtApp as any).$kc
  return !!kc?.authenticated
})

const isAdmin = computed<boolean>(() => {
  const v = authz?.isAdmin
  if (typeof v === "boolean") return v
  if (v && typeof v === "object" && "value" in v) return !!v.value

  const kc = (nuxtApp as any).$kc
  const roles: string[] =
    kc?.tokenParsed?.realm_access?.roles ||
    kc?.tokenParsed?.resource_access?.["nuxt-app"]?.roles ||
    []

  return roles.map((r) => String(r).toLowerCase()).includes("admin")
})

const canEdit = computed(() => kcReady.value && isAuthenticated.value && isAdmin.value)

function login() {
  const kc = (nuxtApp as any).$kc
  if (!kc?.login) return
  kc.login({ redirectUri: window.location.href })
}

/* =========================
   API
========================= */
const runtime = useRuntimeConfig()

function normalizeApiBase(v: string) {
  const s = String(v || "").trim().replace(/\/+$/, "")
  if (!s) return "https://tocho5-api.tochero5.mx/api"
  return s.endsWith("/api") ? s : `${s}/api`
}

const API_BASE = normalizeApiBase(((runtime.public as any)?.apiBase as string) || "https://tocho5-api.tochero5.mx")
const ENDPOINT = `${API_BASE}/site-configs/jueves-home`
const ASSET_UPLOAD_ENDPOINT = `${API_BASE}/assets/upload`

function getBearer(): string | null {
  const kc = (nuxtApp as any).$kc
  const token = kc?.token
  return typeof token === "string" && token.length ? token : null
}

async function requestJson(
  url: string,
  options: RequestInit = {},
  { auth = "auto" as "auto" | "required" | "none" } = {}
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getBearer()

  if (auth === "required" && !token) {
    throw new Error("No hay sesión. Inicia sesión como admin.")
  }

  if (auth !== "none" && token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  })

  const text = await res.text()
  let json: any = null

  try {
    json = text ? JSON.parse(text) : null
  } catch {}

  if (!res.ok) {
    const msg =
      json && (json.message || json.error)
        ? json.message || json.error
        : `${res.status} ${res.statusText}`

    const err = new Error(msg) as any
    err.status = res.status
    throw err
  }

  return json
}

function safeSegment(x: string) {
  return String(x || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

async function uploadAsset(folder: string, file: File) {
  const token = getBearer()
  if (!token) throw new Error("No hay sesión. Inicia sesión como admin.")

  const fd = new FormData()
  fd.append("folder", folder)
  fd.append("file", file)

  const res = await fetch(ASSET_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })

  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {}

  if (!res.ok) {
    const msg =
      json && (json.message || json.error)
        ? json.message || json.error
        : `${res.status} ${res.statusText}`

    const err = new Error(msg) as any
    err.status = res.status
    throw err
  }

  return json
}

/* =========================
   Types + Model
========================= */
type HeroButton = {
  label: string
  to: string
}

type SponsorItem = {
  id: string
  name: string
  logo: string
  url: string
}

type GalleryImage = {
  id: string
  src: string
}

type JuevesHomeConfig = {
  hero: {
    badge: string
    titleLine1: string
    titleLine2: string
    sponsorPrefix: string
    sponsorName: string
    backgroundImage: string
    primaryButton: HeroButton
    secondaryButton: HeroButton
  }
  sponsors: {
    title: string
    items: SponsorItem[]
  }
  gallery: {
    title: string
    images: GalleryImage[]
  }
  venue: {
    title: string
    subtitle: string
    embedUrl: string
    mapsUrl: string
    mapsLabel: string
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

const DEFAULTS: JuevesHomeConfig = {
  hero: {
    badge: "LIGA DE JUEVES · DESARROLLO",
    titleLine1: "Toda la liga al",
    titleLine2: "alcance de tu mano",
    sponsorPrefix: "Patrocinado por",
    sponsorName: "Dicass",
    backgroundImage: "/img/hero-stadium.jpg",
    primaryButton: {
      label: "VER PARTIDOS",
      to: "/jueves/partidos",
    },
    secondaryButton: {
      label: "VER EQUIPOS",
      to: "/jueves/equipos",
    },
  },
  sponsors: {
    title: "PATROCINADORES",
    items: [
      {
        id: "dicass",
        name: "Dicass",
        logo: "/img/sponsors/dicass-logo.png",
        url: "https://dicass.com.mx/",
      },
      {
        id: "blitzflag",
        name: "BlitzFlag",
        logo: "/img/sponsors/blitzflag-logo.png",
        url: "",
      },
      {
        id: "under-armour",
        name: "Under Armour",
        logo: "/img/sponsors/underarmour-logo.png",
        url: "https://www.underarmour.com.mx/",
      },
      {
        id: "medimex",
        name: "Fundación Medimex",
        logo: "/img/sponsors/medimex-logo.png",
        url: "",
      },
    ],
  },
  gallery: {
    title: "FOTOS DEL TORNEO",
    images: [
      { id: "gal-1", src: "/img/carrusel1.jpg" },
      { id: "gal-2", src: "/img/carrusel2.jpg" },
      { id: "gal-3", src: "/img/carrusel3.jpg" },
    ],
  },
  venue: {
    title: "Sede del Torneo",
    subtitle: "Encuentra la ubicación del torneo aquí",
    embedUrl: "",
    mapsUrl: "https://maps.app.goo.gl/zKNYRashoqHAMJwP9",
    mapsLabel: "📍 ABRIR EN GOOGLE MAPS",
  },
}

const model = reactive<JuevesHomeConfig>(clone(DEFAULTS))

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const statusMsg = ref("")

const lastSavedSnapshot = ref("")
const dirty = computed(() => JSON.stringify(model) !== lastSavedSnapshot.value)

function safeApplyParsed(parsed: any): JuevesHomeConfig {
  const merged: JuevesHomeConfig = clone(DEFAULTS)

  if (parsed && typeof parsed === "object") {
    const raw = parsed.data && typeof parsed.data === "object" ? parsed.data : parsed

    if (raw.hero && typeof raw.hero === "object") {
      merged.hero.badge = String(raw.hero.badge ?? merged.hero.badge)
      merged.hero.titleLine1 = String(raw.hero.titleLine1 ?? raw.hero.title ?? merged.hero.titleLine1)
      merged.hero.titleLine2 = String(raw.hero.titleLine2 ?? raw.hero.subtitle ?? merged.hero.titleLine2)
      merged.hero.sponsorPrefix = String(raw.hero.sponsorPrefix ?? merged.hero.sponsorPrefix)
      merged.hero.sponsorName = String(raw.hero.sponsorName ?? merged.hero.sponsorName)
      merged.hero.backgroundImage = String(
        raw.hero.backgroundImage ??
          raw.hero.image ??
          raw.hero.images?.[0]?.src ??
          merged.hero.backgroundImage
      )

      if (raw.hero.primaryButton && typeof raw.hero.primaryButton === "object") {
        merged.hero.primaryButton.label = String(raw.hero.primaryButton.label ?? merged.hero.primaryButton.label)
        merged.hero.primaryButton.to = String(raw.hero.primaryButton.to ?? merged.hero.primaryButton.to)
      }

      if (raw.hero.secondaryButton && typeof raw.hero.secondaryButton === "object") {
        merged.hero.secondaryButton.label = String(raw.hero.secondaryButton.label ?? merged.hero.secondaryButton.label)
        merged.hero.secondaryButton.to = String(raw.hero.secondaryButton.to ?? merged.hero.secondaryButton.to)
      }
    }

    if (raw.sponsors && typeof raw.sponsors === "object" && !Array.isArray(raw.sponsors)) {
      merged.sponsors.title = String(raw.sponsors.title ?? merged.sponsors.title)

      if (Array.isArray(raw.sponsors.items)) {
        merged.sponsors.items = raw.sponsors.items
          .filter((x: any) => x && typeof x === "object")
          .map((x: any) => ({
            id: String(x.id ?? uid("sp")),
            name: String(x.name ?? ""),
            logo: String(x.logo ?? ""),
            url: String(x.url ?? ""),
          }))
      }
    } else if (Array.isArray(raw.sponsors)) {
      merged.sponsors.items = raw.sponsors
        .filter((x: any) => x && typeof x === "object")
        .map((x: any) => ({
          id: String(x.id ?? uid("sp")),
          name: String(x.name ?? ""),
          logo: String(x.logo ?? ""),
          url: String(x.url ?? ""),
        }))
    }

    if (raw.gallery && typeof raw.gallery === "object") {
      merged.gallery.title = String(raw.gallery.title ?? merged.gallery.title)

      if (Array.isArray(raw.gallery.images)) {
        merged.gallery.images = raw.gallery.images
          .filter((x: any) => x && typeof x === "object")
          .map((x: any) => ({
            id: String(x.id ?? uid("gal")),
            src: String(x.src ?? ""),
          }))
      }
    }

    if (raw.venue && typeof raw.venue === "object") {
      merged.venue.title = String(raw.venue.title ?? merged.venue.title)
      merged.venue.subtitle = String(raw.venue.subtitle ?? merged.venue.subtitle)
      merged.venue.embedUrl = String(raw.venue.embedUrl ?? merged.venue.embedUrl)
      merged.venue.mapsUrl = String(raw.venue.mapsUrl ?? merged.venue.mapsUrl)
      merged.venue.mapsLabel = String(raw.venue.mapsLabel ?? merged.venue.mapsLabel)
    } else if (raw.location && typeof raw.location === "object") {
      merged.venue.mapsUrl = String(raw.location.mapsUrl ?? merged.venue.mapsUrl)
    }
  }

  if (!Array.isArray(merged.sponsors.items)) merged.sponsors.items = []
  if (!Array.isArray(merged.gallery.images)) merged.gallery.images = []

  return merged
}

/* Load / Save */
async function loadFromServer() {
  if (!import.meta.client) return

  loading.value = true
  statusMsg.value = ""

  try {
    const res = await requestJson(ENDPOINT, { method: "GET" }, { auth: "auto" })
    const merged = safeApplyParsed(res)
    Object.assign(model, merged)
    lastSavedSnapshot.value = JSON.stringify(model)
    statusMsg.value = "Cargado del servidor"
  } catch (e: any) {
    const st = e?.status

    Object.assign(model, clone(DEFAULTS))
    lastSavedSnapshot.value = JSON.stringify(model)

    if (st === 404) {
      statusMsg.value = "No había configuración guardada. Usando valores por defecto."
    } else if (st === 401 || st === 403) {
      statusMsg.value = "Necesitas iniciar sesión como admin para cargar."
    } else {
      statusMsg.value = `No se pudo cargar: ${e?.message || "error"}`
    }
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!import.meta.client) return

  saving.value = true
  statusMsg.value = ""

  try {
    const payload = { schemaVersion: 1, data: clone(model) }

    const res = await requestJson(
      ENDPOINT,
      { method: "PUT", body: JSON.stringify(payload) },
      { auth: "required" }
    )

    const merged = safeApplyParsed(res)
    Object.assign(model, merged)
    lastSavedSnapshot.value = JSON.stringify(model)
    statusMsg.value = "Guardado en servidor"
  } catch (e: any) {
    const st = e?.status
    if (st === 401 || st === 403) {
      statusMsg.value = "No autorizado. Inicia sesión como admin."
    } else if (st === 404) {
      statusMsg.value = "El backend no tiene disponible /site-configs/jueves-home."
    } else {
      statusMsg.value = `No se pudo guardar: ${e?.message || "error"}`
    }
  } finally {
    saving.value = false
  }
}

function resetDefaults() {
  Object.assign(model, clone(DEFAULTS))
  statusMsg.value = "Restaurado (no olvides guardar)"
}

/* HERO BG */
function pickHeroBg() {
  pickTarget.value = { kind: "heroBg" }
  fileInput.value?.click()
}

/* SPONSORS */
function addSponsor() {
  model.sponsors.items.push({
    id: uid("sp"),
    name: "",
    logo: "",
    url: "",
  })
}

function removeSponsor(i: number) {
  model.sponsors.items.splice(i, 1)
}

function moveSponsor(i: number, dir: -1 | 1) {
  const j = i + dir
  const arr = model.sponsors.items
  if (j < 0 || j >= arr.length) return
  const a = arr[i]
  const b = arr[j]
  if (!a || !b) return
  arr[i] = b
  arr[j] = a
}

function pickSponsorLogo(index: number) {
  pickTarget.value = { kind: "sponsor", index }
  fileInput.value?.click()
}

/* GALLERY */
function addGalleryImage() {
  if (model.gallery.images.length >= 8) return
  model.gallery.images.push({ id: uid("gal"), src: "" })
}

function removeGalleryImage(i: number) {
  model.gallery.images.splice(i, 1)
}

function moveGalleryImage(i: number, dir: -1 | 1) {
  const j = i + dir
  const arr = model.gallery.images
  if (j < 0 || j >= arr.length) return
  const a = arr[i]
  const b = arr[j]
  if (!a || !b) return
  arr[i] = b
  arr[j] = a
}

function pickGalleryImage(index: number) {
  pickTarget.value = { kind: "gallery", index }
  fileInput.value?.click()
}

/* PREVIEW */
const heroBackgroundPreview = computed(() => model.hero.backgroundImage || "")
const galleryPreviewSrc = computed(() => model.gallery.images[0]?.src || "")

/* FILE PICKER + UPLOAD */
type PickTarget =
  | { kind: "heroBg" }
  | { kind: "sponsor"; index: number }
  | { kind: "gallery"; index: number }
  | null

const fileInput = ref<HTMLInputElement | null>(null)
const pickTarget = ref<PickTarget>(null)

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""

  if (!file || !pickTarget.value) return

  if (!canEdit.value) {
    statusMsg.value = "No autorizado. Inicia sesión como admin."
    pickTarget.value = null
    return
  }

  const target = pickTarget.value
  pickTarget.value = null

  const previewUrl = URL.createObjectURL(file)
  let prev = ""

  if (target.kind === "heroBg") {
    prev = model.hero.backgroundImage || ""
    model.hero.backgroundImage = previewUrl
  } else if (target.kind === "sponsor") {
    const sp = model.sponsors.items[target.index]
    if (!sp) return
    prev = sp.logo || ""
    sp.logo = previewUrl
  } else if (target.kind === "gallery") {
    const img = model.gallery.images[target.index]
    if (!img) return
    prev = img.src || ""
    img.src = previewUrl
  }

  uploading.value = true
  statusMsg.value = "Subiendo imagen a R2…"

  try {
    let folder = "site/jueves/home"

    if (target.kind === "heroBg") {
      folder = "site/jueves/home/hero"
    } else if (target.kind === "sponsor") {
      const sp = model.sponsors.items[target.index]
      const seg = safeSegment(sp?.id || `sponsor-${target.index}`)
      folder = `site/jueves/home/sponsors/${seg}`
    } else if (target.kind === "gallery") {
      folder = "site/jueves/home/gallery"
    }

    const res = await uploadAsset(folder, file)
    const publicUrl = String(res?.publicUrl || "")
    if (!publicUrl) throw new Error("La API no regresó publicUrl")

    if (target.kind === "heroBg") {
      model.hero.backgroundImage = publicUrl
    } else if (target.kind === "sponsor") {
      const sp = model.sponsors.items[target.index]
      if (sp) sp.logo = publicUrl
    } else if (target.kind === "gallery") {
      const img = model.gallery.images[target.index]
      if (img) img.src = publicUrl
    }

    statusMsg.value = "Imagen subida ✅ (ahora da click en Guardar)"
  } catch (err: any) {
    if (target.kind === "heroBg") {
      model.hero.backgroundImage = prev
    } else if (target.kind === "sponsor") {
      const sp = model.sponsors.items[target.index]
      if (sp) sp.logo = prev
    } else if (target.kind === "gallery") {
      const img = model.gallery.images[target.index]
      if (img) img.src = prev
    }

    const st = err?.status
    if (st === 401 || st === 403) {
      statusMsg.value = "No autorizado para subir (admin)."
    } else {
      statusMsg.value = `Falló la subida: ${err?.message || "error"}`
    }
  } finally {
    uploading.value = false
    try {
      URL.revokeObjectURL(previewUrl)
    } catch {}
  }
}

onMounted(async () => {
  await loadFromServer()
})
</script>

<style scoped>
.gate-box {
  border: 1px solid rgba(255,255,255,0.1);
  background: #081122;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 18px rgba(0,0,0,0.18);
}

.card {
  background: #081122;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.card-h {
  padding: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: #0b152a;
}

.card-b {
  padding: 14px;
}

.step {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(251, 191, 36);
  font-weight: 800;
}

.h2 {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 900;
  color: white;
}

.p {
  margin-top: 6px;
  font-size: 13px;
  color: rgb(148, 163, 184);
}

.lbl {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgb(148, 163, 184);
  font-weight: 800;
}

.in {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: #020617;
  color: white;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.in:focus {
  border-color: rgba(249, 115, 22, 0.75);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
}

.row {
  border: 1px solid rgba(255,255,255,0.08);
  background: #0b152a;
  border-radius: 16px;
  padding: 12px;
}

.btn-primary {
  border-radius: 12px;
  background: linear-gradient(90deg, rgb(249,115,22), rgb(251,146,60));
  color: white;
  font-weight: 900;
  font-size: 12px;
  padding: 10px 14px;
  border: 1px solid rgba(249,115,22,0.6);
}

.btn-primary:hover {
  filter: brightness(1.08);
}

.btn-primary:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.btn-ghost {
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: rgb(226,232,240);
  font-weight: 900;
  font-size: 12px;
  padding: 10px 12px;
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.06);
}

.btn-ghost:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: white;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon:hover {
  background: rgba(255,255,255,0.08);
}

.icon:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.icon.danger {
  border-color: rgba(251,113,133,0.25);
  background: rgba(244,63,94,0.12);
  color: rgb(254,205,211);
}

.icon.danger:hover {
  background: rgba(244,63,94,0.18);
}

.empty {
  border: 1px dashed rgba(255,255,255,0.14);
  border-radius: 16px;
  padding: 14px;
  color: rgb(148, 163, 184);
  background: rgba(255,255,255,0.03);
  font-size: 13px;
}
</style>
