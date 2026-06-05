import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { fetchProducts, toggleProductActive, deleteProduct } from '../../supabase/products';
import ProductForm from './ProductForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('tous');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const loadProducts = async () => {
        try {
            const onlyActive = activeFilter === 'actif' ? true : activeFilter === 'inactif' ? false : null;
            const data = await fetchProducts({
                category: categoryFilter || null,
                onlyActive: onlyActive === null ? undefined : onlyActive,
                limit: 1000,
            });

            let filtered = data.products;
            if (searchQuery) {
                filtered = filtered.filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setProducts(filtered);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [categoryFilter, activeFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadProducts();
    };

    const handleToggleActive = async (productId, currentState) => {
        try {
            await toggleProductActive(productId, !currentState);
            setProducts((prev) =>
                prev.map((p) => (p.id === productId ? { ...p, is_active: !currentState } : p))
            );
        } catch (error) {
            alert('Erreur lors de la mise a jour');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteProduct(deleteConfirm.id);
            setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
            setDeleteConfirm(null);
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProduct(null);
        loadProducts();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '28px', fontWeight: 600 }}>
                    Produits
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                    style={{ fontSize: '14px' }}
                >
                    <Plus size={18} strokeWidth={1.8} />
                    Ajouter un produit
                </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                size={18}
                                color="#9CA3AF"
                                strokeWidth={1.8}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un produit..."
                                className="w-full border border-[#EBB4BB] rounded-full pl-10 pr-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                            style={{ fontSize: '14px' }}
                        >
                            Rechercher
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="flex-1 border border-[#EBB4BB] rounded-lg px-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                            style={{ fontSize: '14px' }}
                        >
                            <option value="">Toutes les categories</option>
                            <option value="Soutien-gorge">Soutien-gorge</option>
                            <option value="Ensembles">Ensembles</option>
                            <option value="Culottes">Culottes</option>
                            <option value="Pyjamas">Pyjamas</option>
                            <option value="Nuisettes">Nuisettes</option>
                            <option value="Corsets">Corsets</option>
                        </select>

                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="flex-1 border border-[#EBB4BB] rounded-lg px-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                            style={{ fontSize: '14px' }}
                        >
                            <option value="tous">Tous les produits</option>
                            <option value="actif">Actifs seulement</option>
                            <option value="inactif">Inactifs seulement</option>
                        </select>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                {loading ? (
                    <p className="font-sans text-[#9CA3AF]">Chargement...</p>
                ) : products.length === 0 ? (
                    <p className="font-sans text-[#9CA3AF]">Aucun produit trouve</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F9D7DA]">
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Image
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Nom
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Categorie
                                    </th>
                                    <th className="text-right font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Prix
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Stock
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Badge
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
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-[#F9D7DA] last:border-0 hover:bg-[#FDE8EC] transition-colors">
                                        <td className="py-3 px-2">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {product.name}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {product.category}
                                        </td>
                                        <td className="font-sans font-semibold text-right text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {parseFloat(product.price).toLocaleString('fr-DZ')} DZD
                                        </td>
                                        <td className="font-sans text-center text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {product.stock}
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            {product.badge && (
                                                <span
                                                    className="inline-block px-2 py-1 rounded-full font-sans font-semibold"
                                                    style={{
                                                        fontSize: '11px',
                                                        background: product.badge === 'promo' ? '#FEE2E2' : '#DBEAFE',
                                                        color: product.badge === 'promo' ? '#E63946' : '#3B82F6',
                                                    }}
                                                >
                                                    {product.badge === 'promo' ? 'Promo' : 'Nouveau'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <button
                                                onClick={() => handleToggleActive(product.id, product.is_active)}
                                                className={`w-12 h-6 rounded-full transition-colors ${product.is_active ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'
                                                    }`}
                                            >
                                                <span
                                                    className={`block w-5 h-5 bg-white rounded-full transition-transform ${product.is_active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 rounded-full hover:bg-[#DBEAFE] transition-colors"
                                                    aria-label="Modifier"
                                                >
                                                    <Edit size={16} color="#3B82F6" strokeWidth={1.8} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(product)}
                                                    className="p-2 rounded-full hover:bg-[#FEE2E2] transition-colors"
                                                    aria-label="Supprimer"
                                                >
                                                    <Trash2 size={16} color="#E63946" strokeWidth={1.8} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showForm && (
                <ProductForm product={editingProduct} onClose={handleFormClose} />
            )}

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title="Supprimer le produit"
                message={`Etes-vous sur de vouloir supprimer "${deleteConfirm?.name}" ?`}
                confirmText="Supprimer"
            />
        </div>
    );
}
