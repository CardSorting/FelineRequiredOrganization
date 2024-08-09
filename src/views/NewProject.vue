<template>
  <div class="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h2 class="text-2xl font-bold mb-4">Create New Project</h2>
    <form @submit.prevent="createProject">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="projectName">
          Project Name
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="projectName"
          v-model="projectName"
          type="text"
          placeholder="Enter project name"
          :disabled="true"
        >
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="layoutType">
          Layout Type
        </label>
        <select
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="layoutType"
          v-model="layoutType"
          :disabled="true"
        >
          <option value="poker9up">9-up Poker</option>
          <option value="bridge8up">8-up Bridge</option>
          <option value="tarot6up">6-up Tarot</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating...' : 'Create Project' }}
        </button>
      </div>
    </form>
    <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';

const router = useRouter();
const projectStore = useProjectStore();

const projectName = ref('');
const layoutType = ref('poker9up');
const isLoading = ref(false);
const error = ref('');

function generateUniqueName() {
  return `Project-${Math.random().toString(36).substr(2, 9)}`;
}

onMounted(() => {
  projectName.value = generateUniqueName();
});

async function createProject() {
  isLoading.value = true;
  error.value = '';

  try {
    const newProjectId = await projectStore.createNewProject({
      name: projectName.value,
      layoutType: layoutType.value
    });

    if (newProjectId) {
      router.push({ name: 'editor', params: { id: newProjectId } });
    } else {
      throw new Error('Failed to create project');
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while creating the project.';
  } finally {
    isLoading.value = false;
  }
}
</script>