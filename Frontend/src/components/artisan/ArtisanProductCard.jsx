import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import './ArtisanProductCard.css';

const ArtisanProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/artisan/edit-product/${product._id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return <span className="artisan-product-stock out">Out of Stock</span>;
    } else if (product.stock <= 5) {
      return <span className="artisan-product-stock low">Low Stock: {product.stock} units</span>;
    } else {
      return <span className="artisan-product-stock">In Stock: {product.stock} units</span>;
    }
  };

  return (
    <div className="artisan-product-card">
      <div className="artisan-product-header">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/120'}
          alt={product.name}
          className="artisan-product-image"
        />
        <div className="artisan-product-info">
          <div className="artisan-product-title-row">
            <h3 className="artisan-product-title">{product.name}</h3>
          </div>
          <div className="artisan-product-category">{product.category}</div>
          <div className="artisan-product-price">{formatPrice(product.price)}</div>
          {getStockStatus()}
        </div>
      </div>

      <div className="artisan-product-footer">
        <div className="artisan-product-status">
          {product.isApproved ? (
            <span className="badge badge-success">Approved</span>
          ) : (
            <span className="badge badge-warning">Pending Approval</span>
          )}
        </div>
        <div className="artisan-product-actions">
          <button
            className="icon-button edit"
            onClick={handleEdit}
            title="Edit Product"
          >
            ✏️
          </button>
          <button
            className="icon-button delete"
            onClick={handleDelete}
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProductCard;