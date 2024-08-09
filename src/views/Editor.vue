<template>
  <div class="editor-container flex bg-gray-50 min-h-screen">
    <div class="sidebar flex flex-col bg-white shadow-md p-4">
      <h2 class="text-3xl font-bold mb-6 text-center">Card Imposition Editor</h2>
      <CardUploader @card-uploaded="handleCardUpload" />
      <div class="mt-6 flex-grow-0 flex flex-col justify-center space-y-4">
        <button 
          @click="exportImage" 
          class="btn bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition" 
          :disabled="!uploadedCardUrl"
        >
          Export
        </button>
      </div>
    </div>
    <div class="main-content flex-grow p-8 flex justify-center items-center">
      <CardCanvas 
        ref="cardCanvas"
        :canvasWidth="canvasWidth"
        :canvasHeight="canvasHeight"
        :cardWidth="cardWidth"
        :cardHeight="cardHeight"
        @update-cards="updateCards"
      />
    </div>
  </div>
</template>

<script>
import CardCanvas from '@/components/CardCanvas.vue'
import CardUploader from '@/components/CardUploader.vue'

export default {
  name: 'Editor',
  components: {
    CardCanvas,
    CardUploader
  },
  data() {
    return {
      canvasWidth: 210, // A4 width in mm
      canvasHeight: 297, // A4 height in mm
      cardWidth: 63.5, // Card width in mm
      cardHeight: 88.9, // Card height in mm
      uploadedCardUrl: null,
      cards: []
    }
  },
  methods: {
    handleCardUpload(cardUrl) {
      this.uploadedCardUrl = cardUrl;
      this.$refs.cardCanvas.addCard(cardUrl);
    },
    updateCards(cards) {
      this.cards = cards;
    },
    exportImage() {
      const dataUrl = this.$refs.cardCanvas.getImpositionImage();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'cards_layout.png';
      link.click();
    }
  }
}
</script>

<style>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: auto; /* Ensure the sidebar height matches the content */
}

.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  display: block;
  width: 100%;
  text-align: center;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>