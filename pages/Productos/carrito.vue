<script setup lang="ts">
import { formatPrecio, maximoUnidades } from "~/utils/tienda";
import type { LineaResuelta } from "~/composables/useCarrito";

// Carrito a lo MercadoLibre: productos a la izquierda (foto, nombre, cantidad,
// eliminar, subtotal) y "Resumen de compra" a la derecha con "Continuar compra",
// que crea la sesión en la plataforma y lleva al checkout hosteado (envío/retiro
// y pago se eligen allá). Las líneas se cruzan con el catálogo de HOY.

const { porId, shopEnabled } = await useCatalog();
const { listo, resolver, fijar, quitar, vaciar, crearCheckout } = useCarrito();

const resueltas = computed(() => resolver(porId.value, shopEnabled.value));
const comprables = computed(() => resueltas.value.filter((l) => l.disponible));
const noDisponibles = computed(() => resueltas.value.filter((l) => !l.disponible));
const unidades = computed(() => comprables.value.reduce((a, l) => a + l.qty, 0));
const subtotal = computed(() => comprables.value.reduce((a, l) => a + l.subtotal, 0));

function motivo(l: LineaResuelta): string {
  if (!l.item) return "Este producto ya no está en el catálogo.";
  if (!shopEnabled.value) return "La compra online no está habilitada por el momento.";
  if (l.item.price_ars == null) return "Producto a consultar: no se vende online.";
  if (l.item.stock === 0) return "Sin stock por el momento.";
  return "No disponible.";
}

const enviando = ref(false);
const error = ref<string | null>(null);

async function continuar() {
  if (enviando.value || !comprables.value.length) return;
  enviando.value = true;
  error.value = null;
  const r = await crearCheckout(comprables.value.map(({ item_id, qty }) => ({ item_id, qty })));
  if (r.ok) {
    // Mismo criterio que el widget express: el carrito ya viajó a la plataforma.
    vaciar();
    window.location.href = r.url;
    return;
  }
  error.value = r.error;
  enviando.value = false;
}

useSeoMeta({ title: "Carrito | Imoberdorf Hnos.", robots: "noindex, nofollow" });
</script>

<template>
  <div class="min-h-screen bg-tertiary pb-28 pt-20 lg:pb-16 lg:pt-8">
    <div class="mx-auto w-full max-w-[1200px] px-4 lg:px-10">
      <div class="mb-4 flex items-center justify-between gap-4">
        <h1 class="font-raleway text-2xl font-semibold text-neutral-900">Carrito</h1>
        <NuxtLink
          to="/Productos"
          class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <TiendaIcono name="flecha-izquierda" class="h-4 w-4" />
          Seguir comprando
        </NuxtLink>
      </div>

      <!-- Hasta montar no sabemos qué hay en localStorage: esqueleto, no "vacío". -->
      <div v-if="!listo" class="t-card animate-pulse p-6" aria-busy="true">
        <div class="h-5 w-40 rounded bg-neutral-200" />
        <div class="mt-4 h-20 rounded bg-neutral-100" />
      </div>

      <div v-else-if="!resueltas.length" class="t-card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <TiendaIcono name="carrito" class="h-12 w-12 text-neutral-300" />
        <p class="font-raleway text-xl font-semibold text-neutral-900">Tu carrito está vacío</p>
        <p class="max-w-md text-sm text-neutral-600">
          {{
            shopEnabled
              ? "Agregá productos desde el listado y volvé acá para finalizar la compra."
              : "La compra online todavía no está habilitada. Consultanos por WhatsApp y te cotizamos."
          }}
        </p>
        <NuxtLink to="/Productos" class="t-btn t-btn-primario mt-2">Ver productos</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section class="t-card divide-y divide-neutral-200 px-4 lg:px-6" aria-label="Productos en el carrito">
          <div v-for="l in resueltas" :key="l.item_id" class="flex gap-4 py-4">
            <div class="h-20 w-20 shrink-0 overflow-hidden rounded border border-neutral-100">
              <TiendaImagen :src="l.item?.photo_url" :alt="l.item?.name || ''" class="h-full w-full p-1" />
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <NuxtLink
                v-if="l.item"
                :to="`/Productos/${l.item.id}`"
                class="font-raleway font-medium leading-snug text-neutral-800 hover:text-primary"
              >
                {{ l.item.name }}
              </NuxtLink>
              <p v-else class="font-medium text-neutral-500">Producto no disponible</p>
              <p v-if="!l.disponible" class="text-xs font-semibold text-red-600">{{ motivo(l) }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-3">
                <TiendaCantidad
                  v-if="l.disponible && l.item"
                  :model-value="l.qty"
                  :max="maximoUnidades(l.item)"
                  chico
                  @update:model-value="fijar(l.item_id, $event)"
                />
                <button type="button" class="text-sm text-primary hover:underline" @click="quitar(l.item_id)">
                  Eliminar
                </button>
              </div>
            </div>
            <div v-if="l.disponible" class="shrink-0 text-right">
              <p class="text-lg font-light tabular-nums text-neutral-900">{{ formatPrecio(l.subtotal) }}</p>
              <p v-if="l.qty > 1" class="text-xs text-neutral-500">{{ l.qty }} × {{ formatPrecio(l.unitario) }}</p>
            </div>
          </div>
        </section>

        <aside class="t-card flex flex-col gap-3 p-4 lg:sticky lg:top-6 lg:p-6" aria-label="Resumen de compra">
          <h2 class="font-raleway text-lg font-semibold text-neutral-900">Resumen de compra</h2>
          <div class="flex justify-between text-sm text-neutral-700">
            <span>Productos ({{ unidades }})</span>
            <span class="tabular-nums">{{ formatPrecio(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-neutral-500">
            <span>Envío</span>
            <span>Se calcula al finalizar</span>
          </div>
          <div class="flex justify-between border-t border-neutral-200 pt-3 text-lg font-semibold text-neutral-900">
            <span>Total</span>
            <span class="tabular-nums">{{ formatPrecio(subtotal) }}</span>
          </div>
          <button
            type="button"
            class="t-btn t-btn-primario w-full"
            :disabled="!comprables.length || enviando"
            @click="continuar"
          >
            {{ enviando ? "Llevándote al checkout…" : "Continuar compra" }}
          </button>
          <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>
          <p v-if="noDisponibles.length" class="text-xs text-neutral-500">
            Los productos no disponibles no se incluyen en la compra.
          </p>
          <p class="text-xs text-neutral-500">Elegís envío o retiro y la forma de pago en el siguiente paso.</p>
        </aside>
      </div>
    </div>

    <!-- Barra fija inferior (mobile) -->
    <div
      v-if="listo && resueltas.length"
      class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,.08)] lg:hidden"
      style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
    >
      <div>
        <p class="text-xs text-neutral-500">Total</p>
        <p class="text-lg font-light leading-none tabular-nums text-neutral-900">{{ formatPrecio(subtotal) }}</p>
      </div>
      <button
        type="button"
        class="t-btn t-btn-primario"
        :disabled="!comprables.length || enviando"
        @click="continuar"
      >
        Continuar compra
      </button>
    </div>
  </div>
</template>
