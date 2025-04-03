<template>
  <div class="flex relative w-full justify-center">
    <div
      style="clip-path: polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)"
      class="bg-[url('img/Hero/Hero3.png')] flex h-full w-3/5 bg-[center_right_60%] lg:bg-center bg-cover bg-no-repeat"
    ></div>
    <div class="h-full w-2/5"></div>

    <div
      class="max-w-[1440px] place-items-end absolute px-9 w-full pt-24 justify-start lg:justify-center h-full flex flex-col text-primary text-start gap-10"
    >
      <div class="flex flex-col text-4xl !font-raleway font-black">
        <p>TE OFRECEMOS EXPERIENCIA</p>
        <p class="text-orange">Y CONOCIMIENTO TÉCNICO</p>
      </div>

      <VButton
        titulo="Conocenos"
        class="!text-xl !bg-white w-3/4"
        @click="router.push('/Empresa')"
      ></VButton>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
</script>
