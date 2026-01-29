import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigAPI } from '../services/api';
import { toast } from 'react-toastify';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-development',
    budget: '',
    budgetType: 'fixed',
    deadline: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const gigData = {
      ...formData,
      budget: Number(formData.budget),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
      await gigAPI.createGig(gigData);
      toast.success('✅ Gig created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating gig');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card">
        <h1>📝 Post a New Gig</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Fill in the details to get freelancers bidding on your project
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Gig Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Build a React E-commerce Website"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="8"
              placeholder="Describe your project in detail..."
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
              <option value="data-entry">Data Entry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Budget ($) *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 500"
              />
            </div>

            <div className="form-group">
              <label>Budget Type *</label>
              <select name="budgetType" value={formData.budgetType} onChange={handleChange}>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={today}
            />
          </div>

          <div className="form-group">
            <label>Required Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB"
            />
            <small style={{ color: '#666' }}>Separate skills with commas</small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '🔄 Creating...' : '✅ Post Gig'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
