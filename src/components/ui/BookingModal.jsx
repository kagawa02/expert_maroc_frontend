import React, { useState } from 'react';
import { X, FileText, CheckCircle, Loader2, Send } from 'lucide-react';
import axios from '../../lib/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, gig }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [notes, setNotes] = useState('');
    
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    if (!isOpen || !gig) return null;

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!notes.trim()) {
            setError('Veuillez décrire votre problème avant d\'envoyer.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await axios.post('/bookings', {
                gig_id: gig.id,
                scheduled_at: null, // No exact reservation date yet
                notes: notes
            });
            setStep(2); // Success step
        } catch (err) {
            if (err.response?.status === 401 || err.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setNotes('');
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            {/* Modal Centered Panel */}
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Demande de contact</h2>
                    <button onClick={handleClose} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        /* STEP 1: PROBLEM DETAILS */
                        <div>
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    {gig.user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">Vous contactez</p>
                                    <h3 className="font-bold text-gray-900 leading-tight">{gig.user?.name}</h3>
                                    <p className="text-sm text-gray-600 truncate">{gig.title}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Quel est votre besoin ?</h3>
                                <p className="text-gray-500 text-sm">Décrivez votre problème à l'artisan. Vous pourrez convenir d'une date et d'un tarif ensemble après ce premier contact.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border-2 border-gray-200 focus-within:border-blue-500 rounded-2xl transition-colors bg-white shadow-sm">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        <FileText size={16} /> Message
                                    </label>
                                    <textarea 
                                        rows="5"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Ex: Bonjour, j'ai besoin de vos services pour..."
                                        className="w-full text-gray-900 font-medium focus:outline-none bg-transparent resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button onClick={handleClose} className="px-6 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                                    Annuler
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 group disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : 'Envoyer la demande'}
                                    {!loading && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* STEP 2: SUCCESS */
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Message envoyé !</h3>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                Votre demande a été envoyée avec succès. <strong>{gig.user?.name}</strong> prendra connaissance de votre message et vous contactera très prochainement.
                            </p>
                            <button onClick={handleClose} className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-colors">
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
