import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { uploadProductImage, deleteProductImage } from '../../supabase/storage';

export default function ImageUploader({ images = [], onChange }) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = files.map((file) => uploadProductImage(file));
            const urls = await Promise.all(uploadPromises);
            onChange([...images, ...urls]);
        } catch {
            alert('Erreur lors du telechargement des images');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (url) => {
        try {
            await deleteProductImage(url);
            onChange(images.filter((img) => img !== url));
        } catch {
            alert('Erreur lors de la suppression de l\'image');
        }
    };

    const handleReorder = (index, direction) => {
        const newImages = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newImages.length) return;
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        onChange(newImages);
    };

    return (
        <div>
            <div className="border-2 border-dashed border-[#EBB4BB] rounded-lg p-6">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleUpload}
                    id="image-upload"
                    className="hidden"
                />
                <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                >
                    <Upload size={32} color="#9CA3AF" strokeWidth={1.8} />
                    <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                        {uploading ? 'Telechargement...' : 'Cliquez pour telecharger des images'}
                    </p>
                </label>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {images.map((url, index) => (
                        <div key={url} className="relative group">
                            <img
                                src={url}
                                alt={`Produit ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleReorder(index, 'up')}
                                        className="px-2 py-1 bg-white rounded font-sans text-[#1C2340]"
                                        style={{ fontSize: '12px' }}
                                    >
                                        ←
                                    </button>
                                )}
                                {index < images.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleReorder(index, 'down')}
                                        className="px-2 py-1 bg-white rounded font-sans text-[#1C2340]"
                                        style={{ fontSize: '12px' }}
                                    >
                                        →
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(url)}
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
    );
}
