# AutoPartPicker – Product Requirements Document (PRD)

## Product Title and Brief Description
AutoPartPicker is a web and mobile app that helps car buyers evaluate used vehicles with more transparency. It aggregates listings from private sellers and dealerships and shows history, ownership, and cost information so buyers can avoid scams and surprise expenses.

The goal is to provide a single place where users can find cars, compare them, and understand reliability, maintenance expectations, and parts compatibility before purchasing.

## Technical Architecture

### Front-End
- React (Vite) single-page application
- Mobile-first layout
- Main views:
  - Listings (home)
  - Filters
  - Vehicle detail
  - Comparison view
  - History / verification
  - Messaging
  - Account

### Back-End
- Node.js with Express
- REST API endpoints for:
  - Listings (search, filters, comparison)
  - Vehicle history and verification
  - User accounts and messaging
  - Repair shop and service cost lookup

### Database (Supabase / Postgres)
Likely tables:
- `users` – account info
- `listings` – dealer + private seller listings
- `vehicle_history` – VIN, accidents, title, ownership count
- `messages` – secure messaging between buyer and seller
- `repair_shops` – nearby trusted shops and average service costs
- `comparisons` or logic to compare multiple `listings`

### Tools and Frameworks
- Front-end: React, Vite
- Back-end: Node.js, Express
- Database: Supabase Postgres
- Version control: Git + GitHub
- Editor: Windsurf

### Constraints
- Must support mobile users first
- Must handle filters such as radius, performance specs, and fuel economy efficiently
- Must protect user privacy for secure messaging