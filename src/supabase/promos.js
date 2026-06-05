import { supabase } from './client';

export async function validatePromoCode(code, orderTotal) {
    const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !data) {
        return { valid: false, message: 'Code invalide' };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, message: 'Code expire' };
    }

    if (data.max_uses && data.used_count >= data.max_uses) {
        return { valid: false, message: 'Code epuise' };
    }

    if (orderTotal < data.min_order) {
        return {
            valid: false,
            message: `Commande minimum : ${data.min_order.toLocaleString('fr-DZ')} DZD`,
        };
    }

    let discountAmount = 0;
    if (data.discount_type === 'percent') {
        discountAmount = Math.round((orderTotal * data.discount_value) / 100);
    } else if (data.discount_type === 'fixed') {
        discountAmount = data.discount_value;
    }

    return { valid: true, data, discountAmount };
}

export async function fetchPromoCodes() {
    const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createPromoCode(promo) {
    const { data, error } = await supabase
        .from('promo_codes')
        .insert([
            {
                code: promo.code.toUpperCase(),
                discount_type: promo.discountType,
                discount_value: promo.discountValue,
                min_order: promo.minOrder || 0,
                max_uses: promo.maxUses || null,
                expires_at: promo.expiresAt || null,
                is_active: promo.isActive !== false,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePromoCode(id, updates) {
    const { data, error } = await supabase
        .from('promo_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePromoCode(id) {
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);

    if (error) throw error;
}

export async function togglePromoCodeActive(id, isActive) {
    const { data, error } = await supabase
        .from('promo_codes')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
