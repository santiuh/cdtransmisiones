<template>
  <div class="max-w-[1440px] px-10 w-full py-64 justify-center self-center">
    <div class="flex flex-row w-full justify-between items-center">
      <div class="flex flex-col w-2/4 gap-12 pl-20">
        <NuxtImg
          src="/img/Contacto.png"
          class="rounded-3xl w-2/3"
          data-aos="slide-up"
        >
        </NuxtImg>
        <NuxtImg
          src="/img/Contacto2.png"
          class="rounded-3xl w-2/3 self-end"
          data-aos="slide-up"
        >
        </NuxtImg>
      </div>

      <div class="flex flex-col font-bold text-white gap-4 text-end">
        <p class="text-7xl text-shadow z-10">
          <span class="text-orangelight">¿</span>Querés saber más<span
            class="text-orangelight"
            >?</span
          >
        </p>
        <p class="text-shadow text-5xl z-10">
          Estamos para ayudarte<span class="text-orangelight">.</span>
        </p>
        <VButton
          titulo="Contactanos"
          class="!bg-primary !text-white !text-5xl font-bold h-fit mt-12 self-end"
          @click="router.push('/Contacto')"
        ></VButton>
      </div>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
</script>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
