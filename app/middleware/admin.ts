// app/middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  if (process.server) return
  const authz = useAuthz()

  const isAdmin = (() => {
    const v = (authz as any).isAdmin
    if (typeof v === 'boolean') return v
    if (v && typeof v === 'object' && 'value' in v) return !!(v as any).value
    return false
  })()

  if (!isAdmin) return navigateTo('/')
})
