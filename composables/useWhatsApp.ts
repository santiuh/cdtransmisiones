import { WHATSAPP_DEFAULT, whatsappNumero, whatsappUrl as armarUrl } from "~/utils/tienda";

// Número de WhatsApp del negocio: el que el cliente cargó en el panel (form
// "Contacto") si es válido, si no el de siempre. Una sola fuente para la tienda.
export function useWhatsApp() {
  const { contacto } = useEditable();
  const numero = computed(() => {
    const cargado = contacto.value?.contactos?.find((c) => c?.whatsapp)?.whatsapp;
    return whatsappNumero(cargado) || WHATSAPP_DEFAULT;
  });
  const whatsappUrl = (texto: string) => armarUrl(numero.value, texto);
  return { numero, whatsappUrl };
}
