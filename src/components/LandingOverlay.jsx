import { motion } from 'framer-motion'
import { useState } from 'react'

export default function LandingOverlay({ onEnter, onInteract }) {
    const [isExiting, setIsExiting] = useState(false)

    const handleEnter = () => {
        if (onInteract) onInteract()
        setIsExiting(true)
        setTimeout(onEnter, 800) // Wait for animation
    }

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-midnight ${isExiting ? 'pointer-events-none' : ''}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
            >
                {/* Logo or Icon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                >
                    <div className="absolute inset-0 border-2 border-soft-gold/30 rounded-full" />
                    <div className="absolute inset-2 border-2 border-soft-gold/50 rounded-full border-dashed" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">✉️</div>
                </motion.div>

                <h1 className="font-playfair text-4xl md:text-5xl text-cream mb-4 text-glow-gold">
                    Vault of Envelopes
                </h1>
                <p className="font-body text-cream/60 mb-12 tracking-widest uppercase text-sm">
                    A Collection of Memories
                </p>

                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    className="px-8 py-3 border border-soft-gold text-soft-gold rounded-full font-body tracking-wider transition-colors hover:bg-soft-gold/10"
                >
                    ENTER VAULT
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
