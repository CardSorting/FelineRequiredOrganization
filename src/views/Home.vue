<template>
  <div class="home">
    <h1 class="text-4xl font-bold mb-8">Card Imposition Tool</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Recent Projects</h2>
        <ul v-if="recentProjects.length">
          <li v-for="project in recentProjects" :key="project.id" class="mb-2">
            <button @click="loadProject(project.id)" class="text-blue-600 hover:underline">
              {{ project.name }}
            </button>
          </li>
        </ul>
        <p v-else class="text-gray-500">No recent projects</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Quick Start</h2>
        <button @click="startNewProject" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Start New Project
        </button>
      </div>
    </div>
    <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const router = useRouter()
const projectStore = useProjectStore()

const recentProjects = computed(() => projectStore.recentProjects)
const error = computed(() => projectStore.error)

onMounted(() => {
  projectStore.loadProjects()
})

const startNewProject = () => {
  router.push({ name: 'newProject' })
}

const loadProject = async (projectId) => {
  const project = await projectStore.loadProject(projectId)
  if (project) {
    router.push({ name: 'editor', params: { id: projectId } })
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>