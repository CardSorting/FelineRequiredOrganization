<template>
  <div class="export-options">
    <h3 class="text-lg font-semibold mb-4">Export Options</h3>
    <div class="space-y-4">
      <div>
        <label for="fileFormat" class="block text-sm font-medium text-gray-700">File Format</label>
        <select 
          id="fileFormat" 
          v-model="exportSettings.fileFormat"
          @change="updateExportSettings"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
      </div>

      <div>
        <label for="resolution" class="block text-sm font-medium text-gray-700">Resolution (DPI)</label>
        <input 
          type="number" 
          id="resolution" 
          v-model.number="exportSettings.resolution"
          @input="updateExportSettings"
          min="72" 
          max="600"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>

      <div>
        <label for="colorMode" class="block text-sm font-medium text-gray-700">Color Mode</label>
        <select 
          id="colorMode" 
          v-model="exportSettings.colorMode"
          @change="updateExportSettings"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="rgb">RGB</option>
          <option value="cmyk">CMYK</option>
        </select>
      </div>

      <div class="flex items-center">
        <input 
          id="includeCropMarks" 
          type="checkbox" 
          v-model="exportSettings.includeCropMarks"
          @change="updateExportSettings"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        >
        <label for="includeCropMarks" class="ml-2 block text-sm text-gray-900">
          Include Crop Marks
        </label>
      </div>

      <div class="flex items-center">
        <input 
          id="includeBleed" 
          type="checkbox" 
          v-model="exportSettings.includeBleed"
          @change="updateExportSettings"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        >
        <label for="includeBleed" class="ml-2 block text-sm text-gray-900">
          Include Bleed
        </label>
      </div>
    </div>

    <button 
      @click="exportCards"
      class="mt-6 w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Export Cards
    </button>
  </div>
</template>

<script>
export default {
  name: 'ExportOptions',
  data() {
    return {
      exportSettings: {
        fileFormat: 'pdf',
        resolution: 300,
        colorMode: 'rgb',
        includeCropMarks: true,
        includeBleed: true
      }
    }
  },
  methods: {
    updateExportSettings() {
      this.$emit('export-settings-change', this.exportSettings)
    },
    exportCards() {
      // In a real implementation, this would trigger the actual export process
      // For now, we'll just emit an event with the current settings
      this.$emit('export-cards', this.exportSettings)
    },
    validateResolution() {
      this.exportSettings.resolution = Math.max(72, Math.min(600, this.exportSettings.resolution))
    }
  },
  watch: {
    'exportSettings.resolution': 'validateResolution'
  },
  mounted() {
    this.updateExportSettings()
  }
}
</script>