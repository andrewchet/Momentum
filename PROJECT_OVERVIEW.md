# 🎯 Momentum - Full Stack Goal Tracking Application

## Project Overview

Momentum is a complete full-stack web application for tracking fitness, nutrition, and job search goals. Built with modern technologies, it provides a robust backend API and an intuitive React frontend.

## ✅ What's Built

### Backend (Node.js + Express + PostgreSQL)
- ✅ RESTful API with full CRUD operations
- ✅ JWT authentication with bcrypt password hashing
- ✅ PostgreSQL database with normalized schema
- ✅ Goal management (fitness, nutrition, job search)
- ✅ Progress tracking with daily entries
- ✅ Analytics dashboard with aggregated statistics
- ✅ Input validation and error handling
- ✅ Comprehensive API documentation

### Frontend (React + TypeScript + Tailwind CSS)
- ✅ Modern React 18 with TypeScript
- ✅ Authentication (login/register) with JWT
- ✅ Protected routes and navigation
- ✅ Dashboard with charts and statistics
- ✅ Goal management (create, edit, delete, filter)
- ✅ Progress tracking interface
- ✅ Responsive design with Tailwind CSS
- ✅ Chart.js visualizations
- ✅ Axios API client with interceptors

## 🏗️ Architecture

```
Momentum/
├── backend/                    # Node.js Express API
│   ├── config/
│   │   └── database.js        # PostgreSQL connection
│   ├── database/
│   │   └── schema.sql         # Database schema
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── validate.js        # Request validation
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── goals.js           # Goals CRUD
│   │   ├── progress.js        # Progress tracking
│   │   └── analytics.js       # Dashboard analytics
│   ├── scripts/
│   │   └── initDatabase.js    # DB initialization
│   ├── .env                   # Environment config
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── README.md              # Backend docs
│   └── API_DOCS.md            # API reference
│
├── frontend/                   # React TypeScript App
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── GoalList.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   ├── ProgressForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Axios API client
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   ├── App.tsx            # Main app
│   │   ├── index.tsx          # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                   # Frontend config
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind config
│   └── README.md              # Frontend docs
│
├── QUICKSTART.md              # Quick setup guide
└── ROADMAP.md                 # Project roadmap
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up PostgreSQL database
psql postgres
CREATE DATABASE momentum_db;
\q

# Initialize database
node scripts/initDatabase.js

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start backend server
npm start
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend runs on `http://localhost:3000`

### 3. Use the Application

1. Open `http://localhost:3000`
2. Register a new account
3. Create your first goal
4. Log progress entries
5. View your dashboard analytics

## 🔑 Key Features

### Authentication & Security
- JWT token-based authentication
- Secure password hashing with bcrypt
- Protected API endpoints
- Automatic token refresh
- Session management

### Goal Management
- Create goals in 3 categories: Fitness, Nutrition, Job Search
- Set target values and units
- Track goal status (active, completed, paused, abandoned)
- Edit and delete goals
- Filter goals by category and status

### Progress Tracking
- Log daily progress entries
- Add notes to entries
- View progress statistics
- Track totals and averages
- Edit and delete entries

### Analytics Dashboard
- Total goals overview
- Active vs completed goals
- Progress entries count
- Category breakdown chart
- Recent progress timeline
- Visual statistics with Chart.js

### User Experience
- Responsive mobile-first design
- Intuitive navigation
- Real-time updates
- Error handling and validation
- Loading states
- Confirmation dialogs

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **pg** - PostgreSQL client

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Chart.js** - Data visualization
- **React Chart.js 2** - React wrapper

## 📚 Documentation

- **Backend API**: See `backend/API_DOCS.md`
- **Backend Setup**: See `backend/README.md`
- **Frontend Setup**: See `frontend/README.md`
- **Quick Start**: See `QUICKSTART.md`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `GET /api/goals/:id` - Get goal by ID
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Progress
- `GET /api/progress/goal/:goalId` - Get progress for goal
- `POST /api/progress` - Create progress entry
- `PUT /api/progress/:id` - Update progress entry
- `DELETE /api/progress/:id` - Delete progress entry

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/goal/:id/progress` - Get goal progress
- `GET /api/analytics/trends` - Get trend data

## 🎨 Frontend Pages

1. **Login** (`/login`) - User authentication
2. **Register** (`/register`) - New user registration
3. **Dashboard** (`/dashboard`) - Overview with charts
4. **Goals** (`/goals`) - List and manage goals
5. **Progress** (`/goals/:id/progress`) - Track goal progress

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=momentum_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test the Backend API
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

### Test the Frontend
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
node server.js
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
```

## 🚢 Deployment Options

### Backend
- Heroku
- AWS EC2/ECS
- DigitalOcean
- Railway
- Render

### Frontend
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📈 Future Enhancements

See `ROADMAP.md` for planned features:
- Social features and sharing
- AI-powered goal recommendations
- Mobile app (React Native)
- Email notifications
- Team goals and collaboration
- Advanced analytics and insights
- Goal templates library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 👨‍💻 Developer Notes

### Database Schema
- Users, Goals, and Progress tables
- UUID primary keys
- Foreign key constraints with CASCADE
- Indexed queries for performance
- Automatic timestamp updates

### Code Organization
- Backend: MVC-like pattern with routes, middleware, config
- Frontend: Component-based architecture with context API
- Type safety with TypeScript
- Reusable components and utilities

### Best Practices
- JWT token management
- Input validation and sanitization
- Error handling and logging
- Responsive design patterns
- Accessibility considerations

## 🎯 Success Metrics

The application successfully provides:
- ✅ Complete user authentication flow
- ✅ Full CRUD operations for goals
- ✅ Progress tracking with analytics
- ✅ Responsive UI/UX
- ✅ Type-safe codebase
- ✅ Production-ready architecture

---

Built with ❤️ using Node.js, React, PostgreSQL, and TypeScript
