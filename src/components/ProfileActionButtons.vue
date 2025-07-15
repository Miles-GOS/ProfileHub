<template>
  <div v-if="editMode" class="flex justify-end mt-6">
    <button
      @click="$emit('submit')"
      :disabled="disabled"
      class="w-fit bg-gradient-to-r mr-4 items-center font-bold justify-center flex from-[#B58ECC] to-[#5DE6DE] cursor-pointer text-white py-2 px-4 mb-3 rounded-xl hover:from-[#647DEE] hover:to-[#7F53AC] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Save & Update
    </button>
    <button
      @click="$emit('cancel')"
      class="w-fit border border-white text-white font-bold cursor-pointer py-2 px-4 mb-3 rounded-xl hover:bg-white/10 transition duration-300"
    >
      Cancel
    </button>
  </div>
</template>

<script setup>
defineProps({
  disabled: Boolean,
  editMode: Boolean,
})
defineEmits(['submit', 'cancel'])
</script>
