import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard,
    MessageSquare,
    Briefcase,
    Star,
    LogOut,
    X,
    Bell,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import axios from '../../lib/axios';
import { FAKE_MESSAGES } from '../../constants/expertDashboard';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const unreadCount = FAKE_MESSAGES.filter((m) => m.unread).length;

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
        } catch {}
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        {
            to: '/expert/dashboard',
            end: true,
            label: "Vue d'ensemble",
            icon: <LayoutDashboard size={20} />,
        },
        {
            to: '/expert/dashboard/messages',
            label: 'Messages',
            icon: <MessageSquare size={20} />,
            badge: unreadCount,
        },
        {
            to: '/expert/dashboard/services',
            label: 'Mes services',
            icon: <Briefcase size={20} />,
        },
        {
            to: '/expert/dashboard/reviews',
            label: 'Avis clients',
            icon: <Star size={20} />,
        },
        {
            to: '/expert/dashboard/notifications',
            label: 'Notifications',
            icon: <Bell size={20} />,
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col
                    transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:flex
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div>
                        <span className="text-xl font-extrabold text-white">Expert</span>
                        <span className="text-xl font-extrabold text-blue-400">Maroc</span>
                    </div>
                    <button
                        className="lg:hidden p-1 text-gray-400 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 px-5 py-4 mx-4 mt-4 rounded-2xl bg-gray-800/60">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-emerald-400 font-medium">● Expert vérifié</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 mt-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                            </div>
                            {item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-all"
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
