<template>
  <aside class="w-full md:w-60 md:h-screen py-6 backdrop-blur-lg flex-shrink-0">
    <ul
      class="flex md:block justify-around md:mt-30 overflow-auto pb-5 font-semibold text-lg md:text-xl space-x-4 md:space-x-0 md:space-y-4"
    >
      <li v-for="tab in tabs" :key="tab.key" class="whitespace-nowrap flex-shrink-0">
        <button @click="$emit('selectTab', tab.key)" :class="tabButtonClass(tab.key)">
          <span
            class="relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full"
            :class="props.currentTab === tab.key ? 'after:w-full' : ''"
          >
            {{ tab.label }}
          </span>
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
    'relative w-full cursor-pointer text-left py-2 transition-colors duration-200 group',
    props.currentTab === tab ? 'font-bold text-white' : 'text-white/70 hover:text-white',
  ].join(' ')
</script>
