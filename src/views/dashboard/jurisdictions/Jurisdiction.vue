<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings, FileText, FileQuestion, ArrowLeftIcon } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import SourceView from '@/views/dashboard/sources/Source.vue'
import type { Jurisdiction } from '@/api/jurisdiction'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'

interface NestedJurisdiction extends Jurisdiction {
  depth: number
}

const route = useRoute()
const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const projectStore = useProjectStore()
const jurisdictionId = computed(() => route.params.id as string)

const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)
const activeTab = ref<'analysis' | 'sources'>('analysis')
const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)
const subJurisdictionModalOpen = ref(false)

const editForm = ref({ name: '', description: '', prompt: '' })
const subJurisdictionForm = ref({ name: '', description: '', prompt: '' })

const subJurisdictions = computed<NestedJurisdiction[]>(() => {
  if (!jurisdiction.value) return []
  const walk = (parentId: string, depth = 0): NestedJurisdiction[] =>
    jurisdictionStore.jurisdictions
      .filter((item) => item.parent_id === parentId)
      .flatMap((child) => [{ ...child, depth }, ...walk(child.id, depth + 1)])
  return walk(jurisdiction.value.id, 0)
})

const projectName = computed(() => {
  if (!jurisdiction.value?.project_id) return ''
  const project = projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id)
  return project?.title || 'Project'
})

const parentJurisdiction = computed(() => {
  if (!jurisdiction.value?.parent_id) return null
  return (
    jurisdictionStore.jurisdictions.find((item) => item.id === jurisdiction.value?.parent_id) ||
    null
  )
})

const loadJurisdiction = async (id: string) => {
  loading.value = true
  jurisdictionStore.setError(null)
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id)
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length) await projectStore.fetchProjects()
  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id)
  }
  loading.value = false
}

const goBack = () => {
  if (jurisdiction.value?.parent_id) {
    router.push(`/dashboard/jurisdictions/${jurisdiction.value.parent_id}`)
  } else if (jurisdiction.value?.project_id) {
    router.push(`/dashboard/projects/${jurisdiction.value.project_id}`)
  } else {
    router.push('/dashboard/projects')
  }
}

const toggleSettingsMenu = () => (showSettingsMenu.value = !showSettingsMenu.value)
const closeSettingsMenu = () => (showSettingsMenu.value = false)

const startEdit = () => {
  editForm.value = {
    name: jurisdiction.value?.name || '',
    description: jurisdiction.value?.description || '',
    prompt: jurisdiction.value?.prompt || '',
  }
  showInlineEdit.value = true
  closeSettingsMenu()
}

const saveEdit = async () => {
  try {
    const response = await jurisdictionStore.updateJurisdiction(
      jurisdictionId.value,
      editForm.value,
    )
    if (response) jurisdiction.value = response

    await Swal.fire({
      title: 'Updated!',
      text: 'Jurisdiction updated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
    showInlineEdit.value = false
  } catch {
    Swal.fire('Error', jurisdictionStore.error || 'Failed to update jurisdiction', 'error')
  }
}

const deleteJurisdiction = async () => {
  closeSettingsMenu()
  const confirm = await Swal.fire({
    title: 'Delete Jurisdiction?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })

  if (!confirm.isConfirmed) return

  const projectId = jurisdiction.value?.project_id
  const parentId = jurisdiction.value?.parent_id

  await jurisdictionStore.deleteJurisdiction(jurisdictionId.value)
  await Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false })

  if (parentId) router.push(`/dashboard/jurisdictions/${parentId}`)
  else if (projectId) router.push(`/dashboard/projects/${projectId}`)
  else router.push('/dashboard/projects')
}

const openSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = true
  subJurisdictionForm.value = { name: '', description: '', prompt: '' }
  jurisdictionStore.setError(null)
}

const closeSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = false
  subJurisdictionForm.value = { name: '', description: '', prompt: '' }
  jurisdictionStore.setError(null)
}

