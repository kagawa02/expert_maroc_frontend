import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Users,
    CheckCircle2,
    Star,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import { FAKE_MESSAGES, STATUS_CONFIG } from '../../../constants/expertDashboard';

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
function MessagePreviewRow({ msg, onClick }) {
    const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending;
    return (
        <div
            onClick={onClick}
            className={`flex gap-4 p-5 hover:bg-gray-50/80 transition-colors cursor-pointer ${
                msg.unread ? 'bg-blue-50/30' : ''
            }`}
        >
            <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {msg.client.avatar}
                </div>
                {msg.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${msg.unread ? 'text-blue-900' : 'text-gray-900'}`}>
                            {msg.client.name}
                        </p>
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}
                        >
                            {status.icon} {status.label}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 font-medium">{msg.gig}</p>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{msg.notes}</p>
            </div>
        </div>
    );
}

// ─── Overview Page ────────────────────────────────────────────────────────────
export default function OverviewPage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Demandes reçues"
                    value="12"
                    icon={<MessageSquare size={22} className="text-blue-600" />}
                    trend="+3 ce mois"
                    color="bg-blue-50"
                />
                <StatCard
                    label="Clients servis"
                    value="8"
                    icon={<Users size={22} className="text-indigo-600" />}
                    trend="+2"
                    color="bg-indigo-50"
                />
                <StatCard
                    label="Taux d'acceptation"
                    value="92%"
                    icon={<CheckCircle2 size={22} className="text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <StatCard
                    label="Note moyenne"
                    value="4.9"
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
                    {FAKE_MESSAGES.slice(0, 3).map((msg) => (
                        <MessagePreviewRow
                            key={msg.id}
                            msg={msg}
                            onClick={() => navigate(`/expert/dashboard/messages/${msg.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
