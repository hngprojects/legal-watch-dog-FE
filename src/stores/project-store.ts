import { defineStore } from 'pinia'
import { projectService } from '@/api/project'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

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
      this.loading = true
      this.setError(null)
      try {
        const { data } = await projectService.listProjects()
        this.projects = data
      } catch (error) {
        this.setError('Unable to load projects.')
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async addProject(payload: CreateProjectPayload) {
      this.setError(null)
      try {
        const { data } = await projectService.createProject(payload)
        this.projects = [data, ...this.projects]
        return data
      } catch (error) {
        this.setError('Could not create project.')
        console.error(error)
        throw error
      }
    },

    async updateProject(id: string, payload: UpdateProjectPayload) {
      this.setError(null)
      try {
        const { data } = await projectService.updateProject(id, payload)
        this.projects = this.projects.map((project) => (project.id === id ? data : project))
        return data
      } catch (error) {
        this.setError('Could not update project.')
        console.error(error)
        throw error
      }
    },

    async deleteProject(id: string) {
      this.setError(null)
      try {
        await projectService.deleteProject(id)
        this.projects = this.projects.filter((project) => project.id !== id)
      } catch (error) {
        this.setError('Could not delete project.')
        console.error(error)
        throw error
      }
    },
  },
})
