<!--
  app/pages/domingo/admin/equipos.vue
  Placeholder: usa el layout `admin`. Editor real en /admin/equipos.
-->
<template>
  <AdminPlaceholder
    section-label="Equipos"
    title="Gestión de equipos"
    description="Crea equipos, asigna capitanes y administra su plantilla."
    legacy-to="/admin/equipos"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>
