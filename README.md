# Focus Pulse - MVP (Week 1-2 Deliverable)

![Focus Pulse](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)

## 🎯 Project Overview

**Focus Pulse** is an interactive, data-driven web application designed to help individuals visualize and enhance their personal productivity. This MVP (Minimum Viable Product) is a static front-end prototype that tracks focus sessions, correlates them with mood, and provides insightful analytics through beautiful visualizations.

### ✨ Key Features

- ⏱️ **Circular Timer**: Beautiful circular progress timer with gradient animation
- 📝 **Task Tracking**: Record what you're working on during each session
- 😊 **Mood Recording**: Capture your emotional state after each session (6 moods)
- 💾 **Local Storage**: All data stored securely in your browser
- 📊 **Visual Analytics**: Interactive charts powered by Chart.js
- 🎯 **Sample Data**: Pre-filled demo data for immediate visualization
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🌙 **Dark Theme**: Minimal, futuristic interface that's easy on the eyes

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server required!

### Running the Application

1. **Clone or download this repository**
2. **Open `index.html` in your browser**
3. **Start tracking your focus sessions!**

That's it! The application runs entirely in your browser.

## 📖 How to Use

### Starting a Focus Session

1. Navigate to the **Timer** page
2. Enter what you're working on in the task field
3. Click **"Start Focus"**
4. Watch the circular timer fill up as you work
5. Click **"Stop Session"** when done (minimum 1 minute)
6. Select your mood from the modal that appears
7. Your session is automatically saved!

**Timer Features:**
- Circular progress indicator that completes in 60 minutes
- Real-time digital display (HH:MM:SS format)
- Gradient animation (cyan to purple)
- Quick stats showing today's progress

### Viewing Your Analytics

1. Navigate to the **Dashboard** page
2. View your summary statistics at the top:
   - Total Focus Time (all sessions combined)
   - Total Sessions completed
   - Average Session duration
   - Current Streak (consecutive days)
3. Explore interactive charts showing:
   - Daily focus patterns (last 7 days) - Bar chart
   - Mood distribution - Doughnut chart
   - Weekly performance trends - Line chart
4. Review your recent sessions list (last 10 sessions)
5. Use **"Load Sample Data"** to see demo data
6. Track your focus streak!

**Dashboard Features:**
- Auto-loads sample data on first visit for demonstration
- Real-time chart updates
- Session history with timestamps
- Data management controls

### Managing Your Data

- All data is stored locally in your browser using Local Storage API
- **"Load Sample Data"** button generates 14 days of demo sessions
- **"Clear All Data"** button on the Dashboard resets everything
- Your data persists across browser sessions
- Data is only cleared if you clear browser cache or use the clear button

**Sample Data Includes:**
- 20-40 random focus sessions over 14 days
- 10 different task types (coding, studying, design, etc.)
- 6 mood variations (focused, calm, energized, distracted, tired, stressed)
- Realistic session durations (15-90 minutes)
- Work hours distribution (9 AM - 6 PM)

## 🛠️ Technical Stack

### Stage 1 (MVP) - Current Version

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with modern features
  - CSS Grid & Flexbox for layouts
  - CSS Variables for theming
  - CSS Animations for smooth interactions
- **JavaScript (ES6+)**: Core functionality
- **jQuery**: DOM manipulation and event handling
- **Chart.js**: Data visualization library
- **Local Storage API**: Client-side data persistence

## 📁 Project Structure

```
FocusPulse/
├── index.html              # Timer page (main entry point)
├── dashboard.html          # Dashboard page
├── css/
│   └── styles.css         # All styling (dark theme, responsive)
├── js/
│   ├── timer.js           # Timer functionality & local storage
│   └── dashboard.js       # Dashboard & Chart.js integration
└── README.md              # This file
```

## 🎨 Design Philosophy

Focus Pulse follows a **calm, minimal, and futuristic** design approach:

- **Dark Color Scheme**: Reduces eye strain during long work sessions
- **Gradient Accents**: Cyan to purple gradients for visual interest and modern appeal
- **Circular Timer**: SVG-based circular progress indicator for intuitive time visualization
- **Clean Typography**: Clear, readable fonts optimized for extended use
- **Smooth Animations**: Subtle transitions and progress animations for better UX
- **Data-Driven**: Every element serves a purpose in understanding productivity
- **Responsive Layout**: CSS Grid and Flexbox for seamless multi-device experience

## 📊 Data Structure

Sessions are stored in Local Storage with the following structure:

