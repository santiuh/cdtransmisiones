<template>
  <button
    @click="openWindow()"
    class="py-4 bg-[#04254448] shadow-2xl bg-center bg-cover flex flex-col lg:flex-row transition-all text-white rounded-3xl px-2 lg:px-20 lg:p-9 justify-between w-5/6 lg:w-fit gap-3 lg:gap-36 self-center absolute bottom-[-75px] select-none hover:scale-105 bg-blend-multiply hover:bg-secondary duration-500"
  >
    <div class="flex flex-col lg:gap-3 text-center lg:text-start">
      <p class="font-extrabold text-xl lg:text-4xl">
        ¿Tenés alguna duda o consulta?
      </p>
      <p
        class="lg:text-2xl text-xl  lg:text-white font-semibold lg:font-medium"
      >
        Escribinos por WhatsApp
      </p>
    </div>
    <div
      class="flex flex-row self-center bg-primary pl-5 w-fit pr-8 py-3 rounded-2xl align-middle items-center gap-3 hover:scale-105 hover:!bg-[#222664] transition-all duration-150"
    >
      <NuxtImg class="h-14 w-14" src="svg/wspgreen.svg"></NuxtImg>
      <span class="text-xl lg:text-3xl text-nowrap">Hace click acá</span>
    </div>
  </button>
</template>
<script setup lang="ts">
const openWindow = () => {
  window.open("https://api.whatsapp.com/send?phone=5493492573782", "_blank");
};
</script>
