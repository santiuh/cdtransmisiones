<template>
  <div
    class="bg-[#04254448] flex flex-col px-4 xl:px-[60px] pt-[34px] pb-[48px] rounded-xl gap-[26px] text-white"
  >
    <div class="flex flex-col xl:flex-row gap-[26px] lg:gap-[30px]">
      <div class="flex flex-col xl:w-1/2">
        <div class="text-xl font-bold leading-10">Nombre y Apellido</div>
        <input
          v-model="mensaje.cliente"
          class="h-[60px] bg-[#04254448] focus:border-orange outline-none transition-all duration-300 px-5 rounded-[4px] border border-transparent"
          type="text"
          name=""
          id=""
        />
      </div>
      <div class="flex flex-col xl:w-1/2">
        <div class="text-xl font-bold leading-10">Correo Electrónico</div>
        <input
          v-model="mensaje.correo"
          class="h-[60px] bg-[#04254448] px-5 focus:border-orange outline-none transition-all duration-300 rounded-[4px] border border-transparent"
          type="email"
          name=""
          id=""
        />
      </div>
    </div>

    <div class="flex flex-col xl:flex-row gap-[26px] lg:gap-[30px]">
      <div class="flex flex-col xl:w-1/2">
        <div class="text-xl font-bold leading-10">Teléfono</div>
        <input
          v-model="mensaje.telefono"
          class="h-[60px] bg-[#04254448] px-5 focus:border-orange outline-none transition-all duration-300 rounded-[4px] border border-transparent"
          type="number"
          name=""
          id=""
        />
      </div>
      <div class="flex flex-col xl:w-1/2">
        <div class="text-xl font-bold leading-10">Localidad</div>
        <input
          v-model="mensaje.localidad"
          class="h-[60px] bg-[#04254448] focus:border-orange outline-none transition-all duration-300 px-5 rounded-[4px] border border-transparent"
          type="text"
          name=""
          id=""
        />
      </div>
    </div>
    <div class="flex flex-col h-fit">
      <div class="text-xl font-bold leading-10">Mensaje</div>
      <textarea
        v-model="mensaje.mensaje"
        class="overflow-auto bg-[#04254448] p-5 focus:border-orange outline-none transition-all duration-300 rounded-[4px] border border-transparent"
        type="text"
        name=""
        id=""
      ></textarea>
    </div>
    <div
      class="h-0 overflow-hidden transition-all text-white font-bold"
      :class="mostrarDiv ? 'h-[2em]' : ''"
    >
      Debe completar todos los campos para enviar el formulario.
    </div>

    <VButton
      :class="
        formularioDesactivado
          ? '!bg-gray-400 hover:!scale-100'
          : '!bg-orange !hover:!scale-105'
      "
      class="mt-[20px] min-h-16 items-center xl:min-w-56 self-end"
      titulo="Enviar formulario"
      :spin="mostrarSpin"
      @click="formularioDesactivado ? prevenirClick() : enviarCorreo()"
    ></VButton>
  </div>
</template>
<script setup>
const mail = useMail();

const mensaje = ref({
  cliente: "",
  correo: "",
  telefono: "",
  localidad: "",
  mensaje: "",
});

const mostrarSpin = ref(false);
const mostrarDiv = ref(false);
const mostrarModal = ref(false);
const mensajeModal = ref("");

const formularioDesactivado = computed(() => {
  const m = mensaje.value;
  return (
    m.mensaje === "" ||
    m.cliente === "" ||
    m.telefono === "" ||
    m.localidad === "" ||
    m.correo === ""
  );
});

const prevenirClick = () => {
  if (formularioDesactivado.value === true) {
    mostrarDiv.value = true;
  }
};

const enviarCorreo = () => {
  const nombre = mensaje.value.cliente;
  const correo = mensaje.value.correo;
  const telefono = mensaje.value.telefono;
  const localidad = mensaje.value.localidad;
  const textoMensaje = mensaje.value.mensaje;

  // Mensaje prearmado
  const texto =
    `Hola, me gustaría contactarme.\n` +
    `Nombre: ${nombre}\n` +
    `Correo: ${correo}\n` +
    `Teléfono: ${telefono}\n` +
    `Localidad: ${localidad}\n` +
    `Motivo: ${textoMensaje}`;

  // Número de WhatsApp de destino (reemplazar por el número deseado)
  const numeroDestino = "+543492573782"; // Ejemplo: 5491123456789

  // Codificar el mensaje para URL
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(
    texto
  )}`;

  // Abrir WhatsApp en una nueva pestaña
  window.open(url, "_blank");
};
</script>
<style>
select {
  background-image: url("/chevron.svg");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 2em;
}
</style>
