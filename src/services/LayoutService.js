const STANDARD_LAYOUTS = [
  { id: 'poker9up', name: '9-up Poker', cardWidth: 63.5, cardHeight: 88.9, thumbnail: '/images/poker9up.png' },
  { id: 'bridge8up', name: '8-up Bridge', cardWidth: 56, cardHeight: 87.5, thumbnail: '/images/bridge8up.png' },
  { id: 'tarot6up', name: '6-up Tarot', cardWidth: 70, cardHeight: 120, thumbnail: '/images/tarot6up.png' }
];

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm

export const getAvailableLayouts = () => STANDARD_LAYOUTS;

export const calculateLayout = (layoutId, options = {}) => {
  const layout = STANDARD_LAYOUTS.find(l => l.id === layoutId);
  if (!layout) {
    throw new Error(`Layout with id ${layoutId} not found`);
  }

  const { cardWidth, cardHeight } = layout;
  const { margin = 5, spacing = 2, bleed = 3 } = options;

  const actualCardWidth = cardWidth + (2 * bleed);
  const actualCardHeight = cardHeight + (2 * bleed);

  const availableWidth = PAGE_WIDTH - (2 * margin);
  const availableHeight = PAGE_HEIGHT - (2 * margin);

  const cardsPerRow = Math.floor((availableWidth + spacing) / (actualCardWidth + spacing));
  const cardsPerColumn = Math.floor((availableHeight + spacing) / (actualCardHeight + spacing));

  const startX = margin + (availableWidth - ((cardsPerRow * actualCardWidth) + ((cardsPerRow - 1) * spacing))) / 2;
  const startY = margin + (availableHeight - ((cardsPerColumn * actualCardHeight) + ((cardsPerColumn - 1) * spacing))) / 2;

  const cardPositions = Array.from({ length: cardsPerColumn }, (_, row) =>
    Array.from({ length: cardsPerRow }, (_, col) => ({
      x: startX + (col * (actualCardWidth + spacing)),
      y: startY + (row * (actualCardHeight + spacing))
    }))
  ).flat();

  return {
    layoutId,
    cardsPerRow,
    cardsPerColumn,
    totalCards: cardsPerRow * cardsPerColumn,
    cardPositions,
    pageWidth: PAGE_WIDTH,
    pageHeight: PAGE_HEIGHT,
    cardWidth: actualCardWidth,
    cardHeight: actualCardHeight,
    bleed,
    margin,
    spacing
  };
};

export const getLayoutById = (id) => STANDARD_LAYOUTS.find(layout => layout.id === id);

export const calculateBleed = (cardWidth, cardHeight, bleedSize) => ({
  width: cardWidth + (2 * bleedSize),
  height: cardHeight + (2 * bleedSize)
});

export const calculateMargins = (cardWidth, cardHeight, cardsPerRow, cardsPerColumn) => {
  const horizontalMargin = (PAGE_WIDTH - (cardWidth * cardsPerRow)) / 2;
  const verticalMargin = (PAGE_HEIGHT - (cardHeight * cardsPerColumn)) / 2;
  return { horizontal: horizontalMargin, vertical: verticalMargin };
};