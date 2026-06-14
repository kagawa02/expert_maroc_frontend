import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Menu } from 'lucide-react';
import axios from '../../lib/axios';
import Sidebar from './Sidebar';

// Map route paths to page titles
const PAGE_TITLES = {
    '/expert/dashboard':            "Vue d'ensemble",
    '/expert/dashboard/messages':   'Messages',
    '/expert/dashboard/services':   'Mes services',
    '/expert/dashboard/reviews':    'Avis clients',
};

function getTitle(pathname) {
    // Conversation sub-route
    if (pathname.startsWith('/expert/dashboard/messages/')) return 'Conversation';
    return PAGE_TITLES[pathname] || "Vue d'ensemble";
}

export default function ExpertLayout() {
    const { user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/notifications')
            .then(res => {
                const count = res.data.filter(n => !n.read_at).length;
                setUnreadCount(count);
            })
            .catch(console.error);
    }, [location.pathname]); // Refresh on navigation

    const pageTitle = getTitle(location.pathname);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header bar */}
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">{pageTitle}</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Bonjour,{' '}
                                <span className="font-semibold text-gray-600">{user?.name}</span>{' '}
                                👋
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/expert/dashboard/notifications')}
                            className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-gray-50 rounded-full" />
                            )}
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content rendered here */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
