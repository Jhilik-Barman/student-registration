# Student Registration System

React + Vite frontend with Node.js/Express backend and MongoDB database.

## Project Structure

```
student-registration/
├── frontend/          # React + Vite app
└── backend/           # Node.js + Express + MongoDB
```

## Quick Start

### 1. Clone the repo & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup environment variables

```bash
# In backend folder, create .env file:
cp .env.example .env
# Then edit .env with your MongoDB URI
```

### 3. Run the apps

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

## Features

- Student registration with validation
- Full Name (required)
- Gmail address validation (@gmail.com only)
- Indian phone number validation (real 10-digit numbers)
- MongoDB storage
- REST API with Express

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Validation | express-validator (backend), custom (frontend) |
