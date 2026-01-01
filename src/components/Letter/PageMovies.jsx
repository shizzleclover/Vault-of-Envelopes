import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { searchMovie } from '../../utils/tmdb'

export default function PageMovies({ page, envelope, fontPairing, accentColor }) {
    const movies = page.list || []
    const [movieDetails, setMovieDetails] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovies = async () => {
            if (!movies.length) {
                setLoading(false)
                return
            }

            const promises = movies.map(async (movieTitle) => {
                const data = await searchMovie(movieTitle)
                return data || { title: movieTitle, notFound: true } // Fallback
            })

            const results = await Promise.all(promises)
            setMovieDetails(results)
            setLoading(false)
        }

        fetchMovies()
    }, [movies])

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

    // Card animation
    const cardVariant = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 200, damping: 20 }
        },
    }

    return (
        <div className="w-full max-w-4xl text-center flex flex-col items-center h-full">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 flex-shrink-0"
            >
                <span className="text-4xl mb-4 block">🎬</span>
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title}
                </h2>
            </motion.div>

            {/* Movie Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate={!loading ? "visible" : "hidden"}
                className="w-full h-full overflow-y-auto w-[650px] min-h-[300px] pr-2 -mr-2"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }}></div>
                    </div>
                ) : movieDetails.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                        {movieDetails.map((movie, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariant}
                                className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {movie.poster_path ? (
                                    <img
                                        src={movie.poster_path}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                                        style={{ backgroundColor: `${accentColor}10` }}
                                    >
                                        <span className="text-4xl mb-2">🎞️</span>
                                        <span className="letter-body font-bold text-warm-brown">{movie.title}</span>
                                    </div>
                                )}

                                {/* Overlay info on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center">
                                    <h3 className="font-bold mb-1 line-clamp-2">{movie.title}</h3>
                                    {movie.release_date && (
                                        <span className="text-xs opacity-80 mb-2">{movie.release_date.split('-')[0]}</span>
                                    )}
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                                        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="p-8 rounded-xl border-2 border-dashed mx-auto max-w-sm mt-10"
                        style={{ borderColor: `${accentColor}30` }}
                    >
                        <p className="letter-body text-warm-brown/50">
                            No movies added yet
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
