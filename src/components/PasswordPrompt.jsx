import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PasswordPrompt({ envelope, onSuccess, onClose }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (password === envelope.password) {
            onSuccess()
        } else {
            setError(true)
            setPassword('')
            // Clear error after 2 seconds
            setTimeout(() => setError(false), 2000)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop with blur */}
                <div className="absolute inset-0 bg-deep-midnight/80 backdrop-blur-md" />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-gradient-to-b from-cream/10 to-cream/5 backdrop-blur-xl border border-cream/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-4">🔮</div>
                        <h2 className="font-playfair text-2xl text-cream mb-2">
                            Unlock Your Message
                        </h2>
                        <p className="font-inter text-cream/60 text-sm">
                            Whisper the secret word...
                        </p>
                    </div>

                    {/* Recipient indicator */}
                    <div className="text-center mb-6">
                        <span
                            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: `${envelope.envelope?.color}20`,
                                color: envelope.envelope?.color,
                                border: `1px solid ${envelope.envelope?.color}40`
                            }}
                        >
                            For {envelope.recipient}
                        </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Password input */}
                        <div className="relative mb-6">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoFocus
                                className={`w-full px-4 py-4 bg-cream/5 border rounded-xl text-cream placeholder:text-cream/30 focus:outline-none transition-all ${error
                                        ? 'border-red-400/50 animate-shake'
                                        : 'border-cream/20 focus:border-soft-gold/50'
                                    }`}
                            />

                            {/* Show/hide password toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/60"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400/80 text-sm text-center mb-4 font-inter"
                                >
                                    The stars have not aligned... try again 🌙
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-soft-gold/20 to-mystical-purple/20 hover:from-soft-gold/30 hover:to-mystical-purple/30 border border-soft-gold/40 rounded-xl text-cream font-medium transition-all hover:shadow-lg hover:shadow-soft-gold/20"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Reveal
                                <span>✨</span>
                            </span>
                        </button>
                    </form>

                    {/* Decorative elements */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-soft-gold/30 rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-soft-gold/30 rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-soft-gold/30 rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-soft-gold/30 rounded-br-lg" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
