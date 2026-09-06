<script setup lang="ts">
import redirects from "@/data/catalog-redirects.json";
import {
  SITIO_URL,
  consultaProducto,
  estadoStock,
  limpiarHtml,
  puedeComprar,
  sinHtml,
} from "~/utils/tienda";

// Ficha de producto a lo MercadoLibre: foto grande a la izquierda, a la derecha
// título, precio (o "Consultar precio") y la caja de compra; descripción y
// productos relacionados abajo. Con la tienda apagada o sin precio, la ficha
// vende igual: WhatsApp con el producto pre-cargado.

const route = useRoute();
const idParam = computed(() => String(route.params.id ?? ""));

// /Productos/home era el atajo del home al viejo directorio → ahora el listado.
if (idParam.value === "home") {
  await navigateTo("/Productos", { redirectCode: 301, replace: true });
}
// Redirect 301 de las URLs viejas /Productos/N → /Productos/<uuid> (preserva SEO).
const redirectTarget = (redirects as Record<string, string>)[idParam.value];
if (redirectTarget) {
  await navigateTo(`/Productos/${redirectTarget}`, { redirectCode: 301, replace: true });
}

const { items, porId, shopEnabled } = await useCatalog();
const item = computed(() => porId.value.get(idParam.value) ?? null);
if (!item.value && import.meta.server) {
  const ev = useRequestEvent();
  if (ev) setResponseStatus(ev, 404);
}

const { agregar } = useCarrito();
const { whatsappUrl } = useWhatsApp();

const comprable = computed(() => !!item.value && puedeComprar(item.value, shopEnabled.value));
const descripcionHtml = computed(() => limpiarHtml(item.value?.description));
const descripcionTexto = computed(() => sinHtml(item.value?.description));
const pageUrl = computed(() => `${SITIO_URL}/Productos/${item.value?.id ?? idParam.value}`);
const wsp = computed(() => (item.value ? whatsappUrl(consultaProducto(item.value.name, pageUrl.value)) : "#"));

// Relacionados: primero los de la misma categoría, después el resto del catálogo.
const relacionados = computed(() => {
  const it = item.value;
  if (!it) return [];
  const mismos = items.value.filter((i) => i.id !== it.id && !!i.categoria_id && i.categoria_id === it.categoria_id);
  const otros = items.value.filter((i) => i.id !== it.id && !mismos.includes(i));
  return [...mismos, ...otros].slice(0, 4);
});

const migas = computed(() => {
  const m: Array<{ texto: string; to?: string }> = [
    { texto: "Inicio", to: "/" },
    { texto: "Productos", to: "/Productos" },
  ];
  if (item.value?.categoria && item.value.categoria_slug) {
    m.push({ texto: item.value.categoria, to: `/Productos?categoria=${item.value.categoria_slug}` });
  }
  if (item.value) m.push({ texto: item.value.name });
  return m;
});

// ── SEO ──
const pageTitle = computed(() =>
  item.value ? `${item.value.name} | Imoberdorf Hnos.` : "Producto no encontrado | Imoberdorf Hnos.",
);
const pageDescription = computed(() =>
  item.value
    ? (descripcionTexto.value || `${item.value.name} en Imoberdorf Hnos., Rafaela.`).slice(0, 160)
    : "Ese producto ya no está en el catálogo de Imoberdorf Hnos.",
);
const pageImage = computed(() => item.value?.photo_url || `${SITIO_URL}/img/Empresa/empresa1.jpg`);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: pageUrl,
  ogImage: pageImage,
  ogType: "website",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: pageImage,
  robots: () => (item.value ? "index, follow" : "noindex, follow"),
});

const jsonLd = computed(() => {
  const it = item.value;
  if (!it) return "{}";
  const producto: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: it.name,
    description: descripcionTexto.value || undefined,
    image: it.photo_url || undefined,
    url: pageUrl.value,
    category: it.categoria || undefined,
  };
  // Oferta solo con precio cargado: sin precio no se declara nada que no sea cierto.
  if (it.price_ars != null) {
    producto.offers = {
      "@type": "Offer",
      url: pageUrl.value,
      priceCurrency: "ARS",
      price: it.price_ars,
      availability:
        estadoStock(it) === "agotado" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Imoberdorf Hnos. S.A." },
    };
  }
  const migasLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.value.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.texto,
      item: m.to ? `${SITIO_URL}${m.to}` : pageUrl.value,
    })),
  };
  return JSON.stringify([producto, migasLd]);
});
useHead({
  link: [{ rel: "canonical", href: pageUrl }],
  script: [{ type: "application/ld+json", innerHTML: jsonLd }],
});
</script>

