# 🎯 FocusPulse - MERN Stack Productivity Application

**Professional Full-Stack Web Application | COMSATS University Final Project**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Complete-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

---

## 📖 Quick Links

- 📚 **[Documentation Index](DOCUMENTATION_INDEX.md)** - All documentation files
- 🚀 **[Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
- 🎯 **[Demo Script](DEMO_SCRIPT.md)** - Complete presentation walkthrough
- 🎓 **[Presentation Guide](PRESENTATION_GUIDE.md)** - What to demonstrate
- ✨ **[Features Documentation](FEATURES.md)** - All features explained
- 🔧 **[Troubleshooting](TROUBLESHOOTING.md)** - Fix common issues
- 🧪 **[API Testing](API_TESTING.md)** - Test all endpoints
- 📋 **[Project Summary](PROJECT_SUMMARY.md)** - Executive overview

---

## 🌟 Project Overview

FocusPulse is a complete MERN stack productivity tracking application that demonstrates professional full-stack web development skills. This project showcases authentication, CRUD operations, payment integration, real-time analytics, and modern UI/UX design.

### Built With
- **MongoDB** - NoSQL database with Mongoose ODM
- **Express.js** - Backend REST API framework
- **React** - Modern frontend library with hooks
- **Node.js** - JavaScript runtime environment
- **Stripe** - Payment gateway integration
- **JWT** - Secure authentication
- **Chart.js** - Data visualization

---

## ✨ Key Features

### 🔐 Authentication & Security
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Session management

### ⏱️ Focus Timer
- Real-time circular progress timer
- Task description tracking
- Start/Pause/Stop functionality
- Session duration recording
- Today's focus time display

### 📊 Analytics Dashboard
- Total focus time statistics
- Session count tracking
- Average session duration
- 7-day trend visualization
- Mood distribution charts
- Recent sessions display

### ✅ Task Management (Full CRUD)
- Create tasks with priorities
- Update task status & details
- Delete tasks with confirmation
- Kanban board view
- Filter by status
- Priority color coding

### 💰 Premium Features
- Stripe payment integration
- Secure checkout flow
- Payment verification
- Premium status tracking
- Test mode for demo

### 😊 Mood Tracking
- 6 mood options after each session
- Mood analytics and distribution
- Color-coded mood indicators
- Emotional pattern insights

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js (v14+)
MongoDB (local or Atlas)
npm or yarn
```

### Installation (3 Steps)

**1. Run Setup Script**
```bash
./setup.sh
```

**2. Configure Environment**
```bash
# Edit backend/.env
MONGODB_URI=mongodb://localhost:27017/focuspulse
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

**3. Start Application**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

**Access:** http://localhost:3000

**See [QUICKSTART.md](QUICKSTART.md) for detailed instructions**

---

## 📁 Project Structure

```
FocusPulse/
├── backend/                 # Express.js API
│   ├── models/             # Mongoose schemas
│   │   ├── User.js        # User authentication
│   │   ├── Session.js     # Focus sessions
│   │   └── Task.js        # Task management
│   ├── routes/            # API endpoints
│   │   ├── auth.js       # Authentication
│   │   ├── sessions.js   # Session CRUD
│   │   ├── tasks.js      # Task CRUD
│   │   └── payment.js    # Stripe integration
│   ├── middleware/
│   │   └── auth.js       # JWT verification
│   └── server.js         # Express server
│
├── frontend/              # React application
│   └── src/
│       ├── components/   # Navbar, PrivateRoute
│       ├── context/      # AuthContext
│       ├── pages/        # Login, Timer, Dashboard, Tasks
│       └── App.js        # Main app
│
└── Documentation/        # All docs
    ├── QUICKSTART.md
    ├── DEMO_SCRIPT.md
    ├── FEATURES.md
    └── More...
```

---

## 🎯 Core Features Demonstration

### ✅ Authentication (JWT)
- [x] User registration
- [x] Secure login
- [x] Token management
- [x] Protected routes
- [x] Logout functionality

### ✅ CRUD Operations - Sessions
- [x] **Create:** Save focus sessions
- [x] **Read:** View all sessions + stats
- [x] **Update:** Modify session details
- [x] **Delete:** Remove sessions

### ✅ CRUD Operations - Tasks
- [x] **Create:** Add new tasks
- [x] **Read:** View all tasks
- [x] **Update:** Change status/priority
- [x] **Delete:** Remove tasks

### ✅ Payment Integration (Stripe)
- [x] Checkout session creation
- [x] Payment processing
- [x] Server-side verification
- [x] Premium status management

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Sessions (Protected)
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/stats` - Get statistics
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Tasks (Protected)
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Payment (Protected)
- `POST /api/payment/create-checkout-session` - Start payment
- `POST /api/payment/verify-session` - Verify payment
- `GET /api/payment/premium-status` - Check status

**Full API documentation: [API_TESTING.md](API_TESTING.md)**

---

## 📊 Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isPremium: Boolean,
  premiumExpiresAt: Date
}
```

### Sessions
```javascript
{
  user: ObjectId,
  task: String,
  duration: Number (seconds),
  mood: String,
  date: Date
}
```

### Tasks
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  status: String (pending/in-progress/completed),
  priority: String (low/medium/high)
}
```

---

## 🔒 Security Features

✅ **Password Security:** Bcrypt hashing (12 rounds)  
✅ **Authentication:** JWT tokens with 30-day expiry  
✅ **Authorization:** Middleware protection on all routes  
✅ **Data Validation:** Mongoose schemas + frontend validation  
✅ **User Ownership:** Backend verifies resource ownership  
✅ **Environment Variables:** Secrets in .env files  

---

## 🛠️ Technologies

### Backend
- **Express.js** 4.18 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.0 - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** 14.10 - Payments
- **CORS** - Cross-origin requests

### Frontend
- **React** 18.2 - UI library
- **React Router** 6.20 - Navigation
- **Axios** - HTTP client
- **Chart.js** 4.4 - Visualizations
- **Context API** - State management
- **Stripe JS** - Payment UI

---

## 🎓 For Professors/Reviewers

This project demonstrates:

### ✅ Full-Stack Development
- Complete MERN stack implementation
- RESTful API design
- Modern React patterns
- Database design & relationships

### ✅ Authentication & Security
- JWT-based authentication
- Password hashing & validation
- Protected routes
- Secure environment configuration

### ✅ CRUD Operations
- Sessions: Complete CRUD
- Tasks: Complete CRUD
- Users: Register, login, profile

### ✅ Third-Party Integration
- Stripe payment gateway
- Chart.js for analytics
- Proper API key management

### ✅ Best Practices
- Clean code organization
- Error handling
- Input validation
- Responsive design
- Professional UI/UX
- Comprehensive documentation

**Demo Preparation:** See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for complete walkthrough

---

## 💳 Testing Payments

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

*No real money charged in test mode*

---

## 🧪 Running Tests

```bash
# Test Backend API
curl http://localhost:5000/api/health

