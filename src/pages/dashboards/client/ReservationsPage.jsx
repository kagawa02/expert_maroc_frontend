import React, { useEffect, useState } from 'react';
import { CalendarCheck, FileText, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import axios, { API_ORIGIN } from '../../../lib/axios';

const STATUS_CONFIG = {
    pending: { label: 'En attente', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock size={13} /> },
    accepted: { label: 'Acceptée', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle2 size={13} /> },
    in_progress: { label: 'En cours', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: <Loader2 size={13} /> },
    completed: { label: 'Terminée', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={13} /> },
    rejected: { label: 'Refusée', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle size={13} /> },
};

function getStatus(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

function ReservationCard({ booking }) {
    const status = getStatus(booking.status);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-extrabold text-gray-900">{booking.gig?.title || 'Réservation'}</h3>
                    <p className="text-sm text-gray-500 mt-1">Expert: <span className="font-semibold text-gray-700">{booking.expert?.name || booking.gig?.user?.name || 'Non assigné'}</span></p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${status.color}`}>
                    {status.icon}
                    {status.label}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-400 uppercase">Date prévue</p>
                    <p className="font-semibold text-gray-800 mt-1">{booking.scheduled_at || 'À confirmer'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-400 uppercase">Paiement</p>
                    <p className="font-semibold text-gray-800 mt-1">Sur place</p>
                </div>
            </div>
            {booking.verification_report_path && (
                <a
                    href={`${API_ORIGIN}/storage/${booking.verification_report_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    <FileText size={16} />
                    Télécharger le rapport final
                </a>
            )}
        </div>
    );
}

export default function ReservationsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/bookings')
            .then(res => setBookings(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center py-24"><Loader2 size={36} className="animate-spin text-blue-500" /></div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-24 text-center px-6">
                <CalendarCheck size={56} className="text-gray-200 mb-4" />
                <p className="text-lg font-bold text-gray-500 mb-2">Aucune réservation</p>
                <p className="text-sm text-gray-400">Vos demandes envoyées aux experts apparaîtront ici.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {bookings.map(booking => <ReservationCard key={booking.id} booking={booking} />)}
        </div>
    );
}
