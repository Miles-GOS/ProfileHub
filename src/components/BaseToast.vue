<template>
  <transition name="slide-up" appear>
    <div
      v-if="visible"
      :class="[
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl text-white shadow-lg z-50',
        typeClass,
      ]"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref, watch, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning'
  },
})

const emit = defineEmits(['close'])

const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    emit('close')
  }, 3000)
})

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500 text-black'
    case 'info':
    default:
      return 'bg-blue-500'
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
