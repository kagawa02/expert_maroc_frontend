import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { STATUS_CONFIG } from '../../../../constants/expertDashboard';
import api from '../../../../lib/axios';
import echo from '../../../../lib/echo';

export default function ConversationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useSelector(state => state.auth);
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(!booking);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

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
            if (!booking) {
                // If not passed via state, fetch from API. Wait, we don't have a GET /bookings/:id endpoint.
                // We'll just fetch messages for now, but without booking details the UI won't be perfect.
                // But the user clicks from the list so booking is passed via state.
            }
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
            setMessages((prev) => [...prev, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
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
    const expertName = booking.expert?.name || booking.gig?.user?.name || 'Expert';

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
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
                                {expertName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{expertName}</h3>
                                <p className="text-xs text-gray-500 font-medium">Expert Maroc</p>
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

                    {/* Original booking notes as first message */}
                    {booking.notes && (
                        <div className="flex gap-3 max-w-[80%] self-end flex-row-reverse ml-auto">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {currentUser?.name?.charAt(0) || 'M'}
                            </div>
                            <div>
                                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
                                    <p className="text-sm font-bold mb-1 opacity-90">
                                        Demande : {booking.gig?.title}
                                    </p>
                                    <p className="text-sm leading-relaxed">{booking.notes}</p>
                                </div>
                                <span className="text-xs text-gray-400 font-medium mt-1 mr-1 block text-right">
                                    {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actual conversation */}
                    {messages.map((msg, idx) => {
                        const isMine = msg.sender_id === currentUser?.id;
                        return (
                            <div key={idx} className={`flex gap-3 max-w-[80%] ${isMine ? 'self-end flex-row-reverse ml-auto' : ''}`}>
                                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                                    isMine ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                }`}>
                                    {isMine 
                                        ? (currentUser?.name?.charAt(0) || 'M') 
                                        : expertName.charAt(0)}
                                </div>
                                <div>
                                    <div className={`p-4 rounded-2xl shadow-sm ${
                                        isMine 
                                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                                    }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <span className={`text-[11px] text-gray-400 font-medium mt-1 block ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
                            <textarea
                                rows="1"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="w-full max-h-32 p-4 bg-transparent resize-none focus:outline-none text-sm text-gray-800 placeholder-gray-400 min-h-[56px]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="shrink-0 h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
                        >
                            {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
