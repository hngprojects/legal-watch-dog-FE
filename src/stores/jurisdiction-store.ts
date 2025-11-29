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
  const jurisdictions = ref<Jurisdiction[]>([])              // ACTIVE (not deleted)
  const archivedJurisdictions = ref<Jurisdiction[]>([])       // DELETED (soft)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
        ? await jurisdictionApi.getByProject(orgId, projectId)
        : await jurisdictionApi.getAll(orgId)

      const all = response.data.data.jurisdictions

      jurisdictions.value = all.filter((j) => !j.is_deleted)   // ACTIVE
      archivedJurisdictions.value = all.filter((j) => j.is_deleted) // ARCHIVED
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

  const fetchArchived = async (projectId?: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId, projectId)
    loading.value = true
    error.value = null
    try {
      const response = projectId
        ? await jurisdictionApi.getByProject(orgId, projectId)
        : await jurisdictionApi.getAll(orgId)

      archivedJurisdictions.value = response.data.data.jurisdictions.filter(
        (j) => j.is_deleted,
      )
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to load archived items'
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)
    loading.value = true
    error.value = null
    try {
      const response = await jurisdictionApi.getOne(orgId, jurisdictionId)
      const jurisdiction = response.data.data.jurisdiction

      if (jurisdiction.is_deleted) {
        const index = archivedJurisdictions.value.findIndex((j) => j.id === jurisdictionId)
        if (index !== -1) {
          archivedJurisdictions.value[index] = jurisdiction
        } else {
          archivedJurisdictions.value.push(jurisdiction)
        }
      } else {
        const index = jurisdictions.value.findIndex((j) => j.id === jurisdictionId)
        if (index !== -1) {
          jurisdictions.value[index] = jurisdiction
        } else {
          jurisdictions.value.push(jurisdiction)
        }
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
    data: { name: string; description: string; parent_id?: string | null; prompt?: string | null },
    organizationId?: string,
  ) => {
    const orgId = getOrgId(organizationId, projectId)
    try {
      const response = await jurisdictionApi.create(orgId, {
        project_id: projectId,
        ...data,
      })
      const newJ = response.data.data.jurisdiction
      jurisdictions.value.push(newJ)
      return newJ
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
      const response = await jurisdictionApi.update(orgId, jurisdictionId, data)
      const updated = response.data.data.jurisdiction

      if (updated.is_deleted) {
        jurisdictions.value = jurisdictions.value.filter((j) => j.id !== updated.id)
        archivedJurisdictions.value.push(updated)
      } else {
        archivedJurisdictions.value = archivedJurisdictions.value.filter(
          (j) => j.id !== updated.id,
        )
        jurisdictions.value.push(updated)
      }

      return updated
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to update jurisdiction'
      throw err
    }
  }

  const deleteJurisdiction = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)
    try {
      await jurisdictionApi.delete(orgId, jurisdictionId)

      const item = jurisdictions.value.find((j) => j.id === jurisdictionId)
      if (item) {
        item.is_deleted = true
        archivedJurisdictions.value.push(item)
      }

      jurisdictions.value = jurisdictions.value.filter((j) => j.id !== jurisdictionId)
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to delete jurisdiction'
      throw err
    }
  }

  const restoreJurisdiction = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)
    try {
      await jurisdictionApi.restore(orgId, jurisdictionId)

      const item = archivedJurisdictions.value.find((j) => j.id === jurisdictionId)
      if (item) {
        item.is_deleted = false
        jurisdictions.value.push(item)
      }

      archivedJurisdictions.value = archivedJurisdictions.value.filter(
        (j) => j.id !== jurisdictionId,
      )
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to restore jurisdiction'
      throw err
    }
  }

  const setError = (msg: string | null) => {
    error.value = msg
  }

  return {
    jurisdictions,           
    archivedJurisdictions,    
    loading,
    error,

    fetchJurisdictions,
    fetchArchived,
    fetchOne,
    addJurisdiction,
    updateJurisdiction,
    deleteJurisdiction,
    restoreJurisdiction,

    setError,
  }
})
