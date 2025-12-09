-- ============================================================
-- CRUD_SQL.sql
-- Complete CRUD test queries for PCPartPicker Prototype 2
-- ============================================================

---------------------------------------------------------------
-- 1. USER PROFILES CRUD
---------------------------------------------------------------

-- CREATE
insert into public.user_profiles (user_id, display_name, role, star_rating)
values (
  '62275a1f-1fd4-47c5-9833-605d1075d193',  -- must exist in auth.users
  'Test Buyer',
  'buyer',
  4.20
);

-- READ (all)
select * from public.user_profiles;

-- READ (one)
select *
from public.user_profiles
where user_id = '62275a1f-1fd4-47c5-9833-605d1075d193';

-- UPDATE
update public.user_profiles
set display_name = 'Updated Buyer', star_rating = 4.75
where user_id = '62275a1f-1fd4-47c5-9833-605d1075d193';

-- DELETE
-- delete from public.user_profiles
-- where user_id = '62275a1f-1fd4-47c5-9833-605d1075d193';



---------------------------------------------------------------
-- 2. VEHICLES CRUD
---------------------------------------------------------------

-- CREATE
insert into public.vehicles (vin, license_plate, year, make, model, engine)
values ('TESTVIN1234567890', 'TEST123', 2015, 'Toyota', 'Camry', 'I4');

-- READ (all)
select * from public.vehicles;

-- READ (filtered)
select vehicle_id, make, model, year
from public.vehicles
where make = 'Toyota';

-- UPDATE
update public.vehicles
set model = 'Camry SE'
where vin = 'TESTVIN1234567890';

-- DELETE
-- delete from public.vehicles
-- where vin = 'TESTVIN1234567890';



---------------------------------------------------------------
-- 3. LISTINGS CRUD
---------------------------------------------------------------

