import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Trending meme GIFs - one per envelope based on ID
const MEME_GIFS = [
    'https://media.giphy.com/media/xTiTnDAP0RiCo9k85W/giphy.gif', // LeBron confused
    'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif', // Blinking guy meme
    'https://media.giphy.com/media/kc0kqKNFu7v35gPkwB/giphy.gif', // The Rock eyebrow raise
    'https://media.giphy.com/media/3o7TKnO6Wve6502iJ2/giphy.gif', // Michael Scott thinking
    'https://media.giphy.com/media/g7GKcSzwQfugw/giphy.gif', // Nick Young confused ???
    'https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif', // Vibing cat
    'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif', // Roll Safe thinking
    'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', // Fire
    'https://media.giphy.com/media/3og0IMJcSI8p6hYQXS/giphy.gif', // Oprah excited
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif', // Leonardo DiCaprio cheers
]

// Error meme GIFs
const ERROR_GIFS = [
    'https://media.giphy.com/media/STfLOU6iRBRunMciZv/giphy.gif', // Crying Jordan
    'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif', // Charlie Kirk small face
    'https://media.giphy.com/media/xT1XGU1AHz9Fe8tmp2/giphy.gif', // Drake no
    'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif', // No no no guy
    'https://media.giphy.com/media/hWGBKil1b9fpR5go1f/giphy.gif', // Sad cat
]

// Liquid glass button style
const liquidGlassButton = {
    background: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
}

// Simple hash function to get consistent GIF per envelope
const getGifForEnvelope = (envelopeId) => {
    let hash = 0
    const str = String(envelopeId)
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return MEME_GIFS[Math.abs(hash) % MEME_GIFS.length]
}

export default function PasswordPrompt({ envelope, onSuccess, onClose }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorGif, setErrorGif] = useState(null)

    // Get consistent GIF for this envelope
    const envelopeGif = useMemo(() => getGifForEnvelope(envelope.id), [envelope.id])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (password === envelope.password) {
            onSuccess()
        } else {
            setError(true)
            setErrorGif(ERROR_GIFS[Math.floor(Math.random() * ERROR_GIFS.length)])
            setPassword('')
            setTimeout(() => {
                setError(false)
                setErrorGif(null)
            }, 3000)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={onClose}
            >
                {/* Backdrop with heavy blur - Apple style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0"
                    style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(50px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(50px) saturate(200%)',
                    }}
                />

                <div className="flex min-h-full p-4">
                    {/* Liquid Glass Modal */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        className="relative m-auto max-w-md w-full overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            boxShadow: `
                            0 10px 40px rgba(0, 0, 0, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Inner highlight overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.15) 100%)',
                                borderRadius: '32px',
                            }}
                        />

                        <div className="relative p-8">
                            {/* Close button - Liquid glass pill */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full"
                                style={liquidGlassButton}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </motion.button>

                            {/* Envelope-specific GIF */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, type: 'spring' }}
                                className="flex justify-center mb-6"
                            >
                                <div
                                    className="w-28 h-28 rounded-3xl overflow-hidden"
                                    style={{
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                    }}
                                >
                                    <img
                                        src={error ? errorGif : envelopeGif}
                                        alt="Fun meme"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>

                            {/* Header */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-center mb-6"
                            >
                                <h2
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                >
                                    Unlock Your Message
                                </h2>
                                <p
                                    className="text-sm"
                                    style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                                >
                                    Enter the secret code to reveal ✨
                                </p>
                            </motion.div>

                            {/* Recipient pill - Liquid glass style */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-center mb-6"
                            >
                                <span
                                    className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold"
                                    style={{
                                        ...liquidGlassButton,
                                        color: 'rgba(0, 0, 0, 0.7)',
                                    }}
                                >
                                    💌 For {envelope.recipient}
                                </span>
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Password input - Liquid glass style */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.25 }}
                                    className="relative mb-5"
                                >
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        autoFocus
                                        className="w-full px-5 py-4 text-base transition-all outline-none"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.65)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px',
                                            border: error
                                                ? '2px solid rgba(239, 68, 68, 0.6)'
                                                : '1px solid rgba(255, 255, 255, 0.5)',
                                            color: 'rgba(0, 0, 0, 0.85)',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-xl"
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </motion.div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="text-center mb-4 text-sm font-semibold"
                                            style={{ color: 'rgba(220, 38, 38, 0.85)' }}
                                        >
                                            Wrong password! 😅 Try again
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* Submit button - Liquid glass pill with gradient */}
                                <motion.button
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 rounded-full font-semibold text-white text-base transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 50%, #AF52DE 100%)',
                                        boxShadow: '0 6px 24px rgba(88, 86, 214, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        🔓 Reveal Message
                                    </span>
                                </motion.button>
                            </form>

                            {/* Fun footer meme GIFs */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-center gap-3 mt-6"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
                                    alt="party"
                                    className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                                    style={{
                                        opacity: 0.85,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                />
                                <motion.img
                                    whileHover={{ scale: 1.15, rotate: -5 }}
                                    src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif"
                                    alt="excited"
                                    className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                                    style={{
                                        opacity: 0.85,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                />
                                <motion.img
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    src="https://media.giphy.com/media/l0Iy6U1LCoBU1V7RS/giphy.gif"
                                    alt="cool"
                                    className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                                    style={{
                                        opacity: 0.85,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence >
    )
}
