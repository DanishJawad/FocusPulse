# 🔧 Troubleshooting Guide

Common issues and their solutions when setting up and running FocusPulse.

---

## Installation Issues

### npm install fails

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete package-lock.json and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, update npm
npm install -g npm@latest
```

### Node version incompatibility

**Problem:** "Unsupported engine" error

**Solution:**
```bash
# Check Node version
node --version

# Should be v14 or higher
# Update if needed from nodejs.org

# Or use nvm (Node Version Manager)
nvm install 16
nvm use 16
```

---

## MongoDB Issues

### MongoDB won't start

**Problem:** `mongod` command fails

**Solution (macOS):**
```bash
# Check if MongoDB is installed
mongod --version

# Install if not installed
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

**Solution (Windows):**
```bash
# Check MongoDB service
net start MongoDB

# If not working, reinstall from mongodb.com
# Then start as Windows service
```

### Connection refused error

**Problem:** "MongoServerError: connect ECONNREFUSED"

**Solutions:**
```bash
# 1. Check if MongoDB is running
ps aux | grep mongod

# 2. Start MongoDB if not running
mongod

# 3. Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/focuspulse

# 4. Try MongoDB Compass to verify connection
# Download from mongodb.com/products/compass
```

### Database connection timeout

**Problem:** Connection takes too long or times out

**Solutions:**
```bash
# 1. Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# 2. Verify firewall isn't blocking
# Allow port 27017

# 3. Try MongoDB Atlas (cloud)
# Get free cluster at mongodb.com/atlas
# Update MONGODB_URI in .env
```

---

## Backend Issues

### Port already in use

**Problem:** "Error: listen EADDRINUSE :::5000"

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### JWT_SECRET not defined

**Problem:** "JWT_SECRET must be defined"

**Solution:**
```bash
# Make sure .env exists in backend/
cd backend
ls -la .env

# If not, copy from example
cp .env.example .env

# Edit .env and add
JWT_SECRET=your_secret_key_here_at_least_32_chars
```

### Bcrypt installation fails

**Problem:** Bcrypt won't compile

**Solution:**
```bash
# Rebuild bcrypt
npm rebuild bcrypt

# Or install specific version
npm install bcryptjs@2.4.3

# On Windows, might need:
npm install --global windows-build-tools
npm install bcrypt
```

### CORS errors

**Problem:** "Access-Control-Allow-Origin" error

**Solution:**
Backend already has CORS configured, but if issues persist:

```javascript
// In backend/server.js, update CORS config
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Frontend Issues

### npm start fails

**Problem:** React won't start

**Solutions:**
```bash
# 1. Check if port 3000 is free
lsof -i :3000
kill -9 <PID>

# 2. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Clear React cache
rm -rf node_modules/.cache
```

### Proxy errors

**Problem:** API calls not reaching backend

**Solution:**
```bash
# Verify proxy in frontend/package.json
"proxy": "http://localhost:5000"

# Make sure backend is running on port 5000
# Check backend/.env PORT setting
```

### Chart.js errors

**Problem:** Charts not displaying

**Solutions:**
```bash
# Reinstall Chart.js
npm uninstall chart.js react-chartjs-2
npm install chart.js@4.4.0 react-chartjs-2@5.2.0

# Check imports in Dashboard.js
# Should import from 'chart.js' not 'chart.js/auto'
```

### Routing issues

**Problem:** 404 on page refresh

**Solution:**
This is normal in development. The proxy handles it.
For production build:

```javascript
// Add to backend/server.js (after routes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

---

## Authentication Issues

### Token not persisting

**Problem:** User logged out on refresh

**Solutions:**
```javascript
// Check AuthContext.js
// localStorage should persist token
localStorage.setItem('token', res.data.token);

// Check browser console for errors
// Open DevTools → Application → Local Storage
// Should see 'token' key
```

### Login fails with correct credentials

**Problem:** Valid credentials rejected

**Solutions:**
```bash
# Check backend logs for errors
# Might be bcrypt comparison failing

# Verify password field is included in query
// In auth.js
const user = await User.findOne({ email }).select('+password');

# Test password comparison manually
# Create test user with known password
```

### JWT expires immediately

**Problem:** Token expires too quickly

**Solution:**
```javascript
// In backend/routes/auth.js
// Check token expiration
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: '30d'  // Should be 30 days
  });
};
```

---

## Payment Issues

### Stripe key not working

**Problem:** Payment checkout not loading

**Solutions:**
```bash
# 1. Verify Stripe keys in .env
STRIPE_SECRET_KEY=sk_test_...

# 2. Must use TEST keys (sk_test_ not sk_live_)

# 3. Get keys from:
# https://dashboard.stripe.com/test/apikeys

# 4. Check Stripe initialization
# In backend/routes/payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### Payment not verifying

**Problem:** Payment completes but user not upgraded

**Solutions:**
```javascript
// Check payment verification endpoint
// In backend/routes/payment.js

// Verify session retrieval
const session = await stripe.checkout.sessions.retrieve(sessionId);

// Check payment status
if (session.payment_status === 'paid') {
  // Update user
}

// Check user update
req.user.isPremium = true;
await req.user.save();
```

---

## Database Issues

### Data not persisting

**Problem:** Data disappears after restart

**Solutions:**
```bash
# Check MongoDB data directory
# Data should persist in /data/db

# Verify database name in connection string
MONGODB_URI=mongodb://localhost:27017/focuspulse

# Check if writes are failing
# Look for errors in backend logs

