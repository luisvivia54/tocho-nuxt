<!-- app/pages/admin/home.vue -->
<template>
  <main class="min-h-screen bg-white text-slate-900">
    <!-- Topbar (blanca, no transparente) -->
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Tochero5 · Admin</p>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 truncate">
              Editar página de inicio
            </h1>
            <p class="mt-1 text-sm text-slate-600">
              Cambia lo esencial: hero, textos y patrocinadores.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn-ghost" @click="resetDefaults()">
              Restaurar
            </button>

            <button type="button" class="btn-primary" :disabled="saving" @click="save()">
              <span v-if="saving">Guardando…</span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 font-semibold"
            :class="dirty ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ dirty ? 'Cambios sin guardar' : 'Todo guardado' }}
          </span>
          <span v-if="statusMsg" class="text-slate-600">· {{ statusMsg }}</span>
        </div>
      </div>
    </header>

    <section class="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <div class="grid lg:grid-cols-2 gap-5">
        <!-- FORM -->
        <div class="space-y-5">
          <!-- HERO -->
          <section class="card">
            <div class="card-h">
              <p class="step">1 · Hero</p>
              <h2 class="h2">Carrusel + texto principal</h2>
              <p class="p">Lo primero que ve la gente.</p>
            </div>

            <div class="card-b space-y-4">
              <div class="grid gap-3">
                <div>
                  <label class="lbl">Título</label>
                  <input v-model="model.hero.title" class="in" type="text" placeholder="Temporada 2026" />
                </div>

                <div>
                  <label class="lbl">Subtítulo</label>
                  <textarea
                    v-model="model.hero.subtitle"
                    class="in"
                    rows="2"
                    placeholder="Resultados, posiciones y registros en un solo lugar."
                  />
                </div>
              </div>

              <div class="divider"></div>

              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p class="font-extrabold text-slate-900">Imágenes del carrusel</p>
                  <p class="text-xs text-slate-600">Máximo 6. Puedes reordenar.</p>
                </div>

                <button
                  type="button"
                  class="btn-ghost"
                  @click="addHeroImage()"
                  :disabled="model.hero.images.length >= 6"
                  title="Máximo 6"
                >
                  + Agregar
                </button>
              </div>

              <div class="space-y-3">
                <div v-for="(img, i) in model.hero.images" :key="img.id" class="row">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-slate-900">Imagen {{ i + 1 }}</p>
                      <p class="text-[11px] text-slate-500 truncate">{{ img.src || 'Sin URL' }}</p>
                    </div>

                    <div class="flex gap-1.5 shrink-0">
                      <button class="icon" :disabled="i === 0" @click="moveHeroImage(i, -1)" title="Subir">↑</button>
                      <button
                        class="icon"
                        :disabled="i === model.hero.images.length - 1"
                        @click="moveHeroImage(i, +1)"
                        title="Bajar"
                      >
                        ↓
                      </button>
                      <button class="icon danger" @click="removeHeroImage(i)" title="Eliminar">✕</button>
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <input
                      v-model="img.src"
                      class="in"
                      type="text"
                      placeholder="/img/carrusel1.jpg o URL https://..."
                    />
                    <button class="btn-ghost" @click="pickFile('hero', i)">Elegir archivo</button>
                  </div>

                  <p class="mt-2 text-[11px] text-slate-500">
                    Tip: si la subes a <span class="font-semibold">/public/img</span>, úsala como
                    <span class="font-semibold">/img/archivo.jpg</span>.
                  </p>
                </div>

                <div v-if="model.hero.images.length === 0" class="empty">
                  No hay imágenes. Usa “+ Agregar”.
                </div>
              </div>
            </div>
          </section>

          <!-- INTRO -->
          <section class="card">
            <div class="card-h">
              <p class="step">2 · Texto</p>
              <h2 class="h2">Texto debajo del hero</h2>
              <p class="p">Frase corta para presentar la liga.</p>
            </div>

            <div class="card-b space-y-3">
              <div>
                <label class="lbl">Título</label>
                <input v-model="model.intro.title" class="in" type="text" placeholder="TOCHERO5LIGA" />
              </div>
              <div>
                <label class="lbl">Subtítulo</label>
                <input v-model="model.intro.subtitle" class="in" type="text" placeholder="ENTÉRATE DE TODO..." />
              </div>
            </div>
          </section>

          <!-- SPONSORS -->
          <section class="card">
            <div class="card-h">
              <p class="step">3 · Patrocinadores</p>
              <h2 class="h2">Logos y links</h2>
              <p class="p">Nombre + logo + link (opcional).</p>
            </div>

            <div class="card-b space-y-4">
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <p class="font-extrabold text-slate-900">Lista</p>
                <button type="button" class="btn-ghost" @click="addSponsor()">+ Agregar</button>
              </div>

              <div class="space-y-3">
                <div v-for="(sp, i) in model.sponsors" :key="sp.id" class="row">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-slate-900">Patrocinador {{ i + 1 }}</p>
                      <p class="text-[11px] text-slate-500 truncate">{{ sp.name || 'Sin nombre' }}</p>
                    </div>

                    <div class="flex gap-1.5 shrink-0">
                      <button class="icon" :disabled="i === 0" @click="moveSponsor(i, -1)" title="Subir">↑</button>
                      <button
                        class="icon"
                        :disabled="i === model.sponsors.length - 1"
                        @click="moveSponsor(i, +1)"
                        title="Bajar"
                      >
                        ↓
                      </button>
                      <button class="icon danger" @click="removeSponsor(i)" title="Eliminar">✕</button>
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-2 gap-2">
                    <div>
                      <label class="lbl">Nombre</label>
                      <input v-model="sp.name" class="in" type="text" placeholder="DICASS" />
                    </div>

                    <div>
                      <label class="lbl">Link (opcional)</label>
                      <input v-model="sp.url" class="in" type="text" placeholder="https://..." />
                    </div>
                  </div>

                  <div class="mt-3 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <div>
                      <label class="lbl">Logo</label>
                      <input v-model="sp.logo" class="in" type="text" placeholder="/img/sponsors/logo.png o URL https://..." />
                    </div>
                    <button class="btn-ghost" @click="pickFile('sponsor', i)">Elegir archivo</button>
                  </div>
                </div>

                <div v-if="model.sponsors.length === 0" class="empty">
                  No hay patrocinadores. Agrega uno con “+ Agregar”.
                </div>
              </div>
            </div>
          </section>

          <!-- FOOTER -->
          <section class="card">
            <div class="card-h">
              <p class="step">4 · Footer</p>
              <h2 class="h2">Ubicación y redes</h2>
              <p class="p">Texto simple para el final de la página.</p>
            </div>

            <div class="card-b space-y-3">
              <div>
                <label class="lbl">Dirección</label>
                <input v-model="model.location.address" class="in" type="text" placeholder="FES Acatlán · Entrada Principal" />
              </div>

              <div>
                <label class="lbl">Link Google Maps</label>
                <input v-model="model.location.mapsUrl" class="in" type="text" placeholder="https://maps.app.goo.gl/..." />
              </div>

              <div class="grid sm:grid-cols-2 gap-2">
                <div>
                  <label class="lbl">Instagram</label>
                  <input v-model="model.location.instagram" class="in" type="text" placeholder="@tochero5liga" />
                </div>
                <div>
                  <label class="lbl">Copyright</label>
                  <input v-model="model.location.copyright" class="in" type="text" placeholder="© 2026 tochero5liga" />
                </div>
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
              <p class="p">Solo para validar cambios.</p>
            </div>

            <div class="card-b space-y-4">
              <!-- hero preview -->
              <div class="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div class="aspect-[16/8] bg-slate-100">
                  <img
                    v-if="heroPreviewSrc"
                    :src="heroPreviewSrc"
                    class="w-full h-full object-cover"
                    alt="preview"
                  />
                  <div v-else class="w-full h-full grid place-items-center text-sm text-slate-500">
                    Sin imagen
                  </div>
                </div>

                <div class="p-4 border-t border-slate-200">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-xs text-slate-600">
                      <span v-if="heroCount > 0">Imagen {{ previewHeroIndex + 1 }} / {{ heroCount }}</span>
                      <span v-else>Sin imágenes</span>
                    </p>

                    <div class="flex gap-1.5">
                      <button class="icon" :disabled="heroCount <= 1" @click="prevPreview()">←</button>
                      <button class="icon" :disabled="heroCount <= 1" @click="nextPreview()">→</button>
                    </div>
                  </div>

                  <p class="mt-3 text-xl font-extrabold text-slate-900">
                    {{ model.hero.title || '—' }}
                  </p>
                  <p class="mt-1 text-sm text-slate-600">
                    {{ model.hero.subtitle || '—' }}
                  </p>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <span class="chip chip-primary">{{ model.hero.cta1.label || 'Botón 1' }}</span>
                    <span class="chip">{{ model.hero.cta2.label || 'Botón 2' }}</span>
                  </div>
                </div>
              </div>

              <!-- sponsors preview -->
              <div class="rounded-2xl border border-slate-200 bg-white p-4">
                <p class="font-extrabold text-slate-900">Patrocinadores</p>
                <div class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    v-for="sp in model.sponsors.slice(0, 6)"
                    :key="sp.id"
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-3 grid place-items-center"
                  >
                    <img v-if="sp.logo" :src="sp.logo" class="h-10 w-24 object-contain" :alt="sp.name" />
                    <span v-else class="text-[11px] text-slate-500">Logo</span>
                  </div>
                </div>
              </div>

              <!-- footer preview -->
              <div class="rounded-2xl border border-slate-200 bg-white p-4">
                <p class="font-extrabold text-slate-900">Footer</p>
                <p class="mt-2 text-sm text-slate-700">{{ model.location.address || '—' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ model.location.instagram || '—' }}</p>
                <p class="mt-2 text-xs text-slate-500">{{ model.location.copyright || '—' }}</p>
              </div>
            </div>
          </section>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="font-extrabold text-slate-900">Uso rápido</p>
            <ol class="mt-2 list-decimal list-inside space-y-1">
              <li>Edita lo que quieras.</li>
              <li>Da click en <span class="font-semibold">Guardar</span>.</li>
              <li>Listo.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>

    <!-- input file oculto -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'

