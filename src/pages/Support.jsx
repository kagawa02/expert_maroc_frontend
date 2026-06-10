import React, { useState } from 'react';
import { Headphones, Mail, MapPin, MessageSquare, Phone, Send, ShieldCheck } from 'lucide-react';

export default function Support() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [sent, setSent] = useState(false);

    const handleChange = (event) => {
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-blue-200 text-sm font-semibold mb-6">
                            <Headphones size={16} />
                            Support Expert Maroc
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">Besoin d'aide ?</h1>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                            Notre equipe vous accompagne pour les reservations, les demandes clients, les profils experts et les questions de paiement sur place.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 max-w-6xl py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-8 items-start">
                    <aside className="space-y-4">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-5">Nous contacter</h2>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Mail size={19} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Email</p>
                                        <p className="text-sm text-gray-500">support@expertmaroc.ma</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Phone size={19} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Telephone</p>
                                        <p className="text-sm text-gray-500">+212 5 22 00 00 00</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <MapPin size={19} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Zone</p>
                                        <p className="text-sm text-gray-500">Support disponible au Maroc</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <ShieldCheck size={22} className="text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-extrabold text-gray-900 mb-2">Reservations et paiements</h3>
                                    <p className="text-sm text-gray-500 leading-6">
                                        Les reservations sont envoyees a l'expert avec le statut en attente. Le paiement se fait directement sur place.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900">Envoyer un message</h2>
                                <p className="text-sm text-gray-500">Nous repondons generalement sous 24h.</p>
                            </div>
                        </div>

                        {sent && (
                            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-semibold">
                                Message envoye. Notre equipe support vous recontactera rapidement.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom complet</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="vous@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sujet</label>
                                <select
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="">Choisir un sujet</option>
                                    <option value="reservation">Reservation</option>
                                    <option value="expert">Compte expert</option>
                                    <option value="client">Compte client</option>
                                    <option value="technical">Probleme technique</option>
                                    <option value="other">Autre demande</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                    placeholder="Expliquez votre demande..."
                                />
                            </div>

                            <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-colors">
                                Envoyer
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
