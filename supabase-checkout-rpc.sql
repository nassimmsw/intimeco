-- Checkout RPC for public order creation.
-- Keeps orders/products private while allowing anonymous checkout.

CREATE OR REPLACE FUNCTION public.create_checkout_order(order_data jsonb, cart_items jsonb)
RETURNS TABLE (id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_order_id uuid := gen_random_uuid();
  new_order_number text := 'IC-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  item jsonb;
  item_product_id uuid;
  item_quantity integer;
  promo text := nullif(order_data->>'promoCode', '');
BEGIN
  IF jsonb_typeof(cart_items) <> 'array' OR jsonb_array_length(cart_items) = 0 THEN
    RAISE EXCEPTION 'cart_items must be a non-empty array';
  END IF;

  INSERT INTO public.orders (
    id,
    order_number,
    customer_name,
    customer_phone,
    address,
    wilaya,
    commune,
    payment_method,
    promo_code,
    discount_amount,
    subtotal,
    total,
    notes
  )
  VALUES (
    new_order_id,
    new_order_number,
    order_data->>'customerName',
    order_data->>'customerPhone',
    order_data->>'address',
    order_data->>'wilaya',
    order_data->>'commune',
    order_data->>'paymentMethod',
    promo,
    COALESCE((order_data->>'discountAmount')::numeric, 0),
    (order_data->>'subtotal')::numeric,
    (order_data->>'total')::numeric,
    nullif(order_data->>'notes', '')
  );

  FOR item IN SELECT value FROM jsonb_array_elements(cart_items)
  LOOP
    item_product_id := nullif(item->>'id', '')::uuid;
    item_quantity := COALESCE((item->>'qty')::integer, 1);

    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_price,
      size,
      color,
      quantity,
      subtotal
    )
    VALUES (
      new_order_id,
      item_product_id,
      item->>'name',
      (item->>'price')::numeric,
      nullif(item->>'selectedSize', ''),
      nullif(item->>'selectedColor', ''),
      item_quantity,
      (item->>'price')::numeric * item_quantity
    );

  END LOOP;

  RETURN QUERY SELECT new_order_id, new_order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.create_checkout_order(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(jsonb, jsonb) TO anon, authenticated;
