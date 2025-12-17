import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Timer.css';

const Timer = () => {
  const [task, setTask] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [todayTime, setTodayTime] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [user, setUser] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadTodayStats();
    loadTasks();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const loadTodayStats = async () => {
    try {
      const res = await axios.get('/api/sessions/stats');
      const today = res.data.last7Days[res.data.last7Days.length - 1];
      setTodayTime(today?.duration || 0);
      setTodaySessionCount(res.data.todaySessionCount || 0);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      // Filter to show only pending and in-progress tasks
      const activeTasks = res.data.filter(t => t.status === 'pending' || t.status === 'in-progress');
      setTasks(activeTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleTaskSelect = (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    if (taskId) {
      const selectedTask = tasks.find(t => t._id === taskId);
      setTask(selectedTask?.title || '');
    } else {
      setTask('');
    }
  };

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const sec = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleTimerClick = () => {
    if (!task.trim() && !isRunning) {
      alert('Please enter what you\'re working on!');
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleStopSession = () => {
    if (seconds < 60) {
      if (window.confirm('Session less than 1 minute. Discard?')) {
        resetTimer();
      }
      return;
    }
    setIsRunning(false);
    setShowMoodModal(true);
  };

  const handleMoodSelect = async (mood) => {
    try {
      await axios.post('/api/sessions', {
        task,
        duration: seconds,
        mood
      });
      setShowMoodModal(false);
      
      // If a task was selected from the list, ask to mark as completed
      if (selectedTaskId) {
        const shouldComplete = window.confirm(
          `Great work! Would you like to mark "${task}" as completed?`
        );
        
        if (shouldComplete) {
          try {
            await axios.put(`/api/tasks/${selectedTaskId}`, {
              status: 'completed'
            });
            alert('Task marked as completed! 🎉');
            loadTasks(); // Refresh task list
          } catch (error) {
            console.error('Error updating task:', error);
            alert('Session saved, but failed to update task status');
          }
        }
      } else {
        alert('Session saved successfully!');
      }
      
      resetTimer();
      loadTodayStats();
    } catch (error) {
      console.error('Error saving session:', error);
      if (error.response?.data?.limitReached) {
        alert(error.response.data.message);
      } else {
        alert('Failed to save session');
      }
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setTask('');
    setSelectedTaskId('');
    setIsRunning(false);
  };

  const progress = seconds > 0 ? (seconds % 3600) / 3600 * 100 : 0;

  return (
    <div>
      <Navbar />
      <main className="timer-page">
        <div className="timer-content-wrapper">
          <div className="timer-main">
            <div className="input-group">
              <label htmlFor="task-input">What are you working on?</label>
              <input
                type="text"
                id="task-input"
                placeholder="Type a task or select from the list →"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  setSelectedTaskId('');
                }}
                disabled={isRunning}
                maxLength="70"
              />
            </div>

            <div className="timer-display" onClick={handleTimerClick}>
              <svg className="timer-circle" width="420" height="420">
                <circle className="timer-circle-bg" cx="210" cy="210" r="180"></circle>
                <circle 
                  className="timer-circle-progress" 
                  cx="210" cy="210" r="180"
                  style={{
                    strokeDashoffset: 1130 - (1130 * progress) / 100
                  }}
                ></circle>
              </svg>
              <div className="timer-text">
                <span id="timer">{formatTime(seconds)}</span>
              </div>
            </div>

            <div className="session-info">
              <p id="session-status">
                {!isRunning && seconds === 0 && 'Tap the timer to start'}
                {isRunning && `Focusing on: ${task}`}
                {!isRunning && seconds > 0 && 'Paused - Tap to continue'}
              </p>
              {seconds > 0 && (
                <button onClick={handleStopSession} className="stop-btn">
                  End Session
                </button>
              )}
            </div>
          </div>

          <div className="tasks-sidebar">
            <h3>📋 Pending Tasks</h3>
            {tasks.length > 0 ? (
              <div className="pending-tasks-list">
                {tasks.map(t => (
                  <div
                    key={t._id}
                    className={`pending-task-item ${selectedTaskId === t._id ? 'selected' : ''}`}
                    onClick={() => {
                      if (!isRunning) {
                        setSelectedTaskId(t._id);
                        setTask(t.title);
                      }
                    }}
                  >
                    <div className="pending-task-title">{t.title}</div>
                    <div className="pending-task-meta">
                      <span className={`priority-badge priority-${t.priority}`}>
                        {t.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>
                No pending tasks. Create tasks from the Tasks page.
              </p>
            )}
          </div>
        </div>

        {showMoodModal && (
          <div className="modal active">
            <div className="modal-content">
              <h2>How did you feel during this session?</h2>
              <p className="modal-subtitle">Your mood helps us understand your productivity patterns</p>
              
              <div className="mood-options">
                {[
                  { mood: 'focused', icon: '🎯', label: 'Focused' },
                  { mood: 'calm', icon: '😌', label: 'Calm' },
                  { mood: 'energized', icon: '⚡', label: 'Energized' },
                  { mood: 'distracted', icon: '😵', label: 'Distracted' },
                  { mood: 'tired', icon: '😴', label: 'Tired' },
                  { mood: 'stressed', icon: '😰', label: 'Stressed' }
                ].map(({ mood, icon, label }) => (
                  <button
                    key={mood}
                    className="mood-btn"
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <span className="mood-icon">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Timer;
