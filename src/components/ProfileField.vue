<template>
  <div class="flex flex-col items-start text-left w-full">
    <label class="text-sm mb-1 font-semibold text-white/80">
      <span v-html="formattedLabel"></span>
    </label>

    <Transition name="fade-slide" mode="out-in">
      <template v-if="edit">
        <div key="edit-mode" class="w-full">
          <input
            v-if="type === 'text' || type === 'date'"
            :type="type"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :class="[
              'w-full bg-white/10 text-white placeholder-gray-300 rounded-[10px]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-amethyst-light)]',
              'hover:bg-white/20 hover:ring-1 hover:ring-[var(--color-amethyst-light)] transition-all duration-300 ease-in-out',
              'text-base xs:text-lg md:text-xl',
              'px-4 py-2 xs:py-3 md:py-4',
              error ? 'ring-2 ring-red-400' : '',
            ]"
          />

          <select
            v-else-if="type === 'select'"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            :class="[
              'w-full bg-white/10 text-white border border-white/30 rounded-md',
              'focus:outline-none focus:border-white/60 transition duration-200',
              'text-base xs:text-lg md:text-xl',
              'px-4 py-2 xs:py-3 md:py-4',
              error ? 'ring-2 ring-red-400' : '',
            ]"
          >
            <option disabled value="">Select...</option>
            <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </template>

      <template v-else>
        <p
          key="readonly"
          class="text-white text-base xs:text-lg md:text-xl px-3 py-2 xs:py-3 md:py-4 bg-white/5 rounded-md min-h-[2.5rem] xs:min-h-[3rem] md:min-h-[3.5rem] w-full"
        >
          {{ modelValue || '—' }}
        </p>
      </template>
    </Transition>

    <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  edit: Boolean,
  type: {
    type: String,
    default: 'text',
  },
  options: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: '',
  },
})

const formattedLabel = computed(() => {
  if (!props.label) return ''
  const hasAsterisk = props.label.includes('*')
  if (!hasAsterisk) return props.label
  const parts = props.label.split('*')
  return `${parts[0]}<span class="text-red-500">*</span>${parts[1] || ''}`
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
