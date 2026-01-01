/**
 * Random tarot card assignment with persistence
 * Ensures each person gets a unique card that persists across sessions
 */

import tarotCards from '../data/tarotCards.json'

const STORAGE_KEY = 'vault-envelopes-tarot-assignments'

/**
 * Get all assigned tarot cards from localStorage
 */
export const getAssignedCards = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch {
        return {}
    }
}

/**
 * Save tarot assignments to localStorage
 */
export const saveAssignedCards = (assignments) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
    } catch (e) {
        console.error('Failed to save tarot assignments:', e)
    }
}

/**
 * Get a tarot card for an envelope
 * If already assigned, return the existing card
 * If not, assign a random unused card
 */
export const getTarotCardForEnvelope = (envelopeId) => {
    const assignments = getAssignedCards()

    // If already assigned, return it
    if (assignments[envelopeId]) {
        const cardId = assignments[envelopeId]
        return tarotCards[cardId] || null
    }

    // Get list of already used card IDs
    const usedCardIds = new Set(Object.values(assignments))

    // Get available cards
    const allCardIds = Object.keys(tarotCards)
    const availableCardIds = allCardIds.filter(id => !usedCardIds.has(id))

    // If all cards are used, allow duplicates (wrap around)
    const poolToChooseFrom = availableCardIds.length > 0 ? availableCardIds : allCardIds

    // Pick a random card
    const randomIndex = Math.floor(Math.random() * poolToChooseFrom.length)
    const selectedCardId = poolToChooseFrom[randomIndex]

    // Save the assignment
    assignments[envelopeId] = selectedCardId
    saveAssignedCards(assignments)

    return tarotCards[selectedCardId]
}

/**
 * Clear all tarot assignments (for testing/reset)
 */
export const clearAllAssignments = () => {
    localStorage.removeItem(STORAGE_KEY)
}

/**
 * Manually assign a tarot card to an envelope
 */
export const assignTarotCard = (envelopeId, cardId) => {
    const assignments = getAssignedCards()
    assignments[envelopeId] = cardId
    saveAssignedCards(assignments)
    return tarotCards[cardId]
}

/**
 * Get a random tarot meaning suffix for personalization
 */
export const getPersonalizedMeaning = (cardMeaning, recipientName) => {
    const suffixes = [
        `Trust in this journey, ${recipientName}.`,
        `This energy surrounds you in 2025.`,
        `The universe has spoken, ${recipientName}.`,
        `Embrace what's coming.`,
        `${recipientName}, the stars align for you.`,
    ]
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${cardMeaning} ${randomSuffix}`
}

export default {
    getTarotCardForEnvelope,
    getAssignedCards,
    clearAllAssignments,
    assignTarotCard,
    getPersonalizedMeaning,
}
