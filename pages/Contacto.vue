<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br to-tertiary from-primary"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 py-20 gap-20">
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Contactanos
      </h1>
      <div class="flex flex-row-reverse">
        <Formulario
          class="w-1/2"
          data-aos="fade-up"
          data-aos-delay="100"
        ></Formulario>

        <div
          class="flex flex-col gap-10 text-white text-shadow-lg lg:gap-0 justify-around text-2xl w-1/2 items-center"
        >
          <div class="flex" data-aos="fade-up" data-aos-delay="200">
            <div
              class="flex flex-row transition-all gap-5 duration-300 hover:scale-105 hover:drop-shadow-xl"
            >
              <svgo-contacto1 class="!h-24 !w-auto"></svgo-contacto1>

              <div class="flex-col flex items-start">
                <span class="font-bold text-3xl">Taller </span>
                <button class="hover:text-orange transition-all">
                  taller@imoberdorfhnos.com.ar
                </button>
                <button
                  class="hover:text-orange transition-all justify-start"
                  @click="openWhatsApp('+543492411984')"
                >
                  +54 3492 41-1984
                </button>
              </div>
            </div>
          </div>

          <div data-aos-delay="400" data-aos="fade-up" class="flex">
            <div
              class="flex flex-row transition-all gap-5 duration-300 hover:scale-105 hover:drop-shadow-xl"
              @click="openMail('venta@imoberdorfhnos.com.ar')"
            >
              <svgo-contacto2 class="!h-24 !w-auto"></svgo-contacto2>
              <div class="flex-col flex items-start">
                <span class="font-bold text-3xl">Venta </span>
                <button class="hover:text-orange transition-all">
                  venta@imoberdorfhnos.com.ar
                </button>
                <button
                  class="hover:text-orange transition-all"
                  @click="openWhatsApp('+543492573782')"
                >
                  +54 3492 57-3782
                </button>
              </div>
            </div>
          </div>
          <div class="flex" data-aos="fade-up" data-aos-delay="600">
            <div
              class="flex flex-row transition-all gap-5 duration-300 hover:scale-105 hover:drop-shadow-xl"
              @click="openMail('pagos@imoberdorfhnos.com.ar')"
            >
              <svgo-contacto3 class="!h-24 !w-auto"></svgo-contacto3>
              <div class="flex-col flex items-start">
                <span class="font-bold text-3xl">Pagos </span>
                <button class="hover:text-orange transition-all">
                  pagos@imoberdorfhnos.com.ar
                </button>
                <button
                  class="hover:text-orange transition-all"
                  @click="openWhatsApp('+543492205805')"
                >
                  +54 3492 20-5805
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const openWhatsApp = (phone) => {
  const url = `https://wa.me/${phone}`;
  window.open(url, "_blank");
};
</script>
