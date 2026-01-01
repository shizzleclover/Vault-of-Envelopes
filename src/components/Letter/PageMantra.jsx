import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PageMantra({ page, envelope, fontPairing, accentColor }) {
    const [isRevealed, setIsRevealed] = useState(false)
    const [imageError, setImageError] = useState(false)

    // Get mantra card data from envelope
    const mantraCard = envelope.mantraCard || {
        name: 'Mantra for 2026',
        mantra: 'Trust within the unfolding.', // Default fallback
        image: null
    }

    // Auto-reveal after a moment
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRevealed(true)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full max-w-md text-center relative min-h-[80vh] flex flex-col items-center justify-center">
            {/* Background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-gradient-to-b from-deep-midnight via-deep-midnight to-mystical-purple/20 -z-10"
            />

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
            >
                <span className="text-4xl mb-4 block">✨</span>
                <h2 className="letter-heading text-2xl md:text-3xl text-cream">
                    Your Mantra for 2026
                </h2>
            </motion.div>

            {/* Card Container */}
            <motion.div
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{
                    rotateY: isRevealed ? 0 : 180,
                    scale: 1,
                }}
                transition={{
                    duration: 1.2,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                }}
                className="relative perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Card */}
                <div
                    className="relative w-56 h-80 md:w-64 md:h-96 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        boxShadow: isRevealed
                            ? `0 0 60px ${accentColor}40, 0 20px 50px rgba(0,0,0,0.5)`
                            : '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Back */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-soft-gold/20 to-deep-midnight flex items-center justify-center"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="w-20 h-20 border-2 border-cream/30 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🧘‍♀️</span>
                        </div>
                    </motion.div>

                    {/* Front */}
                    <div
                        className="absolute inset-0 bg-deep-midnight flex flex-col items-center justify-center p-4"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {!imageError && mantraCard.image ? (
                            <img
                                src={mantraCard.image}
                                alt={mantraCard.name}
                                className="w-full h-full object-cover absolute inset-0"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            // Text Fallback
                            <div className="flex flex-col items-center justify-center h-full p-4 border-2 border-cream/10 m-2 rounded-lg">
                                <span className="text-5xl mb-6 opacity-80">🙏</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/90 via-transparent to-transparent" />
                    </div>
                </div>
            </motion.div>

            {/* Mantra Text */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="letter-heading text-2xl md:text-3xl text-soft-gold mt-8 mb-4 px-4"
            >
                "{mantraCard.mantra}"
            </motion.h3>
        </div>
    )
}
