<template>
  <section class="mt-10">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="flex items-center gap-3">
        <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
        <p class="text-xs uppercase tracking-[0.22em] text-slate-300">Patrocinadores</p>
      </div>

      <div class="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div class="marquee py-6">
          <div class="marquee__track">
            <div class="marquee__row">
              <div v-for="sp in logos" :key="sp.id" class="px-7">
                <img
                  :src="sp.src"
                  :alt="sp.alt"
                  class="h-10 w-auto object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 hover:saturate-125"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <!-- duplicate para loop infinito -->
            <div class="marquee__row" aria-hidden="true">
              <div v-for="sp in logos" :key="sp.id + '-dup'" class="px-7">
                <img
                  :src="sp.src"
                  :alt="sp.alt"
                  class="h-10 w-auto object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 hover:saturate-125"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-2 text-[11px] text-slate-400">
        Tip: solo cambia/añade archivos en <code class="text-slate-300">public/img/sponsors</code>.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const logos = [
  { id: "dicass", alt: "DICASS", src: "/img/sponsors/dicass-logo.png" },
  { id: "marti", alt: "Martí", src: "/img/sponsors/marti-logo.png" },
  { id: "ruffles", alt: "Ruffles", src: "/img/sponsors/ruffles-logo.png" },
  { id: "underarmour", alt: "Under Armour", src: "/img/sponsors/underarmour-logo.png" },
  { id: "blitz", alt: "Blitz Flag", src: "/img/sponsors/blitzflag-logo.png" },
  { id: "medimex", alt: "Medimex", src: "/img/sponsors/medimex-logo.png" },
];
</script>

<style scoped>
.marquee {
  position: relative;
}
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 26s linear infinite;
}
.marquee__row {
  display: flex;
  align-items: center;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
</style>