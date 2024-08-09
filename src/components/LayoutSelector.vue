<template>
  <div class="layout-selector">
    <h3 class="text-lg font-semibold mb-2">Select Layout</h3>
    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="layout in layouts"
        :key="layout.id"
        @click="selectLayout(layout)"
        class="p-2 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'bg-blue-100': selectedLayout === layout.id }"
      >
        <img :src="layout.thumbnail" :alt="layout.name" class="w-full h-24 object-contain mb-2">
        <span class="text-sm">{{ layout.name }}</span>
      </button>
    </div>
    <div v-if="selectedLayout" class="mt-4">
      <h4 class="font-medium mb-2">Layout Options</h4>
      <div v-for="(option, key) in layoutOptions" :key="key" class="mb-2">
        <label :for="key" class="block text-sm font-medium text-gray-700">{{ option.label }}</label>
        <input
          :id="key"
          v-model="layoutOptions[key].value"
          :type="option.type"
          :min="option.min"
          :max="option.max"
          :step="option.step"
          @input="updateLayoutOptions"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutSelector',
  data() {
    return {
      selectedLayout: null,
      layouts: [
        { id: 'poker9up', name: '9-up Poker', thumbnail: '/images/poker9up.png' },
        { id: 'bridge8up', name: '8-up Bridge', thumbnail: '/images/bridge8up.png' },
        { id: 'tarot6up', name: '6-up Tarot', thumbnail: '/images/tarot6up.png' }
      ],
      layoutOptions: {
        margin: { label: 'Margin (mm)', type: 'number', value: 5, min: 0, max: 50, step: 1 },
        spacing: { label: 'Card Spacing (mm)', type: 'number', value: 2, min: 0, max: 20, step: 0.5 },
        bleed: { label: 'Bleed (mm)', type: 'number', value: 3, min: 0, max: 10, step: 0.5 }
      }
    }
  },
  methods: {
    selectLayout(layout) {
      this.selectedLayout = layout.id
      this.emitLayoutChange()
    },
    updateLayoutOptions() {
      this.emitLayoutChange()
    },
    emitLayoutChange() {
      const options = {}
      for (const [key, option] of Object.entries(this.layoutOptions)) {
        options[key] = option.value
      }
      this.$emit('layout-change', {
        layoutId: this.selectedLayout,
        options: options
      })
    },
    getLayoutById(id) {
      return this.layouts.find(layout => layout.id === id)
    }
  }
}
</script>