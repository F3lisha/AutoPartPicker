-- 02_seed.sql
-- Seed data for PCPartPicker Prototype 2
-- Assumes auth.users already contains:
-- 1f4c72ac-d2e6-4229-a7ce-730d7781c41b
-- 62275a1f-1fd4-47c5-9833-605d1075d193
-- 7eca6894-f4a1-4a18-94c1-45499af8cc69

-- Clear existing data (optional in dev; comment out if you don't want truncation)
-- TRUNCATE TABLE public.saved_reports,
--                   public.saved_listings,
--                   public.appeals,
--                   public.blocks,
--                   public.reports,
--                   public.reviews,
--                   public.messages,
--                   public.conversations,
--                   public.compatibility_rules,
--                   public.vehicle_alerts,
--                   public.price_history,
--                   public.vehicle_conditions,
--                   public.listing_photos,
--                   public.listings,
--                   public.vehicles,
--                   public.user_profiles
-- RESTART IDENTITY CASCADE;

------------------------------------------------------------
-- 1) USER PROFILES
------------------------------------------------------------
insert into public.user_profiles (user_id, display_name, role, star_rating)
values
  ('1f4c72ac-d2e6-4229-a7ce-730d7781c41b', 'Seller One',  'seller', 4.50),
  ('62275a1f-1fd4-47c5-9833-605d1075d193', 'Buyer One',   'buyer',  4.20),
  ('7eca6894-f4a1-4a18-94c1-45499af8cc69', 'Moderator One','admin', 5.00)
on conflict (user_id) do nothing;

------------------------------------------------------------
-- 2) VEHICLES
------------------------------------------------------------
insert into public.vehicles (vin, license_plate, year, make, model, engine)
values
  ('TESTVIN1234567890', 'TEST123', 2015, 'Toyota',        'Camry',        'I4'),
  ('TESTVIN9876543210', 'LUX456',  2020, 'Mercedes-Benz', 'C300',         'I4 Turbo'),
  ('TESTVIN5555555555', 'SUV999',  2018, 'Subaru',        'Outback',      'H4')
on conflict (vin) do nothing;

------------------------------------------------------------
-- 3) LISTINGS
------------------------------------------------------------
insert into public.listings (
  vehicle_id, seller_id, title, description, price, status, source
)
values
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN1234567890' limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'Test Camry Listing',
  'Clean daily driver used for testing CRUD operations.',
  9500.00,
  'active',
  'dealer'
),
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN9876543210' limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'Luxury C-Class Listing',
  'Low-mileage C-Class with full service records.',
  32500.00,
  'active',
  'private'
),
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN5555555555' limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'AWD Outback Listing',
  'Reliable all-wheel-drive wagon, great in snow.',
  18500.00,
  'pending',
  'dealer'
);

------------------------------------------------------------
-- 4) LISTING PHOTOS
------------------------------------------------------------
insert into public.listing_photos (listing_id, photo_url, is_primary)
values
(
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  'https://example.com/camry-front.jpg',
  true
),
(
  (select listing_id from public.listings where title = 'Luxury C-Class Listing' limit 1),
  'https://example.com/cclass-front.jpg',
  true
),
(
  (select listing_id from public.listings where title = 'AWD Outback Listing' limit 1),
  'https://example.com/outback-side.jpg',
  true
);

------------------------------------------------------------
-- 5) VEHICLE CONDITIONS
------------------------------------------------------------
insert into public.vehicle_conditions (listing_id, condition_level, notes)
values
(
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  'Good',
  'Minor wear on seats, recent oil change.'
),
(
  (select listing_id from public.listings where title = 'Luxury C-Class Listing' limit 1),
  'Good',
  'Garage kept, no visible dents.'
),
(
  (select listing_id from public.listings where title = 'AWD Outback Listing' limit 1),
  'Medium',
  'Some cosmetic scratches on rear bumper.'
);

