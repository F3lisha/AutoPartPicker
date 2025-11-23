# AutoPartPicker

A mobile-first web application that aggregates used-car listings, verifies vehicle history, and provides ownership cost and parts compatibility insights.

## Project Structure

```
├── client/         # React PWA (Vite)
├── api/            # Express API
├── supabase/       # Database migrations and seeds
│   ├── migrations/
│   └── seed/
└── docs/           # Project documentation
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Getting Started

### Client Setup
```bash
cd client
npm install
npm run dev
```

### API Setup
```bash
cd api
npm install
npm run dev
```

### Database Setup
1. Create a new project in Supabase
2. Run migrations: `supabase db push`
3. Seed the database: `supabase db seed`

## Development

- Client runs on: `http://localhost:5173`
- API runs on: `http://localhost:3000`

## Environment Variables

Create `.env` files in both `client` and `api` directories with the required environment variables. Refer to `.env.example` in each directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT
