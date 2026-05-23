import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../lib/axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/login', formData);
            const { user, token } = res.data;
            dispatch(setCredentials({ user, token }));

            // Role-based redirect
            const isExpert = user?.roles?.some(r => r.name === 'expert');
            if (isExpert) {
                navigate('/expert/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
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
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Bon retour !
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Vous n'avez pas encore de compte ?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Inscrivez-vous gratuitement
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié ?</a>
                                </div>
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

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Right Column - Presentation */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gray-50">
                <div className="absolute inset-0 h-full w-full object-cover overflow-hidden">
                    {/* Soft gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
                    
                    {/* Decorative blurred circles */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-200/50 rounded-full blur-[60px]"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center items-center px-16 text-center">
                        <ShieldCheck size={80} className="text-blue-600 mb-8 drop-shadow-sm" />
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-lg">
                            Votre espace sécurisé <br/>
                            <span className="text-blue-600">Expert Maroc</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-md">
                            Connectez-vous pour gérer vos réservations, contacter les artisans, et suivre l'avancement de vos travaux en toute tranquillité.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
