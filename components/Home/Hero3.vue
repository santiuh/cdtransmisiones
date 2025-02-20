<template>
  <div
    class="flex flex-col bg-[url('img/Hero/Hero3Mobile2.png')] lg:bg-[url('img/Hero/Hero3.png')] bg-cover bg-no-repeat bg-[center_right_60%] lg:bg-center"
  >
    <div
      class="max-w-[1440px] px-9 w-full pt-24 justify-start lg:justify-center h-full self-center flex flex-col text-primary text-start gap-10"
    >
      <div class="flex flex-col text-5xl font-extrabold">
        <p>Una empresa familiar que</p>
        <p>acompaña tu crecimiento</p>
      </div>

      <VButton
        titulo="Conocé nuestra historia"
        class="!text-xl !bg-white w-3/4"
        @click="router.push('/Empresa')"
      ></VButton>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
</script>