<template>
  <div class="min-h-screen bg-tertiary pb-28 pt-20 lg:pb-16 lg:pt-8">
    <div class="mx-auto w-full max-w-[1440px] px-4 lg:px-10">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <NuxtLink
          to="/Productos"
          class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <TiendaIcono name="flecha-izquierda" class="h-4 w-4" />
          Volver al listado
        </NuxtLink>
        <TiendaMigas :items="migas" class="hidden lg:block" />
      </div>

      <template v-if="item">
        <div class="t-card grid grid-cols-1 gap-8 p-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:p-8">
          <!-- Galería + descripción (escritorio) -->
          <div class="flex flex-col gap-8">
            <div class="flex gap-4">
              <div class="hidden w-16 shrink-0 flex-col gap-2 md:flex">
                <div class="aspect-square overflow-hidden rounded border-2 border-primary" aria-hidden="true">
                  <TiendaImagen :src="item.photo_url" :alt="item.name" class="h-full w-full p-1" />
                </div>
              </div>
              <div class="min-w-0 flex-1 overflow-hidden rounded-md border border-neutral-100">
                <TiendaImagen
                  :src="item.photo_url"
                  :alt="item.name"
                  eager
                  class="aspect-square max-h-[560px] w-full p-4 lg:p-8"
                />
              </div>
            </div>

            <section v-if="descripcionHtml" class="hidden lg:block" aria-labelledby="desc-titulo">
              <h2
                id="desc-titulo"
                class="mb-3 border-t border-neutral-200 pt-6 font-raleway text-xl font-semibold text-neutral-900"
              >
                Descripción
              </h2>
              <div class="t-prosa" v-html="descripcionHtml" />
            </section>
          </div>

          <!-- Título, precio y caja de compra -->
          <div class="flex flex-col gap-4">
            <p v-if="item.categoria && item.categoria_slug" class="text-xs text-neutral-500">
              <NuxtLink :to="`/Productos?categoria=${item.categoria_slug}`" class="hover:text-primary hover:underline">
                {{ item.categoria }}
              </NuxtLink>
            </p>
            <h1 class="font-raleway text-xl font-semibold leading-snug text-neutral-900 lg:text-2xl">
              {{ item.name }}
            </h1>
            <TiendaPrecio :precio="item.price_ars" tamano="xl" />
            <TiendaComprar :item="item" :shop-enabled="shopEnabled" />

            <section v-if="descripcionHtml" class="lg:hidden" aria-labelledby="desc-titulo-m">
              <h2 id="desc-titulo-m" class="mb-2 font-raleway text-lg font-semibold text-neutral-900">Descripción</h2>
              <div class="t-prosa" v-html="descripcionHtml" />
            </section>
          </div>
        </div>

        <div v-if="relacionados.length" class="mt-8">
          <TiendaRelacionados :items="relacionados" :shop-enabled="shopEnabled" />
        </div>
      </template>

      <div v-else class="t-card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <TiendaIcono name="paquete" class="h-12 w-12 text-neutral-300" />
        <p class="font-raleway text-xl font-semibold text-neutral-900">No encontramos ese producto</p>
        <p class="max-w-md text-sm text-neutral-600">
          Puede que ya no esté en el catálogo o que el enlace esté incompleto.
        </p>
        <NuxtLink to="/Productos" class="t-btn t-btn-primario mt-2">Ver todos los productos</NuxtLink>
      </div>
    </div>

    <!-- Barra fija inferior (mobile), como la de ML: precio + acción principal -->
    <div
      v-if="item"
      class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,.08)] lg:hidden"
      style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
    >
      <TiendaPrecio :precio="item.price_ars" tamano="sm" />
      <button v-if="comprable" type="button" class="t-btn t-btn-primario" @click="agregar(item)">
        <TiendaIcono name="carrito" class="h-4 w-4" />
        Agregar al carrito
      </button>
      <a v-else :href="wsp" target="_blank" rel="noopener" class="t-btn t-btn-primario">
        <TiendaIcono name="whatsapp" class="h-4 w-4" />
        Consultar
      </a>
    </div>
  </div>
</template>
