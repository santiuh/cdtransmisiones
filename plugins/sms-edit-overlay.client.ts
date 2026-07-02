// Overlay de edición visual (click-to-edit). Sólo se activa cuando el sitio se
// abre en modo preview con edición (?__smsPreview=token&edit=1), es decir dentro
// del iframe del panel de Sol de Mayo Soft. Port de buildEditOverlay() del template
// express: mismo protocolo postMessage que espera contenido.vue del panel.
export default defineNuxtPlugin((nuxtApp) => {
  const pv = useState('smsPreview', () => ({ draft: false, edit: false, token: '' }))
  if (!pv.value?.edit) return

  const bound = new WeakSet<Element>()

  const injectStyle = () => {
    if (document.getElementById('sms-edit-style')) return
    const style = document.createElement('style')
    style.id = 'sms-edit-style'
    style.textContent = `
      [data-sms-edit],[data-sms-edit-img]{outline:2px dashed transparent;outline-offset:3px;border-radius:2px;transition:outline-color .15s}
      [data-sms-edit]:hover{outline-color:#e8a838;cursor:text}
      [data-sms-edit-img]:hover{outline-color:#e8a838;cursor:pointer}
      [data-sms-edit][contenteditable]{outline-color:#3d6b4e!important;cursor:text}
      .sms-sec-rel{position:relative}
      .sms-sec-target:hover{outline:2px solid #4f7df2;outline-offset:-2px;cursor:pointer}
      .sms-sec-chip{position:absolute;top:6px;left:6px;z-index:2147483000;background:#4f7df2;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:4px 8px;border-radius:6px;pointer-events:none;opacity:0;transition:opacity .15s}
      .sms-sec-target:hover>.sms-sec-chip{opacity:1}
      [data-sms-section],#sms-announcement{scroll-margin-top:120px}
    `
    document.head.appendChild(style)
  }

  const send = (msg: Record<string, unknown>) => {
    try {
      parent.postMessage(Object.assign({ source: 'sms-edit' }, msg), '*')
    } catch {
      /* noop */
    }
  }

  const bindText = (el: HTMLElement) => {
    if (bound.has(el)) return
    bound.add(el)
    el.addEventListener('click', (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      if (el.getAttribute('contenteditable')) return
      el.setAttribute('contenteditable', 'plaintext-only')
      el.focus()
    })
    let t: ReturnType<typeof setTimeout>
    el.addEventListener('input', () => {
      clearTimeout(t)
      t = setTimeout(() => send({ type: 'text', key: el.getAttribute('data-sms-edit'), value: el.innerText }), 400)
    })
    el.addEventListener('blur', () => {
      clearTimeout(t)
      send({ type: 'text', key: el.getAttribute('data-sms-edit'), value: el.innerText })
      el.removeAttribute('contenteditable')
    })
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !/^(P|DIV|LI)$/.test(el.tagName)) {
        ev.preventDefault()
        el.blur()
      }
      if (ev.key === 'Escape') el.blur()
    })
  }

  const bindImg = (el: HTMLElement) => {
    if (bound.has(el)) return
    bound.add(el)
    el.addEventListener('click', (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      send({ type: 'image-request', key: el.getAttribute('data-sms-edit-img') })
    })
  }

  // Click en sección → el panel abre su sub-panel (paridad Tienda Nube).
  // Secciones normales: solo áreas NO interactivas. Barra de anuncio (managed):
  // TODO click abre el panel — fase captura para bloquear links internos.
  const INTERACTIVE =
    '[data-sms-edit],[data-sms-edit-img],a,button,input,select,textarea,label,[data-reservar]'

  const ensureChip = (el: HTMLElement, label: string) => {
    // Vue puede pisar el chip al re-renderizar el componente: re-inyectar si falta.
    if (el.querySelector(':scope > .sms-sec-chip')) return
    const chip = document.createElement('span')
    chip.className = 'sms-sec-chip'
    chip.textContent = label
    el.appendChild(chip)
  }

  const bindSection = (el: HTMLElement, key: string, label: string, managed: boolean) => {
    ensureChip(el, label)
    if (bound.has(el)) return
    bound.add(el)
    el.classList.add('sms-sec-target')
    // No forzar position en elementos ya posicionados (la barra es sticky).
    if (getComputedStyle(el).position === 'static') el.classList.add('sms-sec-rel')
    el.addEventListener(
      'click',
      (ev) => {
        if (!managed) {
          const t = (ev.target as HTMLElement | null)?.closest?.(INTERACTIVE)
          if (t && t !== el && el.contains(t)) return
        }
        ev.preventDefault()
        ev.stopPropagation()
        send({ type: 'open-section', key, label })
      },
      managed, // fase captura para los managed
    )
  }

  const scan = () => {
    injectStyle()
    document.querySelectorAll<HTMLElement>('[data-sms-edit]').forEach(bindText)
    document.querySelectorAll<HTMLElement>('[data-sms-edit-img]').forEach(bindImg)
    document.querySelectorAll<HTMLElement>('[data-sms-section]').forEach((el) => {
      const k = el.getAttribute('data-sms-section') || ''
      if (k) bindSection(el, k, el.getAttribute('data-sms-section-label') || k, false)
    })
    const ann = document.getElementById('sms-announcement')
    if (ann) bindSection(ann, 'anuncio', 'Barra de anuncio', true)
  }

  const onMessage = (ev: MessageEvent) => {
    const d = (ev.data || {}) as { source?: string; type?: string; key?: string; url?: string }
    if (d.source === 'sms-panel' && d.type === 'set-image' && d.url) {
      const key = String(d.key || '').replace(/[^\w.\-]/g, '')
      const el = document.querySelector<HTMLElement>(`[data-sms-edit-img="${key}"]`)
      if (!el) return
      if (el.tagName === 'IMG') el.setAttribute('src', d.url)
      else el.innerHTML = `<img src="${d.url}" alt="" class="w-full h-full object-cover">`
    }
    if (d.source === 'sms-panel' && d.type === 'scroll-to-section' && d.key) {
      const kk = String(d.key).replace(/[^\w.\-]/g, '')
      const tg =
        kk === 'anuncio'
          ? document.getElementById('sms-announcement')
          : kk === 'banner'
            ? document.getElementById('sms-banner')
            : document.querySelector<HTMLElement>(`[data-sms-section="${kk}"]`)
      if (tg) tg.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  nuxtApp.hook('app:mounted', () => {
    window.addEventListener('message', onMessage)
    scan()
    send({ type: 'ready' })
  })
  // Re-escanear al navegar dentro del sitio en modo edición (nuevos elementos).
  nuxtApp.hook('page:finish', () => nextTick(scan))
})
