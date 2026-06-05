import React from 'react';
import { formatDate } from '../../utils/helpers';
import './ArtisanApprovalCard.css';

const ArtisanApprovalCard = ({ artisan, onApprove, onReject }) => {
  const handleApprove = () => {
    if (window.confirm(`Approve ${artisan.name} as an artisan?`)) {
      onApprove(artisan._id);
    }
  };

  const handleReject = () => {
    if (window.confirm(`Reject ${artisan.name}'s artisan application?`)) {
      onReject(artisan._id);
    }
  };

  return (
    <div className="artisan-approval-card">
      <div className="artisan-approval-header">
        <div className="artisan-avatar">
          {artisan.name?.charAt(0).toUpperCase()}
        </div>
        <div className="artisan-info">
          <div className="artisan-name-row">
            <div>
              <h3 className="artisan-name">{artisan.name}</h3>
              <div className="artisan-shop-name">
                {artisan.shopName}
              </div>
            </div>
            <span className="badge badge-warning">Pending</span>
          </div>
          <div className="artisan-contact">
            <div className="contact-item">
              <span>📧</span>
              <span>{artisan.email}</span>
            </div>
            <div className="contact-item">
              <span>📱</span>
              <span>{artisan.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="artisan-approval-body">
        <div className="artisan-description-label">Shop Description</div>
        <div className="artisan-description">
          {artisan.description || 'No description provided'}
        </div>
      </div>

      <div className="artisan-approval-footer">
        <div className="artisan-meta">
          Registered on {formatDate(artisan.createdAt)}
        </div>
        <div className="artisan-approval-actions">
          <button
            className="btn btn-danger btn-small"
            onClick={handleReject}
          >
            ✕ Reject
          </button>
          <button
            className="btn btn-success btn-small"
            onClick={handleApprove}
          >
            ✓ Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanApprovalCard;