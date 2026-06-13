import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    Check,
    X,
    Search,
    Trash2,
    AlertTriangle,
    UserCheck,
    UserX,
    Loader2,
    LogOut,
    Menu,
    Bell,
    Clock,
    ShieldAlert,
    Inbox
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import axios from '../../lib/axios';

export default function AdminDashboard() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Tab states
    const [activeTab, setActiveTab] = useState('pending-accounts');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Data states
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingGigs, setPendingGigs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ message: '', type: null });

    // Modal states
    const [deactivateUser, setDeactivateUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [refuseGig, setRefuseGig] = useState(null);
    const [refuseReason, setRefuseReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Show toast helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: null }), 4000);
    };

    // Load tab data
    useEffect(() => {
        fetchTabData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchTabData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending-accounts') {
                const res = await axios.get('/admin/users/pending');
                setPendingUsers(res.data);
            } else if (activeTab === 'active-accounts') {
                const res = await axios.get('/admin/users/active');
                setActiveUsers(res.data);
            } else if (activeTab === 'pending-gigs') {
                const res = await axios.get('/admin/gigs/pending');
                setPendingGigs(res.data);
            }
        } catch (err) {
            showToast('Erreur lors du chargement des données.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Search action
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(res.data);
        } catch (err) {
            showToast('Erreur lors de la recherche.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Account Actions
    const handleActivate = async (userId, userName) => {
        try {
            await axios.post(`/admin/users/${userId}/activate`);
            showToast(`Le compte de ${userName} a été activé avec succès.`, 'success');
            fetchTabData();
        } catch (err) {
            showToast("Impossible d'activer le compte.", 'error');
        }
    };

    const handleDeactivate = async () => {
        if (!deactivateUser) return;
        setSubmitting(true);
        try {
            await axios.post(`/admin/users/${deactivateUser.id}/deactivate`);
            showToast(`Le compte de ${deactivateUser.name} a été suspendu temporairement.`, 'success');
            setDeactivateUser(null);
            fetchTabData();
        } catch (err) {
            showToast("Impossible de suspendre le compte.", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUser) return;
        setSubmitting(true);
        try {
            await axios.delete(`/admin/users/${deleteUser.id}`);
            showToast(`Le compte de ${deleteUser.name} a été supprimé définitivement.`, 'success');
            setDeleteUser(null);
            // Refresh current list
            if (activeTab === 'search-accounts') {
                handleSearch();
            } else {
                fetchTabData();
            }
        } catch (err) {
            showToast("Impossible de supprimer le compte.", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Gig Actions
    const handleApproveGig = async (gigId, gigTitle) => {
        try {
            await axios.post(`/admin/gigs/${gigId}/approve`);
            showToast(`Le service "${gigTitle}" a été approuvé avec succès.`, 'success');
            fetchTabData();
        } catch (err) {
            showToast("Impossible d'approuver le service.", 'error');
        }
    };

    const handleRefuseGig = async () => {
        if (!refuseGig) return;
        setSubmitting(true);
        try {
            await axios.post(`/admin/gigs/${refuseGig.id}/refuse`, {
                rejection_reason: refuseReason
            });
            showToast(`Le service "${refuseGig.title}" a été refusé.`, 'success');
            setRefuseGig(null);
            setRefuseReason('');
            fetchTabData();
        } catch (err) {
            showToast("Impossible de refuser le service.", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch {}
        dispatch(logout());
        navigate('/login');
    };

    const formatRole = (role) => {
        if (role === 'expert') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Expert</span>;
        if (role === 'client') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Client</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">{role}</span>;
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            
            {/* Sidebar */}
            <div className={`fixed inset-0 bg-gray-900/50 z-20 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-950 text-white z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex shrink-0`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-900">
                    <div>
                        <span className="text-xl font-extrabold text-white">Espace</span>
                        <span className="text-xl font-extrabold text-blue-400">Admin</span>
                    </div>
                    <button className="lg:hidden p-1 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                </div>

                <div className="flex items-center gap-3 px-5 py-4 mx-4 mt-4 rounded-2xl bg-gray-900/60 border border-gray-900">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md">
                        A
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name || 'Administrateur'}</p>
                        <p className="text-xs text-blue-400 font-semibold">Super Admin</p>
                    </div>
                </div>

                <div className="px-4 mt-6">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gestion des comptes</p>
                    <nav className="space-y-1">
                        <button
                            onClick={() => { setActiveTab('pending-accounts'); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'pending-accounts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={18} />
                                <span>Comptes en attente</span>
                            </div>
                        </button>
                        <button
                            onClick={() => { setActiveTab('active-accounts'); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'active-accounts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={18} />
                                <span>Comptes actifs</span>
                            </div>
                        </button>
                        <button
                            onClick={() => { setActiveTab('search-accounts'); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'search-accounts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Search size={18} />
                                <span>Rechercher / Supprimer</span>
                            </div>
                        </button>
                    </nav>
                </div>

                <div className="px-4 mt-6">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gestion des Gigs</p>
                    <nav className="space-y-1">
                        <button
                            onClick={() => { setActiveTab('pending-gigs'); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'pending-gigs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={18} />
                                <span>Gigs en attente</span>
                            </div>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-900">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all">
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">
                                {activeTab === 'pending-accounts' && 'Comptes en attente d\'activation'}
                                {activeTab === 'active-accounts' && 'Comptes Actifs'}
                                {activeTab === 'search-accounts' && 'Rechercher / Supprimer un compte'}
                                {activeTab === 'pending-gigs' && 'Gestion des Gigs en attente'}
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Portail d'administration et de modération</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <Bell size={18} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                            AD
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
                    
                    {/* Floating Toast Notification */}
                    {toast.message && (
                        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border transition-all transform duration-300 animate-slide-in ${
                            toast.type === 'error' 
                            ? 'bg-red-50 text-red-700 border-red-200 shadow-red-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100'
                        }`}>
                            <span className="text-lg">{toast.type === 'error' ? '⚠️' : '✅'}</span>
                            <span className="font-semibold text-sm">{toast.message}</span>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
                            <Loader2 size={36} className="animate-spin text-blue-600" />
                        </div>
                    )}

                    {/* View: Pending Accounts */}
                    {activeTab === 'pending-accounts' && (
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="font-extrabold text-gray-900">Demandes d'activation</h3>
                                <p className="text-sm text-gray-500 mt-1">Ces utilisateurs attendent votre feu vert pour accéder à la plateforme.</p>
                            </div>
                            
                            {pendingUsers.length === 0 ? (
                                <div className="py-24 text-center text-gray-400">
                                    <Clock size={52} className="mx-auto mb-4 text-gray-200" />
                                    <p className="font-semibold">Aucun compte en attente d'activation.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="py-4 px-6">Nom</th>
                                                <th className="py-4 px-6">Email</th>
                                                <th className="py-4 px-6">Rôle</th>
                                                <th className="py-4 px-6">Date d'inscription</th>
                                                <th className="py-4 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                                            {pendingUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                                                    <td className="py-4 px-6 text-gray-500">{u.email}</td>
                                                    <td className="py-4 px-6">{formatRole(u.role_name)}</td>
                                                    <td className="py-4 px-6 text-gray-400">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button 
                                                            onClick={() => handleActivate(u.id, u.name)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
                                                        >
                                                            <UserCheck size={14} />
                                                            Activer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* View: Active Accounts */}
                    {activeTab === 'active-accounts' && (
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="font-extrabold text-gray-900">Comptes Actifs</h3>
                                <p className="text-sm text-gray-500 mt-1">Liste des utilisateurs ayant un accès opérationnel à Expert Maroc.</p>
                            </div>
                            
                            {activeUsers.length === 0 ? (
                                <div className="py-24 text-center text-gray-400">
                                    <Users size={52} className="mx-auto mb-4 text-gray-200" />
                                    <p className="font-semibold">Aucun compte actif trouvé.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="py-4 px-6">Nom</th>
                                                <th className="py-4 px-6">Email</th>
                                                <th className="py-4 px-6">Rôle</th>
                                                <th className="py-4 px-6">Inscription</th>
                                                <th className="py-4 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                                            {activeUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                                                    <td className="py-4 px-6 text-gray-500">{u.email}</td>
                                                    <td className="py-4 px-6">{formatRole(u.role_name)}</td>
                                                    <td className="py-4 px-6 text-gray-400">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button 
                                                            onClick={() => setDeactivateUser(u)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all"
                                                        >
                                                            <UserX size={14} />
                                                            Désactiver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* View: Search & Delete */}
                    {activeTab === 'search-accounts' && (
                        <div className="space-y-6">
                            
                            {/* Search Bar */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h3 className="font-extrabold text-gray-900 mb-4">Rechercher un compte</h3>
                                <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
                                    <div className="relative flex-1">
                                        <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher par nom ou adresse email..."
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-gray-50 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-md"
                                    >
                                        Rechercher
                                    </button>
                                </form>
                            </div>

                            {/* Search Results Table */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="font-extrabold text-gray-900">Résultats de recherche</h3>
                                    <p className="text-sm text-gray-500 mt-1">Recherchez puis supprimez de manière définitive un compte de la base de données.</p>
                                </div>
                                
                                {searchResults.length === 0 ? (
                                    <div className="py-20 text-center text-gray-400">
                                        <Inbox size={48} className="mx-auto mb-3 text-gray-200" />
                                        <p className="font-semibold text-sm">Saisissez une recherche pour afficher des résultats.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <th className="py-4 px-6">Nom</th>
                                                    <th className="py-4 px-6">Email</th>
                                                    <th className="py-4 px-6">Statut</th>
                                                    <th className="py-4 px-6">Rôle</th>
                                                    <th className="py-4 px-6 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                                                {searchResults.map(u => (
                                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                                                        <td className="py-4 px-6 text-gray-500">{u.email}</td>
                                                        <td className="py-4 px-6">
                                                            {u.status === 'active' && <span className="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full">Actif</span>}
                                                            {u.status === 'pending' && <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full animate-pulse">En attente</span>}
                                                            {u.status === 'suspended' && <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-50 rounded-full">Suspendu</span>}
                                                        </td>
                                                        <td className="py-4 px-6">{formatRole(u.role_name)}</td>
                                                        <td className="py-4 px-6 text-right">
                                                            <button 
                                                                onClick={() => setDeleteUser(u)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View: Pending Gigs */}
                    {activeTab === 'pending-gigs' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h3 className="font-extrabold text-gray-900">Validation des Gigs</h3>
                                <p className="text-sm text-gray-500 mt-1">Examinez les nouveaux services soumis par les Experts avant de les rendre visibles publiquement.</p>
                            </div>

                            {pendingGigs.length === 0 ? (
                                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-24 text-center text-gray-400">
                                    <FileText size={52} className="mx-auto mb-4 text-gray-200" />
                                    <p className="font-semibold">Aucun service en attente de validation.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {pendingGigs.map(gig => (
                                        <div key={gig.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <h4 className="text-lg font-extrabold text-gray-900 leading-snug">{gig.title}</h4>
                                                    <span className="text-lg font-black text-blue-600 shrink-0">
                                                        {gig.price ? `${Number(gig.price).toLocaleString('fr-FR')} DH` : 'Gratuit'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{gig.description}</p>
                                                
                                                <div className="border-t border-gray-100 pt-4 mb-4 grid grid-cols-2 gap-3 text-xs font-semibold text-gray-500">
                                                    <div>
                                                        <span className="text-gray-400 block font-bold uppercase tracking-wider text-[9px] mb-0.5">Créé par l'Expert</span>
                                                        <span className="text-gray-800 font-bold text-sm">{gig.user?.name || 'Inconnu'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block font-bold uppercase tracking-wider text-[9px] mb-0.5">Soumis le</span>
                                                        <span className="text-gray-800 font-bold text-sm">{new Date(gig.created_at).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 border-t border-gray-100 pt-4 mt-2">
                                                <button
                                                    onClick={() => handleApproveGig(gig.id, gig.title)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
                                                >
                                                    <Check size={16} />
                                                    Approuver
                                                </button>
                                                <button
                                                    onClick={() => setRefuseGig(gig)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold text-sm transition-colors"
                                                >
                                                    <X size={16} />
                                                    Refuser
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal: Confirm Deactivation */}
            {deactivateUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDeactivateUser(null)} />
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md p-6 relative z-10 animate-scale-up">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-5 border border-amber-100">
                            <AlertTriangle size={24} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Confirmer la désactivation</h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            Êtes-vous sûr de vouloir suspendre le compte de <span className="font-bold text-gray-800">{deactivateUser.name}</span> ? Cet utilisateur ne pourra plus se connecter à la plateforme jusqu'à ce que son compte soit réactivé.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeactivate}
                                disabled={submitting}
                                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                            >
                                {submitting ? 'Désactivation...' : 'Confirmer'}
                            </button>
                            <button
                                onClick={() => setDeactivateUser(null)}
                                className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Confirm Permanent Deletion */}
            {deleteUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDeleteUser(null)} />
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md p-6 relative z-10 animate-scale-up">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
                            <ShieldAlert size={24} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Suppression Définitive</h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-1 font-semibold">
                            Vous êtes sur le point de supprimer définitivement le compte de <span className="font-bold text-gray-800">{deleteUser.name}</span>.
                        </p>
                        <p className="text-xs text-red-500 leading-relaxed mb-6 font-bold uppercase tracking-wider">
                            ⚠️ Avertissement : Cette action est irréversible et détruira toutes les données associées (services, réservations).
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={submitting}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                            >
                                {submitting ? 'Suppression...' : 'Supprimer définitivement'}
                            </button>
                            <button
                                onClick={() => setDeleteUser(null)}
                                className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Refuse Gig with reason */}
            {refuseGig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { setRefuseGig(null); setRefuseReason(''); }} />
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md p-6 relative z-10 animate-scale-up">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
                            <X size={24} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Refuser le service</h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                            Veuillez indiquer le motif du refus pour le service <span className="font-bold text-gray-800">"{refuseGig.title}"</span>. Ce motif sera envoyé à l'Expert.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motif du refus (optionnel)</label>
                            <textarea
                                value={refuseReason}
                                onChange={e => setRefuseReason(e.target.value)}
                                rows={4}
                                placeholder="Indiquez les raisons du refus (ex: Description incomplète, tarifs trop élevés, catégorie incorrecte...)"
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-gray-50 focus:bg-white resize-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRefuseGig}
                                disabled={submitting}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                            >
                                {submitting ? 'Traitement...' : 'Confirmer le refus'}
                            </button>
                            <button
                                onClick={() => { setRefuseGig(null); setRefuseReason(''); }}
                                className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
