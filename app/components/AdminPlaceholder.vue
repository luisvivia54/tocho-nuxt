<!--
  app/components/AdminPlaceholder.vue
  Placeholder reutilizable para las secciones del nuevo admin.
  Muestra la sección, título y descripción usando los CSS vars de la liga
  (--liga-accent, --liga-accent-soft, --liga-accent-ring) que setea el
  layout `admin`. Si hay una ruta legada funcional, enlaza a ella.
-->

<template>
  <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <!-- Titular mobile -->
    <div class="lg:hidden">
      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--liga-accent)]">
        {{ sectionLabel }}
      </p>
      <h1 class="mt-1 text-2xl font-extrabold text-white">{{ title }}</h1>
      <p class="mt-1 text-sm text-slate-400">{{ description }}</p>
    </div>

    <!-- Card principal -->
    <section class="mt-2 overflow-hidden rounded-2xl border border-white/8 bg-[#0A1428]/80 lg:mt-0">
      <div
        class="px-5 py-6 sm:px-7 sm:py-7"
        :style="`background:linear-gradient(90deg, var(--liga-accent-soft) 0%, transparent 70%);`"
      >
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--liga-accent)]">
          {{ sectionLabel }}
        </p>
        <h2 class="mt-1 text-xl font-extrabold text-white sm:text-2xl">{{ title }}</h2>
        <p class="mt-1 max-w-2xl text-sm text-slate-300/80">{{ description }}</p>

        <div class="mt-5 flex flex-wrap items-center gap-2">
          <NuxtLink
            v-if="legacyTo"
            :to="legacyTo"
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition"
            :style="`background:var(--liga-accent);`"
          >
            Abrir editor actual
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
          <span
            v-else
            class="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            :style="`border-color:var(--liga-accent-ring);background:var(--liga-accent-soft);color:var(--liga-accent);`"
          >
            En construcción
          </span>
        </div>
      </div>

      <!-- Info strip -->
      <div
        class="border-t border-white/8 px-5 py-4 text-xs text-slate-400 sm:px-7"
      >
        <p>
          Esta es la nueva shell de admin. Está en marcha mientras migramos el
          contenido — la versión anterior sigue disponible como fallback.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sectionLabel: string
  title: string
  description: string
  /** Ruta al editor legado que sigue funcionando. `null` si todavía no hay uno. */
  legacyTo?: string | null
}>()
</script>
