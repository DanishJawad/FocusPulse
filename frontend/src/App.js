import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Timer from './pages/Timer';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import PaymentSuccess from './pages/PaymentSuccess';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/timer" element={
            <PrivateRoute>
              <Timer />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/tasks" element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          } />
          
          <Route path="/payment-success" element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/timer" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
