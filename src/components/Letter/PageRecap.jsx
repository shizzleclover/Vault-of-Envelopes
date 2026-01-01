import { motion } from 'framer-motion'

export default function PageRecap({ page, envelope, fontPairing, accentColor }) {
    // Split content into words for word-by-word animation
    const words = (page.content || '').split(' ')

    // Container animation
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3,
            },
        },
    }

    // Word animation
    const wordVariant = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    }

    return (
        <div className="w-full max-w-2xl px-4">
            {/* Title if present */}
            {page.title && (
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="letter-heading text-2xl md:text-3xl mb-8 text-center"
                    style={{ color: accentColor }}
                >
                    {page.title}
                </motion.h2>
            )}

            {/* Word-by-word content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="text-center"
            >
                <p className="letter-body text-xl md:text-2xl text-warm-brown/80 leading-relaxed">
                    {words.map((word, index) => (
                        <motion.span
                            key={index}
                            variants={wordVariant}
                            className="inline-block mr-2"
                        >
                            {word}
                        </motion.span>
                    ))}
                </p>
            </motion.div>

            {/* Decorative quote marks */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-20 left-10 pointer-events-none"
            >
                <svg width="80" height="80" viewBox="0 0 24 24" fill={accentColor}>
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
            </motion.div>
        </div>
    )
}
