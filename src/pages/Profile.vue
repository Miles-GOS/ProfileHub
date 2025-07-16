<template>
  <div class="min-h-screen flex flex-col md:flex-row text-white">
    <div>
      <ProfileSideBar
        :currentTab="currentTab"
        :maritalStatus="form.maritalStatus"
        @selectTab="(tab) => (currentTab = tab)"
      />
    </div>

    <main class="flex-1 overflow-y-auto p-5 xs:p-10 xl:p-20 xs:pr-10 md:!pr-0">
      <div class="flex items-center text-xl xs:text-2xl md:text-4xl">
        <div class="whitespace-nowrap">
          {{ editMode ? 'Edit' : 'My' }} <span class="font-bold">Profile</span>
        </div>
        <div class="flex-1 border-t border-2 border-white mx-4"></div>
        <button
          class="whitespace-nowrap cursor-pointer underline text-white font-bold px-4 py-2 text-md xs:text-xl md:text-2xl rounded transition"
          @click="toggleEditMode"
        >
          {{ editMode ? 'Go Back To My profile' : 'Edit Profile' }}
        </button>
      </div>

      <section class="mx-auto space-y-6 mt-10">
        <div v-if="currentTab === 'basic'" class="space-y-4 relative">
          <ProfileField
            label=""
            v-model="form.avatar"
            :edit="editMode && !isSubmitting"
            type="avatar"
          />

          <ProfileField
            label="Salutation*"
            v-model="form.salutation"
            :edit="editMode && !isSubmitting"
            type="select"
            :options="['Mr.', 'Ms.', 'Mrs.']"
            :error="errors.salutation"
          />
          <ProfileField
            label="First Name*"
            v-model="form.firstName"
            :edit="editMode && !isSubmitting"
            :error="errors.firstName"
          />
          <ProfileField
            label="Last Name*"
            v-model="form.lastName"
            :edit="editMode && !isSubmitting"
            :error="errors.lastName"
          />
          <ProfileField
            label="Email Address*"
            v-model="form.email"
            :edit="editMode && !isSubmitting"
            :error="errors.email"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('basic') || isSubmitting"
            :loading="isSubmitting"
            @submit="submitSection('basic')"
            @cancel="toggleEditMode"
          />
        </div>

        <div v-else-if="currentTab === 'additional'" class="space-y-4">
          <ProfileField
            label="Home Address*"
            v-model="form.homeAddress"
            :edit="editMode && !isSubmitting"
            :error="errors.homeAddress"
          />
          <ProfileField
            label="Country*"
            v-model="form.country"
            :edit="editMode && !isSubmitting"
            :error="errors.country"
          />
          <ProfileField
            label="Postal Code*"
            v-model="form.postalCode"
            :edit="editMode && !isSubmitting"
            :error="errors.postalCode"
          />
          <ProfileField
            label="Date of Birth"
            v-model="form.dateOfBirth"
            :edit="editMode && !isSubmitting"
            type="date"
            :error="errors.dateOfBirth"
          />
          <ProfileField
            label="Gender"
            v-model="form.gender"
            :edit="editMode && !isSubmitting"
            type="select"
            :options="['Male', 'Female']"
          />
          <ProfileField
            label="Marital Status"
            v-model="form.maritalStatus"
            :edit="editMode && !isSubmitting"
            type="select"
            :options="['Single', 'Married']"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('additional') || isSubmitting"
            :loading="isSubmitting"
            @submit="submitSection('additional')"
            @cancel="editMode = false"
          />
        </div>

        <div
          v-else-if="currentTab === 'spouse'"
          v-if="form.maritalStatus === 'Married'"
          class="space-y-4"
        >
          <ProfileField
            label="Salutation"
            v-model="form.spouseSalutation"
            :edit="editMode && !isSubmitting"
            type="select"
            :options="['Mr.', 'Ms.', 'Mrs.']"
            :error="errors.spouseSalutation"
          />
          <ProfileField
            label="First Name"
            v-model="form.spouseFirstName"
            :edit="editMode && !isSubmitting"
          />
          <ProfileField
            label="Last Name"
            v-model="form.spouseLastName"
            :edit="editMode && !isSubmitting"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('spouse') || isSubmitting"
            :loading="isSubmitting"
            @submit="submitSection('spouse')"
            @cancel="editMode = false"
          />
        </div>

        <div v-else-if="currentTab === 'preference'" class="space-y-4">
          <ProfileField
            label="Hobbies & Interests"
            v-model="form.hobbies"
            :edit="editMode && !isSubmitting"
          />
          <ProfileField
            label="Favorite Sports"
            v-model="form.favoriteSports"
            :edit="editMode && !isSubmitting"
          />
          <ProfileField
            label="Preferred Music Genre(s)"
            v-model="form.preferredMusicGenres"
            :edit="editMode && !isSubmitting"
          />
          <ProfileField
            label="Preferred Movie/TV Show(s)"
            v-model="form.preferredMoviesTv"
            :edit="editMode && !isSubmitting"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('preference') || isSubmitting"
            :loading="isSubmitting"
            @submit="submitSection('preference')"
            @cancel="editMode = false"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useHead } from '@vueuse/head'

