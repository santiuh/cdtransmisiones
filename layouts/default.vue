<template>
  <div>
    <VHeaderMobile class="lg:hidden"></VHeaderMobile>
    <!-- <VBannerMobile></VBannerMobile> -->
    <VHeader></VHeader>
    <slot />
    <WhatsApp></WhatsApp>
    <VFooter></VFooter>
  </div>
</template>
<script setup></script>
