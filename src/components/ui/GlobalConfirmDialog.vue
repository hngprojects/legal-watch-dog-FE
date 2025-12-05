<script setup lang="ts">
import { useConfirmDialog } from "@/composables/useConfirmDialog"

const dialog = useConfirmDialog()

const handleConfirm = async () => {
  if (dialog.state.options.onConfirm) {
    await dialog.state.options.onConfirm()
  }
  dialog.close()
}

const handleCancel = () => {
  dialog.state.options.onCancel?.()
  dialog.close()
}
</script>

<template>
  <div
    v-if="dialog.state.open"
    class="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
  >
    <div class="w-[90%] max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h2 class="text-lg font-bold text-gray-900">
        {{ dialog.state.options.title || "Confirm Action" }}
      </h2>

      <p class="mt-2 text-sm text-gray-600">
        {{ dialog.state.options.description || "Are you sure you want to continue?" }}
      </p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="handleCancel"
          class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {{ dialog.state.options.cancelText || "Cancel" }}
        </button>

        <button
          @click="handleConfirm"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          {{ dialog.state.options.confirmText || "Confirm" }}
        </button>
      </div>
    </div>
  </div>
</template>
