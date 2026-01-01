import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PageYoutube({ page, envelope, fontPairing, accentColor }) {
    const [isLoaded, setIsLoaded] = useState(false)

    // Teletubbies video ID (or a fun generic happy new year one if Teletubbies specific one isn't found).
    // Using a Teletubbies theme song or intro as a safe bet for "Teletubby" reference.
    const videoId = "wbjKk5tXQfE" // Teletubbies Intro (Official)

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full aspect-video max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-4 z-10"
                style={{ borderColor: accentColor }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoaded(true)}
                    className="w-full h-full object-cover"
                ></iframe>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center"
            >
                <h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    style={{
                        fontFamily: fontPairing.heading,
                        color: accentColor
                    }}
                >
                    Happy new year Teletubby
                </h1>
                <p className="text-warm-brown/60 text-lg font-serif italic">
                    (Press play if it doesn't start automatically)
                </p>
            </motion.div>
        </div>
    )
}