const LS_KEY = 't5_home_simple_v1'

function uid(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}

function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

const DEFAULTS = {
  hero: {
    title: 'Temporada 2026',
    subtitle: 'Resultados, posiciones y registros en un solo lugar.',
    cta1: { label: 'Ver estadísticas', to: '/estadisticas' },
    cta2: { label: 'Registrar equipo', to: '/registro' },
    images: [
      { id: 'carrusel-1', src: '/img/carrusel1.jpg' },
      { id: 'carrusel-2', src: '/img/carrusel2.jpg' },
      { id: 'carrusel-3', src: '/img/carrusel3.jpg' }
    ]
  },
  intro: {
    title: 'TOCHERO5LIGA',
    subtitle: 'ENTÉRATE DE TODO LO QUE ESTÁ PASANDO EN EL TORNEO.'
  },
  sponsors: [
    { id: 'dicass', name: 'DICASS', logo: '/img/sponsors/dicass-logo.png', url: 'https://dicass.com.mx/' },
    { id: 'underarmour', name: 'Under Armour', logo: '/img/sponsors/underarmour-logo.png', url: 'https://www.underarmour.com.mx/' }
  ],
  location: {
    address: 'FES Acatlán · Entrada Principal (peatonal)',
    mapsUrl: 'https://maps.app.goo.gl/zKNYRashoqHAMJwP9',
    instagram: '@tochero5liga',
    copyright: '© 2026 tochero5liga'
  }
}

