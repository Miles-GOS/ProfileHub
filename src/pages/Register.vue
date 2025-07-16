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

      <form @submit.prevent="handleRegister" class="flex flex-col !space-y-6" autocomplete="off">
        <div class="flex items-center gap-x-4">
          <label for="user_id" class="w-1/3 text-sm font-medium text-gray-100">User ID*</label>
          <div
            class="w-2/3 p-[2px] rounded-xl bg-gradient-to-r from-[var(--color-amethyst-light)] to-[var(--color-amethyst-dark)]"
          >
            <input
              id="user_id"
              v-model="form.user_id"
              type="text"
              placeholder="Enter your ID"
              autocomplete="off"
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
              autocomplete="off"
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
        <div class="flex items-center gap-x-4">
          <label for="password" class="w-1/3 text-sm font-medium text-gray-100"
            >Confirm Password*
          </label>

          <div
            class="relative w-2/3 p-[2px] rounded-xl bg-gradient-to-r from-[var(--color-amethyst-light)] to-[var(--color-amethyst-dark)]"
          >
            <input
              id="confirm_password"
              v-model="form.confirmPassword"
              autocomplete="off"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              class="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--color-amethyst-light)] hover:bg-white/20 hover:ring-1 hover:ring-[var(--color-amethyst-light)] transition-all duration-300 ease-in-out"
              required
            />

            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition duration-200 hover:scale-110"
            >
              <span v-if="showConfirmPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>
        <ul class="text-sm text-white flex flex-wrap gap-4 mt-2 font-medium max-w-xl">
          <li :class="passwordRules.minLength ? 'text-green-400' : 'text-red-300'">
            <span>{{ passwordRules.minLength ? '✅' : '❌' }} At least 10 characters</span>
          </li>
          <li :class="passwordRules.hasNumber ? 'text-green-400' : 'text-red-300'">
            <span>{{ passwordRules.hasNumber ? '✅' : '❌' }} Contains at least one number</span>
          </li>
          <li :class="passwordRules.hasUppercase ? 'text-green-400' : 'text-red-300'">
            <span
              >{{ passwordRules.hasUppercase ? '✅' : '❌' }} Contains at least one uppercase
              letter</span
            >
          </li>
          <li :class="passwordRules.hasSpecialChar ? 'text-green-400' : 'text-red-300'">
            <span
              >{{ passwordRules.hasSpecialChar ? '✅' : '❌' }} Contains at least one special
              character</span
            >
          </li>
        </ul>

        <button
          type="submit"
          :disabled="!isValid || isLoading"
          class="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[var(--color-candy)] to-[var(--color-cyan)] cursor-pointer text-white py-2 px-4 mb-3 rounded-xl hover:from-[var(--color-indigo-hover)] hover:to-[var(--color-purple-hover)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span>{{ isLoading ? 'Registering' : 'Register' }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-100">
        Already have an account ?
        <router-link to="/login" class="text-blue-300 hover:underline"> Login </router-link>
      </p>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, ref, inject } from 'vue'
import { useRouter } from 'vue-router'

import { useHead } from '@vueuse/head'
import Cookies from 'js-cookie'

import apiClient from '@/utils/axios'

useHead({
  title: 'Register | ProfileHub',
  meta: [
    {
      name: 'description',
      content: 'Register your account on Profile Hub',
    },
    {
      property: 'og:title',
      content: 'Register | ProfileHub',
    },
    {
      property: 'og:image',
      content: '/images/cover-register.jpg',
    },
  ],
})

const api = import.meta.env.VITE_API_BASE_URL

const toast = inject('toast')
const router = useRouter()

const form = reactive({
  user_id: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const passwordRules = computed(() => ({
  minLength: form.password.length >= 10,
  hasNumber: /[0-9]/.test(form.password),
  hasUppercase: /[A-Z]/.test(form.password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
}))

const isPasswordValid = computed(() => Object.values(passwordRules.value).every(Boolean))

const isValid = computed(() => {
  return form.user_id && form.password && form.confirmPassword && isPasswordValid.value
})

const handleRegister = async () => {
  isLoading.value = true
  try {
    const { data } = await apiClient.post(api + '/api/register', {
      user_id: form.user_id,
      password: form.password,
      confirmPassword: form.confirmPassword,
    })

    Cookies.set('token', data.access_token)
    router.push('/profile')
    toast.message = 'Logged In.'
    toast.type = 'success'
    toast.show = true
  } catch (error) {
    toast.message = 'Your passwords do not match.'
    toast.type = 'error'
    toast.show = true
  } finally {
    isLoading.value = false
  }
}
</script>
