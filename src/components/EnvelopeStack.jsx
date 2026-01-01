import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/three'
import envelopesData from '../data/envelopes.json'
import Envelope from './Envelope'
import PasswordPrompt from './PasswordPrompt'
import LetterContainer from './Letter/LetterContainer'
import AudioPlayer from './AudioPlayer'

// Load envelope data from localStorage or fallback to JSON
const getEnvelopeData = () => {
    try {
        const stored = localStorage.getItem('vault-envelopes-data')
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (e) {
        console.error('Failed to load envelope data from localStorage:', e)
    }
    return envelopesData
}

export default function EnvelopeStack() {
    const [envelopes] = useState(getEnvelopeData)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedEnvelope, setSelectedEnvelope] = useState(null)
    const [openedEnvelope, setOpenedEnvelope] = useState(null)

    // Spring for swipe animation
    const [{ x }, api] = useSpring(() => ({ x: 0 }))

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
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
        // Threshold for triggering a card change
        const threshold = 50

        if (active) {
            api.start({ x: mx, immediate: true })
        } else {
            // Determine if we should change cards
            if (Math.abs(mx) > threshold) {
                const newIndex = mx > 0
                    ? Math.max(0, currentIndex - 1)
                    : Math.min(envelopes.length - 1, currentIndex + 1)
                setCurrentIndex(newIndex)
            }
            api.start({ x: 0 })
        }
    }, {
        axis: 'x',
        filterTaps: true,
        rubberband: true,
    })

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
        <div className="w-full h-full relative" {...bind()}>
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
                const isVisible = Math.abs(offset) <= 3 // Only render nearby envelopes

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
