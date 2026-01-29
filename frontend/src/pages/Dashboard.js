import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigAPI, bidAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Dashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isClient, isFreelancer, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (isClient) {
        const response = await gigAPI.getMyGigs();
        setGigs(response.data.gigs);
      } else if (isFreelancer) {
        const response = await bidAPI.getMyBids();
        setBids(response.data.bids);
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">🔄 Loading your dashboard...</div>;

  return (
    <div>
      <h1>📊 Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Welcome back, <strong>{user?.displayName}</strong>! 👋
      </p>

      {isClient && (
        <div>
          <div className="dashboard-header">
            <h2>📋 My Posted Gigs ({gigs.length})</h2>
            <Link to="/create-gig" className="btn btn-success">
              ➕ Post New Gig
            </Link>
          </div>

          {gigs.length === 0 ? (
            <div className="empty-state">
              <h3>No gigs posted yet</h3>
              <p>Start by posting your first gig!</p>
              <Link to="/create-gig" className="btn btn-primary">Post a Gig</Link>
            </div>
          ) : (
            <div className="grid grid-2">
              {gigs.map((gig) => (
                <div key={gig._id} className="card">
                  <div className="flex-between">
                    <h3>{gig.title}</h3>
                    <span className={`badge badge-${gig.status}`}>{gig.status}</span>
                  </div>
                  <p style={{ margin: '1rem 0', color: '#666' }}>
                    {gig.description.substring(0, 100)}...
                  </p>
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Budget:</strong> ${gig.budget}</p>
                    <p><strong>Bids:</strong> {gig.bidsCount}</p>
                    <p><strong>Deadline:</strong> {format(new Date(gig.deadline), 'MMM dd, yyyy')}</p>
                  </div>
                  <Link to={`/gigs/${gig._id}`} className="btn btn-primary mt-2">
                    View Details & Bids
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isFreelancer && (
        <div>
          <h2>📤 My Submitted Bids ({bids.length})</h2>

          {bids.length === 0 ? (
            <div className="empty-state">
              <h3>No bids submitted yet</h3>
              <p>Browse gigs and submit your first bid!</p>
              <Link to="/gigs" className="btn btn-primary">Browse Gigs</Link>
            </div>
          ) : (
            <div>
              {bids.map((bid) => (
                <div key={bid._id} className="card">
                  <div className="bid-header">
                    <div>
                      <h3>{bid.gigId?.title}</h3>
                      <p>Client: {bid.clientId?.displayName}</p>
                      <p>Gig Budget: ${bid.gigId?.budget}</p>
                    </div>
                    <div className="bid-amount">
                      <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                      <h3 className="mt-1">${bid.bidAmount}</h3>
                      <p>{bid.deliveryTime} days</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <strong>My Proposal:</strong>
                    <p style={{ marginTop: '0.5rem' }}>{bid.proposalText}</p>
                  </div>
                  <Link to={`/gigs/${bid.gigId?._id}`} className="btn btn-secondary mt-2">
                    View Gig
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
