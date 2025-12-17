const express = require('express');
const Session = require('../models/Session');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/sessions
// @desc    Get all sessions for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sessions/stats
// @desc    Get session statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id });
    
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Mood distribution
    const moodCount = sessions.reduce((acc, s) => {
      acc[s.mood] = (acc[s.mood] || 0) + 1;
      return acc;
    }, {});

    // Last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= date && sessionDate < nextDay;
      });
      
      const dayDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        duration: Math.floor(dayDuration / 60),
        sessions: daySessions.length
      });
    }

    // Get today's session count for limit display
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySessionCount = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= today && sessionDate < tomorrow;
    }).length;

    res.json({
      totalSessions,
      totalDuration,
      avgDuration,
      moodDistribution: moodCount,
      last7Days,
      todaySessionCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { task, duration, mood } = req.body;

    // Check session limit for non-premium users
    if (!req.user.isPremium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaySessions = await Session.countDocuments({
        user: req.user._id,
        date: { $gte: today, $lt: tomorrow }
      });

      if (todaySessions >= 5) {
        return res.status(403).json({ 
          message: 'Daily session limit reached. Upgrade to Premium for unlimited sessions!',
          limitReached: true
        });
      }
    }

    const session = await Session.create({
      user: req.user._id,
      task,
      duration,
      mood
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update a session
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const { task, duration, mood } = req.body;
    
    if (task) session.task = task;
    if (duration) session.duration = duration;
    if (mood) session.mood = mood;

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.deleteOne();
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/sessions/demo
// @desc    Add demo session data
// @access  Private
router.post('/demo', async (req, res) => {
  try {
    const demoSessions = [];
    const tasks = ['Study Math', 'Read Book', 'Code Project', 'Exercise', 'Meditation'];
    const moods = ['focused', 'calm', 'energized', 'distracted', 'tired', 'stressed'];
    
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      demoSessions.push({
        user: req.user._id,
        task: tasks[Math.floor(Math.random() * tasks.length)],
        duration: Math.floor(Math.random() * 3600) + 600,
        mood: moods[Math.floor(Math.random() * moods.length)],
        date: date
      });
    }
    
    await Session.insertMany(demoSessions);
    res.json({ message: 'Demo data added successfully', count: demoSessions.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/sessions/clear
// @desc    Clear all sessions for user
// @access  Private
router.delete('/clear', async (req, res) => {
  try {
    const result = await Session.deleteMany({ user: req.user._id });
    res.json({ message: 'All sessions cleared', count: result.deletedCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
