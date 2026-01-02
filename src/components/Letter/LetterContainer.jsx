import { useState, useCallback, useEffect } from 'react'
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
import PageTyping from './PageTyping'
import PageGif from './PageGif'
import PageCelebration from './PageCelebration'
import { FloatingParticles } from './FloatingDecorations'


export default function LetterContainer({ envelope, onClose }) {
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState(0)

    // Use pages directly from the envelope data
    const pages = envelope.letter?.pages || []

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

    // Handle swipe gestures - improved sensitivity
    const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
        // Use velocity for snappier navigation
        const swipeThreshold = 30
        const velocityThreshold = 0.3

        if (!active) {
            // Check both distance and velocity for better detection
            const shouldNavigate = Math.abs(my) > swipeThreshold || Math.abs(vy) > velocityThreshold

            if (shouldNavigate) {
                if ((my < 0 || vy > velocityThreshold) && currentPage < pages.length - 1) {
                    goToPage(currentPage + 1)
                } else if ((my > 0 || vy < -velocityThreshold) && currentPage > 0) {
                    goToPage(currentPage - 1)
                }
            }
        }
    }, {
        axis: 'y',
        filterTaps: true,
        threshold: 10,
    })

    // Handle mouse wheel scroll for page navigation
    useEffect(() => {
        let lastScrollTime = 0
        const scrollCooldown = 500 // ms between scroll actions

        const handleWheel = (e) => {
            const now = Date.now()
            if (now - lastScrollTime < scrollCooldown) return

            // Prevent default scroll behavior
            e.preventDefault()

            if (e.deltaY > 0 && currentPage < pages.length - 1) {
                // Scroll down = next page
                goToPage(currentPage + 1)
                lastScrollTime = now
            } else if (e.deltaY < 0 && currentPage > 0) {
                // Scroll up = previous page
                goToPage(currentPage - 1)
                lastScrollTime = now
            }
        }

        window.addEventListener('wheel', handleWheel, { passive: false })
        return () => window.removeEventListener('wheel', handleWheel)
    }, [currentPage, pages.length, goToPage])

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
            case 'typing':
                return <PageTyping {...pageProps} />
            case 'gif':
                return <PageGif {...pageProps} />
            case 'celebration':
                return <PageCelebration {...pageProps} />
            default:
                return <div className="text-cream">Unknown page type</div>
        }
    }

    // Smoother, more luxurious transitions
    const pageVariants = {
        enter: (direction) => ({
            y: direction > 0 ? '80%' : '-80%',
            opacity: 0,
            scale: 0.9,
            rotateX: direction > 0 ? -15 : 15,
            filter: 'blur(10px)',
        }),
        center: {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
        },
        exit: (direction) => ({
            y: direction < 0 ? '80%' : '-80%',
            opacity: 0,
            scale: 0.9,
            rotateX: direction < 0 ? -15 : 15,
            filter: 'blur(10px)',
        }),
    }

    const transition = {
        y: { type: 'spring', stiffness: 100, damping: 20, mass: 0.8 },
        opacity: { duration: 0.4, ease: 'easeInOut' },
        scale: { type: 'spring', stiffness: 150, damping: 25 },
        rotateX: { type: 'spring', stiffness: 100, damping: 20 },
        filter: { duration: 0.3 }
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
            {/* Ambient floating particles */}
            <FloatingParticles accentColor={accentColor} count={6} />
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

            {/* Progress dots - hidden on mobile, visible on desktop */}
            <div className="fixed right-2 top-1/2 -translate-y-1/2 flex-col gap-2 z-50 hidden md:flex">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentPage
                            ? 'w-1.5 h-6'
                            : 'w-1.5 h-1.5 hover:scale-150 opacity-50 hover:opacity-100'
                            }`}
                        style={{
                            backgroundColor: index === currentPage
                                ? accentColor
                                : 'rgba(0,0,0,0.3)',
                        }}
                    />
                ))}
            </div>

            {/* Mobile navigation buttons */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 md:hidden">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center disabled:opacity-30 transition-all"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <span className="text-sm font-medium text-black/50">
                    {currentPage + 1} / {pages.length}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pages.length - 1}
                    className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center disabled:opacity-30 transition-all"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Page counter */}
            <div className="fixed top-6 right-6 z-50 font-inter text-black/40 text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                {currentPage + 1} / {pages.length}
            </div>
        </div>
    )
}
