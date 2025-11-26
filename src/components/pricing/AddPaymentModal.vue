<!-- <script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogDescription from '../ui/dialog/DialogDescription.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTitle from '../ui/dialog/DialogTitle.vue'
import DialogTrigger from '../ui/dialog/DialogTrigger.vue'
import Field from '../ui/field/Field.vue'
import FieldGroup from '../ui/field/FieldGroup.vue'
import FieldLabel from '../ui/field/FieldLabel.vue'
import Select from '../ui/select/Select.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectValue from '../ui/select/SelectValue.vue'
import Input from '../ui/input/Input.vue'
import { z } from 'zod/v4'
import { getData } from 'country-list'
import {} from 'card-validator'
import type { AcceptableValue } from 'reka-ui'

// Form state
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const zipCode = ref('')
const selectedCountry = ref('')

// Validation schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number cannot exceed 19 digits')
    .regex(/^\d+$/, 'Card number must contain only digits')
    .refine(
      (val) => {
        // Basic Luhn algorithm check (optional, but good practice)
        // For production, consider a dedicated library for robust card validation.
        let sum = 0
        let double = false
        for (let i = val.length - 1; i >= 0; i--) {
          let digit = parseInt(val.charAt(i), 10)
          if (double) {
            digit *= 2
            if (digit > 9) {
              digit -= 9
            }
          }
          sum += digit
          double = !double
        }
        return sum % 10 === 0
      },
      { message: 'Invalid card number (Luhn check failed)' },
    ),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY)')
    .refine(
      (val) => {
        const [monthStr, yearStr] = val.split('/')
        const month = monthStr ? parseInt(monthStr, 10) : 0
        const year = yearStr ? 2000 + parseInt(yearStr, 10) : 0 // Assuming 20xx
        const today = new Date()
        const currentMonth = today.getMonth() + 1 // getMonth() is 0-indexed
        const currentYear = today.getFullYear()

        if (year < currentYear) {
          return false
        }
        if (year === currentYear && month < currentMonth) {
          return false
        }
        return true
      },
      { message: 'Expiry date must be in the future' },
    ),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  zipCode: z.string().min(1, 'Zip/Postal Code is required'),
  country: z.string().min(1, 'Please select a country'),
})

// Formatted card number
const formattedCardNumber = computed({
  get() {
    return cardNumber.value.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  },
  set(newValue) {
    const digitsOnly = newValue.replace(/\D/g, '')
    cardNumber.value = digitsOnly.substring(0, 19) // Max 19 digits for card numbers
  },
})

// Formatted expiry date
const formattedExpiryDate = computed({
  get() {
    return expiryDate.value.replace(/(\d{2})(?=\d{2})/, '$1/').trim()
  },
  set(newValue) {
    const digitsOnly = newValue.replace(/\D/g, '')
    let formatted = digitsOnly.substring(0, 4) // Max 4 digits (MMYY)
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2)
    }
    expiryDate.value = formatted
  },
})

// Get country list from the library
const countries = ref(getData())

// Error states (for demonstration, a full form library would manage this better)
const errors = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  zipCode: '',
  country: '',
})

// Watchers to clear errors on input change (basic example)
watch(cardNumber, () => {
  errors.value.cardNumber = ''
})
watch(expiryDate, () => {
  errors.value.expiryDate = ''
})
watch(cvv, () => {
  errors.value.cvv = ''
})
watch(zipCode, () => {
  errors.value.zipCode = ''
})
watch(selectedCountry, () => {
  errors.value.country = ''
})

// A helper function to validate a single field on blur/change
const validateField = async (fieldName: keyof typeof errors.value, value: AcceptableValue) => {
  try {
    await paymentSchema.pick({ [fieldName]: true }).parseAsync({ [fieldName]: value })
    errors.value[fieldName] = ''
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value[fieldName] = error.issues[0]?.message || 'Invalid input'
    }
  }
}

// Function to handle form submission and validation
const handleSubmit = async () => {
  try {
    const formData = {
      cardNumber: cardNumber.value,
      expiryDate: expiryDate.value,
      cvv: cvv.value,
      zipCode: zipCode.value,
      country: selectedCountry.value,
    }
    await paymentSchema.parseAsync(formData)
    console.log('Form is valid!', formData)
    // Process payment (e.g., send to payment gateway)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues)
      // Update error messages for each field
      error.issues.forEach((err) => {
        if (err.path[0] && err.path[0] in errors.value) {
          errors.value[err.path[0] as keyof typeof errors.value] = err.message
        }
      })
    } else {
      console.error('An unexpected error occurred:', error)
    }
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Add Payment Method </DialogTitle>
        <DialogDescription>Enter your payment details.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <FieldGroup>
          <Field>
            <FieldLabel>Card Number</FieldLabel>
            <Input
              v-model="formattedCardNumber"
              placeholder="**** **** **** ****"
              maxlength="19"
              inputmode="numeric"
              @blur="validateField('cardNumber', cardNumber)"
            />
            <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-500">
              {{ errors.cardNumber }}
            </p>
          </Field>
          <div class="flex flex-row gap-8 *:flex-1">
            <Field>
              <FieldLabel>Expiry Date</FieldLabel>
              <Input
                v-model="formattedExpiryDate"
                placeholder="MM/YY"
                maxlength="5"
                inputmode="numeric"
                @blur="validateField('expiryDate', expiryDate)"
              />
              <p v-if="errors.expiryDate" class="mt-1 text-sm text-red-500">
                {{ errors.expiryDate }}
              </p>
            </Field>

            <Field>
              <FieldLabel>CVV</FieldLabel>
              <Input
                v-model="cvv"
                type="password"
                placeholder="***"
                maxlength="4"
                inputmode="numeric"
                @blur="validateField('cvv', cvv)"
              />
              <p v-if="errors.cvv" class="mt-1 text-sm text-red-500">{{ errors.cvv }}</p>
            </Field>
          </div>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Select
              v-model="selectedCountry"
              @update:model-value="validateField('country', $event)"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>Select country</SelectItem>
                <SelectItem v-for="country in countries" :key="country.value" :value="country.code">
                  {{ country.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-500">{{ errors.country }}</p>
          </Field>

          <Field>
            <FieldLabel>Zip/Postal Code</FieldLabel>
            <Input
              v-model="zipCode"
              placeholder="eg. 769300"
              @blur="validateField('zipCode', zipCode)"
            />
            <p v-if="errors.zipCode" class="mt-1 text-sm text-red-500">{{ errors.zipCode }}</p>
          </Field>
        </FieldGroup>
        <button type="submit" class="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
          Add Payment Method
        </button>
      </form>
    </DialogContent>
  </Dialog>
</template>
 -->
