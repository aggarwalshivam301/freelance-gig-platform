import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigAPI, bidAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const GigDetail = () => {
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    proposalText: '',
    bidAmount: '',
    deliveryTime: ''
  });
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const { user, isClient, isFreelancer, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGig();
    if (isClient) {
      fetchBids();
    }
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await gigAPI.getGig(id);
      setGig(response.data.gig);
    } catch (error) {
      toast.error('Error fetching gig');
      navigate('/gigs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await bidAPI.getGigBids(id);
      setBids(response.data.bids);
    } catch (error) {
      console.log('Cannot fetch bids (not authorized or none exist)');
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a bid');
      navigate('/login');
      return;
    }

    if (!isFreelancer) {
      toast.error('Only freelancers can submit bids');
      return;
    }

    try {
      await bidAPI.createBid({ ...bidData, gigId: id });
      toast.success('✅ Bid submitted successfully!');
      setShowBidForm(false);
      setBidData({ proposalText: '', bidAmount: '', deliveryTime: '' });
      navigate('/my-bids');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting bid');
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (window.confirm('Accept this bid? This will reject all other bids.')) {
      try {
        await bidAPI.acceptBid(bidId);
        toast.success('✅ Bid accepted!');
        fetchBids();
        fetchGig();
      } catch (error) {
        toast.error('Error accepting bid');
      }
    }
  };

  const handleRejectBid = async (bidId) => {
    if (window.confirm('Reject this bid?')) {
      try {
        await bidAPI.rejectBid(bidId);
        toast.success('Bid rejected');
        fetchBids();
      } catch (error) {
        toast.error('Error rejecting bid');
      }
    }
  };

  if (loading) return <div className="loading">🔄 Loading gig details...</div>;
  if (!gig) return <div className="empty-state">Gig not found</div>;

  const isOwner = user?._id === gig.clientId?._id;

  return (
    <div>
      <div className="card">
        <div className="gig-header">
          <div>
            <h1>{gig.title}</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Posted by <strong>{gig.clientId?.displayName}</strong>
            </p>
          </div>
          <span className={`badge badge-${gig.status}`} style={{ fontSize: '1rem' }}>
            {gig.status}
          </span>
        </div>

        <div className="gig-info">
          <p><strong>💰 Budget:</strong> ${gig.budget} ({gig.budgetType})</p>
          <p><strong>⏰ Deadline:</strong> {format(new Date(gig.deadline), 'MMMM dd, yyyy')}</p>
          <p><strong>📂 Category:</strong> {gig.category.replace('-', ' ')}</p>
          <p><strong>📊 Total Bids:</strong> {gig.bidsCount}</p>
        </div>

        <h3 style={{ marginTop: '2rem' }}>📝 Description</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', marginTop: '1rem' }}>
          {gig.description}
        </p>

        {gig.skills && gig.skills.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>🔧 Required Skills</h3>
            <div className="skills-list">
              {gig.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* BID BUTTON - VISIBLE FOR FREELANCERS */}
        {isFreelancer && gig.status === 'open' && !isOwner && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            {!showBidForm ? (
              <div className="text-center">
                <h3 style={{ marginBottom: '1rem' }}>💼 Interested in this project?</h3>
                <button 
                  onClick={() => setShowBidForm(true)} 
                  className="btn btn-success"
                  style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                >
                  📤 Submit Your Bid
                </button>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="bid-form">
                <h3>📤 Submit Your Bid</h3>
                
                <div className="form-group">
                  <label>Your Proposal *</label>
                  <textarea
                    value={bidData.proposalText}
                    onChange={(e) => setBidData({ ...bidData, proposalText: e.target.value })}
                    required
                    placeholder="Explain why you're the best fit for this project..."
                    rows="6"
                  />
                </div>

                <div className="form-group">
                  <label>Your Bid Amount ($) *</label>
                  <input
                    type="number"
                    value={bidData.bidAmount}
                    onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                    required
                    min="1"
                    placeholder="e.g., 450"
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Time (days) *</label>
                  <input
                    type="number"
                    value={bidData.deliveryTime}
                    onChange={(e) => setBidData({ ...bidData, deliveryTime: e.target.value })}
                    required
                    min="1"
                    placeholder="e.g., 14"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    ✅ Submit Bid
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBidForm(false)} 
                    className="btn btn-secondary"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* LOGIN PROMPT FOR GUESTS */}
        {!isAuthenticated && gig.status === 'open' && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
            <h3>🔐 Want to bid on this project?</h3>
            <p>Please login or register as a freelancer to submit your bid</p>
            <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={() => navigate('/login')} className="btn btn-primary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-success">
                Register
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BIDS SECTION - VISIBLE FOR GIG OWNER */}
      {isOwner && bids.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📊 Bids Received ({bids.length})</h2>
          {bids.map((bid) => (
            <div key={bid._id} className="card bid-item">
              <div className="bid-header">
                <div className="freelancer-info">
                  <h4>👤 {bid.freelancerId?.displayName}</h4>
                  <p>⭐ Rating: {bid.freelancerId?.rating || 'No rating yet'}</p>
                  <p>✅ Completed: {bid.freelancerId?.completedProjects || 0} projects</p>
                </div>
                <div className="bid-amount">
                  <h3>${bid.bidAmount}</h3>
                  <p>⏱️ {bid.deliveryTime} days</p>
                  <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                </div>
              </div>

              <div className="bid-proposal">
                <strong>Proposal:</strong>
                <p style={{ marginTop: '0.5rem' }}>{bid.proposalText}</p>
              </div>

              {bid.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAcceptBid(bid._id)} 
                    className="btn btn-success"
                  >
                    ✅ Accept Bid
                  </button>
                  <button 
                    onClick={() => handleRejectBid(bid._id)} 
                    className="btn btn-danger"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigDetail;
