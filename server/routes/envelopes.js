import express from 'express';
import Envelope from '../models/Envelope.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/envelopes
// @desc    Get all envelopes
// @access  Public (for frontend) / Private (for admin)
router.get('/', async (req, res) => {
    try {
        const envelopes = await Envelope.find({}).sort({ recipient: 1 });
        res.json(envelopes);
    } catch (error) {
        console.error('Get envelopes error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/envelopes/:id
// @desc    Get single envelope by id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const envelope = await Envelope.findOne({ id: req.params.id });

        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        res.json(envelope);
    } catch (error) {
        console.error('Get envelope error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/envelopes/:id
// @desc    Update envelope
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const envelope = await Envelope.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        res.json(envelope);
    } catch (error) {
        console.error('Update envelope error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/envelopes
// @desc    Create new envelope
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        let envelopeData = { ...req.body };

        // Auto-generate ID if not provided
        if (!envelopeData.id) {
            const baseId = envelopeData.recipient
                ? envelopeData.recipient.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                : 'envelope';
            envelopeData.id = `${baseId}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
        }

        const envelope = await Envelope.create(envelopeData);
        res.status(201).json(envelope);
    } catch (error) {
        console.error('Create envelope error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/envelopes/:id
// @desc    Delete envelope
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const envelope = await Envelope.findOneAndDelete({ id: req.params.id });

        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        res.json({ message: 'Envelope deleted' });
    } catch (error) {
        console.error('Delete envelope error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/envelopes/:id/verify-password
// @desc    Verify envelope password
// @access  Public
router.post('/:id/verify-password', async (req, res) => {
    try {
        const { password } = req.body;
        const envelope = await Envelope.findOne({ id: req.params.id });

        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        const isValid = envelope.password === password;
        res.json({ valid: isValid });
    } catch (error) {
        console.error('Verify password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
