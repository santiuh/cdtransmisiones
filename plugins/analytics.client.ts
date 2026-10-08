/**
 * Beacon de visitas del panel (analytics 051/052/053, tiempo y scroll desde la 070).
 *
 * Los sitios express llevan el snippet que hornea `build.mjs`; este es una app
 * Nuxt, así que los hits salen de acá contra el MISMO endpoint público
 * (`/api/public/sites/<identifier>/hit`). El identifier y la base salen del
 * runtimeConfig — los mismos que usa `00.sms-content.ts`, una sola fuente.
 *
 * Manda un pageview al cargar (y en cada ruta nueva), un evento `contact`
 * cuando el visitante toca WhatsApp / teléfono / mail / Instagram / mapa, y un
 * `engagement` al dejar cada página: el tiempo ACTIVO (pestaña visible y con
 * alguien del otro lado en el último minuto) y hasta dónde bajó. Con eso la
 * ficha de Estadísticas del panel muestra tiempo, scroll y un rebote que no
 * cuenta como "se fue" a quien leyó dos minutos.
 *
 * SIN COOKIES y sin localStorage: no guarda NADA en el navegador (al visitante
 * lo identifica el server con un hash diario — migración 051). Por eso no
 * necesita aviso de cookies.
 *
 * Decisiones que no son obvias:
 *  - `text/plain` en el Blob A PROPÓSITO: con `application/json` el navegador
 *    dispara un preflight OPTIONS ANTES de cada pageview. No "arreglarlo".
 *  - No corre dentro de un iframe: el panel muestra el sitio embebido y esas no
 *    son visitas reales.
 *  - No corre en `*.vercel.app` ni en la preview del borrador (`__smsPreview`):
 *    ese es tráfico nuestro, no del cliente. Cualquier OTRO host sí mide, así
 *    que mudar el dominio no apaga la medición en silencio.
 *  - En una navegación interna el referrer es la página anterior del propio
 *    sitio (el server la descarta): `document.referrer` en una SPA nunca cambia
 *    y sumaría otra visita a la fuente original por cada página siguiente.
 *  - Todo en try/catch y sin `await`: el analytics jamás rompe la página.
 */

const CONTACTOS: Array<[RegExp, string]> = [
  [/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i, 'whatsapp'],
  [/^tel:/i, 'tel'],
  [/^mailto:/i, 'email'],
  [/^https?:\/\/(www\.)?instagram\.com/i, 'instagram'],
  [/^https?:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+)/i, 'maps'],
]

/** Sin señales de vida en este tiempo, una pestaña visible deja de sumar. */
const INACTIVA_MS = 60_000

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
  let campaign = ''
  try {
    const qs = new URLSearchParams(location.search)
    utm = qs.get('utm_source') || ''
    campaign = qs.get('utm_campaign') || ''
  } catch { /* querystring roto: sin utm */ }

  let referrer = ''
  try {
    referrer = document.referrer || ''
  } catch { /* sin referrer */ }

  // Última ruta contada: evita el doble hit si el router también dispara para la
  // navegación inicial.
  let ultima = ''

  function send(payload: Record<string, string | number>, path: string) {
    try {
      // El origen (referrer, utm) va con las vistas y los contactos; el tiempo
      // de una página no lo necesita.
      const origen = payload.k === 'engagement'
        ? {}
        : { r: referrer, ...(utm ? { s: utm } : {}), ...(campaign ? { c: campaign } : {}) }
      const body = new Blob([JSON.stringify({ ...payload, p: path, ...origen })], {
        type: 'text/plain;charset=UTF-8',
      })
      if (navigator.sendBeacon) navigator.sendBeacon(url, body)
      else void fetch(url, { method: 'POST', body, keepalive: true, mode: 'no-cors' })
    } catch { /* el analytics jamás rompe la página */ }
  }

  // ── Tiempo activo + scroll de la página actual ─────────────────────────────
  let pagina = '' // la que se está midiendo
  let activoMs = 0
  let scrollMax = 0
  let ultimaSenal = Date.now()

  function medirScroll() {
    try {
      const alto = document.documentElement.scrollHeight
      if (!alto) return
      const pct = Math.min(100, ((window.scrollY + window.innerHeight) / alto) * 100)
      if (pct > scrollMax) scrollMax = pct
    } catch { /* nada */ }
  }

  /** Manda lo acumulado de la página actual y pone el contador en cero. */
  function flush() {
    if (!pagina || activoMs < 1000) {
      activoMs = 0
      return
    }
    send({ k: 'engagement', d: activoMs, sc: Math.round(scrollMax) }, pagina)
    activoMs = 0
  }

  function pageview(path: string) {
    if (path === ultima) return
    // Lo de la página que se deja se cierra ANTES de contar la nueva.
    flush()
    ultima = path
    pagina = path
    scrollMax = 0
    ultimaSenal = Date.now()
    send({ k: 'pageview' }, path)
    // Ya consumimos el referrer externo: la próxima vista viene de ESTA página
    // (el server la descarta por self-referral y queda "directo", como en un
    // sitio multipágina).
    referrer = `${location.origin}${path}`
    // En una SPA la ruta cambia antes que el contenido: se mide cuando la
    // página nueva ya está pintada (si entra entera en la pantalla, es 100 %).
    setTimeout(medirScroll, 1000)
  }

  nuxtApp.hook('app:mounted', () => {
    pageview(location.pathname)
    // La primera medición, con las fotos ya cargadas: antes, una página que
    // todavía no creció daba "bajó hasta el 90 %" sin que nadie tocara nada.
    if (document.readyState === 'complete') medirScroll()
    else window.addEventListener('load', medirScroll, { once: true })

    setInterval(() => {
      if (pagina && document.visibilityState === 'visible' && Date.now() - ultimaSenal < INACTIVA_MS) {
        activoMs += 1000
      }
    }, 1000)

    let pendiente = false
    const senal = () => {
      ultimaSenal = Date.now()
    }
    window.addEventListener(
      'scroll',
      () => {
        senal()
        if (pendiente) return
        pendiente = true
        requestAnimationFrame(() => {
          pendiente = false
          medirScroll()
        })
      },
      { passive: true },
    )
    for (const ev of ['pointermove', 'pointerdown', 'keydown', 'touchstart'] as const) {
      window.addEventListener(ev, senal, { passive: true })
    }
    // Pestaña oculta o cerrada: se manda lo acumulado (el sendBeacon sobrevive
    // al cierre). Si vuelve, sigue sumando y se manda otro tramo después.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
      else senal()
    })
    window.addEventListener('pagehide', flush)

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
