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

  const fetchJurisdictions = async (projectId: string) => {
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

  const deleteJurisdiction = async (jurisdictionId: string) => {
    try {
      await jurisdictionApi.delete(jurisdictionId)
      jurisdictions.value = jurisdictions.value.filter((j) => j.id !== jurisdictionId)
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.detail || 'Failed to delete jurisdiction'
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
    addJurisdiction,
    deleteJurisdiction,
    setError,
  }
})
