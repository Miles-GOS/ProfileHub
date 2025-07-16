<template>
  <div class="absolute top-4 left-6">
    <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="50" height="50" />
  </div>
  <div class="min-h-screen mx-auto w-fit flex items-center justify-center relative">
    <div
      class="w-full p-8 bg-gradient-to-r from-[var(--color-amethyst-light)] to-[var(--color-amethyst-dark)] rounded-2xl"
    >
      <h2 class="text-4xl font-normal text-center text-white mb-5">
        Welcome to <span class="font-bold">Profile Hub</span>
      </h2>

      <hr class="border-t border-white/50 mb-5 mx-20" />

      <form @submit.prevent="handleLogin" class="flex flex-col !space-y-6" autocomplete="off">
        <div class="flex items-center gap-x-4">
          <label for="userId" class="w-1/3 text-sm font-medium text-gray-100">User ID*</label>
          <div
            class="w-2/3 p-[2px] rounded-xl bg-gradient-to-r from-[var(--color-amethyst-light)] to-[var(--color-amethyst-dark)]"
          >
            <input
              id="userId"
              v-model="form.userId"
              type="text"
              placeholder="Enter your ID"
              class="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--color-amethyst-light)] hover:bg-white/20 hover:ring-1 hover:ring-[var(--color-amethyst-light)] transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        <div class="flex items-center gap-x-4">
          <label for="password" class="w-1/3 text-sm font-medium text-gray-100"> Password* </label>

          <div
            class="relative w-2/3 p-[2px] rounded-xl bg-gradient-to-r from-[var(--color-amethyst-light)] to-[var(--color-amethyst-dark)]"
          >
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--color-amethyst-light)] hover:bg-white/20 hover:ring-1 hover:ring-[var(--color-amethyst-light)] transition-all duration-300 ease-in-out"
              required
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition duration-200 hover:scale-110"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-x-2 pl-1">
          <input
            id="remember"
            type="checkbox"
            v-model="form.remember"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember" class="text-sm text-gray-100">Keep me logged in</label>
        </div>

        <button
          type="submit"
          :disabled="!isValid || isLoading"
          class="w-full bg-gradient-to-r items-center justify-center flex from-[var(--color-candy)] to-[var(--color-cyan)] cursor-pointer text-white py-2 px-4 mb-3 rounded-xl hover:from-[var(--color-indigo-hover)] hover:to-[var(--color-purple-hover)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isLoading"
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
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{{ isLoading ? '' : 'Login' }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-100">
        No account?
        <router-link to="/register" class="text-blue-300 hover:underline">
          Register Here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, inject } from 'vue'
import { useRouter } from 'vue-router'

import Cookies from 'js-cookie'
import { useHead } from '@vueuse/head'

import apiClient from '@/utils/axios'

useHead({
  title: 'Login | ProfileHub',
  meta: [
    {
      name: 'description',
      content: 'Secure login to your Profile Hub dashboard',
    },
    {
      property: 'og:title',
      content: 'Login | ProfileHub',
    },
    {
      property: 'og:image',
      content: '/images/cover-login.jpg',
    },
  ],
})

const api = import.meta.env.VITE_API_BASE_URL

const toast = inject('toast')
const router = useRouter()
const isLoading = ref(false)

const form = reactive({
  userId: '',
  password: '',
  remember: false,
})

const showPassword = ref(false)

const isValid = computed(() => form.userId && form.password)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const { data } = await apiClient.post(api + '/api/login', {
      user_id: form.userId,
      password: form.password,
    })

    const token = data.accessToken

    Cookies.set('token', token, {
      expires: form.remember ? 365 : null,
      secure: true,
      sameSite: 'Strict',
    })

    router.push('/profile')
  } catch (error) {
    toast.message = 'Login failed. Please check your credentials.'
    toast.type = 'error'
    toast.show = true
  } finally {
    isLoading.value = false
  }
}
</script>
