<template>
  <div class="flex relative w-full justify-center">
    <div class="h-full w-0 lg:w-2/5"></div>
    <div
      :style="computedClipPath"
      class="bg-[url('/img/Hero/Hero2.png')] flex h-full w-full lg:w-3/5 bg-[center_right_60%] lg:bg-center bg-cover bg-no-repeat"
    ></div>

    <div
      class="max-w-[1440px] absolute px-9 w-full pt-24 justify-center h-full flex flex-col text-primary text-start gap-10"
    >
      <div class="flex flex-col text-3xl lg:text-4xl !font-raleway font-black">
        <p>CONTAMOS CON MARCAS</p>
        <p class="text-orange">LÍDERES EN EL MERCADO</p>
      </div>

      <VButton
        titulo="Ver Productos"
        class="!text-xl !bg-white w-3/4"
        @click="router.push('/Productos')"
      ></VButton>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
const router = useRouter();

const innerWidth = ref(0); // Create a ref to store the window width

// Update the innerWidth value on the client side
onMounted(() => {
  innerWidth.value = window.innerWidth;

  // Optional: Add a resize event listener to update the value dynamically
  const handleResize = () => {
    innerWidth.value = window.innerWidth;
  };
  window.addEventListener("resize", handleResize);

  // Cleanup the event listener when the component is unmounted
  return () => {
    window.removeEventListener("resize", handleResize);
  };
});

const computedClipPath = computed(() => {
  return innerWidth.value >= 1024
    ? "clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)"
    : "clip-path: polygon(100% 0, 33% 0, 100% 43%);";
});
</script>
