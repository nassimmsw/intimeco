-- INTIME & CO - Schema Supabase complet
-- Executer ce script dans SQL Editor de Supabase

-- =============================================
-- TABLE: products
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  sizes text[],
  colors text[],
  images text[],
  badge text,
  stock integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- TABLE: orders
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'en_attente',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  address text NOT NULL,
  wilaya text NOT NULL,
  commune text NOT NULL,
  payment_method text NOT NULL,
  promo_code text,
  discount_amount numeric(10,2) DEFAULT 0,
  subtotal numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- TABLE: order_items
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price numeric(10,2) NOT NULL,
  size text,
  color text,
  quantity integer NOT NULL,
  subtotal numeric(10,2) NOT NULL
);

-- =============================================
-- TABLE: promo_codes
-- =============================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL,
  discount_value numeric(10,2) NOT NULL,
  min_order numeric(10,2) DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- TABLE: settings
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Products: public read (is_active = true), authenticated write
DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can do all on products" ON products;
CREATE POLICY "Authenticated users can do all on products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: insert allowed for anonymous, authenticated full access
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read all orders" ON orders;
CREATE POLICY "Authenticated users can read all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Order items: same as orders
DROP POLICY IF EXISTS "Anyone can insert order_items" ON order_items;
CREATE POLICY "Anyone can insert order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read order_items" ON order_items;
CREATE POLICY "Authenticated users can read order_items"
  ON order_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- Promo codes: public can read for validation, authenticated full access
DROP POLICY IF EXISTS "Public can read active promo codes for validation" ON promo_codes;
CREATE POLICY "Public can read active promo codes for validation"
  ON promo_codes FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can do all on promo_codes" ON promo_codes;
CREATE POLICY "Authenticated users can do all on promo_codes"
  ON promo_codes FOR ALL
  USING (auth.role() = 'authenticated');

-- Settings: public read, authenticated write
DROP POLICY IF EXISTS "Public can read settings" ON settings;
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can write settings" ON settings;
CREATE POLICY "Authenticated users can write settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA: settings
-- =============================================
INSERT INTO settings (key, value) VALUES
('store_name', 'Intime & Co'),
('announcement_text', 'Livraison gratuite des 3000 DZD d''achat — Paiement a la livraison disponible'),
('delivery_fee', '500'),
('free_delivery_threshold', '3000'),
('instagram_url', 'https://www.instagram.com/inti.me15'),
('store_phone', ''),
('store_address', 'Blida, Algerie'),
('store_hours', 'Lun–Sam : 09h00 – 19h00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =============================================
-- INDEXES pour performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- =============================================
-- STORAGE BUCKET: product-images
-- =============================================
-- Ce bucket doit etre cree manuellement dans le dashboard Supabase:
-- 1. Aller dans Storage
-- 2. Creer un bucket "product-images"
-- 3. Le rendre public
-- 4. Configurer les politiques:
--    - Public access: ON
--    - Allowed mime types: image/jpeg, image/png, image/webp
--    - Max file size: 5MB

-- Politiques pour le bucket (a executer apres creation du bucket):
-- INSERT policy
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- SELECT policy (public)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- DELETE policy
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- =============================================
-- FONCTION: mise a jour automatique updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
