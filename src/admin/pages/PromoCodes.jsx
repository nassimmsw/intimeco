import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { fetchPromoCodes, createPromoCode, togglePromoCodeActive, deletePromoCode } from '../../supabase/promos';
import ConfirmDialog from '../components/ConfirmDialog';

export default function PromoCodes() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percent',
        discountValue: '',
        minOrder: '',
        maxUses: '',
        expiresAt: '',
        isActive: true,
    });

    const loadPromos = async () => {
        try {
            const data = await fetchPromoCodes();
            setPromos(data);
        } catch (error) {
            console.error('Erreur lors du chargement des codes promo:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPromoCode(formData);
            setFormData({
                code: '',
                discountType: 'percent',
                discountValue: '',
                minOrder: '',
                maxUses: '',
                expiresAt: '',
                isActive: true,
            });
            setShowForm(false);
            loadPromos();
        } catch (error) {
            alert('Erreur lors de la creation du code promo');
        }
    };

    const handleToggleActive = async (id, currentState) => {
        try {
            await togglePromoCodeActive(id, !currentState);
            setPromos((prev) =>
                prev.map((p) => (p.id === id ? { ...p, is_active: !currentState } : p))
            );
        } catch (error) {
            alert('Erreur lors de la mise a jour');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await deletePromoCode(deleteConfirm.id);
            setPromos((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
            setDeleteConfirm(null);
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '28px', fontWeight: 600 }}>
                    Codes promo
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                    style={{ fontSize: '14px' }}
                >
                    <Plus size={18} strokeWidth={1.8} />
                    Creer un code
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                    <h3 className="font-serif text-[#1C2340] mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
                        Nouveau code promo
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    required
                                    placeholder="INTIME10"
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Type de reduction
                                </label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, discountType: e.target.value }))}
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                >
                                    <option value="percent">Pourcentage</option>
                                    <option value="fixed">Montant fixe</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Valeur de reduction {formData.discountType === 'percent' ? '(%)' : '(DZD)'}
                                </label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: e.target.value }))}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Commande minimum (DZD, optionnel)
                                </label>
                                <input
                                    type="number"
                                    value={formData.minOrder}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, minOrder: e.target.value }))}
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Utilisations maximum (optionnel)
                                </label>
                                <input
                                    type="number"
                                    value={formData.maxUses}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, maxUses: e.target.value }))}
                                    min="0"
                                    placeholder="Illimite"
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Date d'expiration (optionnel)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))}
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is-active-promo"
                                checked={formData.isActive}
                                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                className="w-5 h-5"
                            />
                            <label htmlFor="is-active-promo" className="font-sans text-[#1C2340]" style={{ fontSize: '14px' }}>
                                Code actif
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-5 py-3 border border-[#EBB4BB] text-[#1C2340] font-sans font-semibold rounded-full hover:bg-[#FDE8EC] transition-colors"
                                style={{ fontSize: '14px' }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-3 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                                style={{ fontSize: '14px' }}
                            >
                                Creer le code
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                {loading ? (
                    <p className="font-sans text-[#9CA3AF]">Chargement...</p>
                ) : promos.length === 0 ? (
                    <p className="font-sans text-[#9CA3AF]">Aucun code promo</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F9D7DA]">
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Code
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Type
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Valeur
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Commande min.
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Utilisations
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Expiration
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Actif
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {promos.map((promo) => (
                                    <tr key={promo.id} className="border-b border-[#F9D7DA] last:border-0 hover:bg-[#FDE8EC] transition-colors">
                                        <td className="font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {promo.code}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {promo.discount_type === 'percent' ? 'Pourcentage' : 'Fixe'}
                                        </td>
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {promo.discount_type === 'percent'
                                                ? `${promo.discount_value}%`
                                                : `${parseFloat(promo.discount_value).toLocaleString('fr-DZ')} DZD`}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {parseFloat(promo.min_order).toLocaleString('fr-DZ')} DZD
                                        </td>
                                        <td className="font-sans text-center text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {promo.used_count} / {promo.max_uses || '∞'}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {promo.expires_at
                                                ? new Date(promo.expires_at).toLocaleDateString('fr-FR')
                                                : 'Aucune'}
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <button
                                                onClick={() => handleToggleActive(promo.id, promo.is_active)}
                                                className={`w-12 h-6 rounded-full transition-colors ${promo.is_active ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'
                                                    }`}
                                            >
                                                <span
                                                    className={`block w-5 h-5 bg-white rounded-full transition-transform ${promo.is_active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <button
                                                onClick={() => setDeleteConfirm(promo)}
                                                className="p-2 rounded-full hover:bg-[#FEE2E2] transition-colors"
                                                aria-label="Supprimer"
                                            >
                                                <Trash2 size={16} color="#E63946" strokeWidth={1.8} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title="Supprimer le code promo"
                message={`Etes-vous sur de vouloir supprimer le code "${deleteConfirm?.code}" ?`}
                confirmText="Supprimer"
            />
        </div>
    );
}
