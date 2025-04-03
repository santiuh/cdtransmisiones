<template>
  <div
    class="h-screen relative flex items-center bg-center overflow-hidden justify-center"
  >
    <div class="flex flex-row max-w-[1440px] items-center w-full gap-12 px-10">
      <NuxtImg
        src="img/logo.png"
        class="!h-auto w-1/3"
        data-aos="fade-right"
      ></NuxtImg>
      <h1
        class="text-4xl font-extrabold text-primary !font-raleway"
        data-aos="fade-left"
      >
        BOBINADO, REPARARACIÓN Y VENTA DE <span class="text-orange"> MOTORES ELECÉCTRICOS, BOMBAS Y DRIVES</span> 
        
      </h1>
      <!-- <p class="text-lg text-white">Bobinado, reparación y venta de motores eléctricos</p> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

const hero = ref(null);

const handleMouseMove = (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 20;
  const y = (event.clientY / window.innerHeight - 0.5) * 20;
  if (hero.value) {
    hero.value.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  }
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
  AOS.init();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
