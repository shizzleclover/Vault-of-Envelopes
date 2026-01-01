import { motion } from 'framer-motion'

export default function PageIntro({ page, envelope, fontPairing, accentColor }) {
    return (
        <div className="w-full max-w-lg text-center">
            {/* Title - "Dear Name," */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="letter-heading text-4xl md:text-5xl mb-8"
                style={{ color: accentColor }}
            >
                {page.title}{/* Removed hardcoded fallback */}
            </motion.h1>

            {/* Content */}
            {page.content && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="letter-body text-lg md:text-xl text-warm-brown/80 leading-relaxed"
                >
                    {page.content}
                </motion.p>
            )}

            {/* Decorative element */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-12 mx-auto w-24 h-0.5"
                style={{ backgroundColor: `${accentColor}40` }}
            />

            {/* Swipe hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-8 text-warm-brown/40 text-sm letter-body"
            >
                Swipe to begin ↓
            </motion.p>
        </div>
    )
}
