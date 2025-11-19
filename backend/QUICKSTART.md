# Momentum Backend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Set Up PostgreSQL

Make sure PostgreSQL is installed and running:

```bash
# Check if PostgreSQL is running
psql --version

# If not installed on macOS, install with Homebrew:
brew install postgresql@15
brew services start postgresql@15
```

### Step 2: Create the Database

```bash
# Connect to PostgreSQL
psql postgres

# In the PostgreSQL prompt, run:
CREATE DATABASE momentum_db;

# Optional: Create a specific user
CREATE USER momentum_user WITH PASSWORD 'momentum_pass';
GRANT ALL PRIVILEGES ON DATABASE momentum_db TO momentum_user;

# Exit PostgreSQL
\q
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
# Use these values if you followed Step 2 exactly:
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=momentum_db
DB_USER=momentum_user
DB_PASSWORD=momentum_pass

JWT_SECRET=your_secret_key_change_this_to_something_secure
JWT_EXPIRE=7d
```

### Step 4: Initialize the Database

```bash
npm run init-db
```

You should see:
```
✅ Connected to PostgreSQL database
🔄 Starting database initialization...
✅ Database schema created successfully!
📊 Tables created: users, goals, progress_entries
✅ Database initialization complete
```

### Step 5: Start the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
🚀 Server is running on port 5000
📍 Environment: development
✅ Connected to PostgreSQL database
```

### Step 6: Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Momentum API is running",
  "timestamp": "2025-11-15T..."
}
```

## 📝 Quick Test Flow

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Save the `token` from the response!

### 2. Create a Goal

```bash
# Replace YOUR_TOKEN with the token from Step 1
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category": "fitness",
    "title": "Daily Steps Goal",
    "description": "Walk 10,000 steps every day",
    "targetValue": 10000,
    "targetUnit": "steps",
    "startDate": "2025-11-15"
  }'
```

Save the `goal.id` from the response!

### 3. Log Progress

```bash
# Replace YOUR_TOKEN and GOAL_ID
curl -X POST http://localhost:5000/api/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "goalId": "GOAL_ID",
    "entryDate": "2025-11-15",
    "value": 8500,
    "unit": "steps",
    "notes": "Good walk today!"
  }'
```

### 4. View Dashboard

```bash
# Replace YOUR_TOKEN
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/analytics/dashboard
```

## 🔧 Troubleshooting

### Database Connection Error

If you see "connection refused":
```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL if it's not running
brew services start postgresql@15

# Or on Linux:
sudo systemctl start postgresql
```

### "Database does not exist" Error

```bash
# Make sure you created the database
psql postgres -c "CREATE DATABASE momentum_db;"
```

### Port Already in Use

If port 5000 is already in use:
```bash
# Change PORT in .env file
PORT=3000

# Or kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Token Errors

Make sure you:
1. Include the token in the Authorization header
2. Use the format: `Bearer YOUR_TOKEN`
3. Generate a new token if it expired (default: 7 days)

## 📚 Next Steps

1. **Explore the API**: See `README.md` for all available endpoints
2. **Test Different Categories**: Try creating fitness, nutrition, and job_search goals
3. **View Analytics**: Check out the analytics endpoints for insights
4. **Build the Frontend**: Ready to connect to a React frontend!

## 🐛 Common Issues

### Cannot find module 'pg'
```bash
npm install
```

### Database schema errors
```bash
# Reset the database
psql postgres
DROP DATABASE momentum_db;
CREATE DATABASE momentum_db;
\q

# Re-initialize
npm run init-db
```

## 💡 Tips

- Use Postman or Thunder Client for easier API testing
- Check server logs for detailed error messages
- Use `npm run dev` during development for auto-reload
- Keep your JWT_SECRET secure and change it in production

## 📞 Need Help?

Check the logs:
- Server logs appear in the terminal where you ran `npm run dev`
- Look for error messages with ❌ emoji
- Check PostgreSQL logs if database issues persist

Happy coding! 🎉
