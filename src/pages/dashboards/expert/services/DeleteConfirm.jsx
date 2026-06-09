import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import axios from '../../../../lib/axios';

export default function DeleteConfirm({ gig, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/gigs/${gig.id}`);
            onDeleted(gig.id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    Supprimer ce service ?
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                    Le service{' '}
                    <strong className="text-gray-700">"{gig.title}"</strong> sera définitivement
                    supprimé. Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}
