<template>
  <div
    class="flex w-full relative pt-10"
    :class="par ? 'place-content-end' : 'place-content-start'"
  >
    <div
      data-aos="slide-up"
      class="flex w-1/2 flex-col text-primary gap-6 z-20"
      :class="par ? 'self-start' : 'self-end text-end'"
    >
      <div
        class="border-b-primary relative border-b font-extrabold text-3xl px-5 lg:px-11 pb-3 shadow-xl"
      >
        {{ datos.year }}
        <span
          :class="par ? '-bottom-4 -left-4' : '-right-4 -bottom-4'"
          class="absolute rounded-full z-10 h-8 w-8 bg-sky-500"
        ></span>
        <span
          v-if="id === 0"
          class="absolute rounded-full z-10 h-8 w-8 bg-sky-500 -bottom-4 -left-4 animate-ping"
        ></span>
      </div>
      <div
        class="text-lg lg:text-2xl lg:px-11 px-5 z-0"
        :data-aos="par ? 'slide-left' : 'slide-right'"
      >
        {{ datos.info }}
      </div>
    </div>
    <div
      class="absolute h-full border-4 lg:border-8 bg-primary border-primary flex shadow-2xl"
      :class="id === 0 ? 'rounded-t-full' : ''"
      style="left: 50%; transform: translateX(-50%)"
    ></div>
  </div>
</template>
<script setup>
const props = defineProps(["id", "datos"]);
const par = computed(() => {
  return props?.id % 2 === 0;
});
</script>
