import React, { useState } from 'react';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import './OrderCard.css';

const OrderCard = ({ order, onCancelOrder, onReorder }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      pending: 'Payment Pending',
      completed: 'Paid',
      failed: 'Payment Failed'
    };
    return statusMap[status] || status;
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await onCancelOrder(order._id);
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    setReordering(true);
    try {
      await onReorder(order);
    } finally {
      setReordering(false);
    }
  };

  const handleToggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-card-info">
          <div className="order-card-id">
            Order ID: <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="order-card-date">
            Placed on {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="order-card-status">
          <span className={`badge ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <span className={`badge ${order.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
            {getPaymentStatusText(order.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="order-items">
        {order.items?.map((item, index) => (
          <div key={index} className="order-item">
            <img
              src={item.product?.images?.[0] || '/placeholder.png'}
              alt={item.product?.name}
              className="order-item-image"
            />
            <div className="order-item-details">
              <div className="order-item-name">{item.product?.name}</div>
              <div className="order-item-artisan">
                By {item.artisan?.shopName || item.artisan?.name || 'Artisan'}
              </div>
              <div className="order-item-quantity">
                Quantity: {item.quantity}
              </div>
            </div>
            <div className="order-item-price">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible Details Section */}
      {showDetails && (
        <div className="order-details-expanded">
          {order.shippingAddress && (
            <div className="order-shipping-address">
              <div className="order-shipping-title">📍 Shipping Address</div>
              <div className="order-shipping-text">
                {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                Phone: {order.shippingAddress.phone}
              </div>
            </div>
          )}

          <div className="order-breakdown">
            <div className="order-breakdown-title">💰 Price Breakdown</div>
            <div className="order-breakdown-rows">
              {order.items?.map((item, index) => (
                <div key={index} className="order-breakdown-row">
                  <span className="order-breakdown-label">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="order-breakdown-value">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="order-breakdown-divider"></div>
              <div className="order-breakdown-row">
                <span className="order-breakdown-label">Subtotal</span>
                <span className="order-breakdown-value">
                  {formatPrice(order.subtotal || order.totalAmount)}
                </span>
              </div>
              {order.shipping !== undefined && (
                <div className="order-breakdown-row">
                  <span className="order-breakdown-label">Shipping</span>
                  <span className="order-breakdown-value">
                    {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                  </span>
                </div>
              )}
              {order.tax !== undefined && (
                <div className="order-breakdown-row">
                  <span className="order-breakdown-label">Tax (GST)</span>
                  <span className="order-breakdown-value">
                    {formatPrice(order.tax)}
                  </span>
                </div>
              )}
              <div className="order-breakdown-divider"></div>
              <div className="order-breakdown-row order-breakdown-total">
                <span className="order-breakdown-label">Total</span>
                <span className="order-breakdown-value">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="order-meta">
            <div className="order-meta-item">
              <span className="order-meta-label">Payment Method:</span>
              <span className="order-meta-value">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                 order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                 order.paymentMethod === 'upi' ? 'UPI' : 'N/A'}
              </span>
            </div>
            <div className="order-meta-item">
              <span className="order-meta-label">Order Date:</span>
              <span className="order-meta-value">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="order-card-footer">
        <div className="order-card-total">
          <span className="order-card-total-label">Total:</span>
          {formatPrice(order.totalAmount)}
        </div>

        <div className="order-card-actions">
          {order.status === 'pending' && (
            <button
              className="btn btn-danger btn-small"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          {order.status === 'delivered' && (
            <button
              className="btn btn-outline btn-small"
              onClick={handleReorder}
              disabled={reordering}
            >
              {reordering ? 'Adding to Cart...' : 'Reorder'}
            </button>
          )}
          <button
            className="btn btn-outline btn-small"
            onClick={handleToggleDetails}
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;