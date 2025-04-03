<template>
  <div
    class="flex place-content-center relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 gap-20 py-20">
      <h1
        class="text-6xl font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Nuestros Productos
      </h1>
      <div class="flex flex-row gap-4">
        <div
          class="bg-white rounded-lg py-5 px-4 w-1/4 gap-4 flex flex-col h-fit"
        >
          <div class="flex flex-col w-full gap-1 border-b py-4">
            <label class="font-semibold pl-2">Filtrar por palabra</label>
            <input
              class="bg-tertiary rounded-lg w-full px-2 py-1"
              v-model="searchQuery"
              placeholder="Buscar productos..."
            />
          </div>
          <div class="flex flex-col w-full gap-1 border-b pb-4">
            <label class="font-semibold pl-2 pb-2">Filtrar por categoría</label>
            <div
              v-for="category in categories"
              :key="category"
              class="flex items-center px-4"
            >
              <input
                type="checkbox"
                :value="category"
                v-model="selectedCategories"
                class="mr-2"
              />
              <span>{{ category }}</span>
            </div>
          </div>
          <div
            class="flex flex-col w-full gap-1"
            v-if="subcategories.length > 0"
          >
            <label class="font-semibold pl-2 pb-2"
              >Filtrar por subcategoria</label
            >
            <div
              v-for="subcategory in subcategories"
              :key="subcategory"
              class="flex items-center px-4"
            >
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
            @click="viewProduct(product.id)"
            class="flex flex-col relative bg-white rounded-lg overflow-hidden hover:cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <!-- <h3
              class="absolute bg-[#1063b1e1] text-white text-xl w-full text-center font-semibold py-2 px-5"
            >
              {{ product.categoria }}
            </h3> -->
            <NuxtImg
              class="aspect-square p-3 rounded-lg"
              :src="'/img/Productos/Automotor5.png'"
              :alt="product.title"
            />
            <div
              class="flex flex-col p-4 border-t justify-between h-full gap-12"
            >
              <div class="flex flex-col items-baseline gap-4">
                <p class="text-lg font-semibold">
                  {{ product.title }}
                </p>

                <p class="text-sm">
                  <span
                    class="bg-orange text-white font-semibold py-1 px-2 rounded-lg"
                    >{{ product.categoria }}
                    <span v-if="product.subcategoria"
                      >- {{ product.subcategoria }}</span
                    ></span
                  >
                </p>
              </div>

              <VButton
                class="!text-base !rounded-lg !bg-background text-white font-semibold !w-full !justify-center"
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
