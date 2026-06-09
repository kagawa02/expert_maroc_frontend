import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

/** Ensure image URLs always point to the backend, even if stored as relative paths. */
function resolveImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function GigCard({ gig, onEdit, onDelete }) {
    const imageUrl = resolveImageUrl(gig.image_url);
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

            {/* Image (if present) */}
            {imageUrl && (
                <div className="h-44 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={gig.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {gig.title}
                    </h4>
                    <span className="shrink-0 bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {gig.price
                            ? `${parseFloat(gig.price).toLocaleString()} DH`
                            : 'Sur devis'}
                    </span>
                </div>

                {gig.city && (
                    <p className="text-xs text-gray-400 font-medium mb-2">📍 {gig.city.name}</p>
                )}

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                    {gig.description}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(gig)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <Pencil size={15} /> Modifier
                    </button>
                    <button
                        onClick={() => onDelete(gig)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <Trash2 size={15} /> Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}
