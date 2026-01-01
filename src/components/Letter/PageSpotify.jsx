import { motion } from 'framer-motion'

export default function PageSpotify({ page, envelope, fontPairing, accentColor }) {
    const hasPlaylist = page.playlistUrl && page.playlistUrl.length > 0

    return (
        <div className="w-full max-w-lg text-center">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="text-4xl mb-4 block">🎵</span>
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title || 'Your 2025 Vibes'}
                </h2>
            </motion.div>

            {/* Spotify embed or placeholder */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-xl overflow-hidden shadow-lg"
            >
                {hasPlaylist ? (
                    <iframe
                        src={page.playlistUrl}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                    />
                ) : (
                    // Placeholder when no playlist is set
                    <div
                        className="h-[380px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed"
                        style={{
                            borderColor: `${accentColor}40`,
                            backgroundColor: `${accentColor}10`,
                        }}
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={accentColor}
                            strokeWidth="1.5"
                            className="mb-4 opacity-50"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14.5c2.5-1.5 5.5-1.5 8 0" />
                            <path d="M7 11.5c3.5-2 6.5-2 10 0" />
                            <path d="M6 8.5c4.5-2.5 7.5-2.5 12 0" />
                        </svg>
                        <p className="letter-body text-warm-brown/50 text-sm">
                            Playlist coming soon...
                        </p>
                        <p className="letter-body text-warm-brown/30 text-xs mt-2">
                            Add a Spotify embed URL in the admin panel
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Caption */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 letter-body text-warm-brown/50 text-sm"
            >
                Curated just for you ✨
            </motion.p>
        </div>
    )
}
