<template>
  <div class="bg-gradient-to-tl from-primary to-tertiary flex flex-col">
    <!-- Barra de anuncio (editor): pegada arriba de todo, en todas las páginas.
         sticky para que el header fixed (offseteado por --sms-ann-h) no la tape. Vacía → no renderiza. -->
    <SmsAnnouncementBar class="sticky top-0 z-[55]" />
    <VHeaderMobile class="lg:hidden"></VHeaderMobile>
    <VHeader></VHeader>

    <slot />
    <WhatsApp></WhatsApp>
    <VFooter></VFooter>
  </div>
</template>
<script setup></script>
