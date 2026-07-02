// href seguro para links del cliente (barra de anuncio): allowlist de esquemas.
// Bloquea javascript:/data:/vbscript:. Espejo de shared/utils/safe-href.ts de la
// plataforma Sol de Mayo Soft.
export function safeHref(raw: unknown): string {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s
  if (/^(\/|#|\.\/|\.\.\/)/.test(s)) return s
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return ''
  return s
}
