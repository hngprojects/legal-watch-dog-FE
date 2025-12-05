import { DefineComponent } from 'vue'

declare module 'vue-sonner' {
  export const toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    (message: string): void
  }

  export const Toaster: DefineComponent
}
