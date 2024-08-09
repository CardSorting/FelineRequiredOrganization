<template>
  <div class="card-uploader">
    <input 
      type="file" 
      ref="fileInput"
      @change="handleFileUpload"
      accept="image/*"
      multiple
      class="hidden"
    />
    <button 
      @click="triggerFileInput"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Upload Cards
    </button>
    <div class="mt-4 grid grid-cols-3 gap-4">
      <div v-for="(card, index) in uploadedCards" :key="index" class="relative">
        <img :src="card.url" :alt="card.name" class="w-full h-40 object-cover rounded">
        <button 
          @click="removeCard(index)" 
          class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardUploader',
  data() {
    return {
      uploadedCards: []
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const files = event.target.files
      if (!files.length) return

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue

        const reader = new FileReader()
        reader.onload = (e) => {
          this.uploadedCards.push({
            name: file.name,
            url: e.target.result
          })
          this.$emit('card-uploaded', e.target.result)
        }
        reader.readAsDataURL(file)
      }

      // Reset the file input
      event.target.value = ''
    },
    removeCard(index) {
      const removedCard = this.uploadedCards.splice(index, 1)[0]
      this.$emit('card-removed', removedCard.url)
    }
  }
}
</script>