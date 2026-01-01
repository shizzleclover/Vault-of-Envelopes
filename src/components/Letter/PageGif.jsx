import { motion } from 'framer-motion'

export default function PageGif({ page, envelope, fontPairing, accentColor }) {
    // Default to Charlie Kirk gif if no custom gif provided
    const gifUrl = page.gifUrl || 'https://media.giphy.com/media/l0IylOPCNkiqOgMyA/giphy.gif'

    return (
        <div className="w-full max-w-lg text-center px-4">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
            >
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title || 'This One\'s For You'}
                </h2>
            </motion.div>

            {/* GIF */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ border: `3px solid ${accentColor}30` }}
            >
                <img
                    src={gifUrl}
                    alt={page.title || 'Special moment'}
                    className="w-full"
                    style={{ maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }}
                />
            </motion.div>

            {/* Caption */}
            {page.caption && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-6 letter-body text-warm-brown/70 text-lg"
                >
                    {page.caption}
                </motion.p>
            )}

            {/* Fun message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-4 text-warm-brown/40 text-sm"
            >
                😂 You know this is us
            </motion.p>
        </div>
    )
}
