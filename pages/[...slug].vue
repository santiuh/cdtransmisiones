<template>
  <!-- Página nueva creada desde el panel (Páginas): título, bloques y secciones de
       la biblioteca, ya armados por el backend (/data → site_pages). -->
  <div v-if="pagina" class="sms-pagina bg-white" v-html="pagina.html"></div>
</template>

<script setup>
const route = useRoute();
const sitePages = useState("smsPages", () => null);

const slug = computed(() => {
  const p = route.params.slug;
  return (Array.isArray(p) ? p.join("/") : String(p || "")).toLowerCase();
});
const pagina = computed(() =>
  (sitePages.value?.pages || []).find((p) => p.slug === slug.value)
);

// Las páginas del sitio (Productos, Servicios, Empresa…) tienen su propia ruta y le
// ganan a esta: acá solo llegan las del panel y las direcciones que no existen.
if (!pagina.value) {
  throw createError({ statusCode: 404, statusMessage: "Página no encontrada", fatal: true });
}

// El canonical de cada página apunta a sí misma.
const origen = useRequestURL().origin;

useHead(() => {
  const p = pagina.value;
  if (!p) return {};
  const titulo = p.seo?.title || `${p.title} — Imoberdorf Hnos.`;
  const url = `${origen}/${p.slug}`;
  const meta = [
    { property: "og:title", content: titulo },
    { name: "twitter:title", content: titulo },
    { property: "og:url", content: url },
  ];
  if (p.seo?.description) {
    meta.push({ name: "description", content: p.seo.description });
    meta.push({ property: "og:description", content: p.seo.description });
  }
  return { title: titulo, meta, link: [{ rel: "canonical", href: url }] };
});
</script>
