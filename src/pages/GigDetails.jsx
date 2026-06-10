import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    CalendarCheck,
    CheckCircle2,
    HandCoins,
    Image as ImageIcon,
    Loader2,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Star,
    UserRound,
} from 'lucide-react';
import BookingModal from '../components/ui/BookingModal';
import { Button } from '../components/ui/button';
import axios, { API_ORIGIN } from '../lib/axios';

function assetUrl(value) {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `${API_ORIGIN}/storage/${value.replace(/^\/?storage\//, '')}`;
}

function getGigImage(gig) {
    return gig?.image_url || assetUrl(gig?.image);
}

function getRealizationImage(image) {
    return image?.url || image?.image_url || assetUrl(image?.path || image?.image_path || image?.filename);
}

export default function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingMode, setBookingMode] = useState('contact');

    useEffect(() => {
        setLoading(true);
        setError(null);
        axios.get(`/gigs/${id}`)
            .then(res => {
                setGig(res.data);
                setSelectedImage(getGigImage(res.data));
            })
            .catch(err => {
                console.error(err);
                setError('Impossible de charger les details de ce service.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const galleryImages = useMemo(() => {
        if (!gig) return [];
        const images = [
            getGigImage(gig),
            ...(gig.images || []).map(getRealizationImage),
        ].filter(Boolean);
        return [...new Set(images)];
    }, [gig]);

    const coverageZones = gig?.user?.coverage_zones || [];
    const cityName = gig?.city?.name || coverageZones[0]?.city?.name;

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center">
                <Loader2 size={36} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
                <Briefcase size={54} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Service introuvable</h1>
                <p className="text-gray-500 mb-6">{error || 'Ce service n existe pas ou n est plus disponible.'}</p>
                <Button onClick={() => navigate('/search')} className="bg-gray-900 hover:bg-blue-600 text-white rounded-xl px-6">
                    Retour aux services
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8 lg:py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Retour
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
                    <section className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
                                {selectedImage ? (
                                    <img src={selectedImage} alt={gig.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-3">
                                        <ImageIcon size={56} />
                                        <span className="text-sm font-semibold">Aucune image</span>
                                    </div>
                                )}
                            </div>
                            {galleryImages.length > 1 && (
                                <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
                                    {galleryImages.map(image => (
                                        <button
                                            key={image}
                                            onClick={() => setSelectedImage(image)}
                                            className={`aspect-square rounded-xl border-2 overflow-hidden bg-gray-100 transition-all ${selectedImage === image ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                                            aria-label="Afficher cette realisation"
                                        >
                                            <img src={image} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:p-8">
                            <div className="flex flex-wrap gap-3 mb-5">
                                {cityName && (
                                    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-lg font-semibold">
                                        <MapPin size={15} className="text-gray-400" />
                                        {cityName}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-sm px-3 py-1.5 rounded-lg font-bold">
                                    <ShieldCheck size={15} />
                                    Expert verifie
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{gig.title}</h1>
                            <p className="text-gray-600 leading-8 whitespace-pre-line">{gig.description}</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-5">Images de realisations</h2>
                            {galleryImages.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryImages.map(image => (
                                        <button
                                            key={image}
                                            onClick={() => setSelectedImage(image)}
                                            className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                                            aria-label="Voir l image"
                                        >
                                            <img src={image} alt="Realisation" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center text-gray-400">
                                    <ImageIcon size={42} className="mx-auto mb-3 opacity-50" />
                                    <p className="font-semibold">Aucune realisation ajoutee pour ce service.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="lg:sticky lg:top-28 space-y-4">
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-bold text-blue-700 text-2xl border border-blue-100">
                                    {gig.user?.name?.charAt(0) || <UserRound size={28} />}
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Expert</p>
                                    <h2 className="text-lg font-extrabold text-gray-900">{gig.user?.name || 'Expert'}</h2>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="font-bold text-gray-700">4.9</span>
                                        <span>(120 avis)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-semibold text-gray-500">Prix</span>
                                    <span className="text-xl font-extrabold text-blue-700">{gig.price ? `${parseFloat(gig.price).toLocaleString()} DH` : 'Sur devis'}</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <HandCoins size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>Paiement sur place directement a l artisan.</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <Button
                                        onClick={() => {
                                            setBookingMode('booking');
                                            setIsBookingOpen(true);
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                                    >
                                        Réserver
                                        <CalendarCheck size={18} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setBookingMode('contact');
                                            setIsBookingOpen(true);
                                        }}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-6 font-bold text-base shadow-md flex items-center justify-center gap-2"
                                    >
                                        Contacter l'expert
                                        <MessageCircle size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {coverageZones.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h3 className="font-extrabold text-gray-900 mb-4">Zones couvertes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {coverageZones.map(zone => (
                                        <span key={zone.id} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-semibold">
                                            <MapPin size={14} className="text-gray-400" />
                                            {zone.city?.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <h3 className="font-extrabold text-gray-900 mb-4">Ce service inclut</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> Contact direct avec l expert</p>
                                <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> Details du besoin par message</p>
                                <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> Tarif final convenu ensemble</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                gig={gig}
                mode={bookingMode}
            />
        </div>
    );
}
