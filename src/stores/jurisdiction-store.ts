import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jurisdictionApi, type Jurisdiction } from '@/api/jurisdiction'

interface ApiError {
  response?: {
    data?: {
      detail?: string
    }
  }
}

export const useJurisdictionStore = defineStore('jurisdiction', () => {
  const jurisdictions = ref<Jurisdiction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ Make projectId optional
  const fetchJurisdictions = async (projectId?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await jurisdictionApi.getAll(projectId)
      jurisdictions.value = response.data.data.jurisdictions
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to load jurisdictions'
    } finally {
      loading.value = false
    }
  }

  // ✅ Add fetchOne method
  const fetchOne = async (jurisdictionId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await jurisdictionApi.getOne(jurisdictionId)
      const jurisdiction = response.data.data.jurisdiction

      // Update in store if exists, otherwise add
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
    data: { name: string; description: string },
  ) => {
    try {
      const response = await jurisdictionApi.create({ project_id: projectId, ...data })
      const newJurisdiction = response.data.data.jurisdiction
      jurisdictions.value.push(newJurisdiction)
      return newJurisdiction
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to create jurisdiction'
      return null
    }
  }

  // ✅ Fix update method
  const updateJurisdiction = async (
    jurisdictionId: string,
    data: { name?: string; description?: string },
  ) => {
    try {
      const response = await jurisdictionApi.update(jurisdictionId, data)
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

  const deleteJurisdiction = async (jurisdictionId: string) => {
    try {
      await jurisdictionApi.delete(jurisdictionId)
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
