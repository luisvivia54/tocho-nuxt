// eslint.config.mjs
// Desactiva el chequeo TS para evitar errores por imports generados
// @ts-nocheck

import withNuxt from '@nuxt/eslint-config/flat'

export default withNuxt({
  // Puedes activar reglas personalizadas aquí:
  rules: {
    // Ejemplos:
    // 'no-unused-vars': 'off',
    // 'vue/multi-word-component-names': 'off',
  }
})
