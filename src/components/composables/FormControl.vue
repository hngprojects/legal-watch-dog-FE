<script setup lang="ts">
import { computed } from 'vue'

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'checkbox'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | boolean
    label?: string
    hint?: string
    error?: string
    type?: InputType
    placeholder?: string
    id?: string
    name?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    hint: '',
    error: '',
    id: '',
    name: '',
    disabled: false,
    required: false,
    autocomplete: 'off',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | boolean): void
  (event: 'blur', value: FocusEvent): void
  (event: 'focus', value: FocusEvent): void
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)
const isCheckbox = computed(() => props.type === 'checkbox')

const stateClasses = computed(() => {
  if (props.disabled) {
    return 'border-[#E6E0D6] bg-gray-50 text-gray-400 cursor-not-allowed'
  }

  if (props.error) {
    return [
      'border-red-400 bg-white',
      'focus:border-red-500 focus:ring-2 focus:ring-red-100',
      'hover:border-red-500',
    ].join(' ')
  }

  return [
    'border-[#D8C6B5] bg-white/80',
    'hover:border-[#b08f6e]',
    'focus:border-[#3C2610]',
    'focus:ring-2 focus:ring-[#F4E4D4]',
  ].join(' ')
})

const checkboxClasses = computed(() => {
  if (props.disabled) {
    return 'border-[#E6E0D6] bg-gray-50 text-gray-400 cursor-not-allowed'
  }
  if (props.error) {
    return 'border-red-400 text-red-600 focus:ring-red-100 focus:border-red-500'
  }
  return 'border-[#D8C6B5] hover:border-[#b08f6e] focus:border-[#3C2610] focus:ring-[#F4E4D4]'
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = isCheckbox.value ? target.checked : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => emit('blur', event)
const handleFocus = (event: FocusEvent) => emit('focus', event)
</script>

<template>
  <label
    v-if="isCheckbox"
    class="flex items-center gap-3 text-sm font-medium text-gray-800"
    :for="inputId"
  >
    <input
      :id="inputId"
      :name="name || inputId"
      type="checkbox"
      :checked="Boolean(modelValue)"
      :disabled="disabled"
      :required="required"
      class="text-accent-subtle h-4 w-4 rounded border bg-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed"
      :class="checkboxClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <div class="space-y-1 leading-tight">
      <div class="flex items-center gap-2">
        <slot name="label">
          <span>{{ label }}</span>
        </slot>
        <span v-if="required" class="text-destructive text-xs font-semibold">*</span>
      </div>
      <p v-if="error" class="text-destructive text-xs font-medium">{{ error }}</p>
      <p v-else-if="hint" class="text-xs text-gray-500">
        <slot name="hint">{{ hint }}</slot>
      </p>
    </div>
  </label>

  <label v-else class="block space-y-2" :for="inputId">
    <div class="flex items-center gap-1 text-sm font-medium text-gray-800">
      <slot name="label">
        <span>{{ label }}</span>
      </slot>
      <span v-if="required" class="text-destructive text-xs font-semibold">*</span>
    </div>

    <div
      class="outline-accent-main flex items-center gap-3 rounded-sm text-sm outline transition hover:outline-2"
      :class="stateClasses"
    >
      <slot name="leading" />
      <input
        :id="inputId"
        :name="name || inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        class="w-full bg-transparent px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <slot name="trailing" class="pe-4" />
    </div>

    <p v-if="error" class="text-xs font-medium text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500">
      <slot name="hint">{{ hint }}</slot>
    </p>
  </label>
</template>
