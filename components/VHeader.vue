<template>
  <div
    class="hidden lg:flex flex-col backdrop-blur-md shadow-md !z-40"
    :class="{
      ' !bg-primary ': isScrolled && isHome,
      'fixed  w-full bg-transparent bg-gradient-to-b from-primary/70 to-transparent ':
        isHome,
      ' bg-primary relative ': !isHome,
    }"
    :style="{
      transition: 'background-color 0.3s ease-in-out',
      // Se corre bajo la barra de anuncio (sticky) cuando está activa; 0 si no.
      top: 'var(--sms-ann-h, 0px)',
    }"
  >
    <div
      class="flex flex-row justify-between px-10 self-center w-full max-w-[1440px]"
    >
      <!-- Logo con crossfade suave color↔blanco al hacer scroll (mismo ratio,
           se superponen y se hace fade de opacidad en vez de swap de src). -->
      <div
        @click="router.push('/')"
        class="relative my-3 !w-auto transition-all duration-300 hover:cursor-pointer hover:scale-105 hover:brightness-90"
        :class="!isHome ? '!h-20' : isScrolled && isHome ? '!h-10' : '!h-12'"
      >
        <NuxtImg
          src="img/logo.png"
          class="h-full w-auto transition-opacity duration-300 ease-in-out"
          :class="showColorLogo ? 'opacity-100' : 'opacity-0'"
        ></NuxtImg>
        <NuxtImg
          src="img/logoblanco.png"
          class="absolute top-0 left-0 h-full w-auto transition-opacity duration-300 ease-in-out"
          :class="showColorLogo ? 'opacity-0' : 'opacity-100'"
        ></NuxtImg>
      </div>
      <div class="flex flex-row">
        <div
          class="font-medium gap-10 flex flex-row"
          :class="
            !isHome
              ? 'text-white'
              : isScrolled && isHome
              ? 'text-white'
              : 'text-white'
          "
        >
          <button
            class="hover:text-orange transition-all duration-300 relative h-fit self-center"
            @click="goTo('/Tienda')"
          >
            TIENDA
            <span
              v-if="showNewBadge"
              class="absolute -top-4 -right-6 bg-orange text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
            >
              NUEVO
            </span>
          </button>
          <div class="group hover:text-orange flex flex-col justify-center">
            <span class="transition-all duration-300"> PRODUCTOS </span>
            <!-- El panel se ancla al borde inferior del header (top-full) para que
                 no quede hueco entre el header y el submenú sin importar la altura
                 del logo (home / home scrolleado / páginas internas). -->
            <div
              style="box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.5)"
              class="absolute left-0 top-full hidden justify-center group-hover:flex bg-tertiary w-screen text-black shadow-lg py-4 px-10"
            >
              <div
                class="flex flex-row justify-between lg:max-w-[1440px] w-full"
              >
                <div
                  v-for="group in catalogGroups"
                  :key="group.category?.id || 'sin-categoria'"
                  class="mb-2 text-start"
                >
                  <p class="font-bold text-primary border-b px-4 py-1">
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
          </div>

          <button
            class="hover:text-orange transition-all duration-300"
            @click="goTo('/Servicios')"
          >
            SERVICIOS
          </button>
          <button
            class="hover:text-orange transition-all duration-300"
            @click="goTo('/Empresa')"
          >
            EMPRESA
          </button>
          <button
            class="hover:text-orange transition-all duration-300"
            @click="goTo('/Catalogo')"
          >
            CATÁLOGO
          </button>
          <button
            class="hover:text-orange transition-all duration-300"
            @click="goTo('/Contacto')"
          >
            CONTACTO
          </button>
        </div>
        <div
          class="flex flex-row border-l gap-3 pl-5 ml-5 items-center border-l-orange"
        >
          <NuxtLink
            to="https://www.instagram.com/imoberdorfhnos/"
            target="_blank"
          >
            <svgo-ig
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
              :class="
                !isHome
                  ? 'text-white'
                  : isScrolled && isHome
                  ? 'text-white'
                  : 'text-white'
              "
            ></svgo-ig
          ></NuxtLink>
          <NuxtLink
            to="https://www.linkedin.com/in/imoberdorf-hnos-s-a-628470257"
            target="_blank"
          >
            <svgo-li
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
              :class="
                !isHome
                  ? 'text-white'
                  : isScrolled && isHome
                  ? 'text-white'
                  : 'text-white'
              "
            ></svgo-li
          ></NuxtLink>
          <NuxtLink
            to="https://www.facebook.com/imoberdorfhnos "
            target="_blank"
          >
            <svgo-fb
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
              :class="
                !isHome
                  ? 'text-white'
                  : isScrolled && isHome
                  ? 'text-white'
                  : 'text-white'
              "
            ></svgo-fb
          ></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const router = useRouter();
const route = useRoute();

// Nav de PRODUCTOS desde el widget del panel (refleja alta/baja de productos).
const { groups: catalogGroups } = await useCatalog();

const isHome = computed(() => {
  return route.path === "/";
});

// El logo a color solo se muestra arriba de todo en el Home (fondo claro/translúcido);
// al scrollear o en páginas internas (fondo primary) se hace fade al logo blanco.
const showColorLogo = computed(() => isHome.value && !isScrolled.value);

const banner = computed(() => {
  const path = route.path.split("/").filter(Boolean).pop();
  return path ? path.toUpperCase() : "default";
});

// Estado para controlar el fondo cuando se hace scroll
const isScrolled = ref(false);

// Estado para controlar la visibilidad del badge "NUEVO"
const showNewBadge = computed(() => {
  const launchDate = new Date("2025-10-14"); // Fecha de lanzamiento de la tienda
  const currentDate = new Date();
  const daysDifference = Math.floor(
    (currentDate - launchDate) / (1000 * 60 * 60 * 24)
  );
  return daysDifference < 30;
});

// Función que maneja el evento de scroll
const handleScroll = () => {
  if (window.scrollY > 100) {
    // Cambiar '100' por la distancia que prefieras
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }
};

// Agregar listener para el evento de scroll
onMounted(() => {
  if (isHome.value) {
    window.addEventListener("scroll", handleScroll);
  }
});

const goTo = (ruta) => {
  if (ruta === "/Catalogo") {
    window.open(
      "https://drive.google.com/drive/folders/13Sm4bwURvB3TQiCvf0jiV5YEgjvG7L6f",
      "_blank"
    );
  } else if (ruta === "/Tienda") {
    window.open("https://tienda.imoberdorfhnos.com.ar", "_blank");
  } else router.push(ruta);
};
</script>
