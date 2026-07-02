<script setup>
// Sección de video (YouTube) del editor. Se monta SOLO cuando video.active
// (lo controla pages/index.vue), así que acá asumimos activa; si el link no es
// válido, mostramos solo el encabezado. Estilada a la marca Imoberdorf.
const { video } = useEditable()

function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,20})/,
  )
  return m ? m[1] : ''
}
const vid = computed(() => youtubeId(video.value?.youtube_url))
const params = computed(() =>
  video.value?.autoplay
    ? `autoplay=1&mute=1&loop=1&playlist=${vid.value}&controls=0&playsinline=1&rel=0`
    : 'rel=0',
)
</script>

<template>
  <section class="w-full flex place-content-center py-20 lg:py-28 px-4 lg:px-10">
    <div class="w-full max-w-[1100px]">
      <h2
        v-if="video?.titulo"
        class="font-raleway text-3xl lg:text-5xl text-white text-center font-bold"
      >
        {{ video.titulo }}
      </h2>
      <p v-if="video?.descripcion" class="mt-3 text-center text-white/80 max-w-2xl mx-auto">
        {{ video.descripcion }}
      </p>
      <div
        v-if="vid"
        class="mt-8 relative rounded-2xl overflow-hidden shadow-2xl bg-black"
        style="aspect-ratio: 16 / 9"
      >
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${vid}?${params}`"
          :title="video?.titulo || 'Video'"
          loading="lazy"
          class="absolute inset-0 w-full h-full"
          style="border: 0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
