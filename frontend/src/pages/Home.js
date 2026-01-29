import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isClient } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>🚀 Welcome to FreelanceGigs</h1>
        <p>Connect talented freelancers with exciting projects</p>
        {!isAuthenticated ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-success">Get Started Free</Link>
            <Link to="/gigs" className="btn btn-secondary">Browse Gigs</Link>
          </div>
        ) : (
          <div>
            {isClient ? (
              <Link to="/create-gig" className="btn btn-success">Post a Gig</Link>
            ) : (
              <Link to="/gigs" className="btn btn-success">Find Gigs</Link>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>👔 For Clients</h2>
          <p>Post your project and receive bids from qualified freelancers</p>
          <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
            <li>✅ Post unlimited gigs</li>
            <li>✅ Review freelancer profiles & bids</li>
            <li>✅ Choose the best talent</li>
            <li>✅ Track project progress</li>
          </ul>
        </div>

        <div className="card">
          <h2>💻 For Freelancers</h2>
          <p>Find projects matching your skills and grow your business</p>
          <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
            <li>✅ Browse available gigs</li>
            <li>✅ Submit competitive bids</li>
            <li>✅ Showcase your expertise</li>
            <li>✅ Build your reputation</li>
          </ul>
        </div>
      </div>

      <div className="card text-center mt-4">
        <h2>📊 How It Works</h2>
        <div className="grid grid-3 mt-3" style={{ textAlign: 'left' }}>
          <div>
            <h3>1️⃣ Sign Up</h3>
            <p>Create your account as a client or freelancer</p>
          </div>
          <div>
            <h3>2️⃣ Post or Browse</h3>
            <p>Clients post gigs, freelancers browse opportunities</p>
          </div>
          <div>
            <h3>3️⃣ Submit Bids</h3>
            <p>Freelancers submit proposals with pricing</p>
          </div>
          <div>
            <h3>4️⃣ Accept Bid</h3>
            <p>Client reviews and accepts the best proposal</p>
          </div>
          <div>
            <h3>5️⃣ Get Started</h3>
            <p>Project begins and progress is tracked</p>
          </div>
          <div>
            <h3>6️⃣ Complete</h3>
            <p>Deliver work and get paid</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
