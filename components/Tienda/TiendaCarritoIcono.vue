<script setup lang="ts">
// Ícono del carrito para los headers, con el contador de unidades. El contador
// aparece recién después de montar (el carrito vive en localStorage).
withDefaults(defineProps<{ claro?: boolean }>(), { claro: false });
const { cantidad } = useCarrito();
</script>

<template>
  <NuxtLink
    to="/Productos/carrito"
    class="relative inline-flex h-8 w-8 items-center justify-center transition-colors hover:text-orange"
    :class="claro ? 'text-white' : 'text-primary'"
    :aria-label="cantidad ? `Carrito, ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'}` : 'Carrito'"
  >
    <TiendaIcono name="carrito" class="h-6 w-6" />
    <span
      v-if="cantidad"
      class="absolute -right-1.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold leading-none text-white"
    >
      {{ cantidad > 99 ? "99+" : cantidad }}
    </span>
  </NuxtLink>
</template>
