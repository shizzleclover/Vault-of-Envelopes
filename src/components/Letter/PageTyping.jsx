import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// Quotes/passages for typing - personalized for the recipient
const typingTexts = [
    "More life, more growth, more wins, more peace, and more memories ahead.",
    "You are one of those friends that makes life feel less lonely.",
    "Working with you never felt like just work. It felt like building with someone who honestly cares.",
    "You deserve good things, not just because you work hard, but because of the kind of person you are.",
    "Loyal, sincere, thoughtful, intentional, and real.",
]

export default function PageTyping({ page, envelope, fontPairing, accentColor }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [input, setInput] = useState('')
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [isComplete, setIsComplete] = useState(false)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const inputRef = useRef(null)

    const currentText = page.customText || typingTexts[currentTextIndex]

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [currentTextIndex])

    // Calculate WPM and accuracy
    const calculateStats = useCallback(() => {
        if (!startTime || !endTime) return

        const timeInMinutes = (endTime - startTime) / 60000
        const wordCount = currentText.split(' ').length
        const calculatedWpm = Math.round(wordCount / timeInMinutes)

        // Calculate accuracy
        let correctChars = 0
        for (let i = 0; i < input.length; i++) {
            if (input[i] === currentText[i]) {
                correctChars++
            }
        }
        const calculatedAccuracy = Math.round((correctChars / currentText.length) * 100)

        setWpm(calculatedWpm)
        setAccuracy(calculatedAccuracy)
    }, [startTime, endTime, input, currentText])

    useEffect(() => {
        if (isComplete) {
            calculateStats()
        }
    }, [isComplete, calculateStats])

    const handleInputChange = (e) => {
        const value = e.target.value

        // Start timer on first keystroke
        if (!startTime && value.length === 1) {
            setStartTime(Date.now())
        }

        setInput(value)

        // Check if complete
        if (value === currentText) {
            setEndTime(Date.now())
            setIsComplete(true)
        }
    }

    const handleReset = () => {
        setInput('')
        setStartTime(null)
        setEndTime(null)
        setIsComplete(false)
        setWpm(0)
        setAccuracy(100)
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // Render characters with color coding
    const renderText = () => {
        return currentText.split('').map((char, index) => {
            let color = 'text-warm-brown/40' // Not typed yet
            if (index < input.length) {
                color = input[index] === char ? 'text-green-500' : 'text-red-500'
            }
            if (index === input.length) {
                color = 'text-warm-brown border-l-2 border-warm-brown animate-pulse'
            }
            return (
                <span key={index} className={`${color} transition-colors`}>
                    {char}
                </span>
            )
        })
    }

    return (
        <div className="w-full max-w-2xl text-center px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="text-4xl mb-4 block">⌨️</span>
                <h2
                    className="letter-heading text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                >
                    {page.title || 'Type It Out'}
                </h2>
                <p className="letter-body text-warm-brown/60 text-sm mt-2">
                    MonkeyType vibes just for you
                </p>
            </motion.div>

            {/* Typing Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
            >
                {/* Text to type */}
                <div
                    className="p-6 rounded-xl bg-black/5 backdrop-blur-sm mb-4 text-left font-mono text-lg md:text-xl leading-relaxed tracking-wide cursor-text"
                    onClick={() => inputRef.current?.focus()}
                >
                    {renderText()}
                </div>

                {/* Hidden input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isComplete}
                    className="absolute opacity-0 pointer-events-none"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                />

                {/* Stats */}
                {(startTime || isComplete) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center gap-8 mt-4"
                    >
                        <div className="text-center">
                            <p className="text-2xl font-bold" style={{ color: accentColor }}>
                                {isComplete ? wpm : '...'}
                            </p>
                            <p className="text-xs text-warm-brown/50 uppercase tracking-wide">WPM</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold" style={{ color: accuracy >= 90 ? '#22c55e' : accuracy >= 70 ? '#eab308' : '#ef4444' }}>
                                {isComplete ? `${accuracy}%` : '...'}
                            </p>
                            <p className="text-xs text-warm-brown/50 uppercase tracking-wide">Accuracy</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-warm-brown/70">
                                {input.length}/{currentText.length}
                            </p>
                            <p className="text-xs text-warm-brown/50 uppercase tracking-wide">Chars</p>
                        </div>
                    </motion.div>
                )}

                {/* Complete message */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <p className="text-lg mb-4" style={{ color: accentColor }}>
                            {wpm >= 60 ? '🔥 Speed demon!' : wpm >= 40 ? '👏 Nice work!' : '💪 Keep practicing!'}
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                            style={{
                                backgroundColor: `${accentColor}20`,
                                color: accentColor,
                                border: `1px solid ${accentColor}40`
                            }}
                        >
                            Try Another →
                        </button>
                    </motion.div>
                )}

                {/* Instruction */}
                {!startTime && !isComplete && (
                    <p className="text-warm-brown/40 text-sm mt-4 animate-pulse">
                        Click above and start typing...
                    </p>
                )}
            </motion.div>
        </div>
    )
}
