import type {
  CreateProjectPayload,
  Project,
  ProjectStatus,
  UpdateProjectPayload,
} from '@/types/project'

type ServiceResponse<T> = Promise<{ data: T }>

const STORAGE_KEY = 'legal-watchdog:mock-projects'

const readProjects = (): Project[] => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    return rawValue ? (JSON.parse(rawValue) as Project[]) : []
  } catch {
    return []
  }
}

const writeProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

const randomId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `proj-${Math.random().toString(36).slice(2, 10)}`
}

const delay = <T>(factory: () => T, ms = 350): ServiceResponse<T> =>
  new Promise((resolve) => setTimeout(() => resolve({ data: factory() }), ms))

const ensureSeedProjects = () => {
  const projects = readProjects()

  if (projects.length === 0) {
    const now = new Date().toISOString()
    const seed: Project[] = [
      {
        id: randomId(),
        name: 'AI Compliance Radar',
        description: 'Monitor AI regulatory updates across EU regulators',
        prompt: 'Generate AI compliance updates focused on EU AI Act developments.',
        status: 'active',
        created_at: now,
      },
      {
        id: randomId(),
        name: 'Digital Assets Taskforce',
        description: 'Track SEC + CFTC announcements on digital asset custody',
        prompt: 'Summarize US digital asset enforcement announcements weekly.',
        status: 'paused',
        created_at: now,
      },
    ]
    writeProjects(seed)
  }
}

ensureSeedProjects()

const updateProjectArray = (projects: Project[], id: string, payload: UpdateProjectPayload) => {
  const idx = projects.findIndex((project) => project.id === id)

  if (idx === -1) {
    throw new Error('Project not found.')
  }

  const existing = projects[idx] as Project

  const updatedProject: Project = {
    ...existing,
    name: payload.name ?? existing.name,
    description: payload.description ?? existing.description,
    prompt: payload.prompt ?? existing.prompt,
    status: payload.status ?? existing.status,
    id: existing.id,
    created_at: existing.created_at,
  }

  projects[idx] = updatedProject
  return { projects, updatedProject }
}

export const mockProjectService = {
  listProjects: (): ServiceResponse<Project[]> => delay(() => readProjects()),

  createProject: (payload: CreateProjectPayload): ServiceResponse<Project> => {
    const projects = readProjects()
    const newProject: Project = {
      id: randomId(),
      name: payload.name,
      description: payload.description,
      prompt: payload.prompt,
      status: payload.status as ProjectStatus,
      created_at: new Date().toISOString(),
    }

    projects.unshift(newProject)
    writeProjects(projects)

    return delay(() => newProject)
  },

  updateProject: (id: string, payload: UpdateProjectPayload): ServiceResponse<Project> => {
    try {
      const projects = readProjects()
      const { projects: updatedProjects, updatedProject } = updateProjectArray(
        projects,
        id,
        payload,
      )
      writeProjects(updatedProjects)
      return delay(() => updatedProject)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  deleteProject: (id: string): ServiceResponse<{ success: boolean }> => {
    const projects = readProjects()
    const filtered = projects.filter((project) => project.id !== id)

    if (filtered.length === projects.length) {
      return Promise.reject(new Error('Project not found.'))
    }

    writeProjects(filtered)
    return delay(() => ({ success: true }))
  },
}
