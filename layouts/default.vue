<template>
  <div class="bg-gradient-to-tl from-primary to-tertiary flex flex-col">
    <VHeaderMobile class="lg:hidden"></VHeaderMobile>
    <VHeader></VHeader>

    <slot />
    <WhatsApp></WhatsApp>
    <VFooter></VFooter>
  </div>
</template>
<script setup></script>
