import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (user && !user.isPremium) {
      loadSessionCount();
      // Refresh every 30 seconds
      const interval = setInterval(loadSessionCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadSessionCount = async () => {
    try {
      const res = await axios.get('/api/sessions/stats');
      setSessionCount(res.data.todaySessionCount || 0);
    } catch (error) {
      console.error('Error loading session count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">
          <Link to="/timer">
            <span className="logo-focus">Focus</span>
            <span className="logo-pulse">Pulse</span>
          </Link>
        </h1>
        <ul className="nav-links">
          <li>
            <Link to="/timer" className={location.pathname === '/timer' ? 'active' : ''}>
              Timer
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''}>
              Tasks
            </Link>
          </li>
        </ul>
        <div className="nav-right-container">
          <div className="nav-right">
            {user && !user.isPremium && (
              <>
                <span className={`session-limit-badge ${sessionCount >= 5 ? 'limit-reached' : ''}`}>
                  {sessionCount >= 5 ? '0 sessions left' : `${5 - sessionCount} session${5 - sessionCount === 1 ? '' : 's'} left`}
                </span>
                <button 
                  onClick={() => navigate('/payment')} 
                  className="btn-upgrade"
                >
                  Upgrade to Premium
                </button>
              </>
            )}
            {user && user.isPremium && (
              <span className="unlimited-badge">
                ∞ Unlimited
              </span>
            )}
          </div>
          <div className="nav-user">
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
