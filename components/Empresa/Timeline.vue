<template>
  <div
    class="flex w-full relative pt-10"
    :class="par ? 'place-content-end' : 'place-content-start'"
  >
    <div
      data-aos="slide-up"
      class="flex w-1/2 flex-col text-white text-shadow-lg z-20"
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
        <div class="relative">
          <div
            v-if="datos.banner"
            :style="{
              backgroundImage: `url(/img/EmpresaPage/${datos.banner})`,
            }"
            class="w-full h-14 lg:h-20 bg-cover bg-center bg-tertiary"
            alt="Banner"
          >
            <div
              style="
                background: linear-gradient(
                  270deg,
                  rgba(51, 51, 51, 0) 30%,
                  rgba(0, 0, 0, 0.1292892156862745) 50%,
                  rgba(0, 0, 0, 0) 70%
                );
              "
              class="absolute hidden lg:flex w-40 h-full right-0 z-10"
            ></div>
            <div
              style="
                background: linear-gradient(
                  90deg,
                  rgba(51, 51, 51, 0) 30%,
                  rgba(0, 0, 0, 0.1292892156862745) 50%,
                  rgba(0, 0, 0, 0) 70%
                );
              "
              class="absolute hidden lg:flex w-40 h-full left-0 z-10"
            ></div>
          </div>
        </div>
        <div class="text-white text-xl pt-4 pl-6 text-shadow-lg">
          {{ datos.info }}
        </div>
      </div>
    </div>
    <div
      class="absolute h-full border-4 lg:border-8 bg-primary border-primary flex shadow-2xl"
      :class="id === 0 ? 'rounded-t-full' : ''"
      style="
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(
          to right,
          transparent,
          var(--color-tertiary),
          transparent
        );
      "
    ></div>
  </div>
</template>
<script setup>
const props = defineProps(["id", "datos"]);
const par = computed(() => {
  return props?.id % 2 === 0;
});
</script>
