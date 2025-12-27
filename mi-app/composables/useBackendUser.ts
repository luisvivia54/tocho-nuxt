// app/composables/useBackendUser.ts
import { ref } from 'vue'
import { useNuxtApp } from '#app'

/**
 * Se asegura de que el usuario de Keycloak exista en la BD
 * llamando al endpoint GET /api/me UNA sola vez por sesión.
 */

const backendUserSynced = ref(false)
const backendUserLoading = ref(false)
const backendUserError = ref<string | null>(null)

export function useBackendUser() {
  const nuxtApp = useNuxtApp()
  const { $kcGetToken } = nuxtApp as any

  const syncBackendUser = async () => {
    if (backendUserSynced.value || backendUserLoading.value) return

    backendUserLoading.value = true
    backendUserError.value = null

    try {
      const token: string = (await $kcGetToken?.()) ?? ''
      if (!token) {
        console.warn('No hay token, no se puede llamar /api/me')
        return
      }

      await $fetch('http://tocho5-api.tochero5.mx/api/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      backendUserSynced.value = true
    } catch (err: any) {
      console.error('Error sincronizando /api/me:', err)
      backendUserError.value = String(err)
    } finally {
      backendUserLoading.value = false
    }
  }

  return {
    backendUserSynced,
    backendUserLoading,
    backendUserError,
    syncBackendUser,
  }
}
