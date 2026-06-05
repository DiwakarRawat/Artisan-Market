import React from 'react';
import { formatPrice } from '../../utils/helpers';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    if (item.quantity < item.product.stock) {
      onUpdateQuantity(item.product._id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.product._id);
  };

  const subtotal = item.product.price * item.quantity;
  const isMaxQuantity = item.quantity >= item.product.stock;

  return (
    <div className="cart-item">
      <div className="cart-item-image-container">
        {item.product.images && item.product.images.length > 0 ? (
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="cart-item-image"
          />
        ) : (
          <div className="product-card-placeholder"></div>
        )}
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <h3 className="cart-item-title">{item.product.name}</h3>
          <button className="cart-item-remove" onClick={handleRemove} aria-label="Remove item">
            ×
          </button>
        </div>

        <div className="cart-item-artisan">
          By {item.product.artisan?.shopName || item.product.artisan?.name || 'Artisan'}
        </div>

        <div className="cart-item-price">
          {formatPrice(item.product.price)} each
        </div>

        <div className="cart-item-footer">
          <div>
            <div className="quantity-control">
              <button
                className="quantity-btn"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={handleIncrease}
                disabled={isMaxQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {isMaxQuantity && (
              <div className="cart-item-stock-warning">
                Maximum available quantity
              </div>
            )}
          </div>

          <div className="cart-item-subtotal">
            Subtotal: {formatPrice(subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;