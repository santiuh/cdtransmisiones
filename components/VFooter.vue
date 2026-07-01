<template>
  <div class="flex flex-col items-center bg-primary pt-24 pb-16 z-40 relative gap-14">
    <div
      class="flex-col lg:flex-row gap-6 lg:gap-0 items-center lg:items-start text-center lg:text-start flex text-white lg:justify-around w-full max-w-[1440px]"
    >
      <EImg
        k="footer_logo"
        src="/img/logononameblanco.png"
        class="!h-20 w-auto self-center"
      />
      <div class="flex flex-col gap-3 lg:gap-6">
        <E tag="div" k="footer_contacto_titulo" class="font-bold text-2xl">Contactanos</E>
        <div
          class="flex flex-row lg:text-lg gap-6 items-center self-center lg:self-start"
        >
          <svgo-footergps class="!h-5 !w-auto text-orange"></svgo-footergps>
          <div class="flex flex-col">
            <E tag="span" k="footer_dir1">Maipu 450 - Rafaela</E>
            <E tag="span" k="footer_dir2">Prov. de Santa Fé - Argentina </E>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row lg:text-lg gap-3 items-center">
          <button
            @click="openWindow()"
            class="flex flex-row gap-3 items-center hover:text-orange transition-all duration-300"
          >
            <NuxtImg class="h-5" src="svg/footerwsp.svg"></NuxtImg>
            <E tag="span" k="footer_wsp">+54 9 3492 57-3782</E>
          </button>
          <button
            class="flex flex-row gap-3 items-center hover:text-orange transition-all duration-300"
          >
            <NuxtImg class="h-5" src="svg/footerphone.svg"></NuxtImg>
            <E tag="span" k="footer_tel">+54 3492 42-1086</E>
          </button>
        </div>
        <a
          href="mailto:administración@imoberdorfhnos.com.ar"
          class="flex flex-row lg:text-lg gap-3 items-center hover:text-orange transition-all duration-300"
        >
          <NuxtImg class="h-5" src="svg/footermail.svg"></NuxtImg>
          <E tag="span" k="footer_email">administración@imoberdorfhnos.com.ar</E>
        </a>
      </div>
      <div class="flex flex-col gap-3 lg:gap-6 items-center lg:items-start">
        <E tag="div" k="footer_redes_titulo" class="font-bold text-2xl flex">Redes Sociales</E>
        <div class="flex flex-row gap-3 !text-orange">
          <NuxtLink :to="igHref" target="_blank"
            ><svgo-ig
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-ig
          ></NuxtLink>
          <NuxtLink :to="fbHref" target="_blank"
            ><svgo-fb
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-fb
          ></NuxtLink>
          <NuxtLink :to="liHref" target="_blank"
            ><svgo-li
              class="!h-7 !w-7 hover:text-orange transition-all duration-300"
            ></svgo-li
          ></NuxtLink>
        </div>
      </div>
    </div>

    <!-- Crédito de la agencia -->
    <a
      href="https://soldemayosoft.com.ar"
      target="_blank"
      rel="nofollow noopener"
      aria-label="Sitio desarrollado por Sol de Mayo Soft"
      class="inline-block opacity-70 hover:opacity-100 transition"
    >
      <img
        src="https://soldemayosoft.com/img/logohorizontaldesarrollado.png"
        alt="Desarrollado por Sol de Mayo Soft"
        width="150"
        height="40"
        class="h-8 w-auto"
        loading="lazy"
        decoding="async"
      />
    </a>
  </div>
</template>
<script setup>
const { redes } = useEditable();

// Los links de redes salen del panel (form "Redes"); si están vacíos, fallback a
// los actuales. Se usa el valor si es una URL completa; si no, el fallback.
const socialHref = (val, fallback) =>
  typeof val === "string" && /^https?:\/\//.test(val.trim()) ? val.trim() : fallback;

const igHref = computed(() =>
  socialHref(redes.value.instagram, "https://www.instagram.com/imoberdorfhnos/"),
);
const fbHref = computed(() =>
  socialHref(redes.value.facebook, "https://www.facebook.com/imoberdorfhnos"),
);
const liHref = computed(() =>
  socialHref(
    redes.value.linkedin,
    "https://www.linkedin.com/in/imoberdorf-hnos-s-a-628470257/",
  ),
);

const openWindow = () => {
  window.open("https://api.whatsapp.com/send?phone=5493492573782", "_blank");
};
</script>