# Test Authentication
See API_TESTING.md for full examples

# Test Frontend
Navigate through all pages
Complete a session
Create/update/delete tasks
```

---

## 📚 Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Fast setup | Setting up project |
| [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | Presentation | Before demo |
| [FEATURES.md](FEATURES.md) | All features | Understanding capabilities |
| [API_TESTING.md](API_TESTING.md) | API docs | Testing endpoints |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Fix issues | Something broken |
| [PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md) | Demo prep | Preparing presentation |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Overview | Quick understanding |

**See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for complete guide**

---

## 🚧 Troubleshooting

**MongoDB not connecting?**
```bash
# Start MongoDB
mongod

# Or check if running
ps aux | grep mongod
```

**Port already in use?**
```bash
# Kill process
lsof -i :5000
kill -9 <PID>
```

**Dependencies not installing?**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**More help:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎯 Future Enhancements

- Email verification
- Password reset
- Team collaboration
- Mobile app (React Native)
- Desktop app (Electron)
- Advanced analytics
- Export data (CSV/PDF)
- Social features
- Break reminders
- Pomodoro technique

---

## 📝 License

This is an academic project for educational purposes at COMSATS University.

---

## 👤 Author

**Student:** Dani  
**Course:** Web Development  
**Institution:** COMSATS University  
**Semester:** 5  
**Year:** 2025

---

## 🙏 Acknowledgments

- COMSATS University Web Development Course
- MERN Stack Community
- MongoDB Documentation
- React Documentation
- Stripe Documentation
- Chart.js Community

---

## ✅ Project Checklist

- [x] MERN Stack Implementation
- [x] User Authentication (JWT)
- [x] Sessions CRUD Operations
- [x] Tasks CRUD Operations
- [x] Stripe Payment Integration
- [x] Real-time Timer
- [x] Analytics Dashboard
- [x] Responsive Design
- [x] Error Handling
- [x] Input Validation
- [x] Security Best Practices
- [x] Comprehensive Documentation
- [x] Ready for Demonstration

---

**Status:** ✅ Complete and Ready for Presentation

**Last Updated:** December 2025

---

Made with 💙 for COMSATS University Web Development Final Project
