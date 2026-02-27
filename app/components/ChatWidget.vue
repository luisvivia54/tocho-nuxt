<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Floating launcher -->
      <div
        class="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[80] flex flex-col items-end gap-2"
      >
        <!-- Button -->
        <button
          type="button"
          class="group relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.14)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition"
          :aria-expanded="open ? 'true' : 'false'"
          aria-controls="t5-chat-panel"
          @click="toggle()"
        >
          <!-- Unread dot -->
          <span
            v-if="!open && hasUnread"
            class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
            aria-hidden="true"
          />
          <!-- Icon -->
          <span class="grid place-items-center h-9 w-9 rounded-full bg-slate-900 text-white">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 8h10M7 12h7M12 20l-3.2-2.1H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v5.8a4 4 0 0 1-4 4h-2.8L12 20Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <!-- Label (hidden on very small) -->
          <span class="hidden sm:block text-left">
            <span class="block text-[12px] font-extrabold text-slate-900 leading-tight">Pregúntale a TocheroBot</span>
            <span class="block text-[11px] font-semibold text-slate-500 leading-tight">Reglas, registro, ubicación…</span>
          </span>
        </button>

        <!-- Panel -->
        <Transition name="t5pop">
          <section
            v-if="open"
            id="t5-chat-panel"
            class="w-[92vw] sm:w-[380px] md:w-[420px]
                   rounded-[22px] overflow-hidden
                   border border-slate-200 bg-white
                   shadow-[0_24px_70px_rgba(15,23,42,0.20)]
                   flex flex-col"
            style="height: min(560px, calc(100dvh - 132px - env(safe-area-inset-bottom)));
                   max-height: calc(100dvh - 132px - env(safe-area-inset-bottom));"
            role="dialog"
            aria-label="Chat TocheroBot"
          >
            <!-- Header -->
            <header class="px-4 py-3 border-b border-slate-200 bg-white">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full" :class="onlineDotClass" aria-hidden="true" />
                    <p class="text-sm font-extrabold text-slate-900 truncate">TocheroBot</p>
                    <span class="text-[11px] font-semibold text-slate-500">
                      {{ onlineLabel }}
                    </span>
                  </div>
                  <p class="mt-0.5 text-[11px] text-slate-500">
                    Minimal · no invade tu diseño
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    title="Limpiar"
                    aria-label="Limpiar chat"
                    @click="clearChat()"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                      <path
                        d="M9 7l1-2h4l1 2"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7 7l1 14h8l1-14"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    title="Cerrar"
                    aria-label="Cerrar"
                    @click="close()"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Quick chips -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="c in chips"
                  :key="c"
                  type="button"
                  class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                  @click="sendChip(c)"
                >
                  {{ c }}
                </button>
              </div>
            </header>

            <!-- Messages (flex-1 + min-h-0 evita que se corte) -->
            <div ref="scrollEl" class="t5scroll flex-1 min-h-0 overflow-y-auto px-4 py-3 bg-white">
              <div class="space-y-2">
                <div
                  v-for="m in messages"
                  :key="m.id"
                  class="flex"
                  :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed border"
                    :class="m.role === 'user'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-200'"
                  >
                    <p class="whitespace-pre-wrap">{{ m.text }}</p>
                    <p class="mt-1 text-[10px] opacity-70" :class="m.role === 'user' ? 'text-white' : 'text-slate-500'">
                      {{ formatTime(m.ts) }}
                    </p>
                  </div>
                </div>

                <div v-if="typing" class="flex justify-start">
                  <div class="rounded-2xl px-3.5 py-2.5 text-[13px] border border-slate-200 bg-white text-slate-700">
                    <span class="inline-flex items-center gap-1">
                      <span class="t5dot"></span><span class="t5dot"></span><span class="t5dot"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input -->
            <footer class="px-4 py-3 border-t border-slate-200 bg-white">
              <form class="flex items-center gap-2" @submit.prevent="onSubmit">
                <input
                  v-model="draft"
                  type="text"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escribe tu pregunta…"
                  autocomplete="off"
                />
                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-extrabold
                         bg-blue-600 hover:bg-blue-500 text-white shadow-sm disabled:opacity-50"
                  :disabled="!draft.trim() || typing"
                >
                  Enviar
                </button>
              </form>

              <p class="mt-2 text-[10px] text-slate-500">
                Enter para enviar · Esc para cerrar
                <span v-if="endpoint" class="ml-1">· Conectado a endpoint</span>
                <span v-else class="ml-1">· Modo FAQ local</span>
              </p>
            </footer>
          </section>
        </Transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

/**
 * Endpoint opcional (cuando lo conectes):
 * - Pásalo como prop: <ChatWidget endpoint="https://.../api/chat" />
 * - Body recomendado: { message: string, history: Array<{role,text}> }
 * - Respuesta esperada: { answer: string } o string
 */
const props = defineProps({
  endpoint: { type: String, default: '' }
})

const open = ref(false)
const draft = ref('')
const typing = ref(false)
const scrollEl = ref(null)

const chips = [
  '¿Cómo registro mi equipo?',
  '¿Dónde es la ubicación?',
  '¿Qué reglamento aplica?',
  '¿Cómo ver partidos?',
  'Horarios / jornada',
  'Contacto / staff'
]

const STORAGE_KEY = 't5_chat_history_v1'
const STORAGE_UNREAD = 't5_chat_unread_v1'

const hasUnread = ref(false)

const messages = ref([
  {
    id: cryptoId(),
    role: 'assistant',
    text: '👋 Soy TocheroBot. Pregúntame sobre registro, reglamentos, ubicación, partidos y stats.',
    ts: Date.now()
  }
])

