import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api, adminApi } from '../../api/client';
import CloudinaryUploader from './CloudinaryUploader';

export default function TarotManager() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null);
    const [editingCard, setEditingCard] = useState(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const data = await api.fetchTarotCards();
            setCards(data);
        } catch (error) {
            toast.error('Failed to load tarot cards');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (cardId, file) => {
        try {
            setUploading(cardId);
            const result = await adminApi.uploadTarotImage(cardId, file);
            setCards(cards.map(c => c.id === cardId ? { ...c, image: result.url } : c));
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(null);
        }
    };

    const handleUpdateMeaning = async (cardId, meaning) => {
        try {
            await adminApi.updateTarotCard(cardId, { meaning });
            setCards(cards.map(c => c.id === cardId ? { ...c, meaning } : c));
            toast.success('Meaning updated!');
            setEditingCard(null);
        } catch (error) {
            toast.error('Failed to update meaning');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#87CEEB' }}>
            {/* Header */}
            <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            ← Back
                        </a>
                        <span className="text-2xl">🔮</span>
                        <h1 className="text-xl font-bold text-white">Tarot Card Manager</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5"
                        >
                            {/* Card Image */}
                            <div className="aspect-[2/3] bg-slate-900/50 rounded-xl overflow-hidden mb-4">
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                        <span className="text-4xl mb-2">🎴</span>
                                        <span className="text-sm">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Info */}
                            <h3 className="font-semibold text-white mb-1">{card.name}</h3>
                            <p className="text-slate-400 text-sm mb-4">Numeral: {card.numeral}</p>

                            {/* Edit Meaning */}
                            {editingCard === card.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        defaultValue={card.meaning}
                                        rows={3}
                                        id={`meaning-${card.id}`}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const textarea = document.getElementById(`meaning-${card.id}`);
                                                handleUpdateMeaning(card.id, textarea.value);
                                            }}
                                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingCard(null)}
                                            className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{card.meaning}</p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <CloudinaryUploader
                                    onUpload={(file) => handleUploadImage(card.id, file)}
                                    uploading={uploading === card.id}
                                    label="Upload"
                                    maxSize={5 * 1024 * 1024}
                                />
                                <button
                                    onClick={() => setEditingCard(card.id)}
                                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                                >
                                    Edit Meaning
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
