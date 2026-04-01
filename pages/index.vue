<template>
  <div class="flex flex-col">
    <HomeHero></HomeHero>
    <!-- <HomeBanner></HomeBanner> -->
    <HomeSec3Carroucel></HomeSec3Carroucel>
    <HomeSec2></HomeSec2>
    <HomeSec4></HomeSec4>
  </div>
</template>

<script setup>
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
