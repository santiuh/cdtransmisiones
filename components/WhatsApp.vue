<template>
  <div class="fixed bottom-7 right-7 z-50">
    <a
      :href="whatsappLink"
      target="_blank"
      class="rounded-full overflow-hidden shadow-lg hover:bg-green-600 transition flex items-center justify-center"
    >
      <NuxtImg
        class="h-12 w-12 rounded-full z-40 animate-ping absolute"
        src="svg/wspgreen.svg"
      ></NuxtImg>

      <NuxtImg class="h-14 w-14 z-50" src="svg/wspgreen.svg"></NuxtImg>
    </a>
  </div>
</template>

<script setup>
const phoneNumber = "5493492573782";
const message = "Hola, me gustaría más información.";
const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  message
)}`;
</script>
