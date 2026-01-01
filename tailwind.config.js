/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'playfair': ['"Playfair Display"', 'serif'],
                'lora': ['Lora', 'serif'],
                'crimson': ['"Crimson Text"', 'serif'],
                'inter': ['Inter', 'sans-serif'],
                'dm-sans': ['"DM Sans"', 'sans-serif'],
                'raleway': ['Raleway', 'sans-serif'],
            },
            colors: {
                'cream': '#FFF9F0',
                'warm-brown': '#8B7355',
                'soft-gold': '#D4AF37',
                'mystical-purple': '#9B7EBD',
                'deep-midnight': '#1A1A2E',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'sparkle': 'sparkle 1.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                },
            },
        },
    },
    plugins: [],
}
