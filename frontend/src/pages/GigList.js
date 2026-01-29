import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const fetchGigs = async () => {
    try {
      const response = await gigAPI.getAllGigs(filters);
      setGigs(response.data.gigs);
    } catch (error) {
      toast.error('Error fetching gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">🔄 Loading gigs...</div>;
  }

  return (
    <div>
      <h1>📋 Browse Available Gigs</h1>

      <div className="card filter-bar">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <input
            type="text"
            name="search"
            placeholder="🔍 Search gigs by title or description..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
            <option value="data-entry">Data Entry</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {gigs.length === 0 ? (
        <div className="empty-state">
          <h3>😕 No gigs found</h3>
          <p>Try adjusting your filters or check back later</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Found {gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'}
          </p>
          <div className="grid grid-2">
            {gigs.map((gig) => (
              <Link 
                to={`/gigs/${gig._id}`} 
                key={gig._id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card gig-card">
                  <div className="gig-header">
                    <h3>{gig.title}</h3>
                    <span className={`badge badge-${gig.status}`}>
                      {gig.status}
                    </span>
                  </div>

                  <p style={{ margin: '1rem 0', color: '#666', lineHeight: '1.6' }}>
                    {gig.description.substring(0, 150)}
                    {gig.description.length > 150 ? '...' : ''}
                  </p>

                  <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                        ${gig.budget}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#777' }}>
                        {gig.budgetType === 'fixed' ? 'Fixed Price' : 'Per Hour'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: '#667eea', fontWeight: '600' }}>
                        📊 {gig.bidsCount} bids
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#777', marginTop: '0.25rem' }}>
                        ⏰ {format(new Date(gig.deadline), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e1e8ed' }}>
                    <div style={{ fontSize: '0.875rem', color: '#777' }}>
                      Posted by: <strong>{gig.clientId?.displayName || 'Unknown'}</strong>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GigList;
