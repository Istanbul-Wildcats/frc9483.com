/** Panel-entered web address -> safe absolute http(s) URL, or undefined (blank / not a web address). */
export function webUrl(raw: string | null | undefined): string | undefined {
  const v = raw?.trim()
  if (!v) return undefined
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : undefined
  } catch {
    return undefined
  }
}
