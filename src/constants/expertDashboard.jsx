import React from 'react';
import { Clock, CheckCircle2, Loader2, XCircle } from 'lucide-react';

// ─── Status configuration ─────────────────────────────────────────────────────
export const STATUS_CONFIG = {
    pending:     { label: 'En attente', color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: <Clock size={13} /> },
    accepted:    { label: 'Accepté',    color: 'text-blue-600 bg-blue-50 border-blue-200',           icon: <CheckCircle2 size={13} /> },
    in_progress: { label: 'En cours',   color: 'text-indigo-600 bg-indigo-50 border-indigo-200',     icon: <Loader2 size={13} /> },
    completed:   { label: 'Terminé',    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',  icon: <CheckCircle2 size={13} /> },
    rejected:    { label: 'Refusé',     color: 'text-red-600 bg-red-50 border-red-200',              icon: <XCircle size={13} /> },
};

// ─── Fake data (replace with API calls later) ─────────────────────────────────
export const FAKE_MESSAGES = [
    {
        id: 1,
        client: { name: 'Youssef Alami', avatar: 'Y' },
        gig: 'Custom Carpentry & Woodwork',
        notes: "Bonjour, j'ai besoin de faire installer une bibliothèque sur mesure dans mon salon.",
        status: 'pending',
        time: 'Il y a 10 min',
        unread: true,
    },
    {
        id: 2,
        client: { name: 'Sara Benali', avatar: 'S' },
        gig: 'Custom Carpentry & Woodwork',
        notes: "Bonjour, j'ai une fuite au niveau du robinet de la salle de bain.",
        status: 'accepted',
        time: 'Il y a 2h',
        unread: false,
    },
    {
        id: 3,
        client: { name: 'Amine Tazi', avatar: 'A' },
        gig: 'Kitchen Cabinet Installation',
        notes: "Salut, je cherche quelqu'un pour installer des placards dans ma cuisine.",
        status: 'completed',
        time: 'Hier',
        unread: false,
    },
    {
        id: 4,
        client: { name: 'Nour El Houda', avatar: 'N' },
        gig: 'Custom Carpentry & Woodwork',
        notes: "Bonjour, je voudrais un devis pour l'aménagement d'une chambre enfant.",
        status: 'pending',
        time: 'Il y a 1 jour',
        unread: true,
    },
];
