import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import axios from './lib/axios';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

import Home from './pages/Home';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import GigDetails from './pages/GigDetails';
import Support from './pages/Support';
import Faq from './pages/Faq';
import ClientLayout from './components/client/ClientLayout';
import ClientReservationsPage from './pages/dashboards/client/ReservationsPage';
import ClientProfilePage from './pages/dashboards/client/ProfilePage';
import ClientMessagesPage from './pages/dashboards/client/messages/MessagesPage';
import ClientConversationPage from './pages/dashboards/client/messages/ConversationPage';
import ExpertLayout from './components/expert/ExpertLayout';
import OverviewPage from './pages/dashboards/expert/OverviewPage';
import MessagesPage from './pages/dashboards/expert/messages/MessagesPage';
import ConversationPage from './pages/dashboards/expert/messages/ConversationPage';
import ServicesPage from './pages/dashboards/expert/services/ServicesPage';
import ReviewsPage from './pages/dashboards/expert/reviews/ReviewsPage';

const hasRole = (user, role) => user?.roles?.some((r) => r.name === role);

function PublicLayout({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch {}
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
                        Expert<span className="text-gray-900">Maroc</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/search" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            Trouver un expert
                        </Link>
                        <Link to="/faqs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            FAQs
                        </Link>
                        <Link to="/support" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            Support
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                                    Connexion
                                </Link>
                                <Link to="/register" className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                                    S'inscrire
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                                {hasRole(user, 'expert') && (
                                    <Link
                                        to="/expert/dashboard"
                                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                )}
                                {hasRole(user, 'client') && (
                                    <Link
                                        to="/client/dashboard"
                                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                    <User size={16} className="text-blue-600" />
                                    {user?.name || 'Mon Profil'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}

function ExpertRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasRole(user, 'expert')) return <Navigate to="/" replace />;
    return children;
}

function ClientRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasRole(user, 'client')) return <Navigate to="/" replace />;
    return children;
}

function LoginPage() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        if (hasRole(user, 'expert')) return <Navigate to="/expert/dashboard" replace />;
        if (hasRole(user, 'client')) return <Navigate to="/client/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Login />;
}

export default function App() {
    return (
        <Routes>
            <Route
                path="/expert/dashboard"
                element={
                    <ExpertRoute>
                        <ExpertLayout />
                    </ExpertRoute>
                }
            >
                <Route index element={<OverviewPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="messages/:id" element={<ConversationPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
            </Route>

            <Route
                path="/client/dashboard"
                element={
                    <ClientRoute>
                        <ClientLayout />
                    </ClientRoute>
                }
            >
                <Route index element={<ClientReservationsPage />} />
                <Route path="profile" element={<ClientProfilePage />} />
                <Route path="messages" element={<ClientMessagesPage />} />
                <Route path="messages/:id" element={<ClientConversationPage />} />
            </Route>

            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
            <Route path="/gigs/:id" element={<PublicLayout><GigDetails /></PublicLayout>} />
            <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />
            <Route path="/faqs" element={<PublicLayout><Faq /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/register-expert" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        </Routes>
    );
}
