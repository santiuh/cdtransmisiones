<template>
  <div class="bg-gradient-to-tl from-primary to-tertiary">
    <!-- <Particles class="-z-10"></Particles> -->
    <div>
      <VHeaderMobile class="lg:hidden"></VHeaderMobile>
      <!-- <VBannerMobile></VBannerMobile> -->
      <VHeader></VHeader>

      <slot />
      <WhatsApp></WhatsApp>
      <VFooter></VFooter>
    </div>
  </div>
</template>
<script setup></script>
