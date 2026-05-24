import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        axios.get('/api/sessions/stats'),
        axios.get('/api/sessions')
      ]);
      setStats(statsRes.data);
      setSessions(sessionsRes.data.slice(0, 10));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      const res = await axios.post('/api/payment/create-checkout-session');
      window.location.href = res.data.url;
    } catch (error) {
      alert('Failed to initiate payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddDemoData = async () => {
    if (!window.confirm('Add 20 demo focus sessions to your dashboard?')) return;
    try {
      await axios.post('/api/sessions/demo');
      alert('Demo data added successfully!');
      loadData();
    } catch (error) {
      alert('Failed to add demo data');
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL your sessions? This cannot be undone!')) return;
    try {
      await axios.delete('/api/sessions/clear');
      alert('All sessions cleared successfully!');
      loadData();
    } catch (error) {
      alert('Failed to clear data');
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const dailyChartData = {
    labels: stats?.last7Days?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: stats?.last7Days?.map(d => d.duration) || [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const moodChartData = {
    labels: Object.keys(stats?.moodDistribution || {}),
    datasets: [
      {
        data: Object.values(stats?.moodDistribution || {}),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
        ],
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2 className="page-title">
              Welcome back, {user?.name}!
              {user?.isPremium && <span className="premium-badge-dash">⭐ Premium</span>}
            </h2>
            {!user?.isPremium && (
              <button onClick={handleUpgradeToPremium} className="btn-premium">
                ⭐ Upgrade to Premium - $9.99
              </button>
            )}
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <h3>Total Focus Time</h3>
              <p className="summary-value">{formatTime(stats?.totalDuration || 0)}</p>
              <p className="summary-label">All time</p>
            </div>
            <div className="summary-card">
              <h3>Total Sessions</h3>
              <p className="summary-value">{stats?.totalSessions || 0}</p>
              <p className="summary-label">Completed</p>
            </div>
            <div className="summary-card">
              <h3>Average Session</h3>
              <p className="summary-value">{formatTime(stats?.avgDuration || 0)}</p>
              <p className="summary-label">Duration</p>
            </div>
            <div className="summary-card">
              <h3>Last 7 Days</h3>
              <p className="summary-value">
                {stats?.last7Days?.reduce((sum, d) => sum + d.duration, 0) || 0}m
              </p>
              <p className="summary-label">Total focus</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Daily Focus (Last 7 Days)</h3>
              <Line data={dailyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
            <div className="chart-card">
              <h3>Mood Distribution</h3>
              {Object.keys(stats?.moodDistribution || {}).length > 0 ? (
                <Doughnut data={moodChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              ) : (
                <p className="no-data">No mood data yet</p>
              )}
            </div>
          </div>

          <div className="recent-sessions">
            <h3>Recent Sessions</h3>
            {sessions.length > 0 ? (
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session._id} className="session-item">
                    <div className="session-info">
                      <h4>{session.task}</h4>
                      <span className="session-date">{formatDate(session.date)}</span>
                    </div>
                    <div className="session-meta">
                      <span className="session-duration">{formatTime(session.duration)}</span>
                      <span className={`session-mood mood-${session.mood}`}>{session.mood}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No sessions yet. Start your first focus session!</p>
            )}
          </div>

          <div className="dashboard-bottom-actions">
            <button onClick={handleAddDemoData} className="btn-demo">Add Demo Data</button>
            <button onClick={handleClearData} className="btn-clear">Clear All</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
