import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import { STATUS_CONFIG } from '../../../../constants/expertDashboard';
import api from '../../../../lib/axios';

const FILTERS = [
    { id: 'all',       label: 'Tous' },
    { id: 'pending',   label: 'En attente' },
    { id: 'accepted',  label: 'Acceptés' },
    { id: 'completed', label: 'Terminés' },
];

function MessageRow({ booking, onClick }) {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
    const expert = booking.expert || booking.gig?.user;
    const gig = booking.gig;
    const lastMessage = booking.messages && booking.messages.length > 0 ? booking.messages[0] : null;
    const unread = booking.unread_count > 0;
    
    const displayMessage = lastMessage ? lastMessage.content : booking.notes;
    const displayTime = lastMessage 
        ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(booking.created_at).toLocaleDateString();

    return (
        <div
            onClick={onClick}
            className={`flex gap-4 p-5 hover:bg-gray-50/80 transition-colors cursor-pointer ${
                unread ? 'bg-blue-50/30' : ''
            }`}
        >
            <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {expert?.name?.charAt(0).toUpperCase()}
                </div>
                {unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                        {booking.unread_count}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${unread ? 'text-blue-900' : 'text-gray-900'}`}>
                            {expert?.name || 'Expert'}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>
                            {status.icon} {status.label}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{displayTime}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 font-medium">{gig?.title}</p>
                <p className={`text-sm line-clamp-2 leading-relaxed ${unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {displayMessage}
                </p>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === 'all'
            ? bookings
            : bookings.filter((b) => b.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            filter === f.id
                                ? 'bg-gray-900 text-white shadow'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-40" />
                        <p className="font-medium">Aucune conversation trouvée</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((booking) => (
                            <MessageRow
                                key={booking.id}
                                booking={booking}
                                onClick={() => navigate(`/client/dashboard/messages/${booking.id}`, { state: { booking } })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
