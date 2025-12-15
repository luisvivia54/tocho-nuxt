// utils/http.ts
export function cleanParams<T extends Record<string, any>>(params: T) {
    const out: Record<string, any> = {}
  
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue
      if (typeof v === 'number' && v === 0) continue
      if (typeof v === 'string') {
        const s = v.trim()
        if (!s || s.toLowerCase() === 'all') continue
        out[k] = s
        continue
      }
      out[k] = v
    }
  
    return out
  }
  