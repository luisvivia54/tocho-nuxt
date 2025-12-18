// app/composables/useAuthRoles.ts
import { computed } from 'vue'

export function useAuthRoles() {
  // IMPORTANTE:
  // Tu plugin de Keycloak debe guardar aquí los roles de realm.
  // Por ejemplo en el login:
  //   const roles = keycloak.tokenParsed?.realm_access?.roles || []
  //   const kcRoles = useState<string[]>('kc-realm-roles', () => [])
  //   kcRoles.value = roles
  //
  const realmRoles = useState<string[]>('kc-realm-roles', () => [])

  const isAdmin = computed(() =>
    realmRoles.value.includes('admin') || realmRoles.value.includes('ADMIN')
  )

  const isCaptain = computed(() =>
    realmRoles.value.includes('captain') || realmRoles.value.includes('CAPTAIN')
  )

  return { realmRoles, isAdmin, isCaptain }
}
