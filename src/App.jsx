import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import axios from './lib/axios';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

// Pages
import Home     from './pages/Home';
import Search   from './pages/Search';
import Register from './pages/Register';
import Login    from './pages/Login';

// Expert dashboard layout + pages
import ExpertLayout      from './components/expert/ExpertLayout';
import OverviewPage      from './pages/dashboards/expert/OverviewPage';
import MessagesPage      from './pages/dashboards/expert/messages/MessagesPage';
import ConversationPage  from './pages/dashboards/expert/messages/ConversationPage';
import ServicesPage      from './pages/dashboards/expert/services/ServicesPage';
import ReviewsPage       from './pages/dashboards/expert/reviews/ReviewsPage';

// ─── Helper ───────────────────────────────────────────────────────────────────
const hasRole = (user, role) => user?.roles?.some((r) => r.name === role);

// ─── Public layout (with nav header) ─────────────────────────────────────────
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
                        <Link
                            to="/search"
                            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Trouver un expert
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                                >
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

// ─── Expert route guard ───────────────────────────────────────────────────────
function ExpertRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasRole(user, 'expert')) return <Navigate to="/" replace />;
    return children;
}

// ─── Login page (redirect if already logged in) ───────────────────────────────
function LoginPage() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return hasRole(user, 'expert')
            ? <Navigate to="/expert/dashboard" replace />
            : <Navigate to="/" replace />;
    }
    return <Login />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <Routes>
            {/* ── Expert dashboard (nested routes, shared layout) ─────── */}
            <Route
                path="/expert/dashboard"
                element={
                    <ExpertRoute>
                        <ExpertLayout />
                    </ExpertRoute>
                }
            >
                <Route index            element={<OverviewPage />} />
                <Route path="messages"  element={<MessagesPage />} />
                <Route path="messages/:id" element={<ConversationPage />} />
                <Route path="services"  element={<ServicesPage />} />
                <Route path="reviews"   element={<ReviewsPage />} />
            </Route>

            {/* ── Public pages ────────────────────────────────────────── */}
            <Route path="/"               element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/search"         element={<PublicLayout><Search /></PublicLayout>} />
            <Route path="/register"       element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/register-expert" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/login"          element={<PublicLayout><LoginPage /></PublicLayout>} />
        </Routes>
    );
}
