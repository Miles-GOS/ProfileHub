<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseToast from '@/components/BaseToast.vue'
import { reactive, provide } from 'vue'

const toast = reactive({
  message: '',
  type: 'info',
  show: false,
})

provide('toast', toast)
</script>

<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-main">
    <RouterView />
    <BaseToast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<style scoped>
.bg-main {
  background-image: url('@/assets/images/bg.webp');
}
</style>