```javascript
{
  id: 1698765432000,           // Timestamp as unique ID
  task: "Writing project proposal",
  duration: 1800,              // Duration in seconds
  mood: "focused",             // Selected mood
  date: "2025-10-28T10:30:00", // ISO date string
  timestamp: 1698765432000     // Unix timestamp
}
```

## 🎯 Week 1-2 Deliverables (MVP Checklist)

### ✅ Week 1: MVP Foundations
- [x] Build basic pages (Timer, Dashboard) with semantic HTML5
- [x] Implement the timer functionality with start/stop controls
- [x] Add circular progress indicator with SVG animation
- [x] Implement mood selection modal with 6 moods
- [x] Save sessions to Local Storage with complete data structure
- [x] Display data with Chart.js visualizations (bar, doughnut, line)
- [x] Add quick stats on timer page

### ✅ Week 2: MVP Polish
- [x] Calculate metrics (total time, averages, streaks)
- [x] Implement automatic sample data generation
- [x] Add "Load Sample Data" functionality for demos
- [x] Ensure mobile responsiveness (3 breakpoints: 768px, 480px)
- [x] Add smooth animations and transitions
- [x] Create comprehensive README documentation
- [x] Final testing and bug fixes
- [x] Implement data management controls

### 🎉 Bonus Features Added
- [x] Circular timer with gradient progress animation
- [x] Auto-load sample data on first visit
- [x] Notification system for session completion
- [x] Session streak calculation
- [x] Responsive SVG timer (scales on mobile)
- [x] Recent sessions list with timestamps

## 🚀 Future Enhancements (Stage 2 - Full Stack)

The next phase will transform this into a full MERN stack application:

- 👤 User authentication (signup/login)
- 🗄️ MongoDB database for persistent storage
- 🔧 Node.js + Express.js backend API
- ⚛️ React.js frontend migration
- 🧠 AI-powered insights engine
- 🎨 Theme customization
- 📈 Advanced analytics
- 🌐 Multi-device synchronization

## 🧪 Testing

To test the application:

1. **Timer Functionality**
   - Start a session without entering a task (should show alert)
   - Start and stop a session under 1 minute (should show alert)
   - Complete a full session and verify mood modal appears
   - Check that circular progress animates smoothly (completes at 60 min)
   - Verify quick stats update after saving
   - Test reset functionality

2. **Dashboard Analytics**
   - First visit should auto-load sample data
   - Verify summary cards show correct totals
   - Check that all three charts render with data
   - Test the "Load Sample Data" button (replaces existing data)
   - Test the "Clear All Data" button (removes all data)
   - Verify recent sessions list displays correctly with timestamps

3. **Responsive Design**
   - Test on different screen sizes (desktop, tablet, mobile)
   - Verify circular timer scales properly (300px → 250px → 200px)
   - Check that charts are readable on small screens
   - Test navigation menu on mobile
   - Verify mood modal layout on different devices

4. **Data Persistence**
   - Create sessions and refresh the page (data should persist)
   - Close browser and reopen (data should still be there)
   - Test Local Storage limits (should handle 50+ sessions easily)

## 💡 Tips for Best Results

- Focus for at least 5-10 minutes per session for meaningful data
- Be consistent with your mood selections for better pattern recognition
- Use descriptive task names to track what you work on (e.g., "Coding login feature" vs "Work")
- Check your dashboard regularly to identify productivity patterns
- Aim for a daily streak to build consistent work habits!
- Use the sample data feature to demonstrate the app to others
- The circular timer completes one full rotation at 60 minutes - plan your sessions accordingly
- Try different moods to see how they affect your productivity insights

## 🐛 Known Limitations (MVP)

- Data only stored locally (cleared if browser cache is cleared)
- No user accounts or cloud sync
- No data export/import functionality
- Charts limited to last 7 days of detailed data
- No push notifications or reminders
- Circular timer resets after 60 minutes (visual only, actual timer continues)
- No pause functionality (only start/stop)
- Minimum session time: 1 minute

These will be addressed in Stage 2 (Full Stack version).

## 👨‍💻 Developer

**Dani**  
COMSATS University  
Web Development Mid-Term Project

## 📄 License

This project is created for educational purposes as part of a university web development course.

## 🙏 Acknowledgments

- Chart.js for beautiful and responsive data visualizations
- jQuery for simplified DOM manipulation and event handling
- SVG for scalable circular timer graphics
- The Pomodoro Technique for productivity inspiration
- Modern CSS Grid and Flexbox for responsive layouts
- Local Storage API for client-side data persistence

---

**Ready to boost your productivity?** Open `index.html` and start your first focus session! 🚀

**Watch the circular timer fill up as you focus, track your moods, and visualize your productivity patterns!** 📊✨
