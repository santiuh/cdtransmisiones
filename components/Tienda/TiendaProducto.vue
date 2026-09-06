<script setup lang="ts">
import {
  SITIO_URL,
  consultaProducto,
  estadoStock,
  puedeComprar,
  resumir,
  sinHtml,
  type TiendaItem,
  type Vista,
} from "~/utils/tienda";

// Tarjeta de resultado del listado, a lo MercadoLibre.
// - "grilla" (la vista por defecto): tarjeta blanca con la foto cuadrada a sangre
//   arriba, título de dos líneas, categoría, precio grande y la línea verde de
//   compra. Sin botones: la tarjeta entera es el link (como en ML).
// - "lista": fila con la foto grande a la izquierda, resumen y acción secundaria.
const props = withDefaults(
  defineProps<{ item: TiendaItem; vista?: Vista; shopEnabled?: boolean; eager?: boolean }>(),
  { vista: "grilla", shopEnabled: false, eager: false },
);

const { agregar } = useCarrito();
const { whatsappUrl } = useWhatsApp();

const href = computed(() => `/Productos/${props.item.id}`);
const comprable = computed(() => puedeComprar(props.item, props.shopEnabled));
const stock = computed(() => estadoStock(props.item));
const resumen = computed(() => resumir(sinHtml(props.item.description), 150));
const wsp = computed(() => whatsappUrl(consultaProducto(props.item.name, `${SITIO_URL}${href.value}`)));
</script>

<template>
  <article
    class="t-card group relative flex overflow-hidden transition-shadow hover:shadow-md"
    :class="vista === 'grilla' ? 'flex-col' : 'flex-row gap-3 p-3 lg:gap-6 lg:p-5'"
  >
    <div
      class="shrink-0 overflow-hidden"
      :class="
        vista === 'grilla'
          ? 'aspect-square w-full border-b border-neutral-100'
          : 'h-28 w-28 rounded border border-neutral-100 lg:h-[200px] lg:w-[200px]'
      "
    >
      <TiendaImagen
        :src="item.photo_url"
        :alt="item.name"
        :eager="eager"
        class="h-full w-full"
        :class="vista === 'grilla' ? 'p-3' : 'p-1'"
      />
    </div>

    <div
      class="flex min-w-0 flex-1 flex-col"
      :class="vista === 'grilla' ? 'gap-1.5 p-3 lg:p-4' : 'gap-1.5 lg:gap-2'"
    >
      <h2
        class="font-raleway leading-snug text-neutral-800"
        :class="vista === 'grilla' ? 'line-clamp-2 text-sm font-normal' : 'text-base font-medium lg:text-xl'"
      >
        <NuxtLink
          :to="href"
          class="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
        >
          {{ item.name }}
        </NuxtLink>
      </h2>
      <p v-if="item.categoria" class="text-xs font-semibold text-neutral-700">{{ item.categoria }}</p>
      <TiendaPrecio :precio="item.price_ars" :tamano="vista === 'grilla' ? 'grilla' : 'md'" />
      <p v-if="resumen && vista === 'lista'" class="hidden text-sm text-neutral-600 lg:line-clamp-2">
        {{ resumen }}
      </p>

      <p v-if="comprable" class="mt-auto text-xs leading-relaxed">
        <span class="rounded bg-emerald-50 px-1 py-0.5 font-semibold text-emerald-700">Comprá online</span>
        <span v-if="stock === 'disponible'" class="text-neutral-500"> · stock disponible</span>
      </p>
      <p v-else-if="item.price_ars != null && stock === 'agotado'" class="mt-auto text-xs font-semibold text-neutral-500">
        Sin stock por el momento
      </p>
      <p v-else class="mt-auto text-xs text-neutral-500">Consultá por WhatsApp</p>

      <div v-if="vista === 'lista'" class="relative z-10 hidden gap-2 pt-1 lg:flex">
        <button v-if="comprable" type="button" class="t-btn t-btn-suave" @click="agregar(item)">
          <TiendaIcono name="carrito" class="h-4 w-4" />
          Agregar al carrito
        </button>
        <a v-else :href="wsp" target="_blank" rel="noopener" class="t-btn t-btn-suave">
          <TiendaIcono name="whatsapp" class="h-4 w-4" />
          Consultar
        </a>
      </div>
    </div>
  </article>
</template>
