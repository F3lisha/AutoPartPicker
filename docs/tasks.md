# AutoPartPicker – Task List

Below are development tasks based on the Analyst's final user stories.

---

## 1. Dealer + Private Seller Listings

**User Story:**  
As a car buyer, I want to browse both private-seller and dealer listings so that I can compare pricing and transparency across sources.

**Tasks:**
- Design `listings` table schema with fields for dealer/private source.
- Create `GET /listings` API endpoint.
- Build listings list UI in React to show cards for each vehicle.
- Add visual indicator for dealer vs private seller.

**Acceptance Criteria:**
- Listings from both dealers and private sellers are shown.
- Each listing clearly indicates its source type.
- Page loads without errors and shows a basic list view.

---

## 2. Radius Filter

**User Story:**  
As a buyer, I want to filter listings by radius so that I don’t waste time looking at cars too far away from me.

**Tasks:**
- Add location (city, state, and coordinates if possible) to `listings`.
- Update `GET /listings` to support a radius query parameter.
- Add a radius selector (dropdown or slider) in the UI.

**Acceptance Criteria:**
- User can select a radius (e.g., 10, 25, 50 miles).
- Only listings within that radius are displayed.

---

## 3. Vehicle Verification (VIN, Title, History)

**User Story:**  
As a buyer, I want the platform to verify VIN, title status, and accident history so I avoid scams and misleading posts.

**Tasks:**
- Create `vehicle_history` table with VIN, title status, accident flags, and ownership count.
- Add `POST /verify-vin` or similar endpoint to look up VIN info (stub or mock if necessary).
- Show verification status on the vehicle detail page.

**Acceptance Criteria:**
- User can enter or view a VIN and see a verification status.
- History details (e.g., clean title, accidents, etc.) are displayed if available.

---

## 4. Seller Reputation (Source Labels)

**User Story:**  
As a safety-conscious user, I want listings to include seller reputation scores so I can avoid risky private-seller interactions.

**Tasks:**
- Add a reputation field or score to sellers or listings.
- Display reputation score or label (e.g., “Trusted”, “New seller”) on listing cards.
- Update API to return reputation info.

**Acceptance Criteria:**
- Each listing shows a clear label or score for seller reputation.
- Reputation is visible in both list view and detail view.

---

## 5. Secure Messaging

**User Story:**  
As a privacy-conscious luxury buyer, I want secure communication channels so that my personal information is protected.

**Tasks:**
- Create `messages` table for storing conversations.
- Add API endpoints for sending and retrieving messages.
- Build a basic messaging UI between buyer and seller accounts.

**Acceptance Criteria:**
- Logged-in users can send a message to a listing’s seller.
- Only the participants in a conversation can see the messages.

---

## 6. Ownership Count

**User Story:**  
As a user, I want the app to display how many previous owners a vehicle had so that I can assess longevity and care.

**Tasks:**
- Store ownership count in `vehicle_history`.
- Display ownership count on the vehicle detail page.

**Acceptance Criteria:**
- Detail view shows “Previous owners: X”.
- Ownership count is correctly stored and retrieved.

---

## 7. Vehicle Comparison

**User Story:**  
As a user, I want a comparison tool to view multiple cars side-by-side across specs, costs, and history so I can make fast decisions.

**Tasks:**
- Allow users to select multiple listings for comparison.
- Build a comparison view that shows key fields in a table (price, mileage, year, performance, ownership, etc.).
- Add API support if needed for fetching multiple listings by ID.

**Acceptance Criteria:**
- User can select at least 2–4 vehicles and open a comparison view.
- Key specs and history are shown in a side-by-side layout.

---

## 8. Performance Filters

**User Story:**  
As a performance-focused buyer, I want to filter cars by 0–60 time, horsepower, and torque so I can find enthusiast-grade options.

**Tasks:**
- Add performance fields to `listings` (hp, torque, 0–60 time).
- Extend `GET /listings` to support performance filter parameters.
- Add performance filter controls to the UI.

**Acceptance Criteria:**
- User can filter by performance metrics.
- Listings update to only show vehicles that match the performance filters.

---

## 9. Efficiency Filters (Fuel Economy)

**User Story:**  
As a commuter, I want to filter by fuel economy so that I can find cars that save me money on gas.

**Tasks:**
- Add fuel economy fields (city/highway MPG or similar) to `listings`.
- Extend `GET /listings` to support efficiency filters.
- Add efficiency filter UI (e.g., minimum MPG).

**Acceptance Criteria:**
- User can filter by minimum MPG.
- Only cars meeting that MPG threshold appear in results.

---

## 10. Nearby Repair Shops and Service Cost Estimates

**User Story:**  
As a buyer, I want to see nearby trusted repair shops and their average service costs so I know where to go after purchasing.

**Tasks:**
- Create `repair_shops` table with location and average service prices.
- Add `GET /repair-shops` endpoint that filters by user’s location.
- Build a simple UI section that lists nearby shops and estimated service costs.

**Acceptance Criteria:**
- When given a location, the app shows a list of nearby shops.
- Each shop shows at least a name, distance (or city), and an average service cost range.