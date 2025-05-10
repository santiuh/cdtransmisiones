<template>
  <button
    class="text-xl justify-center lg:justify-start lg:text-3xl flex flex-row items-center gap-3 bg-tertiary px-5 drop-shadow rounded-xl py-4 w-full lg:w-fit hover:scale-105 brig transition-all"
  >
    <p>{{ titulo }}</p>
    <svg
      v-if="!noflecha"
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
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="1.657"
      />
    </svg>
  </button>
</template>
<script setup>
const props = defineProps(["titulo", "noflecha"]);
</script>