-- CREATE
insert into public.listings (
  vehicle_id, seller_id, title, description, price, status, source
)
values (
  (select vehicle_id from public.vehicles where vin = 'TESTVIN1234567890' limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',   -- seller (must exist in auth.users)
  'Test Camry Listing',
  'Testing listing CRUD operations.',
  9500.00,
  'active',
  'dealer'
);

-- READ (all)
select * from public.listings;

-- READ (joined)
select 
  l.listing_id,
  l.title,
  l.price,
  v.make,
  v.model,
  v.year
from public.listings l
join public.vehicles v on v.vehicle_id = l.vehicle_id;

-- UPDATE
update public.listings
set price = 9000.00, status = 'pending'
where title = 'Test Camry Listing';

-- DELETE
-- delete from public.listings
-- where title = 'Test Camry Listing';



---------------------------------------------------------------
-- 4. LISTING PHOTOS CRUD
---------------------------------------------------------------

-- CREATE
insert into public.listing_photos (listing_id, photo_url, is_primary)
values (
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  'https://example.com/camry-front.jpg',
  true
);

-- READ
select * 
from public.listing_photos
where listing_id = (
  select listing_id from public.listings where title = 'Test Camry Listing' limit 1
);

-- UPDATE
update public.listing_photos
set photo_url = 'https://example.com/camry-updated.jpg'
where listing_id = (
  select listing_id
  from public.listings
  where title = 'Test Camry Listing'
  limit 1
);



-- DELETE
-- delete from public.listing_photos
-- where listing_id = (
--   select listing_id from public.listings where title = 'Test Camry Listing' limit 1
-- );



---------------------------------------------------------------
-- 5. VEHICLE CONDITIONS CRUD
---------------------------------------------------------------

-- CREATE
insert into public.vehicle_conditions (listing_id, condition_level, notes)
values (
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  'Good',
  'Minor wear on seats.'
);

-- READ
select *
from public.vehicle_conditions
where listing_id = (
  select listing_id from public.listings where title = 'Test Camry Listing' limit 1
);

-- UPDATE
update public.vehicle_conditions
set notes = 'Updated notes for testing.'
where listing_id = (
  select listing_id from public.listings where title = 'Test Camry Listing' limit 1
);

-- DELETE
-- delete from public.vehicle_conditions
-- where listing_id = (
--   select listing_id from public.listings where title = 'Test Camry Listing' limit 1
-- );



---------------------------------------------------------------
-- 6. PRICE HISTORY CRUD
---------------------------------------------------------------

-- CREATE
insert into public.price_history (listing_id, price, status)
values (
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  9400.00,
  'active'
);

-- READ
select * 
from public.price_history
where listing_id = (
  select listing_id from public.listings where title = 'Test Camry Listing' limit 1
);

-- UPDATE
update public.price_history
update public.price_history
set price = 9300.00
where listing_id = (
  select listing_id from public.listings where title = 'Test Camry Listing' 
  limit 1
);


-- DELETE
-- delete from public.price_history
-- where listing_id = (
--   select listing_id from public.listings where title = 'Test Camry Listing' limit 1
-- );



---------------------------------------------------------------
-- 7. CONVERSATIONS + MESSAGES CRUD
---------------------------------------------------------------

-- CREATE conversation
insert into public.conversations (listing_id, buyer_id, seller_id)
values (
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  '62275a1f-1fd4-47c5-9833-605d1075d193',  -- buyer (userB)
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b'   -- seller (userA)
);

-- READ conversations
select * from public.conversations;

-- CREATE messages
insert into public.messages (conversation_id, sender_id, body)
values (
  (select conversation_id from public.conversations order by created_at desc limit 1),
  '62275a1f-1fd4-47c5-9833-605d1075d193',
  'Is the car still available?'
);

insert into public.messages (conversation_id, sender_id, body)
values (
  (select conversation_id from public.conversations order by created_at desc limit 1),
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',
  'Yes! When would you like to see it?'
);

-- READ messages
select *
from public.messages
where conversation_id = (
  select conversation_id from public.conversations order by created_at desc limit 1
);

-- DELETE message
-- delete from public.messages
-- where message_id = (
--   select message_id from public.messages order by sent_at desc limit 1
-- );



---------------------------------------------------------------
-- 8. REVIEWS CRUD
---------------------------------------------------------------

-- CREATE
insert into public.reviews (reviewer_id, reviewee_id, listing_id, rating, comment)
values (
  '62275a1f-1fd4-47c5-9833-605d1075d193',  -- buyer
  '1f4c72ac-d2e6-4229-a7ce-730d7781c41b',  -- seller
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1),
  5,
  'Great seller!'
);

-- READ for seller
select *
from public.reviews
where reviewee_id = '1f4c72ac-d2e6-4229-a7ce-730d7781c41b';

-- UPDATE
update public.reviews
set rating = 4,
    comment = 'Minor issues but still good.'
where review_id = (
  select review_id
  from public.reviews
  where reviewer_id = '62275a1f-1fd4-47c5-9833-605d1075d193'
  order by created_at desc
  limit 1
);



-- DELETE
-- delete from public.reviews
-- where reviewer_id = '62275a1f-1fd4-47c5-9833-605d1075d193';



---------------------------------------------------------------
-- 9. SAVED LISTINGS CRUD
---------------------------------------------------------------

-- CREATE (save)
insert into public.saved_listings (user_id, listing_id)
values (
  '62275a1f-1fd4-47c5-9833-605d1075d193',
  (select listing_id from public.listings where title = 'Test Camry Listing' limit 1)
);

-- READ saved listings for user
select 
  sl.saved_listing_id,
  l.title,
  l.price
from public.saved_listings sl
join public.listings l on l.listing_id = sl.listing_id
where sl.user_id = '62275a1f-1fd4-47c5-9833-605d1075d193';

-- DELETE saved listing
-- delete from public.saved_listings
-- where user_id = '62275a1f-1fd4-47c5-9833-605d1075d193'
--   and listing_id = (
--     select listing_id from public.listings where title = 'Test Camry Listing' limit 1
--   );



