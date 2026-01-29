import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bidAPI } from '../services/api';
import { toast } from 'react-toastify';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await bidAPI.getMyBids();
      setBids(response.data.bids);
    } catch (error) {
      toast.error('Error fetching bids');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">🔄 Loading your bids...</div>;

  return (
    <div>
      <h1>📤 My Submitted Bids</h1>

      {bids.length === 0 ? (
        <div className="empty-state">
          <h3>No bids submitted yet</h3>
          <p>Start bidding on gigs to see them here</p>
          <Link to="/gigs" className="btn btn-primary">Browse Gigs</Link>
        </div>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Total bids: {bids.length}
          </p>
          <div>
            {bids.map((bid) => (
              <div key={bid._id} className="card">
                <div className="bid-header">
                  <div>
                    <h3>{bid.gigId?.title}</h3>
                    <p>Client: <strong>{bid.clientId?.displayName}</strong></p>
                    <p>Gig Budget: ${bid.gigId?.budget} ({bid.gigId?.budgetType})</p>
                    <p>Gig Status: <span className={`badge badge-${bid.gigId?.status}`}>{bid.gigId?.status}</span></p>
                  </div>
                  <div className="bid-amount">
                    <span className={`badge badge-${bid.status}`} style={{ fontSize: '1rem' }}>
                      {bid.status}
                    </span>
                    <h3 className="mt-1" style={{ color: '#27ae60' }}>${bid.bidAmount}</h3>
                    <p>⏱️ {bid.deliveryTime} days delivery</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <strong>📝 My Proposal:</strong>
                  <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{bid.proposalText}</p>
                </div>
                
                <Link to={`/gigs/${bid.gigId?._id}`} className="btn btn-primary mt-2">
                  View Gig Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBids;
