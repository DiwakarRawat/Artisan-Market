import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArtisanApprovalCard from '../../components/admin/ArtisanApprovalCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './ArtisanApprovals.css';

const ArtisanApprovals = () => {
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingArtisans();
  }, []);

  const fetchPendingArtisans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/artisans/pending');
      setPendingArtisans(response.data);
    } catch (error) {
      console.error('Error fetching pending artisans:', error);
      // Use mock data for development
      setPendingArtisans(getMockArtisans());
    } finally {
      setLoading(false);
    }
  };

  const getMockArtisans = () => {
    return [
      {
        _id: '1',
        name: 'Ramesh Kumar',
        email: 'ramesh@example.com',
        shopName: 'Kumar Pottery',
        description: 'I specialize in traditional clay pottery with over 20 years of experience. My products are handmade using techniques passed down through generations.',
        phone: '9876543210',
        role: 'artisan',
        isApproved: false,
        createdAt: new Date('2024-01-20')
      },
      {
        _id: '2',
        name: 'Lakshmi Devi',
        email: 'lakshmi@example.com',
        shopName: 'Traditional Weaves',
        description: 'Expert in handloom weaving, creating beautiful sarees and fabrics using traditional methods.',
        phone: '9876543211',
        role: 'artisan',
        isApproved: false,
        createdAt: new Date('2024-01-22')
      },
      {
        _id: '3',
        name: 'Suresh Jewellers',
        email: 'suresh@example.com',
        shopName: 'Suresh Silver Works',
        description: 'Crafting exquisite silver jewelry with intricate designs. Each piece is unique and handmade.',
        phone: '9876543212',
        role: 'artisan',
        isApproved: false,
        createdAt: new Date('2024-01-25')
      }
    ];
  };

  const handleApprove = async (artisanId) => {
    try {
      await api.patch(`/admin/artisans/${artisanId}/approve`);
      setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
      alert('Artisan approved successfully!');
    } catch (error) {
      console.error('Error approving artisan:', error);
      // Mock approval for development
      setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
      alert('Artisan approved! (Demo Mode)');
    }
  };

  const handleReject = async (artisanId) => {
    try {
      await api.delete(`/admin/artisans/${artisanId}/reject`);
      setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
      alert('Artisan application rejected');
    } catch (error) {
      console.error('Error rejecting artisan:', error);
      // Mock rejection for development
      setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
      alert('Artisan rejected (Demo Mode)');
    }
  };

  if (loading) {
    return (
      <div className="artisan-approvals-page">
        <div className="artisan-approvals-container">
          <div className="artisan-approvals-loading">
            <Loader size="large" text="Loading pending artisans..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-approvals-page">
      <div className="artisan-approvals-container">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="artisan-approvals-header">
          <h1 className="artisan-approvals-title">Artisan Approvals</h1>
          <p className="artisan-approvals-subtitle">
            Review and approve artisan applications
          </p>
        </div>

        <div className="artisan-approvals-content">
          {pendingArtisans.length > 0 ? (
            pendingArtisans.map(artisan => (
              <ArtisanApprovalCard
                key={artisan._id}
                artisan={artisan}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="artisan-approvals-empty">
              <div className="empty-approvals-icon">✅</div>
              <h2 className="empty-approvals-title">All Caught Up!</h2>
              <p className="empty-approvals-message">
                There are no pending artisan applications at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanApprovals;