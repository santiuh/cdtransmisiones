<script setup lang="ts">
import {
  SITIO_URL,
  consultaProducto,
  estadoStock,
  maximoUnidades,
  puedeComprar,
  type TiendaItem,
} from "~/utils/tienda";

// Caja de compra de la ficha (la columna derecha de ML): stock, cantidad,
// "Comprar ahora" (va directo al checkout con este producto) y "Agregar al
// carrito". Sin precio o con la tienda apagada, se convierte en la caja de
// consulta: WhatsApp con el producto pre-cargado + formulario de contacto.
const props = defineProps<{ item: TiendaItem; shopEnabled: boolean }>();

const { agregar, crearCheckout } = useCarrito();
const { whatsappUrl } = useWhatsApp();
const { bloque } = useEditable();

const comprable = computed(() => puedeComprar(props.item, props.shopEnabled));
const stock = computed(() => estadoStock(props.item));
const max = computed(() => maximoUnidades(props.item));
const cantidad = ref(1);
watch(
  () => props.item.id,
  () => {
    cantidad.value = 1;
  },
);

const wsp = computed(() =>
  whatsappUrl(consultaProducto(props.item.name, `${SITIO_URL}/Productos/${props.item.id}`)),
);
const direccion = computed(() => bloque("footer_dir1", "Maipú 450 - Rafaela"));

const comprando = ref(false);
const error = ref<string | null>(null);

async function comprarAhora() {
  if (comprando.value) return;
  comprando.value = true;
  error.value = null;
  const r = await crearCheckout([{ item_id: props.item.id, qty: cantidad.value }]);
  if (r.ok) {
    window.location.href = r.url;
    return;
  }
  error.value = r.error;
  comprando.value = false;
}

function alCarrito() {
  agregar(props.item, cantidad.value);
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-md border border-neutral-200 p-4 lg:p-5">
    <template v-if="comprable">
      <div class="flex flex-col gap-1 text-sm text-neutral-700">
        <p class="inline-flex items-start gap-2">
          <TiendaIcono name="camion" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <span>Retiro en el local o envío: lo elegís al finalizar la compra.</span>
        </p>
      </div>

      <div>
        <p class="text-sm font-semibold text-neutral-900">
          Stock disponible
          <span v-if="stock === 'disponible'" class="font-normal text-neutral-500">
            ({{ item.stock }} {{ item.stock === 1 ? "disponible" : "disponibles" }})
          </span>
        </p>
        <div class="mt-2 flex items-center gap-3 text-sm text-neutral-700">
          <span>Cantidad:</span>
          <TiendaCantidad v-model="cantidad" :max="max" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <button type="button" class="t-btn t-btn-primario w-full" :disabled="comprando" @click="comprarAhora">
          {{ comprando ? "Llevándote al checkout…" : "Comprar ahora" }}
        </button>
        <button type="button" class="t-btn t-btn-suave w-full" :disabled="comprando" @click="alCarrito">
          <TiendaIcono name="carrito" class="h-4 w-4" />
          Agregar al carrito
        </button>
        <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>
      </div>
    </template>

    <template v-else>
      <p v-if="item.price_ars != null && stock === 'agotado'" class="text-sm text-neutral-700">
        Sin stock por el momento. Escribinos y te avisamos cuando vuelva a estar disponible.
      </p>
      <p v-else class="text-sm text-neutral-700">
        Este producto se cotiza según lo que necesitás (potencia, tensión, aplicación). Escribinos y te
        respondemos a la brevedad.
      </p>
      <div class="flex flex-col gap-2">
        <a :href="wsp" target="_blank" rel="noopener" class="t-btn t-btn-primario w-full">
          <TiendaIcono name="whatsapp" class="h-4 w-4" />
          Consultar por WhatsApp
        </a>
        <NuxtLink to="/Contacto" class="t-btn t-btn-suave w-full">Enviar una consulta</NuxtLink>
      </div>
    </template>

    <ul class="flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
      <li class="flex items-start gap-2">
        <TiendaIcono name="llave" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Asesoramiento técnico especializado</span>
      </li>
      <li class="flex items-start gap-2">
        <TiendaIcono name="escudo" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Taller de reparación y asistencia técnica propios</span>
      </li>
      <li class="flex items-start gap-2">
        <TiendaIcono name="local" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Atención en {{ direccion }}</span>
      </li>
    </ul>
  </div>
</template>
