<template>
  <section
    id="inicio"
    class="relative pt-24 md:pt-28 overflow-hidden"
  >
    <!-- BG Glows -->
    <div class="glow-green" />
    <div class="glow-amber" />

    <!-- Partículas -->
    <div ref="particlesRef" class="particles" />

    <!-- Líneas de campo -->
    <svg class="field-svg" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <line x1="720" y1="0" x2="720" y2="200" class="field-solid" />
      <ellipse cx="720" cy="200" rx="160" ry="48" class="field-solid" />
      <line x1="0" y1="48" x2="1440" y2="48" class="field-line" />
      <rect x="240" y="48" width="960" height="152" class="field-solid" />
      <rect x="480" y="48" width="480" height="88" class="field-solid" />
      <line x1="0" y1="0" x2="1440" y2="0" class="field-solid" />
    </svg>

    <!-- Contenido -->
    <div class="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
      <div class="min-h-[72vh] py-10 md:py-14 flex flex-col items-center justify-center text-center">

        <!-- Badge -->
        <div class="badge">
          <span class="badge-dot" />
          Temporada {{ season }} Activa
        </div>

        <!-- Título -->
        <h1>
          <span class="title-line1 block">DONDE SE VIVE</span>
          <span class="title-line2 block">LA LIGA</span>
        </h1>

        <!-- Subtítulo -->
        <p class="subtitle">
          Tocho bandera de élite en CDMX — Dos ligas, un mismo nivel de competencia
        </p>

        <!-- Divider -->
        <div class="divider">
          <div class="divider-line" />
          <span class="text-lg select-none">🏈</span>
          <div class="divider-line right" />
        </div>

        <!-- Pills ligas -->
        <div class="leagues">
          <div class="league-pill pill-green">
            <span class="pill-dot g" />
            Liga Dominical
          </div>
          <div class="league-pill pill-amber">
            <span class="pill-dot a" />
            Liga Nocturna · Jueves
          </div>
        </div>

        <!-- CTA Zone -->
        <div class="cta-zone">
          <!-- Social proof -->
          <div class="social-proof">
            <span class="text-sm select-none">🏆</span>
            <span class="proof-text"><strong>+30 equipos</strong> ya inscritos esta temporada</span>
          </div>

          <!-- Botón -->
          <div class="btn-wrap">
            <div class="ping-ring" />
            <button class="btn-inscribete" @click="scrollToContacto">
              <span class="btn-text">INSCRÍBETE AHORA</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>

          <!-- Micro-copy -->
          <div class="microcopy">
            <span class="microcopy-check">✓</span>
            Respuesta en menos de 24 horas
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'

withDefaults(defineProps<{ season?: number }>(), { season: 2026 })

const particlesRef = ref<HTMLElement | null>(null)

