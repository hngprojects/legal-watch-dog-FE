import { defineStore } from 'pinia'
import { projectService } from '@/api/project'
import type {
  CreateProjectPayload,
  Project,
  ProjectErrorResponse,
  UpdateProjectPayload,
} from '@/types/project'

interface State {
  projects: Project[]
  loading: boolean
  error: string | null
}

export const useProjectStore = defineStore('projects', {
  state: (): State => ({
    projects: [],
    loading: false,
    error: null,
  }),

  actions: {
    setError(message: string | null) {
      this.error = message
    },

    async fetchProjects(organizationId: string, params?: { q?: string; page?: number; limit?: number }) {
      this.projects = []
      this.loading = true
      this.setError(null)
      try {
        const { data } = await projectService.listProjects(organizationId, params)
        const payload = (data as any)?.data || {}
        this.projects = payload.projects || []
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            (err.response.data as any)?.message ||
              (err.response.data as any)?.detail?.[0]?.msg ||
              'Failed to load projects',
          )
        }
      } finally {
        this.loading = false
      }
    },

    async addProject(payload: CreateProjectPayload) {
      this.setError(null)
      if (!payload.organization_id) {
        this.setError('Select an organization before creating a project')
        return null
      }
      try {
        const { data } = await projectService.createProject(payload.organization_id, payload)
        const newProject =
          (data as any)?.data?.project || (data as any)?.data || (data as any)?.project
        if (!newProject) {
          this.setError('Failed to create project')
          return null
        }
        this.projects.unshift(newProject)
        return newProject
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            (err.response.data as any)?.message ||
              (err.response.data as any)?.detail?.[0]?.msg ||
              'Failed to create project',
          )
        }
        return null
      }
    },

    async deleteProject(projectId: string, organizationId: string) {
      try {
        await projectService.deleteProject(organizationId, projectId)
        this.projects = this.projects.filter((p) => p.id !== projectId)
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            (err.response.data as any)?.message ||
              (err.response.data as any)?.detail?.[0]?.msg ||
              'Failed to delete project',
          )
        }
        throw error
      }
    },

    async updateProject(organizationId: string | null, projectId: string, payload: UpdateProjectPayload) {
      this.setError(null)

      try {
        const resolvedOrgId =
          organizationId || this.projects.find((p) => p.id === projectId)?.org_id || ''

        if (!resolvedOrgId) {
          this.setError('Organization context missing. Please reopen this project from Organizations.')
          return null
        }

        const { data } = await projectService.updateProject(resolvedOrgId, projectId, payload)
        const updatedProject: Project =
          (data as any)?.data?.project || (data as any)?.data || (data as any)?.project

        const index = this.projects.findIndex((p) => p.id === projectId)
        if (index !== -1) {
          this.projects[index] = updatedProject
        }

        return updatedProject
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            (err.response.data as any)?.message ||
              (err.response.data as any)?.detail?.[0]?.msg ||
              'Failed to update project',
          )
        }
        throw error
      }
    },
  },
})
