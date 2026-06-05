import React from 'react';
import { formatPrice, formatDate } from '../../utils/helpers';
import './ProductModerationCard.css';

const ProductModerationCard = ({ product, onApprove, onReject }) => {
  const handleApprove = () => {
    if (window.confirm(`Approve product "${product.name}"?`)) {
      onApprove(product._id);
    }
  };

  const handleReject = () => {
    if (window.confirm(`Reject product "${product.name}"?`)) {
      onReject(product._id);
    }
  };

  return (
    <div className="product-moderation-card">
      <div className="product-moderation-header">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="product-moderation-image"
        />
        <div className="product-moderation-info">
          <div className="product-title-row">
            <h3 className="product-moderation-title">{product.name}</h3>
            <span className="badge badge-warning">Pending</span>
          </div>
          <div className="product-category">
            {product.category}
          </div>
          <div className="product-artisan-info">
            <span>👤</span>
            <span>
              <strong>{product.artisan?.shopName || product.artisan?.name}</strong>
            </span>
          </div>
          <div className="product-price-stock">
            <div className="price-info">
              <div className="price-label">Price</div>
              <div className="price-value">{formatPrice(product.price)}</div>
            </div>
            <div className="stock-info">
              <div className="stock-label">Stock</div>
              <div className="stock-value">{product.stock} units</div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-moderation-body">
        <div className="product-description-label">Product Description</div>
        <div className="product-moderation-description">
          {product.description}
        </div>
      </div>

      <div className="product-moderation-footer">
        <div className="product-meta">
          Listed on {formatDate(product.createdAt)}
        </div>
        <div className="product-moderation-actions">
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

export default ProductModerationCard;