const model = reactive(clone(DEFAULTS))

const saving = ref(false)
const statusMsg = ref('')

const lastSavedSnapshot = ref('')
const dirty = computed(() => JSON.stringify(model) !== lastSavedSnapshot.value)

function safeApplyParsed(parsed) {
  const merged = clone(DEFAULTS)

  if (parsed && typeof parsed === 'object') {
    if (parsed.hero && typeof parsed.hero === 'object') {
      merged.hero.title = String(parsed.hero.title ?? merged.hero.title)
      merged.hero.subtitle = String(parsed.hero.subtitle ?? merged.hero.subtitle)

      if (parsed.hero.cta1 && typeof parsed.hero.cta1 === 'object') {
        merged.hero.cta1.label = String(parsed.hero.cta1.label ?? merged.hero.cta1.label)
        merged.hero.cta1.to = String(parsed.hero.cta1.to ?? merged.hero.cta1.to)
      }
      if (parsed.hero.cta2 && typeof parsed.hero.cta2 === 'object') {
        merged.hero.cta2.label = String(parsed.hero.cta2.label ?? merged.hero.cta2.label)
        merged.hero.cta2.to = String(parsed.hero.cta2.to ?? merged.hero.cta2.to)
      }

      if (Array.isArray(parsed.hero.images)) {
        merged.hero.images = parsed.hero.images
          .filter((x) => x && typeof x === 'object')
          .map((x) => ({ id: String(x.id ?? uid('carrusel')), src: String(x.src ?? '') }))
      }
    }

    if (parsed.intro && typeof parsed.intro === 'object') {
      merged.intro.title = String(parsed.intro.title ?? merged.intro.title)
      merged.intro.subtitle = String(parsed.intro.subtitle ?? merged.intro.subtitle)
    }

    if (Array.isArray(parsed.sponsors)) {
      merged.sponsors = parsed.sponsors
        .filter((x) => x && typeof x === 'object')
        .map((x) => ({
          id: String(x.id ?? uid('sp')),
          name: String(x.name ?? ''),
          logo: String(x.logo ?? ''),
          url: String(x.url ?? '')
        }))
    }

    if (parsed.location && typeof parsed.location === 'object') {
      merged.location.address = String(parsed.location.address ?? merged.location.address)
      merged.location.mapsUrl = String(parsed.location.mapsUrl ?? merged.location.mapsUrl)
      merged.location.instagram = String(parsed.location.instagram ?? merged.location.instagram)
      merged.location.copyright = String(parsed.location.copyright ?? merged.location.copyright)
    }
  }

  if (!Array.isArray(merged.hero.images)) merged.hero.images = []
  if (!Array.isArray(merged.sponsors)) merged.sponsors = []

  return merged
}

