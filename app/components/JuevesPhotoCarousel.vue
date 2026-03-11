<template>
  <section class="mt-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="flex items-center justify-center gap-3">
        <div class="h-[2px] w-10 rounded-full bg-emerald-300/70" />
        <p class="text-xs uppercase tracking-[0.22em] text-slate-300">Fotos del torneo</p>
      </div>

      <div class="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
        <div class="relative aspect-[16/9]">
          <Transition name="fade" mode="out-in">
            <img
              :key="activeSrc"
              :src="activeSrc"
              alt="Torneo"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </Transition>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />

          <button
            type="button"
            class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-white hover:bg-black/50"
            @click="prev()"
            aria-label="Anterior"
          >
            ‹
          </button>

          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-white hover:bg-black/50"
            @click="next()"
            aria-label="Siguiente"
          >
            ›
          </button>

          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <button
              v-for="(_, i) in photos.length"
              :key="i"
              type="button"
              class="h-2 w-2 rounded-full border border-white/20"
              :class="i === idx ? 'bg-orange-300 border-orange-300' : 'bg-white/10 hover:bg-white/20'"
              @click="go(i)"
              aria-label="Ir a foto"
            />
          </div>
        </div>
      </div>

      <p class="mt-2 text-[11px] text-slate-400 text-center">
        Por ahora usamos placeholders. Cuando tengan fotos reales, solo reemplaza el arreglo.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "#imports";

const photos = [
  "/carrusel1.jpg",
  "/carrusel2.jpg",
  "/carrusel3.jpg",
  "/hero-stadium.jpg",
  "/img/sponsors/foto_1.jpg",
];

const idx = ref(0);
const activeSrc = computed(() => photos[idx.value] || photos[0]);

function next() {
  idx.value = (idx.value + 1) % photos.length;
}
function prev() {
  idx.value = (idx.value - 1 + photos.length) % photos.length;
}
function go(i: number) {
  if (i >= 0 && i < photos.length) idx.value = i;
}

let t: any = null;
onMounted(() => {
  t = setInterval(next, 6500);
});
onBeforeUnmount(() => {
  if (t) clearInterval(t);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .28s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>