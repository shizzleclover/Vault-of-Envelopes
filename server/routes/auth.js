import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for admin user
        let admin = await Admin.findOne({ username });

        // If no admin exists in DB, check env credentials (fallback)
        if (!admin) {
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                // Create admin user on first login
                admin = await Admin.create({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            // Verify password
            const isMatch = await admin.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            expiresIn: '7d',
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({ valid: false });
        }

        res.json({ valid: true, admin });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

export default router;
