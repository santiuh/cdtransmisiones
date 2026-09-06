<script setup lang="ts">
import {
  ORDENES,
  POR_PAGINA,
  SITIO_URL,
  armarQuery,
  buscar,
  categorias as armarCategorias,
  filtrarCategoria,
  filtrarPrecio,
  ordenar,
  paginar,
  parseOrden,
  parsePagina,
  parsePrecio,
  parseVista,
  puedeComprar,
  rangosDePrecio,
  type Vista,
} from "~/utils/tienda";

// Listado de productos a lo MercadoLibre: filtros a la izquierda (categorías
// con conteo, precio, compra online), resultados en filas con la foto grande,
// orden, vista lista/grilla y paginación. TODO el estado vive en el query
// (?q=&categoria=&precio=&compra=&orden=&vista=&pagina=) → se renderiza en el
// server, cada combinación tiene URL y el catálogo viene del panel (useCatalog).

const route = useRoute();
const router = useRouter();
const { items, shopEnabled } = await useCatalog();
const { bloque } = useEditable();
const { whatsappUrl } = useWhatsApp();

const q = computed(() => (typeof route.query.q === "string" ? route.query.q.trim() : ""));
const categoriaSlug = computed(() => (typeof route.query.categoria === "string" ? route.query.categoria : null));
const precioParam = computed(() => (typeof route.query.precio === "string" ? route.query.precio : null));
const soloCompra = computed(() => route.query.compra === "1");
const orden = computed(() => parseOrden(route.query.orden));
const vista = computed(() => parseVista(route.query.vista));

// Pipeline: búsqueda → categoría → precio → compra online → orden → página.
// Las facetas (conteos, rangos) se calculan sobre el paso anterior, como en ML.
const buscados = computed(() => buscar(items.value, q.value));
const cats = computed(() => armarCategorias(buscados.value));
const categoriaActual = computed(() => cats.value.find((c) => c.slug === categoriaSlug.value) ?? null);
const porCategoria = computed(() => filtrarCategoria(buscados.value, categoriaActual.value?.slug ?? null));
const rangos = computed(() => rangosDePrecio(porCategoria.value));
const precio = computed(() => parsePrecio(precioParam.value));
const porPrecio = computed(() =>
  precio.value ? filtrarPrecio(porCategoria.value, precio.value.min, precio.value.max) : porCategoria.value,
);
const compraOnline = computed(() => porPrecio.value.filter((i) => puedeComprar(i, shopEnabled.value)).length);
const filtrados = computed(() =>
  soloCompra.value ? porPrecio.value.filter((i) => puedeComprar(i, shopEnabled.value)) : porPrecio.value,
);
const ordenados = computed(() => ordenar(filtrados.value, orden.value, q.value));
const pagina = computed(() => paginar(ordenados.value, parsePagina(route.query.pagina), POR_PAGINA));

const hayFiltros = computed(() => !!(q.value || categoriaActual.value || precio.value || soloCompra.value));
const cantidadFiltros = computed(
  () => [categoriaActual.value, precio.value, soloCompra.value].filter(Boolean).length,
);

const tituloBase = computed(() => bloque("productos_titulo", "Productos"));
const titulo = computed(() =>
  q.value ? `Resultados para “${q.value}”` : (categoriaActual.value?.nombre ?? tituloBase.value),
);
const etiquetaOrden = computed(() => ORDENES.find((o) => o.valor === orden.value)?.etiqueta ?? "Ordenar");

const migas = computed(() => {
  const m: Array<{ texto: string; to?: string }> = [
    { texto: "Inicio", to: "/" },
    { texto: "Productos", to: categoriaActual.value || q.value ? "/Productos" : undefined },
  ];
  if (categoriaActual.value) m.push({ texto: categoriaActual.value.nombre });
  else if (q.value) m.push({ texto: `Búsqueda: ${q.value}` });
  return m;
});

const wspGeneral = computed(() =>
  whatsappUrl(
    q.value
      ? `Hola, busco "${q.value}" y no lo encontré en la web. ¿Lo tienen?`
      : "Hola, quiero consultar por un producto.",
  ),
);

