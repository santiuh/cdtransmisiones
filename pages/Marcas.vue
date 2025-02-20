<template>
  <div class="flex flex-col lg:flex-row border lg:h-[660px] xl:h-[670px]">
    <!-- Lista de marcas -->
    <div
      class="flex flex-row lg:flex-col lg:gap-1 lg:w-1/5 overflow-scroll border bg-white"
    >
      <div
        class="bg-tertiary lg:pl-12 px-5 lg:px-0 text-nowrap text-xl py-5 hover:cursor-pointer hover:brightness-90 transition-all duration-300"
        :class="
          (i === 0 ? 'rounded-tl-3xl' : '',
          i === selectedMarcaId ? 'brightness-90' : '')
        "
        v-for="(dato, i) in data"
        :key="i"
        @click="selectedMarcaId = i"
      >
        {{ dato.marca }}
      </div>
    </div>

    <!-- Contenedor de contenido animado -->
    <div
      class="bg-tertiary flex lg:w-4/5 h-full py-6 lg:py-0 justify-center items-center"
    >
      <transition name="fade-slide" mode="out-in">
        <div
          v-if="data[selectedMarcaId]"
          :key="selectedMarcaId"
          class="flex relative h-full items-center justify-center bg-white"
        >
          <div
            class="flex pb-14 flex-col relative justify-center h-[70%] px-3 lg:px-0 lg:w-[90%] xl:w-[80%]"
          >
            <div
              class="h-[90%] absolute bottom-0 bg-white w-[95%] lg:w-full rounded-lg shadow-2xl"
            ></div>
            <div
              class="flex flex-col lg:flex-row border-b border-tertiary py-4 z-10 px-3 lg:px-10 gap-8"
            >
              <NuxtImg
                class="drop-shadow-2xl w-2/3 lg:w-1/3 self-center aspect-square border-[#D4D4D4] border p-3 rounded-2xl"
                style="
                  background: linear-gradient(
                    90deg,
                    rgba(228, 228, 228, 1) 0%,
                    rgba(246, 247, 249, 1) 7%,
                    rgba(239, 239, 239, 1) 86%
                  );
                "
                :src="'img/Marcas/' + data[selectedMarcaId].marca + '.png'"
              ></NuxtImg>
              <div class="flex flex-col gap-3 lg:w-2/3 self-center lg:pt-10">
                <div
                  v-if="data[selectedMarcaId].svg"
                  class="px-1 self-center lg:self-start overflow-hidden rounded-md border-tertiary border py-2 mb-3 lg:mb-0 shadow-inner"
                >
                  <NuxtImg
                    class="lg:!max-h-10 !h-10 lg:!h-auto !w-auto"
                    :src="'svg/Sec3_' + data[selectedMarcaId].svg"
                  ></NuxtImg>
                </div>

                <p class="">
                  {{ data[selectedMarcaId].texto }}
                </p>
              </div>
            </div>
            <div
              class="flex flex-col-reverse lg:flex-row gap-3 lg:gap-6 z-10 lg:py-7 px-3 lg:px-14"
            >
              <button
                @click="abrirPDF(boton.archivo)"
                v-for="boton in data[selectedMarcaId].botones"
                class="text-xl justify-center lg:justify-start lg:text-xl text-white flex flex-row items-center gap-3 bg-primary px-5 drop-shadow rounded-xl py-4 w-full lg:w-fit hover:scale-105 transition-all"
              >
                <p>{{ boton.nombre }}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30.616"
                  height="29.275"
                  viewBox="0 0 30.616 29.275"
                >
                  <g
                    id="Grupo_250"
                    data-name="Grupo 250"
                    transform="translate(-5064.633 -967.177)"
                  >
                    <g id="Grupo_249" data-name="Grupo 249">
                      <path
                        id="Trazado_148"
                        data-name="Trazado 148"
                        d="M5087.446,980.109l-7.5,6.823-7.5-6.823"
                        fill="none"
                        stroke="#fff"
                        stroke-miterlimit="10"
                        stroke-width="3"
                      />
                    </g>
                    <line
                      id="Línea_19"
                      data-name="Línea 19"
                      y2="19.755"
                      transform="translate(5079.941 967.177)"
                      fill="none"
                      stroke="#fff"
                      stroke-miterlimit="10"
                      stroke-width="3"
                    />
                    <path
                      id="Trazado_149"
                      data-name="Trazado 149"
                      d="M5066.133,991.281v3.671h27.616v-3.671"
                      fill="none"
                      stroke="#fff"
                      stroke-miterlimit="10"
                      stroke-width="3"
                    />
                  </g>
                </svg>
              </button>
              <VButton
                @click="abrirURL(boton.url)"
                v-for="boton in data[selectedMarcaId].botones2"
                :titulo="boton.nombre"
                class="!bg-white lg:text-xl !border-2 !text-primary !border-primary !justify-center"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones de entrada y salida */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

