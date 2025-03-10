<template>
  <div class="flex place-content-center relative overflow-hidden">
    <div class="flex flex-col w-full max-w-[1440px] gap-4 py-40">
      <h1
        class="text-6xl font-bold text-center mb-20 text-shadow-lg shadow-text"
        data-aos="fade-up"
      >
        Nuestros Productos
      </h1>
      <div class="flex flex-row gap-4">
        <div class="bg-white rounded-3xl px-3 py-5 w-1/4 gap-4 flex flex-col h-fit">
          <div class="flex flex-col w-full gap-1 border-b py-4">
            <label class="font-semibold pl-2">Filtrar por palabra</label>
            <input
              class="bg-tertiary rounded-3xl w-full px-2 py-1"
              v-model="searchQuery"
              placeholder="Buscar productos..."
            />
          </div>
          <div class="flex flex-col w-full gap-1 border-b pb-4">
            <label class="font-semibold pl-2">Filtrar por categoría</label>
            <div v-for="category in categories" :key="category" class="flex items-center">
              <input
                type="checkbox"
                :value="category"
                v-model="selectedCategories"
                class="mr-2"
              />
              <span>{{ category }}</span>
            </div>
          </div>
          <div class="flex flex-col w-full gap-1" v-if="subcategories.length > 0">
            <label class="font-semibold pl-2">Filtrar por subcategoria</label>
            <div v-for="subcategory in subcategories" :key="subcategory" class="flex items-center">
              <input
                type="checkbox"
                :value="subcategory"
                v-model="selectedSubcategories"
                class="mr-2"
              />
              <span>{{ subcategory }}</span>
            </div>
          </div>
        </div>
        <div class="grid grid-flow-row grid-cols-3 w-3/4 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="flex flex-col relative bg-white rounded-3xl overflow-hidden"
          >
            <h3
              class="absolute bg-[#1063b1e1] text-white text-xl w-full text-center font-semibold py-2 px-5"
            >
              {{ product.categoria }}
            </h3>
            <NuxtImg
              class="aspect-square"
              :src="product.image"
              alt="product.title"
            />
            <div class="flex flex-col p-6 justify-between h-full gap-12">
              <div class="flex flex-col items-baseline">
                <p class="text-lg font-semibold border-b">
                  {{ product.title }}
                </p>

                <p class="" v-if="product.subcategoria">
                  {{ product.subcategoria }}
                </p>
              </div>

              <VButton
                class="!text-base !bg-primary text-white font-semibold self-end"
                @click="viewProduct(product.id)"
                titulo="VER PRODUCTO"
              ></VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const selectedCategories = ref([]);
const selectedSubcategories = ref([]);

const products = ref([
  {
    id: 1,
    image: "/img/Servicio1.jpg",
    categoria: "GENERADORES",
    subcategoria: "SOLARES",
    title: "PANELES SOLARES WEG",
  },
  {
    id: 2,
    image: "/img/Servicio2.jpg",
    categoria: "BOMBAS",
    subcategoria: "SUMERGIBLES SOLARES",
    title: "ELECTROBOMBA SOLAR FHOTON 3 SOLARPAK",
  },
  {
    id: 1,
    image: "/img/Servicio1.jpg",
    categoria: "PANELES",
    subcategoria: "SOLARES",
    title: "PANELES SOLARES WEG",
  },
  {
    id: 2,
    image: "/img/Servicio2.jpg",
    categoria: "BOMBAS",
    subcategoria: "SUMERGIBLE",
    title: "ELECTROBOMBA SOLAR FHOTON 3 SOLARPAK",
  },
  {
    id: 1,
    image: "/img/Servicio1.jpg",
    categoria: "GENERADORES",
    subcategoria: "SOLARES",
    title: "PANELES SOLARES WEG",
  },
  {
    id: 2,
    image: "/img/Servicio2.jpg",
    categoria: "BOMBAS",
    subcategoria: "SUMERGIBLES SOLARES",
    title: "ELECTROBOMBA SOLAR FHOTON 3 SOLARPAK",
  },
  // ...other products
]);

const categories = computed(() => {
  const uniqueCategories = new Set(
    products.value.map((product) => product.categoria)
  );
  return Array.from(uniqueCategories);
});

const subcategories = computed(() => {
  if (selectedCategories.value.length === 0) return [];
  const uniqueSubcategories = new Set(
    products.value
      .filter((product) => selectedCategories.value.includes(product.categoria))
      .map((product) => product.subcategoria)
  );
  return Array.from(uniqueSubcategories);
});

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesTitle = product.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(product.categoria);
    const matchesSubcategory =
      selectedSubcategories.value.length === 0 ||
      selectedSubcategories.value.includes(product.subcategoria);
    return matchesTitle && matchesCategory && matchesSubcategory;
  });
});

const viewProduct = (id) => {
  router.push({ name: "ProductDetail", params: { id } });
};
</script>
