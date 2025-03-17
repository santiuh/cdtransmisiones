<template>
  <div
    class="flex place-content-center relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 gap-20 py-20">
      <h1
        class="text-6xl font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Conocé más sobre nosotros<span class="text-orangelight">.</span>
      </h1>

      <div
        class="p-8 bg-[#071f3675] text-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-4/5 self-start transform transition-transform hover:scale-105"
        data-aos="fade-right"
      >
        <nuxt-img
          src="/img/Empresa/empresa1.jpg"
          alt="Placeholder Image"
          class="w-ful rounded-3xl drop-shadow-xl md:w-2/5 h-auto object-cover shadow-lg"
        />
        <div class="p-8 md:w-3/5 text-xl">
          <h2 class="text-2xl font-bold mb-4">
            TRAYECTORIA Y <span class="text-orangelight">EXPERIENCIA</span>
          </h2>
          <p class="font-semibold">
            Imoberdorf Hnos. S.A. es una reconocida empresa de Rafaela con más
            de 55 años de trayectoria en el rubro de motores eléctricos. Desde
            sus inicios, se ha especializado en la compra, venta y distribución
            de motores eléctricos, electrobombas, equipamiento eléctrico y
            electrónico, accesorios y repuestos de diversas marcas. Su vasta
            experiencia le permite ofrecer asesoramiento técnico especializado a
            la industria, garantizando soluciones eficientes y adaptadas a las
            necesidades de cada cliente.
          </p>
        </div>
      </div>
      <div
        class="p-8 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row-reverse w-4/5 self-end transform transition-transform hover:scale-105"
        data-aos="fade-left"
        data-aos-delay="100"
      >
        <nuxt-img
          src="/img/Empresa/empresa2.jpg"
          alt="Placeholder Image"
          class="w-full md:w-2/5 drop-shadow-xl h-auto object-cover rounded-3xl shadow-lg"
        />
        <div class="p-8 text-xl md:w-3/5">
          <h2 class="text-2xl font-bold mb-4">
            SERVICIOS ESPECIALIZADOS <br />PARA LA
            <span class="text-orangelight">INDUSTRIA</span>
          </h2>
          <p class="font-semibold">
            Además de su labor comercial, la empresa brinda un servicio integral
            que incluye el bobinado y reparación de motores eléctricos
            industriales, así como la reparación de drives o variadores de
            velocidad. Su equipo de 11 empleados altamente capacitados trabaja
            para ofrecer soluciones confiables y de calidad, atendiendo tanto a
            clientes de Rafaela como de toda la región. Con una fuerte
            orientación al servicio, Imoberdorf Hnos. S.A. se ha convertido en
            un referente en el sector.
          </p>
        </div>
      </div>
      <div
        class="p-8 bg-secondary text-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-4/5 self-start transform transition-transform hover:scale-105"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <nuxt-img
          src="/img/Empresa/empresa3.jpg"
          alt="Placeholder Image"
          class="w-full rounded-3xl drop-shadow-xl md:w-2/5 h-auto object-cover shadow-lg"
        />
        <div class="p-8 md:w-3/5">
          <h2 class="text-2xl font-bold mb-4">
            DIRECCIÓN Y ESTRUCTURA
            <span class="text-orangelight">EMPRESARIAL</span>
          </h2>
          <p class="font-semibold">
            Actualmente, la empresa tiene su sede en calle Maipú 450, Rafaela,
            Santa Fe, y está dirigida por la C.P.N. Patricia Imoberdorf, hija
            del fundador, Héctor Luis Imoberdorf. La vicepresidencia está a
            cargo del Tec. Electromecánico Marcelo Imoberdorf, hijo de Jorge
            Omar Imoberdorf. Además, la estructura empresarial cuenta con la
            participación de Carina y Laura Imoberdorf, sobrina e hija del
            fundador, respectivamente, quienes forman parte de la sociedad como
            directoras suplentes.
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
