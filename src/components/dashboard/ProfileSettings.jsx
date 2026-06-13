import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Save, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../lib/axios';
import { updateUser } from '../../store/slices/authSlice';

function extractUser(payload) {
    return payload?.user || payload?.data || payload;
}

export default function ProfileSettings({ roleLabel = 'Utilisateur' }) {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        }));
    }, [user]);

    const handleChange = (event) => {
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
        };

        if (form.password) {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
        }

        try {
            const response = await axios.patch('/profile', payload);
            const updatedUser = extractUser(response.data);
            dispatch(updateUser(updatedUser));
            setForm(prev => ({ ...prev, password: '', password_confirmation: '' }));
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de modifier le profil pour le moment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || <User size={30} />}
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-gray-900">{user?.name || roleLabel}</h3>
                    <p className="text-sm text-gray-500">Compte {roleLabel}</p>
                </div>
            </div>

            {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-medium">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm font-medium">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    <span>Profil modifié avec succès.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Nom</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Téléphone</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Optionnel"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Rôle</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">{roleLabel}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Nouveau mot de passe</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Laisser vide pour ne pas changer"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Confirmation</label>
                        <input
                            name="password_confirmation"
                            type="password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirmer le mot de passe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 disabled:opacity-60 transition-colors"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Enregistrer les modifications
                </button>
            </form>
        </div>
    );
}
