<template>
  <div class="flex place-content-center">
    <div
      class="flex flex-col pt-20 pb-44 relative w-full px-4 lg:px-10 max-w-[1440px]"
    >
      <h1 class="font-extrabold text-5xl text-center text-white text-shadow-lg">
        EXPERTOS EN SOLUCIONES
      </h1>
      <hr
        class="w-32 rounded-full border-orange self-center border-2 my-14"
      />
      <div class="flex flex-col lg:flex-row justify-center gap-10">
        <Sec2Card
          @click="router.push('/Productos')"
          bg="img/Sec2Card1.jpg"
          title="Productos"
        ></Sec2Card>
        <Sec2Card
          @click="router.push('/Servicios')"
          bg="img/Sec2Card2.jpg"
          title="Servicios"
        ></Sec2Card>
        <Sec2Card
          @click="router.push('/Empresa')"
          bg="img/Sec2Card3.jpg"
          title="Sobre Nosotros"
        ></Sec2Card>
      </div>
      <HomeRodaPill></HomeRodaPill>
    </div>
  </div>
</template>
<script setup lang="ts">
import Sec2Card from "./Sec2Card.vue";
const router = useRouter();
</script>
