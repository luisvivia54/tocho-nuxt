<!--
  app/pages/domingo/admin/partidos.vue
  Placeholder: usa el layout `admin`. Editor real en /admin/partidos.
-->
<template>
  <AdminPlaceholder
    section-label="Partidos"
    title="Administrar partidos"
    description="Crea, edita y califica los partidos de la Liga Dominical."
    legacy-to="/admin/partidos"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>
