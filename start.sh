#!/bin/bash

# Momentum Application - Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting Momentum Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if psql -U postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    echo "  Please start PostgreSQL and try again"
    exit 1
fi

# Check if database exists
echo "🗄️  Checking database..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw momentum_db; then
    echo -e "${GREEN}✓ Database 'momentum_db' exists${NC}"
else
    echo -e "${YELLOW}⚠ Database 'momentum_db' not found${NC}"
    echo "  Creating database..."
    psql -U postgres -c "CREATE DATABASE momentum_db;"
    echo "  Initializing database schema..."
    cd backend && node scripts/initDatabase.js
    cd ..
fi

# Start Backend
echo ""
echo "🔧 Starting Backend Server..."
cd backend
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found, copying from .env.example${NC}"
    cp .env.example .env
    echo "  Please edit backend/.env with your database credentials"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Backend logs: backend.log"
echo "  Backend URL: http://localhost:5000"

# Wait for backend to start
echo "  Waiting for backend to be ready..."
sleep 3

# Check if backend is responding
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${RED}✗ Backend failed to start. Check backend.log${NC}"
fi

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  Installing frontend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
fi

echo -e "${GREEN}✓ Starting frontend development server...${NC}"
echo "  Frontend URL: http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Momentum is starting!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Open your browser: http://localhost:3000"
echo ""
echo "To stop the application:"
echo "  - Press Ctrl+C to stop frontend"
echo "  - Backend PID: $BACKEND_PID"
echo "  - To stop backend: kill $BACKEND_PID"
echo ""

# Start frontend (this will block)
npm start

# Cleanup when frontend is stopped
echo ""
echo "🛑 Stopping backend server..."
kill $BACKEND_PID 2>/dev/null
echo -e "${GREEN}✓ Application stopped${NC}"
