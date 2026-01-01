import express from 'express';
import TarotCard from '../models/TarotCard.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tarot
// @desc    Get all tarot cards
// @access  Public
router.get('/', async (req, res) => {
    try {
        const cards = await TarotCard.find({}).sort({ name: 1 });
        res.json(cards);
    } catch (error) {
        console.error('Get tarot cards error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tarot/:id
// @desc    Get single tarot card
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const card = await TarotCard.findOne({ id: req.params.id });

        if (!card) {
            return res.status(404).json({ message: 'Tarot card not found' });
        }

        res.json(card);
    } catch (error) {
        console.error('Get tarot card error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/tarot/:id
// @desc    Update tarot card
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const card = await TarotCard.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!card) {
            return res.status(404).json({ message: 'Tarot card not found' });
        }

        res.json(card);
    } catch (error) {
        console.error('Update tarot card error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tarot/random
// @desc    Get random tarot card
// @access  Public
router.get('/random/pick', async (req, res) => {
    try {
        const count = await TarotCard.countDocuments();
        const random = Math.floor(Math.random() * count);
        const card = await TarotCard.findOne().skip(random);
        res.json(card);
    } catch (error) {
        console.error('Get random tarot card error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