------------------------------------------------------------
-- 6) PRICE HISTORY
------------------------------------------------------------
insert into public.price_history (listing_id, price, status)
values
(
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  9800.00,
  'active'
),
(
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  9500.00,
  'active'
),
(
  (select listing_id from public.listings where title = 'Luxury C-Class Listing' limit 1),
  33500.00,
  'active'
),
(
  (select listing_id from public.listings where title = 'AWD Outback Listing' limit 1),
  19000.00,
  'pending'
);

------------------------------------------------------------
-- 7) VEHICLE ALERTS
------------------------------------------------------------
insert into public.vehicle_alerts (vehicle_id, alert_type, message)
values
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN1234567890' limit 1),
  'recall',
  'Open airbag recall reported.'
),
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN9876543210' limit 1),
  'low_inventory',
  'Only a few similar C-Class models left in your area.'
);

------------------------------------------------------------
-- 8) COMPATIBILITY RULES
------------------------------------------------------------
insert into public.compatibility_rules (vehicle_id, part_type, engine_constraint, year_range, notes)
values
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN1234567890' limit 1),
  'brake_pads',
  'I4',
  '2012-2017',
  'Front pads must be ceramic for best performance.'
),
(
  (select vehicle_id from public.vehicles where vin = 'TESTVIN9876543210' limit 1),
  'tires',
  'I4 Turbo',
  '2019-2021',
  'Requires run-flat tires with OEM sizing.'
);

------------------------------------------------------------
-- 9) CONVERSATIONS
------------------------------------------------------------
insert into public.conversations (listing_id, buyer_id, seller_id)
values
(
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  '62275a1f-1fd4-47c5-9833-605d1075d193', -- buyer (userB)
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b'  -- seller (userA)
);

------------------------------------------------------------
-- 10) MESSAGES
------------------------------------------------------------
insert into public.messages (conversation_id, sender_id, body)
values
(
  (select conversation_id from public.conversations order by created_at desc limit 1),
  '62275a1f-1fd4-47c5-9833-605d1075d193',
  'Hi, is the Camry still available?'
),
(
  (select conversation_id from public.conversations order by created_at desc limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'Yes, it is! When would you like to see it?'
);

------------------------------------------------------------
-- 11) REVIEWS
------------------------------------------------------------
insert into public.reviews (reviewer_id, reviewee_id, listing_id, rating, comment)
values
(
  '62275a1f-1fd4-47c5-9833-605d1075d193', -- buyer
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b', -- seller
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  5,
  'Great seller, smooth transaction!'
);

------------------------------------------------------------
-- 12) REPORTS
------------------------------------------------------------
insert into public.reports (reporter_id, target_user_id, target_listing_id, reason_category, description, status)
values
(
  '7eca6894-f4a1-4a18-94c1-45499af8cc69', -- moderator reviewing
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  (select listing_id from public.listings where title = 'AWD Outback Listing' limit 1),
  'suspicious_activity',
  'Listing details seem inconsistent with photos.',
  'open'
);

------------------------------------------------------------
-- 13) BLOCKS
------------------------------------------------------------
insert into public.blocks (blocker_id, blocked_id)
values
(
  '62275a1f-1fd4-47c5-9833-605d1075d193', -- buyer blocks seller
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b'
);

------------------------------------------------------------
-- 14) APPEALS
------------------------------------------------------------
insert into public.appeals (report_id, user_id, reason, status)
values
(
  (select report_id from public.reports order by created_at desc limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'This was a misunderstanding; photos have been updated.',
  'pending'
);

------------------------------------------------------------
-- 15) SAVED LISTINGS
------------------------------------------------------------
insert into public.saved_listings (user_id, listing_id)
values
(
  '62275a1f-1fd4-47c5-9833-605d1075d193',
  (select listing_id from public.listings where title = 'Luxury C-Class Listing' limit 1)
);

------------------------------------------------------------
-- 16) SAVED REPORTS
------------------------------------------------------------
insert into public.saved_reports (user_id, report_id)
values
(
  '7eca6894-f4a1-4a18-94c1-45499af8cc69',
  (select report_id from public.reports order by created_at desc limit 1)
);