const onlineLabel = computed(() => (props.endpoint ? 'online' : 'FAQ'))
const onlineDotClass = computed(() => (props.endpoint ? 'bg-emerald-500' : 'bg-slate-400'))

function cryptoId() {
  try {
    return (crypto?.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2)
  } catch {
    return String(Math.random()).slice(2)
  }
}

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function toggle() {
  open.value ? close() : show()
}
function show() {
  open.value = true
  hasUnread.value = false
  try { localStorage.setItem(STORAGE_UNREAD, '0') } catch {}
  nextTick(() => scrollToBottom())
}
function close() {
  open.value = false
}

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value.slice(-50)))
  } catch {}
}

function restore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length) messages.value = arr
  } catch {}
  try {
    const u = localStorage.getItem(STORAGE_UNREAD)
    hasUnread.value = u === '1'
  } catch {}
}

function markUnreadIfClosed() {
  if (open.value) return
  hasUnread.value = true
  try { localStorage.setItem(STORAGE_UNREAD, '1') } catch {}
}

function clearChat() {
  messages.value = [
    {
      id: cryptoId(),
      role: 'assistant',
      text: 'Listo ✅ ¿Qué quieres saber?',
      ts: Date.now()
    }
  ]
  persist()
  nextTick(() => scrollToBottom())
}

function sendChip(text) {
  draft.value = text
  onSubmit()
}

async function onSubmit() {
  const text = draft.value.trim()
  if (!text || typing.value) return

  draft.value = ''
  messages.value.push({ id: cryptoId(), role: 'user', text, ts: Date.now() })
  persist()
  await nextTick()
  scrollToBottom()

  typing.value = true

  const answer = await getAnswer(text)

  messages.value.push({ id: cryptoId(), role: 'assistant', text: answer, ts: Date.now() })
  typing.value = false
  persist()
  await nextTick()
  scrollToBottom()
  markUnreadIfClosed()
}

function normalize(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

/** FAQ local (modo minimal hasta que conectes backend) */
function localAnswer(q) {
  const t = normalize(q)

  if (t.includes('registro') || t.includes('registrar') || t.includes('equipo')) {
    return '📝 Para registrar un equipo: entra a **/registro** y completa los datos. Si ya tienes cuenta, inicia sesión y sigue el flujo de registro.'
  }
  if (t.includes('ubicacion') || t.includes('mapa') || t.includes('donde') || t.includes('fes') || t.includes('acatlan')) {
    return '📍 La liga es en **FES Acatlán** (entrada principal peatonal). Abajo en el home tienes el mapa para abrir la ruta en Google Maps.'
  }
  if (t.includes('reglamento') || t.includes('reglas') || t.includes('mixto')) {
    return '📚 En la sección **Reglamentos** puedes abrir el PDF/DOCX. Si me dices tu modalidad (mixto/varonil/femenil) te digo cuál revisar primero.'
  }
  if (t.includes('partidos') || t.includes('horario') || t.includes('jornada') || t.includes('cuando')) {
    return '🏈 Para ver partidos y horarios entra a **/partidos**. En el home también aparece el **Próximo juego** (si hay programados).'
  }
  if (t.includes('estadistica') || t.includes('posicion') || t.includes('tabla') || t.includes('top')) {
    return '📊 Las estadísticas y posiciones están en **/estadisticas** y en el home tienes el **Top 5** con filtros por temporada/categoría/rama.'
  }
  if (t.includes('contacto') || t.includes('staff') || t.includes('instagram') || t.includes('patrocin')) {
    return '📩 Para contacto rápido: Instagram **@tochero5liga**. Para patrocinios, también por DM y te pasan el paquete/brief.'
  }

  return 'Dime si tu duda es sobre **registro**, **reglamentos**, **ubicación**, **partidos** o **estadísticas** y te guío rápido.'
}

/** Si hay endpoint, lo usa. Si no, responde por FAQ local */
async function getAnswer(text) {
  if (!props.endpoint) return localAnswer(text)

  try {
    // history compacta para el backend
    const history = messages.value.slice(-12).map(m => ({ role: m.role, text: m.text }))
    const res = await $fetch(props.endpoint, {
      method: 'POST',
      body: { message: text, history }
    })

    if (typeof res === 'string') return res
    if (res && typeof res.answer === 'string') return res.answer

    return 'Recibí respuesta pero no pude leer el formato. (Asegura que el backend regrese { answer: "..." } o un string.)'
  } catch (e) {
    return 'Tuve un problema conectando al chat 😅. Por ahora te puedo ayudar con preguntas rápidas (modo FAQ).'
  }
}

/** UX: Esc para cerrar */
function onKey(e) {
  if (e.key === 'Escape') close()
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    scrollToBottom()
  }
})

onMounted(() => {
  restore()
  window.addEventListener('keydown', onKey, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* Pop transition */
.t5pop-enter-active,
.t5pop-leave-active {
  transition: transform .18s ease, opacity .18s ease;
}
.t5pop-enter-from,
.t5pop-leave-to {
  transform: translateY(10px) scale(0.985);
  opacity: 0;
}

/* typing dots */
.t5dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #94a3b8;
  display: inline-block;
  animation: t5bounce 1s infinite ease-in-out;
}
.t5dot:nth-child(2) { animation-delay: .15s; }
.t5dot:nth-child(3) { animation-delay: .30s; }

@keyframes t5bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: .6; }
  40% { transform: translateY(-3px); opacity: 1; }
}

/* ✅ Hide scrollbar (pero sigue scrolleando) */
.t5scroll {
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE/Edge legacy */
}
:deep(.t5scroll::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>