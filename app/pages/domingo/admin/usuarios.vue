<!--
  app/pages/domingo/admin/usuarios.vue
  Placeholder: usa el layout `admin`. Editor real en /admin/usuarios.
-->
<template>
  <AdminPlaceholder
    section-label="Usuarios"
    title="Usuarios y accesos"
    description="Asigna roles, capitanes y permisos."
    legacy-to="/admin/usuarios"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>
