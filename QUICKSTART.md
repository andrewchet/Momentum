# Momentum - Quick Start Guide

Follow these steps to get the full Momentum application running locally.

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Backend Setup (5 minutes)

1. **Start PostgreSQL**
   ```bash
   # Make sure PostgreSQL is running
   ```

2. **Set up the database**
   ```bash
   cd backend
   npm install
   
   # Create database and run schema
   psql postgres
   CREATE DATABASE momentum_db;
   \q
   
   # Initialize database
   node scripts/initDatabase.js
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start backend server**
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:5000`

## Frontend Setup (2 minutes)

1. **Install and start**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## Test the Application

1. **Register** a new account at `http://localhost:3000/register`
2. **Create** your first goal
3. **Log** progress entries
4. **View** your dashboard with analytics

## Troubleshooting

- **Backend won't start**: Check PostgreSQL is running and credentials in `.env`
- **Frontend can't connect**: Ensure backend is running on port 5000
- **Database errors**: Run `node scripts/initDatabase.js` again

## Next Steps

- Explore the API documentation at `backend/API_DOCS.md`
- Customize the frontend theme in `frontend/tailwind.config.js`
- Add more goal categories as needed

Enjoy tracking your momentum! 🚀
