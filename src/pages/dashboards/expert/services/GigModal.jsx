import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertTriangle, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../../../../lib/axios';

/** Convert a File to a data-URL string (base64). */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function GigModal({ gig, onClose, onSaved }) {
    const isEditing = !!gig;

    const [form, setForm] = useState({
        title:       gig?.title       ?? '',
        description: gig?.description ?? '',
        price:       gig?.price       ?? '',
        city_id:     gig?.city_id     ?? '',
    });
    const [imageFile,    setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(gig?.image_url ?? null);
    const [cities,       setCities]       = useState([]);
    const [loading,      setLoading]      = useState(false);
    const [error,        setError]        = useState(null);

    useEffect(() => {
        api.get('/cities').then((r) => setCities(r.data)).catch(() => {});
    }, []);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Build plain JSON payload
            const payload = {
                title:       form.title,
                description: form.description,
            };
            if (form.price   !== '') payload.price   = Number(form.price);
            if (form.city_id !== '') payload.city_id = Number(form.city_id);

            // If a new image was selected, convert to base64 and embed in JSON
            if (imageFile) {
                payload.image_base64 = await fileToBase64(imageFile);
            }

            let res;
            if (isEditing) {
                res = await api.put(`/gigs/${gig.id}`, payload);
            } else {
                res = await api.post('/gigs', payload);
            }

            onSaved(res.data, isEditing);
        } catch (err) {
            console.error('GigModal error:', err.response ?? err);
            let msg = 'Une erreur est survenue.';
            const data = err.response?.data;
            if (data?.errors) {
                const first = Object.keys(data.errors)[0];
                msg = data.errors[first][0];
            } else if (data?.message) {
                msg = data.message;
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Modifier le service' : 'Nouveau service'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {isEditing
                                ? 'Modifiez les informations de votre service.'
                                : 'Ce service sera visible par tous les clients.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">

                    {/* Error banner */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
                            <AlertTriangle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Image picker */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Photo du service{' '}
                            <span className="text-xs font-normal text-gray-400">— Optionnel</span>
                        </label>
                        <label className="relative cursor-pointer group block">
                            <div
                                className={`w-full h-44 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${
                                    imagePreview
                                        ? 'border-blue-300'
                                        : 'border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/30'
                                }`}
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 group-hover:text-blue-500 transition-colors p-4">
                                        <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
                                        <p className="text-xs mt-1 text-gray-400">PNG, JPG, WEBP</p>
                                    </div>
                                )}
                                {imagePreview && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm flex items-center gap-2">
                                            <Upload size={16} /> Changer l'image
                                        </span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Titre du service *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ex: Réparation de plomberie..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Décrivez votre service, votre expérience..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium resize-none transition-all"
                        />
                    </div>

                    {/* City & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                            <select
                                name="city_id"
                                value={form.city_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all"
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Prix (DH)
                                <span className="block text-xs font-normal text-gray-400">
                                    Vide = "Sur devis"
                                </span>
                            </label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Ex: 500"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-60 transition-all"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Enregistrement...</>
                            ) : (
                                <><Save size={18} /> {isEditing ? 'Enregistrer' : 'Publier le service'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
