<template>
  <!-- En la ficha de producto y el carrito (mobile) hay una barra fija abajo con
       la acción principal (que ya incluye WhatsApp): ahí el botón flotante se
       esconde para no taparla. -->
  <div class="fixed bottom-7 right-7 z-50" :class="ocultarEnMobile ? 'hidden lg:block' : ''">
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
const route = useRoute();
const ocultarEnMobile = computed(() => /^\/Productos\/./i.test(route.path));

const phoneNumber = "5493492573782";
const message = "Hola, me gustaría más información.";
const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  message
)}`;
</script>
