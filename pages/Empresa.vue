<template>
  <div
    class="flex overflow-hidden justify-center bg-gradient-to-br from-primary to-tertiary"
  >
    <div
      class="flex flex-col w-full max-w-[1440px] overflow-hidden px-4 lg:px-10 gap-10 lg:gap-20 lg:py-20 py-24"
    >
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        SOBRE NOSOTROS
      </h1>
      <p
        class="text-white text-lg text-shadow-lg lg:w-4/5 self-center text-justify"
        data-aos="fade-up"
      >
        Somos una pequeña empresa familiar rafaelina, que hace más de 56 años
        brinda soluciones eléctricas y electromecánicas a la industria local y
        regional. Imoberdorf Hnos. S.A. tiene una amplia trayectoria en el
        bobinado, reparación y venta de motores eléctricos, bombas y drives.
        Además, brinda asistencia técnica especializada, asesoramiento en
        mantenimiento predictivo y preventivo de motores eléctricos, cambios
        constructivos, servicio de bobinado y reparación integral de motores
        eléctricos industriales, y servicio de reparación de drives (variadores
        de velocidad y arrancadores suaves).
      </p>
      <main>
        <section>
          <EmpresaTimeline
            v-for="(dato, i) in data"
            :key="i"
            :id="i"
            :datos="dato"
          ></EmpresaTimeline>
        </section>
      </main>
      <div
        class="text-primary text-lg font-bold lg:w-4/5 self-center text-center mt-10"
        data-aos="fade-up"
      >
        <h2 class="text-2xl">Compromiso con la calidad y la innovación</h2>
        A lo largo de su historia, Imoberdorf Hnos. S.A. ha mantenido un firme
        compromiso con la calidad, la innovación y el servicio al cliente. Su
        equipo técnico altamente capacitado y su enfoque en soluciones
        personalizadas han permitido a la empresa consolidarse como un referente
        en el mercado regional y nacional.
      </div>
    </div>
  </div>
</template>
<script setup>
useSeoMeta({
  title: "Sobre Nosotros | Imoberdorf Hnos.",
  description:
    "Conocé la historia, valores y trayectoria de Imoberdorf Hnos. Más de 56 años brindando soluciones eléctricas y electromecánicas en Rafaela y la región.",
  keywords:
    "empresa, historia, valores, trayectoria, Imoberdorf Hnos., Rafaela, soluciones eléctricas, electromecánicas",
});

const data = [
  {
    year: "1968",
    info: "La empresa fue fundada en 1968 por Héctor Luis Imoberdorf, quien, tras completar sus estudios en la Escuela Nacional de Educación Técnica N°1 Guillermo Lehmann de Rafaela, comenzó a trabajar en un taller mecánico especializado en electricidad del automóvil. Esta experiencia le permitió adquirir los conocimientos necesarios para iniciar su propio emprendimiento.",
    banner: "Empresa1.jpg",
  },

  {
    year: "1979",
    info: "  Héctor incorporó a su hermano Jorge Omar Imoberdorf.",
    banner: "Empresa2.jpg",
  },
  {
    year: "2010",
    info: "Constitución de la sociedad anónima Imoberdorf Hnos. S.A. e incorporación de la nueva generación al directorio.",
    banner: "Empresa3.jpg",
  },
  {
    year: "2018",
    info: "Ampliación y remodelación del taller para optimizar los procesos productivos.",
    banner: "Empresa4.jpg",
  },
  {
    year: "2019",
    info: "Designación de Patricia Imoberdorf como presidenta y de Marcelo Imoberdorf como director titular de la sociedad. En septiembre de ese año, se firma el acuerdo de servicio técnico con WEG, consolidando la relación con esta reconocida marca.",
    banner: "Empresa5.jpg",
  },
  {
    year: "2024",
    info: "Incorporación de un nuevo modelo de negocio enfocado en energías renovables y paneles solares, ampliando la oferta de soluciones sostenibles.",
    banner: "Empresa6.jpg",
  },
  {
    year: "2025",
    info: "Remodelación edilicia del frente comercial y acceso al servicio técnico, mejorando la experiencia del cliente. Además, se implementa un sistema de gestión empresarial integral que optimiza las funciones de ventas, CRM, proyectos, manufactura, finanzas y recursos humanos.",
    banner: "Empresa7.jpg",
  },
];
</script>

<!-- <template>
  <div
    class="flex place-content-center relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 gap-20 py-20">
      <h1
        class="text-6xl font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Conocé más sobre nosotros
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
            TRAYECTORIA Y <span class="text-orange">EXPERIENCIA</span>
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
            <span class="text-orange">INDUSTRIA</span>
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
            <span class="text-orange">EMPRESARIAL</span>
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
</style> -->
