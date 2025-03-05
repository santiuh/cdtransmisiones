<template>
    <div ref="hero" class="hero h-screen">
      <div class="z-10 flex flex-col max-w-[1440px] w-full px-32">
        <NuxtImg src="img/logo.png" class="!h-auto w-1/3 "></NuxtImg>
        <!-- <p class="text-lg text-white">Bobinado, reparación y venta de motores eléctricos</p> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  
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
  });
  
  onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove);
  });
  </script>
  
  <style scoped>
  .hero {
    @apply relative flex items-center bg-cover bg-center overflow-hidden;
    background-image: url("/img/fondohome.png");
  }

  </style>
  