# Verify user has write permissions
# In MongoDB
use focuspulse
db.sessions.insert({test: "data"})
```

### Schema validation errors

**Problem:** "ValidationError: Path required"

**Solutions:**
```javascript
// Check model schemas
// In backend/models/

// Ensure required fields are provided
// Example for Session:
{
  task: String (required),
  duration: Number (required),
  mood: String (required, enum)
}

// Check POST request body
// Must include all required fields
```

---

## Environment Variables

### .env not loading

**Problem:** Environment variables undefined

**Solutions:**
```bash
# 1. Check .env location
# Should be in backend/ not root

# 2. Verify dotenv is required
# In server.js
require('dotenv').config();

# 3. Check .env format (no quotes needed)
JWT_SECRET=mySecretKey123
not
JWT_SECRET="mySecretKey123"

# 4. Restart server after .env changes
# Ctrl+C then npm run dev
```

---

## Performance Issues

### Slow API responses

**Problem:** Requests take too long

**Solutions:**
```bash
# 1. Add database indexes
# In models/Session.js
sessionSchema.index({ user: 1, date: -1 });

# 2. Limit query results
# In routes
const sessions = await Session.find({ user: req.user._id })
  .limit(100)
  .sort({ date: -1 });

# 3. Use select to limit fields
const sessions = await Session.find()
  .select('task duration mood date');
```

### Frontend slow to load

**Problem:** Initial load is slow

**Solutions:**
```bash
# 1. Production build for testing
cd frontend
npm run build
serve -s build

# 2. Code splitting (already in React 18)

# 3. Lazy load charts
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

---

## Development Issues

### Hot reload not working

**Problem:** Changes don't reflect automatically

**Solutions:**
```bash
# Backend (nodemon)
# Check package.json scripts
"dev": "nodemon server.js"

# If not working
npm install --save-dev nodemon

# Frontend (React)
# Should auto-reload
# If not, restart: Ctrl+C then npm start
```

### Console errors in browser

**Problem:** React warnings/errors

**Solutions:**
```javascript
// Check browser console (F12)

// Common fixes:
// 1. Key props in lists
{items.map(item => (
  <div key={item._id}>...</div>
))}

// 2. Async useEffect
useEffect(() => {
  const loadData = async () => {
    // async code
  };
  loadData();
}, []);

// 3. State updates on unmounted components
useEffect(() => {
  let mounted = true;
  // async code
  if (mounted) setState(...);
  return () => mounted = false;
}, []);
```

---

## Testing Issues

### Can't test payment

**Problem:** Don't have Stripe account

**Solution:**
```bash
# 1. Create free Stripe account
# Go to stripe.com
# Click "Start now"
# Verify email

# 2. Get test API keys
# Dashboard → Developers → API keys
# Copy "Secret key" (starts with sk_test_)

# 3. Use test card numbers
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002

# No real money is charged in test mode!
```

### API testing with curl

**Problem:** Need to test endpoints

**Solution:**
```bash
# Test auth
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Save token from response

# Test protected endpoint
curl http://localhost:5000/api/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"

# See API_TESTING.md for more examples
```

---

## Production Deployment Issues

### Build fails

**Problem:** npm run build errors

**Solutions:**
```bash
# 1. Fix all warnings first
npm run build

# 2. Check for console.log (optional removal)
# Remove or comment out console.logs

# 3. Verify all dependencies installed
npm install

# 4. Check for syntax errors
npm run build 2>&1 | grep -i error
```

### Environment in production

**Problem:** Environment variables not loading

**Solution:**
```bash
# Don't use .env in production
# Set environment variables in hosting platform

# Heroku:
heroku config:set JWT_SECRET=your_secret

# Vercel:
# Add in dashboard → Settings → Environment Variables

# Railway:
# Add in Variables tab
```

---

## Quick Diagnostic Commands

```bash
# Check Node/npm versions
node --version
npm --version

# Check MongoDB
mongod --version
ps aux | grep mongod

# Check running processes
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
lsof -i :27017 # MongoDB

# Check dependencies
npm list --depth=0

# Check for updates
npm outdated

# Health check
curl http://localhost:5000/api/health
```

---

## Getting Help

### Log Files to Check

1. **Backend logs:** Terminal where `npm run dev` is running
2. **Frontend logs:** Browser console (F12)
3. **MongoDB logs:** `/usr/local/var/log/mongodb/mongo.log`

### Debug Mode

**Backend:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
```javascript
// In API calls
axios.get('/api/sessions')
  .then(res => console.log('Success:', res.data))
  .catch(err => console.error('Error:', err.response?.data));
```

### Still Stuck?

1. Check error messages carefully
2. Google the specific error
3. Check Stack Overflow
4. Review documentation files
5. Verify all setup steps completed
6. Try starting fresh (backup first!)

---

## Emergency Reset

If everything is broken:

```bash
# 1. Backup important changes
git status
git commit -am "backup before reset"

# 2. Clean everything
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf node_modules

# 3. Reinstall
cd backend && npm install
cd ../frontend && npm install

# 4. Verify .env files exist
ls backend/.env
ls frontend/.env

# 5. Restart MongoDB
brew services restart mongodb-community

# 6. Start fresh
# Terminal 1: mongod
# Terminal 2: cd backend && npm run dev
# Terminal 3: cd frontend && npm start
```

---

**Remember:** Most issues are environment-related. Double-check:
- MongoDB is running
- .env files are configured
- Dependencies are installed
- Ports are not in use
- Node version is compatible

Good luck! 🚀
