-- Optional: enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- 1) User profile table (app-specific data linked to auth.users)
-- Uses auth.users.id as the FK to store app profile fields.
CREATE TABLE IF NOT EXISTS public.user_profiles (
user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
display_name text,
role text,
star_rating numeric(3,2) CHECK (star_rating >= 0 AND star_rating <= 5),
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON
public.user_profiles(role);
-- 2) Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
vehicle_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
vin text UNIQUE NOT NULL,
license_plate text,
year integer CHECK (year >= 1886), -- first automobile year ~1886
make text,
model text,
engine text
);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
-- 3) Listings
CREATE TABLE IF NOT EXISTS public.listings (
listing_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
vehicle_id uuid NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE
CASCADE,
seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
title text NOT NULL,
description text,
price numeric(12,2) CHECK (price >= 0),
status text NOT NULL DEFAULT 'active',
source text,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON
public.listings(created_at);
-- 4) Listing photos
CREATE TABLE IF NOT EXISTS public.listing_photos (
photo_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
listing_id uuid NOT NULL REFERENCES public.listings(listing_id) ON DELETE
CASCADE,
photo_url text NOT NULL,
is_primary boolean NOT NULL DEFAULT false,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_listing_photos_listing ON
public.listing_photos(listing_id);
-- Optional: ensure only one primary per listing (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS uq_listing_primary_photo
ON public.listing_photos(listing_id)
WHERE is_primary = true;
-- 5) Vehicle condition (per listing)
CREATE TABLE IF NOT EXISTS public.vehicle_conditions (
condition_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
listing_id uuid NOT NULL REFERENCES public.listings(listing_id) ON DELETE
CASCADE,
condition_level text,
notes text,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_conditions_listing ON
public.vehicle_conditions(listing_id);
-- 6) Price history
CREATE TABLE IF NOT EXISTS public.price_history (
price_history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
listing_id uuid NOT NULL REFERENCES public.listings(listing_id) ON DELETE
CASCADE,
price numeric(12,2) NOT NULL CHECK (price >= 0),
status text,
recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_price_history_listing ON
public.price_history(listing_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON
public.price_history(recorded_at);
-- 7) Vehicle alerts
CREATE TABLE IF NOT EXISTS public.vehicle_alerts (
alert_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
vehicle_id uuid NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE
CASCADE,
alert_type text NOT NULL,
message text,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_vehicle ON
public.vehicle_alerts(vehicle_id);
-- 8) Compatibility rules
CREATE TABLE IF NOT EXISTS public.compatibility_rules (
rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
vehicle_id uuid NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE
CASCADE,
part_type text,
engine_constraint text,
year_range text,
notes text,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_compat_rules_vehicle ON
public.compatibility_rules(vehicle_id);
-- 9) Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
conversation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
listing_id uuid NOT NULL REFERENCES public.listings(listing_id) ON DELETE
CASCADE,
buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
created_at timestamptz NOT NULL DEFAULT now(),
CONSTRAINT conversation_unique_listing_buyerseller UNIQUE (listing_id,
buyer_id, seller_id)
);
CREATE INDEX IF NOT EXISTS idx_conversations_listing ON
public.conversations(listing_id);
-- 10) Messages
CREATE TABLE IF NOT EXISTS public.messages (
message_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
conversation_id uuid NOT NULL REFERENCES
public.conversations(conversation_id) ON DELETE CASCADE,
sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
body text NOT NULL,
sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON
public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
-- 11) Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
review_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
listing_id uuid REFERENCES public.listings(listing_id) ON DELETE SET NULL,
rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
comment text,
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON public.reviews(reviewer_id);
-- 12) Reports
CREATE TABLE IF NOT EXISTS public.reports (
report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
target_listing_id uuid REFERENCES public.listings(listing_id) ON DELETE SET
NULL,
reason_category text,
description text,
status text NOT NULL DEFAULT 'open',
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
-- 13) Blocks
CREATE TABLE IF NOT EXISTS public.blocks (
block_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
created_at timestamptz NOT NULL DEFAULT now(),
CONSTRAINT uq_block_pair UNIQUE (blocker_id, blocked_id),
CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
-- 14) Appeals
CREATE TABLE IF NOT EXISTS public.appeals (
appeal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
report_id uuid NOT NULL REFERENCES public.reports(report_id) ON DELETE
CASCADE,
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
reason text,
status text NOT NULL DEFAULT 'pending',
created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_appeals_report ON public.appeals(report_id);
-- 15) Saved listings
CREATE TABLE IF NOT EXISTS public.saved_listings (
saved_listing_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
listing_id uuid NOT NULL REFERENCES public.listings(listing_id) ON DELETE
CASCADE,
created_at timestamptz NOT NULL DEFAULT now(),
CONSTRAINT uq_user_saved_listing UNIQUE (user_id, listing_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON
public.saved_listings(user_id);
-- 16) Saved reports
CREATE TABLE IF NOT EXISTS public.saved_reports (
saved_report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
report_id uuid NOT NULL REFERENCES public.reports(report_id) ON DELETE
CASCADE,
created_at timestamptz NOT NULL DEFAULT now(),
CONSTRAINT uq_user_saved_report UNIQUE (user_id, report_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_reports_user ON
public.saved_reports(user_id);
-- Optional: update app-level user_profiles when a new auth.user is created.
-- This uses a trigger on auth.users; be careful with permissions and test in a
--dev environment.
-- Note: service_role or appropriate privileges are required to create triggers
--on auth schema objects.
-- If you prefer, handle profile creation in application logic instead.
-- Example trigger to auto-create profile row when a new auth user is created:
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS trigger AS $$
BEGIN
-- only create if not exists
IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id)
THEN
INSERT INTO public.user_profiles (user_id, display_name, created_at)
VALUES (NEW.id, NEW.email, now());
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Attach trigger to auth.users (requires permission; skip if you cannot modify
--auth schema)
-- If you cannot create triggers on auth.users, create profiles in app signup
--flow instead.
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM pg_trigger
WHERE tgname = 'auth_user_after_insert_create_profile'
) THEN
CREATE TRIGGER auth_user_after_insert_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
END IF;
END;
$$;
