<template>
  <div
    class="w-full flex justify-center xl:pt-[52px] xl:pb-[32px] text-white"
    :class="route.path === '/contacto' ? 'absolute' : 'bg-primary'"
  >
    <nav
      class="flex flex-col w-full xl:hidden fixed z-50 transition-all duration-300"
      :class="{
        '!bg-primary': menu,
        ' !bg-primary ': isScrolled && isHome,
        ' fixed z-50 w-full bg-transparent ': isHome,
        ' bg-primary ': !isHome,
      }"
    >
      <div class="w-full flex flex-row relative justify-between px-4 py-3">
        <NuxtLink class="items-center flex" to="/">
          <NuxtImg
            v-show="!menu"
            :src="isScrolled || !isHome ? 'svg/logo.svg' : 'svg/logocolor.svg'"
            class="self-center transition-all duration-300 h-10"
          ></NuxtImg>
        </NuxtLink>
        <svgo-menu
          @click="menu = !menu"
          class="!w-6 !h-auto absolute right-5 top-5"
          :class="{
            ' !stroke-primary': !isScrolled && isHome && !menu,
          }"
          src="svg/menu.svg"
        ></svgo-menu>
      </div>
      <div
        :class="menu ? 'h-auto pb-4' : 'h-0'"
        class="flex flex-col font-semibold text-xl gap-4 pl-8 overflow-auto max-h-[90vh] shadow-lg transition-all"
      >
        <NuxtLink
          @click="menu = false"
          class="hover:cursor-pointer transition-all duration-300"
          to="/"
        >
          INICIO
        </NuxtLink>
        <button
          @click="goTo('/Tienda')"
          class="hover:cursor-pointer transition-all duration-300 relative flex items-center text-left"
        >
          TIENDA
          <span
            v-if="showNewBadge"
            class="ml-2 bg-orange text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
          >
            NUEVO
          </span>
        </button>
        <div class="group hover:cursor-pointer transition-all duration-300">
          <span
            @click="toggleDropdown"
            class="hover:cursor-pointer transition-all duration-300"
          >
            PRODUCTOS
          </span>
          <div v-show="dropdownOpen" class="flex flex-col py-4 w-full">
            <div
              v-for="category in categories"
              :key="category.name"
              class="mb-2 text-start"
            >
              <p class="font-bold border-b pl-4 mr-4 py-1">
                {{ category.name }}
              </p>
              <ul class="ml-4 py-1">
                <li
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.name"
                  class="text-sm"
                >
                  <template v-if="subcategory.items">
                    <p class="font-semibold text-orange">
                      {{ subcategory.name }}
                    </p>
                    <ul class="ml-4">
                      <li
                        v-for="item in subcategory.items"
                        :key="item.name"
                        class="text-sm"
                      >
                        <button
                          class="hover:text-orange transition-all duration-300 py-1"
                          @click="goTo(`/Productos/${item.route}`)"
                        >
                          {{ item.name }}
                        </button>
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <button
                      class="hover:text-orange transition-all duration-300"
                      @click="goTo(`/Productos/${subcategory.route}`)"
                    >
                      {{ subcategory.name }}
                    </button>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <NuxtLink
          @click="menu = false"
          class="hover:cursor-pointer transition-all duration-300"
          to="/EMPRESA"
        >
          EMPRESA
        </NuxtLink>

        <NuxtLink
          @click="menu = false"
          class="hover:cursor-pointer transition-all duration-300"
          to="https://drive.google.com/file/d/17Jnr_bjVkLtNjzQePbBwVmtTz_QMoANc/view"
        >
          CATÁLOGO
        </NuxtLink>
        <NuxtLink
          @click="menu = false"
          class="hover:cursor-pointer transition-all duration-300"
          to="/CONTACTO"
        >
          CONTACTO
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { categories } from "@/data/categories";

const route = useRoute();
const menu = ref(false);
const isScrolled = ref(false);
const dropdownOpen = ref(false);

const isHome = computed(() => {
  return route.path === "/";
});

// Estado para controlar la visibilidad del badge "NUEVO"
const showNewBadge = computed(() => {
  const launchDate = new Date("2025-10-14"); // Fecha de lanzamiento de la tienda
  const currentDate = new Date();
  const daysDifference = Math.floor(
    (currentDate - launchDate) / (1000 * 60 * 60 * 24)
  );
  return daysDifference < 30;
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const goTo = (ruta) => {
  if (ruta === "/Clientes") {
    window.open("https://catalogo.rodaservice.com.ar/", "_blank");
  } else if (ruta === "/Tienda") {
    window.open("https://tienda.imoberdorfhnos.com.ar", "_blank");
    menu.value = false;
    dropdownOpen.value = false;
  } else {
    menu.value = false;
    dropdownOpen.value = false;
    useRouter().push(ruta);
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
