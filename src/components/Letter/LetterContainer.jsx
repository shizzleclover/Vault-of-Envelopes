import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { getLetterPaperById } from '../../utils/letterPapers'
import { getFontPairingById } from '../../utils/fontPairings'
import PageIntro from './PageIntro'
import PageRecap from './PageRecap'
import PageSpotify from './PageSpotify'
import PageMovies from './PageMovies'
import PageMemories from './PageMemories'
import PageTarot from './PageTarot'

export default function LetterContainer({ envelope, onClose }) {
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState(0)

    const pages = envelope.letter?.pages || []
    const paperStyle = getLetterPaperById(envelope.letter?.paperTexture)
    const fontPairing = getFontPairingById(envelope.letter?.fontPairing)
    const accentColor = envelope.letter?.accentColor || '#D4AF37'

    // Navigate to next/previous page
    const goToPage = useCallback((newPage) => {
        if (newPage < 0 || newPage >= pages.length) return
        setDirection(newPage > currentPage ? 1 : -1)
        setCurrentPage(newPage)
    }, [currentPage, pages.length])

    // Handle swipe gestures
    const bind = useDrag(({ active, movement: [, my], direction: [, yDir], cancel }) => {
        if (!active && Math.abs(my) > 50) {
            if (my < 0 && currentPage < pages.length - 1) {
                goToPage(currentPage + 1)
            } else if (my > 0 && currentPage > 0) {
                goToPage(currentPage - 1)
            }
        }
    }, {
        axis: 'y',
        filterTaps: true,
    })

    // Render page based on type
    const renderPage = (page) => {
        const pageProps = {
            page,
            envelope,
            fontPairing,
            accentColor,
        }

        switch (page.type) {
            case 'intro':
                return <PageIntro {...pageProps} />
            case 'recap':
                return <PageRecap {...pageProps} />
            case 'spotify':
                return <PageSpotify {...pageProps} />
            case 'movies':
                return <PageMovies {...pageProps} />
            case 'memories':
                return <PageMemories {...pageProps} />
            case 'tarot':
                return <PageTarot {...pageProps} />
            default:
                return <div className="text-cream">Unknown page type</div>
        }
    }

    // Page transition variants
    const pageVariants = {
        enter: (direction) => ({
            y: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            y: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    }

    return (
        <div
            className="fixed inset-0 z-40 overflow-hidden"
            style={{
                background: paperStyle.background,
                backgroundImage: paperStyle.texture !== 'none' ? paperStyle.texture : undefined,
            }}
            {...bind()}
        >
            {/* CSS variables for fonts */}
            <style>{`
        .letter-container {
          --font-heading: ${fontPairing.heading};
          --font-body: ${fontPairing.body};
          --accent-color: ${accentColor};
        }
        .letter-heading {
          font-family: var(--font-heading);
          font-weight: ${fontPairing.headingWeight};
        }
        .letter-body {
          font-family: var(--font-body);
          font-weight: ${fontPairing.bodyWeight};
        }
      `}</style>

            {/* Close button */}
            <button
                onClick={onClose}
                className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20 border border-warm-brown/20 transition-all group"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-warm-brown/60 group-hover:text-warm-brown transition-colors"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page content */}
            <div className="letter-container w-full h-full relative">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            y: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex items-center justify-center p-8"
                    >
                        {pages[currentPage] && renderPage(pages[currentPage])}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`transition-all duration-300 ${index === currentPage
                                ? 'w-6 h-2 rounded-full'
                                : 'w-2 h-2 rounded-full hover:scale-125'
                            }`}
                        style={{
                            backgroundColor: index === currentPage
                                ? accentColor
                                : `${accentColor}40`,
                        }}
                    />
                ))}
            </div>

            {/* Navigation hints */}
            {currentPage < pages.length - 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 text-center"
                >
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-warm-brown/40"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </motion.div>
            )}

            {/* Page counter */}
            <div className="fixed top-6 right-6 z-50 font-inter text-warm-brown/40 text-sm">
                {currentPage + 1} / {pages.length}
            </div>
        </div>
    )
}
