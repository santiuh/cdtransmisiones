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
          : '!!bg-orange !hover:!scale-105'
      "
      class="mt-[20px] min-h-16 items-center xl:min-w-56 self-end"
      titulo="Enviar formulario"
      :spin="mostrarSpin"
      @click="formularioDesactivado ? prevenirClick() : enviarCorreo()"
    ></VButton>
  </div>
</template>
<script setup>
// const mail = useMail();

const mensaje = ref({
  cliente: "",
  correo: "",
  telefono: "",
  tipodeevento: "",
  cantidaddeinvitados: "",
  fechadelevento: "",
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
    m.tipodeevento === "" ||
    m.telefono === "" ||
    m.fechadelevento === "" ||
    m.cantidaddeinvitados === "" ||
    m.correo === ""
  );
});

const prevenirClick = () => {
  if (formularioDesactivado.value === true) {
    mostrarDiv.value = true;
  }
};

const enviarCorreo = () => {
  console.log(mensaje.value);
};
// const enviarCorreo = () => {
//   mostrarSpin.value = true;
//   mail
//     .send({
//       from: mensaje.value.correo,
//       replyTo: mensaje.value.correo,
//       subject: `CONTACTO WEB - ${mensaje.value.cliente} - ${mensaje.value.tipodeevento}`,
//       html:
//         '<div style="background-color: palevioletred; color: white; text-align:center; font-size: x-large; font-weight: bold; padding: 12px;">SOLICITUD DE CONTACTO</div><div style="background-color: #F9F3F3; padding-left: 10rem; padding-right: 10rem; padding-top: 1rem; padding-bottom: 4rem;"><div style="font-size: large; padding: 5px;"><span>Nombre:</span> <strong>' +
//         mensaje.value.cliente +
//         '</strong></div><div style="font-size: large; padding: 5px;"><span>Correo:</span> <strong>' +
//         mensaje.value.correo +
//         '</strong></div> <div style="font-size: large; padding: 5px;"><span>Teléfono:</span> <strong>' +
//         mensaje.value.telefono +
//         '</strong></div><div style="font-size: large; padding: 5px;"><span>Tipo de evento:</span> <strong>' +
//         mensaje.value.tipodeevento +
//         '</strong></div><div style="font-size: large; padding: 5px;"><span>Fecha del Evento:</span> <strong>' +
//         mensaje.value.fechadelevento +
//         '</strong></div><div style="font-size: large; padding: 5px;"><span>Cantidad de Invitados:</span> <strong>' +
//         mensaje.value.cantidaddeinvitados +
//         '</strong> </div> <div style="font-size: large; padding: 5px;">Mensaje:</div><div style="background-color: white; padding: 1rem; border-radius: 10px; margin-top: 1rem;">' +
//         mensaje.value.mensaje +
//         "</div></div>",
//     })
//     .then(() => {
//       mostrarSpin.value = false;
//       mensajeModal.value = "Formulario enviado correctamente.";
//       mostrarModal.value = true;
//     })
//     .catch((error) => {
//       mostrarSpin.value = false;
//       mensajeModal.value =
//         "Un error ha ocurrido al intentar enviar el formulario.";
//       mostrarModal.value = true;
//     });
// };
</script>
<style>
select {
  background-image: url("/chevron.svg");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 2em;
}
</style>
