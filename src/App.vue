<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img alt="Logo" class="h-8 w-auto" src="@/assets/logo.svg" />
            <nav class="ml-6 flex space-x-8">
              <RouterLink 
                to="/" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-gray-100 text-gray-900"
              >
                Home
              </RouterLink>
              <RouterLink 
                to="/new-project" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-gray-100 text-gray-900"
              >
                New Project
              </RouterLink>
              <RouterLink 
                to="/editor" 
                v-if="currentProject"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-gray-100 text-gray-900"
              >
                Editor
              </RouterLink>
            </nav>
          </div>
          <div class="flex items-center">
            <span v-if="currentProject" class="text-sm text-gray-500">
              Current Project: {{ currentProject.name }}
            </span>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">{{ error }}</span>
          <button @click="clearError" class="absolute top-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
        <RouterView v-else @loading="isLoading = $event" />
      </div>
    </main>
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Card Imposition Tool. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const route = useRoute()

const isLoading = ref(false)
const error = computed(() => projectStore.error)
const currentProject = computed(() => projectStore.currentProject)

watch(() => route.params.id, async (newId) => {
  if (newId) {
    isLoading.value = true
    await projectStore.loadProject(newId)
    isLoading.value = false
  }
})

function clearError() {
  projectStore.clearError()
}
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>