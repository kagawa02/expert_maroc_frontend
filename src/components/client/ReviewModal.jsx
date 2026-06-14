import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

export default function ReviewModal({ booking, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Veuillez sélectionner une note.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post(`/bookings/${booking.id}/reviews`, {
                rating,
                comment
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg">Évaluer l'expert</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 mb-4">Comment s'est passée votre prestation avec <span className="font-bold text-gray-800">{booking.expert?.name || 'cet expert'}</span> ?</p>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={36}
                                        className={star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 h-4 text-xs font-bold text-amber-500">
                            {hover === 1 || rating === 1 ? 'Très déçu' : ''}
                            {hover === 2 || rating === 2 ? 'Déçu' : ''}
                            {hover === 3 || rating === 3 ? 'Correct' : ''}
                            {hover === 4 || rating === 4 ? 'Très bien' : ''}
                            {hover === 5 || rating === 5 ? 'Parfait !' : ''}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Commentaire (optionnel)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre expérience en quelques mots..."
                            className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none min-h-[100px]"
                        ></textarea>
                    </div>

                    {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            Plus tard
                        </button>
                        <button
                            type="submit"
                            disabled={loading || rating === 0}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
