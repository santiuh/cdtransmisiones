<script setup lang="ts">
import { formatPrecio } from "~/utils/tienda";

// Precio a lo ML: grande, peso liviano, tabular. Sin precio → "Consultar precio"
// en el mismo lugar (precio null = "a consultar" en toda la plataforma).
// "grilla" es responsive: en las tarjetas de 2 columnas del mobile el precio baja
// un escalón para no partirse en dos líneas.
const props = withDefaults(
  defineProps<{
    precio: number | null | undefined;
    tamano?: "sm" | "md" | "xl" | "grilla";
    consultar?: string;
  }>(),
  { tamano: "md", consultar: "Consultar precio" },
);
const clasesPrecio = { sm: "text-lg", md: "text-2xl", xl: "text-4xl", grilla: "text-xl xl:text-2xl" } as const;
const clasesConsultar = { sm: "text-base", md: "text-xl", xl: "text-2xl", grilla: "text-base xl:text-xl" } as const;
</script>

<template>
  <p
    v-if="props.precio != null"
    class="font-light leading-none text-neutral-900 tabular-nums"
    :class="clasesPrecio[props.tamano]"
  >
    {{ formatPrecio(props.precio) }}
  </p>
  <p v-else class="font-semibold leading-none text-primary" :class="clasesConsultar[props.tamano]">
    {{ props.consultar }}
  </p>
</template>
