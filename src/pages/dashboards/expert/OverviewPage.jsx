import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Users,
    CheckCircle2,
    Star,
    TrendingUp,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { STATUS_CONFIG } from '../../../constants/expertDashboard';
import api from '../../../lib/axios';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, trend, color }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={11} /> {trend}
                    </span>
                )}
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
}

// ─── Message Preview Row ──────────────────────────────────────────────────────
function MessagePreviewRow({ booking, onClick }) {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
    const client = booking.client;
    const gig = booking.gig;
    const lastMessage = booking.messages && booking.messages.length > 0 ? booking.messages[0] : null;
    const unread = booking.unread_count > 0;
    
    // Fallback if no messages yet
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
                    {client?.name?.charAt(0).toUpperCase()}
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
                            {client?.name}
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

// ─── Overview Page ────────────────────────────────────────────────────────────
export default function OverviewPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/bookings')
            .then(res => setBookings(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    const totalRequests = bookings.length;
    const clientsServed = bookings.filter(b => b.status === 'completed').length;
    const acceptedCount = bookings.filter(b => ['accepted', 'completed', 'in_progress'].includes(b.status)).length;
    const acceptanceRate = totalRequests > 0 ? Math.round((acceptedCount / totalRequests) * 100) : 0;
    
    const reviews = bookings.filter(b => b.review).map(b => b.review);
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : '-';

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Demandes reçues"
                    value={totalRequests}
                    icon={<MessageSquare size={22} className="text-blue-600" />}
                    trend={totalRequests > 0 ? `+${totalRequests} ce mois` : null}
                    color="bg-blue-50"
                />
                <StatCard
                    label="Clients servis"
                    value={clientsServed}
                    icon={<Users size={22} className="text-indigo-600" />}
                    trend={clientsServed > 0 ? `+${clientsServed}` : null}
                    color="bg-indigo-50"
                />
                <StatCard
                    label="Taux d'acceptation"
                    value={`${acceptanceRate}%`}
                    icon={<CheckCircle2 size={22} className="text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <StatCard
                    label="Note moyenne"
                    value={averageRating}
                    icon={<Star size={22} className="text-amber-500" />}
                    trend="⭐ Top"
                    color="bg-amber-50"
                />
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Messages récents</h3>
                    <button
                        onClick={() => navigate('/expert/dashboard/messages')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        Voir tout <ChevronRight size={16} />
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-sm">Aucun message récent</p>
                        </div>
                    ) : (
                        bookings.slice(0, 3).map((booking) => (
                            <MessagePreviewRow
                                key={booking.id}
                                booking={booking}
                                onClick={() => navigate(`/expert/dashboard/messages/${booking.id}`, { state: { booking } })}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
