import { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { createProduct, updateProduct } from '../../supabase/products';
import { uploadProductImage, deleteProductImage } from '../../supabase/storage';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '85B', '90C', '95D'];
const COLORS = ['noir', 'rose', 'blanc', 'nude', 'rouge', 'lilas'];
const CATEGORIES = ['Soutien-gorge', 'Ensembles', 'Culottes', 'Pyjamas', 'Nuisettes', 'Corsets'];

function restoreScrollPosition(container, scrollTop) {
    if (!container) return;

    requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
        requestAnimationFrame(() => {
            container.scrollTop = scrollTop;
        });
    });
}

export default function ProductForm({ product, onClose }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        category: product?.category || 'Soutien-gorge',
        description: product?.description || '',
        price: product?.price || '',
        original_price: product?.original_price || '',
        sizes: Array.isArray(product?.sizes) ? product.sizes : [],
        colors: Array.isArray(product?.colors) ? product.colors : [],
        badge: product?.badge || '',
        stock: product?.stock || 0,
        images: Array.isArray(product?.images) ? product.images : [],
        is_active: product?.is_active !== false,
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const validateProductData = () => {
        const name = formData.name.trim();
        const price = Number.parseFloat(formData.price);
        const originalPrice = formData.original_price === '' ? null : Number.parseFloat(formData.original_price);
        const stock = Number.parseInt(formData.stock, 10);

        if (!name) {
            return { error: 'Ajoutez le nom du produit.' };
        }

        if (!Number.isFinite(price) || price < 0) {
            return { error: 'Ajoutez un prix valide.' };
        }

        if (formData.original_price !== '' && (!Number.isFinite(originalPrice) || originalPrice < 0)) {
            return { error: 'Ajoutez un prix original valide ou laissez le champ vide.' };
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return { error: 'Ajoutez un stock valide.' };
        }

        return {
            productData: {
                ...formData,
                name,
                description: formData.description.trim(),
                price,
                original_price: originalPrice,
                stock,
                sizes: Array.isArray(formData.sizes) ? formData.sizes : [],
                colors: Array.isArray(formData.colors) ? formData.colors : [],
                images: Array.isArray(formData.images) ? formData.images : [],
                badge: formData.badge || null,
            },
        };
    };

    const handleImageUpload = async (e) => {
        const input = e.currentTarget;
        const scrollContainer = input.closest('[data-product-form-scroll]');
        const scrollTop = scrollContainer?.scrollTop ?? 0;
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        setFormError('');
        try {
            const uploadPromises = files.map((file) => uploadProductImage(file));
            const urls = await Promise.all(uploadPromises);
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
            restoreScrollPosition(scrollContainer, scrollTop);
        } catch (error) {
            setFormError(error?.message || 'Erreur lors du telechargement des images');
        } finally {
            input.value = '';
            setUploading(false);
            restoreScrollPosition(scrollContainer, scrollTop);
        }
    };

    const handleImageDelete = async (url) => {
        try {
            await deleteProductImage(url);
            setFormData((prev) => ({
                ...prev,
                images: prev.images.filter((img) => img !== url),
            }));
        } catch (error) {
            setFormError(error?.message || 'Erreur lors de la suppression de l\'image');
        }
    };

    const handleImageReorder = (index, direction) => {
        const newImages = [...formData.images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newImages.length) return;
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const toggleArray = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (uploading) {
            setFormError('Attendez la fin du telechargement des images avant de sauvegarder.');
            return;
        }

        const { productData, error: validationError } = validateProductData();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        setSaving(true);
        try {
            if (product) {
                await updateProduct(product.id, productData);
            } else {
                await createProduct(productData);
            }

            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setFormError(error?.message || 'Erreur lors de la sauvegarde du produit');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-[#1C2340]/40" onClick={onClose} style={{ backdropFilter: 'blur(2px)' }} />
            <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
                <div className="bg-white sm:rounded-2xl w-full max-w-3xl shadow-xl sm:my-8 min-h-screen sm:min-h-0 h-dvh sm:h-auto sm:max-h-[90vh] flex flex-col">
                    <div className="flex-none px-4 sm:px-6 py-4 bg-white z-10 flex items-start justify-between gap-3 border-b border-[#F9D7DA]">
                        <div>
                            <h3 className="font-serif text-[#1C2340]" style={{ fontSize: '24px', fontWeight: 600 }}>
                                {product ? 'Modifier le produit' : 'Ajouter un produit'}
                            </h3>
                            <p className="font-sans text-[#9CA3AF] mt-1" style={{ fontSize: '13px' }}>
                                Remplissez les informations, ajoutez les images, puis enregistrez.
                            </p>
                        </div>
                        <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 flex-none">
                            <X size={24} color="#1C2340" strokeWidth={1.8} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-28 sm:pb-6 space-y-6" data-product-form-scroll noValidate>
                        <div className="rounded-xl border border-[#F9D7DA] bg-[#FDE8EC] px-4 py-3">
                            <h4 className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                                1. Informations principales
                            </h4>
                            <p className="font-sans text-[#5A6080] mt-1" style={{ fontSize: '12px' }}>
                                Nom, categorie, stock et description du produit.
                            </p>
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                Nom du produit
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                aria-invalid={!formData.name.trim()}
                                className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                style={{ fontSize: '14px' }}
                            />
                        </div>

                        <div className="rounded-xl border border-[#F9D7DA] bg-[#FDE8EC] px-4 py-3">
                            <h4 className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                                2. Prix et presentation
                            </h4>
                            <p className="font-sans text-[#5A6080] mt-1" style={{ fontSize: '12px' }}>
                                Prix actuel, ancien prix et badge visible sur le catalogue.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Categorie
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                                    min="0"
                                    aria-invalid={!Number.isInteger(Number.parseInt(formData.stock, 10)) || Number.parseInt(formData.stock, 10) < 0}
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340] resize-none"
                                style={{ fontSize: '14px' }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Prix (DZD)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                    min="0"
                                    step="0.01"
                                    aria-invalid={!Number.isFinite(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) < 0}
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Prix original (optionnel)
                                </label>
                                <input
                                    type="number"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                                    min="0"
                                    step="0.01"
                                    placeholder="Pour les promotions"
                                    className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                Badge
                            </label>
                            <div className="flex gap-3">
                                {['', 'new', 'promo'].map((badge) => {
                                    const isSelected = formData.badge === badge;
                                    return (
                                        <button
                                            key={badge || 'none'}
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, badge }))}
                                            className="px-4 py-2 rounded-full border font-sans font-medium transition-all"
                                            style={{
                                                fontSize: '13px',
                                                background: isSelected ? '#1C2340' : 'transparent',
                                                color: isSelected ? 'white' : '#1C2340',
                                                borderColor: isSelected ? '#1C2340' : '#EBB4BB',
                                            }}
                                        >
                                            {badge === '' ? 'Aucun' : badge === 'new' ? 'Nouveau' : 'Promo'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#F9D7DA] bg-[#FDE8EC] px-4 py-3">
                            <h4 className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                                3. Variantes
                            </h4>
                            <p className="font-sans text-[#5A6080] mt-1" style={{ fontSize: '12px' }}>
                                Selectionnez les tailles et couleurs disponibles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Tailles
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SIZES.map((size) => {
                                        const isSelected = formData.sizes.includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleArray('sizes', size)}
                                                className="px-4 py-2 rounded-full border font-sans font-medium transition-all"
                                                style={{
                                                    fontSize: '13px',
                                                    background: isSelected ? '#1C2340' : 'transparent',
                                                    color: isSelected ? 'white' : '#1C2340',
                                                    borderColor: isSelected ? '#1C2340' : '#EBB4BB',
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Couleurs
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map((color) => {
                                        const isSelected = formData.colors.includes(color);
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => toggleArray('colors', color)}
                                                className="px-4 py-2 rounded-full border font-sans font-medium transition-all"
                                                style={{
                                                    fontSize: '13px',
                                                    background: isSelected ? '#1C2340' : 'transparent',
                                                    color: isSelected ? 'white' : '#1C2340',
                                                    borderColor: isSelected ? '#1C2340' : '#EBB4BB',
                                                }}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#F9D7DA] bg-[#FDE8EC] px-4 py-3">
                            <h4 className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                                4. Images et statut
                            </h4>
                            <p className="font-sans text-[#5A6080] mt-1" style={{ fontSize: '12px' }}>
                                La premiere image sera utilisee comme image principale.
                            </p>
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                Images
                            </label>
                            <div className="relative border-2 border-dashed border-[#EBB4BB] rounded-lg p-6 hover:bg-[#FDE8EC] transition-colors">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    aria-label="Telecharger des images produit"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <div className="flex flex-col items-center gap-2 pointer-events-none">
                                    <Upload size={32} color="#9CA3AF" strokeWidth={1.8} />
                                    <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                                        {uploading ? 'Telechargement...' : 'Cliquez pour telecharger des images'}
                                    </p>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                                    {formData.images.map((url, index) => (
                                        <div key={url} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Produit ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/45 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageReorder(index, 'up')}
                                                        className="px-2 py-1 bg-white rounded font-sans text-[#1C2340]"
                                                        style={{ fontSize: '12px' }}
                                                    >
                                                        ←
                                                    </button>
                                                )}
                                                {index < formData.images.length - 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageReorder(index, 'down')}
                                                        className="px-2 py-1 bg-white rounded font-sans text-[#1C2340]"
                                                        style={{ fontSize: '12px' }}
                                                    >
                                                        →
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(url)}
                                                    className="p-2 bg-[#E63946] rounded-full"
                                                >
                                                    <Trash2 size={14} color="white" strokeWidth={1.8} />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <span
                                                    className="absolute top-2 left-2 px-2 py-1 bg-[#1C2340] text-white rounded font-sans font-semibold"
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is-active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                                className="w-5 h-5"
                            />
                            <label htmlFor="is-active" className="font-sans text-[#1C2340]" style={{ fontSize: '14px' }}>
                                Produit actif
                            </label>
                        </div>

                        <div aria-live="polite" style={{ minHeight: '18px' }}>
                            {formError && (
                                <p className="font-sans text-[#E63946]" style={{ fontSize: '13px' }}>
                                    {formError}
                                </p>
                            )}
                        </div>

                        <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:left-auto sm:right-auto -mx-0 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/95 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-[#F9D7DA]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 border border-[#EBB4BB] text-[#1C2340] font-sans font-semibold rounded-full hover:bg-[#FDE8EC] transition-colors"
                                style={{ height: '48px', fontSize: '14px' }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="flex-1 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors disabled:opacity-50"
                                style={{ height: '48px', fontSize: '14px' }}
                            >
                                {saving ? 'Enregistrement...' : uploading ? 'Telechargement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
