<template>
  <div
    class="flex flex-col bg-[url('img/Hero/Hero1.png')] bg-cover bg-no-repeat bg-[center_right_45%] lg:bg-center"
  >
    <div
      class="max-w-[1440px] px-9 w-full justify-center h-full backdrop-blur-sm lg:backdrop-blur-0 self-center flex flex-col text-primary text-start gap-12 lg:gap-10"
    >
      <div class="flex flex-col lg:gap-7">
        <div class="flex flex-col text-3xl lg:text-7xl font-extrabold">
          <p>Importamos directo</p>
          <p class="text-6xl lg:text-7xl">de fábrica</p>
        </div>
        <span class="hidden lg:flex flex-col font-semibold text-lg lg:text-base"
          >Somos distribuidores mayoristas de rodamientos,

          <p>autopartes y agropartes.</p>
        </span>
        <span class="flex lg:hidden font-semibold text-lg lg:text-base"
          >Somos distribuidores mayoristas de rodamientos, autopartes y
          agropartes.
        </span>
      </div>

      <div class="flex flex-col lg:flex-row gap-3 lg:gap-8">
        <VButton
          titulo="Linea de productos"
          class="!bg-primary !text-white !text-xl"
          @click="router.push('/Productos')"
        ></VButton>
        <VButton
          titulo="Marcas"
          class="!text-xl"
          @click="router.push('/Servicios')"
        ></VButton>
      </div>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
</script>
