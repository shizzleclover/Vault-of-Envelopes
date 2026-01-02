import { useEffect } from 'react'
import useAudio from '../hooks/useAudio'

export default function AudioPlayer({ src }) {
    const {
        isPlaying,
        isMuted,
        isBlocked,
        play,
        stop,
        toggleMute,
        retryPlay
    } = useAudio(src, {
        volume: 0.6,
        fadeInDuration: 2000,
        fadeOutDuration: 1000,
        loop: true,
    })

    // Auto-play when component mounts (empty deps to run once)
    useEffect(() => {
        let isMounted = true

        // Small delay to ensure audio is ready
        const timer = setTimeout(() => {
            if (isMounted) play()
        }, 100)

        return () => {
            isMounted = false
            clearTimeout(timer)
            stop()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {/* Mute toggle button - positioned bottom left for light backgrounds */}
            <button
                onClick={toggleMute}
                className="fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md border border-black/10 transition-all group"
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-black/60 group-hover:text-black transition-colors"
                    >
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-black/60 group-hover:text-black transition-colors"
                    >
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                )}
            </button>

            {/* Autoplay blocked overlay */}
            {isBlocked && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-deep-midnight/90 backdrop-blur-sm">
                    <button
                        onClick={retryPlay}
                        className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-cream/5 border border-cream/20 hover:bg-cream/10 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-soft-gold/20 flex items-center justify-center group-hover:bg-soft-gold/30 transition-colors">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-soft-gold ml-1"
                            >
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-playfair text-xl text-cream mb-1">
                                Tap to Begin
                            </p>
                            <p className="font-inter text-sm text-cream/60">

                            </p>
                        </div>
                    </button>
                </div>
            )}
        </>
    )
}
