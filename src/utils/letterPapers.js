/**
 * Letter paper styles - CSS-based textures and backgrounds
 * No image files needed - all done with CSS gradients and patterns
 */

export const letterPapers = {
    'vintage-cream': {
        id: 'vintage-cream',
        name: 'Vintage Cream',
        background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D0 100%)',
        texture: 'none',
        boxShadow: 'inset 0 0 30px rgba(139, 115, 85, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)',
        border: 'none',
        className: 'paper-vintage'
    },

    'smooth-white': {
        id: 'smooth-white',
        name: 'Smooth White',
        background: '#FFFFFF',
        texture: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '2px solid #E5E5E5',
        className: 'paper-smooth'
    },

    'watercolor-wash': {
        id: 'watercolor-wash',
        name: 'Watercolor Wash',
        background: 'linear-gradient(135deg, #FFF5E1 0%, #FFE9D6 50%, #FFF0E8 100%)',
        texture: 'radial-gradient(ellipse at 30% 40%, rgba(255, 255, 255, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255, 220, 200, 0.3) 0%, transparent 40%)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        border: 'none',
        className: 'paper-watercolor'
    },

    'torn-edges': {
        id: 'torn-edges',
        name: 'Torn Edges',
        background: '#FFF9F0',
        texture: 'none',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        border: 'none',
        clipPath: 'polygon(0 2%, 98% 0, 100% 98%, 2% 100%)',
        className: 'paper-torn'
    },

    'lined-notebook': {
        id: 'lined-notebook',
        name: 'Lined Notebook',
        background: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139, 115, 85, 0.15) 31px, rgba(139, 115, 85, 0.15) 32px), #FFFEF7',
        texture: 'none',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)',
        border: '1px dashed #D4D4D4',
        className: 'paper-lined'
    },

    'coffee-stained': {
        id: 'coffee-stained',
        name: 'Coffee Stained',
        background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 90, 43, 0.08) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(139, 90, 43, 0.05) 0%, transparent 35%), #F4E8D0',
        texture: 'none',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        border: 'none',
        className: 'paper-coffee'
    },

    'parchment': {
        id: 'parchment',
        name: 'Parchment',
        background: 'linear-gradient(90deg, rgba(139, 115, 85, 0.05) 0%, transparent 50%, rgba(139, 115, 85, 0.05) 100%), linear-gradient(180deg, #F5EEE0 0%, #E8DFD0 100%)',
        texture: 'none',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
        border: 'none',
        className: ''
    },

    'soft-blush': {
        id: 'soft-blush',
        name: 'Soft Blush',
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
        texture: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: 'none',
        className: ''
    },

    'sage-mist': {
        id: 'sage-mist',
        name: 'Sage Mist',
        background: 'linear-gradient(135deg, #F0F5EE 0%, #E5EDE2 100%)',
        texture: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: 'none',
        className: ''
    },

    'lavender-haze': {
        id: 'lavender-haze',
        name: 'Lavender Haze',
        background: 'linear-gradient(135deg, #F5F0FA 0%, #EBE3F5 100%)',
        texture: 'radial-gradient(ellipse at 50% 50%, rgba(155, 126, 189, 0.05) 0%, transparent 50%)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: 'none',
        className: ''
    },

    'sky-whisper': {
        id: 'sky-whisper',
        name: 'Sky Whisper',
        background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F2FC 100%)',
        texture: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: 'none',
        className: ''
    },

    'golden-hour': {
        id: 'golden-hour',
        name: 'Golden Hour',
        background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF5E0 100%)',
        texture: 'radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: 'none',
        className: ''
    },
}

/**
 * Get a letter paper by its ID
 */
export const getLetterPaperById = (id) => {
    return letterPapers[id] || letterPapers['vintage-cream']
}

/**
 * Get all letter paper IDs
 */
export const getAllLetterPaperIds = () => {
    return Object.keys(letterPapers)
}

export default letterPapers
