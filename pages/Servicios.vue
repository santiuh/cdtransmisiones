<template>
  <div class="flex place-content-center relative overflow-hidden">
    <div class="flex flex-col gap-20 relative z-10 max-w-[1440px] w-full py-40">
      <h1
        class="text-6xl font-bold text-center mb-20 text-shadow-lg shadow-text"
        data-aos="fade-up"
      >
        Conocé nuestros servicios
      </h1>
      <div
        class="p-8 bg-[#071f3675] text-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-3/4 self-start transform transition-transform hover:scale-105"
        data-aos="fade-right"
      >
        <nuxt-img
          src="/img/Servicio1.jpg"
          alt="Placeholder Image"
          class="w-ful rounded-3xl drop-shadow-xl md:w-2/5 h-auto object-cover shadow-lg"
        />
        <div class="p-8 md:w-3/5 text-xl">
          <h2 class="text-2xl font-bold mb-4">Taller de Reparación</h2>
          <p class="font-semibold">
            En <strong>Imoberdorf Hnos. S.A.</strong> ofrecemos un
            <strong>servicio de reparación especializado</strong> en una amplia
            gama de equipos industriales.
          </p>
          <p>
            Reparamos y damos mantenimiento a
            <strong>motores eléctricos</strong>, <strong>electrobombas</strong>,
            <strong>drivers</strong>,
            <strong>convertidores de frecuencia</strong>,
            <strong>arrancadores suaves</strong> y <strong>PLC</strong>.
            Contamos con la <strong>infraestructura adecuada</strong> y el
            <strong>personal capacitado</strong> para garantizar un servicio
            eficiente y de alta calidad.
          </p>
        </div>
      </div>
      <div
        class="p-8 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row-reverse w-3/4 self-end transform transition-transform hover:scale-105"
        data-aos="fade-left"
        data-aos-delay="100"
      >
        <nuxt-img
          src="/img/Servicio2.jpg"
          alt="Placeholder Image"
          class="w-full md:w-2/5 drop-shadow-xl h-auto object-cover rounded-3xl shadow-lg"
        />
        <div class="p-8 md:w-3/5 text-xl">
          <h2 class="text-2xl font-bold mb-4">
            Asesoramiento y Asistencia Técnica
          </h2>
          <p class="font-semibold">
            Brindamos <strong>soluciones técnicas avanzadas</strong> para la
            industria, con un enfoque en la
            <strong>eficiencia energética</strong> y la optimización de
            procesos.
          </p>
          <p>
            Nuestro equipo está capacitado para la
            <strong>reparación de motores eléctricos</strong>, el
            <strong>diseño y puesta en marcha de equipos industriales</strong>,
            la <strong>asistencia en paradas de planta y emergencias</strong> y
            la
            <strong>implementación de mejoras en protecciones eléctricas</strong
            >. También ofrecemos
            <strong>servicios especializados para tambos</strong>.
          </p>
        </div>
      </div>
      <div
        class="p-8 bg-secondary text-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-3/4 self-start transform transition-transform hover:scale-105"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <nuxt-img
          src="/img/Servicio3.jpg"
          alt="Placeholder Image"
          class="w-full rounded-3xl drop-shadow-xl md:w-2/5 h-auto object-cover shadow-lg"
        />
        <div class="p-8 text-xl md:w-3/5">
          <h2 class="text-2xl font-bold mb-4">Autorización y Capacitación</h2>
          <p class="font-semibold">
            Somos <strong>asistentes técnicos autorizados</strong> de
            <strong>WEG</strong>, lo que respalda nuestra experiencia y
            compromiso con la calidad.
          </p>
          <p>
            Nuestro equipo está compuesto por
            <strong>profesionales altamente capacitados</strong>, enfocados en
            brindar soluciones efectivas y garantizar la satisfacción de
            nuestros clientes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
<style>
.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
