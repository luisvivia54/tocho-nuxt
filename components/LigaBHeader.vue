<!-- components/LigaBHeader.vue -->
<template>
  <header class="glass-header">
    <div class="section-container flex items-center justify-between h-16 md:h-[72px]">
      <!-- Logo -->
      <NuxtLink
        :to="homeTo"
        class="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground"
        @click="menuOpen = false"
      >
        <span class="text-accent">T5</span>
        <span class="hidden sm:inline text-sm font-medium text-muted-foreground">Liga de Jueves</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          :to="homeTo"
          class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
          :class="isActive('inicio') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
        >
          Inicio
          <span v-if="isActive('inicio')" class="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span class="block h-px w-5 bg-accent" />
          </span>
        </NuxtLink>

        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
          :class="isActive(item.tab) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ item.label }}
          <span v-if="isActive(item.tab)" class="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span class="block h-px w-5 bg-accent" />
          </span>
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver
        </NuxtLink>

        <div class="flex items-center gap-3">
          <a
            href="https://www.instagram.com/p/DVChsjbjRg-/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground transition-colors hover:text-accent"
          >
            <Instagram :size="18" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground transition-colors hover:text-accent"
          >
            <Facebook :size="18" />
          </a>
        </div>

        <button class="md:hidden text-foreground" @click="menuOpen = !menuOpen">
          <X v-if="menuOpen" :size="24" />
          <Menu v-else :size="24" />
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <nav
      v-if="menuOpen"
      class="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3"
    >
      <NuxtLink
        :to="homeTo"
        class="text-xs font-semibold uppercase tracking-[0.15em]"
        :class="isActive('inicio') ? 'text-accent' : 'text-muted-foreground'"
        @click="menuOpen = false"
      >
        Inicio
      </NuxtLink>

      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="text-xs font-semibold uppercase tracking-[0.15em]"
        :class="isActive(item.tab) ? 'text-accent' : 'text-muted-foreground'"
        @click="menuOpen = false"
      >
        {{ item.label }}
      </NuxtLink>

      <NuxtLink
        to="/"
        class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mt-2"
        @click="menuOpen = false"
      >
        ← Volver al inicio
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "#imports";
import { Instagram, Facebook, Menu, X } from "lucide-vue-next";

type Tab = "inicio" | "partidos" | "equipos" | "estadisticas";

const route = useRoute();
const menuOpen = ref(false);

// ✅ fijo a JUEVES para que NUNCA se “contamine” con domingo
const BASE = "/jueves";

const currentTab = computed<Tab>(() => {
  if (route.path !== BASE) return "inicio";
  const t = String(route.query.tab ?? "inicio").toLowerCase();
  if (t === "partidos" || t === "equipos" || t === "estadisticas") return t as Tab;
  return "inicio";
});

const homeTo = computed(() => ({
  path: BASE,
  query: { ...route.query, tab: undefined, league: "jueves" }, // fuerza jueves
}));

const navItems = computed(() => [
  { label: "Partidos", tab: "partidos" as const, to: { path: BASE, query: { ...route.query, tab: "partidos", league: "jueves" } } },
  { label: "Equipos", tab: "equipos" as const, to: { path: BASE, query: { ...route.query, tab: "equipos", league: "jueves" } } },
  { label: "Estadísticas", tab: "estadisticas" as const, to: { path: BASE, query: { ...route.query, tab: "estadisticas", league: "jueves" } } },
]);

function isActive(tab: Tab) {
  return currentTab.value === tab;
}
</script>