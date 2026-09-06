<script setup lang="ts">
// Cajón lateral (mobile) para los filtros. Bloquea el scroll del fondo.
const props = defineProps<{ modelValue: boolean; titulo: string }>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

function cerrar() {
  emit("update:modelValue", false);
}
watch(
  () => props.modelValue,
  (abierto) => {
    if (!import.meta.client) return;
    document.documentElement.classList.toggle("overflow-hidden", abierto);
  },
);
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.classList.remove("overflow-hidden");
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[70] lg:hidden">
        <button type="button" class="absolute inset-0 bg-black/50" aria-label="Cerrar" @click="cerrar" />
        <div
          class="absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          :aria-label="titulo"
        >
          <div class="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <p class="font-raleway text-lg font-semibold text-neutral-900">{{ titulo }}</p>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
              aria-label="Cerrar"
              @click="cerrar"
            >
              <TiendaIcono name="cerrar" class="h-5 w-5" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <slot />
          </div>
          <div class="border-t border-neutral-200 p-4">
            <button type="button" class="t-btn t-btn-primario w-full" @click="cerrar">Ver resultados</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
