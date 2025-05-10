<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 py-20 gap-20">
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Nuestros Productos
      </h1>
      <div class="flex flex-row justify-around gap-4">
        <NuxtImg
          :src="'/img/Productos/' + selectedItem.imagen"
          class="rounded-2xl !h-auto shadow-2xl aspect-square object-contain bg-white lg:w-1/2 xl:w-2/5"
        ></NuxtImg>

        <div
          class="bg-white md:w-1/2 w-2/5 p-12 gap-4 rounded-2xl flex flex-col shadow-2xl"
        >
          <h2 class="text-3xl font-semibold">{{ selectedItem.titulo }}</h2>
          <hr class="w-1/4 self-center" />
          <p>{{ selectedItem.descripcion }}</p>
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
    for (const subcategory of category.subcategories) {
      const item = subcategory.items.find(
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
