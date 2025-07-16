<!-- App.vue -->
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import BaseToast from '@/components/BaseToast.vue'
import Header from '@/components/Header.vue'
import { reactive, provide } from 'vue'

const toast = reactive({
  message: '',
  type: 'info',
  show: false,
})

provide('toast', toast)
const route = useRoute()
</script>

<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-main xs:px-5 md:px-10 xl:px-20"
  >
    <Header v-if="!route.meta.hideHeader" />

    <div :class="[!route.meta.hideHeader ? 'pt-16' : '', 'min-h-screen']">
      <RouterView />
    </div>
    <BaseToast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <footer class="text-center text-white/60 py-6 text-sm border-t border-white/10">
      &copy; 2025 ProfileHub. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.bg-main {
  background-image: url('@/assets/images/bg.webp');
}
</style>
