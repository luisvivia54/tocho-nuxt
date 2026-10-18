// app/middleware/admin.ts
import { watch } from 'vue'

// Keycloak se inicializa en segundo plano (plugins/keycloak.client.ts). Al entrar
// directo a una URL de admin (o recargar), el middleware corre antes de que
// termine el init; sin esta espera los roles aún están vacíos y el admin
// terminaba redirigido a "/".
function waitForKeycloak(timeoutMs = 10000) {
  const kcReady = useState<boolean>('kcReady', () => false)
  if (kcReady.value) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const timer = setTimeout(done, timeoutMs)
    const stop = watch(kcReady, (ready) => {
      if (ready) done()
    })
    function done() {
      clearTimeout(timer)
      stop()
      resolve()
    }
  })
}

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  await waitForKeycloak()

  if (!useAuthz().isAdmin.value) return navigateTo('/')
})
