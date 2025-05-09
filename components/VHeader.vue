<template>
  <div
    class="hidden lg:flex flex-col backdrop-blur-md shadow-md !z-40"
    :class="{
      ' !bg-primary ': isScrolled && isHome,
      'fixed  w-full bg-transparent bg-gradient-to-b from-primary/70 to-transparent ':
        isHome,
      ' bg-primary ': !isHome,
    }"
    :style="{
      transition: 'background-color 0.3s ease-in-out',
    }"
  >
    <div
      class="flex flex-row justify-between px-10 self-center w-full max-w-[1440px]"
    >
      <NuxtImg
        @click="router.push('/')"
        class="transition-all duration-300 my-3 !h-20 !w-auto hover:cursor-pointer hover:scale-105 hover:brightness-90"
        :class="!isHome ? '' : isScrolled && isHome ? '!h-10' : '!h-12'"
        :src="
          !isHome
            ? 'img/logoblanco.png'
            : isScrolled && isHome
            ? 'img/logoblanco.png'
            : 'img/logo.png'
        "
      ></NuxtImg>
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
          <div class="group hover:text-orange flex flex-col justify-center">
            <span class="transition-all duration-300"> PRODUCTOS </span>
            <div
              style="box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.5)"
              class="absolute left-0 top-[104px] hidden justify-center group-hover:flex bg-tertiary w-screen text-black shadow-lg py-4 px-10"
            >
              <div
                class="flex flex-row justify-between lg:max-w-[1440px] w-full"
              >
                <div
                  v-for="category in categories"
                  :key="category.name"
                  class="mb-2 text-start"
                >
                  <p class="font-bold text-primary border-b px-4 py-1">
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

// Lista de servicios con rutas SEO-friendly

const categories = [
  {
    name: "Motores Eléctricos",
    subcategories: [
      {
        name: "Eléctricos de Aluminio",
        items: [
          {
            name: "Línea W21",
            route: "motores-electricos/electricos-aluminio/linea-w21",
          },
          {
            name: "Línea W12",
            route: "motores-electricos/electricos-aluminio/linea-w12",
          },
        ],
      },
      {
        name: "W22",
        items: [
          {
            name: "W22 IE1",
            route: "motores-electricos/electricos-aluminio/w22/ie1",
          },
          {
            name: "W22 IE3",
            route: "motores-electricos/electricos-aluminio/w22/ie3",
          },
        ],
      },
      { name: "Con Freno", route: "motores-electricos/con-freno" },
      { name: "Antiexplosivos", route: "motores-electricos/antiexplosivos" },
      { name: "Monofásicos", route: "motores-electricos/monofasicos" },
      {
        name: "Motor de Hormigonera",
        route: "motores-electricos/motor-hormigonera",
      },
      {
        name: "Dispositivo de Monitoreo",
        route: "motores-electricos/dispositivo-monitoreo",
      },
    ],
  },
  {
    name: "Motorreductores",
    subcategories: [
      { name: "Reductor WC650", route: "motorreductores/reductor-wc650" },
      {
        name: "Motorreductores GSA",
        route: "motorreductores/motorreductores-gsa",
      },
    ],
  },
  {
    name: "Drives",
    subcategories: [
      {
        name: "Variadores de Frecuencia",
        items: [
          { name: "CFW100", route: "drives/variadores-frecuencia/cfw100" },
          { name: "CFW300", route: "drives/variadores-frecuencia/cfw300" },
          { name: "CFW500", route: "drives/variadores-frecuencia/cfw500" },
          { name: "CFW900", route: "drives/variadores-frecuencia/cfw900" },
          { name: "CFW11", route: "drives/variadores-frecuencia/cfw11" },
        ],
      },
      {
        name: "Arranque Suave",
        items: [
          { name: "SSW05", route: "drives/arranque-suave/ssw05" },
          { name: "SSW07", route: "drives/arranque-suave/ssw07" },
          { name: "SSW900", route: "drives/arranque-suave/ssw900" },
        ],
      },
      {
        name: "Controles Lógico-Programables",
        items: [
          {
            name: "PLC300",
            route: "drives/controles-logico-programables/plc300",
          },
          {
            name: "PLC600",
            route: "drives/controles-logico-programables/plc600",
          },
          {
            name: "CLIC02",
            route: "drives/controles-logico-programables/clic02",
          },
        ],
      },
      {
        name: "Servomotores",
        items: [
          {
            name: "Servoconvertidores",
            route: "drives/servomotores/servoconvertidores",
          },
        ],
      },
      { name: "Arrancadores Directos", route: "drives/arrancadores-directos" },
    ],
  },
  {
    name: "Controls",
    subcategories: [
      { name: "Contactores", route: "controls/contactores" },
      { name: "Relé Sobrecarga", route: "controls/rele-sobrecarga" },
      { name: "Guardamotores", route: "controls/guardamotores" },
      { name: "Interruptores", route: "controls/interruptores" },
      { name: "Mando y Señalización", route: "controls/mando-y-senalizacion" },
      { name: "Tableros", route: "controls/tableros" },
    ],
  },
  {
    name: "Bombas de Agua",
    subcategories: [
      {
        name: "Bombas Centrífugas y Periféricas",
        route: "bombas-agua/bombas-centrifugas-perifericas",
      },
      { name: "Bombas Sumergibles", route: "bombas-agua/bombas-sumergibles" },
      {
        name: "Bombas Presurizadoras",
        route: "bombas-agua/bombas-presurizadoras",
      },
      { name: "Bombas para Piscinas", route: "bombas-agua/bombas-piscinas" },
      { name: "Bombas Solares", route: "bombas-agua/bombas-solares" },
      { name: "Accesorios", route: "bombas-agua/accesorios" },
    ],
  },
];
const services = [
  { name: "Bobinado", route: "/Servicios/Bobinado" },
  { name: "Asistencia técnica", route: "/Servicios/AsistenciaTecnica" },
  { name: "Mantenimiento", route: "/Servicios/Mantenimiento" },
  { name: "Taller de reparación", route: "/Servicios/TallerReparacion" },
  {
    name: "Asistencia técnica con visita en planta",
    route: "/Servicios/VisitaPlanta",
  },
  { name: "Automatización", route: "/Servicios/Automatizacion" },
  {
    name: "Reparación de convertidores de frecuencia",
    route: "/Servicios/ReparacionConvertidores",
  },
  {
    name: "Capacitaciones para las empresas",
    route: "/Servicios/Capacitaciones",
  },
  { name: "Campo y medición", route: "/Servicios/CampoMedicion" },
  { name: "Pruebas a bombas", route: "/Servicios/PruebasBombas" },
  {
    name: "Fabricación de tableros eléctricos",
    route: "/Servicios/TablerosElectricos",
  },
];
</script>
