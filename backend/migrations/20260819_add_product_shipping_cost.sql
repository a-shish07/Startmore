-- Run this once against the PostgreSQL database used by the backend.
-- Existing products receive free shipping until an administrator sets a value.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0;

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_shipping_cost_nonnegative;

ALTER TABLE products
  ADD CONSTRAINT products_shipping_cost_nonnegative
  CHECK (shipping_cost >= 0);
