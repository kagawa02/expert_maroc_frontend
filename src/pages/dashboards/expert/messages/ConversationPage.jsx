import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { STATUS_CONFIG } from '../../../../constants/expertDashboard';
import api from '../../../../lib/axios';
import echo from '../../../../lib/echo';

export default function ConversationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(!booking);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Get current user from localStorage if we saved it, or we infer from booking
    // Assuming this is expert dashboard, current user is the expert.
    const expertId = booking?.expert_id;

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!booking) return;

        // Listen for new messages via Laravel Echo / Reverb
        const channel = echo.private(`chat.${booking.id}`);
        channel.listen('.MessageSent', (e) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            channel.stopListening('.MessageSent');
            echo.leave(`chat.${booking.id}`);
        };
    }, [booking?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadData = async () => {
        try {
            // In a real app we might fetch the specific booking if not in state
            // For now let's just fetch the messages
            const res = await api.get(`/bookings/${id}/messages`);
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await api.post(`/bookings/${id}/messages`, {
                content: newMessage
            });
            // Add my own message to UI immediately
            setMessages((prev) => [...prev, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const res = await api.patch(`/bookings/${id}/transition`, { status: newStatus });
            setBooking(res.data);
            alert(`Demande ${newStatus === 'accepted' ? 'acceptée' : 'refusée'} avec succès !`);
        } catch (error) {
            alert('Erreur lors de la mise à jour du statut.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!booking) return <div>Conversation introuvable.</div>;

    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
    const clientName = booking.client?.name || 'Client';

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
                                {clientName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{clientName}</h3>
                                <p className="text-xs text-gray-500 font-medium">Demande de service</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                            {status.icon} {status.label}
                        </span>
                    </div>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            Début de la conversation
                        </span>
                    </div>

                    {/* Original booking notes as first message if exists */}
                    {booking.notes && (
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {clientName.charAt(0)}
                            </div>
                            <div>
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                    <p className="text-sm font-bold text-gray-900 mb-1">
                                        Demande : {booking.gig?.title}
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
                                </div>
                                <span className="text-xs text-gray-400 font-medium mt-1 ml-1 block">
                                    {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => {
                        const isMe = msg.sender_id === expertId;
                        return (
                            <div key={msg.id || idx} className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                {!isMe && (
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        {clientName.charAt(0)}
                                    </div>
                                )}
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' : 'bg-white border border-gray-100 rounded-tl-sm shadow-sm'} p-4 rounded-2xl`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <span className={`text-xs text-gray-400 font-medium mt-1 block ${isMe ? 'mr-1' : 'ml-1'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center"
                        >
                            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Right panel ────────────────────────────────────────────── */}
            <div className="w-80 hidden xl:flex flex-col bg-gray-50/30">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5">Détails de la demande</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Service demandé</p>
                            <p className="text-sm font-semibold text-gray-900">{booking.gig?.title}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Date de la demande</p>
                            <p className="text-sm font-semibold text-gray-900">{new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {booking.status === 'pending' && (
                    <div className="p-6 flex-1 bg-white border-t border-gray-100 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => updateStatus('accepted')}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2"
                            >
                                <CheckCircle2 size={16} /> Accepter la demande
                            </button>
                            <button
                                onClick={() => updateStatus('rejected')}
                                className="w-full py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2"
                            >
                                <XCircle size={16} /> Refuser
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
