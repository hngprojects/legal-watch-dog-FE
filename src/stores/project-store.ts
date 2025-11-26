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

    async fetchProjects(organizationId?: string) {
      this.projects = []
      this.loading = true
      this.setError(null)
      try {
        const { data } = await projectService.listProjects(organizationId)
        this.projects = data.data.projects
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(err.response.data.detail[0]?.msg || 'Failed to load projects')
        }
      } finally {
        this.loading = false
      }
    },

    async addProject(payload: CreateProjectPayload) {
      this.setError(null)
      try {
        const { data } = await projectService.createProject(payload)
        const newProject = data.data
        this.projects.unshift(newProject)
        return newProject
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(err.response.data.detail[0]?.msg || 'Failed to create project')
        }
        return null
      }
    },

    async deleteProject(projectId: string) {
      try {
        await projectService.deleteProject(projectId)
        this.projects = this.projects.filter((p) => p.id !== projectId)
      } catch (error) {
        const err = error as ProjectErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(err.response.data.detail[0]?.msg || 'Failed to delete project')
        }
        throw error
      }
    },

    async updateProject(projectId: string, payload: UpdateProjectPayload) {
      this.setError(null)

      try {
        const { data } = await projectService.updateProject(projectId, payload)
        const updatedProject: Project = data

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
          this.setError(err.response.data.detail[0]?.msg || 'Failed to update project')
        }
        throw error
      }
    },
  },
})
