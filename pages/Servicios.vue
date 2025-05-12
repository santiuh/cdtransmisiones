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
          titulo="Servicio uno"
          class="!text-base lg:!text-lg"
          :class="{
            '!bg-orangelight text-white': servicio === 1,
          }"
          noflecha="true"
        ></VButton>
        <VButton
          @click="servicio = 2"
          titulo="Servicio dos"
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
        <span
          class="text-white px-4 text-justify self-center text-shadow-lg text-lg py-10"
          >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium
          beatae quidem eligendi reprehenderit, quam cum neque tenetur harum
          recusandae delectus, animi rem? Earum esse ad repellat. Ipsa ipsam
          error numquam? Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Illum, voluptatem dignissimos earum nulla nobis ex! Accusantium
          aut tempore veniam exercitationem consequatur iusto voluptates, vel
          harum quia est, sequi unde autem!</span
        >
        <div class="flex flex-row gap-10 text-white text-lg">
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción</span>
            </div>
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
        <span
          class="text-white px-4 text-justify self-center text-shadow-lg text-lg py-10"
          >Lorem ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Accusantium beatae quidem eligendi reprehenderit, quam cum neque
          tenetur harum recusandae delectus, animi rem? Earum esse ad repellat.
          Ipsa ipsam error numquam? Lorem ipsum dolor siLorem ipsum dolor sit
          amet consectetur, adipisicing elit. Accusantium beatae quidem eligendi
          reprehenderit, quam cum neque tenetur harum recusandae delectus, animi
          rem? Earum esse ad repellat. Ipsa ipsam error numquam? Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Illum, voluptatem
          dignissimos earum nulla nobis ex! Accusantium aut tempore veniam
          exercitationem consequatur iusto voluptates, vel harum quia est, sequi
          unde autem!
        </span>
        <div class="flex flex-row gap-10 text-white text-lg">
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
            </div>
            <div class="flex flex-row gap-4 items-center">
              <svgo-check class="text-orangelight !w-auto !h-7"></svgo-check>
              <span>Nombre de la acción 2</span>
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
