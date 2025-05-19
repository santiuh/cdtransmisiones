<template>
  <div
    class="h-screen relative flex items-center bg-center overflow-hidden justify-center"
  >
    <div
      class="flex flex-col lg:flex-row max-w-[1440px] items-center w-full gap-12 lg:px-10"
    >
      <NuxtImg
        src="img/logo.png"
        class="!h-auto w-5/6 lg:w-1/3"
        data-aos="fade-right"
      ></NuxtImg>
      <h1
        class="text-center lg:text-start text-xl lg:text-4xl font-extrabold text-primary !font-raleway"
        data-aos="fade-left"
      >
        BOBINADO, REPARARACIÓN Y VENTA DE
        <span class="text-orange"> MOTORES ELÉCTRICOS, BOMBAS Y DRIVES</span>
      </h1>
      <!-- <p class="text-lg text-white">Bobinado, reparación y venta de motores eléctricos</p> -->
    </div>
  </div>
</template>

<script setup>
import AOS from "aos";
import "aos/dist/aos.css";
</script>

<style scoped>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
