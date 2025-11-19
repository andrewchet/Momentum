# Momentum Backend API

A full-stack goal-tracking platform backend built with Node.js, Express, and PostgreSQL. This API enables users to track fitness, nutrition, and job search metrics with JWT authentication and comprehensive analytics.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📊 **Goal Tracking**: Create and manage goals across fitness, nutrition, and job search categories
- 📈 **Progress Tracking**: Log daily progress entries with date-based queries
- 📉 **Analytics Dashboard**: Real-time statistics, trends, and visualizations
- 🗄️ **PostgreSQL Database**: Normalized schema with optimized indexes
- ✅ **Input Validation**: Express-validator for request validation
- 🚀 **RESTful API**: Clean, organized endpoint structure

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **pg** - PostgreSQL client

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Login to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE momentum_db;

   # Create user (optional)
   CREATE USER your_db_user WITH PASSWORD 'your_db_password';
   GRANT ALL PRIVILEGES ON DATABASE momentum_db TO your_db_user;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=momentum_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

5. **Initialize the database**
   ```bash
   npm run init-db
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Goals

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/goals` | Get all goals | Yes |
| GET | `/api/goals/:id` | Get specific goal | Yes |
| POST | `/api/goals` | Create new goal | Yes |
| PUT | `/api/goals/:id` | Update goal | Yes |
| DELETE | `/api/goals/:id` | Delete goal | Yes |

### Progress Entries

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/progress?goalId=:id` | Get progress entries for a goal | Yes |
| GET | `/api/progress/:id` | Get specific progress entry | Yes |
| POST | `/api/progress` | Create new progress entry | Yes |
| PUT | `/api/progress/:id` | Update progress entry | Yes |
| DELETE | `/api/progress/:id` | Delete progress entry | Yes |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/dashboard` | Get dashboard statistics | Yes |
| GET | `/api/analytics/goal/:goalId` | Get goal-specific analytics | Yes |
| GET | `/api/analytics/trends` | Get trend analysis | Yes |
| GET | `/api/analytics/streak` | Get progress streak data | Yes |

## Example API Usage

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Create a Goal
```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category": "fitness",
    "title": "Run 100 miles",
    "description": "Monthly running goal",
    "targetValue": 100,
    "targetUnit": "miles",
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  }'
```

### Log Progress
```bash
curl -X POST http://localhost:5000/api/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "goalId": "goal-uuid-here",
    "entryDate": "2025-11-15",
    "value": 5.2,
    "unit": "miles",
    "notes": "Morning run in the park"
  }'
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

### Goals Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `category` (VARCHAR: fitness, nutrition, job_search)
- `title` (VARCHAR)
- `description` (TEXT)
- `target_value` (DECIMAL)
- `target_unit` (VARCHAR)
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (VARCHAR: active, completed, paused, abandoned)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Progress Entries Table
- `id` (UUID, Primary Key)
- `goal_id` (UUID, Foreign Key)
- `entry_date` (DATE)
- `value` (DECIMAL)
- `unit` (VARCHAR)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validate.js         # Request validation middleware
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── goals.js            # Goals CRUD endpoints
│   ├── progress.js         # Progress entries endpoints
│   └── analytics.js        # Analytics and dashboard endpoints
├── scripts/
│   └── initDatabase.js     # Database initialization script
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore file
├── package.json           # Dependencies and scripts
└── server.js              # Express server setup
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes with authentication middleware
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Environment variable configuration

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Initialize/Reset database
npm run init-db
```

## Testing the API

You can use tools like:
- **Postman** - Import the endpoints and test
- **curl** - Command line testing (examples above)
- **Thunder Client** - VS Code extension
- **Insomnia** - API client

## Next Steps

- [ ] Add unit and integration tests
- [ ] Implement AWS Lambda for scheduled analytics
- [ ] Add automated reminders functionality
- [ ] Set up AWS deployment
- [ ] Add rate limiting
- [ ] Implement refresh tokens
- [ ] Add password reset functionality
- [ ] Add email verification

## License

ISC

## Author

Built for the Momentum goal-tracking platform
