// Import fabric dynamically to ensure compatibility with different module systems
let fabric;
import('fabric').then(module => {
  fabric = module.default;
});

export const drawCards = (canvasId, layout, arrangedCards, emit) => {
  if (!canvasId || !layout || !fabric) return;

  const canvas = new fabric.Canvas(canvasId, {
    width: layout.canvasWidth,
    height: layout.canvasHeight,
    backgroundColor: '#ffffff',
  });

  arrangedCards.forEach((card, index) => {
    if (card.imageUrl) {
      fabric.Image.fromURL(card.imageUrl, (img) => {
        img.set({
          left: card.x + layout.cardWidth / 2,
          top: card.y + layout.cardHeight / 2,
          originX: 'center',
          originY: 'center',
          angle: card.rotate,
          width: layout.cardWidth,
          height: layout.cardHeight,
        });

        canvas.add(img);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    } else {
      drawPlaceholderCard(canvas, card, index, layout);
    }
  });
};

const drawPlaceholderCard = (canvas, card, index, layout) => {
  const rect = new fabric.Rect({
    left: card.x + layout.cardWidth / 2,
    top: card.y + layout.cardHeight / 2,
    originX: 'center',
    originY: 'center',
    fill: '#f0f0f0',
    width: layout.cardWidth,
    height: layout.cardHeight,
    angle: card.rotate,
  });

  const text = new fabric.Text(String(index + 1), {
    left: card.x + layout.cardWidth / 2,
    top: card.y + layout.cardHeight / 2,
    originX: 'center',
    originY: 'center',
    fontSize: 24,
    fill: '#999',
  });

  canvas.add(rect);
  canvas.add(text);
  canvas.renderAll();
};

export const loadImages = (arrangedCards) => {
  return Promise.all(
    arrangedCards.map((card) => {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(card.imageUrl, (img) => {
          resolve({ img, card });
        }, { crossOrigin: 'anonymous' }).catch((error) => reject(error));
      });
    })
  );
};

export const drawImagesOnCanvas = async (canvasId, layout, arrangedCards, emit) => {
  if (!canvasId || !layout || !fabric) return;

  try {
    const canvas = new fabric.Canvas(canvasId, {
      width: layout.canvasWidth,
      height: layout.canvasHeight,
      backgroundColor: '#ffffff',
    });

    const loadedImages = await loadImages(arrangedCards);

    loadedImages.forEach(({ img, card }) => {
      img.set({
        left: card.x + layout.cardWidth / 2,
        top: card.y + layout.cardHeight / 2,
        originX: 'center',
        originY: 'center',
        angle: card.rotate,
        width: layout.cardWidth,
        height: layout.cardHeight,
      });

      canvas.add(img);
    });

    canvas.renderAll();
  } catch (error) {
    console.error('Failed to draw images on canvas:', error);
    emit('layout-error', 'Failed to draw images on canvas.');
  }
};