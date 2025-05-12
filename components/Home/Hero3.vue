<template>
  <div class="flex relative w-full justify-center">
    <div
      :style="computedClipPath"
      class="bg-[url('/img/Hero/Hero3.png')] flex h-full w-full lg:w-3/5 bg-[center_right_60%] lg:bg-center bg-cover bg-no-repeat"
    ></div>
    <div class="h-full w-0 lg:w-2/5"></div>

    <div
      class="max-w-[1440px] place-items-end absolute px-9 w-full pt-24 justify-center h-full flex flex-col text-primary text-start gap-10"
    >
      <div class="flex flex-col text-3xl lg:text-4xl !font-raleway font-black">
        <p>TE OFRECEMOS EXPERIENCIA</p>
        <p class="text-orange">Y CONOCIMIENTO TÉCNICO</p>
      </div>

      <VButton
        titulo="Conocenos"
        class="!text-xl !bg-white w-3/4"
        @click="router.push('/Empresa')"
      ></VButton>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
const router = useRouter();

const innerWidth = ref(0); // Crear un ref para almacenar el ancho de la ventana

// Actualizar el valor de innerWidth solo en el cliente
onMounted(() => {
  innerWidth.value = window.innerWidth;

  // Opcional: Agregar un listener para actualizar dinámicamente el valor
  const handleResize = () => {
    innerWidth.value = window.innerWidth;
  };
  window.addEventListener("resize", handleResize);

  // Limpiar el listener cuando el componente se desmonte
  return () => {
    window.removeEventListener("resize", handleResize);
  };
});

const computedClipPath = computed(() => {
  return innerWidth.value >= 1024
    ? "clip-path: polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)"
    : "clip-path: polygon(100% 0, 0 0, 0 26%);";
});
</script>
