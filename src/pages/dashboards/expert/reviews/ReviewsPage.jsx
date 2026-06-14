import React, { useEffect, useState } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import api from '../../../../lib/axios';

function ReviewCard({ review }) {
    const clientName = review.client?.name || 'Client';
    const date = new Date(review.created_at).toLocaleDateString();

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{clientName}</h4>
                        <p className="text-xs text-gray-500 font-medium">{review.gig?.title}</p>
                    </div>
                </div>
                <span className="text-xs text-gray-400">{date}</span>
            </div>
            
            <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                    />
                ))}
            </div>

            {review.comment && (
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    "{review.comment}"
                </p>
            )}
        </div>
    );
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We fetch bookings and extract reviews.
        // For a more optimized app, a dedicated GET /reviews endpoint would be better.
        api.get('/bookings')
            .then(res => {
                const fetchedReviews = res.data
                    .filter(b => b.review)
                    .map(b => ({
                        ...b.review,
                        client: b.client,
                        gig: b.gig
                    }))
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setReviews(fetchedReviews);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : '-';

    return (
        <div className="max-w-4xl space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg">
                <div>
                    <h2 className="text-2xl font-extrabold mb-1">Vos Avis Clients</h2>
                    <p className="text-blue-100 text-sm font-medium">Découvrez ce que vos clients pensent de vos services.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl text-center">
                    <div className="text-3xl font-black mb-1 flex items-center justify-center gap-2">
                        {averageRating} <Star className="fill-amber-400 text-amber-400 inline" size={24} />
                    </div>
                    <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">{reviews.length} Avis</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-center px-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                        <MessageSquare size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-bold text-gray-500 mb-1">Aucun avis pour le moment</p>
                    <p className="text-sm text-gray-400 max-w-sm">
                        Une fois qu'un client marquera la prestation comme terminée, il pourra vous laisser une note et un commentaire.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}
