<script setup lang="ts">
// Migas de pan: el último ítem es la página actual (sin link).
defineProps<{ items: Array<{ texto: string; to?: string }> }>();
</script>

<template>
  <nav aria-label="Migas de pan" class="min-w-0 text-sm text-neutral-500">
    <ol class="flex flex-wrap items-center gap-1">
      <li v-for="(m, i) in items" :key="i" class="flex min-w-0 items-center gap-1">
        <TiendaIcono v-if="i > 0" name="chevron-derecha" class="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <NuxtLink v-if="m.to" :to="m.to" class="truncate hover:text-primary hover:underline">{{ m.texto }}</NuxtLink>
        <span v-else class="truncate text-neutral-700" aria-current="page">{{ m.texto }}</span>
      </li>
    </ol>
  </nav>
</template>