const createSubJurisdiction = async () => {
  if (!jurisdiction.value) return
  jurisdictionStore.setError(null)

  if (!subJurisdictionForm.value.name.trim()) {
    jurisdictionStore.setError('Sub-jurisdiction name is required')
    return
  }
  if (!subJurisdictionForm.value.description.trim()) {
    jurisdictionStore.setError('Description is required')
    return
  }

  const created = await jurisdictionStore.addJurisdiction(jurisdiction.value.project_id, {
    ...subJurisdictionForm.value,
    name: subJurisdictionForm.value.name.trim(),
    description: subJurisdictionForm.value.description.trim(),
    prompt: subJurisdictionForm.value.prompt.trim() || null,
    parent_id: jurisdiction.value.id,
  })

  if (created) closeSubJurisdictionModal()
}

const goToJurisdiction = (id: string) => router.push(`/dashboard/jurisdictions/${id}`)

onMounted(() => loadJurisdiction(jurisdictionId.value))

watch(jurisdictionId, (newId) => newId && loadJurisdiction(newId))
watch(
  () => jurisdictionStore.jurisdictions,
  (newJurisdictions) => {
    const found = newJurisdictions.find((j) => j.id === jurisdictionId.value)
    if (found) jurisdiction.value = found
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12">
    <div v-if="loading" class="mx-auto max-w-6xl">
      <div class="space-y-4">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-80 animate-pulse rounded bg-gray-200"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"></div>
      </div>
    </div>

    <div
      v-else-if="!jurisdiction"
      class="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm"
    >
      <h1 class="text-2xl font-semibold text-gray-900">Jurisdiction not found</h1>
      <button
        @click="goBack"
        class="mt-4 inline-flex cursor-pointer items-center gap-2 text-[#401903] hover:underline"
      >
        <ArrowLeftIcon :size="18" /> Back
      </button>
    </div>

    <div v-else class="mx-auto max-w-6xl space-y-6 lg:space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="cursor-pointer text-gray-500 transition-colors hover:text-[#926233]"
          >
            <ArrowLeftIcon :size="20" />
          </button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as-child>
                  <RouterLink to="/dashboard/projects" class="text-gray-500 hover:text-gray-900">
                    Projects
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem v-if="jurisdiction.project_id && projectName">
                <BreadcrumbLink as-child>
                  <RouterLink
                    :to="`/dashboard/projects/${jurisdiction.project_id}`"
                    class="text-gray-500 hover:text-gray-900"
                  >
                    {{ projectName }}
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <template v-if="parentJurisdiction">
                <BreadcrumbItem>
                  <BreadcrumbLink as-child>
                    <RouterLink
                      :to="`/dashboard/jurisdictions/${parentJurisdiction.id}`"
                      class="text-gray-500 hover:text-gray-900"
                    >
                      {{ parentJurisdiction.name }}
                    </RouterLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
              </template>

              <BreadcrumbItem>
                <BreadcrumbPage class="font-medium text-[#926233]">
                  {{ jurisdiction.name }}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800"
          >
            <Settings :size="18" />
          </button>

          <div
            v-if="showSettingsMenu"
            @click.stop
            class="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5"
          >
            <button
              @click="startEdit"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit Jurisdiction
            </button>
            <button
              @click="deleteJurisdiction"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete Jurisdiction
            </button>
          </div>
        </div>
      </header>

      <section
        class="overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100"
        :class="activeTab === 'sources' ? 'bg-[#F8F9FA]' : 'bg-white'"
      >
        <div class="border-b border-gray-200/50 bg-[#F8F9FA] px-6 pt-4">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'analysis'"
              :class="[
                'relative pb-3 text-sm font-semibold transition-colors',
                activeTab === 'analysis' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Analysis
              <span
                v-if="activeTab === 'analysis'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>

            <button
              @click="activeTab = 'sources'"
              :class="[
                'relative pb-3 text-sm font-semibold transition-colors',
                activeTab === 'sources' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Sources
              <span
                v-if="activeTab === 'sources'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'analysis'" class="space-y-6 bg-white p-6">
          <section>
            <template v-if="showInlineEdit">
              <form @submit.prevent="saveEdit" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                    Jurisdiction Name
                  </label>
                  <input
                    v-model="editForm.name"
                    class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
                  <textarea
                    v-model="editForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                    Monitoring Instructions
                  </label>
                  <textarea
                    v-model="editForm.prompt"
                    rows="3"
                    class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    @click="showInlineEdit = false"
                    class="rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </template>

            <template v-else>
              <div class="flex flex-col gap-3">
                <h1 class="text-3xl font-bold text-[#1F1F1F]">{{ jurisdiction.name }}</h1>
                <p v-if="jurisdiction.description" class="text-base leading-relaxed text-[#4B5563]">
                  {{ jurisdiction.description }}
                </p>
              </div>
            </template>
          </section>

          <section class="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
            <div class="flex flex-col items-center justify-center px-8 py-12 text-center">
              <div
                class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-gray-200"
              >
                <FileText class="text-gray-400" :size="32" />
              </div>
              <h3 class="mb-1 text-base font-medium text-gray-900">No Analysis found</h3>
              <p class="mb-6 max-w-md text-sm text-gray-500">
                Add sources to generate your first document.
              </p>
              <button
                @click="activeTab = 'sources'"
                class="flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              >
                <span>+</span>
                <span>Add Sources</span>
              </button>
            </div>
          </section>
        </div>

        <div v-else-if="activeTab === 'sources'">
          <SourceView :jurisdiction-id="jurisdiction.id" />
        </div>
      </section>

      <section v-if="!jurisdiction.parent_id && activeTab !== 'sources'" class="">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-medium text-[#1F1F1F]">Sub-Jurisdiction</h3>
          <button
            class="flex items-center gap-2 rounded-lg border border-[#401903] bg-transparent px-4 py-2 text-sm font-medium text-[#401903] transition-colors hover:bg-[#401903]/5"
            @click="openSubJurisdictionModal"
          >
            <Plus :size="16" />
            Add Sub-jurisdiction
          </button>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div
            v-if="subJurisdictions.length === 0"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <div
              class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-gray-200"
            >
              <FileQuestion class="text-gray-400" :size="24" />
            </div>
            <p class="mb-1 text-base font-medium text-gray-900">No Jurisdictions added</p>
            <p class="text-sm text-gray-500">Search source or Click add sources to get started.</p>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="node in subJurisdictions"
              :key="node.id"
              @click="goToJurisdiction(node.id)"
              class="group cursor-pointer rounded-lg bg-white p-6 shadow ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-[#401903]/10"
              :style="{ paddingLeft: `${node.depth * 16 + 16}px` }"
            >
              <h4
                class="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#401903]"
              >
                {{ node.name }}
              </h4>
              <p class="text-sm leading-relaxed text-gray-600">
                {{ node.description }}
              </p>
              <p class="mt-2 text-xs text-gray-400">
                {{ new Date(node.created_at).toLocaleString() }}
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>

    <teleport to="body">
      <div
        v-if="subJurisdictionModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        @click.self="closeSubJurisdictionModal"
      >
        <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-2 text-2xl font-bold text-gray-900">Define your Sub-Jurisdiction</h3>
          <p class="mb-6 text-sm text-gray-600">
            Define a specific legal domain or region to monitor
          </p>

          <form @submit.prevent="createSubJurisdiction" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900">
                Sub-Jurisdiction Name
              </label>
              <input
                v-model="subJurisdictionForm.name"
                type="text"
                placeholder="e.g Global Visa Monitoring"
                required
                class="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900"> Description </label>
              <textarea
                v-model="subJurisdictionForm.description"
                rows="4"
                placeholder="What legal areas will you monitor?"
                required
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
            </div>

            <div
              v-if="jurisdictionStore.error"
              class="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {{ jurisdictionStore.error }}
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeSubJurisdictionModal"
                class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              >
                Create Sub-Jurisdiction
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </main>
</template>
