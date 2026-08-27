/**
 * Beacon de visitas del panel (analytics 051/052/053).
 *
 * Los sitios express llevan el snippet que hornea `build.mjs`; este es una app
 * Nuxt, así que los hits salen de acá contra el MISMO endpoint público
 * (`/api/public/sites/<identifier>/hit`). El identifier y la base salen del
 * runtimeConfig — los mismos que usa `00.sms-content.ts`, una sola fuente.
 *
 * Manda un pageview al cargar y un evento `contact` cuando el visitante toca
 * WhatsApp / teléfono / mail / Instagram / mapa. Ese segundo evento es el que le
 * importa al cliente: "45 personas te tocaron el WhatsApp".
 *
 * SIN COOKIES y sin localStorage: no guarda NADA en el navegador (al visitante
 * lo identifica el server con un hash diario — migración 051). Por eso no
 * necesita aviso de cookies.
 *
 * Cuatro decisiones que no son obvias:
 *  - `text/plain` en el Blob A PROPÓSITO: con `application/json` el navegador
 *    dispara un preflight OPTIONS ANTES de cada pageview. No "arreglarlo".
 *  - No corre dentro de un iframe: el panel muestra el sitio embebido y esas no
 *    son visitas reales.
 *  - No corre en `*.vercel.app` ni en la preview del borrador (`__smsPreview`):
 *    ese es tráfico nuestro, no del cliente. Cualquier OTRO host sí mide, así
 *    que mudar el dominio no apaga la medición en silencio.
 *  - Todo en try/catch y sin `await`: el analytics jamás rompe la página.
 */

const CONTACTOS: Array<[RegExp, string]> = [
  [/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i, 'whatsapp'],
  [/^tel:/i, 'tel'],
  [/^mailto:/i, 'email'],
  [/^https?:\/\/(www\.)?instagram\.com/i, 'instagram'],
  [/^https?:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+)/i, 'maps'],
]

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) return

  const cfg = useRuntimeConfig().public
  const site = (cfg.smsSiteId as string) || ''
  const base = ((cfg.smsApiBase as string) || 'https://soldemayosoft.com').replace(/\/$/, '')
  if (!site || !base) return

  try {
    if (window.top !== window.self) return // embebido en el panel
    if (location.hostname.toLowerCase().endsWith('.vercel.app')) return // preview/alias nuestro
    if (new URLSearchParams(location.search).has('__smsPreview')) return // borrador del editor
  } catch {
    return
  }

  const url = `${base}/api/public/sites/${encodeURIComponent(site)}/hit`

  let utm = ''
  try {
    utm = new URLSearchParams(location.search).get('utm_source') || ''
  } catch { /* querystring roto: sin utm */ }

  let referrer = ''
  try {
    referrer = document.referrer || ''
  } catch { /* sin referrer */ }

  // Última ruta contada: evita el doble hit si el router también dispara para la
  // navegación inicial.
  let ultima = ''

  function send(payload: Record<string, string>, path: string) {
    try {
      const body = new Blob(
        [JSON.stringify({ ...payload, p: path, r: referrer, ...(utm ? { s: utm } : {}) })],
        { type: 'text/plain;charset=UTF-8' },
      )
      if (navigator.sendBeacon) navigator.sendBeacon(url, body)
      else void fetch(url, { method: 'POST', body, keepalive: true, mode: 'no-cors' })
    } catch { /* el analytics jamás rompe la página */ }
  }

  function pageview(path: string) {
    if (path === ultima) return
    ultima = path
    send({ k: 'pageview' }, path)
    // Ya consumimos el referrer externo: la próxima vista viene de ESTA página
    // (el server la descarta por self-referral y queda "directo", como en un
    // sitio multipágina).
    referrer = `${location.origin}${path}`
  }

  nuxtApp.hook('app:mounted', () => {
    pageview(location.pathname)

    document.addEventListener(
      'click',
      (ev) => {
        try {
          const a = (ev.target as Element | null)?.closest?.('a[href]')
          if (!a) return
          const href = a.getAttribute('href') || ''
          for (const [re, target] of CONTACTOS) {
            if (re.test(href)) {
              send({ k: 'contact', t: target }, location.pathname)
              return
            }
          }
        } catch { /* un clic no puede romper nada */ }
      },
      true,
    )
  })

  // Sitio de una sola página: el router puede no existir (sin `pages/` Nuxt no
  // incluye vue-router). Si está, cada ruta nueva es una vista.
  try {
    const router = (nuxtApp as unknown as { $router?: { afterEach?: (cb: (to: { path: string }) => void) => void } }).$router
    router?.afterEach?.((to) => pageview(to.path))
  } catch { /* sin router: alcanza con el pageview inicial */ }
})
