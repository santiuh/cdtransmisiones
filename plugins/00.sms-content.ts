import { fetchSiteContent, type SmsEditableContent } from '~/utils/site-content'

// Trae el editable_content del panel UNA vez, en el server, y lo deja en useState
// (se transfiere al cliente por payload → sin refetch). Aplica overrides de SEO,
// custom_css y head_html. En modo preview (?__smsPreview=token) pide el borrador.
export default defineNuxtPlugin(async () => {
  const ec = useState<SmsEditableContent>('smsEc', () => ({}))
  const pv = useState('smsPreview', () => ({ draft: false, edit: false, token: '' }))

  if (import.meta.server) {
    // Leemos el query del req.url crudo (robusto en Vercel; useRequestURL/getQuery
    // no siempre traen el query en el runtime serverless).
    const ev = useRequestEvent()
    const raw = ev?.node?.req?.url || ''
    const qs = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : ''
    const params = new URLSearchParams(qs)
    const token = params.get('__smsPreview') || ''
    const edit = params.get('edit') === '1'
    const draft = !!token
    pv.value = { draft, edit, token }
    const cfg = useRuntimeConfig()
    ec.value = await fetchSiteContent(
      cfg.public.smsApiBase as string,
      cfg.public.smsSiteId as string,
      { draft, token },
    )
  }

  applySmsHead(ec.value, pv.value)
})

function sanitizeCss(css: string): string {
  return css
    .replace(/<\/?(style|script)\b[^>]*>/gi, '')
    .replace(/@import\b[^;]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript\s*:/gi, '')
    .slice(0, 20000)
}

// --- Tema global del editor (variables --sms-*) — espejo de shared/utils/site-theme.ts.
// El puente marca→--sms-* vive en assets/css/tailwind.css; acá inyectamos las
// variables que el cliente eligió en el panel + el <link> de Google Fonts.
const SMS_THEME_FONTS: Record<string, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  'Instrument Sans': "'Instrument Sans', system-ui, sans-serif",
  Manrope: "'Manrope', system-ui, sans-serif",
  Poppins: "'Poppins', system-ui, sans-serif",
  Montserrat: "'Montserrat', system-ui, sans-serif",
  'Work Sans': "'Work Sans', system-ui, sans-serif",
  'DM Sans': "'DM Sans', system-ui, sans-serif",
  Nunito: "'Nunito', system-ui, sans-serif",
  Karla: "'Karla', system-ui, sans-serif",
  Sora: "'Sora', system-ui, sans-serif",
  Outfit: "'Outfit', system-ui, sans-serif",
  'Space Grotesk': "'Space Grotesk', system-ui, sans-serif",
  'Bricolage Grotesque': "'Bricolage Grotesque', system-ui, sans-serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  Fraunces: "'Fraunces', Georgia, serif",
  Piazzolla: "'Piazzolla', Georgia, serif",
  Lora: "'Lora', Georgia, serif",
  Merriweather: "'Merriweather', Georgia, serif",
}
function hexColor(v: unknown): string {
  const s = typeof v === 'string' ? v.trim() : ''
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s) ? s.toLowerCase() : ''
}
function pxClamp(v: unknown, min: number, max: number): number | null {
  const n = Number(v)
  if (v === null || v === undefined || v === '' || !Number.isFinite(n)) return null
  return Math.min(max, Math.max(min, Math.round(n)))
}
function buildThemeVars(rawTheme: unknown): { css: string; fonts: string[] } {
  const t = (rawTheme && typeof rawTheme === 'object' ? rawTheme : {}) as Record<string, any>
  const colors = (t.colors && typeof t.colors === 'object' ? t.colors : {}) as Record<string, unknown>
  const fonts = (t.fonts && typeof t.fonts === 'object' ? t.fonts : {}) as Record<string, unknown>
  const sizes = (t.sizes && typeof t.sizes === 'object' ? t.sizes : {}) as Record<string, unknown>
  const decl: string[] = []
  const push = (n: string, v: string) => { if (v) decl.push(`${n}:${v}`) }
  push('--sms-c-bg', hexColor(colors.bg))
  push('--sms-c-text', hexColor(colors.text))
  push('--sms-c-accent', hexColor(colors.accent))
  push('--sms-c-button-bg', hexColor(colors.button_bg))
  push('--sms-c-button-text', hexColor(colors.button_text))
  const fontNames: string[] = []
  for (const [slot, raw] of [['title', fonts.title], ['text', fonts.text]] as const) {
    const name = typeof raw === 'string' ? raw : ''
    const stack = SMS_THEME_FONTS[name]
    if (stack) { decl.push(`--sms-f-${slot}:${stack}`); fontNames.push(name) }
  }
  const ts = pxClamp(sizes.title, 20, 96); if (ts !== null) decl.push(`--sms-fs-title:${ts}px`)
  const bs = pxClamp(sizes.text, 12, 24); if (bs !== null) decl.push(`--sms-fs-text:${bs}px`)
  const pw = pxClamp(t.page_width, 720, 1920); if (pw !== null) decl.push(`--sms-page-w:${pw}px`)
  if (!decl.length) return { css: '', fonts: [] }
  return { css: `:root{${decl.join(';')}}`, fonts: [...new Set(fontNames)] }
}

