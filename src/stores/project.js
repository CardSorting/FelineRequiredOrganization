import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', () => {
  const currentProject = ref(null)
  const projects = ref([])
  const error = ref(null)

  const recentProjects = computed(() => {
    return projects.value
      .slice()
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, 5)
  })

  function setError(message) {
    error.value = message
    console.error(message)
  }

  function clearError() {
    error.value = null
  }

  function createNewProject({ name, layoutType }) {
    if (!name || !layoutType) {
      setError('Project name and layout type are required')
      return null
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      layoutType,
      cards: [],
      layout: null,
      lastModified: Date.now(),
      exportStatus: null
    }
    projects.value.push(newProject)
    currentProject.value = newProject
    saveProjects()
    return newProject.id
  }

  function loadProject(projectId) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      currentProject.value = project
      project.lastModified = Date.now()
      saveProjects()
      return project
    } else {
      setError(`Project with id ${projectId} not found`)
      return null
    }
  }

  function getProjectById(projectId) {
    return projects.value.find(p => p.id === projectId)
  }

  function saveCurrentProject() {
    if (currentProject.value) {
      currentProject.value.lastModified = Date.now()
      const index = projects.value.findIndex(p => p.id === currentProject.value.id)
      if (index !== -1) {
        projects.value[index] = { ...currentProject.value }
      } else {
        projects.value.push({ ...currentProject.value })
      }
      saveProjects()
    }
  }

  function deleteProject(projectId) {
    const index = projects.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects.value.splice(index, 1)
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = null
      }
      saveProjects()
    } else {
      setError(`Project with id ${projectId} not found for deletion`)
    }
  }

  function addCardToCurrentProject(card) {
    if (currentProject.value) {
      currentProject.value.cards.push(card)
      saveCurrentProject()
    } else {
      setError('No current project to add card to')
    }
  }

  function updateLayoutForCurrentProject(layout) {
    if (currentProject.value) {
      currentProject.value.layout = layout
      saveCurrentProject()
    } else {
      setError('No current project to update layout for')
    }
  }

  function updateExportStatus(status) {
    if (currentProject.value) {
      currentProject.value.exportStatus = status
      saveCurrentProject()
    } else {
      setError('No current project to update export status for')
    }
  }

  function saveProjects() {
    try {
      localStorage.setItem('cardImpositionProjects', JSON.stringify(projects.value))
    } catch (err) {
      setError(`Failed to save projects to local storage: ${err.message}`)
    }
  }

  function loadProjects() {
    try {
      const savedProjects = localStorage.getItem('cardImpositionProjects')
      if (savedProjects) {
        projects.value = JSON.parse(savedProjects)
      }
    } catch (err) {
      setError(`Failed to load projects from local storage: ${err.message}`)
    }
  }

  return { 
    currentProject,
    recentProjects,
    error,
    createNewProject,
    loadProject,
    getProjectById,
    saveCurrentProject,
    deleteProject,
    addCardToCurrentProject,
    updateLayoutForCurrentProject,
    updateExportStatus,
    clearError,
    loadProjects
  }
})