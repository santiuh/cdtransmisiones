<template>
  <div class="flex flex-col items-center">
    <div
      class="text-primary flex flex-row py-10 justify-between w-full max-w-[1440px]"
    >
      <NuxtImg
        @click="router.push('/')"
        class="h-24"
        src="svg/logocolor.svg"
      ></NuxtImg>
      <div class="flex flex-row">
        <div class="font-medium text-lg flex flex-row gap-3">
          <button @click="goTo('/Servicios')">MARCAS</button>
          <button @click="goTo('/PRODUCTOS')">PRODUCTOS</button>
          <button @click="goTo('/EMPRESA')">EMPRESA</button>
          <button @click="goTo('/CLIENTES')">ACCESO CLIENTES</button>
        </div>
        <div class="flex flex-row border-l border-primary">
          <NuxtImg src="/svg/ig2.svg"></NuxtImg>
          <NuxtImg src="/svg/fb2.svg"></NuxtImg>
          <NuxtImg src="/svg/li2.svg"></NuxtImg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const goTo = (ruta) => {
  if (ruta === "/Clientes") {
    window.open("https://catalogo.rodaservice.com.ar/", "_blank");
  } else router.push(ruta);
};
</script>
