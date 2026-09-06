<script setup lang="ts">
// Aviso flotante del carrito ("Agregaste X al carrito · Ver carrito"), a lo ML.
// Vive en el layout: además carga el carrito desde localStorage al montar.
const { aviso, cargar } = useCarrito();
const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => aviso.value?.id,
  (id) => {
    if (!id) return;
    visible.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      visible.value = false;
    }, 3500);
  },
);
onMounted(cargar);
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="visible && aviso"
      class="fixed left-1/2 z-[65] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-md bg-emerald-700 px-4 py-3 text-sm text-white shadow-xl"
      style="top: calc(var(--sms-ann-h, 0px) + 4.5rem)"
      role="status"
      aria-live="polite"
    >
      <TiendaIcono name="check" class="h-5 w-5 shrink-0" />
      <span class="min-w-0 flex-1 truncate">{{ aviso.texto }}</span>
      <NuxtLink v-if="aviso.link" :to="aviso.link" class="shrink-0 font-semibold underline underline-offset-2">
        {{ aviso.linkTexto || "Ver" }}
      </NuxtLink>
      <button type="button" class="shrink-0 opacity-80 hover:opacity-100" aria-label="Cerrar" @click="visible = false">
        <TiendaIcono name="cerrar" class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>
