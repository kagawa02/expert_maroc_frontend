import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { FAKE_MESSAGES, STATUS_CONFIG } from '../../../../constants/expertDashboard';

const FILTERS = [
    { id: 'all',       label: 'Tous' },
    { id: 'pending',   label: 'En attente' },
    { id: 'accepted',  label: 'Acceptés' },
    { id: 'completed', label: 'Terminés' },
];

// ─── Message Row ──────────────────────────────────────────────────────────────
function MessageRow({ msg, onClick }) {
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

// ─── Messages Page ────────────────────────────────────────────────────────────
export default function MessagesPage() {
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const filtered =
        filter === 'all'
            ? FAKE_MESSAGES
            : FAKE_MESSAGES.filter((m) => m.status === filter);

    return (
        <div className="space-y-6">
            {/* Filter tabs */}
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

            {/* Messages list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-40" />
                        <p className="font-medium">Aucun message trouvé</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((msg) => (
                            <MessageRow
                                key={msg.id}
                                msg={msg}
                                onClick={() => navigate(`/expert/dashboard/messages/${msg.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
