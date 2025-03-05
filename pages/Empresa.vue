<template>
  <div class="flex place-content-center">
    <!-- <div
      class="flex flex-col max-w-[1440px] justify-center px-3 lg:px-0 lg:w-4/6 pt-16 pb-48 overflow-hidden"
      style="
        background: rgb(51, 51, 51);
        background: linear-gradient(
          90deg,
          rgba(51, 51, 51, 0) 30%,
          rgba(0, 0, 0, 0.1292892156862745) 50%,
          rgba(0, 0, 0, 0) 70%
        );
      "
    >
      <EmpresaTimeline
        v-for="(dato, i) in data"
        :id="i"
        :datos="dato"
      ></EmpresaTimeline>
    </div> -->
  </div>
</template>
<script setup>
const data = [
  {
    year: "1960",
    info: "Jacinto Amatriain realiza la primer importación de rodamientos desde Inglaterra.",
  },
  {
    year: "1974",
    info: "Se adquiere la distribución oficial de la marca NTN-SNR y AYS FERSA",
  },
  {
    year: "1983",
    info: 'Se compra una vieja casona en San Martín 2437 de Rosario. La empresa comienza a girar bajo el nombre de "Jacinto Amatriain e Hijos ", a cargo de Andrés Amatriain.',
  },
  {
    year: "2004",
    info: "La empresa comienza a girar bajo el nombre 'Roda Service' de Andrés Amatriain. También se adquiere la distribución oficial de las marcas NSK, ARB y HCH",
  },
  {
    year: "2009",
    info: "Se adquiere la distribución oficial de las marcas IKO, MBS Y ROLLWAY",
  },
  {
    year: "2014",
    info: "Se adquiere la distribucion oficial de las marcas CMB, RLM y KG",
  },
  {
    year: "2019",
    info: "Se adquiere la distribucion oficial de la marca KOYO",
  },
  {
    year: "2020",
    info: "Se realiza la demolición de la casona y comienza la construcción del nuevo local",
  },
  { year: "2024", info: "Se constituye RODA SERVICE SRL" },
  { year: "2025", info: "Se inaugura el nuevo local comercial" },
];
</script>
