import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
    id: Number,
    type: {
        type: String,
        enum: ['intro', 'recap', 'spotify', 'movies', 'memories', 'tarot']
    },
    title: String,
    content: String,
    playlistUrl: String,
    list: [String],
    images: [String]
}, { _id: false });

const stampSchema = new mongoose.Schema({
    image: String,
    fallbackColor: String,
    position: { type: String, default: 'top-right' },
    size: { type: Number, default: 0.3 }
}, { _id: false });

const envelopeDesignSchema = new mongoose.Schema({
    color: String,
    texture: String,
    stamp: stampSchema
}, { _id: false });

const letterSchema = new mongoose.Schema({
    paperTexture: String,
    fontPairing: String,
    accentColor: String,
    pages: [pageSchema]
}, { _id: false });

const tarotCardSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    meaning: String
}, { _id: false });

const envelopeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    recipient: {
        type: String,
        required: true
    },
    initials: String,
    envelope: envelopeDesignSchema,
    letter: letterSchema,
    password: {
        type: String,
        default: 'placeholder'
    },
    backgroundMusic: String,
    tarotCard: tarotCardSchema
}, {
    timestamps: true
});

// Index for searching by recipient
envelopeSchema.index({ recipient: 'text' });

const Envelope = mongoose.model('Envelope', envelopeSchema);

export default Envelope;
