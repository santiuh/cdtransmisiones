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
        <div class="bg-white rounded-3xl px-3 py-5 w-2/5 gap-4 flex flex-col">
          <div class="flex flex-col w-full gap-1">
            <label class="font-semibold pl-2">Filtrar por palabra</label>
            <input
              class="bg-tertiary rounded-3xl w-full px-2 py-1"
              v-model="searchQuery"
              placeholder="Buscar productos..."
            />
          </div>
          <div class="flex flex-col w-full gap-1">
            <label class="font-semibold pl-2">Filtrar por categoría</label>

            <select
              class="bg-tertiary rounded-3xl w-full px-2 py-1 font-semibold"
              v-model="selectedCategory"
            >
              <option value="">Todas las Categorías</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
          <div
            class="flex flex-col w-full gap-1"
            v-if="subcategories.length > 0"
          >
            <label class="font-semibold pl-2">Filtrar por subcategoria</label>
            <select
              class="bg-tertiary rounded-3xl w-full px-2 py-1"
              v-model="selectedSubcategory"
            >
              <option value="">Todas las Subcategorías</option>
              <option
                v-for="subcategory in subcategories"
                :key="subcategory"
                :value="subcategory"
              >
                {{ subcategory }}
              </option>
            </select>
          </div>
        </div>
        <div class="grid grid-flow-row grid-cols-4 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="flex flex-col bg-white"
          >
            <NuxtImg
              class="aspect-square"
              :src="product.image"
              alt="product.title"
            />
            <div>
              <h3>{{ product.title }}</h3>
              <p>{{ product.categoria }}</p>
              <p v-if="product.subcategoria">{{ product.subcategoria }}</p>
              <button @click="viewProduct(product.id)">Ver Producto</button>
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
const selectedCategory = ref("");
const selectedSubcategory = ref("");

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
  if (!selectedCategory.value) return [];
  const uniqueSubcategories = new Set(
    products.value
      .filter((product) => product.categoria === selectedCategory.value)
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
      !selectedCategory.value || product.categoria === selectedCategory.value;
    const matchesSubcategory =
      !selectedSubcategory.value ||
      product.subcategoria === selectedSubcategory.value;
    return matchesTitle && matchesCategory && matchesSubcategory;
  });
});

const viewProduct = (id) => {
  router.push({ name: "ProductDetail", params: { id } });
};
</script>
