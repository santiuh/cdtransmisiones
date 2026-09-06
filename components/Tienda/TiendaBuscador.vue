<script setup lang="ts">
import { armarQuery } from "~/utils/tienda";

// Buscador del listado: al enviar navega a /Productos?q=… (la búsqueda es
// server-side sobre el catálogo ya cargado; cada búsqueda tiene su URL).
const props = defineProps<{ valor?: string }>();
const route = useRoute();
const router = useRouter();
const texto = ref(props.valor ?? "");
watch(
  () => props.valor,
  (v) => {
    texto.value = v ?? "";
  },
);

function enviar() {
  const q = texto.value.trim();
  router.push({ path: "/Productos", query: armarQuery(route.query, { q: q || null }) });
}
function limpiar() {
  texto.value = "";
  if (props.valor) router.push({ path: "/Productos", query: armarQuery(route.query, { q: null }) });
}
</script>

<template>
  <form role="search" class="relative flex w-full items-center" @submit.prevent="enviar">
    <label for="tienda-buscar" class="sr-only">Buscar productos</label>
    <input
      id="tienda-buscar"
      v-model="texto"
      type="search"
      autocomplete="off"
      enterkeyhint="search"
      placeholder="Buscar motores, drives, bombas…"
      class="h-11 w-full rounded-md border border-neutral-200 bg-white pl-4 pr-20 text-sm text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,.12)] outline-none transition placeholder:text-neutral-400 focus:border-primary"
    />
    <button
      v-if="texto"
      type="button"
      class="absolute right-11 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
      aria-label="Borrar búsqueda"
      @click="limpiar"
    >
      <TiendaIcono name="cerrar" class="h-4 w-4" />
    </button>
    <button
      type="submit"
      class="absolute right-1 flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-primary"
      aria-label="Buscar"
    >
      <TiendaIcono name="buscar" class="h-5 w-5" />
    </button>
  </form>
</template>