function load() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const merged = safeApplyParsed(parsed)
    Object.assign(model, merged)
    lastSavedSnapshot.value = JSON.stringify(model)
    statusMsg.value = raw ? 'Cargado' : 'Cargado (default)'
  } catch {
    Object.assign(model, clone(DEFAULTS))
    lastSavedSnapshot.value = JSON.stringify(model)
    statusMsg.value = 'Cargado (default)'
  }
}

async function save() {
  if (!import.meta.client) return
  saving.value = true
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(model))
    lastSavedSnapshot.value = JSON.stringify(model)
    statusMsg.value = 'Guardado'
  } finally {
    saving.value = false
  }
}

function resetDefaults() {
  Object.assign(model, clone(DEFAULTS))
  statusMsg.value = 'Restaurado (no olvides guardar)'
}

/* HERO */
function addHeroImage() {
  if (model.hero.images.length >= 6) return
  model.hero.images.push({ id: uid('carrusel'), src: '' })
}
function removeHeroImage(i) {
  model.hero.images.splice(i, 1)
  if (previewHeroIndex.value >= model.hero.images.length) previewHeroIndex.value = 0
}
function moveHeroImage(i, dir) {
  const j = i + dir
  const arr = model.hero.images
  if (j < 0 || j >= arr.length) return
  const a = arr[i]
  const b = arr[j]
  if (!a || !b) return
  arr[i] = b
  arr[j] = a
}

/* SPONSORS */
function addSponsor() {
  model.sponsors.push({ id: uid('sp'), name: '', logo: '', url: '' })
}
function removeSponsor(i) {
  model.sponsors.splice(i, 1)
}
function moveSponsor(i, dir) {
  const j = i + dir
  const arr = model.sponsors
  if (j < 0 || j >= arr.length) return
  const a = arr[i]
  const b = arr[j]
  if (!a || !b) return
  arr[i] = b
  arr[j] = a
}

/* PREVIEW */
const previewHeroIndex = ref(0)
const heroCount = computed(() => model.hero.images.length)

const heroPreview = computed(() => {
  const n = heroCount.value
  if (n <= 0) return null
  const i = Math.min(Math.max(0, previewHeroIndex.value), n - 1)
  return model.hero.images[i] ?? null
})
const heroPreviewSrc = computed(() => (heroPreview.value && heroPreview.value.src) ? heroPreview.value.src : '')

