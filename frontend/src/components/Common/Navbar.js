import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isClient, isFreelancer, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          💼 FreelanceGigs
        </Link>
        
        <ul className="navbar-links">
          <li><Link to="/gigs">Browse Gigs</Link></li>
          
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          
          {isAuthenticated && (
            <>
              {isClient && (
                <li><Link to="/create-gig">Post Gig</Link></li>
              )}
              {isFreelancer && (
                <li><Link to="/my-bids">My Bids</Link></li>
              )}
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <span style={{ marginRight: '1rem', opacity: 0.9 }}>
                  👋 {user?.displayName}
                </span>
              </li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
