import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTarotCardForEnvelope } from '../../utils/randomTarot'

export default function PageTarot({ page, envelope, fontPairing, accentColor }) {
    const [isRevealed, setIsRevealed] = useState(false)
    const [tarotCard, setTarotCard] = useState(null)
    const [imageError, setImageError] = useState(false)

    // Get assigned tarot card on mount
    // Get assigned tarot card on mount
    useEffect(() => {
        // If envelope has a specific manual tarot card assigned, use it
        if (envelope.tarotCard && envelope.tarotCard.name) {
            setTarotCard(envelope.tarotCard)
        } else {
            // Fallback to random assignment if no manual card is set (preserving old behavior just in case)
            const card = getTarotCardForEnvelope(envelope.id)
            setTarotCard(card)
        }

        // Auto-reveal after a moment
        const timer = setTimeout(() => {
            setIsRevealed(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [envelope.id, envelope.tarotCard])

    if (!tarotCard) {
        return (
            <div className="flex items-center justify-center">
                <div className="mystical-loader" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-md text-center relative flex flex-col items-center px-4 pb-20">
            {/* Background transition to dark */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-gradient-to-b from-deep-midnight via-deep-midnight to-mystical-purple/20 -z-10"
            />

            {/* Sparkle particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            opacity: 0,
                            x: Math.random() * 400 - 200,
                            y: Math.random() * 400 - 200,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 2,
                            repeat: Infinity,
                        }}
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-soft-gold rounded-full"
                    />
                ))}
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4"
            >
                <span className="text-3xl mb-2 block">🔮</span>
                <h2 className="letter-heading text-xl md:text-2xl text-cream">
                    Your Badge for 2026
                </h2>
            </motion.div>

            {/* Card container with flip animation */}
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
                <div
                    className="relative w-44 h-64 md:w-52 md:h-72 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        boxShadow: isRevealed
                            ? `0 0 60px ${accentColor}40, 0 20px 50px rgba(0,0,0,0.5)`
                            : '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Card back (visible before flip) */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-mystical-purple to-deep-midnight flex items-center justify-center"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="w-20 h-20 border-2 border-soft-gold/50 rounded-full flex items-center justify-center">
                            <span className="text-3xl">✨</span>
                        </div>
                    </motion.div>

                    {/* Card front */}
                    <div
                        className="absolute inset-0 bg-deep-midnight flex flex-col items-center justify-center p-4"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Card image or placeholder */}
                        {!imageError && tarotCard.image ? (
                            <img
                                src={tarotCard.image}
                                alt={tarotCard.name}
                                className="w-full h-full object-cover absolute inset-0"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            // Text-only fallback
                            <div className="flex flex-col items-center justify-center h-full">
                                <span
                                    className="text-6xl mb-4 opacity-60"
                                    style={{ color: accentColor }}
                                >
                                    ✦
                                </span>
                                <span
                                    className="font-playfair text-3xl text-center"
                                    style={{ color: accentColor }}
                                >
                                    {tarotCard.numeral}
                                </span>
                            </div>
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight via-transparent to-transparent" />
                    </div>
                </div>
            </motion.div>

            {/* Card name */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="letter-heading text-2xl md:text-3xl text-soft-gold mt-4 mb-2"
            >
                {tarotCard.name}
            </motion.h3>

            {/* Card meaning */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="letter-body text-cream/80 text-base leading-relaxed max-w-sm px-2"
            >
                {tarotCard.meaning}
            </motion.p>

            {/* Closing message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="mt-6"
            >
                <p className="letter-body text-cream/40 text-sm">
                    With love,
                </p>
                <p className="letter-heading text-cream/60 text-lg mt-1">
                    ✨ 2026 ✨
                </p>
            </motion.div>
        </div>
    )
}
