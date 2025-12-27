// app/plugins/keycloak.client.ts
import Keycloak from 'keycloak-js'
import { defineNuxtPlugin, useState, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // 1) Instancia de Keycloak leyendo de nuxt.config.ts
  const kc = new Keycloak({
    url: config.public.keycloakUrl ?? 'https://auth.tochero5.mx',
    realm: config.public.keycloakRealm ?? 'tochero5',
    clientId: config.public.keycloakClientId ?? 'nuxt-app',
  })

  // 2) Estados globales compartidos con useAuthz()
  const kcReady = useState<boolean>('kcReady', () => false)
  const kcAuthenticated = useState<boolean>('kcAuthenticated', () => false)
  const kcRealmRoles = useState<string[]>('kcRealmRoles', () => [])
  const kcApiRoles = useState<string[]>('kcApiRoles', () => [])

  // 3) Función para sincronizar token → estados
  const syncFromToken = () => {
    const token = kc.tokenParsed as any | undefined

    if (!token) {
      kcAuthenticated.value = false
      kcRealmRoles.value = []
      kcApiRoles.value = []
      return
    }

    kcAuthenticated.value = kc.authenticated === true

    const realmRoles = (token.realm_access?.roles ?? []) as string[]
    const apiRoles =
      (token.spring_api_roles ??
        token.resource_access?.['spring-api']?.roles ??
        []) as string[]

    kcRealmRoles.value = realmRoles
    kcApiRoles.value = apiRoles
  }

  const scheduleRefresh = () => {
    const tick = async () => {
      try {
        await kc.updateToken(60)
        // cada vez que refrescamos, volvemos a sincronizar
        syncFromToken()
      } catch (e) {
        console.warn('No se pudo refrescar el token:', e)
      }
    }
    setInterval(tick, 20000)
  }

  const kcGetToken = async (): Promise<string> => {
    try {
      await kc.updateToken(30)
      syncFromToken()
    } catch (e) {
      console.warn('No se pudo actualizar token antes de kcGetToken:', e)
    }
    return kc.token ?? ''
  }

  // 4) Eventos de Keycloak (login/logout/refresh)
  kc.onAuthSuccess = () => {
    syncFromToken()
  }

  kc.onAuthRefreshSuccess = () => {
    syncFromToken()
  }

  kc.onAuthLogout = () => {
    kcAuthenticated.value = false
    kcRealmRoles.value = []
    kcApiRoles.value = []
  }

  const init = async () => {
    try {
      await kc.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      })
      // después de init, sincronizamos el token actual (si lo hay)
      syncFromToken()
    } catch (e) {
      console.warn('Keycloak init falló (seguimos sin sesión):', e)
    } finally {
      kcReady.value = true
      scheduleRefresh()
    }
  }

  init()

  return {
    provide: {
      kc,
      kcReady,
      kcGetToken,
    },
  }
})
