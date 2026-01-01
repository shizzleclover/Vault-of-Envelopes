import { motion } from 'framer-motion'

export default function PageMovies({ page, envelope, fontPairing, accentColor }) {
    const movies = page.list || []

    // Container animation
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    }

    // Card flip animation
    const cardVariant = {
        hidden: {
            opacity: 0,
            rotateY: -90,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    }

    return (
        <div className="w-full max-w-lg text-center">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="text-4xl mb-4 block">🎬</span>
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title || 'Movies to Watch'}
                </h2>
            </motion.div>

            {/* Movie list */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-3"
            >
                {movies.length > 0 ? (
                    movies.map((movie, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariant}
                            className="relative p-4 rounded-xl border backdrop-blur-sm"
                            style={{
                                backgroundColor: `${accentColor}10`,
                                borderColor: `${accentColor}30`,
                            }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Number */}
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                                    style={{
                                        backgroundColor: `${accentColor}20`,
                                        color: accentColor,
                                    }}
                                >
                                    {index + 1}
                                </span>

                                {/* Movie title */}
                                <span className="letter-body text-warm-brown text-lg">
                                    {movie}
                                </span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div
                        className="p-8 rounded-xl border-2 border-dashed"
                        style={{ borderColor: `${accentColor}30` }}
                    >
                        <p className="letter-body text-warm-brown/50">
                            No movies added yet
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Footer text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: movies.length * 0.15 + 0.5 }}
                className="mt-8 letter-body text-warm-brown/40 text-sm"
            >
                Let's make movie nights happen 🍿
            </motion.p>
        </div>
    )
}
