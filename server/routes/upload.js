import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { uploadImage, uploadAudio } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import Envelope from '../models/Envelope.js';
import TarotCard from '../models/TarotCard.js';

const router = express.Router();

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// @route   POST /api/upload/music/:envelopeId
// @desc    Upload background music for envelope
// @access  Private
router.post('/music/:envelopeId', protect, uploadAudio.single('music'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const envelope = await Envelope.findOne({ id: req.params.envelopeId });
        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'video', // Cloudinary uses 'video' for audio files
            folder: `vault-envelopes/music`,
            public_id: `${req.params.envelopeId}-${Date.now()}`,
            format: 'mp3'
        });

        // Update envelope with new music URL
        envelope.backgroundMusic = result.secure_url;
        await envelope.save();

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload music error:', error);
        res.status(500).json({ message: 'Failed to upload music' });
    }
});

// @route   POST /api/upload/memory/:envelopeId
// @desc    Upload memory image for envelope
// @access  Private
router.post('/memory/:envelopeId', protect, uploadImage.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const envelope = await Envelope.findOne({ id: req.params.envelopeId });
        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'image',
            folder: `vault-envelopes/memories/${req.params.envelopeId}`,
            public_id: `memory-${Date.now()}`
        });

        // Find memories page and add image
        const memoriesPage = envelope.letter.pages.find(p => p.type === 'memories');
        if (memoriesPage) {
            if (!memoriesPage.images) {
                memoriesPage.images = [];
            }
            memoriesPage.images.push(result.secure_url);
            await envelope.save();
        }

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload memory error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// @route   DELETE /api/upload/memory/:envelopeId
// @desc    Delete memory image from envelope
// @access  Private
router.delete('/memory/:envelopeId', protect, async (req, res) => {
    try {
        const { imageUrl } = req.body;

        const envelope = await Envelope.findOne({ id: req.params.envelopeId });
        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        // Extract public_id from URL for Cloudinary deletion
        const urlParts = imageUrl.split('/');
        const publicIdWithExt = urlParts.slice(-3).join('/');
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove from envelope
        const memoriesPage = envelope.letter.pages.find(p => p.type === 'memories');
        if (memoriesPage && memoriesPage.images) {
            memoriesPage.images = memoriesPage.images.filter(img => img !== imageUrl);
            await envelope.save();
        }

        res.json({ message: 'Image deleted' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

// @route   POST /api/upload/stamp/:envelopeId
// @desc    Upload stamp image for envelope
// @access  Private
router.post('/stamp/:envelopeId', protect, uploadImage.single('stamp'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const envelope = await Envelope.findOne({ id: req.params.envelopeId });
        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'image',
            folder: 'vault-envelopes/stamps',
            public_id: `stamp-${req.params.envelopeId}-${Date.now()}`
        });

        // Update envelope stamp
        if (!envelope.envelope.stamp) {
            envelope.envelope.stamp = {};
        }
        envelope.envelope.stamp.image = result.secure_url;
        await envelope.save();

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload stamp error:', error);
        res.status(500).json({ message: 'Failed to upload stamp' });
    }
});

// @route   POST /api/upload/tarot/:cardId
// @desc    Upload tarot card image
// @access  Private
router.post('/tarot/:cardId', protect, uploadImage.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const card = await TarotCard.findOne({ id: req.params.cardId });
        if (!card) {
            return res.status(404).json({ message: 'Tarot card not found' });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'image',
            folder: 'vault-envelopes/tarot',
            public_id: `tarot-${req.params.cardId}`
        });

        // Update tarot card
        card.image = result.secure_url;
        await card.save();

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload tarot image error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

export default router;
