import { supabase } from './client';

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    const {
        data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
}

export async function deleteProductImage(imageUrl) {
    const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) throw error;
}

export async function uploadMultipleImages(files) {
    const uploadPromises = files.map((file) => uploadProductImage(file));
    return await Promise.all(uploadPromises);
}
