import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../lib/axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { Briefcase, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/register', formData);
            dispatch(setCredentials({
                user: res.data.user,
                token: res.data.token
            }));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Column - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[600px] lg:px-20 xl:px-24 bg-white shadow-2xl z-10">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Créer un compte
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ou{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                connectez-vous à votre compte existant
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'client' })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                        formData.role === 'client' 
                                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-blue-200'
                                    }`}
                                >
                                    <User size={24} className="mb-2" />
                                    <span className="font-semibold text-sm">Je suis un client</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'expert' })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                        formData.role === 'expert' 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200'
                                    }`}
                                >
                                    <Briefcase size={24} className="mb-2" />
                                    <span className="font-semibold text-sm">Je suis un expert</span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input 
                                    name="name" 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-gray-50 focus:bg-white transition-colors" 
                                    placeholder="Ex: Amine Benali"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-gray-50 focus:bg-white transition-colors" 
                                    placeholder="amine@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    required 
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-gray-50 focus:bg-white transition-colors" 
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                <input 
                                    name="password_confirmation" 
                                    type="password" 
                                    required 
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-gray-50 focus:bg-white transition-colors" 
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gray-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? 'Création en cours...' : 'Créer mon compte'}
                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Right Column - Presentation */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gray-900">
                <div className="absolute inset-0 h-full w-full object-cover">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800 via-gray-900 to-gray-900 opacity-80"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-50"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center px-16 lg:px-24">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                Rejoignez la plateforme numéro 1 au Maroc.
                            </h2>
                            <div className="space-y-6 text-gray-300 text-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                                    <span>{formData.role === 'client' ? 'Des milliers d\'experts vérifiés et disponibles.' : 'Gagnez de nouveaux clients facilement.'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                                    <span>{formData.role === 'client' ? 'Réservation en quelques clics sans stress.' : 'Gérez vos réservations via un agenda digital.'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                                    <span>{formData.role === 'client' ? 'Paiement direct et sécurisé sur place.' : 'Zéro commission sur vos interventions.'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
