// composables/useAuthz.ts
import { computed } from 'vue'
import { useNuxtApp, useState } from '#imports'

export const useAuthz = () => {
  const nuxtApp = useNuxtApp() as any
  const kc = nuxtApp.$kc as any

  const kcReady = useState<boolean>('kcReady', () => false)
  const kcAuthenticated = useState<boolean>('kcAuthenticated', () => false)
  const kcRealmRoles = useState<string[]>('kcRealmRoles', () => [])
  const kcApiRoles = useState<string[]>('kcApiRoles', () => [])

  const isAuthenticated = computed(() => kcReady.value && kcAuthenticated.value)

  const roles = computed(() => {
    const all = new Set<string>([...(kcRealmRoles.value || []), ...(kcApiRoles.value || [])])
    return Array.from(all)
  })

  const hasRole = (r: string) => roles.value.includes(r)

  const isAdmin = computed(() => hasRole('admin') || hasRole('ADMIN'))
  const isCaptain = computed(() => hasRole('captain') || hasRole('CAPTAIN'))

  const login = (redirectUri?: string) =>
    kc?.login({ redirectUri: redirectUri ?? window.location.href })

  const register = (redirectUri?: string) =>
    kc?.register({ redirectUri: redirectUri ?? window.location.href })

  const logout = () =>
    kc?.logout({ redirectUri: window.location.origin })

  return {
    kcReady,
    isAuthenticated,
    roles,
    isAdmin,
    isCaptain,
    login,
    register,
    logout,
  }
}
