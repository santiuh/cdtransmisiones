<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div
      class="flex flex-col w-full max-w-[1440px] px-4 lg:px-10 py-24 lg:py-20 gap-10 lg:gap-20"
    >
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Nuestros Productos
      </h1>
      <div class="flex flex-col lg:flex-row justify-around gap-4">
        <NuxtImg
          :src="'/img/Productos/' + selectedItem.imagen"
          class="rounded-2xl !h-auto shadow-2xl p-12 aspect-square object-contain bg-white w-full lg:w-1/2 xl:w-2/5"
        ></NuxtImg>

        <div
          class="bg-white md:w-1/2 w-full p-12 gap-4 rounded-2xl flex flex-col shadow-2xl"
        >
          <h2 class="text-3xl font-semibold">{{ selectedItem.titulo }}</h2>
          <hr class="lg:w-1/4 self-center" />
          <p :v-html="selectedItem?.descripcion"></p>
          <VButton
            class="text-white !bg-orangelight self-end mt-10"
            titulo="Consultar"
          ></VButton>
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
  for (const category of categories) {
    // Verificar si la ruta coincide directamente con un elemento de categoría
    if (category.route === route.params.id) {
      return {
        ...category,
        category: category.name,
        subcategory: null,
      };
    }

    // Verificar dentro de las subcategorías
    for (const subcategory of category.subcategories) {
      if (subcategory.route === route.params.id) {
        return {
          ...subcategory,
          category: category.name,
          subcategory: subcategory.name,
        };
      }

      // Verificar dentro de los elementos de las subcategorías
      const item = subcategory.items?.find(
        (item) => item.route === route.params.id
      );
      if (item) {
        return {
          ...item,
          category: category.name,
          subcategory: subcategory.name,
        };
      }
    }
  }
  return null;
});
</script>

<style>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
