<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import EmailIcon from '@/assets/icons/message.png'
import OfficeIcon from '@/assets/icons/officechair.png'
import PhoneIcon from '@/assets/icons/call.png'
import AlertIcon from '@/assets/icons/alert.png'
import type { ContactUsApiPayload } from '@/types/contact-us'
import { submitContactForm } from '@/api/contact-us'
import { toast } from 'vue-sonner'

interface ContactUsPayload {
  fullName: string
  phoneNumber: string
  email: string
  message: string
  agreement: boolean
}

const form = reactive<ContactUsPayload>({
  fullName: '',
  phoneNumber: '',
  email: '',
  message: '',
  agreement: false,
})

const errors = reactive({
  fullName: '',
  phoneNumber: '',
  email: '',
  message: '',
  agreement: '',
})

const isSubmitting = ref(false)
const characterCount = ref(0)
const maxCharacters = 800

const updateCharacterCount = () => {
  characterCount.value = form.message.length
}

const validateForm = () => {
  let isValid = true

  errors.fullName = ''
  errors.phoneNumber = ''
  errors.email = ''
  errors.message = ''
  errors.agreement = ''

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required'
    isValid = false
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required'
    isValid = false
  } else if (!/^[0-9\s\-\+\(\)]+$/.test(form.phoneNumber)) {
    errors.phoneNumber = 'Phone number can only contain numbers and special characters'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  }

  if (!form.agreement) {
    errors.agreement = 'You must agree to the terms'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const payload: ContactUsApiPayload = {
      full_name: form.fullName,
      phone_number: form.phoneNumber,
      email: form.email,
      message: form.message,
    }

    const response = await submitContactForm(payload)

    // Reset form on success
    form.fullName = ''
    form.phoneNumber = ''
    form.email = ''
    form.message = ''
    form.agreement = false
    characterCount.value = 0

    toast.success(response.data?.message ?? 'Your message has been sent successfully.')
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string; errors?: { [key: string]: string[] } } }
      message?: string
    }

    const msgs: string[] = []

    if (axiosError.message) msgs.push(axiosError.message)

    if (axiosError.response?.data?.errors?.phone_number) {
      msgs.push(...axiosError.response.data.errors.phone_number)
    }

    if (axiosError.response?.data?.errors?.email) {
      msgs.push(...axiosError.response.data.errors.email)
    }

    if (axiosError.response?.data?.errors?.message) {
      msgs.push(
        ...axiosError.response.data.errors.message.map((err) => err.replace(/string/gi, 'Message')),
      )
    }

    const finalMessage =
      msgs.length > 0
        ? msgs.join('\n')
        : 'An error occurred while submitting the form. Please try again later.'

    toast.error(finalMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="app-container min-h-screen py-8 sm:py-12 lg:py-16">
    <div class="mx-auto">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <!-- Left Column - Contact Info -->
        <div class="flex flex-col">
          <h1 class="mb-4 text-3xl font-bold text-[#1F1F1F] sm:text-4xl lg:text-[48px]">
            Contact Us
          </h1>

          <p class="mb-8 max-w-md text-sm leading-relaxed text-[#6B7280] sm:mb-10 sm:text-base lg:mb-12">
            Have any enquiry? you have come to the right place. Get in touch with us through the
            form and we will get back to you as soon as possible
          </p>

          <!-- Contact Info Items -->
          <div class="flex flex-col gap-5 sm:gap-6">
            <!-- Email -->
            <div class="flex items-start gap-3 sm:items-center sm:gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                style="background: #f1a75f">
                <img :src="EmailIcon" alt="Email" class="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div class="flex flex-col justify-center">
                <p class="mt-3 text-sm font-medium text-[#1F1F1F] sm:text-base lg:mt-0">
                  contact@legalwatch.dog
                </p>
              </div>
            </div>

            <!-- Office Address -->
            <div class="flex items-start gap-3 sm:items-center sm:gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                style="background: #f1a75f">
                <img :src="OfficeIcon" alt="Office" class="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div class="flex flex-col justify-center">
                <p class="mt-3 text-sm font-medium text-[#1F1F1F] sm:text-base lg:mt-0">
                  2972 Westheimer Rd. Santa Ana,<br />Illinois 85486
                </p>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start gap-3 sm:items-center sm:gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                style="background: #f1a75f">
                <img :src="PhoneIcon" alt="Phone" class="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div class="flex flex-col justify-center">
                <p class="mt-3 text-sm font-medium text-[#1F1F1F] sm:text-base lg:mt-0">
                  +44 123 654 7890
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Form -->
        <div class="flex flex-col">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5 sm:gap-6">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Full Name
              </label>
              <Input id="fullName" v-model="form.fullName" type="text" placeholder="John Doe"
                class="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-base text-[#1F1F1F] placeholder-[#9CA3AF] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 sm:h-[52px]" />
              <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Phone Number
              </label>
              <div class="relative">
                <Input id="phoneNumber" v-model="form.phoneNumber" type="tel" placeholder="+15550000000"
                  class="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-base text-[#1F1F1F] placeholder-[#9CA3AF] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 sm:h-[52px]" />
              </div>
              <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">
                {{ errors.phoneNumber }}
              </p>
            </div>

            <!-- Company's Email Address -->
            <div>
              <label for="email" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Company's Email Address
              </label>
              <Input id="email" v-model="form.email" type="email" placeholder="olivia@untitledui.com"
                class="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-base text-[#1F1F1F] placeholder-[#9CA3AF] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 sm:h-[52px]" />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Message
              </label>
              <textarea id="message" v-model="form.message" @input="updateCharacterCount" :maxlength="maxCharacters"
                rows="5" placeholder="Add message"
                class="sm:rows-6 w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#1F1F1F] placeholder-[#9CA3AF] transition-all outline-none focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"></textarea>
              <div class="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                <div class="order-2 sm:order-1">
                  <p v-if="errors.message" class="text-sm text-red-600">
                    {{ errors.message }}
                  </p>
                </div>
                <p class="order-1 text-sm text-[#6B7280] sm:order-2">
                  {{ characterCount }}/{{ maxCharacters }} characters
                </p>
              </div>
            </div>

            <!-- Agreement Section -->
            <div class="rounded-lg p-3 sm:p-4" style="background: #fffaeb">
              <div class="flex items-start gap-3">
                <div class="flex h-5 w-5 shrink-0 items-center justify-center">
                  <img :src="AlertIcon" alt="Alert" class="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 text-sm font-semibold text-[#1F1F1F]">Agreement</h4>
                  <div class="flex items-start gap-2">
                    <input id="agreement" v-model="form.agreement" type="checkbox"
                      class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#D1D5DB] text-[#401903] focus:ring-2 focus:ring-[#401903]/20" />
                    <label for="agreement" class="cursor-pointer text-xs leading-relaxed text-[#6B7280] sm:text-sm">
                      By completing and submitting this form, I agree to have this website store my
                      submitted information so they can respond to my inquiry or send occasional
                      updates. For information on how to unsubscribe, as well as our privacy
                      practices and commitment to protecting your privacy, please refer to our
                      <RouterLink to="/privacy-policy" class="font-medium text-[#401903] underline">
                        privacy policy
                      </RouterLink>
                      .
                    </label>
                  </div>
                  <p v-if="errors.agreement" class="mt-2 text-sm text-red-600">
                    {{ errors.agreement }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <Button type="submit" @click="handleSubmit" :disabled="isSubmitting"
              class="btn--default btn--lg btn--full text-center">
              <span v-if="!isSubmitting">Submit</span>
              <span v-else>Submitting...</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Stack character count below error message on mobile */
  .sm\:flex-row {
    flex-direction: column;
  }

  .sm\:order-1 {
    order: 2;
  }

  .sm\:order-2 {
    order: 1;
  }
}

/* Improve textarea on mobile */
textarea {
  min-height: 120px;
}

@media (min-width: 640px) {
  textarea {
    min-height: 150px;
  }
}

/* Ensure icons maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
}

/* Prevent form from being too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}

/* Improve touch targets for mobile */
@media (max-width: 768px) {

  label,
  input,
  button,
  textarea {
    font-size: 16px !important;
    /* Prevents iOS zoom on focus */
  }

  input,
  textarea {
    min-height: 44px;
    /* Better touch target */
  }

  .h-\[48px\] {
    height: 44px;
  }
}
</style>
