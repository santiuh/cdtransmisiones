<template>
  <div
    class="lg:h-[657px] bg-[#04254448] w-full px-3 lg:px-9 bg-cover rounded-2xl lg:rounded-3xl pt-8 py-4 lg:pb-16 lg:gap-9 gap-12 flex flex-col justify-end hover:shadow-xl shadow-2xl hover:cursor-pointer hover:scale-105 duration-300 transition-all"
    :style="{ backgroundImage: isHovered ? `url(${bg})` : '' }"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden transition-opacity duration-300"
      :class="{ 'opacity-0': isHovered }"
    >
      <NuxtImg
        :src="bg"
        alt="Background Image"
        class="w-full h-full object-cover transition-transform duration-300 rounded-3xl"
        :class="{ 'scale-0': isHovered }"
      />
    </div>
    <div class="flex flex-col text-white">
      <p
        class="font-medium text-2xl"
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        IMOBERDORF
      </p>
      <p
        class="font-bold text-4xl"
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        {{ title }}
      </p>
    </div>
    <button
      class="lg:text-3xl flex flex-row items-center gap-3 bg-tertiary px-5 rounded-xl py-4 w-fit hover:scale-105 brig transition-all"
    >
      <p>Vamos</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10.019"
        height="19.344"
        viewBox="0 0 10.019 19.344"
      >
        <path
          id="Trazado_179"
          data-name="Trazado 179"
          d="M392.5,2211.746l8.286,9.115-8.286,9.115"
          transform="translate(-391.889 -2211.189)"
          fill="none"
          stroke="#1c2646"
          stroke-miterlimit="10"
          stroke-width="1.657"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps(["title", "bg"]);
const isHovered = ref(false);
</script>
