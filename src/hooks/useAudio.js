import { useState, useEffect, useRef, useCallback } from 'react'

const MUTE_STORAGE_KEY = 'vault-envelopes-audio-muted'

/**
 * Custom hook for audio playback with fade in/out
 * Handles autoplay blocking, mute persistence, and smooth transitions
 */
export function useAudio(src, options = {}) {
    const {
        volume = 0.6,
        fadeInDuration = 2000,
        fadeOutDuration = 1000,
        loop = true,
    } = options

    const audioRef = useRef(null)
    const fadeIntervalRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(() => {
        try {
            return localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
        } catch {
            return false
        }
    })
    const [isBlocked, setIsBlocked] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)

    // Initialize audio element
    useEffect(() => {
        if (!src) return

        const audio = new Audio(src)
        audio.loop = loop
        audio.volume = volume
        audioRef.current = audio

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current)
            }
        }
    }, [src, loop])

    // Handle mute changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted
        }
        try {
            localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted))
        } catch {
            // Ignore storage errors
        }
    }, [isMuted])

    // Fade in function
    const fadeIn = useCallback(() => {
        if (!audioRef.current) return

        const audio = audioRef.current
        const targetVolume = volume
        const steps = fadeInDuration / 50 // Update every 50ms
        const volumeStep = targetVolume / steps

        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current)
        }

        fadeIntervalRef.current = setInterval(() => {
            if (audio.volume < targetVolume - volumeStep) {
                audio.volume = Math.min(audio.volume + volumeStep, targetVolume)
                setCurrentVolume(audio.volume)
            } else {
                audio.volume = targetVolume
                setCurrentVolume(targetVolume)
                clearInterval(fadeIntervalRef.current)
            }
        }, 50)
    }, [volume, fadeInDuration])

    // Fade out function
    const fadeOut = useCallback(() => {
        return new Promise((resolve) => {
            if (!audioRef.current) {
                resolve()
                return
            }

            const audio = audioRef.current
            const startVolume = audio.volume
            const steps = fadeOutDuration / 50
            const volumeStep = startVolume / steps

            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current)
            }

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume > volumeStep) {
                    audio.volume = Math.max(audio.volume - volumeStep, 0)
                    setCurrentVolume(audio.volume)
                } else {
                    audio.volume = 0
                    setCurrentVolume(0)
                    audio.pause()
                    setIsPlaying(false)
                    clearInterval(fadeIntervalRef.current)
                    resolve()
                }
            }, 50)
        })
    }, [fadeOutDuration])

    // Play immediately
    const play = useCallback(async () => {
        if (!audioRef.current) return

        try {
            setIsBlocked(false)
            audioRef.current.volume = volume
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                setIsBlocked(true)
                console.log('Audio autoplay blocked - waiting for user interaction')
            } else {
                console.error(`Audio play error for ${src}:`, error)
            }
        }
    }, [volume, src])

    // Stop with fade out
    const stop = useCallback(async () => {
        await fadeOut()
    }, [fadeOut])

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev)
    }, [])

    // Retry play (for when autoplay is blocked)
    const retryPlay = useCallback(() => {
        setIsBlocked(false)
        play()
    }, [play])

    // Store playing state in a ref to avoid re-renders on visibility change
    const isPlayingRef = useRef(isPlaying)
    useEffect(() => {
        isPlayingRef.current = isPlaying
    }, [isPlaying])

    // Pause on tab visibility change - using ref to avoid re-renders
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!audioRef.current) return

            if (document.hidden && isPlayingRef.current) {
                audioRef.current.pause()
            } else if (!document.hidden && isPlayingRef.current) {
                audioRef.current.play().catch(() => { })
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, []) // Empty deps - uses ref instead

    return {
        isPlaying,
        isMuted,
        isBlocked,
        currentVolume,
        play,
        stop,
        toggleMute,
        retryPlay,
    }
}

export default useAudio
