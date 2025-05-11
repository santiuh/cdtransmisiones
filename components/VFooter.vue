<template>
  <div class="flex bg-primary place-content-center pt-24 pb-32 z-40 relative">
    <div
      class="flex-col lg:flex-row gap-6 lg:gap-0 items-center lg:items-start text-center lg:text-start flex text-white lg:justify-around w-full max-w-[1440px]"
    >
      <NuxtImg
        class="!h-20 self-center"
        src="/img/logononameblanco.png"
      ></NuxtImg>
      <div class="flex flex-col gap-3 lg:gap-6">
        <div class="font-bold text-2xl">Contactanos</div>
        <div class="flex flex-row lg:text-lg gap-6 items-center self-center lg:self-start">
          <svgo-footergps class="!h-5 !w-auto text-orange"></svgo-footergps>
          <div class="flex flex-col">
            <span>Maipu 450 - Rafaela</span>
            <span>Prov. de Santa Fé - Argentina </span>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row lg:text-lg gap-3 items-center">
          <button
            @click="openWindow()"
            class="flex flex-row gap-3 items-center hover:text-orange transition-all duration-300"
          >
            <NuxtImg class="h-5" src="svg/footerwsp.svg"></NuxtImg>
            <span>+54 9 3492 57-3782</span>
          </button>
          <button
            class="flex flex-row gap-3 items-center hover:text-orange transition-all duration-300"
          >
            <NuxtImg class="h-5" src="svg/footerphone.svg"></NuxtImg>
            <span>+54 3492 42-1086</span>
          </button>
        </div>
        <a
          href="mailto:administración@imoberdorfhnos.com.ar"
          class="flex flex-row lg:text-lg gap-3 items-center hover:text-orange transition-all duration-300"
        >
          <NuxtImg class="h-5" src="svg/footermail.svg"></NuxtImg>
          <span>administración@imoberdorfhnos.com.ar</span>
        </a>
      </div>
      <div class="flex flex-col gap-3 lg:gap-6 items-center lg:items-start">
        <div class="font-bold text-2xl flex">Redes Sociales</div>
        <div class="flex flex-row gap-3 !text-orange">
          <NuxtLink
            to="https://www.instagram.com/imoberdorfhnos//"
            target="_blank"
            ><svgo-ig
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-ig
          ></NuxtLink>
          <NuxtLink
            to="https://www.linkedin.com/in/imoberdorf-hnos-s-a-628470257/"
            target="_blank"
            ><svgo-fb
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-fb
          ></NuxtLink>
          <NuxtLink to="https://www.facebook.com/imoberdorfhnos" target="_blank"
            ><svgo-li
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-li
          ></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const openWindow = () => {
  window.open("https://api.whatsapp.com/send?phone=5493492573782", "_blank");
};
</script>
