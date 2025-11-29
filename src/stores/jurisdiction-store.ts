import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jurisdictionApi, type Jurisdiction } from '@/api/jurisdiction'
import { useOrganizationStore } from '@/stores/organization-store'
import { useProjectStore } from '@/stores/project-store'

interface ApiError {
  response?: {
    data?: {
      detail?: string
      message?: string
    }
  }
}

const uniqById = (arr: Jurisdiction[]) => {
  const map = new Map<string, Jurisdiction>()
  for (const it of arr) map.set(it.id, it)
  return Array.from(map.values())
}

const cloneJurisdiction = (j: Jurisdiction) => ({ ...j })

export const useJurisdictionStore = defineStore('jurisdiction', () => {
  const orgStore = useOrganizationStore()
  const projectStore = useProjectStore()

  const jurisdictions = ref<Jurisdiction[]>([])
  const archivedJurisdictions = ref<Jurisdiction[]>([])
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
    let orgId: string
    try {
      orgId = getOrgId(organizationId, projectId)
    } catch (e) {
      error.value = (e as Error).message
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = projectId
        ? await jurisdictionApi.getByProject(orgId, projectId)
        : await jurisdictionApi.getAll(orgId)

      const all = response.data?.data?.jurisdictions ?? []

      jurisdictions.value = uniqById(
        all.filter((j) => !j.is_deleted).map(cloneJurisdiction)
      )

      archivedJurisdictions.value = uniqById(
        all.filter((j) => j.is_deleted).map(cloneJurisdiction)
      )
    } catch (err) {
      const apiErr = err as ApiError
      error.value =
        apiErr.response?.data?.message ||
        apiErr.response?.data?.detail ||
        'Failed to load jurisdictions'
    } finally {
      loading.value = false
    }
  }

  const fetchArchived = async (projectId?: string, organizationId?: string) => {
    let orgId: string
    try {
      orgId = getOrgId(organizationId, projectId)
    } catch (e) {
      error.value = (e as Error).message
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = projectId
        ? await jurisdictionApi.getByProject(orgId, projectId)
        : await jurisdictionApi.getAll(orgId)

      const all = response.data?.data?.jurisdictions ?? []

      archivedJurisdictions.value = uniqById(
        all.filter((j: Jurisdiction) => j.is_deleted).map(cloneJurisdiction)
      )
    } catch (err) {
      const apiErr = err as ApiError
      error.value =
        apiErr.response?.data?.detail ||
        'Failed to load archived items'
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (jurisdictionId: string, organizationId?: string) => {
    let orgId: string
    try {
      orgId = getOrgId(organizationId)
    } catch (e) {
      error.value = (e as Error).message
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await jurisdictionApi.getOne(orgId, jurisdictionId)
      const j = response.data?.data?.jurisdiction as Jurisdiction

      if (!j) return null

      jurisdictions.value = jurisdictions.value.filter((x) => x.id !== j.id)
      archivedJurisdictions.value = archivedJurisdictions.value.filter((x) => x.id !== j.id)

      if (j.is_deleted) archivedJurisdictions.value.push(cloneJurisdiction(j))
      else jurisdictions.value.push(cloneJurisdiction(j))

      jurisdictions.value = uniqById(jurisdictions.value)
      archivedJurisdictions.value = uniqById(archivedJurisdictions.value)

      return j
    } catch (err) {
      const apiErr = err as ApiError
      error.value =
        apiErr.response?.data?.detail ||
        'Failed to load jurisdiction'
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
    let orgId: string
    try {
      orgId = getOrgId(organizationId, projectId)
    } catch (e) {
      error.value = (e as Error).message
      return null
    }

    try {
      const response = await jurisdictionApi.create(orgId, {
        project_id: projectId,
        ...data,
      })

      const newJ = response.data?.data?.jurisdiction as Jurisdiction

      if (newJ) {
        jurisdictions.value = uniqById([
          ...jurisdictions.value,
          cloneJurisdiction(newJ),
        ])
      }

      return newJ
    } catch (err) {
      const apiErr = err as ApiError
      error.value = apiErr.response?.data?.detail || 'Failed to create jurisdiction'
      return null
    }
  }

  const updateJurisdiction = async (
    jurisdictionId: string,
    data: { name?: string; description?: string; prompt?: string | null },
    organizationId?: string,
  ) => {
    let orgId: string
    try {
      orgId = getOrgId(organizationId)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    }

    try {
      const response = await jurisdictionApi.update(orgId, jurisdictionId, data)
      const updated = response.data?.data?.jurisdiction as Jurisdiction | undefined

      jurisdictions.value = jurisdictions.value.filter((j) => j.id !== jurisdictionId)
      archivedJurisdictions.value = archivedJurisdictions.value.filter(
        (j) => j.id !== jurisdictionId,
      )

      if (updated) {
        if (updated.is_deleted) archivedJurisdictions.value.push(cloneJurisdiction(updated))
        else jurisdictions.value.push(cloneJurisdiction(updated))
      }

      jurisdictions.value = uniqById(jurisdictions.value)
      archivedJurisdictions.value = uniqById(archivedJurisdictions.value)

      return updated ?? null
    } catch (err) {
      const apiErr = err as ApiError
      error.value = apiErr.response?.data?.detail || 'Failed to update jurisdiction'
      throw err
    }
  }

  const deleteJurisdiction = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)

    try {
      await jurisdictionApi.delete(orgId, jurisdictionId)

      const item = jurisdictions.value.find((j) => j.id === jurisdictionId)

      if (item) {
        jurisdictions.value = jurisdictions.value.filter((j) => j.id !== jurisdictionId)

        archivedJurisdictions.value = uniqById([
          ...archivedJurisdictions.value,
          { ...item, is_deleted: true, deleted_at: new Date().toISOString() },
        ])
      }
    } catch (err) {
      console.error('Delete failed:', err)
      throw err
    }
  }

  const restoreJurisdiction = async (jurisdictionId: string, organizationId?: string) => {
    const orgId = getOrgId(organizationId)

    try {
      const response = await jurisdictionApi.restore(orgId, jurisdictionId)
      const restored = response.data?.data?.jurisdiction as Jurisdiction

      archivedJurisdictions.value = archivedJurisdictions.value.filter(
        (j) => j.id !== jurisdictionId,
      )

      jurisdictions.value = uniqById([...jurisdictions.value, cloneJurisdiction(restored)])

      return restored
    } catch (err) {
      const apiErr = err as ApiError
      error.value = apiErr.response?.data?.detail || 'Failed to restore jurisdiction'
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
