import React, { useState } from 'react';
import { formatPrice, formatDate } from '../../utils/helpers';
import './OrderManagement.css';

const OrderManagement = ({ orders, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  const getOrderCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(orderId, newStatus);
    }
  };

  return (
    <div className="order-management">
      {/* Tabs */}
      <div className="orders-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`order-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="order-tab-count">{getOrderCount(tab.id)}</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => (
          <div key={order._id} className="artisan-order-card">
            <div className="artisan-order-header">
              <div>
                <div className="artisan-order-id">
                  Order ID: <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
                </div>
                <div className="artisan-order-date">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="artisan-order-items">
              {order.items?.map((item, index) => (
                <div key={index} className="artisan-order-item">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="artisan-order-item-image"
                  />
                  <div className="artisan-order-item-details">
                    <div className="artisan-order-item-name">{item.product?.name}</div>
                    <div className="artisan-order-item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  <div className="artisan-order-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="artisan-order-footer">
              <div className="artisan-order-total">
                Total: {formatPrice(order.totalAmount)}
              </div>
              <div className="artisan-order-actions">
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <select
                    className="status-update-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
                <button className="btn btn-outline btn-small">View Details</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="orders-empty">
          <div className="empty-orders-icon">📦</div>
          <p className="empty-orders-text">
            No {activeTab !== 'all' ? activeTab : ''} orders found
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;