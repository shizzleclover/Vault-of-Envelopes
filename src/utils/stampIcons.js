/**
 * Stamp icon configurations
 * Each stamp has an image path and default styling
 * User will provide actual PNG files at /public/stamps/
 */

export const stampIcons = {
    // Music & Arts
    'music-note': {
        image: '/stamps/music-note.png',
        fallbackColor: '#FF6B6B',
        description: 'Musical note'
    },
    'paintbrush': {
        image: '/stamps/paintbrush.png',
        fallbackColor: '#9B59B6',
        description: 'Artist paintbrush'
    },
    'camera': {
        image: '/stamps/camera.png',
        fallbackColor: '#3498DB',
        description: 'Camera'
    },
    'microphone': {
        image: '/stamps/microphone.png',
        fallbackColor: '#E74C3C',
        description: 'Microphone'
    },
    'guitar': {
        image: '/stamps/guitar.png',
        fallbackColor: '#F39C12',
        description: 'Guitar'
    },

    // Nature
    'tree': {
        image: '/stamps/tree.png',
        fallbackColor: '#27AE60',
        description: 'Tree'
    },
    'flower': {
        image: '/stamps/flower.png',
        fallbackColor: '#E91E63',
        description: 'Flower'
    },
    'leaf': {
        image: '/stamps/leaf.png',
        fallbackColor: '#4CAF50',
        description: 'Leaf'
    },
    'butterfly': {
        image: '/stamps/butterfly.png',
        fallbackColor: '#9C27B0',
        description: 'Butterfly'
    },
    'bird': {
        image: '/stamps/bird.png',
        fallbackColor: '#00BCD4',
        description: 'Bird'
    },
    'mountain': {
        image: '/stamps/mountain.png',
        fallbackColor: '#607D8B',
        description: 'Mountain'
    },
    'wave': {
        image: '/stamps/wave.png',
        fallbackColor: '#2196F3',
        description: 'Ocean wave'
    },

    // Celestial
    'star': {
        image: '/stamps/star.png',
        fallbackColor: '#FFC107',
        description: 'Star'
    },
    'moon': {
        image: '/stamps/moon.png',
        fallbackColor: '#9E9E9E',
        description: 'Crescent moon'
    },
    'sun': {
        image: '/stamps/sun.png',
        fallbackColor: '#FF9800',
        description: 'Sun'
    },
    'constellation': {
        image: '/stamps/constellation.png',
        fallbackColor: '#673AB7',
        description: 'Constellation'
    },

    // Symbols
    'crown': {
        image: '/stamps/crown.png',
        fallbackColor: '#D4AF37',
        description: 'Crown'
    },
    'heart': {
        image: '/stamps/heart.png',
        fallbackColor: '#E91E63',
        description: 'Heart'
    },
    'diamond': {
        image: '/stamps/diamond.png',
        fallbackColor: '#00BCD4',
        description: 'Diamond'
    },
    'lightning': {
        image: '/stamps/lightning.png',
        fallbackColor: '#FFEB3B',
        description: 'Lightning bolt'
    },
    'flame': {
        image: '/stamps/flame.png',
        fallbackColor: '#FF5722',
        description: 'Flame'
    },
    'compass': {
        image: '/stamps/compass.png',
        fallbackColor: '#795548',
        description: 'Compass'
    },
    'anchor': {
        image: '/stamps/anchor.png',
        fallbackColor: '#37474F',
        description: 'Anchor'
    },
    'key': {
        image: '/stamps/key.png',
        fallbackColor: '#8D6E63',
        description: 'Vintage key'
    },
    'feather': {
        image: '/stamps/feather.png',
        fallbackColor: '#8BC34A',
        description: 'Feather quill'
    },

    // Objects
    'book': {
        image: '/stamps/book.png',
        fallbackColor: '#6D4C41',
        description: 'Open book'
    },
    'coffee': {
        image: '/stamps/coffee.png',
        fallbackColor: '#795548',
        description: 'Coffee cup'
    },
    'plane': {
        image: '/stamps/plane.png',
        fallbackColor: '#03A9F4',
        description: 'Paper plane'
    },
    'globe': {
        image: '/stamps/globe.png',
        fallbackColor: '#4CAF50',
        description: 'Globe'
    },
    'rocket': {
        image: '/stamps/rocket.png',
        fallbackColor: '#FF5722',
        description: 'Rocket'
    },
    'hourglass': {
        image: '/stamps/hourglass.png',
        fallbackColor: '#D4AF37',
        description: 'Hourglass'
    },
}

/**
 * Get a stamp by its ID
 */
export const getStampById = (id) => {
    return stampIcons[id] || null
}

/**
 * Get all stamp IDs
 */
export const getAllStampIds = () => {
    return Object.keys(stampIcons)
}

export default stampIcons
