<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div
      class="flex flex-col w-full max-w-[1440px] px-4 py-24 lg:py-20 gap-10 lg:gap-20"
    >
      <E
        tag="h1"
        k="productos_titulo"
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Nuestros Productos
      </E>

      <!-- Detalle de producto -->
      <div
        v-if="selectedItem"
        class="flex flex-col lg:flex-row justify-around gap-4"
      >
        <img
          v-if="selectedItem.photo_url"
          :src="selectedItem.photo_url"
          :alt="selectedItem.name"
          loading="lazy"
          class="rounded-2xl !h-auto shadow-2xl p-12 aspect-square object-contain bg-white w-full lg:w-1/2 xl:w-2/5"
        />

        <div
          class="bg-white md:w-1/2 w-full p-12 gap-4 rounded-2xl border-2 flex flex-col justify-between shadow-2xl"
        >
          <div class="flex flex-col gap-4">
            <h2 class="text-3xl font-semibold">{{ selectedItem.name }}</h2>
            <hr class="lg:w-1/4 self-center" />
            <p v-html="selectedItem.description"></p>
            <p v-if="selectedItem.price_ars != null" class="text-2xl font-bold text-primary">
              {{ formatPrice(selectedItem.price_ars) }}
            </p>
          </div>

          <VButton
            @click="openWindow()"
            class="text-white !bg-orangelight self-end mt-10"
            titulo="Consultar"
          ></VButton>
        </div>
      </div>

      <!-- Directorio de productos (por categoría) -->
      <div
        v-else
        class="flex flex-col lg:flex-row flex-wrap lg:justify-around px-6 lg:px-2 py-4 lg:py-7 w-full bg-white border rounded-xl shadow-lg gap-6"
      >
        <div v-if="!groups.length" class="w-full text-center text-primary py-6">
          Estamos actualizando el catálogo. Escribinos por WhatsApp para consultas.
        </div>
        <div v-for="group in groups" :key="group.category?.id || 'sin-categoria'" class="lg:py-0 py-3">
          <p class="text-lg font-bold text-primary">
            {{ group.category?.name || "Otros" }}
          </p>
          <ul class="pl-4 lg:pl-0">
            <li v-for="item in group.items" :key="item.id">
              <NuxtLink
                :to="`/Productos/${item.id}`"
                class="hover:text-orange transition"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import redirects from "@/data/catalog-redirects.json";
import { formatCatalogPrice } from "~/utils/catalog";

const route = useRoute();
const idParam = computed(() => String(route.params.id ?? ""));

// Redirect 301 de las URLs viejas /Productos/N → /Productos/<uuid> (preserva SEO).
const redirectTarget = redirects[idParam.value];
if (redirectTarget) {
  await navigateTo(`/Productos/${redirectTarget}`, { redirectCode: 301, replace: true });
}

// Catálogo desde el panel (widget), server-side, cacheado (routeRules SWR).
const { groups } = await useCatalog();
const allItems = computed(() =>
  groups.value.flatMap((g) => g.items.map((it) => ({ ...it, category: g.category?.name ?? null }))),
);
const selectedItem = computed(() => allItems.value.find((i) => i.id === idParam.value) || null);

const formatPrice = (n) => formatCatalogPrice(n);

const pageTitle = computed(() =>
  selectedItem.value ? `${selectedItem.value.name} | Imoberdorf Hnos.` : "Productos | Imoberdorf Hnos.",
);
const pageDescription = computed(() =>
  selectedItem.value
    ? (selectedItem.value.description || "").replace(/<[^>]*>/g, "").substring(0, 160)
    : "Descubrí nuestra variedad de productos: motores eléctricos, drives, bombas y soluciones industriales en Rafaela.",
);
const pageUrl = computed(() =>
  selectedItem.value
    ? `https://www.imoberdorfhnos.com.ar/Productos/${selectedItem.value.id}`
    : "https://www.imoberdorfhnos.com.ar/Productos",
);
const pageImage = computed(
  () => selectedItem.value?.photo_url || "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg",
);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  keywords:
    "productos, motores eléctricos, drives, bombas, industria, Rafaela, Imoberdorf Hnos.",
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: pageUrl,
  ogImage: pageImage,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: pageImage,
});
useHead({
  link: [{ rel: "canonical", href: pageUrl }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => {
        if (!selectedItem.value) return "{}";
        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: selectedItem.value.name,
          description: (selectedItem.value.description || "").replace(/<[^>]*>/g, ""),
          image: selectedItem.value.photo_url,
          url: `https://www.imoberdorfhnos.com.ar/Productos/${selectedItem.value.id}`,
          brand: { "@type": "Brand", name: "WEG" },
          offers: {
            "@type": "Offer",
            url: `https://www.imoberdorfhnos.com.ar/Productos/${selectedItem.value.id}`,
            priceCurrency: "ARS",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Imoberdorf Hnos. S.A." },
          },
        });
      }),
    },
  ],
});

const openWindow = () => {
  window.open("https://api.whatsapp.com/send?phone=5493492573782", "_blank");
};
</script>

<style>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
