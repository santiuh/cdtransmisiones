<script setup lang="ts">
// Texto editable click-to-edit. Renderiza `tag` con data-sms-edit="k".
// Si el panel cargó un override (editable_content.bloques[k]) muestra ese texto;
// si no, muestra el contenido por defecto del slot (el copy original hardcodeado).
// class/data-aos/etc. se heredan al elemento raíz.
const props = defineProps<{ k: string; tag?: string }>()
const { bloque } = useEditable()
const override = computed(() => bloque(props.k, null))
</script>

<template>
  <component :is="props.tag || 'span'" :data-sms-edit="props.k">
    <template v-if="override !== null">{{ override }}</template>
    <slot v-else />
  </component>
</template>
