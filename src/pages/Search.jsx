import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import axios from '../lib/axios';
import { MapPin, Star, ShieldCheck, HandCoins, MessageCircle } from 'lucide-react';
import BookingModal from '../components/ui/BookingModal';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [gigs, setGigs] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGig, setSelectedGig] = useState(null);

    useEffect(() => {
        axios.get('/cities').then(res => setCities(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = selectedCity ? { city_id: selectedCity } : {};
        axios.get('/gigs', { params })
            .then(res => setGigs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedCity]);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            {/* City Filter */}
            <div className="max-w-xl mx-auto px-4 mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Trouver un expert</h2>
                <select
                    id="city-filter"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 text-gray-800 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                    <option value="">🌍 Toutes les villes</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
            </div>

            {/* Gigs Grid */}
            <div className="container mx-auto px-4 py-12">
                <h3 className="text-2xl font-bold text-gray-700 mb-6">
                    {selectedCity
                        ? `Experts in ${cities.find(c => c.id === parseInt(selectedCity))?.name || '...'}`
                        : 'All Available Experts'}
                    <span className="ml-2 text-sm font-normal text-gray-400">({gigs.length} found)</span>
                </h3>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 text-lg">Loading gigs...</div>
                ) : gigs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-xl text-gray-500">No experts found for this city yet.</p>
                        <p className="text-gray-400 mt-2">Try selecting a different city or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gigs.map(gig => (
                            <article
                                key={gig.id}
                                onClick={() => navigate(`/gigs/${gig.id}`)}
                                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                            >
                                {/* Top Banner / Price */}
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-bold text-blue-700 text-xl border border-blue-100 shadow-sm">
                                                {gig.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                                                    {gig.user?.name}
                                                    <ShieldCheck size={18} className="text-blue-500" />
                                                </h4>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                                                    <Star size={14} className="text-yellow-400 fill-current" />
                                                    <span className="font-medium text-gray-700">4.9</span> (120)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap border border-blue-100">
                                            {gig.price ? `${gig.price} DH` : 'Sur devis'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-extrabold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                        {gig.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {gig.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {gig.user?.coverage_zones?.map(zone => (
                                            <span key={zone.id} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                                                <MapPin size={14} className="text-gray-400" />
                                                {zone.city?.name}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50/80 p-3 rounded-xl border border-amber-100">
                                            <HandCoins size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">Paiement <strong>sur place</strong> directement à l'artisan.</span>
                                        </div>
                                        <Button 
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedGig(gig);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full bg-gray-900 hover:bg-blue-600 text-white rounded-xl py-6 font-bold text-base shadow-md transition-all group-hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                        >
                                            Contacter l'expert
                                            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedGig(null);
                }} 
                gig={selectedGig} 
            />
        </div>
    );
}