function cambiarOrden(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  router.push({ path: "/Productos", query: armarQuery(route.query, { orden: v === "relevantes" ? null : v }) });
}
// La grilla es la vista por defecto (sin query); ?vista=lista es la alternativa.
const linkVista = (v: Vista) => ({
  path: "/Productos",
  query: armarQuery(route.query, {
    vista: v === "grilla" ? null : v,
    pagina: typeof route.query.pagina === "string" ? route.query.pagina : null,
  }),
});

// Cajón de filtros (mobile): se cierra solo al navegar.
const filtrosAbiertos = ref(false);
watch(
  () => route.fullPath,
  () => {
    filtrosAbiertos.value = false;
  },
);

// Al cambiar de página, subir al inicio de los resultados (el router no lo hace
// en cambios de query).
const resultadosEl = ref<HTMLElement | null>(null);
watch(
  () => route.query.pagina,
  () => {
    nextTick(() => resultadosEl.value?.scrollIntoView({ behavior: "smooth", block: "start" }));
  },
);

// ── SEO ──
const canonical = computed(() => {
  const qs = new URLSearchParams();
  if (categoriaActual.value) qs.set("categoria", categoriaActual.value.slug);
  if (pagina.value.pagina > 1) qs.set("pagina", String(pagina.value.pagina));
  const s = qs.toString();
  return `${SITIO_URL}/Productos${s ? `?${s}` : ""}`;
});
const seoTitle = computed(() => {
  const base = "Productos | Imoberdorf Hnos.";
  if (q.value) return `“${q.value}” · ${base}`;
  if (categoriaActual.value) return `${categoriaActual.value.nombre} · ${base}`;
  return base;
});
const seoDescription = computed(() =>
  categoriaActual.value
    ? `${categoriaActual.value.nombre} en Imoberdorf Hnos., Rafaela: ${categoriaActual.value.cantidad} ${
        categoriaActual.value.cantidad === 1 ? "producto" : "productos"
      } con asesoramiento técnico especializado. Consultá precios y disponibilidad.`
    : "Motores eléctricos WEG, motorreductores, drives, controls y bombas de agua. Mirá el catálogo completo, consultá precios y comprá con asesoramiento técnico en Imoberdorf Hnos., Rafaela.",
);
const seoImage = computed(() => pagina.value.items[0]?.photo_url || `${SITIO_URL}/img/Empresa/empresa1.jpg`);

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonical,
  ogImage: seoImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
  robots: () => (q.value || precio.value || soloCompra.value ? "noindex, follow" : "index, follow"),
});
const jsonLd = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: titulo.value,
    numberOfItems: pagina.value.total,
    itemListElement: pagina.value.items.map((it, i) => ({
      "@type": "ListItem",
      position: pagina.value.desde + i,
      url: `${SITIO_URL}/Productos/${it.id}`,
      name: it.name,
    })),
  }),
);
useHead({
  link: [{ rel: "canonical", href: canonical }],
  script: [{ type: "application/ld+json", innerHTML: jsonLd }],
});
</script>

