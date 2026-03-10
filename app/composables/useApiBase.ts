export function normalizeApiBase(base?: string): string {
  const raw = String(base || 'https://tocho5-api.tochero5.mx/api')
    .trim()
    .replace(/\/+$/, '')

  return raw.endsWith('/api') ? raw : `${raw}/api`
}