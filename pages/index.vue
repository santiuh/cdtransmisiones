<template>
  <div class="flex flex-col">
    <!-- El hero (carrusel) va SIEMPRE primero y no es reordenable. -->
    <HomeHero></HomeHero>
    <!-- Secciones reordenables/ocultables desde el panel (editable_content.sections).
         El attr data-sms-section cae sobre el root de cada componente (root único). -->
    <component
      v-for="s in orderedSections"
      :key="s.key"
      :is="s.comp"
      :data-sms-section="s.key"
      :data-sms-section-label="s.label"
    />
  </div>
</template>

<script setup>
// Registro de secciones del home: clave → componente + label. El orden acá es el
// DEFAULT; editable_content.sections=[{key,visible}] lo permuta/oculta en runtime.
const { sections, video } = useEditable()

const REGISTRY = {
  marcas: { comp: resolveComponent("HomeSec3Carroucel"), label: "Marcas" },
  accesos: { comp: resolveComponent("HomeSec2"), label: "Accesos" },
  video: { comp: resolveComponent("HomeVideo"), label: "Video" },
  contacto: { comp: resolveComponent("HomeSec4"), label: "Contacto" },
};
const DEFAULT_ORDER = ["marcas", "accesos", "video", "contacto"];

const orderedSections = computed(() => {
  const cfg = sections.value?.length
    ? sections.value
    : DEFAULT_ORDER.map((key) => ({ key, visible: true }));
  const videoActive = video.value?.active === true;
  return cfg
    .filter((s) => s.visible !== false && REGISTRY[s.key])
    // La sección de video solo aparece si el cliente la activó (igual que el motor estático).
    .filter((s) => s.key !== "video" || videoActive)
    .map((s) => ({ key: s.key, comp: REGISTRY[s.key].comp, label: REGISTRY[s.key].label }));
});

// ── Meta para el panel (modo preview): lista COMPLETA de secciones (incluidas
// las ocultas, para poder volver a mostrarlas) + su orden/visibilidad guardados.
// Mismo protocolo que buildPreviewMeta del motor estático: postMessage al iframe.
const pv = useState("smsPreview", () => ({ draft: false, edit: false, token: "" }));
const panelSections = computed(() => {
  const videoActive = video.value?.active === true;
  const cfgList = sections.value || [];
  const cfgKeys = cfgList.map((s) => s.key);
  const allKeys = [...cfgKeys, ...DEFAULT_ORDER.filter((k) => !cfgKeys.includes(k))].filter(
    (k) => REGISTRY[k],
  );
  return allKeys
    .filter((k) => k !== "video" || videoActive)
    .map((k) => {
      const c = cfgList.find((s) => s.key === k);
      return { key: k, label: REGISTRY[k].label, visible: c ? c.visible !== false : true };
    });
});

if (import.meta.client) {
  const send = () => {
    try {
      parent.postMessage({ source: "sms-edit", type: "sections", sections: panelSections.value }, "*");
    } catch (e) {
      /* noop */
    }
  };
  const onMsg = (ev) => {
    const d = ev.data || {};
    if (d.source === "sms-panel" && d.type === "get-sections") send();
  };
  onMounted(() => {
    if (!pv.value?.draft) return; // solo dentro del iframe de preview del panel
    window.addEventListener("message", onMsg);
    send();
  });
  onBeforeUnmount(() => window.removeEventListener("message", onMsg));
  watch(panelSections, () => {
    if (pv.value?.draft) send();
  });
}

useSeoMeta({
  title:
    "Imoberdorf Hnos. | Soluciones eléctricas y electromecánicas en Rafaela",
  description:
    "Empresa familiar con más de 56 años de experiencia en bobinado, reparación y venta de motores eléctricos, bombas y drives. Asistencia técnica, mantenimiento y energías renovables.",
  keywords:
    "motores eléctricos, bobinado, reparación, drives, bombas, asistencia técnica, mantenimiento, energías renovables, Rafaela, Imoberdorf Hnos.",
  ogTitle:
    "Imoberdorf Hnos. | Soluciones eléctricas y electromecánicas en Rafaela",
  ogDescription:
    "Empresa familiar con más de 56 años de experiencia en bobinado, reparación y venta de motores eléctricos, bombas y drives. Asistencia técnica, mantenimiento y energías renovables.",
  ogUrl: "https://www.imoberdorfhnos.com.ar/",
  ogImage: "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg",
  twitterTitle:
    "Imoberdorf Hnos. | Soluciones eléctricas y electromecánicas en Rafaela",
  twitterDescription:
    "Empresa familiar con más de 56 años de experiencia en bobinado, reparación y venta de motores eléctricos, bombas y drives.",
  twitterImage: "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg",
});
useHead({
  link: [{ rel: "canonical", href: "https://www.imoberdorfhnos.com.ar/" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Imoberdorf Hnos. S.A.",
        description:
          "Empresa familiar con más de 56 años de experiencia en bobinado, reparación y venta de motores eléctricos, bombas y drives. Asistencia técnica, mantenimiento y energías renovables.",
        url: "https://www.imoberdorfhnos.com.ar",
        logo: "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg",
        image: "https://www.imoberdorfhnos.com.ar/img/Empresa/empresa1.jpg",
        telephone: "+543492573782",
        email: "venta@imoberdorfhnos.com.ar",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Maipú 450",
          addressLocality: "Rafaela",
          addressRegion: "Santa Fe",
          postalCode: "2300",
          addressCountry: "AR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -31.2527,
          longitude: -61.4876,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "18:00",
          },
        ],
        sameAs: ["https://www.facebook.com/imoberdorfhnos"],
      }),
    },
  ],
});
</script>
