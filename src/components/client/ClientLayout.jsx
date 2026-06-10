import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Bell, CalendarCheck, LogOut, Menu, MessageSquare, User, X } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import axios from '../../lib/axios';

function Sidebar({ isOpen, setIsOpen, user, onLogout }) {
    const location = useLocation();

    const navItems = [
        { path: '/client/dashboard', label: 'Réservations', icon: <CalendarCheck size={20} /> },
        { path: '/client/dashboard/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
        { path: '/client/dashboard/profile', label: 'Profil', icon: <User size={20} /> },
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
                    {navItems.map(item => {
                        // Exact match for index route, startsWith for messages
                        const isActive = item.path === '/client/dashboard' 
                            ? location.pathname === '/client/dashboard'
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
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

const PAGE_TITLES = {
    '/client/dashboard': 'Réservations',
    '/client/dashboard/messages': 'Messages',
    '/client/dashboard/profile': 'Profil',
};

function getTitle(pathname) {
    if (pathname.startsWith('/client/dashboard/messages/')) return 'Conversation';
    return PAGE_TITLES[pathname] || 'Réservations';
}

export default function ClientLayout() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch {}
        dispatch(logout());
        navigate('/login');
    };

    const pageTitle = getTitle(location.pathname);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">{pageTitle}</h1>
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
