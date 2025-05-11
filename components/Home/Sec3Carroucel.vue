<template>
  <div ref="glideRef" class="glide bg-">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides !py-12 lg:!py-28">
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca1.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca3.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca4.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca5.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca6.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca7.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca8.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca9.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca10.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca11.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
        <li class="glide__slide">
          <NuxtImg
            src="/img/Marcas/marca12.png"
            class="carousel-image"
          ></NuxtImg>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
const glideRef = ref(null);

onMounted(() => {
  const glideInstance = new Glide(glideRef.value, {
    type: "carousel",
    perView: 6,
    autoplay: 1, // Disminuye el intervalo para hacer el movimiento más rápido
    hoverpause: false, // Evita que se detenga al pasar el ratón
    animationDuration: 6000, // Aumenta la duración de la animación para hacerlo más suave
    animationTimingFunc: "linear", // Asegura que el movimiento sea constante y fluido
    breakpoints: {
      1024: {
        perView: 1,
        autoplay: 1000,
      },
      1280: {
        perView: 3,
        autoplay: 1000,
      },
      1536: {
        perView: 4,
        autoplay: 1000,
      },
    },
    gap: 25,
    focusAt: "center", // Mantiene las imágenes centradas en la vista
    rewind: false, // Esto es importante para que no se "rebobine" al final
    rtl: false, // Define si el movimiento es de izquierda a derecha
  });
  glideInstance.mount();
});
</script>

<style scoped>
li {
  width: 150px; /* Set a fixed width */
  height: 150px; /* Set a fixed height */
  background-color: #bddfffa4; /* Light blue background */
  padding: 25px; /* Padding */
  border-radius: 10px; /* Rounded borders */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
