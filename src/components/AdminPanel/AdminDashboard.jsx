import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api, adminApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const [envelopes, setEnvelopes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnvelopes();
    }, []);

    const fetchEnvelopes = async () => {
        try {
            setLoading(true);
            const data = await api.fetchEnvelopes();
            setEnvelopes(data);
        } catch (error) {
            toast.error('Failed to load envelopes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEnvelope = async () => {
        try {
            setIsCreating(true);
            const newEnvelope = {
                recipient: 'New Recipient',
                initials: 'NR',
                password: 'placeholder',
                envelope: {
                    color: '#6366F1',
                    texture: 'linen'
                },
                letter: {
                    paperTexture: 'vintage-cream',
                    fontPairing: 'classic',
                    pages: [
                        { id: 1, type: 'intro', title: 'Welcome', content: 'Welcome to your vault...' }
                    ]
                }
            };
            const created = await adminApi.createEnvelope(newEnvelope);
            toast.success('Envelope created!');
            // Refresh list
            fetchEnvelopes();
            // Optional: navigate to edit immediately
            // navigate(`/admin/envelope/${created.id}`);
        } catch (error) {
            toast.error('Failed to create envelope');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteEnvelope = async (id, e) => {
        // Prevent navigation when clicking delete
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this envelope? This cannot be undone.')) {
            return;
        }

        try {
            await adminApi.deleteEnvelope(id);
            toast.success('Envelope deleted');
            setEnvelopes(prev => prev.filter(env => env.id !== id));
        } catch (error) {
            toast.error('Failed to delete envelope');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const filteredEnvelopes = envelopes.filter(env =>
        env.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCompletionStatus = (envelope) => {
        let complete = 0;
        let total = 4;

        if (envelope.password && envelope.password !== 'placeholder') complete++;
        if (envelope.backgroundMusic) complete++;
        if (envelope.letter?.pages?.some(p => p.content && p.content.length > 50)) complete++;
        if (envelope.letter?.pages?.find(p => p.type === 'memories')?.images?.length > 0) complete++;

        return { complete, total, percentage: Math.round((complete / total) * 100) };
    };

    const stats = {
        total: envelopes.length,
        complete: envelopes.filter(e => getCompletionStatus(e).percentage === 100).length,
        incomplete: envelopes.filter(e => getCompletionStatus(e).percentage < 100).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-indigo-900 font-medium">Loading envelopes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-100 text-slate-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">📨</span>
                        <h1 className="text-xl font-bold text-slate-800">Vault Admin</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCreateEnvelope}
                            disabled={isCreating}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            {isCreating ? 'Creating...' : '+ New Envelope'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Envelopes</p>
                        <p className="text-4xl font-bold text-slate-800">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-6 shadow-sm border border-emerald-100">
                        <p className="text-emerald-600 text-sm font-medium mb-1">Complete</p>
                        <p className="text-4xl font-bold text-emerald-700">{stats.complete}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-6 shadow-sm border border-amber-100">
                        <p className="text-amber-600 text-sm font-medium mb-1">In Progress</p>
                        <p className="text-4xl font-bold text-amber-700">{stats.incomplete}</p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search by recipient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-4 pl-12 bg-white rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border-0"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
                    </div>
                </div>

                {/* Envelope Grid */}
                {filteredEnvelopes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredEnvelopes.map((envelope, index) => {
                                const status = getCompletionStatus(envelope);
                                return (
                                    <motion.div
                                        key={envelope.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => navigate(`/admin/envelope/${envelope.id}`)}
                                        className="bg-white rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative border border-slate-100"
                                    >
                                        {/* Delete Button (Hidden by default, visible on hover) */}
                                        <button
                                            onClick={(e) => handleDeleteEnvelope(envelope.id, e)}
                                            className="absolute top-4 right-4 z-10 p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-slate-100"
                                            title="Delete Envelope"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                                            </svg>
                                        </button>

                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md transform group-hover:rotate-3 transition-transform"
                                                style={{ backgroundColor: envelope.envelope?.color || '#6366F1' }}
                                            >
                                                {envelope.initials}
                                            </div>
                                            <div className={`mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${status.percentage === 100
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {status.percentage}%
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {envelope.recipient}
                                        </h3>

                                        {/* Status badges */}
                                        <div className="flex flex-wrap gap-2 text-xs font-medium mb-4">
                                            <span className={`px-2 py-1.5 rounded-md ${envelope.password !== 'placeholder'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                }`}>
                                                {envelope.password !== 'placeholder' ? 'Password Set' : 'No Password'}
                                            </span>
                                            <span className={`px-2 py-1.5 rounded-md ${envelope.backgroundMusic
                                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                }`}>
                                                {envelope.backgroundMusic ? 'Music Added' : 'No Music'}
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${status.percentage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                                                    }`}
                                                style={{ width: `${status.percentage}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm border border-slate-100">
                            📫
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Envelopes Found</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            We couldn't find any envelopes matching "{searchTerm}". Try a different search or create a new one.
                        </p>
                        <button
                            onClick={handleCreateEnvelope}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-md"
                        >
                            Create First Envelope
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
