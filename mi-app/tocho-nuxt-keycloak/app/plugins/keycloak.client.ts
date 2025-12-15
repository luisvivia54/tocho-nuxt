// plugins/keycloak.client.ts
import Keycloak from 'keycloak-js'
import { defineNuxtPlugin, useState } from '#imports'

export default defineNuxtPlugin(() => {
  const kc = new Keycloak({
    url: 'https://auth.tochero5.mx',   // <-- AJUSTA si tu Keycloak está en otra URL
    realm: 'tochero5',                // <-- AJUSTA el realm
    clientId: 'nuxt-app'            // <-- AJUSTA el clientId del SPA
  })

  const kcReady = useState('kcReady', () => false)

  const scheduleRefresh = () => {
    const tick = async () => {
      try { await kc.updateToken(60) } catch { /* opcional: kc.login() */ }
    }
    setInterval(tick, 20000) // intenta renovar si faltan <60s
  }

  const kcGetToken = async (): Promise<string> => {
    try { await kc.updateToken(30) } catch { /* opcional: kc.login() */ }
    return kc.token ?? ''
  }

  const init = async () => {
    try {
      await kc.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false // evita pings periódicos que a veces fallan en dev
      })
    } catch (e) {
      console.warn('Keycloak init falló (seguimos sin sesión):', e)
    } finally {
      kcReady.value = true // <-- ¡nunca más “Inicializando…” infinito!
      scheduleRefresh()
    }
  }

  init()

  return { provide: { kc, kcReady, kcGetToken } }
})
