import { computed } from 'vue'
import { useNuxtApp } from '#app'

export function useAuthz() {
  const { $kc } = useNuxtApp()
  const token = $kc?.tokenParsed as any | undefined

  const realmRoles = (token?.realm_access?.roles ?? []) as string[]
  const apiRoles   = (token?.spring_api_roles
                   ?? token?.resource_access?.['spring-api']?.roles
                   ?? []) as string[]

  const has = (role: string) => realmRoles.includes(role) || apiRoles.includes(role)
  const hasAny = (roles: string[]) => roles.some(has)

  const isAuthenticated = computed(() => $kc?.authenticated === true)
  const isAdmin         = computed(() => has('api_admin') || has('admin'))       // client o realm
  const isCaptain       = computed(() => has('captain') || has('api_captain'))    // si lo usas
  const isPlayer        = computed(() => has('player')  || has('api_player'))

  return { isAuthenticated, isAdmin, isCaptain, isPlayer, has, hasAny, realmRoles, apiRoles }
}
