<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div
      class="flex flex-col w-full max-w-[1440px] px-4 py-24 lg:py-20 gap-10 lg:gap-20"
    >
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Nuestros Productos
      </h1>
      <div
        v-if="selectedItem"
        class="flex flex-col lg:flex-row justify-around gap-4"
      >
        <NuxtImg
          :src="'/img/Productos/' + selectedItem.imagen"
          class="rounded-2xl !h-auto shadow-2xl p-12 aspect-square object-contain bg-white w-full lg:w-1/2 xl:w-2/5"
        ></NuxtImg>

        <div
          class="bg-white md:w-1/2 w-full p-12 gap-4 rounded-2xl border-2 flex flex-col justify-between shadow-2xl"
        >
          <div class="flex flex-col gap-4">
            <h2 class="text-3xl font-semibold">{{ selectedItem.titulo }}</h2>
            <hr class="lg:w-1/4 self-center" />
            <p :innerHTML="selectedItem?.descripcion"></p>
          </div>

          <VButton
            @click="openWindow()"
            class="text-white !bg-orangelight self-end mt-10"
            titulo="Consultar"
          ></VButton>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col lg:flex-row flex-wrap lg:justify-around px-6 lg:px-2 py-4 lg:py-7 w-full bg-white border rounded-xl shadow-lg 2"
      >
        <div
          v-for="category in categories"
          :key="category.route"
          class="lg:py-0 py-3"
        >
          <NuxtLink
            :to="`/Productos/${category.route}`"
            class="text-lg 0 font-bold text-primary hover:text-orange transition"
          >
            {{ category.name }}
          </NuxtLink>
          <ul class="pl-4 lg:pl-0">
            <li
              v-for="subcategory in category.subcategories"
              :key="subcategory.route"
            >
              <template v-if="subcategory.items && subcategory.items.length">
                <span class="font-semibold text-orange">{{
                  subcategory.name
                }}</span>
                <ul class="ml-4">
                  <li v-for="item in subcategory.items" :key="item.route">
                    <NuxtLink
                      :to="`/Productos/${item.route}`"
                      class="hover:text-orange transition"
                    >
                      {{ item.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </template>
              <template v-else>
                <NuxtLink
                  :to="`/Productos/${subcategory.route}`"
                  class="hover:text-orange transition"
                >
                  {{ subcategory.name }}
                </NuxtLink>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { categories } from "@/data/categories";

const route = useRoute();

const selectedItem = computed(() => {
  if (!route.params.id) return null;
  for (const category of categories) {
    if (category.route === route.params.id) {
      return { ...category, category: category.name, subcategory: null };
    }
    for (const subcategory of category.subcategories) {
      if (subcategory.route === route.params.id) {
        return { ...subcategory, category: category.name, subcategory: subcategory.name };
      }
      const item = subcategory.items?.find((item) => item.route === route.params.id);
      if (item) {
        return { ...item, category: category.name, subcategory: subcategory.name };
      }
    }
  }
  return null;
});

const pageTitle = computed(() =>
  selectedItem.value
    ? `${selectedItem.value.titulo} | Imoberdorf Hnos.`
    : "Productos | Imoberdorf Hnos."
);
const pageDescription = computed(() =>
  selectedItem.value
    ? selectedItem.value.descripcion?.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Descubrí nuestra variedad de productos: motores eléctricos, drives, bombas y soluciones industriales en Rafaela."
);
const pageUrl = computed(() =>
  selectedItem.value
    ? `https://www.imoberdorfhnos.com.ar/Productos/${route.params.id}`
    : "https://www.imoberdorfhnos.com.ar/Productos"
);
const pageImage = computed(() =>
  selectedItem.value
    ? `https://www.imoberdorfhnos.com.ar/img/Productos/${selectedItem.value.imagen}`
    : "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg"
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
          name: selectedItem.value.titulo,
          description: selectedItem.value.descripcion?.replace(/<[^>]*>/g, ""),
          image: `https://www.imoberdorfhnos.com.ar/img/Productos/${selectedItem.value.imagen}`,
          url: `https://www.imoberdorfhnos.com.ar/Productos/${route.params.id}`,
          brand: { "@type": "Brand", name: "WEG" },
          offers: {
            "@type": "Offer",
            url: `https://www.imoberdorfhnos.com.ar/Productos/${route.params.id}`,
            priceCurrency: "ARS",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Imoberdorf Hnos. S.A.",
            },
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
