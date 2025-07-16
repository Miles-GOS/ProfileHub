<template>
  <aside class="w-full md:w-60 md:h-screen py-6 backdrop-blur-lg flex-shrink-0">
    <ul
      class="flex md:block justify-around md:mt-30 overflow-auto pb-5 font-semibold text-lg md:text-xl space-x-4 md:space-x-0 md:space-y-4"
    >
      <li v-for="tab in tabs" :key="tab.key" class="whitespace-nowrap flex-shrink-0">
        <button
          @click="$emit('selectTab', tab.key)"
          :class="tabButtonClass(tab.key)"
          class="cursor-pointer"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentTab: String,
  maritalStatus: String,
})
const emit = defineEmits(['selectTab'])

const tabs = computed(() => [
  { key: 'basic', label: 'Basic Details' },
  { key: 'additional', label: 'Additional Details' },
  ...(props.maritalStatus === 'Married' ? [{ key: 'spouse', label: 'Spouse Details' }] : []),
  { key: 'preference', label: 'Personal Preferences' },
])

const tabButtonClass = (tab) =>
  [
    'w-full text-left border-b-2 py-2 transition-colors duration-200',
    props.currentTab === tab ? 'border-white font-bold' : 'border-white/30 hover:border-white/60',
  ].join(' ')
</script>
