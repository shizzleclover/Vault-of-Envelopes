import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageMemories({ page, envelope, fontPairing, accentColor }) {
    const images = page.images || []
    const [selectedImage, setSelectedImage] = useState(null)

    // Container animation
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    // Image animation
    const imageVariant = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
            },
        },
    }

    return (
        <div className="w-full max-w-2xl text-center">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="text-4xl mb-4 block">📷</span>
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title || 'Highlights'}
                </h2>
            </motion.div>

            {/* Image grid */}
            {images.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                >
                    {images.map((image, index) => (
                        <motion.button
                            key={index}
                            variants={imageVariant}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedImage(image)}
                            className="aspect-square rounded-lg overflow-hidden shadow-md"
                            style={{
                                border: `2px solid ${accentColor}30`,
                            }}
                        >
                            <img
                                src={image}
                                alt={`Memory ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-warm-brown/10">
                      <span class="text-2xl">📷</span>
                    </div>
                  `
                                }}
                            />
                        </motion.button>
                    ))}
                </motion.div>
            ) : (
                // Placeholder when no images
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-12 rounded-xl border-2 border-dashed"
                    style={{ borderColor: `${accentColor}30` }}
                >
                    <div className="text-4xl mb-4">📸</div>
                    <p className="letter-body text-warm-brown/50 mb-2">
                        Memories coming soon...
                    </p>
                    <p className="letter-body text-warm-brown/30 text-sm">
                        Add photos in the admin panel
                    </p>
                </motion.div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-deep-midnight/90 backdrop-blur-md p-8"
                    >
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            src={selectedImage}
                            alt="Memory"
                            className="max-w-full max-h-full rounded-xl shadow-2xl"
                            style={{ border: `3px solid ${accentColor}40` }}
                        />

                        {/* Close hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-8 text-cream/50 text-sm"
                        >
                            Tap anywhere to close
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 letter-body text-warm-brown/40 text-sm"
            >
                Here's to making more memories ✨
            </motion.p>
        </div>
    )
}
