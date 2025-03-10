<template>
  <div
    v-if="!isHome"
    :style="{
      backgroundImage: `url('/img/${banner}.png')`,
    }"
    class="flex lg:hidden justify-center bg-cover bg-center bg-no-repeat"
  >
    <div
      class="text-4xl flex flex-col text-white text-center pt-24 pb-8"
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
    <h1
      v-else
      class="font-extrabold text-3xl lg:text-4xl pt-24 pb-10 flex text-white"
    >
      {{ banner === "AUTOMOTOR" ? "Automotríz" : banner }}
    </h1>
  </div>
</template>
<script setup>
const route = useRoute();

const isHome = computed(() => {
  return route.path === "/";
});

const banner = computed(() => {
  const path = route.path.split("/").filter(Boolean).pop();
  return path ? path.toUpperCase() : "default";
});
</script>
