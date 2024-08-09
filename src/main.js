import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useProjectStore } from './stores/project'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize project store
const projectStore = useProjectStore()
projectStore.loadProjects()

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
  projectStore.setError(`An unexpected error occurred: ${err.message}`)
}

// Custom directive for focus
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// Custom directive for click-outside
app.directive('click-outside', {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
})

// Global mixin for common methods
app.mixin({
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    }
  }
})

// Performance optimization
// Note: In a real-world scenario, you might want to use an environment variable
// or a build-time constant to determine if it's a production build
app.config.performance = import.meta.env.DEV

// Provide the project store to all components
app.provide('projectStore', projectStore)

// Mount the app
app.mount('#app')

// Log the app version
// Note: You'll need to set this version during your build process
console.log(`App version: ${import.meta.env.VITE_APP_VERSION || 'development'}`)