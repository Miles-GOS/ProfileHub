<template>
  <header
    class="w-full flex items-center justify-between xs:px-5 md:px-10 xl:px-20 py-3 bg-black/60 text-white fixed top-0 left-0 z-50"
  >
    <div class="flex items-center space-x-2">
      <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto" />
    </div>

    <HamburgerMenu />
  </header>
</template>

<script setup lang="ts">
import HamburgerMenu from './HamburgerMenu.vue'
</script>
