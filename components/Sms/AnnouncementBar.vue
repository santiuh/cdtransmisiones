<script setup>
// Barra de anuncio (texto) del editor — global, arriba de todo (layout).
// Espejo de buildAnnouncementBar del motor central. Vacía → no renderiza.
import { safeHref } from '~/utils/safe-href'

const { announcement } = useEditable()

const msgs = computed(() =>
  (announcement.value?.messages || [])
    .map((m) => ({ text: String(m?.text || '').trim(), href: safeHref(m?.link) }))
    .filter((m) => m.text)
    .slice(0, 3),
)
const active = computed(() => announcement.value?.active === true && msgs.value.length > 0)
const marquee = computed(() => announcement.value?.marquee === true)
const isHex = (v) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(String(v || ''))
const bg = computed(() => (isHex(announcement.value?.bg) ? announcement.value.bg : 'var(--c-orange, #E2762D)'))
const fg = computed(() => (isHex(announcement.value?.text_color) ? announcement.value.text_color : '#ffffff'))
// Marquee: triplicamos para el loop continuo.
const track = computed(() => (marquee.value ? [...msgs.value, ...msgs.value, ...msgs.value] : msgs.value))

// Los headers son `fixed` → publican su offset leyendo --sms-ann-h. Medimos el
// alto real de la barra y lo escribimos en :root (el plugin ya pone un default
// SSR ~2.25rem para evitar solape en el primer paint). Se limpia al desmontar.
const root = ref(null)
let ro = null
function publishHeight() {
  if (typeof document === 'undefined' || !root.value) return
  document.documentElement.style.setProperty('--sms-ann-h', root.value.offsetHeight + 'px')
}
onMounted(() => {
  publishHeight()
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    ro = new ResizeObserver(publishHeight)
    ro.observe(root.value)
  }
})
onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  if (typeof document !== 'undefined') document.documentElement.style.removeProperty('--sms-ann-h')
})
</script>

<template>
  <div
    v-if="active"
    id="sms-announcement"
    ref="root"
    class="sms-ann"
    :class="{ 'sms-ann-marquee': marquee }"
    role="region"
    aria-label="Anuncio"
    :style="{ background: bg, color: fg }"
  >
    <div v-if="marquee" class="sms-ann-track">
      <template v-for="(m, i) in track" :key="i">
        <a v-if="m.href" class="sms-ann-msg" :href="m.href">{{ m.text }}</a>
        <span v-else class="sms-ann-msg">{{ m.text }}</span>
      </template>
    </div>
    <div v-else class="sms-ann-static">
      <template v-for="(m, i) in msgs" :key="i">
        <a v-if="m.href" class="sms-ann-msg" :href="m.href">{{ m.text }}</a>
        <span v-else class="sms-ann-msg">{{ m.text }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sms-ann {
  font-weight: 600;
  font-size: 0.82rem;
  line-height: 1.3;
  overflow: hidden;
}
.sms-ann a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.sms-ann-static {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 2rem;
  padding: 0.55rem 1rem;
  text-align: center;
}
.sms-ann-track {
  display: flex;
  gap: 3rem;
  width: max-content;
  padding: 0.55rem 0;
  animation: sms-ann-scroll 18s linear infinite;
}
.sms-ann-track .sms-ann-msg {
  white-space: nowrap;
}
.sms-ann-marquee:hover .sms-ann-track {
  animation-play-state: paused;
}
@keyframes sms-ann-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% / 3));
  }
}
@media (prefers-reduced-motion: reduce) {
  .sms-ann-track {
    animation: none;
  }
}
</style>
