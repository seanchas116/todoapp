# todoapp

A full-stack todo web app (for learning)

Based on [Apollo Server と Prisma ではじめる GraphQL API 開発入門](https://zenn.dev/eringiv3/books/a85174531fd56a)

## Tech Stack

- Firebase for authentication
- Google Cloud Run for backend server
- Supabase for Postgres database
- Vercel for frontend hosting

## Setup (local)

### Backend

1. Install dependencies

```bash
cd backend
npm install
```

2. Create `.env` file

```
DATABASE_URL="postgresql://postgres:password@localhost:5432"
```

3. Run the server

```bash
docker-compose up -d
npm run dev
```

### Frontend

1. Install dependencies

```bash
cd frontend
npm install
```

2. Run the server

```bash
npm run dev
```

## Setup

- Create a Firebase project
- Set up Firebase authentication
- Update `frontend/src/util/firebase.ts`
- Download a service account key from Firebase project settings and save it as `backend/service-accounts.json`
- Create a Supabase project
- Copy the database URL
- Deploy the backend server to Google Cloud Run
  - Set the environment variable `DATABASE_URL` to the database URL (using Secret Manager)
- Deploy the frontend to Vercel
