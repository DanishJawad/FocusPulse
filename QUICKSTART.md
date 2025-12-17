# Quick Start Guide for FocusPulse

## Installation Steps

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not installed)
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Use in .env file

### 3. Configure Environment

**Backend .env file:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/focuspulse
JWT_SECRET=mysupersecretkey123456
STRIPE_SECRET_KEY=sk_test_51xxxxx  # Get from stripe.com
NODE_ENV=development
```

### 4. Get Stripe Keys (Optional for payment testing)

1. Go to stripe.com
2. Create account (free)
3. Go to Developers > API Keys
4. Copy Secret Key to .env

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the App

Open browser: http://localhost:3000

## First Time Usage

1. Click "Sign up" 
2. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123

3. Start using the timer!

## Testing Payment (Optional)

1. Click "Upgrade to Premium" button
2. Use test card: 4242 4242 4242 4242
3. Expiry: Any future date
4. CVC: Any 3 digits

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running: `mongod`
- Verify MONGODB_URI in .env

**Port Already in Use:**
- Change PORT in backend/.env
- Update proxy in frontend/package.json

**Dependencies Error:**
- Delete node_modules
- Run `npm install` again

## Demo Credentials

For quick testing:
- Email: demo@focuspulse.com
- Password: demo123

(Create this account after first run)

## Features to Show Professor

✅ Authentication (Register/Login)
✅ Timer with Sessions
✅ Dashboard with Charts
✅ Task Management (Full CRUD)
✅ Premium Upgrade (Stripe)
✅ Mood Tracking
✅ Statistics

Good luck with your presentation! 🚀
