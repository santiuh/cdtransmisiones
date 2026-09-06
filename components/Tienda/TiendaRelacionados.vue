<script setup lang="ts">
import type { TiendaItem } from "~/utils/tienda";

// "Productos relacionados" al pie de la ficha: mismas tarjetas del listado en grilla.
defineProps<{ items: TiendaItem[]; shopEnabled: boolean }>();
</script>

<template>
  <section v-if="items.length" aria-labelledby="relacionados-titulo">
    <h2 id="relacionados-titulo" class="mb-4 font-raleway text-xl font-semibold text-neutral-900">
      Productos relacionados
    </h2>
    <ul class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      <li v-for="it in items" :key="it.id" class="flex">
        <TiendaProducto :item="it" vista="grilla" :shop-enabled="shopEnabled" class="w-full" />
      </li>
    </ul>
  </section>
</template>
