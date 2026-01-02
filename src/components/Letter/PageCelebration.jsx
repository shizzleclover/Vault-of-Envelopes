import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Confetti piece component
const ConfettiPiece = ({ delay, x, color }) => (
    <motion.div
        className="absolute pointer-events-none"
        initial={{
            y: -20,
            x: x,
            opacity: 1,
            rotate: 0,
            scale: 1
        }}
        animate={{
            y: '100vh',
            opacity: [1, 1, 0],
            rotate: [0, 360, 720],
            scale: [1, 1.2, 0.8]
        }}
        transition={{
            duration: 4 + Math.random() * 2,
            delay: delay,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: Math.random() * 2
        }}
        style={{
            left: `${x}%`,
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}
    />
)

// Floating light orb
const LightOrb = ({ delay, size, x, y }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0) 70%)',
            filter: 'blur(8px)',
        }}
        animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            y: [0, -20, 0],
        }}
        transition={{
            duration: 3 + Math.random() * 2,
            delay: delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
)

export default function PageCelebration({ page, accentColor }) {
    const [confetti, setConfetti] = useState([])
    const [orbs, setOrbs] = useState([])

    const colors = [
        '#FFD700', // Gold
        '#FF6B6B', // Coral
        '#4ECDC4', // Teal
        '#A855F7', // Purple
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#EC4899', // Pink
    ]

    useEffect(() => {
        // Generate confetti pieces
        const pieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
        }))
        setConfetti(pieces)

        // Generate light orbs
        const orbList = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 40 + Math.random() * 60,
            delay: Math.random() * 2,
        }))
        setOrbs(orbList)
    }, [])

    return (
        <motion.div
            className="relative w-full min-h-full flex flex-col items-center justify-center p-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                }}
            />

            {/* Animated gradient overlay */}
            <motion.div
                className="absolute inset-0 z-0 opacity-30"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 80%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 80%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />

            {/* Light orbs */}
            {orbs.map(orb => (
                <LightOrb
                    key={orb.id}
                    x={orb.x}
                    y={orb.y}
                    size={orb.size}
                    delay={orb.delay}
                />
            ))}

            {/* Confetti */}
            {confetti.map(piece => (
                <ConfettiPiece
                    key={piece.id}
                    x={piece.x}
                    delay={piece.delay}
                    color={piece.color}
                />
            ))}

            {/* Content */}
            <motion.div
                className="relative z-10 text-center max-w-2xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                {/* Crown/trophy icon */}
                <motion.div
                    className="text-6xl mb-6"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🏆
                </motion.div>

                {/* Title with glow */}
                <motion.h2
                    className="font-playfair text-4xl md:text-5xl font-bold mb-4"
                    style={{
                        color: '#FFD700',
                        textShadow: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
                    }}
                    animate={{
                        textShadow: [
                            '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
                            '0 0 30px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.5)',
                            '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {page.title || 'Investment Banking'}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    className="font-inter text-xl text-white/80 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {page.subtitle || '3 Years of Brotherhood'}
                </motion.p>

                {/* Main content */}
                {page.content && (
                    <motion.div
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="font-inter text-white/90 text-lg leading-relaxed whitespace-pre-line">
                            {page.content}
                        </p>
                    </motion.div>
                )}

                {/* Member list */}
                {page.members && (
                    <motion.div
                        className="mt-8 flex flex-wrap justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {page.members.map((member, idx) => (
                            <motion.span
                                key={idx}
                                className="px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    background: 'rgba(255,215,0,0.2)',
                                    border: '1px solid rgba(255,215,0,0.4)',
                                    color: '#FFD700',
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 + idx * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {member}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Bottom sparkles */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to top, rgba(255,215,0,0.1) 0%, transparent 100%)',
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
        </motion.div>
    )
}
