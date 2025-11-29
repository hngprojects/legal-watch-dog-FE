/// <reference types="vite/client" />
/// <reference types="lucide-vue-next" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_MICROSOFT_REDIRECT_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
