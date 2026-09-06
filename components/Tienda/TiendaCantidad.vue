<script setup lang="ts">
// Selector de cantidad (− n +) con tope. Emite update:modelValue siempre entre 1 y max.
const props = withDefaults(defineProps<{ modelValue: number; max?: number; chico?: boolean }>(), {
  max: 99,
  chico: false,
});
const emit = defineEmits<{ (e: "update:modelValue", v: number): void }>();

function fijar(v: number) {
  const n = Math.min(Math.max(1, Math.floor(v)), Math.max(1, props.max));
  if (n !== props.modelValue) emit("update:modelValue", n);
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-md border border-neutral-300 bg-white"
    :class="chico ? 'h-8' : 'h-10'"
    role="group"
    aria-label="Cantidad"
  >
    <button
      type="button"
      class="flex h-full items-center justify-center text-primary transition hover:bg-neutral-100 disabled:text-neutral-300"
      :class="chico ? 'w-8' : 'w-10'"
      :disabled="modelValue <= 1"
      aria-label="Quitar una unidad"
      @click="fijar(modelValue - 1)"
    >
      <TiendaIcono name="menos" class="h-4 w-4" />
    </button>
    <span class="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-neutral-800" aria-live="polite">
      {{ modelValue }}
    </span>
    <button
      type="button"
      class="flex h-full items-center justify-center text-primary transition hover:bg-neutral-100 disabled:text-neutral-300"
      :class="chico ? 'w-8' : 'w-10'"
      :disabled="modelValue >= max"
      aria-label="Agregar una unidad"
      @click="fijar(modelValue + 1)"
    >
      <TiendaIcono name="mas" class="h-4 w-4" />
    </button>
  </div>
</template>