function nextPreview() {
  const n = heroCount.value
  if (n <= 1) return
  previewHeroIndex.value = (previewHeroIndex.value + 1) % n
}
function prevPreview() {
  const n = heroCount.value
  if (n <= 1) return
  previewHeroIndex.value = (previewHeroIndex.value - 1 + n) % n
}

watch(
  heroCount,
  (n) => {
    if (n <= 0) previewHeroIndex.value = 0
    else if (previewHeroIndex.value > n - 1) previewHeroIndex.value = 0
  },
  { immediate: true }
)

/* FILE PICKER */
const fileInput = ref(null)
const pickTarget = ref(null)

function pickFile(kind, index) {
  pickTarget.value = { kind, index }
  if (fileInput.value) fileInput.value.click()
}

function onFileChange(e) {
  const input = e.target
  const file = input && input.files ? input.files[0] : null
  input.value = ''
  if (!file || !pickTarget.value) return

  const url = URL.createObjectURL(file)
  const { kind, index } = pickTarget.value
  pickTarget.value = null

  if (kind === 'hero') {
    const img = model.hero.images[index]
    if (!img) return
    img.src = url
  } else {
    const sp = model.sponsors[index]
    if (!sp) return
    sp.logo = url
  }

  statusMsg.value = 'Imagen elegida (para hacerlo permanente, usa /public/img o una URL)'
}

onMounted(load)
</script>

<style scoped>
/* Minimal + friendly (sin transparencias) */
.card {
  background: #ffffff;
  border: 1px solid rgb(226, 232, 240);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}
.card-h {
  padding: 14px;
  border-bottom: 1px solid rgb(226, 232, 240);
  background: #ffffff;
}
.card-b { padding: 14px; }

.step {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(100, 116, 139);
  font-weight: 800;
}
.h2 {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 900;
  color: rgb(15, 23, 42);
}
.p {
  margin-top: 6px;
  font-size: 13px;
  color: rgb(71, 85, 105);
}

.lbl {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgb(100, 116, 139);
  font-weight: 800;
}
.in {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgb(226, 232, 240);
  background: #ffffff;
  color: rgb(15, 23, 42);
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.in:focus {
  border-color: rgba(59, 130, 246, 0.85);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.divider { height: 1px; background: rgb(226, 232, 240); }

.row {
  border: 1px solid rgb(226, 232, 240);
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
}

.btn-primary {
  border-radius: 12px;
  background: rgb(37, 99, 235);
  color: white;
  font-weight: 900;
  font-size: 12px;
  padding: 10px 14px;
  border: 1px solid rgb(37, 99, 235);
}
.btn-primary:hover { background: rgb(29, 78, 216); }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.btn-ghost {
  border-radius: 12px;
  border: 1px solid rgb(226, 232, 240);
  background: #ffffff;
  color: rgb(15, 23, 42);
  font-weight: 900;
  font-size: 12px;
  padding: 10px 12px;
}
.btn-ghost:hover { background: rgb(248, 250, 252); }
.btn-ghost:disabled { opacity: .6; cursor: not-allowed; }

.icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgb(226, 232, 240);
  background: rgb(248, 250, 252);
  color: rgb(15, 23, 42);
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon:hover { background: rgb(241, 245, 249); }
.icon:disabled { opacity: .45; cursor: not-allowed; }

.icon.danger {
  border-color: rgb(254, 202, 202);
  background: rgb(254, 242, 242);
  color: rgb(185, 28, 28);
}
.icon.danger:hover { background: rgb(254, 226, 226); }

.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgb(226, 232, 240);
  background: rgb(248, 250, 252);
  color: rgb(15, 23, 42);
  font-weight: 900;
  font-size: 12px;
  padding: 8px 12px;
}
.chip-primary {
  border-color: rgb(191, 219, 254);
  background: rgb(219, 234, 254);
  color: rgb(30, 64, 175);
}

.empty {
  border: 1px dashed rgb(203, 213, 225);
  border-radius: 16px;
  padding: 14px;
  color: rgb(71, 85, 105);
  background: rgb(248, 250, 252);
  font-size: 13px;
}
</style>