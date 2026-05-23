import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, MessageSquare, Briefcase, Star,
    LogOut, Bell, ChevronRight, Clock, CheckCircle2,
    XCircle, Loader2, TrendingUp, Users, Menu, X,
    Plus, Pencil, Trash2, DollarSign, AlertTriangle, Save, Image as ImageIcon,
    ArrowLeft, MoreVertical, Paperclip, Send
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import axios from '../../lib/axios';

// ─── Status config for messages ───────────────────────────────────────────────
const STATUS_CONFIG = {
    pending:     { label: 'En attente',  color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: <Clock size={13} /> },
    accepted:    { label: 'Accepté',     color: 'text-blue-600 bg-blue-50 border-blue-200',          icon: <CheckCircle2 size={13} /> },
    in_progress: { label: 'En cours',    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',    icon: <Loader2 size={13} /> },
    completed:   { label: 'Terminé',     color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={13} /> },
    rejected:    { label: 'Refusé',      color: 'text-red-600 bg-red-50 border-red-200',             icon: <XCircle size={13} /> },
};

const FAKE_MESSAGES = [
    { id: 1, client: { name: 'Youssef Alami', avatar: 'Y' }, gig: 'Custom Carpentry & Woodwork', notes: 'Bonjour, j\'ai besoin de faire installer une bibliothèque sur mesure dans mon salon.', status: 'pending',   time: 'Il y a 10 min', unread: true  },
    { id: 2, client: { name: 'Sara Benali',   avatar: 'S' }, gig: 'Custom Carpentry & Woodwork', notes: 'Bonjour, j\'ai une fuite au niveau du robinet de la salle de bain.',               status: 'accepted',  time: 'Il y a 2h',     unread: false },
    { id: 3, client: { name: 'Amine Tazi',    avatar: 'A' }, gig: 'Kitchen Cabinet Installation',notes: 'Salut, je cherche quelqu\'un pour installer des placards dans ma cuisine.',          status: 'completed', time: 'Hier',          unread: false },
    { id: 4, client: { name: 'Nour El Houda', avatar: 'N' }, gig: 'Custom Carpentry & Woodwork', notes: 'Bonjour, je voudrais un devis pour l\'aménagement d\'une chambre enfant.',           status: 'pending',   time: 'Il y a 1 jour', unread: true  },
];

// ─── Gig Modal (Create / Edit) ────────────────────────────────────────────────
function GigModal({ gig, onClose, onSaved }) {
    const isEditing = !!gig;
    const [form, setForm] = useState({
        title:       gig?.title       ?? '',
        description: gig?.description ?? '',
        price:       gig?.price       ?? '',
        city_id:     gig?.city_id     ?? '',
    });
    const [image,       setImage]       = useState(null);
    const [imagePreview, setImagePreview] = useState(gig?.image_url ?? null);
    const [cities,      setCities]      = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);

    useEffect(() => {
        axios.get('/cities').then(res => setCities(res.data)).catch(console.error);
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('title',       form.title);
            formData.append('description', form.description);
            if (form.price !== '')   formData.append('price',   form.price);
            if (form.city_id !== '') formData.append('city_id', form.city_id);
            if (image)               formData.append('image',   image);

            let res;
            if (isEditing) {
                formData.append('_method', 'PUT');
                res = await axios.post(`/gigs/${gig.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/gigs', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSaved(res.data, isEditing);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Modifier le service' : 'Nouveau service'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{isEditing ? 'Modifiez les informations de votre service.' : 'Ce service sera visible par tous les clients.'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
                            <AlertTriangle size={18} className="shrink-0" /> {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Photo du service <span className="ml-2 text-xs font-normal text-gray-400">— Optionnel</span></label>
                        <label className="relative cursor-pointer group block">
                            <div className={`w-full h-40 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${imagePreview ? 'border-blue-300' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
                                {imagePreview ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" /> : (
                                    <div className="text-center text-gray-400 group-hover:text-blue-500 transition-colors p-4">
                                        <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
                                        <p className="text-xs mt-1">PNG, JPG, WEBP — max 2MB</p>
                                    </div>
                                )}
                                {imagePreview && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white font-semibold text-sm">Changer l'image</p></div>}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Titre du service *</label>
                        <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Ex: Réparation de plomberie..." className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea name="description" required value={form.description} onChange={handleChange} rows={3} placeholder="Décrivez votre service..." className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                            <select name="city_id" value={form.city_id} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <option value="">Toutes les villes</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (DH) <span className="block text-xs font-normal text-gray-400">Vide = "Sur devis"</span></label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="Ex: 500" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-60 transition-all">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Enregistrement...' : (isEditing ? 'Enregistrer' : 'Publier le service')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirm({ gig, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/gigs/${gig.id}`);
            onDeleted(gig.id);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5"><Trash2 size={32} /></div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Supprimer ce service ?</h3>
                <p className="text-gray-500 text-sm mb-8">Le service <strong className="text-gray-700">"{gig.title}"</strong> sera définitivement supprimé. Cette action est irréversible.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                    <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Gig Card ─────────────────────────────────────────────────────────────────
function GigCard({ gig, onEdit, onDelete }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{gig.title}</h4>
                    <span className="shrink-0 bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">{gig.price ? `${parseFloat(gig.price).toLocaleString()} DH` : 'Sur devis'}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">{gig.description}</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(gig)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Pencil size={15} /> Modifier</button>
                    <button onClick={() => onDelete(gig)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={15} /> Supprimer</button>
                </div>
            </div>
        </div>
    );
}

// ─── My Gigs Tab ──────────────────────────────────────────────────────────────
function MyGigsTab() {
    const [gigs,          setGigs]          = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [showModal,     setShowModal]     = useState(false);
    const [editingGig,    setEditingGig]    = useState(null);
    const [deletingGig,   setDeletingGig]   = useState(null);

    useEffect(() => {
        axios.get('/my-gigs').then(res => setGigs(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleSaved = (savedGig, isEditing) => {
        if (isEditing) setGigs(prev => prev.map(g => g.id === savedGig.id ? savedGig : g));
        else setGigs(prev => [savedGig, ...prev]);
        setShowModal(false); setEditingGig(null);
    };

    const handleDeleted = (gigId) => {
        setGigs(prev => prev.filter(g => g.id !== gigId));
        setDeletingGig(null);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Mes services publiés</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{gigs.length} service{gigs.length !== 1 ? 's' : ''} en ligne</p>
                </div>
                <button onClick={() => { setEditingGig(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-105">
                    <Plus size={18} /> Nouveau service
                </button>
            </div>

            {loading ? <div className="flex justify-center py-24"><Loader2 size={36} className="animate-spin text-blue-500" /></div> : gigs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-24 text-center px-6">
                    <Briefcase size={56} className="text-gray-200 mb-4" />
                    <p className="text-lg font-bold text-gray-500 mb-2">Aucun service publié</p>
                    <p className="text-sm text-gray-400 mb-6">Créez votre premier service pour apparaître dans les recherches des clients.</p>
                    <button onClick={() => { setEditingGig(null); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md"><Plus size={18} /> Créer mon premier service</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {gigs.map(gig => <GigCard key={gig.id} gig={gig} onEdit={g => { setEditingGig(g); setShowModal(true); }} onDelete={setDeletingGig} />)}
                </div>
            )}

            {showModal && <GigModal gig={editingGig} onClose={() => { setShowModal(false); setEditingGig(null); }} onSaved={handleSaved} />}
            {deletingGig && <DeleteConfirm gig={deletingGig} onClose={() => setDeletingGig(null)} onDeleted={handleDeleted} />}
        </>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, onLogout, user, isOpen, setIsOpen }) {
    const unreadCount = FAKE_MESSAGES.filter(m => m.unread).length;
    const navItems = [
        { id: 'overview',  label: 'Vue d\'ensemble', icon: <LayoutDashboard size={20} /> },
        { id: 'messages',  label: 'Messages',         icon: <MessageSquare size={20} />,  badge: unreadCount },
        { id: 'gigs',      label: 'Mes services',     icon: <Briefcase size={20} /> },
        { id: 'reviews',   label: 'Avis clients',     icon: <Star size={20} /> },
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md">{user?.name?.charAt(0)}</div>
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-emerald-400 font-medium">● Expert vérifié</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 mt-6 space-y-1">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); setIsOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                            <div className="flex items-center gap-3">{item.icon}{item.label}</div>
                            {item.badge > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-all"><LogOut size={20} /> Déconnexion</button>
                </div>
            </aside>
        </>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, trend, color }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1"><TrendingUp size={11} /> {trend}</span>}
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
}

// ─── Message Row ──────────────────────────────────────────────────────────────
function MessageRow({ msg, onClick }) {
    const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending;
    return (
        <div onClick={onClick} className={`flex gap-4 p-5 hover:bg-gray-50/80 transition-colors cursor-pointer ${msg.unread ? 'bg-blue-50/30' : ''}`}>
            <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">{msg.client.avatar}</div>
                {msg.unread && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold text-gray-900 ${msg.unread ? 'text-blue-900' : ''}`}>{msg.client.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>{status.icon} {status.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 font-medium">{msg.gig}</p>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{msg.notes}</p>
            </div>
        </div>
    );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ setActiveTab, onSelectMessage }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Demandes reçues" value="12" icon={<MessageSquare size={22} className="text-blue-600" />} trend="+3 ce mois" color="bg-blue-50" />
                <StatCard label="Clients servis" value="8" icon={<Users size={22} className="text-indigo-600" />} trend="+2" color="bg-indigo-50" />
                <StatCard label="Taux d'acceptation" value="92%" icon={<CheckCircle2 size={22} className="text-emerald-600" />} color="bg-emerald-50" />
                <StatCard label="Note moyenne" value="4.9" icon={<Star size={22} className="text-amber-500" />} trend="⭐ Top" color="bg-amber-50" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Messages récents</h3>
                    <button onClick={() => setActiveTab('messages')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">Voir tout <ChevronRight size={16} /></button>
                </div>
                <div className="divide-y divide-gray-50">
                    {FAKE_MESSAGES.slice(0, 3).map(msg => <MessageRow key={msg.id} msg={msg} onClick={() => onSelectMessage(msg)} />)}
                </div>
            </div>
        </div>
    );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab({ onSelectMessage }) {
    const [filter, setFilter] = useState('all');
    const filters = [{ id: 'all', label: 'Tous' }, { id: 'pending', label: 'En attente' }, { id: 'accepted', label: 'Acceptés' }, { id: 'completed', label: 'Terminés' }];
    const filtered = filter === 'all' ? FAKE_MESSAGES : FAKE_MESSAGES.filter(m => m.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
                {filters.map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${filter === f.id ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>{f.label}</button>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-40" />
                        <p className="font-medium">Aucun message trouvé</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map(msg => <MessageRow key={msg.id} msg={msg} onClick={() => onSelectMessage(msg)} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Conversation View ────────────────────────────────────────────────────────
function ConversationView({ msg, onBack }) {
    if (!msg) return null;
    const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Left/Main Chat Area */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {msg.client.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{msg.client.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">Demande de service</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                            {status.icon} {status.label}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.time}</span>
                    </div>

                    {/* Initial Request Bubble */}
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {msg.client.avatar}
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                <p className="text-sm font-bold text-gray-900 mb-1">Nouveau projet : {msg.gig}</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{msg.notes}</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium mt-1 ml-1 block">{msg.time}</span>
                        </div>
                    </div>

                    {/* Example Expert Reply */}
                    <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">
                            Moi
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md">
                                <p className="text-sm leading-relaxed">
                                    Bonjour {msg.client.name.split(' ')[0]}, merci de m'avoir contacté. Pourriez-vous m'envoyer quelques photos du problème pour que je puisse évaluer la situation ?
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium mt-1 mr-1 block">À l'instant</span>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors shrink-0">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            rows={1}
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
                        />
                        <button className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shrink-0">
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar Details */}
            <div className="w-80 hidden xl:flex flex-col bg-gray-50/30">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5">Détails de la demande</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Service demandé</p>
                            <p className="text-sm font-semibold text-gray-900">{msg.gig}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Date de la demande</p>
                            <p className="text-sm font-semibold text-gray-900">{msg.time}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1.5">Statut</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                                {status.icon} {status.label}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-6 flex-1 bg-white border-t border-gray-100 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2">
                            <CheckCircle2 size={16} /> Accepter la demande
                        </button>
                        <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 text-sm font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2">
                            <XCircle size={16} /> Refuser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ExpertDashboard() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab,    setActiveTab]    = useState('overview');
    const [sidebarOpen,  setSidebarOpen]  = useState(false);
    const [selectedMsg,  setSelectedMsg]  = useState(null);

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch {}
        dispatch(logout());
        navigate('/login');
    };

    const handleSelectMessage = (msg) => {
        setSelectedMsg(msg);
        setActiveTab('conversation');
    };

    const unreadCount = FAKE_MESSAGES.filter(m => m.unread).length;
    const tabTitles = { overview: 'Vue d\'ensemble', messages: 'Messages', gigs: 'Mes services', reviews: 'Avis clients', conversation: 'Conversation' };

    const renderTab = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab setActiveTab={setActiveTab} onSelectMessage={handleSelectMessage} />;
            case 'messages': return <MessagesTab onSelectMessage={handleSelectMessage} />;
            case 'conversation': return <ConversationView msg={selectedMsg} onBack={() => { setActiveTab('messages'); setSelectedMsg(null); }} />;
            case 'gigs':     return <MyGigsTab />;
            case 'reviews':  return (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-gray-300">
                    <Star size={56} />
                    <p className="mt-4 text-lg font-semibold text-gray-400">Avis clients</p>
                    <p className="text-sm text-gray-400 mt-1">Cette section sera disponible très prochainement.</p>
                </div>
            );
            default: return <OverviewTab setActiveTab={setActiveTab} onSelectMessage={handleSelectMessage} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar activeTab={activeTab === 'conversation' ? 'messages' : activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">{tabTitles[activeTab]}</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Bonjour, <span className="font-semibold text-gray-600">{user?.name}</span> 👋
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderTab()}
                </main>
            </div>
        </div>
    );
}
