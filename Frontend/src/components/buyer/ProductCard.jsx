import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= 5) return `Only ${product.stock} left`;
    return `${product.stock} in stock`;
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card-image-container">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-card-image"
          />
        ) : (
          <div className="product-card-placeholder"></div>
        )}
        {isOutOfStock && (
          <div className="product-card-badge out-of-stock">Out of Stock</div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        
        <h3 className="product-card-title">{product.name}</h3>
        
        <div className="product-card-artisan">
          <span className="product-card-artisan-icon">👤</span>
          <span>{product.artisan?.shopName || product.artisan?.name || 'Artisan'}</span>
        </div>

        <div className="product-card-footer">
          <div className="product-card-price">
            {formatPrice(product.price)}
          </div>
          <div className={`product-card-stock ${isLowStock ? 'low' : ''}`}>
            {getStockStatus()}
          </div>
        </div>

        <button
          className="product-card-add-btn"
          onClick={handleAddToCartClick}
          disabled={isOutOfStock}
          type="button"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;