<script setup>
const selectedMarcaId = ref(0);

const abrirPDF = (nombreArchivo) => {
  const url = `/docs/${nombreArchivo}`; // Ruta del archivo en `public/`
  window.open(url, "_blank"); // Abre en una nueva ventana/pestaña
};
const abrirURL = (url) => {
  window.open(url, "_blank");
};
const descargarPDF = (nombreArchivo) => {
  const link = document.createElement("a");
  link.href = `/docs/${nombreArchivo}`; // Ruta dinámica
  link.download = nombreArchivo; // Nombre del archivo descargado
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const data = [
  {
    svg: "4.svg",
    marca: "DBH",
    texto:
      "DBH – Di Benedetto Hnos. S.A. es una industria pionera en la fabricación de piezas de caucho metal destinadas al mercado de reposición en el rubro autopartista como agroindustrial. Desde sus inicios se gano la confianza del consumidor, a partir de la producción de retenes, o’rings, crapodinas y soportes de cardan. Su planta se ubica en la ciudad de Rosario y tiene a Roda Service como distribuidor en la zona.",
    botones: [
      { nombre: "Catálogo Crapodinas", archivo: "dbh1.pdf" },
      { nombre: "Medidas Grales.", archivo: "dbh2.pdf" },
      { nombre: "Reformas de Cardan", archivo: "dbh3.pdf" },
    ],
  },
  {
    svg: "6.svg",
    marca: "ETMA",
    texto:
      "ETMA es una industria nacional, dedicada a la fabricación de crucetas, tricetas y movimientos universales. Con más de 50 años en el mercado, responde a las más altas exigencias del mercado. Roda Service es distribuidor exclusivo en la ciudad de Rosario y alrededores, llegando también hacia todo el país.",
    botones2: [
      {
        nombre: "Catálogo Interactivo",
        url: "https://es.etma.com.ar/catalogo/",
      },
    ],
    botones: [{ nombre: "Catálogo Crucetas", archivo: "etma1.pdf" }],
  },
  {
    svg: "13.svg",
    marca: "FERSA",
    texto:
      "FERSA Bearings es una compañía multinacional española con más de 50 años de experiencia en el diseño, desarrollo y distribución de soluciones completas de rodamientos para el sector de la automoción a nivel mundial. Roda Service importa directo de fábrica sus productos, centrándose en la línea de rodamientos pesados, los cuales cuentan con una calidad de primer nivel, a un precio muy competitivo. Iniciando desde Rosario hacia todo el país.",
    botones2: [
      {
        nombre: "Conozca FERSA",
        url: "https://www.fersa.com/es",
      },
    ],
    botones: [{ nombre: "Catálogo Rodamientos", archivo: "fersa1.pdf" }],
  },
  {
    svg: "10.svg",
    marca: "HCH",
    texto:
      "HCH es una industria china, pionera en la fabricación de rodamientos en su país. Fue fundada en 1973, y con el paso del tiempo fue optimizando procesos y fortaleciendo la calidad de sus productos. Basándose en esa confiabilidad, Roda Service distribuye sus productos de forma constante en toda la región de Rosario, Santa Fe y todo el país.",
    botones2: [
      {
        nombre: "Conozca HCH",
        url: "http://www.hchbearing.com/",
      },
    ],
  },
  {
    svg: "11.svg",
    marca: "IKO",
    texto:
      "IKO International Inc. Es una industria japonesa, dedicada al diseño y fabricación de rodamientos de agujas y guías lineales. Cuentan con todas las etapas de producción para cumplir con los más altos estándares de calidad, rendimiento y precisión. Desde hace años Roda Service importa sus productos, proveyendo de toda su variedad de rodamientos de agujas al mercado de reposición, tanto en la región de Rosario, como en todo el país.",
    botones2: [
      {
        nombre: "Conozca IKO",
        url: "https://ikont.com/",
      },
    ],
    botones: [{ nombre: "Catálogo Gral. Rodamientos", archivo: "iko1.pdf" }],
  },
  {
    svg: "30.svg",
    marca: "KOYO",
    texto:
      "KOYO SEIKO CO. LTD fue fundada en 1921 por el Sr. IKEDA. Durante las décadas siguientes a su fundación, la compañía se posicionó como uno de los líderes mundiales en la fabricación de rodamientos para el sector automotriz, agrícola e industrial. En sus inicios en el país, KOYO depositó su confianza en Jacinto Amatriain, y luego en su sucesor, para que Roda Service pueda representarlos en la ciudad de Rosario, y en toda la Argentina.",
    botones2: [
      {
        nombre: "Catálogo Web",
        url: "https://koyola.com.pa/catalogos/",
      },
    ],
  },
  {
    svg: "18.svg",
    marca: "KUGELL",
    texto:
      "KÜGELL S.A. es una industria argentina dedicada a la fabricación de autopartes, centrando sus esfuerzos en el desarrollo de tensores de correa, kits de distribución, ejes de bomba de agua y rodamientos especiales. Trabaja bajo las normas ISO 9001 asegurando así el óptimo funcionamiento de sus productos. Roda Service es distribuidor autorizado para la comercialización de sus artículos en Rosario y todo el país.",
    botones2: [
      {
        nombre: "Catálogo Interactivo",
        url: "https://kugellager.com.ar/catalogo/",
      },
    ],
    botones: [{ nombre: "Catálogo de Tensores", archivo: "kugell1.pdf" }],
  },
  {
    svg: "5.svg",
    marca: "LOCTITE",
    texto:
      "LOCTITE es la marca líder mundial en adhesivos, selladores y productos para el tratamiento de superficies. Con la más avanzada tecnología, brinda soluciones al proporcionar adhesivos más eficientes, para liberar así el potencial limitado del hombre y la maquina. Roda Service es distribuidor autorizado, y trabaja en conjunto para brindar el mejor servicio en Rosario y toda la Argentina.",
    botones2: [
      {
        nombre: "Capacitación Online",
        url: "https://www.henkel-adhesives.com/ar/es/servicios/servicios/loctite-xplore.html",
      },
    ],
    botones: [
      { nombre: "Catálogo General", archivo: "loctite1.pdf" },
      { nombre: "Catálogo Automotriz", archivo: "loctite2.pdf" },
    ],
  },
  {
    svg: "12.svg",
    marca: "MBS",
    texto:
      "MBS Bearings es una fábrica de rodamientos de origen japonés. Sus productos son una gran alternativa si se busca excelente calidad a un precio accesible. Cuentan con una gran trayectoria en el rubro y, junto con Roda Service, llega a cada punto de Argentina, centrándose en la ciudad de Rosario.",
    botones: [{ nombre: "Catálogo General", archivo: "mbs1.pdf" }],
  },
  {
    svg: "14.svg",
    marca: "NACHI",
    texto:
      "NACHI Bearings es un innovador fabricante mundial de productos como: rodamientos, herramientas de corte de precisión, equipos hidráulicos, máquinas herramienta, robots y acero de alta velocidad. Los mismos son producidos con los más altos estándares posibles y un compromiso acorde a los mismos. Roda Service es importador y distribuidor de todos los rodamientos de la marca, en Rosario y toda la región.",
    botones: [
      { nombre: "Catálogo General", archivo: "nachi1.pdf" },
      { nombre: "Rodamientos de Precisión", archivo: "nachi2.pdf" },
      { nombre: "Rodamientos  Motos", archivo: "nachi3.pdf" },
    ],
  },
  {
    svg: "2.svg",
    marca: "NSK",
    texto:
      "NSK es un fabricante mundial de rodamientos de bolas y rodillos. Sus productos pueden encontrarse en cualquier lugar donde haya elementos en movimiento. Desde rodamientos de alta precisión montados en turbinas eólicas hasta componentes automotrices ensamblados en los vehículos de los fabricantes más reconocidos. Desde años, NSK Argentina confía en Roda Service para distribuir sus productos en el país, centrándose en Rosario y toda la región.",
    botones: [
      { nombre: "Catálogo Automotriz", archivo: "nsk1.pdf" },
      { nombre: "Guía de reemplazo", archivo: "nsk2.pdf" },
    ],
  },
  {
    svg: "1.svg",
    marca: "NTN",
    texto:
      "NTN en una de las tres marcas lideres a nivel mundial en la fabricación de rodamientos para el automotor, el agro y la industria. Cuenta con más de 68 plantas en todo el mundo y casi 100 años de experiencia brindando primera calidad que respaldan su nombre. Roda Service importa directo de fábrica toda su línea de productos, ofreciendo así un amplio stock, desde la ciudad de Rosario hacia todo el país.",
    botones: [{ nombre: "Catálogo Rodamientos", archivo: "ntn1.pdf" }],
    botones2: [
      {
        nombre: "Folletos Digitales",
        url: "https://ntnamericas.com/technical-resources/catalogs-and-literature/",
      },
    ],
  },
  {
    svg: "19.svg",
    marca: "PESARO",
    texto:
      "PESARO es una empresa italiana dedicada a la fabricación de rodamientos de jaulas de agujas. Cuenta con la mayor variedad de artículos a nivel mundial y una calidad de primer nivel. Junto con Roda Service, trabaja la línea de camiones, ómnibus, tractores, pick-ups, maquinas agrícolas y equipamientos industriales. Llegando así con sus productos a Rosario, sus alrededores y todo el país.",
    botones2: [
      {
        nombre: "Conozca Pesaro",
        url: "https://pesaro.com.ar/catalogo/",
      },
    ],
    botones: [{ nombre: "Catálogo General", archivo: "pesaro1.pdf" }],
  },
  {
    svg: "31.svg",
    marca: "ROLLWAY",
    texto:
      "ROLLWAY Bearings es pionero en el sector de los rodamientos de bolas y rodillos. Fundada en 1908, ha construido una sólida reputación a lo largo de los años. A partir de allí, comenzaron a añadir calidad y eficiencia a sus productos. En Roda Service puede encontrar un distribuidor ubicado en la ciudad de Rosario, que ha sabido comercializar su amplia gama de productos, desde miniaturas hasta grandes rodamientos industriales.",
    botones: [{ nombre: "Catálogo General", archivo: "rollway1.pdf" }],
  },
  {
    svg: "26.svg",
    marca: "VAR-NTN",
    texto:
      "Con más de 50 años en el mercado VAR-NTN se dedica a la fabricación y distribución de tensores y kits de rueda. Las poleas son armadas con rodamientos NTN, lo cual garantiza la máxima calidad y eficiencia, tan necesaria en el motor del vehículo. Su objetivo es brindar un producto de calidad, a un precio accesible para el consumidor, en conjunto con un servicio de primer nivel y garantía asegurada.",
    botones2: [
      {
        nombre: "Conozca VAR-NTN",
        url: "https://www.poleasvarntn.com/",
      },
    ],
    botones: [
      { nombre: "Catálogo Poleas", archivo: "var1.pdf" },
      { nombre: "Catálogo Kit de Ruedas", archivo: "var2.pdf" },
    ],
  },
];
</script>