function scrollToContacto() {
  const el = document.getElementById('contacto')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  if (!particlesRef.value) return
  const colors = ['#34d399', '#6ee7b7', '#fbbf24', '#a7f3d0', '#ffffff']
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div')
    p.classList.add('particle')
    const sz = Math.random() * 3 + 1.5
    Object.assign(p.style, {
      width: `${sz}px`,
      height: `${sz}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 30}%`,
      background: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${4 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 6}s`,
    })
    particlesRef.value.appendChild(p)
  }
})
</script>

<style scoped>
/* ── Glows de fondo ── */
.glow-green {
  position: absolute;
  width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
  top: -180px; left: 50%; transform: translateX(-50%);
  animation: pulseG 3.5s ease-in-out infinite;
  pointer-events: none; z-index: 0;
}
.glow-amber {
  position: absolute;
  width: 420px; height: 420px; border-radius: 50%;
  background: radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%);
  bottom: -100px; left: 5%;
  animation: pulseA 4.2s ease-in-out infinite;
  pointer-events: none; z-index: 0;
}
@keyframes pulseG {
  0%,100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
  50%     { opacity: 1;   transform: translateX(-50%) scale(1.08); }
}
@keyframes pulseA {
  0%,100% { opacity: 0.5; transform: scale(1); }
  50%     { opacity: 1;   transform: scale(1.1); }
}

/* ── Partículas ── */
.particles {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 0;
}
/* :deep() para que Nuxt aplique scoped a elementos creados por JS */
:deep(.particle) {
  position: absolute; border-radius: 50%;
  animation: floatUp linear infinite; opacity: 0;
}
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 0.55; }
  90%  { opacity: 0.2; }
  100% { transform: translateY(-400px) scale(0.3); opacity: 0; }
}

/* ── Líneas de campo ── */
.field-svg {
  position: absolute; bottom: 0; left: 0; right: 0;
  width: 100%; height: 200px;
  opacity: 0; animation: fadeUp 0.8s 0.2s ease forwards;
  pointer-events: none; z-index: 0;
}
.field-line  { stroke: rgba(52,211,153,0.13); stroke-width: 1; fill: none; stroke-dasharray: 4 6; animation: dashMove 3s linear infinite; }
.field-solid { stroke: rgba(52,211,153,0.09); stroke-width: 1; fill: none; }
@keyframes dashMove { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -40; } }

/* ── Badge ── */
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(16,185,129,0.10);
  border: 1px solid rgba(16,185,129,0.25);
  border-radius: 100px; padding: 6px 16px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
  color: #6ee7b7; text-transform: uppercase;
  opacity: 0; animation: fadeDown 0.6s 0.5s ease forwards;
  margin-bottom: 20px;
}
.badge-dot {
  display: inline-block;
  width: 7px; height: 7px; border-radius: 50%;
  background: #34d399; animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ── Títulos ── */
.title-line1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(54px, 11vw, 92px);
  color: #fff; line-height: 0.88; letter-spacing: 0.04em;
  opacity: 0; transform: translateY(30px);
  animation: riseIn 0.7s 0.8s cubic-bezier(.22,1,.36,1) forwards;
}
.title-line2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(54px, 11vw, 92px);
  color: #34d399; line-height: 0.88; letter-spacing: 0.04em;
  text-shadow: 0 0 60px rgba(52,211,153,0.35);
  opacity: 0; transform: translateY(30px);
  animation: riseIn 0.7s 1.0s cubic-bezier(.22,1,.36,1) forwards;
}

/* ── Subtítulo ── */
.subtitle {
  font-size: 14px; color: #94a3b8; letter-spacing: 0.04em;
  margin-top: 16px; max-width: 380px; text-align: center;
  opacity: 0; animation: fadeUp 0.6s 1.3s ease forwards; line-height: 1.6;
}

/* ── Divider ── */
.divider {
  display: flex; align-items: center; gap: 14px;
  margin-top: 28px;
  opacity: 0; animation: fadeUp 0.6s 1.5s ease forwards;
}
.divider-line       { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, rgba(52,211,153,0.35)); }
.divider-line.right { background: linear-gradient(90deg, rgba(52,211,153,0.35), transparent); }

/* ── Pills ── */
.leagues {
  display: flex; gap: 10px; margin-top: 22px;
  opacity: 0; animation: fadeUp 0.6s 1.65s ease forwards;
  flex-wrap: wrap; justify-content: center;
}
.league-pill {
  display: inline-flex; align-items: center; gap: 7px;
  border-radius: 100px; padding: 7px 16px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
}
.pill-green { background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.20); color: #6ee7b7; }
.pill-amber { background: rgba(251,191,36,0.08);  border: 1px solid rgba(251,191,36,0.20);  color: #fbbf24; }
.pill-dot   { display: inline-block; width: 6px; height: 6px; border-radius: 50%; }
.pill-dot.g { background: #34d399; }
.pill-dot.a { background: #fbbf24; }

/* ── CTA Zone ── */
.cta-zone {
  margin-top: 32px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  opacity: 0; animation: fadeUp 0.6s 1.85s ease forwards;
}
.social-proof      { display: flex; align-items: center; gap: 8px; }
.proof-text        { font-size: 12px; color: #64748b; font-weight: 600; }
.proof-text strong { color: #34d399; }

/* ── Ping ring + botón ── */
.btn-wrap {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
}
.ping-ring {
  position: absolute; inset: -8px; border-radius: 100px;
  border: 1.5px solid rgba(52,211,153,0.38);
  animation: pingRing 2.8s 3s ease-out infinite;
  pointer-events: none;
}
@keyframes pingRing {
  0%   { transform: scale(1);    opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0;   }
}

.btn-inscribete {
  position: relative; z-index: 1;
  display: inline-flex; align-items: center; gap: 10px;
  background-color: #10b981; color: #ffffff;
  font-weight: 900; font-size: 13px;
  letter-spacing: 0.2em; text-transform: uppercase;
  border: none; border-radius: 100px;
  padding: 16px 40px;
  cursor: pointer; outline: none;
  box-shadow: 0 12px 40px rgba(16,185,129,0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.btn-inscribete:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 52px rgba(16,185,129,0.50);
  background-color: #059669;
}
.btn-inscribete:active { transform: scale(0.97); }

.btn-text  { color: #ffffff; font-weight: 900; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; }
.btn-arrow { color: #ffffff; font-size: 16px; font-weight: 900; display: inline-block; transition: transform 0.2s ease; }
.btn-inscribete:hover .btn-arrow { transform: translateX(4px); }

/* ── Micro-copy ── */
.microcopy       { font-size: 11px; color: #475569; font-weight: 600; letter-spacing: 0.04em; display: flex; align-items: center; gap: 5px; }
.microcopy-check { color: #34d399; font-size: 12px; }

/* ── Keyframes globales ── */
@keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}  to{opacity:1;transform:translateY(0)} }
@keyframes riseIn   { from{opacity:0;transform:translateY(30px)}  to{opacity:1;transform:translateY(0)} }
</style>