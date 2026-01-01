/**
 * Font pairings for letters
 * Each pairing has a heading font (serif/display) and body font (sans-serif/readable)
 */

export const fontPairings = {
    'classic': {
        id: 'classic',
        heading: "'Playfair Display', serif",
        body: "'Inter', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Elegant and timeless'
    },

    'romantic': {
        id: 'romantic',
        heading: "'Lora', serif",
        body: "'Raleway', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Warm and inviting'
    },

    'editorial': {
        id: 'editorial',
        heading: "'Crimson Text', serif",
        body: "'DM Sans', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Sophisticated and literary'
    },

    'modern-serif': {
        id: 'modern-serif',
        heading: "'Playfair Display', serif",
        body: "'DM Sans', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Modern with classic touch'
    },

    'literary': {
        id: 'literary',
        heading: "'Crimson Text', serif",
        body: "'Lora', serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Bookish and thoughtful'
    },

    'clean': {
        id: 'clean',
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Minimal and clean'
    },

    'soft': {
        id: 'soft',
        heading: "'Lora', serif",
        body: "'Inter', sans-serif",
        headingWeight: 500,
        bodyWeight: 400,
        vibe: 'Gentle and approachable'
    },

    'bold-classic': {
        id: 'bold-classic',
        heading: "'Playfair Display', serif",
        body: "'Raleway', sans-serif",
        headingWeight: 800,
        bodyWeight: 400,
        vibe: 'Strong yet refined'
    },

    'understated': {
        id: 'understated',
        heading: "'Raleway', sans-serif",
        body: "'Inter', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Subtle elegance'
    },

    'contrast': {
        id: 'contrast',
        heading: "'Crimson Text', serif",
        body: "'Raleway', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Dynamic and expressive'
    },

    'narrative': {
        id: 'narrative',
        heading: "'Lora', serif",
        body: "'DM Sans', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Storytelling feel'
    },

    'sleek': {
        id: 'sleek',
        heading: "'DM Sans', sans-serif",
        body: "'Inter', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Contemporary and sleek'
    },

    'montserrat': {
        id: 'montserrat',
        heading: "'Montserrat', sans-serif",
        body: "'Montserrat', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Geometric and modern'
    },

    'urbanist': {
        id: 'urbanist',
        heading: "'Urbanist', sans-serif",
        body: "'Urbanist', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Futuristic and clean'
    },

    'jakarta': {
        id: 'jakarta',
        heading: "'Plus Jakarta Sans', sans-serif",
        body: "'Plus Jakarta Sans', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Tech-forward and geometric'
    },

    'satoshi': {
        id: 'satoshi',
        heading: "'Satoshi', sans-serif",
        body: "'Satoshi', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Modern grotesque'
    },

    'modern-mix': {
        id: 'modern-mix',
        heading: "'Satoshi', sans-serif",
        body: "'Urbanist', sans-serif",
        headingWeight: 700,
        bodyWeight: 400,
        vibe: 'Trendy and high-end'
    },

    'luxury-sans': {
        id: 'luxury-sans',
        heading: "'Montserrat', sans-serif",
        body: "'Plus Jakarta Sans', sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        vibe: 'Luxurious sans-serif'
    },
}

/**
 * Get a font pairing by its ID
 */
export const getFontPairingById = (id) => {
    return fontPairings[id] || fontPairings['classic']
}

/**
 * Get all font pairing IDs
 */
export const getAllFontPairingIds = () => {
    return Object.keys(fontPairings)
}

export default fontPairings
