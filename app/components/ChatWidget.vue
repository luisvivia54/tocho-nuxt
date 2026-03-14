<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        class="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[80] flex flex-col items-end gap-2"
      >
        <!-- Botón flotante -->
        <button
          type="button"
          class="group relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.14)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition"
          :aria-expanded="open ? 'true' : 'false'"
          aria-controls="t5-faq-panel"
          @click="toggle"
        >
          <span
            v-if="!open && hasUnread"
            class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
            aria-hidden="true"
          />

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

          <span class="hidden sm:block text-left">
            <span class="block text-[12px] font-extrabold text-slate-900 leading-tight">
              Pregúntale a TocheroBot
            </span>
            <span class="block text-[11px] font-semibold text-slate-500 leading-tight">
              FAQ rápido · inscripción
            </span>
          </span>
        </button>

        <!-- Panel -->
        <Transition name="t5pop">
          <section
            v-if="open"
            id="t5-faq-panel"
            class="w-[92vw] sm:w-[380px] md:w-[420px]
                   rounded-[22px] overflow-hidden
                   border border-slate-200 bg-white
                   shadow-[0_24px_70px_rgba(15,23,42,0.20)]
                   flex flex-col"
            style="height: min(560px, calc(100dvh - 132px - env(safe-area-inset-bottom)));
                   max-height: calc(100dvh - 132px - env(safe-area-inset-bottom));"
            role="dialog"
            aria-label="FAQ TocheroBot"
          >
            <!-- Header -->
            <header class="px-4 py-3 border-b border-slate-200 bg-white">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                    <p class="text-sm font-extrabold text-slate-900 truncate">TocheroBot</p>
                    <span class="text-[11px] font-semibold text-slate-500">FAQ</span>
                  </div>
                  <p class="mt-0.5 text-[11px] text-slate-500">
                    Solo preguntas frecuentes cerradas
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    title="Limpiar"
                    aria-label="Limpiar FAQ"
                    @click="clearChat"
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
                    @click="close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- preguntas arriba -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="item in faqItems"
                  :key="item.question"
                  type="button"
                  class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                  @click="sendQuestion(item)"
                >
                  {{ item.question }}
                </button>
              </div>
            </header>

            <!-- historial -->
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
                    <p
                      class="mt-1 text-[10px] opacity-70"
                      :class="m.role === 'user' ? 'text-white' : 'text-slate-500'"
                    >
                      {{ formatTime(m.ts) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- footer -->
            <footer class="px-4 py-3 border-t border-slate-200 bg-white">
              <p class="text-[11px] text-slate-600 font-semibold">
                Este módulo funciona como FAQ, no como chat abierto.
              </p>
              <p class="mt-1 text-[10px] text-slate-500">
                Selecciona una pregunta de arriba · Esc para cerrar
              </p>
            </footer>
          </section>
        </Transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
const scrollEl = ref(null)
const hasUnread = ref(false)

const STORAGE_KEY = 't5_faq_history_v3'
const STORAGE_UNREAD = 't5_faq_unread_v3'

function cryptoId() {
  try {
    return (crypto?.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2)
  } catch {
    return String(Math.random()).slice(2)
  }
}

const faqItems = [
  {
    question: 'Cual es el costo de incripcion?',
    answer: 'La inscripcion es de $500 (equipos femeniles no pagan inscripcion).'
  },
  {
    question: '¿Qué necesito para inscribir a mi equipo?',
    answer: 'Necesitas logo y nombre del equipo, nombre y teléfono del representante, además del pago de inscripción.'
  }
]

const messages = ref([
  {
    id: cryptoId(),
    role: 'assistant',
    text: '👋 Hola, soy TocheroBot. Selecciona una de las preguntas disponibles.',
    ts: Date.now()
  }
])

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function toggle() {
  open.value = !open.value

  if (open.value) {
    hasUnread.value = false
    try {
      localStorage.setItem(STORAGE_UNREAD, '0')
    } catch {}
    nextTick(scrollToBottom)
  }
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
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        messages.value = parsed
      }
    }
  } catch {}

  try {
    hasUnread.value = localStorage.getItem(STORAGE_UNREAD) === '1'
  } catch {}
}

function clearChat() {
  messages.value = [
    {
      id: cryptoId(),
      role: 'assistant',
      text: 'Listo ✅ Selecciona una de las preguntas disponibles.',
      ts: Date.now()
    }
  ]
  persist()
  nextTick(scrollToBottom)
}

async function sendQuestion(item) {
  if (!item?.question || !item?.answer) return

  messages.value.push({
    id: cryptoId(),
    role: 'user',
    text: item.question,
    ts: Date.now()
  })

  messages.value.push({
    id: cryptoId(),
    role: 'assistant',
    text: item.answer,
    ts: Date.now()
  })

  persist()
  await nextTick()
  scrollToBottom()

  if (!open.value) {
    hasUnread.value = true
    try {
      localStorage.setItem(STORAGE_UNREAD, '1')
    } catch {}
  }
}

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
.t5pop-enter-active,
.t5pop-leave-active {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.t5pop-enter-from,
.t5pop-leave-to {
  transform: translateY(10px) scale(0.985);
  opacity: 0;
}

.t5scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

:deep(.t5scroll::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>
