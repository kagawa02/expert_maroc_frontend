import React, { useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import axios from '../../../lib/axios';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = () => {
        axios.get('/notifications')
            .then(res => setNotifications(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 size={36} className="animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden font-sans">
            <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez les alertes, annonces et retours d'approbation sur vos services.
                </p>
            </div>
            {notifications.length === 0 ? (
                <div className="py-24 text-center text-gray-400">
                    <Bell size={52} className="mx-auto mb-4 text-gray-200" />
                    <p className="font-semibold">Aucune notification pour le moment.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {notifications.map(n => (
                        <div 
                            key={n.id} 
                            className={`p-5 transition-colors flex items-start gap-4 justify-between ${
                                n.read_at ? 'bg-white' : 'bg-blue-50/20'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                    n.read_at ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    <Bell size={16} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                                        {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                                        {new Date(n.created_at).toLocaleDateString('fr-FR')} à {
                                            new Date(n.created_at).toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }
                                    </p>
                                </div>
                            </div>
                            {!n.read_at && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
                                >
                                    Marquer comme lue
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
