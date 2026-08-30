CREATE TABLE IF NOT EXISTS abandoned_carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS abandoned_carts_open_user_idx ON abandoned_carts(user_id) WHERE completed_at IS NULL;
CREATE INDEX IF NOT EXISTS abandoned_carts_eligible_idx ON abandoned_carts(updated_at) WHERE completed_at IS NULL;
