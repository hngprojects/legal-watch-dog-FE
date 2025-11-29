import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jurisdictionApi, type Jurisdiction } from '@/api/jurisdiction'
import { useOrganizationStore } from '@/stores/organization-store'
import { useProjectStore } from '@/stores/project-store'

const orgStore = useOrganizationStore()
const projectStore = useProjectStore()

interface ApiError {
  response?: {
    data?: {
      detail?: string
      message?: string
    }
  }
}

export const useJurisdictionStore = defineStore('jurisdiction', () => {
  const jurisdictions = ref<Jurisdiction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fixed: typed return + proper error handling
  const getOrgId = (explicitOrgId?: string, projectId?: string): string => {
    if (explicitOrgId) return explicitOrgId
    const current = orgStore.currentOrganizationId
    if (current) return current
    if (projectId) {
      const project = projectStore.projects.find((p) => p.id === projectId)
      if (project?.org_id) return project.org_id
    }
    throw new Error('No active organization selected')
  }

  const fetchJurisdictions = async (projectId?: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId, projectId)
    loading.value = true
    error.value = null
    try {
      const response = projectId
        ? await jurisdictionApi.getByProject(orgId, projectId) // Fixed
        : await jurisdictionApi.getAll(orgId) // Fixed
      jurisdictions.value = response.data.data.jurisdictions
    } catch (err) {
      const apiError = err as ApiError
      error.value =
        apiError.response?.data?.message ||
        apiError.response?.data?.detail ||
        'Failed to load jurisdictions'
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)
    loading.value = true
    error.value = null
    try {
      const response = await jurisdictionApi.getOne(orgId, jurisdictionId) // Fixed
      const jurisdiction = response.data.data.jurisdiction

      const index = jurisdictions.value.findIndex((j) => j.id === jurisdictionId)
      if (index !== -1) {
        jurisdictions.value[index] = jurisdiction
      } else {
        jurisdictions.value.push(jurisdiction)
      }

      return jurisdiction
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to load jurisdiction'
      return null
    } finally {
      loading.value = false
    }
  }

  const addJurisdiction = async (
    projectId: string,
    data: {
      name: string
      description: string
      parent_id?: string | null
      prompt?: string | null
    },
    organizationId?: string,
  ) => {
    const orgId = getOrgId(organizationId, projectId)
    try {
      // Fixed: project_id is required by new API
      const response = await jurisdictionApi.create(orgId, {
        project_id: projectId, // Explicitly include it
        ...data,
      })
      const newJurisdiction = response.data.data.jurisdiction
      jurisdictions.value.push(newJurisdiction)
      return newJurisdiction
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to create jurisdiction'
      return null
    }
  }

  const updateJurisdiction = async (
    jurisdictionId: string,
    data: { name?: string; description?: string; prompt?: string | null },
    organizationId?: string,
  ) => {
    const orgId = getOrgId(organizationId)
    try {
      const response = await jurisdictionApi.update(orgId, jurisdictionId, data) // Fixed
      const updatedJurisdiction = response.data.data.jurisdiction

      const index = jurisdictions.value.findIndex((j) => j.id === jurisdictionId)
      if (index !== -1) {
        jurisdictions.value[index] = updatedJurisdiction
      }

      return updatedJurisdiction
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to update jurisdiction'
      throw err
    }
  }

  const deleteJurisdiction = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)
    try {
      await jurisdictionApi.delete(orgId, jurisdictionId) // Fixed
      jurisdictions.value = jurisdictions.value.filter((j) => j.id !== jurisdictionId)
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to delete jurisdiction'
      throw err
    }
  }

  const setError = (msg: string | null) => {
    error.value = msg
  }

  return {
    jurisdictions,
    loading,
    error,
    fetchJurisdictions,
    fetchOne,
    addJurisdiction,
    updateJurisdiction,
    deleteJurisdiction,
    setError,
  }
})