import apiClient from '@/utils/axios'
import ProfileField from '@/components/ProfileField.vue'
import ProfileActionButtons from '@/components/ProfileActionButtons.vue'
import ProfileSideBar from '@/components/ProfileSideBar.vue'

useHead({
  title: 'Profile | ProfileHub',
  meta: [
    {
      name: 'description',
      content: 'Check your profile on Profile Hub',
    },
    {
      property: 'og:title',
      content: 'Profile | ProfileHub',
    },
    {
      property: 'og:image',
      content: '/images/cover-profile.jpg',
    },
  ],
})

const toast = inject('toast')
const route = useRoute()
const router = useRouter()
const editMode = ref(false)

const currentTab = ref('basic')
const loading = ref(true)
const isSubmitting = ref(false)

const form = ref({
  salutation: '',
  firstName: '',
  lastName: '',
  avatar: '',
  email: '',
  homeAddress: '',
  country: '',
  postalCode: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  spouseSalutation: '',
  spouseFirstName: '',
  spouseLastName: '',
  hobbies: '',
  favoriteSports: '',
  preferredMusicGenres: '',
  preferredMoviesTv: '',
})

const errors = ref({})

const isSectionValid = (section) => {
  const requiredFields = {
    basic: ['salutation', 'firstName', 'lastName', 'email'],
    additional: ['homeAddress', 'country', 'postalCode', 'dateOfBirth'],
  }

  const required = requiredFields[section]
  if (!required) return true

  return required.every((field) => form.value[field]?.toString().trim())
}

const toggleEditMode = () => {
  editMode.value = !editMode.value

  router.replace({
    query: {
      ...route.query,
      edit: editMode.value ? 'true' : undefined,
    },
  })
}

const fieldMeta = {
  salutation: { label: 'Salutation', type: 'select' },
  firstName: { label: 'First Name', type: 'text' },
  lastName: { label: 'Last Name', type: 'text' },
  email: { label: 'Email Address', type: 'text' },
  homeAddress: { label: 'Home Address', type: 'text' },
  country: { label: 'Country', type: 'select' },
  postalCode: { label: 'Postal Code', type: 'text' },
  dateOfBirth: { label: 'Date of Birth', type: 'date' },
}

const getValidationMessage = (fieldKey) => {
  const meta = fieldMeta[fieldKey] || { label: fieldKey, type: 'text' }
  if (meta.type === 'select' || meta.type === 'date') {
    return `Please select your ${meta.label}`
  }
  return `Please fill your ${meta.label}`
}

const submitSection = async (section) => {
  errors.value = {}
  const token = Cookies.get('token')
  if (!token) return alert('No token found.')

  let payload = {}
  isSubmitting.value = true
  if (section === 'basic') {
    const required = ['salutation', 'firstName', 'lastName', 'email']
    required.forEach((field) => {
      if (!form.value[field]) errors.value[field] = getValidationMessage(field)
    })

    if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Email format is invalid'
    }

    if (Object.keys(errors.value).length) {
      isSubmitting.value = false
      return
    }

    payload = {
      salutation: form.value.salutation,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      avatar: form.value.avatar,
    }
  } else if (section === 'additional') {
    const required = ['homeAddress', 'country', 'postalCode', 'dateOfBirth']
    required.forEach((field) => {
      if (!form.value[field]) {
        errors.value[field] = getValidationMessage(field)
      }
    })

    const dob = new Date(form.value.dateOfBirth)
    const ageDiff = new Date().getFullYear() - dob.getFullYear()
    const isBeforeBirthday =
      new Date().getMonth() < dob.getMonth() ||
      (new Date().getMonth() === dob.getMonth() && new Date().getDate() < dob.getDate())

    const actualAge = ageDiff - (isBeforeBirthday ? 1 : 0)
    if (form.value.dateOfBirth && actualAge < 17) {
      errors.value.dateOfBirth = 'You must be at least 17 years old.'
    }

    if (Object.keys(errors.value).length) return

    payload = {
      homeAddress: form.value.homeAddress,
      country: form.value.country,
      postalCode: form.value.postalCode,
      dateOfBirth: form.value.dateOfBirth,
      gender: form.value.gender,
      maritalStatus: form.value.maritalStatus,
    }
  } else if (section === 'spouse') {
    payload = {
      spouseSalutation: form.value.spouseSalutation,
      spouseFirstName: form.value.spouseFirstName,
      spouseLastName: form.value.spouseLastName,
    }
  } else if (section === 'preference') {
    payload = {
      hobbies: form.value.hobbies,
      favoriteSports: form.value.favoriteSports,
      preferredMusicGenres: form.value.preferredMusicGenres,
      preferredMoviesTv: form.value.preferredMoviesTv,
    }
  }

  try {
    await apiClient.patch(import.meta.env.VITE_API_BASE_URL + '/api/me/update', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    toast.message = 'Info updated successfully!'
    toast.type = 'success'
    toast.show = true
  } catch (error) {
    toast.message = 'Failed to update section.'
    toast.type = 'error'
    toast.show = true
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const token = Cookies.get('token')
    if (!token) return
    editMode.value = route.query.edit === 'true'

    const { data } = await apiClient.get(import.meta.env.VITE_API_BASE_URL + '/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    Object.assign(form.value, data.user)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    Cookies.remove('token')
  } finally {
    loading.value = false
  }
})
</script>
