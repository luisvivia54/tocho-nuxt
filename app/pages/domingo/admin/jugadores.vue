<!--
  app/pages/domingo/admin/jugadores.vue
  Placeholder: usa el layout `admin`. Sin editor legado aún para Domingo.
-->
<template>
  <AdminPlaceholder
    section-label="Jugadores"
    title="Gestión de jugadores"
    description="Lista, edita y mueve jugadores entre equipos."
    :legacy-to="null"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>
