/**
 * 27+ unique pastel colors for envelopes
 * Each color is carefully selected to be distinct and visually pleasing
 */

export const colorPalette = [
    // Warm Tones
    { id: 'peach', hex: '#FFE5D9', name: 'Peach Cream' },
    { id: 'coral', hex: '#FFD6CC', name: 'Soft Coral' },
    { id: 'blush', hex: '#FFE4E1', name: 'Misty Rose' },
    { id: 'salmon', hex: '#FFC4B8', name: 'Light Salmon' },
    { id: 'apricot', hex: '#FFE8D1', name: 'Apricot' },
    { id: 'champagne', hex: '#FFF4CC', name: 'Champagne' },
    { id: 'buttercream', hex: '#FFF5E1', name: 'Buttercream' },

    // Cool Tones
    { id: 'sage', hex: '#D4E7C5', name: 'Sage Green' },
    { id: 'mint', hex: '#D9F2E6', name: 'Fresh Mint' },
    { id: 'seafoam', hex: '#D1F2EB', name: 'Seafoam' },
    { id: 'pistachio', hex: '#E8F4EA', name: 'Pistachio' },
    { id: 'sky', hex: '#C7E9FB', name: 'Sky Blue' },
    { id: 'powder', hex: '#E1F5FF', name: 'Powder Blue' },
    { id: 'periwinkle', hex: '#D9E5FF', name: 'Periwinkle' },
    { id: 'ice', hex: '#E6F3FF', name: 'Ice Blue' },

    // Purple/Pink Tones
    { id: 'lavender', hex: '#E5D9F2', name: 'Lavender' },
    { id: 'lilac', hex: '#F5E6FF', name: 'Lilac' },
    { id: 'mauve', hex: '#E8D5E0', name: 'Mauve' },
    { id: 'rose', hex: '#FFD6E8', name: 'Rose Pink' },
    { id: 'blushPink', hex: '#FFF0F5', name: 'Blush Pink' },
    { id: 'orchid', hex: '#F0E6F6', name: 'Orchid' },

    // Neutral/Warm Neutral
    { id: 'cream', hex: '#FFF9F0', name: 'Warm Cream' },
    { id: 'ivory', hex: '#FFFFF0', name: 'Ivory' },
    { id: 'linen', hex: '#FAF0E6', name: 'Linen' },
    { id: 'sand', hex: '#F0E6D2', name: 'Sand' },
    { id: 'wheat', hex: '#F5DEB3', name: 'Wheat' },
    { id: 'gold', hex: '#FFF0C4', name: 'Soft Gold' },
    { id: 'honey', hex: '#FFE5B4', name: 'Honey' },
]

/**
 * Get a color by its ID
 */
export const getColorById = (id) => {
    return colorPalette.find(c => c.id === id) || colorPalette[0]
}

/**
 * Get a color by index (for sequential assignment)
 */
export const getColorByIndex = (index) => {
    return colorPalette[index % colorPalette.length]
}

export default colorPalette
