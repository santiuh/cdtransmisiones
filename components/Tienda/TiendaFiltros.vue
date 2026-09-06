<script setup lang="ts">
import { armarQuery, type RangoPrecio, type TiendaCategoria } from "~/utils/tienda";

// Columna de filtros del listado (a lo ML): título + cantidad de resultados,
// tarjetas con interruptor (Compra online, solo con la tienda prendida),
// categorías con conteo y rangos de precio (solo si hay precios cargados).
// Todo son links con query → cada combinación tiene URL propia.

// ⚠ Una prop booleana ausente se castea a false: el default explícito es lo que
// hace que la columna de escritorio muestre el h1 sin pasar nada.
const props = withDefaults(
  defineProps<{
    titulo: string;
    total: number;
    categorias: TiendaCategoria[];
    categoriaActual: string | null;
    rangos: RangoPrecio[];
    precioActual: string | null;
    compraOnline: number;
    soloCompra: boolean;
    hayFiltros: boolean;
    query: Record<string, unknown>;
    /** Total de "Todas": los productos de la búsqueda, tengan o no categoría. */
    totalTodas?: number;
    /** El h1 va en la columna de escritorio; en el cajón mobile no se repite. */
    conTitulo?: boolean;
  }>(),
  { conTitulo: true, totalTodas: undefined },
);

const link = (cambios: Record<string, string | null>) => ({
  path: "/Productos",
  query: armarQuery(props.query, cambios),
});
const totalCategorias = computed(
  () => props.totalTodas ?? props.categorias.reduce((a, c) => a + c.cantidad, 0),
);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-if="conTitulo !== false">
      <h1 class="font-raleway text-2xl font-semibold leading-tight text-neutral-900">{{ titulo }}</h1>
      <p class="mt-1 text-sm text-neutral-500">{{ total }} {{ total === 1 ? "resultado" : "resultados" }}</p>
    </div>

    <!-- Interruptor "Compra online" (tarjeta con switch, como los de envío en ML) -->
    <NuxtLink
      v-if="compraOnline > 0"
      :to="link({ compra: soloCompra ? null : '1' })"
      class="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 transition hover:shadow-sm"
      role="switch"
      :aria-checked="soloCompra ? 'true' : 'false'"
    >
      <span class="min-w-0">
        <span class="block text-sm font-semibold text-neutral-800">Compra online</span>
        <span class="block text-xs text-neutral-500">
          {{ compraOnline }} {{ compraOnline === 1 ? "producto" : "productos" }} con precio y stock
        </span>
      </span>
      <span
        class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        :class="soloCompra ? 'bg-primary' : 'bg-neutral-300'"
        aria-hidden="true"
      >
        <span
          class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
          :class="soloCompra ? 'left-[22px]' : 'left-0.5'"
        />
      </span>
    </NuxtLink>

    <NuxtLink
      v-if="hayFiltros"
      :to="{ path: '/Productos' }"
      class="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
    >
      <TiendaIcono name="cerrar" class="h-3.5 w-3.5" />
      Limpiar filtros
    </NuxtLink>

    <section>
      <h3 class="mb-2 text-base font-semibold text-neutral-900">Categorías</h3>
      <ul class="flex flex-col gap-2 text-sm">
        <li>
          <NuxtLink
            :to="link({ categoria: null })"
            :class="!categoriaActual ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-primary'"
          >
            Todas <span class="text-neutral-400">({{ totalCategorias }})</span>
          </NuxtLink>
        </li>
        <li v-for="c in categorias" :key="c.slug">
          <NuxtLink
            :to="link({ categoria: c.slug === categoriaActual ? null : c.slug })"
            :class="c.slug === categoriaActual ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-primary'"
          >
            {{ c.nombre }} <span class="text-neutral-400">({{ c.cantidad }})</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="rangos.length">
      <h3 class="mb-2 text-base font-semibold text-neutral-900">Precio</h3>
      <ul class="flex flex-col gap-2 text-sm">
        <li v-for="r in rangos" :key="r.valor">
          <NuxtLink
            :to="link({ precio: r.valor === precioActual ? null : r.valor })"
            :class="r.valor === precioActual ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-primary'"
          >
            {{ r.etiqueta }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
