import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MoreVertical,
    Paperclip,
    Send,
    CheckCircle2,
    XCircle,
    MessageSquare,
} from 'lucide-react';
import { FAKE_MESSAGES, STATUS_CONFIG } from '../../../../constants/expertDashboard';

export default function ConversationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const msg = FAKE_MESSAGES.find((m) => m.id === parseInt(id, 10));

    if (!msg) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <MessageSquare size={56} className="mb-4 opacity-30" />
                <p className="text-lg font-semibold">Conversation introuvable</p>
                <button
                    onClick={() => navigate('/expert/dashboard/messages')}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                    Retour aux messages
                </button>
            </div>
        );
    }

    const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* ── Chat area ─────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {msg.client.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{msg.client.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">Demande de service</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}
                        >
                            {status.icon} {status.label}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {msg.time}
                        </span>
                    </div>

                    {/* Client bubble */}
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {msg.client.avatar}
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                <p className="text-sm font-bold text-gray-900 mb-1">
                                    Nouveau projet : {msg.gig}
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">{msg.notes}</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium mt-1 ml-1 block">
                                {msg.time}
                            </span>
                        </div>
                    </div>

                    {/* Expert reply example */}
                    <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">
                            Moi
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                                <p className="text-sm leading-relaxed">
                                    Bonjour {msg.client.name.split(' ')[0]}, merci de m'avoir contacté.
                                    Pourriez-vous m'envoyer quelques photos pour que je puisse évaluer la
                                    situation ?
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium mt-1 mr-1 block">
                                À l'instant
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message input */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors shrink-0">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            rows={1}
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
                        />
                        <button className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shrink-0">
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Right panel ────────────────────────────────────────────── */}
            <div className="w-80 hidden xl:flex flex-col bg-gray-50/30">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5">Détails de la demande</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Service demandé</p>
                            <p className="text-sm font-semibold text-gray-900">{msg.gig}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Date de la demande</p>
                            <p className="text-sm font-semibold text-gray-900">{msg.time}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1.5">Statut</p>
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}
                            >
                                {status.icon} {status.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 bg-white border-t border-gray-100 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2">
                            <CheckCircle2 size={16} /> Accepter la demande
                        </button>
                        <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2">
                            <XCircle size={16} /> Refuser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
