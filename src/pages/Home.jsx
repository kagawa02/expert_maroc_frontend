import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, Wrench, Zap, Paintbrush, Hammer, Briefcase, 
    CheckCircle, Clock, ShieldCheck, CreditCard, Star, 
    ArrowRight, ThermometerSnowflake, Truck, Sparkles, Leaf 
} from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
            
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-gray-900 text-white">
                {/* Dynamic SaaS Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-b from-blue-600/30 to-indigo-800/10 blur-[100px] mix-blend-screen"></div>
                    <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-t from-emerald-500/20 to-teal-800/10 blur-[100px] mix-blend-screen"></div>
                    {/* Grid Pattern overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-50"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-200 text-sm font-medium mb-8 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                        La 1ère plateforme d'artisans au Maroc
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] max-w-5xl mx-auto">
                        Trouvez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">meilleur expert</span><br />
                        pour vos travaux.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Des centaines de professionnels vérifiés, prêts à intervenir chez vous. Zéro stress, paiement sur place, satisfaction garantie.
                    </p>
                    
                    {/* SaaS-style Search Bar */}
                    <div className="max-w-2xl mx-auto bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl mb-16">
                        <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2">
                            <div className="flex-1 flex items-center px-4">
                                <Search size={24} className="text-gray-400 mr-3" />
                                <input 
                                    type="text" 
                                    placeholder="De quel service avez-vous besoin ?" 
                                    className="w-full py-3 text-gray-800 text-lg focus:outline-none bg-transparent"
                                    readOnly
                                    onClick={() => window.location.href = '/search'}
                                />
                            </div>
                            <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center whitespace-nowrap shadow-lg">
                                Rechercher
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-gray-400/80">
                        <div className="text-lg font-bold tracking-widest uppercase text-white/50">Casablanca</div>
                        <div className="text-lg font-bold tracking-widest uppercase text-white/50">Rabat</div>
                        <div className="text-lg font-bold tracking-widest uppercase text-white/50">Marrakech</div>
                        <div className="text-lg font-bold tracking-widest uppercase text-white/50">Tanger</div>
                    </div>
                </div>
            </section>

            {/* TRUST / FEATURES SECTION */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir Expert Maroc ?</h2>
                        <p className="text-gray-500 text-lg">La plateforme conçue pour votre tranquillité d'esprit.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Profils Vérifiés</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Chaque artisan passe par un processus de vérification strict pour garantir la qualité de son travail.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Réservation Rapide</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Trouvez un expert disponible immédiatement, prenez rendez-vous en ligne en moins de 2 minutes.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <CreditCard size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Paiement sur Place</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Aucun paiement en ligne requis. Vous réglez directement l'artisan une fois le travail terminé et validé.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS ROADMAP */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
                        <p className="text-gray-500 text-lg">Votre projet réalisé en 4 étapes simples.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop only) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] border-t-2 border-dashed border-gray-200 -z-10"></div>

                        <div className="grid md:grid-cols-4 gap-12 text-center relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full border-8 border-blue-50 flex items-center justify-center mb-6 shadow-sm relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">1</div>
                                    <Search size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">1. Cherchez</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Trouvez l'artisan idéal dans votre ville en parcourant nos profils vérifiés et détaillés.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full border-8 border-indigo-50 flex items-center justify-center mb-6 shadow-sm relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">2</div>
                                    <Clock size={32} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">2. Réservez</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Sélectionnez le créneau qui vous convient et réservez l'intervention en un clic.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full border-8 border-purple-50 flex items-center justify-center mb-6 shadow-sm relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">3</div>
                                    <Wrench size={32} className="text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">3. Intervention</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    L'expert se déplace chez vous à l'heure convenue et réalise le travail avec professionnalisme.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full border-8 border-emerald-50 flex items-center justify-center mb-6 shadow-sm relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">4</div>
                                    <CreditCard size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">4. Paiement</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    Le travail est terminé ? Payez l'artisan directement sur place, en toute sécurité.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES DIRECTORY */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos services</h2>
                            <p className="text-gray-500 text-lg">Tout ce dont votre maison a besoin.</p>
                        </div>
                        <Link to="/search" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group">
                            Voir tous les experts
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { icon: <Zap size={32} />, name: "Électricité", color: "text-yellow-500", bg: "bg-yellow-50" },
                            { icon: <Wrench size={32} />, name: "Plomberie", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: <Paintbrush size={32} />, name: "Peinture", color: "text-purple-500", bg: "bg-purple-50" },
                            { icon: <Hammer size={32} />, name: "Menuiserie", color: "text-orange-500", bg: "bg-orange-50" },
                            { icon: <ThermometerSnowflake size={32} />, name: "Climatisation", color: "text-cyan-500", bg: "bg-cyan-50" },
                            { icon: <Truck size={32} />, name: "Déménagement", color: "text-indigo-500", bg: "bg-indigo-50" },
                            { icon: <Sparkles size={32} />, name: "Nettoyage", color: "text-teal-500", bg: "bg-teal-50" },
                            { icon: <Leaf size={32} />, name: "Jardinage", color: "text-emerald-500", bg: "bg-emerald-50" },
                        ].map((service, idx) => (
                            <Link to="/search" key={idx} className="group p-6 rounded-3xl border border-gray-100 hover:border-blue-100 bg-white hover:bg-blue-50/50 hover:shadow-lg transition-all text-center flex flex-col items-center gap-4 cursor-pointer">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${service.bg} ${service.color}`}>
                                    {service.icon}
                                </div>
                                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos clients</h2>
                        <p className="text-gray-500 text-lg">Plus de 10 000 interventions réussies au Maroc.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Amine Benali", role: "Client à Casablanca", text: "J'avais une fuite d'eau urgente. En 10 minutes j'ai trouvé un plombier sur la plateforme, il était là dans l'heure. Travail propre et prix clair." },
                            { name: "Sara Idrissi", role: "Cliente à Rabat", text: "J'ai refait toute la peinture de mon appartement avec un expert de la plateforme. La qualité est au rendez-vous. Le fait de payer sur place rassure énormément." },
                            { name: "Mehdi Tazi", role: "Client à Marrakech", text: "Installation de climatiseur parfaite. L'artisan était ponctuel, professionnel et très courtois. Je recommande Expert Maroc à 100%." }
                        ].map((testi, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex gap-1 text-yellow-400 mb-6">
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <p className="text-gray-600 mb-8 italic">"{testi.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                                        {testi.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{testi.name}</div>
                                        <div className="text-sm text-gray-500">{testi.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EXPERT CTA (DARK SAAS BLOCK) */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Boostez votre chiffre d'affaires avec Expert Maroc
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Vous êtes électricien, plombier ou peintre ? Rejoignez notre réseau, recevez des demandes de clients près de chez vous et gérez votre planning facilement. L'inscription est gratuite.
                            </p>
                            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 text-white font-medium">
                                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-blue-500" /> + de Clients</li>
                                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-blue-500" /> Agenda Numérique</li>
                                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-blue-500" /> Zéro Commission</li>
                            </ul>
                            <Link to="/register-expert" className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
                                Créer mon compte pro
                            </Link>
                        </div>

                        {/* Illustration/Graphic placeholder */}
                        <div className="relative z-10 hidden lg:block w-72 h-72 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl transform rotate-3 flex items-center justify-center">
                            <Briefcase size={80} className="text-white/50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-2xl font-extrabold text-blue-700 tracking-tight mb-4">
                        Expert<span className="text-gray-900">Maroc</span>
                    </div>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        La plateforme de confiance pour trouver les meilleurs professionnels du bâtiment et des services à domicile au Maroc.
                    </p>
                    <div className="flex justify-center gap-8 text-sm font-medium text-gray-500 mb-8">
                        <Link to="/" className="hover:text-blue-600">Accueil</Link>
                        <Link to="/search" className="hover:text-blue-600">Trouver un expert</Link>
                        <Link to="/faqs" className="hover:text-blue-600">FAQs</Link>
                        <Link to="/support" className="hover:text-blue-600">Support</Link>
                        <Link to="/login" className="hover:text-blue-600">Connexion</Link>
                        <Link to="/register-expert" className="hover:text-blue-600">Devenir expert</Link>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Expert Maroc. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
}
