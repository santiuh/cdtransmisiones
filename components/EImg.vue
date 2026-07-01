<script setup lang="ts">
// Imagen editable click-to-edit. Renderiza un <img> plano (no NuxtImg) con
// data-sms-edit-img="k" para que el override del panel (URL pública de Storage)
// funcione sin config de dominios externos. class/etc. se heredan al <img>.
const props = defineProps<{ k: string; src?: string; alt?: string }>()
const { img } = useEditable()
const resolved = computed(() => img(props.k, props.src || ''))
</script>

<template>
  <img :data-sms-edit-img="props.k" :src="resolved" :alt="props.alt || ''" loading="lazy" decoding="async" />
</template>
