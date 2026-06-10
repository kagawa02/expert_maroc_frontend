import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    CalendarCheck,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    LogOut,
    Menu,
    MessageSquare,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import axios, { API_ORIGIN } from '../../lib/axios';

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

function Sidebar({ activeTab, setActiveTab, onLogout, user, isOpen, setIsOpen }) {
    const navItems = [
        { id: 'reservations', label: 'Réservations', icon: <CalendarCheck size={20} /> },
        { id: 'messages', label: 'Message', icon: <MessageSquare size={20} /> },
        { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div><span className="text-xl font-extrabold text-white">Expert</span><span className="text-xl font-extrabold text-blue-400">Maroc</span></div>
                    <button className="lg:hidden p-1 text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="flex items-center gap-3 px-5 py-4 mx-4 mt-4 rounded-2xl bg-gray-800/60">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name || 'Client'}</p>
                        <p className="text-xs text-emerald-400 font-medium">Compte client</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 mt-6 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-all">
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
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

function ReservationsPage({ bookings, loading }) {
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

function MessagesPage({ bookings }) {
    const messages = useMemo(() => bookings.filter(booking => booking.message || booking.notes), [bookings]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-500 mt-1">Retrouvez les échanges liés à vos réservations.</p>
            </div>
            {messages.length === 0 ? (
                <div className="py-24 text-center text-gray-400">
                    <MessageSquare size={52} className="mx-auto mb-4 text-gray-200" />
                    <p className="font-semibold">Aucun message pour le moment.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {messages.map(booking => (
                        <div key={booking.id} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <p className="font-bold text-gray-900">{booking.gig?.title || 'Réservation'}</p>
                                <span className="text-xs text-gray-400">{booking.scheduled_at || 'Date à confirmer'}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{booking.message || booking.notes}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProfilePage({ user }) {
    return (
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
                    {user?.name?.charAt(0) || 'C'}
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-gray-900">{user?.name || 'Client'}</h3>
                    <p className="text-sm text-gray-500">Compte client Expert Maroc</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Nom</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">{user?.name || '-'}</div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">{user?.email || '-'}</div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Rôle</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">Client</div>
                </div>
            </div>
        </div>
    );
}

export default function ClientDashboard() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reservations');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/bookings')
            .then(res => setBookings(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch {}
        dispatch(logout());
        navigate('/login');
    };

    const tabTitles = {
        reservations: 'Réservations',
        messages: 'Message',
        profile: 'Profil',
    };

    const renderPage = () => {
        switch (activeTab) {
            case 'messages': return <MessagesPage bookings={bookings} />;
            case 'profile': return <ProfilePage user={user} />;
            case 'reservations':
            default: return <ReservationsPage bookings={bookings} loading={loading} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">{tabTitles[activeTab]}</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Bonjour, <span className="font-semibold text-gray-600">{user?.name || 'client'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0) || 'C'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
