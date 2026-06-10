import React from 'react';
import { useSelector } from 'react-redux';

export default function ProfilePage() {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
                    {user?.name?.charAt(0) || 'C'}
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-gray-900">{user?.name || 'Client'}</h3>
                    <p className="text-sm text-gray-500">Compte client Expert Maroc</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Nom</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">{user?.name || '-'}</div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">{user?.email || '-'}</div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Rôle</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-800">Client</div>
                </div>
            </div>
        </div>
    );
}
