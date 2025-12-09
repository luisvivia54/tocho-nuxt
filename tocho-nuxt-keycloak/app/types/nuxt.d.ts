// types/nuxt.d.ts
import type Keycloak from 'keycloak-js'
import type { Ref } from 'vue'

declare module '#app' {
  interface NuxtApp {
    $kc: Keycloak
    $kcReady: Ref<boolean>
    $kcGetToken: () => Promise<string>
  }
}
export {}
