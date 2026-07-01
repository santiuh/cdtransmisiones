import { fetchSiteContent, type SmsEditableContent } from '~/utils/site-content'

// Trae el editable_content del panel UNA vez, en el server, y lo deja en useState
// (se transfiere al cliente por payload → sin refetch). Aplica overrides de SEO,
// custom_css y head_html. En modo preview (?__smsPreview=token) pide el borrador.
export default defineNuxtPlugin(async () => {
  const ec = useState<SmsEditableContent>('smsEc', () => ({}))
  const pv = useState('smsPreview', () => ({ draft: false, edit: false, token: '' }))

  if (import.meta.server) {
    const url = useRequestURL()
    const token = url.searchParams.get('__smsPreview') || ''
    const edit = url.searchParams.get('edit') === '1'
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

  useHead(
    {
      title: seo.title || undefined,
      meta: [...meta, ...extra.meta],
      link: [...link, ...extra.link],
      style,
      script: extra.script,
    },
    { tagPriority: 'high' },
  )
}
