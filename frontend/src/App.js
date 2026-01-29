import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigList from './pages/GigList';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreateGig';
import Dashboard from './pages/Dashboard';
import MyBids from './pages/MyBids';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gigs" element={<GigList />} />
              <Route path="/gigs/:id" element={<GigDetail />} />
              
              <Route
                path="/create-gig"
                element={
                  <ProtectedRoute requireRole="client">
                    <CreateGig />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/my-bids"
                element={
                  <ProtectedRoute requireRole="freelancer">
                    <MyBids />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
