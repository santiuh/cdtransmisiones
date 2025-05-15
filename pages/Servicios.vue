<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div
      class="flex flex-col w-full max-w-[1440px] px-4 lg:px-10 gap-10 lg:gap-20 py-24 lg:py-20"
    >
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Conocé nuestros servicios
      </h1>

      <!-- Nueva card dinámica -->
      <div
        class="flex flex-row justify-center gap-4 lg:gap-9"
        data-aos="fade-up"
      >
        <VButton
          @click="servicio = 1"
          titulo="ASISTENCIA TECNICA"
          class="!text-base lg:!text-lg"
          :class="{
            '!bg-orangelight text-white': servicio === 1,
          }"
          noflecha="true"
        ></VButton>
        <VButton
          @click="servicio = 2"
          titulo="TALLER DE REPARACION"
          class="!text-base lg:!text-lg"
          :class="{
            '!bg-orangelight !text-white': servicio === 2,
          }"
          noflecha="true"
        ></VButton>
      </div>
      <div
        class="flex flex-col gap-4 lg:w-3/4 self-center items-center"
        data-aos="fade-up"
        v-show="servicio === 1"
      >
        <NuxtImg
          src="/img/Empresa/empresa1.jpg"
          class="h-48 lg:h-96 w-full rounded-3xl drop-shadow-xl object-cover shadow-lg self-center"
        ></NuxtImg>

        <div
          class="flex flex-col gap-4 mt-8 text-white text-shadow-lg text-lg w-5/6"
        >
          <div class="flex flex-col gap-1">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span> Asistencia a planta</span>
            </div>

            <span class="pl-9"
              >Contar con una asistencia técnica in situ le garantiza mejorar la
              productividad de su empresa. Nuestro personal se ocupa de realizar
              una visita en planta para verificar y asesorarlo sobre los equipos
              que usted necesita reemplazar o reparar para optimizar el
              funcionamiento general de la empresa.</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span> Asesoramiento personalizado </span>
            </div>

            <span class="pl-9"
              >Nos ocupamos de asesorarlo personalmente acerca de la mejor
              manera de optimizar la productividad de sus equipos.</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Servicio de mantenimiento</span>
            </div>

            <span class="pl-9"
              >Realizamos el mantenimiento predictivo y preventivo de sus
              equipos directamente en planta, evitando tener que trasladarlos y
              frenar su producción.</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Paneles Solares </span>
            </div>

            <span class="pl-9"
              >La tecnología no se detiene y las energías renovables están en
              nuestro portafolio de soluciones. Realizamos la instalación de
              paneles solares WEG: una oportunidad de inversión ideal para
              reducir costos y optimizar recursos, generando energía limpia y
              evitando altos costos en tarifas eléctricas..</span
            >
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span> Tu empresa eco-friendly </span>
            </div>
            <span class="pl-9"
              >Tanto si usted cuenta con un comercio, industria o agroindustria,
              con los paneles solares podrá transformar su empresa en una
              empresa amigable con el medio ambiente.</span
            >
          </div>
        </div>
      </div>
      <div
        class="flex flex-col gap-4 lg:w-3/4 self-center items-center"
        data-aos="fade-up"
        v-show="servicio === 2"
      >
        <NuxtImg
          src="/img/Empresa/empresa2.jpg"
          class="h-48 lg:h-96 w-full rounded-3xl drop-shadow-xl object-cover shadow-lg self-center"
        ></NuxtImg>

        <div
          class="flex flex-row gap-10 text-white text-shadow-lg mt-8 text-xl"
        >
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Exhaustiva revisión del motor eléctrico</span>
            </div>

            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Detección de fallas</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Desarmado de motor</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Limpieza y arenado de carcasa</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Pintura exterior de motor eléctrico</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span> Rebobinado del motor eléctrico</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Doble barnizado</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Ensamblado del motor</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Control de calidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const servicio = ref(1); // Estado para el servicio seleccionado

// Mock de datos de servicios
const servicesMock = {
  VisitaPlanta: {
    title: "Visita a Planta",
    image: "/img/VisitaPlanta.jpg",
    description:
      "Ofrecemos visitas guiadas a nuestra planta para conocer nuestros procesos y servicios en detalle.",
  },
  Reparacion: {
    title: "Reparación de Equipos",
    image: "/img/Reparacion.jpg",
    description:
      "Servicio especializado en reparación de motores eléctricos, electrobombas y más.",
  },
};

const route = useRoute();
const serviceId = route.params.id || "VisitaPlanta"; // ID de la página
const serviceData = ref(servicesMock[serviceId] || servicesMock.VisitaPlanta);
</script>

<style>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
