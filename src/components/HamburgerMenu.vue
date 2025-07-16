<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="focus:outline-none flex cursor-pointer flex-col justify-center items-center space-y-1"
    >
      <span
        class="w-6 h-0.5 bg-white transition-all duration-300"
        :class="{ 'rotate-45 translate-y-1.5': isOpen }"
      />
      <span
        class="w-6 h-0.5 bg-white transition-all duration-300"
        :class="{ 'opacity-0': isOpen }"
      />
      <span
        class="w-6 h-0.5 bg-white transition-all duration-300"
        :class="{ '-rotate-45 -translate-y-1.5': isOpen }"
      />
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 backdrop-blur-xl rounded-lg shadow-lg py-2 z-50"
      >
        <a href="/" class="block !text-white hover:!text-purple-600 font-medium !px-6 py-2">Home</a>
        <a href="/home" class="block !text-white hover:!text-purple-600 font-medium !px-6 py-2"
          >My Profile</a
        >
        <a
          href="/profile?edit=true"
          class="block !text-white hover:!text-purple-600 font-medium !px-6 py-2"
          >Edit Profile</a
        >
        <button class="w-full text-left !px-6 py-2 text-red-600 cursor-pointer" @click="logout">
          Logout
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isLoggedIn = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
})

const logout = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      import.meta.env.VITE_API_BASE_URL + '/api/logout',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    localStorage.removeItem('token')
    isLoggedIn.value = false
    isOpen.value = false
    window.location.href = '/login'
  } catch {
    console.error('An error occurred while logging out.')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
