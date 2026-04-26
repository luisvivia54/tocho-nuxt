<!--
  app/pages/domingo/admin/inicio.vue
  Placeholder que usa el layout unificado `admin`.
  El contenido real de esta pantalla (edición del home) sigue viviendo
  hoy en /admin/inicio como fallback; ahí se puede migrar cuando esté
  validada visualmente la nueva shell.
-->
<template>
  <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <!-- Titular mobile (en desktop ya vive en la topbar del layout) -->
    <div class="lg:hidden">
      <h1 class="text-2xl font-extrabold text-white">Página de inicio</h1>
      <p class="mt-1 text-sm text-slate-400">Edita el home público de la liga.</p>
    </div>

    <!-- Hero: tarjeta con acento de liga -->
    <section
      class="mt-2 overflow-hidden rounded-2xl border border-white/8 bg-[#0A1428]/80 lg:mt-0"
    >
      <div
        class="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7"
        :style="`background:linear-gradient(90deg, var(--liga-accent-soft) 0%, transparent 70%);`"
      >
        <div class="min-w-0">
          <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--liga-accent)]">
            Panel de inicio
          </p>
          <h2 class="mt-1 text-xl font-extrabold text-white sm:text-2xl">
            Edita el home de la liga
          </h2>
          <p class="mt-1 text-sm text-slate-300/80">
            Hero, textos destacados y patrocinadores.
          </p>
        </div>
        <NuxtLink
          to="/admin/inicio"
          class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition"
          :style="`background:var(--liga-accent);`"
        >
          Abrir editor clásico
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- Tarjetas de acceso rápido -->
    <section class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="item in quickActions"
        :key="item.to"
        :to="item.to"
        class="group flex items-start gap-3 rounded-2xl border border-white/8 bg-[#0A1428]/80 p-4 transition hover:bg-[#0F1B34]"
      >
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
          :style="`background:var(--liga-accent-soft);color:var(--liga-accent);box-shadow:inset 0 0 0 1px var(--liga-accent-ring);`"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path :d="item.iconPath" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-white">{{ item.title }}</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ item.desc }}</p>
        </div>
      </NuxtLink>
    </section>

    <p class="mt-6 text-xs text-slate-500">
      Esta pantalla es la shell nueva. El editor real sigue disponible en
      <NuxtLink to="/admin/inicio" class="underline underline-offset-2 hover:text-slate-300">/admin/inicio</NuxtLink>.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const quickActions = [
  { to: '/admin/inicio', title: 'Editar hero', desc: 'Imagen y texto principal', iconPath: 'M4 7h16M4 12h10M4 17h6' },
  { to: '/admin/inicio', title: 'Patrocinadores', desc: 'Logos y orden', iconPath: 'M3 7h18M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 11h6' },
  { to: '/admin/partidos', title: 'Próximos partidos', desc: 'Resumen en home', iconPath: 'M3 6h18M3 12h18M3 18h12' },
]
</script>
