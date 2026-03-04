<!-- app/pages/jueves.vue -->
<template>
  <main class="min-h-screen bg-black">
    <iframe
      :src="src"
      class="w-full h-[100vh] border-0"
      allow="clipboard-read; clipboard-write; fullscreen"
    />
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({ layout: false })

// ✅ Abre DIRECTO la pantalla naranja (Liga Jueves) del proyecto Lovable
const src = 'http://localhost:8080/liga-b'
</script>