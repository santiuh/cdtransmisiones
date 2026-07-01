import type { SmsEditableContent } from '~/utils/site-content'

// Acceso al contenido editable del sitio (poblado SSR por plugins/00.sms-content).
// - `bloque(key, def)` → override de texto click-to-edit (editable_content.bloques[key]) o el default.
// - `img(key, def)`    → override de imagen (misma fuente, bloques[key] = URL pública).
// - `contacto/redes/seo/hero` → secciones estructuradas que edita el panel.
export function useEditable() {
  const ec = useState<SmsEditableContent>('smsEc', () => ({}))

  const bloques = (): Record<string, string> => {
    const b = ec.value?.bloques
    return b && typeof b === 'object' ? (b as Record<string, string>) : {}
  }

  function bloque<T extends string | null>(key: string, def: T = '' as T): string | T {
    const v = bloques()[key]
    return typeof v === 'string' && v.trim() ? v : def
  }

  function img(key: string, def = ''): string {
    return bloque(key, def) as string
  }

  const contacto = computed(() => ec.value?.contacto ?? {})
  const redes = computed(() => ec.value?.redes ?? {})
  const seo = computed(() => ec.value?.seo ?? {})
  const hero = computed(() => ec.value?.hero ?? {})

  return { ec, bloque, img, contacto, redes, seo, hero }
}
