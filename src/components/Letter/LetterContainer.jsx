import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { getLetterPaperById } from '../../utils/letterPapers'
import { getFontPairingById } from '../../utils/fontPairings'
import PageYoutube from './PageYoutube'
import PageIntro from './PageIntro'
import PageRecap from './PageRecap'
import PageSpotify from './PageSpotify'
import PageMovies from './PageMovies'
import PageMemories from './PageMemories'
import PageTarot from './PageTarot'
import PageMantra from './PageMantra'


export default function LetterContainer({ envelope, onClose }) {
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState(0)

    const isBoma = envelope.id === 'boma-2025';
    // If it's Boma, we might want to override pages or inject the YouTube page as the first one.
    // User asked "embed this as the youtube player... once the letter opens".
    // So we treat it as a special single-page or first-page experience.

    const pages = isBoma
        ? [{ type: 'youtube', id: 'special-boma' }, ...(envelope.letter?.pages || [])]
        : (envelope.letter?.pages || [])

    const paperStyle = getLetterPaperById(envelope.letter?.paperTexture)
    const fontPairing = getFontPairingById(envelope.letter?.fontPairing)
    const accentColor = envelope.letter?.accentColor || '#D4AF37'
    const envelopeColor = envelope.envelope?.color || paperStyle.background;

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
            case 'youtube':
                return <PageYoutube {...pageProps} />
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
            case 'mantra':
                return <PageMantra {...pageProps} />
            default:
                return <div className="text-cream">Unknown page type</div>
        }
    }

    // Smoother Transitions
    const pageVariants = {
        enter: (direction) => ({
            y: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            y: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction) => ({
            y: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95,
        }),
    }

    const transition = {
        y: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
    }

    return (
        <div
            className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden touch-pan-y"
            style={{
                background: envelopeColor, // Dynamic background based on envelope color
                backgroundImage: paperStyle.texture !== 'none' ? paperStyle.texture : undefined,
                touchAction: 'pan-y'
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
                className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 border border-black/5 transition-all group backdrop-blur-sm"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-black/60 group-hover:text-black transition-colors"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page content */}
            <div className="letter-container w-full min-h-full flex items-center justify-center relative py-20 px-4">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={transition}
                        className="w-full max-w-4xl min-h-[60vh] flex flex-col items-center justify-center"
                    >
                        {pages[currentPage] && renderPage(pages[currentPage])}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-black/5 px-2 py-4 rounded-full backdrop-blur-md">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`transition-all duration-300 ${index === currentPage
                            ? 'w-2 h-8 rounded-full'
                            : 'w-2 h-2 rounded-full hover:scale-125' // Vertical active indicator
                            }`}
                        style={{
                            backgroundColor: index === currentPage
                                ? accentColor
                                : 'rgba(0,0,0,0.2)',
                        }}
                    />
                ))}
            </div>

            {/* Page counter */}
            <div className="fixed top-6 right-6 z-50 font-inter text-black/40 text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                {currentPage + 1} / {pages.length}
            </div>
        </div>
    )
}
