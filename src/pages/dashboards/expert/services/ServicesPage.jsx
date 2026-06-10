import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Loader2 } from 'lucide-react';
import axios from '../../../../lib/axios';
import GigCard from './GigCard';
import GigModal from './GigModal';
import DeleteConfirm from './DeleteConfirm';

export default function ServicesPage() {
    const [gigs,        setGigs]        = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [showModal,   setShowModal]   = useState(false);
    const [editingGig,  setEditingGig]  = useState(null);
    const [deletingGig, setDeletingGig] = useState(null);

    useEffect(() => {
        axios
            .get('/my-gigs')
            .then((res) => setGigs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openCreate = () => {
        setEditingGig(null);
        setShowModal(true);
    };

    const openEdit = (gig) => {
        setEditingGig(gig);
        setShowModal(true);
    };

    const handleSaved = (savedGig, isEditing) => {
        if (isEditing) {
            setGigs((prev) => prev.map((g) => (g.id === savedGig.id ? savedGig : g)));
        } else {
            setGigs((prev) => [savedGig, ...prev]);
        }
        setShowModal(false);
        setEditingGig(null);
    };

    const handleDeleted = (gigId) => {
        setGigs((prev) => prev.filter((g) => g.id !== gigId));
        setDeletingGig(null);
    };

    return (
        <>
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Mes services publiés</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {gigs.length} service{gigs.length !== 1 ? 's' : ''} en ligne
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    Nouveau service
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={36} className="animate-spin text-blue-500" />
                </div>
            ) : gigs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-24 text-center px-6">
                    <Briefcase size={56} className="text-gray-200 mb-4" />
                    <p className="text-lg font-bold text-gray-500 mb-2">Aucun service publié</p>
                    <p className="text-sm text-gray-400 mb-6">
                        Créez votre premier service pour apparaître dans les recherches des clients.
                    </p>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md"
                    >
                        <Plus size={18} /> Créer mon premier service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {gigs.map((gig) => (
                        <GigCard
                            key={gig.id}
                            gig={gig}
                            onEdit={openEdit}
                            onDelete={setDeletingGig}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <GigModal
                    gig={editingGig}
                    onClose={() => {
                        setShowModal(false);
                        setEditingGig(null);
                    }}
                    onSaved={handleSaved}
                />
            )}
            {deletingGig && (
                <DeleteConfirm
                    gig={deletingGig}
                    onClose={() => setDeletingGig(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </>
    );
}
