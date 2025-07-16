<template>
  <div class="min-h-screen bg-gradient-to-br text-white">
    <main class="flex flex-col items-center text-center px-6 md:px-16 py-20">
      <h2 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
        Your Digital Identity<br />
        <span class="text-[var(--color-heliotrope)]">Secure. Smart. Seamless.</span>
      </h2>
      <p class="max-w-2xl text-lg md:text-xl text-white/80 mb-10">
        Profile Hub helps you manage your digital profile effortlessly. Secure login, smart updates,
        and a sleek dashboard – all in one place.
      </p>
      <div class="flex flex-col md:flex-row gap-4">
        <a
          href="/profile"
          class="bg-gradient-to-r !text-white from-[var(--color-heliotrope)] to-[var(--color-cyan)] !px-6 !py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
        >
          Profile
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Welcome to Profile Hub',
  meta: [
    {
      name: 'description',
      content: 'Manage your digital identity securely and seamlessly with Profile Hub.',
    },
    { property: 'og:title', content: 'Profile Hub' },
    { property: 'og:description', content: 'Your all-in-one solution for digital profiles.' },
    { property: 'og:image', content: '/images/cover-home.jpg' },
  ],
})
</script>
