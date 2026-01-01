import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useCallback, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/three'
import { api } from '../api/client'
import Envelope from './Envelope'
import PasswordPrompt from './PasswordPrompt'
import LetterContainer from './Letter/LetterContainer'
import AudioPlayer from './AudioPlayer'
import LandingOverlay from './LandingOverlay'
import { useAudio } from '../hooks/useAudio'

export default function EnvelopeStack() {
    const [envelopes, setEnvelopes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedEnvelope, setSelectedEnvelope] = useState(null)
    const [openedEnvelope, setOpenedEnvelope] = useState(null)
    const [hasEntered, setHasEntered] = useState(false)

    // Landing Page Audio (Cece.mp3)
    const {
        play: playLanding,
        stop: stopLanding,
        isMuted,
        toggleMute,
        isBlocked,
        retryPlay
    } = useAudio('/Music/Cece.mp3', {
        volume: 0.6,
        fadeInDuration: 2000,
        loop: true
    })

    // Handle audio state based on navigation
    useEffect(() => {
        if (openedEnvelope) {
            stopLanding()
        } else if (hasEntered) {
            playLanding()
        }
    }, [openedEnvelope, hasEntered, playLanding, stopLanding])

    // Fetch envelopes from API on mount
    useEffect(() => {
        const fetchEnvelopes = async () => {
            try {
                const data = await api.fetchEnvelopes()
                setEnvelopes(data)
            } catch (err) {
                console.error('Failed to fetch envelopes:', err)
                setError('Failed to load envelopes')
                setError('Failed to load envelopes')
            } finally {
                setLoading(false)
            }
        }
        fetchEnvelopes()
    }, [])

    // Keyboard and mouse wheel navigation
    useEffect(() => {
        if (openedEnvelope) return // Don't navigate when letter is open

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setCurrentIndex(prev => Math.max(0, prev - 1))
            } else if (e.key === 'ArrowRight') {
                setCurrentIndex(prev => Math.min(envelopes.length - 1, prev + 1))
            }
        }

        const handleWheel = (e) => {
            // Prevent default scrolling
            e.preventDefault()

            // Use deltaY for vertical scroll, deltaX for horizontal
            const delta = e.deltaY || e.deltaX

            if (delta > 0) {
                // Scroll down/right = next envelope
                setCurrentIndex(prev => Math.min(envelopes.length - 1, prev + 1))
            } else if (delta < 0) {
                // Scroll up/left = previous envelope
                setCurrentIndex(prev => Math.max(0, prev - 1))
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('wheel', handleWheel)
        }
    }, [envelopes.length, openedEnvelope])

    // Spring for swipe animation
    const [{ x }, springApi] = useSpring(() => ({ x: 0 }))

    // Handle envelope tap
    const handleEnvelopeTap = useCallback((envelope) => {
        setSelectedEnvelope(envelope)
        setShowPassword(true)
    }, [])

    // Handle password success
    const handlePasswordSuccess = useCallback(() => {
        setShowPassword(false)
        setOpenedEnvelope(selectedEnvelope)
    }, [selectedEnvelope])

    // Handle letter close
    const handleCloseLetter = useCallback(() => {
        setOpenedEnvelope(null)
        setSelectedEnvelope(null)
    }, [])

    // Handle swipe gestures
    const bind = useDrag(({ active, movement: [mx] }) => {
        const threshold = 50

        if (active) {
            springApi.start({ x: mx, immediate: true })
        } else {
            if (Math.abs(mx) > threshold) {
                const newIndex = mx > 0
                    ? Math.max(0, currentIndex - 1)
                    : Math.min(envelopes.length - 1, currentIndex + 1)
                setCurrentIndex(newIndex)
            }
            springApi.start({ x: 0 })
        }
    }, {
        axis: 'x',
        filterTaps: true,
        rubberband: true,
    })

    // Loading state
    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-deep-midnight">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-cream/60 font-inter">Loading envelopes...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error && envelopes.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-deep-midnight">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-soft-gold/20 text-soft-gold rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Render letter view if envelope is opened
    if (openedEnvelope) {
        return (
            <>
                <LetterContainer
                    envelope={openedEnvelope}
                    onClose={handleCloseLetter}
                />
                <AudioPlayer src={openedEnvelope.backgroundMusic} />
            </>
        )
    }

    return (
        <div className="w-full h-full relative" {...bind()} style={{ touchAction: 'none' }}>
            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                className="touch-none"
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                    <pointLight position={[-5, -5, 5]} intensity={0.5} color="#D4AF37" />

                    {/* Environment for reflections */}
                    <Environment preset="city" />

                    {/* Contact shadows on ground */}
                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                    />

                    {/* Envelope Stack */}
                    <EnvelopeStackGroup
                        envelopes={envelopes}
                        currentIndex={currentIndex}
                        xOffset={x}
                        onEnvelopeTap={handleEnvelopeTap}
                    />
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                {/* Current recipient name */}
                <div className="text-center mb-4">
                    <h2 className="font-playfair text-2xl md:text-3xl text-cream text-glow-gold">
                        {envelopes[currentIndex]?.recipient}
                    </h2>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2">
                    {envelopes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${index === currentIndex
                                ? 'bg-soft-gold w-6'
                                : 'bg-cream/30 hover:bg-cream/50'
                                }`}
                        />
                    ))}
                </div>

                {/* Swipe hint */}
                <p className="text-center text-cream/40 text-sm mt-4 font-inter">
                    Swipe to explore • Tap to open
                </p>
            </div>

            {/* Envelope counter */}
            <div className="absolute top-6 left-6 font-inter text-cream/60 text-sm">
                {currentIndex + 1} / {envelopes.length}
            </div>

            {/* Password Prompt Modal */}
            {showPassword && selectedEnvelope && (
                <PasswordPrompt
                    envelope={selectedEnvelope}
                    onSuccess={handlePasswordSuccess}
                    onClose={() => setShowPassword(false)}
                />
            )}

            {/* Landing Audio Controls (Mute) */}
            {!openedEnvelope && hasEntered && (
                <button
                    onClick={toggleMute}
                    className="fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md border border-cream/10 transition-all group"
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream/80 group-hover:text-cream transition-colors">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream/80 group-hover:text-cream transition-colors">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                        </svg>
                    )}
                </button>
            )}

            {/* Landing Audio Blocked Overlay */}
            {!openedEnvelope && isBlocked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-midnight/90 backdrop-blur-sm">
                    <button
                        onClick={retryPlay}
                        className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-cream/5 border border-cream/20 hover:bg-cream/10 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-soft-gold/20 flex items-center justify-center group-hover:bg-soft-gold/30 transition-colors">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-soft-gold ml-1">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-playfair text-xl text-cream mb-1">Play Music</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Landing Overlay */}
            {!hasEntered && <LandingOverlay onInteract={playLanding} onEnter={() => setHasEntered(true)} />}
        </div>
    )
}

// Separate component for the 3D envelope group
function EnvelopeStackGroup({ envelopes, currentIndex, xOffset, onEnvelopeTap }) {
    return (
        <animated.group position-x={xOffset.to(x => x * 0.01)}>
            {envelopes.map((envelope, index) => {
                const offset = index - currentIndex
                const isActive = index === currentIndex
                const isVisible = Math.abs(offset) <= 3

                if (!isVisible) return null

                return (
                    <Envelope
                        key={envelope.id}
                        envelope={envelope}
                        offset={offset}
                        isActive={isActive}
                        onClick={() => isActive && onEnvelopeTap(envelope)}
                    />
                )
            })}
        </animated.group>
    )
}
