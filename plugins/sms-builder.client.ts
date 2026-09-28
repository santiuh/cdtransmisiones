import type { SmsBuilder } from '~/utils/site-content'

// Corre el JS del constructor de secciones del panel (sliders, contadores,
// ventanas emergentes…) y, dentro del editor, su capa de edición (barra por
// sección, clic derecho, "+ Agregar sección"). Va DESPUÉS de que Vue hidrata: si
// el runtime tocara el DOM antes, la hidratación lo pisaría. Al navegar a otra
// página se vuelve a inicializar sobre lo nuevo (el runtime no repite lo ya armado).
export default defineNuxtPlugin((nuxtApp) => {
  const builder = useState<SmsBuilder | null>('smsBuilder', () => null)
  const pv = useState('smsPreview', () => ({ draft: false, edit: false, token: '' }))

  const correr = (id: string, js: string | undefined) => {
    if (!js || document.getElementById(id)) return
    const s = document.createElement('script')
    s.id = id
    s.textContent = js
    document.body.appendChild(s)
  }

  nuxtApp.hook('app:mounted', () => {
    const b = builder.value
    if (!b) return
    correr('sms-builder-js', b.js)
    // La capa de edición va sobre el inicio: las páginas nuevas se editan desde el panel.
    const ruta = nuxtApp.$router.currentRoute.value.path
    if (pv.value?.edit && ruta === '/') correr('sms-builder-edit', b.edit_js)
  })

  nuxtApp.hook('page:finish', () => {
    const w = window as unknown as { SMSB?: { init?: (root: Document) => void } }
    setTimeout(() => w.SMSB?.init?.(document), 0)
  })
})
