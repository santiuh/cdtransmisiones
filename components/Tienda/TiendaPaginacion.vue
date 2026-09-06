<script setup lang="ts">
import { armarQuery, rangoPaginas } from "~/utils/tienda";

const props = defineProps<{ actual: number; total: number; query: Record<string, unknown> }>();

const paginas = computed(() => rangoPaginas(props.actual, props.total));
const link = (p: number) => ({
  path: "/Productos",
  query: armarQuery(props.query, { pagina: p === 1 ? null : String(p) }),
});
</script>

<template>
  <nav v-if="total > 1" aria-label="Paginación" class="mt-8 flex flex-wrap items-center justify-center gap-1 text-sm">
    <NuxtLink
      v-if="actual > 1"
      :to="link(actual - 1)"
      class="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-200"
    >
      <TiendaIcono name="chevron-izquierda" class="h-4 w-4" />
      Anterior
    </NuxtLink>
    <span v-else class="inline-flex items-center gap-1 px-3 py-1.5 text-neutral-300">
      <TiendaIcono name="chevron-izquierda" class="h-4 w-4" />
      Anterior
    </span>

    <template v-for="(p, i) in paginas" :key="i">
      <span v-if="p === '…'" class="px-2 text-neutral-400">…</span>
      <NuxtLink
        v-else
        :to="link(p)"
        :aria-current="p === actual ? 'page' : undefined"
        class="min-w-[2.25rem] rounded-md px-2 py-1.5 text-center font-medium"
        :class="p === actual ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-200'"
      >
        {{ p }}
      </NuxtLink>
    </template>

    <NuxtLink
      v-if="actual < total"
      :to="link(actual + 1)"
      class="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-200"
    >
      Siguiente
      <TiendaIcono name="chevron-derecha" class="h-4 w-4" />
    </NuxtLink>
    <span v-else class="inline-flex items-center gap-1 px-3 py-1.5 text-neutral-300">
      Siguiente
      <TiendaIcono name="chevron-derecha" class="h-4 w-4" />
    </span>
  </nav>
</template>
