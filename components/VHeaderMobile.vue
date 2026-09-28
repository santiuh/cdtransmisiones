<template>
  <div
    class="w-full flex justify-center xl:pt-[52px] xl:pb-[32px] text-white"
    :class="route.path === '/contacto' ? 'absolute' : 'bg-primary'"
  >
    <!-- data-sms-header: una portada de la biblioteca del panel le deja lugar a
         este encabezado fijo. -->
    <nav
      data-sms-header
      class="flex flex-col w-full xl:hidden fixed z-50 transition-all duration-300"
      :class="{
        '!bg-primary': menu,
        ' !bg-primary ': isScrolled && isHome,
        ' fixed z-50 w-full bg-transparent ': isHome,
        ' bg-primary ': !isHome,
      }"
      :style="{ top: 'var(--sms-ann-h, 0px)' }"
    >
      <div class="w-full flex flex-row relative justify-between px-4 py-3">
        <NuxtLink class="items-center flex" to="/">
          <NuxtImg
            v-show="!menu"
            :src="isScrolled || !isHome ? 'svg/logo.svg' : 'svg/logocolor.svg'"
            class="self-center transition-all duration-300 h-10"
          ></NuxtImg>
        </NuxtLink>
        <!-- Carrito (solo con la tienda prendida), a la izquierda del menú. -->
        <TiendaCarritoIcono
          v-if="shopEnabled"
          :claro="iconosClaros"
          class="absolute right-14 top-4"
          @click="menu = false"
        />
        <svgo-menu
          @click="menu = !menu"
          class="!w-6 !h-auto absolute right-5 top-5"
          :class="{
            ' !stroke-primary': !iconosClaros,
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
          <!-- El texto va al listado; la flecha despliega las categorías. -->
          <div class="flex items-center gap-3">
            <button
              @click="goTo('/Productos')"
              class="hover:cursor-pointer transition-all duration-300 text-left"
            >
              PRODUCTOS
            </button>
            <button
              @click="toggleDropdown"
              class="flex h-8 w-8 items-center justify-center"
              :aria-expanded="dropdownOpen ? 'true' : 'false'"
              aria-label="Ver categorías de productos"
            >
              <TiendaIcono
                name="chevron-abajo"
                class="h-5 w-5 transition-transform duration-300"
                :class="dropdownOpen ? 'rotate-180' : ''"
              />
            </button>
          </div>
          <div v-show="dropdownOpen" class="flex flex-col py-4 w-full">
            <button
              class="mb-3 text-left text-sm font-bold underline underline-offset-4"
              @click="goTo('/Productos')"
            >
              Ver todos los productos ›
            </button>
            <div
              v-for="group in catalogGroups"
              :key="group.category?.id || 'sin-categoria'"
              class="mb-2 text-start"
            >
              <p class="font-bold border-b pl-4 mr-4 py-1">
                {{ group.category?.name || "Otros" }}
              </p>
              <ul class="ml-4 py-1">
                <li
                  v-for="item in group.items"
                  :key="item.id"
                  class="text-sm"
                >
                  <button
                    class="hover:text-orange transition-all duration-300 py-1"
                    @click="goTo(`/Productos/${item.id}`)"
                  >
                    {{ item.name }}
                  </button>
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
          to="https://drive.google.com/drive/folders/13Sm4bwURvB3TQiCvf0jiV5YEgjvG7L6f"
          target="_blank"
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
        <!-- Páginas nuevas del panel marcadas "Mostrar en el menú". -->
        <NuxtLink
          v-for="p in paginasMenu"
          :key="p.slug"
          @click="menu = false"
          class="hover:cursor-pointer transition-all duration-300 uppercase"
          :to="`/${p.slug}`"
        >
          {{ p.title }}
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const route = useRoute();

// Nav de PRODUCTOS desde el widget del panel (refleja alta/baja de productos).
const { groups: catalogGroups, shopEnabled } = await useCatalog();
const menu = ref(false);
const isScrolled = ref(false);
const dropdownOpen = ref(false);

const isHome = computed(() => {
  return route.path === "/";
});

const sitePages = useState("smsPages", () => null);
const paginasMenu = computed(() =>
  (sitePages.value?.pages || []).filter((p) => p.show_in_nav)
);

// Arriba de todo en el home el header es transparente sobre fondo claro → los
// íconos (menú y carrito) van en primary; en el resto, blancos.
const iconosClaros = computed(() => !(!isScrolled.value && isHome.value && !menu.value));

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
