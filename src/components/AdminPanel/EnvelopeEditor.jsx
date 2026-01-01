import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HexColorPicker } from 'react-colorful';
import { api, adminApi } from '../../api/client';
import CloudinaryUploader from './CloudinaryUploader';
import PageBuilder from './PageBuilder';

const TABS = [
    { id: 'envelope', label: 'Envelope Design', icon: '✉️' },
    { id: 'letter', label: 'Letter Design', icon: '📝' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'content', label: 'Content', icon: '📖' },
    { id: 'media', label: 'Media', icon: '🎵' },
    { id: 'cards', label: 'Cards', icon: '🔮' }
];

const TEXTURES = ['linen', 'canvas', 'watercolor', 'parchment', 'kraft', 'cotton', 'smooth'];
const PAPER_TEXTURES = ['vintage-cream', 'smooth-white', 'sage-mist', 'soft-blush', 'lavender-haze', 'sky-whisper', 'golden-hour'];
const FONT_PAIRINGS = [
    { id: 'classic', label: 'Classic (Playfair + Inter)' },
    { id: 'modern-serif', label: 'Modern Serif' },
    { id: 'romantic', label: 'Romantic (Lora + Raleway)' },
    { id: 'editorial', label: 'Editorial (Crimson + DM Sans)' },
    { id: 'soft', label: 'Soft' },
    { id: 'bold-classic', label: 'Bold Classic' },
    { id: 'clean', label: 'Clean' },
    { id: 'literary', label: 'Literary' },
    { id: 'sleek', label: 'Sleek' },
    { id: 'narrative', label: 'Narrative' }
];

