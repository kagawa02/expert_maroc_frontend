import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import axios from './lib/axios';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

import Home from './pages/Home';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import ExpertDashboard from './pages/dashboards/ExpertDashboard';

// Helper to check role
const hasRole = (user, role) => user?.roles?.some(r => r.name === role);

// ─── Public layout (with nav header) ─────────────────────────────────────────
function PublicLayout({ children }) {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch (err) { console.error(err); }
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
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                    <User size={16} className="text-blue-600" />
                                    {user?.name || 'Mon Profil'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                    title="Se déconnecter"
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

// ─── Protected route for experts ──────────────────────────────────────────────
function ExpertRoute({ children }) {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!hasRole(user, 'expert')) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated || !hasRole(user, 'expert')) return null;
    return children;
}

// ─── Auto-redirect after login ────────────────────────────────────────────────
function LoginPage() {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            if (hasRole(user, 'expert')) {
                navigate('/expert/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    return <Login />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <Routes>
            {/* Full-screen expert dashboard (no public header) */}
            <Route
                path="/expert/dashboard"
                element={
                    <ExpertRoute>
                        <ExpertDashboard />
                    </ExpertRoute>
                }
            />

            {/* Public pages with header */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/register-expert" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        </Routes>
    );
}
