import { supabase } from './client';
import { decrementProductStock } from './products';

async function generateOrderNumber() {
    const year = new Date().getFullYear();

    const { data, error } = await supabase
        .from('orders')
        .select('order_number')
        .like('order_number', `IC-${year}-%`)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) throw error;

    let sequence = 1;
    if (data && data.length > 0) {
        const lastNumber = data[0].order_number;
        const parts = lastNumber.split('-');
        sequence = parseInt(parts[2], 10) + 1;
    }

    return `IC-${year}-${sequence.toString().padStart(4, '0')}`;
}

export async function createOrder(orderData, cartItems) {
    const orderNumber = await generateOrderNumber();

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
            {
                order_number: orderNumber,
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                address: orderData.address,
                wilaya: orderData.wilaya,
                commune: orderData.commune,
                payment_method: orderData.paymentMethod,
                promo_code: orderData.promoCode || null,
                discount_amount: orderData.discountAmount || 0,
                subtotal: orderData.subtotal,
                total: orderData.total,
                notes: orderData.notes || null,
            },
        ])
        .select()
        .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        size: item.selectedSize || null,
        color: item.selectedColor || null,
        quantity: item.qty,
        subtotal: item.price * item.qty,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    for (const item of cartItems) {
        await decrementProductStock(item.id, item.qty);
    }

    if (orderData.promoCode) {
        await incrementPromoCodeUsage(orderData.promoCode);
    }

    return order;
}

export async function fetchOrders({
    status = null,
    wilaya = null,
    searchQuery = null,
    dateFrom = null,
    dateTo = null,
    limit = 100,
    offset = 0,
}) {
    let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (status && status !== 'tous') {
        query = query.eq('status', status);
    }

    if (wilaya) {
        query = query.eq('wilaya', wilaya);
    }

    if (searchQuery) {
        query = query.or(
            `order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`
        );
    }

    if (dateFrom) {
        query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
        query = query.lte('created_at', dateTo);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { orders: data || [], total: count || 0 };
}

export async function fetchOrderById(id) {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

    if (itemsError) throw itemsError;

    return { ...order, items: items || [] };
}

export async function updateOrderStatus(id, status) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateOrderNotes(id, notes) {
    const { data, error } = await supabase
        .from('orders')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function fetchTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: orders, error } = await supabase
        .from('orders')
        .select('total, status')
        .gte('created_at', today.toISOString());

    if (error) throw error;

    const todayCount = orders?.length || 0;
    const todayRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
    const pendingCount = orders?.filter((o) => o.status === 'en_attente').length || 0;

    return { todayCount, todayRevenue, pendingCount };
}

async function incrementPromoCodeUsage(code) {
    const { data } = await supabase
        .from('promo_codes')
        .select('used_count')
        .eq('code', code.toUpperCase())
        .single();

    if (data) {
        await supabase
            .from('promo_codes')
            .update({ used_count: data.used_count + 1 })
            .eq('code', code.toUpperCase());
    }
}
