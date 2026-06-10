import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, ShieldCheck, WalletCards, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
    {
        category: 'Clients',
        icon: <Search size={20} />,
        items: [
            {
                question: 'Comment reserver un expert ?',
                answer: 'Allez dans Trouver un expert, ouvrez une gig, puis cliquez sur Reserver. Choisissez une date souhaitee, ajoutez un message et envoyez la demande.',
            },
            {
                question: 'Est-ce que la reservation est confirmee automatiquement ?',
                answer: 'Non. La reservation est envoyee avec le statut en attente. L expert doit ensuite accepter, refuser ou vous recontacter pour ajuster les details.',
            },
            {
                question: 'Puis-je contacter un expert avant de reserver ?',
                answer: 'Oui. Depuis la page detail d une gig, utilisez le bouton Contacter l expert pour envoyer une demande sans date precise.',
            },
        ],
    },
    {
        category: 'Paiement',
        icon: <WalletCards size={20} />,
        items: [
            {
                question: 'Comment se passe le paiement ?',
                answer: 'Le paiement se fait sur place, directement entre le client et l expert, apres accord sur le prix final.',
            },
            {
                question: 'Expert Maroc prend-il une commission ?',
                answer: 'Le parcours actuel est concu autour du paiement sur place. Les conditions commerciales peuvent evoluer selon les offres experts.',
            },
            {
                question: 'Le prix affiche est-il fixe ?',
                answer: 'Certains services affichent un prix, d autres sont sur devis. L expert peut confirmer le tarif final selon le besoin reel.',
            },
        ],
    },
    {
        category: 'Experts',
        icon: <Wrench size={20} />,
        items: [
            {
                question: 'Comment devenir expert ?',
                answer: 'Utilisez le lien Devenir expert ou Inscription, puis creez un compte professionnel. Vous pourrez ensuite publier vos services.',
            },
            {
                question: 'Puis-je ajouter plusieurs images de realisations ?',
                answer: 'Oui. Chaque gig peut avoir plusieurs images de realisations afin de montrer la qualite de votre travail aux clients.',
            },
            {
                question: 'Ou voir les demandes clients ?',
                answer: 'Les experts retrouvent leurs demandes depuis le dashboard expert, dans les sections messages et services.',
            },
        ],
    },
    {
        category: 'Securite',
        icon: <ShieldCheck size={20} />,
        items: [
            {
                question: 'Les profils experts sont-ils verifies ?',
                answer: 'La plateforme met en avant des profils verifies et des informations de couverture par ville pour aider les clients a choisir.',
            },
            {
                question: 'Que faire en cas de probleme ?',
                answer: 'Contactez le support avec les details de la reservation, le nom de l expert et une description claire de la situation.',
            },
        ],
    },
];

function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <span className="font-bold text-gray-900">{item.question}</span>
                <ChevronDown size={20} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-5 pb-5 text-gray-600 leading-7 text-sm">
                    {item.answer}
                </div>
            )}
        </div>
    );
}

export default function Faq() {
    const [openKey, setOpenKey] = useState('Clients-0');

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-blue-200 text-sm font-semibold mb-6">
                        <HelpCircle size={16} />
                        Centre d'aide
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">Questions frequentes</h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                        Retrouvez les reponses essentielles sur les reservations, les paiements, les comptes experts et le support.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 max-w-5xl py-12">
                <div className="space-y-8">
                    {FAQS.map(group => (
                        <div key={group.category}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    {group.icon}
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900">{group.category}</h2>
                            </div>
                            <div className="space-y-3">
                                {group.items.map((item, index) => {
                                    const key = `${group.category}-${index}`;
                                    return (
                                        <FaqItem
                                            key={key}
                                            item={item}
                                            isOpen={openKey === key}
                                            onToggle={() => setOpenKey(openKey === key ? null : key)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Vous ne trouvez pas votre reponse ?</h2>
                        <p className="text-gray-500">Envoyez un message au support, nous vous aiderons rapidement.</p>
                    </div>
                    <Link to="/support" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
                        Contact support
                    </Link>
                </div>
            </section>
        </div>
    );
}
