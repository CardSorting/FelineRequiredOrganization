<template>
  <div class="relative">
    <!-- Horizontal Ruler -->
    <div class="absolute left-0 w-full h-6 bg-gray-200 overflow-hidden" :style="{ top: `${-6 - bleed}mm` }">
      <div v-for="i in rulerMarksCount" :key="'top-' + i" class="absolute h-full border-l border-gray-400" :style="{ left: `${i * 10}mm` }">
        <span class="absolute bottom-0 left-1 text-xs">{{ i * 10 }}</span>
      </div>
    </div>

    <!-- Vertical Ruler -->
    <div class="absolute top-0 w-6 h-full bg-gray-200 overflow-hidden" :style="{ left: `${-6 - bleed}mm` }">
      <div v-for="i in rulerMarksCount" :key="'left-' + i" class="absolute w-full border-t border-gray-400" :style="{ top: `${i * 10}mm` }">
        <span class="absolute top-1 right-1 text-xs">{{ i * 10 }}</span>
      </div>
    </div>

    <!-- Main Canvas -->
    <div class="relative border border-gray-300 bg-white">
      <canvas id="cardCanvas" :style="canvasStyle"></canvas>
    </div>
  </div>
</template>

<script>
import { drawCards, drawImagesOnCanvas } from './canvasservice';

export default {
  name: 'CardCanvas',
  props: {
    canvasWidth: {
      type: Number,
      default: 215.9 // 8.5" in mm
    },
    canvasHeight: {
      type: Number,
      default: 279.4 // 11" in mm
    },
    cardWidth: {
      type: Number,
      default: 63
    },
    cardHeight: {
      type: Number,
      default: 88
    },
    bleed: {
      type: Number,
      default: 3 // 3mm bleed
    }
  },
  data() {
    return {
      cards: Array.from({ length: 6 }, () => ({ imageUrl: '', x: 0, y: 0 })),
      draggingCardIndex: null,
      startX: 0,
      startY: 0,
      layoutOptions: {
        margin: 0,
        spacing: 0
      },
      layoutOffset: { x: 0, y: 0 }
    }
  },
  computed: {
    canvasStyle() {
      return {
        width: `${this.canvasWidth}mm`,
        height: `${this.canvasHeight}mm`,
      }
    },
    bleedAreaStyle() {
      return {
        top: `-${this.bleed}mm`,
        left: `-${this.bleed}mm`,
        right: `-${this.bleed}mm`,
        bottom: `-${this.bleed}mm`,
      }
    },
    rulerMarksCount() {
      return Math.floor(Math.max(this.canvasWidth, this.canvasHeight) / 10)
    },
    cropMarks() {
      const markLength = 5 // 5mm crop mark length
      const positions = [
        { x: 0, y: 0 },
        { x: this.canvasWidth, y: 0 },
        { x: 0, y: this.canvasHeight },
        { x: this.canvasWidth, y: this.canvasHeight }
      ]

      return positions.flatMap((pos, index) => [
        {
          id: `h-${index}`,
          style: {
            width: `${markLength}mm`,
            height: '1px',
            left: `${pos.x - (index % 2 === 0 ? 0 : markLength)}mm`,
            top: `${pos.y}mm`
          }
        },
        {
          id: `v-${index}`,
          style: {
            width: '1px',
            height: `${markLength}mm`,
            left: `${pos.x}mm`,
            top: `${pos.y - (index < 2 ? 0 : markLength)}mm`
          }
        }
      ])
    }
  },
  methods: {
    addCard(imageUrl) {
      this.cards.forEach(card => {
        card.imageUrl = imageUrl;
      });
      this.applyLayout('tight');
      this.$emit('update-cards', this.cards);
    },
    startDrag(index, event) {
      this.draggingCardIndex = index;
      const card = this.cards[index];
      this.startX = event.clientX - card.x;
      this.startY = event.clientY - card.y;
    },
    onCanvasMouseDown(event) {
      if (event.target === event.currentTarget) {
        this.draggingCardIndex = null;
      }
    },
    onCanvasMouseMove(event) {
      if (this.draggingCardIndex !== null) {
        const card = this.cards[this.draggingCardIndex];
        card.x = Math.max(0, Math.min(event.clientX - this.startX, this.canvasWidth - this.cardWidth));
        card.y = Math.max(0, Math.min(event.clientY - this.startY, this.canvasHeight - this.cardHeight));
        this.$emit('update-cards', this.cards);
        this.renderCanvas();
      }
    },
    onCanvasMouseUp() {
      this.draggingCardIndex = null;
    },
    applyLayout(layoutId) {
      if (layoutId === 'tight') {
        const { spacing } = this.layoutOptions;
        const cols = 2;
        const rows = 3;

        const totalWidth = (cols * this.cardWidth) + ((cols - 1) * spacing);
        const totalHeight = (rows * this.cardHeight) + ((rows - 1) * spacing);

        this.layoutOffset = {
          x: (this.canvasWidth - totalWidth) / 2,
          y: (this.canvasHeight - totalHeight) / 2
        };

        this.cards.forEach((card, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          card.x = col * (this.cardWidth + spacing);
          card.y = row * (this.cardHeight + spacing);
        });

        this.$emit('update-cards', this.cards);
      }
    },
    renderCanvas() {
      drawCards('cardCanvas', this.$props, this.cards, this.$emit);
    }
  },
  mounted() {
    this.renderCanvas();
  },
  watch: {
    cards: {
      handler() {
        this.renderCanvas();
      },
      deep: true
    }
  }
}
</script>

<style>
#cardCanvas {
  border: 1px solid #000;
}
</style>