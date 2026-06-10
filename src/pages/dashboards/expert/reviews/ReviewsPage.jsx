import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-32 text-center px-6">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <Star size={40} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Avis clients</h3>
            <p className="text-gray-400 text-sm max-w-xs">
                Cette section sera disponible très prochainement. Vos avis clients apparaîtront ici.
            </p>
        </div>
    );
}