export default function EnvelopeEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('envelope');
    const [envelope, setEnvelope] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(null);

    useEffect(() => {
        fetchEnvelope();
    }, [id]);

    const fetchEnvelope = async () => {
        try {
            const data = await api.fetchEnvelope(id);
            setEnvelope(data);
        } catch (error) {
            toast.error('Failed to load envelope');
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await adminApi.updateEnvelope(id, envelope);
            toast.success('Envelope saved!');
        } catch (error) {
            toast.error('Failed to save envelope');
        } finally {
            setSaving(false);
        }
    };

    const updateEnvelope = (path, value) => {
        setEnvelope(prev => {
            const newEnvelope = JSON.parse(JSON.stringify(prev));
            const parts = path.split('.');
            let current = newEnvelope;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return newEnvelope;
        });
    };

    const handleMusicUpload = async (file) => {
        try {
            setUploading(true);
            const result = await adminApi.uploadMusic(id, file);
            updateEnvelope('backgroundMusic', result.url);
            toast.success('Music uploaded!');
        } catch (error) {
            toast.error('Failed to upload music');
        } finally {
            setUploading(false);
        }
    };

    const handleStampUpload = async (file) => {
        try {
            setUploading(true);
            const result = await adminApi.uploadStamp(id, file);
            updateEnvelope('envelope.stamp.image', result.url);
            toast.success('Stamp uploaded!');
        } catch (error) {
            toast.error('Failed to upload stamp');
        } finally {
            setUploading(false);
        }
    };

    const handleMemoryUpload = async (file) => {
        try {
            setUploading(true);
            const result = await adminApi.uploadMemory(id, file);
            const memoriesPage = envelope.letter?.pages?.find(p => p.type === 'memories');
            if (memoriesPage) {
                const newImages = [...(memoriesPage.images || []), result.url];
                const pageIndex = envelope.letter.pages.findIndex(p => p.type === 'memories');
                updateEnvelope(`letter.pages.${pageIndex}.images`, newImages);
            }
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!envelope) return null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#87CEEB' }}>
            {/* Header */}
            <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: envelope.envelope?.color || '#6366F1' }}
                        >
                            {envelope.initials}
                        </div>
                        <h1 className="text-lg font-semibold text-white">{envelope.recipient}</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
                >
                    {/* ENVELOPE DESIGN TAB */}
                    {activeTab === 'envelope' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Recipient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={envelope.recipient}
                                        onChange={(e) => updateEnvelope('recipient', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Initials
                                    </label>
                                    <input
                                        type="text"
                                        value={envelope.initials}
                                        onChange={(e) => updateEnvelope('initials', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Envelope Color
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowColorPicker(showColorPicker === 'envelope' ? null : 'envelope')}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl flex items-center gap-3"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-lg border border-slate-500"
                                                style={{ backgroundColor: envelope.envelope?.color || '#FFE5D9' }}
                                            />
                                            <span className="text-white">{envelope.envelope?.color || '#FFE5D9'}</span>
                                        </button>
                                        {showColorPicker === 'envelope' && (
                                            <div className="absolute z-10 mt-2">
                                                <HexColorPicker
                                                    color={envelope.envelope?.color || '#FFE5D9'}
                                                    onChange={(color) => updateEnvelope('envelope.color', color)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Texture
                                    </label>
                                    <select
                                        value={envelope.envelope?.texture || 'linen'}
                                        onChange={(e) => updateEnvelope('envelope.texture', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {TEXTURES.map(t => (
                                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Stamp Image
                                </label>
                                <CloudinaryUploader
                                    onUpload={handleStampUpload}
                                    uploading={uploading}
                                    label="Upload stamp image (PNG recommended)"
                                    preview={envelope.envelope?.stamp?.image}
                                />
                            </div>
                        </div>
                    )}

                    {/* LETTER DESIGN TAB */}
                    {activeTab === 'letter' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Paper Texture
                                    </label>
                                    <select
                                        value={envelope.letter?.paperTexture || 'vintage-cream'}
                                        onChange={(e) => updateEnvelope('letter.paperTexture', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {PAPER_TEXTURES.map(t => (
                                            <option key={t} value={t}>{t.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Font Pairing
                                    </label>
                                    <select
                                        value={envelope.letter?.fontPairing || 'classic'}
                                        onChange={(e) => updateEnvelope('letter.fontPairing', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {FONT_PAIRINGS.map(f => (
                                            <option key={f.id} value={f.id}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Accent Color
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowColorPicker(showColorPicker === 'accent' ? null : 'accent')}
                                        className="px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl flex items-center gap-3"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg border border-slate-500"
                                            style={{ backgroundColor: envelope.letter?.accentColor || '#D4AF37' }}
                                        />
                                        <span className="text-white">{envelope.letter?.accentColor || '#D4AF37'}</span>
                                    </button>
                                    {showColorPicker === 'accent' && (
                                        <div className="absolute z-10 mt-2">
                                            <HexColorPicker
                                                color={envelope.letter?.accentColor || '#D4AF37'}
                                                onChange={(color) => updateEnvelope('letter.accentColor', color)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={envelope.password}
                                    onChange={(e) => updateEnvelope('password', e.target.value)}
                                    className="w-full max-w-md px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter password for this envelope"
                                />
                                {envelope.password === 'placeholder' && (
                                    <p className="mt-2 text-amber-400 text-sm">
                                        ⚠️ Password is still set to "placeholder" - update this before sharing!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CONTENT TAB */}
                    {activeTab === 'content' && (
                        <PageBuilder
                            pages={envelope.letter?.pages || []}
                            onChange={(pages) => updateEnvelope('letter.pages', pages)}
                            envelopeId={id}
                        />
                    )}

                    {/* MEDIA TAB */}
                    {activeTab === 'media' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Background Music</h3>
                                {envelope.backgroundMusic && (
                                    <div className="mb-4 p-4 bg-slate-900/50 rounded-xl">
                                        <audio controls className="w-full">
                                            <source src={envelope.backgroundMusic} type="audio/mpeg" />
                                        </audio>
                                        <p className="text-slate-400 text-sm mt-2 truncate">{envelope.backgroundMusic}</p>
                                    </div>
                                )}
                                <CloudinaryUploader
                                    onUpload={handleMusicUpload}
                                    accept={{ 'audio/*': ['.mp3', '.wav', '.ogg'] }}
                                    maxSize={20 * 1024 * 1024}
                                    uploading={uploading}
                                    label="Upload MP3 file (max 20MB)"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Memory Images</h3>
                                {(() => {
                                    const memoriesPage = envelope.letter?.pages?.find(p => p.type === 'memories');
                                    const images = memoriesPage?.images || [];
                                    return (
                                        <>
                                            {images.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                    {images.map((img, i) => (
                                                        <div key={i} className="relative group">
                                                            <img
                                                                src={img}
                                                                alt={`Memory ${i + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await adminApi.deleteMemory(id, img);
                                                                        const pageIndex = envelope.letter.pages.findIndex(p => p.type === 'memories');
                                                                        const newImages = images.filter((_, idx) => idx !== i);
                                                                        updateEnvelope(`letter.pages.${pageIndex}.images`, newImages);
                                                                        toast.success('Image deleted');
                                                                    } catch {
                                                                        toast.error('Failed to delete image');
                                                                    }
                                                                }}
                                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <CloudinaryUploader
                                                onUpload={handleMemoryUpload}
                                                uploading={uploading}
                                                label="Upload memory image"
                                            />
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* CARDS TAB (Tarot & Mantra) */}
                    {activeTab === 'cards' && (
                        <div className="space-y-8">
                            {/* Manual Tarot Card */}
                            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>🃏</span> Manual Tarot Card
                                </h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    If set, this will override the random daily tarot card.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Card Name</label>
                                        <input
                                            type="text"
                                            value={envelope.tarotCard?.name || ''}
                                            onChange={(e) => updateEnvelope('tarotCard.name', e.target.value)}
                                            placeholder="e.g. The Star"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Meaning / Description</label>
                                        <textarea
                                            value={envelope.tarotCard?.meaning || ''}
                                            onChange={(e) => updateEnvelope('tarotCard.meaning', e.target.value)}
                                            placeholder="Enter the card's meaning..."
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Card Image</label>
                                        <CloudinaryUploader
                                            onUpload={async (file) => {
                                                try {
                                                    setUploading(true);
                                                    const result = await adminApi.uploadStamp(id, file); // reusing stamp upload for generic image
                                                    updateEnvelope('tarotCard.image', result.url);
                                                    toast.success('Tarot card uploaded!');
                                                } catch {
                                                    toast.error('Upload failed');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                            uploading={uploading}
                                            label="Upload Tarot Card Image"
                                            preview={envelope.tarotCard?.image}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mantra Card */}
                            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>✨</span> Mantra Card (2026)
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Mantra Text</label>
                                        <textarea
                                            value={envelope.mantraCard?.mantra || ''}
                                            onChange={(e) => updateEnvelope('mantraCard.mantra', e.target.value)}
                                            placeholder="e.g. Trust within the unfolding."
                                            rows={2}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Card Image</label>
                                        <CloudinaryUploader
                                            onUpload={async (file) => {
                                                try {
                                                    setUploading(true);
                                                    const result = await adminApi.uploadStamp(id, file); // reusing stamp upload for generic image
                                                    updateEnvelope('mantraCard.image', result.url);
                                                    toast.success('Mantra card uploaded!');
                                                } catch {
                                                    toast.error('Upload failed');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                            uploading={uploading}
                                            label="Upload Mantra Card Image"
                                            preview={envelope.mantraCard?.image}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
