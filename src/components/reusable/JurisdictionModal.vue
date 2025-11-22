<script setup lang="ts">
import { ref, watch } from "vue";
import type { JurisdictionForm } from "@/types/jurisdiction";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", data: JurisdictionForm): void;
}>();

const localForm = ref<JurisdictionForm>({
  name: "",
  description: "",
  subJurisdictions: [],
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      localForm.value = { name: "", description: "", subJurisdictions: [] };
    }
  }
);

const close = () => emit("update:modelValue", false);
const submit = () => {
  emit("submit", { ...localForm.value });
  close();
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      @click="close"
    >
      <div
        class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <svg class="h-6 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Define your Jurisdiction</h2>
          <p class="text-gray-600">Define a specific legal domain or region to monitor</p>
        </div>

        <div class="space-y-8">
          <!-- Jurisdiction Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Jurisdiction Name</label>
            <input
              v-model="localForm.name"
              type="text"
              placeholder="e.g. Global Visa Monitoring"
              class="w-full rounded-xl border border-gray-300 px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C2610]/20 focus:border-[#3C2610] transition"
            />
            <p class="mt-2 text-sm text-gray-500">Give your jurisdiction a descriptive name</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Instruction/Description</label>
            <textarea
              v-model="localForm.description"
              rows="4"
              placeholder="What legal areas will you monitor?"
              class="w-full rounded-xl border border-gray-300 px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C2610]/20 focus:border-[#3C2610] resize-none transition"
            ></textarea>
          </div>   
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end gap-4">
          <button
            @click="close"
            class="px-8 py-3 rounded-xl border border-[#3C2610] text-gray-700 font-medium hover:bg-orange-50 transition"
          >
            cancel
          </button>
          <button
            @click="submit"
            class="px-10 py-3 rounded-xl bg-[#3C2610] text-white font-semibold hover:bg-[#2e1d0b] transition shadow-sm"
          >
            Create Jurisdiction
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in-95 {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.fade-in { animation: fade-in 0.2s ease-out; }
.zoom-in-95 { animation: zoom-in-95 0.2s ease-out; }
</style>