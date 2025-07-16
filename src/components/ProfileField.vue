<template>
  <div class="flex flex-col items-start text-left w-full">
    <label class="text-sm mb-1 font-semibold text-white/80">
      <span v-html="formattedLabel"></span>
    </label>

    <Transition name="fade-slide" mode="out-in">
      <template v-if="edit">
        <div key="edit-mode" class="w-full">
          <div v-if="type === 'avatar'" class="flex items-center space-x-4">
            <label class="relative cursor-pointer group">
              <div class="w-24 h-24 relative">
                <div
                  v-if="imageLoading"
                  class="absolute inset-0 bg-white/10 animate-pulse rounded-full"
                ></div>

                <img
                  :src="previewUrl || defaultAvatar"
                  class="w-24 h-24 rounded-full object-cover border-2 border-white/30 group-hover:opacity-80 transition"
                  @load="imageLoading = false"
                  @error="imageLoading = false"
                />
              </div>
              <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Change
              </div>
            </label>
          </div>

          <input
            v-else-if="type === 'text' || type === 'date'"
            :type="type"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :class="inputClasses"
          />

          <select
            v-else-if="type === 'select'"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            :class="selectClasses"
          >
            <option disabled value="">Select...</option>
            <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
          </select>

          <input
            v-else-if="type === 'file'"
            type="file"
            @change="onFileChange"
            accept="image/*"
            :class="inputClasses"
          />
        </div>
      </template>

      <template v-else>
        <div v-if="type === 'avatar'" class="w-24 h-24">
          <img
            :src="previewUrl || defaultAvatar"
            class="w-24 h-24 rounded-full object-cover border border-white/20"
          />
        </div>
        <p
          v-else
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
import { computed, ref, watch } from 'vue'
import defaultAvatar from '@/assets/images/default-avatar.png'

const props = defineProps({
  label: String,
  modelValue: [String, File],
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

const emit = defineEmits(['update:modelValue'])

const formattedLabel = computed(() => {
  if (!props.label) return ''
  const hasAsterisk = props.label.includes('*')
  if (!hasAsterisk) return props.label
  const parts = props.label.split('*')
  return `${parts[0]}<span class="text-red-500">*</span>${parts[1] || ''}`
})

const inputClasses = computed(() => [
  'w-full bg-white/10 text-white placeholder-gray-300 rounded-[10px]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-amethyst-light)]',
  'hover:bg-white/20 hover:ring-1 hover:ring-[var(--color-amethyst-light)] transition-all duration-300 ease-in-out',
  'text-base xs:text-lg md:text-xl',
  'px-4 py-2 xs:py-3 md:py-4',
  props.error ? 'ring-2 ring-red-400' : '',
])

const selectClasses = computed(() => [
  'w-full bg-white/10 text-white border border-white/30 rounded-md',
  'focus:outline-none focus:border-white/60 transition duration-200',
  'text-base xs:text-lg md:text-xl',
  'px-4 py-2 xs:py-3 md:py-4',
  props.error ? 'ring-2 ring-red-400' : '',
])

const imageLoading = ref(true)
const previewUrl = ref('')
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  previewUrl.value = URL.createObjectURL(file)
  imageLoading.value = true

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'profile_avatars')

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    previewUrl.value = data.secure_url
    emit('update:modelValue', data.secure_url)
  } catch (err) {
    console.error('Upload failed', err)
    alert('Failed to upload image. Please try again.')
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === 'string' && val.startsWith('http')) {
      previewUrl.value = val
      imageLoading.value = true
    }
  },
  { immediate: true },
)
</script>
