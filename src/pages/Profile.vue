<template>
  <div class="min-h-screen flex flex-col md:flex-row text-white">
    <template v-if="!loading">
      <ProfileSideBar
        :currentTab="currentTab"
        :maritalStatus="form.marital_status"
        @selectTab="(tab) => (currentTab = tab)"
      />
    </template>

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
          <ProfileField label="" v-model="form.avatar" :edit="editMode" type="avatar" />

          <ProfileField
            label="Salutation*"
            v-model="form.salutation"
            :edit="editMode"
            type="select"
            :options="['Mr.', 'Ms.', 'Mrs.']"
            :error="errors.salutation"
          />
          <ProfileField
            label="First Name*"
            v-model="form.first_name"
            :edit="editMode"
            :error="errors.first_name"
          />
          <ProfileField
            label="Last Name*"
            v-model="form.last_name"
            :edit="editMode"
            :error="errors.last_name"
          />
          <ProfileField
            label="Email Address*"
            v-model="form.email"
            :edit="editMode"
            :error="errors.email"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('basic')"
            @submit="submitSection('basic')"
            @cancel="toggleEditMode"
          />
        </div>

        <div v-else-if="currentTab === 'additional'" class="space-y-4">
          <ProfileField
            label="Home Address*"
            v-model="form.home_address"
            :edit="editMode"
            :error="errors.home_address"
          />
          <ProfileField
            label="Country*"
            v-model="form.country"
            :edit="editMode"
            :error="errors.country"
          />
          <ProfileField
            label="Postal Code*"
            v-model="form.postal_code"
            :edit="editMode"
            :error="errors.postal_code"
          />
          <ProfileField
            label="Date of Birth"
            v-model="form.date_of_birth"
            :edit="editMode"
            type="date"
            :error="errors.date_of_birth"
          />
          <ProfileField
            label="Gender"
            v-model="form.gender"
            :edit="editMode"
            type="select"
            :options="['Male', 'Female']"
          />
          <ProfileField
            label="Marital Status"
            v-model="form.marital_status"
            :edit="editMode"
            type="select"
            :options="['Single', 'Married']"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('additional')"
            @submit="submitSection('additional')"
            @cancel="editMode = false"
          />
        </div>

        <div
          v-else-if="currentTab === 'spouse'"
          v-if="form.marital_status === 'Married'"
          class="space-y-4"
        >
          <ProfileField
            label="Salutation"
            v-model="form.spouse_salutation"
            :edit="editMode"
            type="select"
            :options="['Mr.', 'Ms.', 'Mrs.']"
            :error="errors.spouse_salutation"
          />
          <ProfileField label="First Name" v-model="form.spouse_first_name" :edit="editMode" />
          <ProfileField label="Last Name" v-model="form.spouse_last_name" :edit="editMode" />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('spouse')"
            @submit="submitSection('spouse')"
            @cancel="editMode = false"
          />
        </div>

        <div v-else-if="currentTab === 'preference'" class="space-y-4">
          <ProfileField label="Hobbies & Interests" v-model="form.hobbies" :edit="editMode" />
          <ProfileField label="Favorite Sports" v-model="form.favorite_sports" :edit="editMode" />
          <ProfileField
            label="Preferred Music Genre(s)"
            v-model="form.preferred_music_genres"
            :edit="editMode"
          />
          <ProfileField
            label="Preferred Movie/TV Show(s)"
            v-model="form.preferred_movies_tv"
            :edit="editMode"
          />
          <ProfileActionButtons
            :editMode="editMode"
            :disabled="!isSectionValid('preference')"
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
import axios from 'axios'
import ProfileField from '@/components/ProfileField.vue'
import ProfileActionButtons from '@/components/ProfileActionButtons.vue'
import ProfileSideBar from '@/components/ProfileSideBar.vue'
import { useRoute, useRouter } from 'vue-router'

const toast = inject('toast')
const route = useRoute()
const router = useRouter()
const editMode = ref(false)

const currentTab = ref('basic')
const loading = ref(true)

const form = ref({
  salutation: '',
  first_name: '',
  last_name: '',
  avatar: '',
  email: '',
  home_address: '',
  country: '',
  postal_code: '',
  date_of_birth: '',
  gender: '',
  marital_status: '',
  spouse_salutation: '',
  spouse_first_name: '',
  spouse_last_name: '',
  hobbies: '',
  favorite_sports: '',
  preferred_music_genres: '',
  preferred_movies_tv: '',
})

const errors = ref({})

const isSectionValid = (section) => {
  const requiredFields = {
    basic: ['salutation', 'first_name', 'last_name', 'email'],
    additional: ['home_address', 'country', 'postal_code', 'date_of_birth'],
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
  first_name: { label: 'First Name', type: 'text' },
  last_name: { label: 'Last Name', type: 'text' },
  email: { label: 'Email Address', type: 'text' },
  home_address: { label: 'Home Address', type: 'text' },
  country: { label: 'Country', type: 'select' },
  postal_code: { label: 'Postal Code', type: 'text' },
  date_of_birth: { label: 'Date of Birth', type: 'date' },
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
  const token = localStorage.getItem('token')
  if (!token) return alert('No token found.')

  let payload = {}

  if (section === 'basic') {
    const required = ['salutation', 'first_name', 'last_name', 'email']
    required.forEach((field) => {
      if (!form.value[field]) errors.value[field] = getValidationMessage(field)
    })
    if (Object.keys(errors.value).length) return

    payload = {
      salutation: form.value.salutation,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      avatar: form.value.avatar,
    }
  } else if (section === 'additional') {
    const required = ['home_address', 'country', 'postal_code', 'date_of_birth']
    required.forEach((field) => {
      if (!form.value[field]) {
        errors.value[field] = getValidationMessage(field)
      }
    })

    const dob = new Date(form.value.date_of_birth)
    const ageDiff = new Date().getFullYear() - dob.getFullYear()
    const isBeforeBirthday =
      new Date().getMonth() < dob.getMonth() ||
      (new Date().getMonth() === dob.getMonth() && new Date().getDate() < dob.getDate())

    const actualAge = ageDiff - (isBeforeBirthday ? 1 : 0)
    if (form.value.date_of_birth && actualAge < 17) {
      errors.value.date_of_birth = 'You must be at least 17 years old.'
    }

    if (Object.keys(errors.value).length) return

    payload = {
      home_address: form.value.home_address,
      country: form.value.country,
      postal_code: form.value.postal_code,
      date_of_birth: form.value.date_of_birth,
      gender: form.value.gender,
      marital_status: form.value.marital_status,
    }
  } else if (section === 'spouse') {
    payload = {
      spouse_salutation: form.value.spouse_salutation,
      spouse_first_name: form.value.spouse_first_name,
      spouse_last_name: form.value.spouse_last_name,
    }
  } else if (section === 'preference') {
    payload = {
      hobbies: form.value.hobbies,
      favorite_sports: form.value.favorite_sports,
      preferred_music_genres: form.value.preferred_music_genres,
      preferred_movies_tv: form.value.preferred_movies_tv,
    }
  }

  try {
    await axios.patch(import.meta.env.VITE_API_BASE_URL + '/api/me/update', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    toast.message = 'Info updated successfully!'
    toast.type = 'success'
    toast.show = true
  } catch (error) {
    toast.message = 'Failed to update section.'
    toast.type = 'error'
    toast.show = true
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    editMode.value = route.query.edit === 'true'

    const { data } = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    Object.assign(form.value, data.user)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  } finally {
    loading.value = false
  }
})
</script>
