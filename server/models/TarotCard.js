import mongoose from 'mongoose';

const tarotCardSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    numeral: String,
    image: String,
    meaning: String
}, {
    timestamps: true
});

const TarotCard = mongoose.model('TarotCard', tarotCardSchema);

export default TarotCard;
