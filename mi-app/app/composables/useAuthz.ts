// app/composables/useAuthz.ts
import { computed } from 'vue'
import { useState } from '#imports'

export function useAuthz() {
  const kcAuthenticated = useState<boolean>('kcAuthenticated', () => false)
  const kcRealmRoles = useState<string[]>('kcRealmRoles', () => [])
  const kcApiRoles = useState<string[]>('kcApiRoles', () => [])

  const has = (role: string) =>
    kcRealmRoles.value.includes(role) || kcApiRoles.value.includes(role)

  const hasAny = (roles: string[]) => roles.some(has)

  const isAuthenticated = computed(() => kcAuthenticated.value)
  const isAdmin = computed(() => has('admin') || has('api_admin'))
  const isCaptain = computed(() => has('captain') || has('api_captain'))
  const isPlayer = computed(() => has('player') || has('api_player'))

  return {
    isAuthenticated,
    isAdmin,
    isCaptain,
    isPlayer,
    has,
    hasAny,
    realmRoles: kcRealmRoles,
    apiRoles: kcApiRoles,
  }
}
