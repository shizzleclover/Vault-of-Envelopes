/**
 * Envelope texture definitions for 3D materials
 * CSS-based textures for the web, can be extended with actual texture images
 */

export const envelopeTextures = {
    'linen': {
        id: 'linen',
        name: 'Linen',
        roughness: 0.8,
        metalness: 0,
        description: 'Fabric-like weave pattern',
        cssPattern: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.02) 2px,
        rgba(0, 0, 0, 0.02) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.02) 2px,
        rgba(0, 0, 0, 0.02) 4px
      )
    `
    },

    'canvas': {
        id: 'canvas',
        name: 'Canvas',
        roughness: 0.7,
        metalness: 0,
        description: 'Artist canvas texture',
        cssPattern: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        rgba(0, 0, 0, 0.03) 1px,
        rgba(0, 0, 0, 0.03) 2px
      )
    `
    },

    'watercolor': {
        id: 'watercolor',
        name: 'Watercolor',
        roughness: 0.6,
        metalness: 0,
        description: 'Soft watercolor paper',
        cssPattern: `
      radial-gradient(ellipse at 30% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)
    `
    },

    'parchment': {
        id: 'parchment',
        name: 'Parchment',
        roughness: 0.85,
        metalness: 0,
        description: 'Vintage parchment',
        cssPattern: `
      linear-gradient(90deg, rgba(139, 115, 85, 0.05) 0%, transparent 50%, rgba(139, 115, 85, 0.05) 100%)
    `
    },

    'kraft': {
        id: 'kraft',
        name: 'Kraft',
        roughness: 0.75,
        metalness: 0,
        description: 'Brown kraft paper',
        cssPattern: 'none'
    },

    'cotton': {
        id: 'cotton',
        name: 'Cotton',
        roughness: 0.65,
        metalness: 0,
        description: 'Soft cotton paper',
        cssPattern: `
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)
    `
    },

    'smooth': {
        id: 'smooth',
        name: 'Smooth',
        roughness: 0.3,
        metalness: 0.05,
        description: 'Smooth coated paper',
        cssPattern: 'none'
    },

    'handmade': {
        id: 'handmade',
        name: 'Handmade',
        roughness: 0.95,
        metalness: 0,
        description: 'Handmade paper with fibers',
        cssPattern: `
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 3px,
        rgba(139, 115, 85, 0.02) 3px,
        rgba(139, 115, 85, 0.02) 4px
      )
    `
    },
}

/**
 * Get an envelope texture by its ID
 */
export const getEnvelopeTextureById = (id) => {
    return envelopeTextures[id] || envelopeTextures['smooth']
}

/**
 * Get all envelope texture IDs
 */
export const getAllEnvelopeTextureIds = () => {
    return Object.keys(envelopeTextures)
}

export default envelopeTextures
