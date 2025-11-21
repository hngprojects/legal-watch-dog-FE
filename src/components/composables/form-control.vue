<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Input from '../ui/input/Input.vue'
import Label from '../ui/label/Label.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    modelValue?: string | number
    placeholder?: string
    type?: string
    name?: string
    required?: boolean
    autocomplete?: string
    rootClass?: string
    inputClass?: string
  }>(),
  {
    placeholder: '',
    type: 'text',
    required: false,
    rootClass: '',
    inputClass: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const attrs = useAttrs()

const model = computed({
  get: () => props.modelValue ?? '',
  set: value => emit('update:modelValue', value),
})

const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  void _class
  return rest
})
</script>

<template>
  <div :class="['flex w-full flex-col gap-2', rootClass, attrs.class]">
    <Label v-if="label" :for="id" class="text-left text-sm font-medium">{{ label }}</Label>
    <Input
      v-model="model"
      :id="id"
      :name="name || id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :class="['text-base', inputClass]"
      v-bind="inputAttrs"
    />
  </div>
</template>