// Extrae <script>, <meta> y <link> del head_html (caso analytics/GTM/Pixel) y los
// mapea a useHead. HTML arbitrario fuera de esos tags se ignora (poco frecuente).
function extractHeadTags(html: string) {
  const script: Array<Record<string, unknown>> = []
  const meta: Array<Record<string, unknown>> = []
  const link: Array<Record<string, unknown>> = []
  if (!html) return { script, meta, link }
  const attrs = (s: string) => {
    const out: Record<string, string> = {}
    const re = /([a-zA-Z_:][-\w:.]*)\s*=\s*"([^"]*)"|([a-zA-Z_:][-\w:.]*)\s*=\s*'([^']*)'/g
    let m: RegExpExecArray | null
    while ((m = re.exec(s))) out[(m[1] || m[3]) as string] = (m[2] ?? m[4] ?? '') as string
    return out
  }
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let sm: RegExpExecArray | null
  while ((sm = scriptRe.exec(html))) {
    const a = attrs(sm[1] || '')
    const inner = (sm[2] || '').trim()
    if (a.src) script.push({ src: a.src, async: 'async' in a || undefined, defer: 'defer' in a || undefined })
    else if (inner) script.push({ innerHTML: inner })
  }
  const metaRe = /<meta\b([^>]*)\/?>/gi
  let mm: RegExpExecArray | null
  while ((mm = metaRe.exec(html))) meta.push(attrs(mm[1] || ''))
  const linkRe = /<link\b([^>]*)\/?>/gi
  let lm: RegExpExecArray | null
  while ((lm = linkRe.exec(html))) link.push(attrs(lm[1] || ''))
  return { script, meta, link }
}

function applySmsHead(ec: SmsEditableContent, pv: { draft: boolean }) {
  const seo = ec?.seo || {}
  const meta: Array<Record<string, unknown>> = []
  const link: Array<Record<string, unknown>> = []

  if (seo.description) meta.push({ name: 'description', content: seo.description })
  const ogT = seo.og_title || seo.title
  const ogD = seo.og_description || seo.description
  if (ogT) meta.push({ property: 'og:title', content: ogT })
  if (ogD) meta.push({ property: 'og:description', content: ogD })
  if (seo.og_image) {
    meta.push({ property: 'og:image', content: seo.og_image })
    meta.push({ name: 'twitter:image', content: seo.og_image })
  }
  if (seo.favicon) link.push({ rel: 'icon', href: seo.favicon })
  if (pv?.draft) meta.push({ name: 'robots', content: 'noindex, nofollow' })

  const css = sanitizeCss(String(ec?.custom_css || ''))
  const style = css ? [{ innerHTML: css }] : []
  const extra = extractHeadTags(String(ec?.head_html || ''))

  // Tema global: variables --sms-* al final del <head> (id fijo evita duplicar
  // server+client) + <link> de la fuente elegida. Va ANTES del custom_css para
  // que ese CSS avanzado siga ganando.
  const th = buildThemeVars(ec?.theme)
  const themeStyle = th.css ? [{ id: 'sms-theme-css', innerHTML: th.css }] : []
  // Alto de la barra de anuncio (para offsetear los headers fixed). Default SSR
  // razonable; el componente lo refina client-side por su alto real. Solo si activa.
  const annActive = (ec?.announcement as { active?: boolean } | undefined)?.active === true
  const annStyle = annActive ? [{ id: 'sms-ann-h', innerHTML: ':root{--sms-ann-h:2.25rem}' }] : []
  const fontLinks = th.fonts.length
    ? [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: `https://fonts.googleapis.com/css2?${th.fonts
            .map((n) => 'family=' + encodeURIComponent(n).replace(/%20/g, '+') + ':wght@400;600;700;800')
            .join('&')}&display=swap`,
        },
      ]
    : []

  useHead(
    {
      title: seo.title || undefined,
      meta: [...meta, ...extra.meta],
      link: [...link, ...extra.link, ...fontLinks],
      style: [...themeStyle, ...annStyle, ...style],
      script: extra.script,
    },
    { tagPriority: 'high' },
  )
}
