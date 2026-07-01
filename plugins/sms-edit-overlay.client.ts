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

  const scan = () => {
    injectStyle()
    document.querySelectorAll<HTMLElement>('[data-sms-edit]').forEach(bindText)
    document.querySelectorAll<HTMLElement>('[data-sms-edit-img]').forEach(bindImg)
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
  }

  nuxtApp.hook('app:mounted', () => {
    window.addEventListener('message', onMessage)
    scan()
    send({ type: 'ready' })
  })
  // Re-escanear al navegar dentro del sitio en modo edición (nuevos elementos).
  nuxtApp.hook('page:finish', () => nextTick(scan))
})
