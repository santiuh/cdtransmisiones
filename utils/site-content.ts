// Cliente del endpoint público de Sol de Mayo Soft que sirve el contenido
// editable (`editable_content`) de este sitio. Se consume SSR (nunca desde el
// browser del visitante). En modo borrador (`draft`) pide el editable_content_draft
// pasando el token de preview firmado que emite el panel.
export interface SmsEditableContent {
  bloques?: Record<string, string>
  images?: Record<string, string>
  contacto?: {
    contactos?: Array<{ etiqueta?: string; telefono?: string; email?: string; whatsapp?: string }>
    direccion?: string
  }
  redes?: Record<string, string>
  seo?: {
    title?: string
    description?: string
    og_title?: string
    og_description?: string
    og_image?: string
    favicon?: string
  }
  head_html?: string
  custom_css?: string
  hero?: { titulo?: string; subtitulo?: string }
  [k: string]: unknown
}

export async function fetchSiteContent(
  apiBase: string,
  siteId: string,
  opts: { draft?: boolean; token?: string } = {},
): Promise<SmsEditableContent> {
  const base = (apiBase || 'https://soldemayosoft.com').replace(/\/$/, '')
  const qs = opts.draft ? `?draft=1&token=${encodeURIComponent(opts.token || '')}` : ''
  const url = `${base}/api/public/sites/${siteId}/data${qs}`
  try {
    const json = await $fetch<{ editable_content?: SmsEditableContent }>(url, { timeout: 8000 })
    const ec = json?.editable_content
    return ec && typeof ec === 'object' ? ec : {}
  } catch (e) {
    // Publicado: degradar a defaults del código (nunca romper el sitio).
    // Borrador: también degradamos para no romper la preview si el token venció.
    if (import.meta.dev) console.warn('[sms] no se pudo traer el contenido:', (e as Error)?.message)
    return {}
  }
}
