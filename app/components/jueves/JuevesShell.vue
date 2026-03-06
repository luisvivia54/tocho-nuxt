<template>
  <main :id="topId" class="min-h-screen text-slate-50">
    <!-- BG stadium -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-cover bg-center opacity-80" :style="{ backgroundImage: `url(${stadiumBg})` }" />
      <div class="absolute inset-0 bg-black/35" />
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.92) 100%);"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#050816]" />
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_55%_28%,rgba(16,185,129,0.25),transparent_58%)]" />
      <div class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_45%_28%,rgba(251,146,60,0.40),transparent_58%)]" />
    </div>

    <!-- HERO -->
    <section class="pt-24 md:pt-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="py-10 md:py-12">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200"
          >
            <span class="h-2 w-2 rounded-full bg-orange-300" />
            <span>LIGA DE JUEVES · TEMPORADA {{ season }}</span>
          </div>

          <h1 class="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95] tracking-tight">
            <span class="text-white">Liga de</span>
            <span class="text-orange-300"> Jueves</span>
          </h1>

          <p class="mt-4 max-w-2xl text-sm sm:text-base text-slate-300">
            Partidos, equipos y estadísticas en tiempo real desde el backend.
          </p>

          <!-- mini stats -->
          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ teamsCount }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">Equipos (activos)</div>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ matchesCountLabel }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">Partidos (backend)</div>
            </div>

            <div class="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div class="text-3xl font-extrabold text-white">{{ season }}</div>
              <div class="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-100">Temporada</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLOT: cada página mete su contenido -->
    <section :id="contentId" class="pb-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <slot />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  stadiumBg: string;
  season: number;
  teamsCount: number;
  matchesCountLabel: string;
  topId?: string;
  contentId?: string;
}>();
</script>