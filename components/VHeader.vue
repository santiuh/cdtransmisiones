<template>
  <div
    class="hidden lg:flex flex-col backdrop-blur-md shadow-md"
    :class="{
      ' !bg-primary ': isScrolled && isHome,
      'fixed z-50 w-full bg-transparent bg-gradient-to-b from-primary/70 to-transparent ':
        isHome,
      ' bg-primary ': !isHome,
    }"
    :style="{
      transition: 'background-color 0.3s ease-in-out',
    }"
  >
    <div
      class="flex flex-row justify-between py-4 px-10 self-center w-full max-w-[1440px]"
    >
      <NuxtImg
        @click="router.push('/')"
        class="transition-all duration-300 !h-14 !w-auto hover:cursor-pointer hover:scale-105 hover:brightness-90"
        :class="!isHome ? '' : isScrolled && isHome ? '!h-10' : '!h-12'"
        :src="
          !isHome
            ? 'img/logononameblanco.png'
            : isScrolled && isHome
            ? 'img/logononameblanco.png'
            : 'img/logononame.png'
        "
      ></NuxtImg>
      <div class="flex flex-row">
        <div
          class="font-medium text-lg gap-10 flex flex-row"
          :class="
            !isHome
              ? 'text-white'
              : isScrolled && isHome
              ? 'text-white'
              : 'text-white'
          "
        >
          <button
            class="hover:text-orangelight transition-all duration-300"
            @click="goTo('/Productos')"
          >
            PRODUCTOS
          </button>
          <button
            class="hover:text-orangelight transition-all duration-300"
            @click="goTo('/Servicios')"
          >
            SERVICIOS
          </button>

          <button
            class="hover:text-orangelight transition-all duration-300"
            @click="goTo('/Empresa')"
          >
            EMPRESA
          </button>

          <button
            class="hover:text-orangelight transition-all duration-300"
            @click="goTo('/Contacto')"
          >
            CONTACTO
          </button>
        </div>
        <div
          class="flex flex-row border-l gap-3 pl-5 ml-5 items-center"
          :class="
            !isHome
              ? 'border-l-orangelight'
              : isScrolled && isHome
              ? 'border-l-orangelight'
              : ' border-l-white'
          "
        >
          <NuxtLink
            to="https://www.instagram.com/imoberdorfhnos/"
            target="_blank"
          >
            <svgo-ig
              class="!h-7 !w-7 hover:text-orangelight transition-all duration-300"
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
              class="!h-7 !w-7 hover:text-orangelight transition-all duration-300"
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
              class="!h-7 !w-7 hover:text-orangelight transition-all duration-300"
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
    <!-- <div
      v-if="!isHome"
      :style="{
        backgroundImage: `url('/img/${banner}.png')`,
      }"
      class="flex justify-center bg-cover bg-no-repeat"
    >
      <div
        class="text-4xl py-14 flex flex-col text-white text-center"
        v-if="route.path?.includes('Productos')"
      >
        <h1 class="font-extrabold text-4xl relative">
          {{
            route.path === "/Productos"
              ? "Automotríz"
              : route.path.includes("Agricola")
              ? "Agrícola"
              : "Industrial"
          }}
          <p class="font-medium text-lg absolute bottom-9 w-full">
            Línea&nbsp;de&nbsp;productos
          </p>
        </h1>
      </div>
      <h1 v-else class="font-extrabold text-4xl py-14 flex text-white">
        {{ banner }}
      </h1>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const router = useRouter();
const route = useRoute();

const isHome = computed(() => {
  return route.path === "/";
});

const banner = computed(() => {
  const path = route.path.split("/").filter(Boolean).pop();
  return path ? path.toUpperCase() : "default";
});

// Estado para controlar el fondo cuando se hace scroll
const isScrolled = ref(false);

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
  if (ruta === "/Clientes") {
    window.open("https://catalogo.rodaservice.com.ar/", "_blank");
  } else router.push(ruta);
};
</script>
