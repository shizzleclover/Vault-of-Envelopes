import { useState, useRef, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_TYPES = [
    { type: 'intro', label: 'Intro Text', icon: '👋', description: 'Start with a warm welcome' },
    { type: 'recap', label: 'Story/Recap', icon: '📖', description: 'Tell your story' },
    { type: 'spotify', label: 'Music', icon: '🎵', description: 'Add a playlist' },
    { type: 'youtube', label: 'YouTube Video', icon: '▶️', description: 'Embed a video' },
    { type: 'movies', label: 'Movies', icon: '🎬', description: 'Watchlist recommendations' },
    { type: 'memories', label: 'Photo Grid', icon: '📸', description: 'A collection of photos' },
    { type: 'tarot', label: 'Tarot Card', icon: '🔮', description: 'Auto-generated reading' },
    { type: 'mantra', label: 'Mantra', icon: '✨', description: '2026 Mantra Card' },
];

function AutoResizeTextarea({ value, onChange, placeholder, className }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            rows={1}
        />
    );
}

function BlogBlock({ page, onUpdate, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    const updateField = (field, value) => {
        onUpdate(page.id, { ...page, [field]: value });
    };

    const isTextType = page.type === 'intro' || page.type === 'recap';
    const isSpecial = page.type === 'tarot' || page.type === 'mantra';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative mb-6 pl-12 pr-4 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            {/* Hover Actions (Drag/Delete) */}
            <div className="absolute left-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded shadow-sm cursor-grab active:cursor-grabbing"
                    title="Drag to move"
                >
                    ⋮⋮
                </button>
                <button
                    onClick={() => onDelete(page.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded shadow-sm"
                    title="Delete block"
                >
                    ×
                </button>
            </div>

            {/* Block Content */}
            <div className="bg-white/40 hover:bg-white/60 focus-within:bg-white transition-colors rounded-xl p-6 border border-transparent focus-within:border-indigo-200 focus-within:shadow-sm">

                {/* Block Type Label */}
                <div className="absolute top-2 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                    {PAGE_TYPES.find(t => t.type === page.type)?.label || page.type}
                </div>

                {/* Title Input */}
                {!isSpecial && (
                    <input
                        type="text"
                        value={page.title || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Section Title"
                        className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 p-0 mb-3 font-serif"
                    />
                )}

                {/* Text Content */}
                {isTextType && (
                    <AutoResizeTextarea
                        value={page.content || ''}
                        onChange={(e) => updateField('content', e.target.value)}
                        placeholder="Write your story here..."
                        className="w-full text-base leading-relaxed text-slate-600 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif min-h-[60px]"
                    />
                )}

                {/* Movies List */}
                {page.type === 'movies' && (
                    <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                        <AutoResizeTextarea
                            value={(page.list || []).join('\n')}
                            onChange={(e) => updateField('list', e.target.value.split('\n'))}
                            placeholder="Type movie names (one per line)..."
                            className="w-full text-sm leading-relaxed text-slate-600 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 p-0 resize-none font-mono"
                        />
                    </div>
                )}

                {/* Spotify URL */}
                {page.type === 'spotify' && (
                    <div className="flex items-center gap-3 bg-green-50/50 rounded-lg p-3 border border-green-100">
                        <span className="text-xl">🎵</span>
                        <input
                            type="text"
                            value={page.playlistUrl || ''}
                            onChange={(e) => updateField('playlistUrl', e.target.value)}
                            placeholder="Paste Spotify Playlist URL..."
                            className="w-full bg-transparent border-none text-sm text-slate-700 placeholder:text-green-700/30 focus:ring-0 font-mono"
                        />
                    </div>
                )}

                {/* YouTube ID */}
                {page.type === 'youtube' && (
                    <div className="flex items-center gap-3 bg-red-50/50 rounded-lg p-3 border border-red-100">
                        <span className="text-xl">▶️</span>
                        <input
                            type="text"
                            value={page.videoId || ''}
                            onChange={(e) => updateField('videoId', e.target.value)}
                            placeholder="YouTube Video ID (e.g. wbjKk5tXQfE)..."
                            className="w-full bg-transparent border-none text-sm text-slate-700 placeholder:text-red-700/30 focus:ring-0 font-mono"
                        />
                    </div>
                )}

                {/* Memories Placeholder */}
                {page.type === 'memories' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-500">
                            Photos for this section are managed in the <strong>Media</strong> tab.
                        </p>
                    </div>
                )}

                {/* Tarot Placeholder */}
                {page.type === 'tarot' && (
                    <div className="text-center py-4">
                        <span className="text-4xl mb-2 block animate-pulse">🔮</span>
                        <p className="text-indigo-600 text-sm font-medium">Tarot Card Display</p>
                    </div>
                )}

                {/* Mantra Placeholder */}
                {page.type === 'mantra' && (
                    <div className="text-center py-4">
                        <span className="text-4xl mb-2 block animate-pulse">✨</span>
                        <p className="text-indigo-600 text-sm font-medium">Mantra Card Display</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PageBuilder({ pages, onChange }) {
    const [showMenu, setShowMenu] = useState(false);

    const handleAddPage = (type) => {
        const newPage = {
            id: Date.now(),
            type,
            title: '',
            content: '',
        };
        if (type === 'movies') newPage.list = [];
        if (type === 'memories') newPage.images = [];
        if (type === 'spotify') newPage.playlistUrl = '';
        if (type === 'youtube') newPage.videoId = '';

        onChange([...pages, newPage]);
        setShowMenu(false);
    };

    const handleUpdatePage = (id, updatedPage) => {
        onChange(pages.map(p => p.id === id ? updatedPage : p));
    };

    const handleDeletePage = (id) => {
        if (window.confirm('Delete this block?')) {
            onChange(pages.filter(p => p.id !== id));
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = pages.findIndex(p => p.id === active.id);
            const newIndex = pages.findIndex(p => p.id === over.id);
            onChange(arrayMove(pages, oldIndex, newIndex));
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <h3 className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
                Letter Content
            </h3>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={pages.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="min-h-[100px]">
                        {pages.map((page) => (
                            <BlogBlock
                                key={page.id}
                                page={page}
                                onUpdate={handleUpdatePage}
                                onDelete={handleDeletePage}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Floating Add Button */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="bg-slate-800 text-white rounded-xl shadow-2xl p-2 mb-2 w-56 border border-slate-700"
                        >
                            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Add Block</div>
                            {PAGE_TYPES.map(type => (
                                <button
                                    key={type.type}
                                    onClick={() => handleAddPage(type.type)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg text-left transition-colors"
                                >
                                    <span>{type.icon}</span>
                                    <span className="text-sm font-medium">{type.label}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all ${showMenu ? 'bg-slate-700 rotate-45' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    <span className="text-3xl text-white font-light mb-1">+</span>
                </button>
            </div>
        </div>
    );
}
