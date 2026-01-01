import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import models
import Envelope from '../models/Envelope.js';
import TarotCard from '../models/TarotCard.js';
import Admin from '../models/Admin.js';

// Read JSON files from parent src/data folder
const envelopesPath = join(__dirname, '..', '..', 'src', 'data', 'envelopes.json');
const tarotCardsPath = join(__dirname, '..', '..', 'src', 'data', 'tarotCards.json');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Envelope.deleteMany({});
        await TarotCard.deleteMany({});
        await Admin.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Read and import envelopes
        const envelopesData = JSON.parse(readFileSync(envelopesPath, 'utf-8'));
        await Envelope.insertMany(envelopesData);
        console.log(`📨 Imported ${envelopesData.length} envelopes`);

        // Read and import tarot cards (convert object to array)
        const tarotCardsObject = JSON.parse(readFileSync(tarotCardsPath, 'utf-8'));
        const tarotCardsArray = Object.values(tarotCardsObject);
        await TarotCard.insertMany(tarotCardsArray);
        console.log(`🔮 Imported ${tarotCardsArray.length} tarot cards`);

        // Create default admin user
        const admin = await Admin.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });
        console.log(`👤 Created admin user: ${admin.username}`);

        console.log('\n✨ Database seeding completed successfully!');
        console.log('You can now run the server with: npm run dev');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
