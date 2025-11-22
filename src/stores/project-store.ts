import { defineStore } from 'pinia'
import { projectService } from '@/api/project'
import type { CreateProjectPayload, Project, ProjectErrorResponse } from '@/types/project'

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

    async fetchProjects() {
      this.projects = []
      this.loading = true
      this.setError(null)
      try {
        const { data } = await projectService.listProjects()
        this.projects = data.data.projects
      } catch (error) {
        this.setError(
          (error as ProjectErrorResponse).response.data.detail[0]?.msg || 'Failed to load projects',
        )
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
        const msg =
          (error as ProjectErrorResponse).response.data.detail[0]?.msg || 'Failed to create project'
        this.setError(msg)
      }
    },

    async deleteProject(projectId: string) {
      try {
        await projectService.deleteProject(projectId)
        this.projects = this.projects.filter((p) => p.id !== projectId)
      } catch (error) {
        const msg =
          (error as ProjectErrorResponse).response.data.detail[0]?.msg || 'Failed to delete project'
        this.setError(msg)
        throw error
      }
    },
  },
})
