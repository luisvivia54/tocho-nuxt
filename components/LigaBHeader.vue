<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#050816]/88 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-6">
      <div class="flex h-20 items-center justify-between gap-6">
        <!-- Left -->
        <NuxtLink to="/jueves" class="flex items-center gap-3">
          <span class="text-[2rem] font-black tracking-tight text-orange-400 leading-none">T5</span>
          <span class="text-[1.1rem] font-medium text-slate-300">Liga de Jueves</span>
        </NuxtLink>

        <!-- Center -->
        <nav class="hidden md:flex items-center gap-12">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative text-[0.95rem] font-extrabold uppercase tracking-[0.24em] transition"
            :class="isActive(item.to) ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ item.label }}
            <span
              v-if="isActive(item.to)"
              class="absolute -bottom-[18px] left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-orange-400"
            />
          </NuxtLink>
        </nav>

        <!-- Right -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-slate-400 hover:text-slate-200"
          >
            ← Volver
          </NuxtLink>

          <a href="#" class="text-slate-400 hover:text-slate-200" aria-label="Instagram">IG</a>
          <a href="#" class="text-slate-400 hover:text-slate-200" aria-label="Facebook">FB</a>
        </div>

        <!-- Mobile -->
        <button
          type="button"
          class="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
          @click="open = !open"
        >
          Menú
        </button>
      </div>

      <div v-if="open" class="md:hidden pb-4">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="item in nav"
            :key="item.to + '-m'"
            :to="item.to"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
            @click="open = false"
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            to="/"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
            @click="open = false"
          >
            ← Volver
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const open = ref(false)

const nav = [
  { label: "Inicio", to: "/jueves" },
  { label: "Partidos", to: "/jueves/partidos" },
  { label: "Equipos", to: "/jueves/equipos" },
  { label: "Estadísticas", to: "/jueves/estadisticas" },
]

function isActive(path: string) {
  return route.path === path
}
</script>