<template>
  <div class="min-h-screen bg-tertiary pb-16 pt-20 lg:pt-8">
    <div class="mx-auto w-full max-w-[1440px] px-4 lg:px-10">
      <div class="mb-4 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
        <TiendaMigas :items="migas" />
        <TiendaBuscador :valor="q" class="lg:w-[440px]" />
      </div>

      <div class="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
        <aside class="hidden w-[250px] shrink-0 lg:block" aria-label="Filtros">
          <TiendaFiltros
            :titulo="titulo"
            :total="pagina.total"
            :categorias="cats"
            :total-todas="buscados.length"
            :categoria-actual="categoriaActual?.slug ?? null"
            :rangos="rangos"
            :precio-actual="precioParam"
            :compra-online="compraOnline"
            :solo-compra="soloCompra"
            :hay-filtros="hayFiltros"
            :query="route.query"
          />
        </aside>

        <section ref="resultadosEl" class="w-full min-w-0 flex-1 scroll-mt-24" aria-label="Resultados">
          <!-- Mobile: título + Filtrar / Ordenar -->
          <div class="mb-3 lg:hidden">
            <p class="font-raleway text-xl font-semibold leading-tight text-neutral-900">{{ titulo }}</p>
            <p class="mt-0.5 text-sm text-neutral-500">
              {{ pagina.total }} {{ pagina.total === 1 ? "resultado" : "resultados" }}
            </p>
            <div class="mt-3 flex gap-2">
              <button type="button" class="t-btn t-btn-borde flex-1" @click="filtrosAbiertos = true">
                <TiendaIcono name="filtro" class="h-4 w-4" />
                Filtrar
                <span
                  v-if="cantidadFiltros"
                  class="rounded-full bg-primary px-1.5 py-0.5 text-[11px] leading-none text-white"
                >
                  {{ cantidadFiltros }}
                </span>
              </button>
              <label class="t-btn t-btn-borde relative flex-1 cursor-pointer">
                <TiendaIcono name="chevron-abajo" class="h-4 w-4" />
                <span class="truncate">{{ etiquetaOrden }}</span>
                <select
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  :value="orden"
                  aria-label="Ordenar por"
                  @change="cambiarOrden"
                >
                  <option v-for="o in ORDENES" :key="o.valor" :value="o.valor">{{ o.etiqueta }}</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Desktop: "Ordenar por Más relevantes ˅" como texto (ML) + vista -->
          <div class="mb-4 hidden items-center justify-end gap-5 lg:flex">
            <label class="flex items-center gap-1.5 text-sm text-neutral-600">
              Ordenar por
              <span class="relative inline-flex items-center">
                <select
                  class="cursor-pointer appearance-none bg-transparent py-1 pl-1 pr-6 text-sm font-medium text-neutral-800 outline-none focus-visible:underline"
                  :value="orden"
                  @change="cambiarOrden"
                >
                  <option v-for="o in ORDENES" :key="o.valor" :value="o.valor">{{ o.etiqueta }}</option>
                </select>
                <TiendaIcono name="chevron-abajo" class="pointer-events-none absolute right-0 h-4 w-4 text-primary" />
              </span>
            </label>
            <div class="flex items-center gap-1" role="group" aria-label="Vista">
              <NuxtLink
                :to="linkVista('grilla')"
                class="flex h-8 w-8 items-center justify-center rounded-md"
                :class="vista === 'grilla' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-200'"
                aria-label="Ver en grilla"
                :aria-current="vista === 'grilla' ? 'true' : undefined"
              >
                <TiendaIcono name="grilla" class="h-4 w-4" />
              </NuxtLink>
              <NuxtLink
                :to="linkVista('lista')"
                class="flex h-8 w-8 items-center justify-center rounded-md"
                :class="vista === 'lista' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-200'"
                aria-label="Ver en lista"
                :aria-current="vista === 'lista' ? 'true' : undefined"
              >
                <TiendaIcono name="lista" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>

          <ol
            v-if="pagina.items.length"
            :class="vista === 'grilla' ? 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4' : 'flex flex-col gap-2'"
          >
            <li v-for="(it, i) in pagina.items" :key="it.id" class="flex">
              <TiendaProducto :item="it" :vista="vista" :shop-enabled="shopEnabled" :eager="i < 2" class="w-full" />
            </li>
          </ol>

          <div v-else class="t-card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <TiendaIcono name="buscar" class="h-10 w-10 text-neutral-300" />
            <p class="font-raleway text-lg font-semibold text-neutral-900">
              No encontramos productos {{ q ? `para “${q}”` : "con esos filtros" }}
            </p>
            <p class="max-w-md text-sm text-neutral-600">
              Revisá la ortografía o probá con palabras más generales. Si no está en la lista, igual lo
              conseguimos: escribinos por WhatsApp.
            </p>
            <div class="mt-2 flex flex-wrap justify-center gap-2">
              <NuxtLink to="/Productos" class="t-btn t-btn-suave">Ver todos los productos</NuxtLink>
              <a :href="wspGeneral" target="_blank" rel="noopener" class="t-btn t-btn-primario">
                <TiendaIcono name="whatsapp" class="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>

          <TiendaPaginacion :actual="pagina.pagina" :total="pagina.paginas" :query="route.query" />
        </section>
      </div>
    </div>

    <TiendaDrawer v-model="filtrosAbiertos" titulo="Filtrar">
      <TiendaFiltros
        :titulo="titulo"
        :total="pagina.total"
        :categorias="cats"
        :categoria-actual="categoriaActual?.slug ?? null"
        :rangos="rangos"
        :precio-actual="precioParam"
        :compra-online="compraOnline"
        :solo-compra="soloCompra"
        :hay-filtros="hayFiltros"
        :query="route.query"
        :con-titulo="false"
      />
    </TiendaDrawer>
  </div>
</template>
