const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority } = req.body;
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
    if (priority) task.priority = priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks/demo
// @desc    Add demo tasks
// @access  Private
router.post('/demo', async (req, res) => {
  try {
    const demoTasks = [
      { title: 'Complete project documentation', description: 'Write comprehensive docs', priority: 'high', status: 'pending' },
      { title: 'Fix bug in login system', description: 'Users report login issues', priority: 'high', status: 'in-progress' },
      { title: 'Design new landing page', description: 'Create mockups in Figma', priority: 'medium', status: 'pending' },
      { title: 'Review pull requests', description: 'Check team submissions', priority: 'medium', status: 'pending' },
      { title: 'Update dependencies', description: 'npm audit fix', priority: 'low', status: 'pending' },
      { title: 'Write unit tests', description: 'Increase test coverage', priority: 'medium', status: 'in-progress' },
      { title: 'Refactor API endpoints', description: 'Clean up code', priority: 'low', status: 'pending' },
      { title: 'Deploy to production', description: 'Release v2.0', priority: 'high', status: 'completed' },
    ];
    
    const tasks = await Task.insertMany(
      demoTasks.map(task => ({ ...task, user: req.user._id }))
    );
    
    res.json({ message: 'Demo tasks added successfully', count: tasks.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/clear
// @desc    Clear all tasks for user
// @access  Private
router.delete('/clear', async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id });
    res.json({ message: 'All tasks cleared', count: result.deletedCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
