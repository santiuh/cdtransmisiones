<template>
  <div class="flex flex-col pt-12 pb-24">
    <!-- <div class="grid grid-cols-3 gap-x-4 lg:gap-x-10 gap-y-6 w-full">
      <ProductosProducto
        v-for="producto in productos"
        :key="producto.texto"
        :texto="producto.texto"
        :img="producto.imagen"
      ></ProductosProducto>
    </div> -->
  </div>
</template>
<script setup>
const productos = [
  { texto: "Crapodinas de punta de eje", imagen: "Automotor1.png" },
  { texto: "Crapodinas de embrague", imagen: "Automotor2.png" },
  { texto: "Crapodinas hidráulicas", imagen: "Automotor4.png" },
  { texto: "Ejes de bombas de agua", imagen: "Automotor5.png" },
  { texto: "Grasas y lubricantes", imagen: "Automotor6.png" },
  { texto: "Jaulas de agujas", imagen: "Automotor8.png" },
  { texto: "Kit tensor más correa", imagen: "Automotor9.png" },
  { texto: "Mazas de rueda ", imagen: "Automotor11.png" },
  { texto: "Productos Loctite", imagen: "Automotor12.png" },
  { texto: "Reformas cardan", imagen: "Automotor13.png" },
  { texto: "Retenes ", imagen: "Automotor15.png" },
  {
    texto: "Rodamientos de una hilera de rodillos cónicos",
    imagen: "Automotor16.png",
  },
  { texto: "Tensores de correa", imagen: "Automotor17.png" },
  // { texto: "Tensores Kugellager", imagen: "Automotor18.png" },
  // { texto: "Tensores SKF", imagen: "Automotor19.png" },
  // { texto: "Tensores VAR", imagen: "Automotor20.png" },
];
</script>
