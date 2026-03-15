<template>
  <main class="min-h-screen text-slate-50">
    <!-- BG stadium -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-80"
        :style="{ backgroundImage: `url(${stadiumBg})` }"
      />
      <div class="absolute inset-0 bg-black/35" />
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.92) 100%);"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#050816]" />
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_55%_28%,rgba(16,185,129,0.25),transparent_58%)]" />
      <div class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_45%_28%,rgba(251,146,60,0.40),transparent_58%)]" />
    </div>

    <LigaBHeader />

    <!-- switcher -->
    <div class="px-4 pt-24 sm:px-6 md:px-8">
      <LigaSwitcher />
    </div>

    <!-- page -->
    <div class="pt-6 md:pt-8">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
const stadiumBg = "/hero-stadium.jpg";
</script>