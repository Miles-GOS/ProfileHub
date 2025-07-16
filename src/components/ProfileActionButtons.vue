<template>
  <div v-if="editMode" class="flex justify-end mt-6">
    <button
      @click="$emit('submit')"
      :disabled="disabled || loading"
      class="relative w-fit bg-gradient-to-r mr-4 gap-2 cursor-pointer items-center font-bold justify-center flex from-[var(--color-candy)] to-[var(--color-cyan)] text-white py-2 px-4 mb-3 rounded-xl hover:from-[var(--color-indigo-hover)] hover:to-[var(--color-purple-hover)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        v-if="loading"
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span>Save & Update</span>
    </button>

    <button
      @click="$emit('cancel')"
      class="w-fit border border-white text-white font-bold cursor-pointer py-2 px-4 mb-3 rounded-xl hover:bg-white/10 transition duration-300"
      :disabled="loading"
    >
      Cancel
    </button>
  </div>
</template>

<script setup>
defineProps({
  disabled: Boolean,
  editMode: Boolean,
  loading: Boolean,
})
defineEmits(['submit', 'cancel'])
</script>
