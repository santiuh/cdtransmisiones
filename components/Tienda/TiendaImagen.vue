<script setup lang="ts">
// Foto de producto con fallback: si la URL del panel no carga, muestra el
// isotipo apagado en vez de un ícono roto (las fotos viven en public/img y en
// Storage del panel, no pasan por @nuxt/image → <img> plano).
const props = defineProps<{ src: string | null | undefined; alt: string; eager?: boolean }>();
const roto = ref(false);
const el = ref<HTMLImageElement | null>(null);
watch(
  () => props.src,
  () => {
    roto.value = false;
  },
);
// ⚠ Con SSR el navegador empieza a bajar la foto antes de hidratar: si el 404
// llega antes de que Vue enganche @error, el evento ya pasó. Al montar se
// revisa el estado real del <img> (complete + naturalWidth 0 = falló).
onMounted(() => {
  const img = el.value;
  if (img && img.complete && img.naturalWidth === 0 && props.src) roto.value = true;
});
const mostrar = computed(() => !roto.value && !!props.src);
</script>

<template>
  <div class="flex items-center justify-center overflow-hidden bg-white">
    <img
      v-if="mostrar"
      ref="el"
      :src="props.src || ''"
      :alt="props.alt"
      :loading="props.eager ? 'eager' : 'lazy'"
      :fetchpriority="props.eager ? 'high' : undefined"
      decoding="async"
      class="h-full w-full object-contain"
      @error="roto = true"
    />
    <img v-else src="/img/logononame.png" alt="" class="h-1/2 w-1/2 object-contain opacity-30" />
  </div>
</template>
