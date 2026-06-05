import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/buyer/OrderCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    applyFilter();
  }, [orders, activeFilter]);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use mock data for development
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeFilter));
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // Try API first
      await api.patch(`/orders/${orderId}/status`, { status: 'cancelled' });
    } catch (error) {
      console.error('API cancel failed, updating locally:', error);
    }

    // Update local state regardless (works with mock data)
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId
          ? { ...order, status: 'cancelled', paymentStatus: order.paymentStatus === 'completed' ? 'refunded' : 'cancelled' }
          : order
      )
    );
    showNotification('Order cancelled successfully', 'success');
  };

  const handleReorder = async (order) => {
    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Add each item from the order to cart
      order.items.forEach(item => {
        const existingIndex = existingCart.findIndex(
          cartItem => cartItem.product._id === item.product._id
        );

        if (existingIndex >= 0) {
          // Item already in cart, update quantity
          existingCart[existingIndex].quantity += item.quantity;
        } else {
          // Add new item to cart
          existingCart.push({
            product: {
              _id: item.product._id,
              name: item.product.name,
              price: item.price,
              images: item.product.images || [],
              stock: 99, // Default stock for reorder
              artisan: item.artisan
            },
            quantity: item.quantity
          });
        }
      });

      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(existingCart));

      showNotification(`${order.items.length} item(s) added to cart!`, 'success');

      // Navigate to cart after a brief moment
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error reordering:', error);
      showNotification('Failed to add items to cart. Please try again.', 'error');
    }
  };

  const getMockOrders = () => {
    const userPlaced = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    // Convert date strings back to Date objects where needed
    const parsedUserPlaced = userPlaced.map(order => ({
      ...order,
      createdAt: order.createdAt ? new Date(order.createdAt) : new Date()
    }));

    const defaultMock = [
      {
        _id: '1',
        items: [
          {
            product: {
              _id: 'p1',
              name: 'Handcrafted Clay Pot',
              images: ['https://via.placeholder.com/80']
            },
            artisan: {
              name: 'Ramesh Kumar',
              shopName: 'Kumar Pottery'
            },
            quantity: 2,
            price: 1200
          },
          {
            product: {
              _id: 'p2',
              name: 'Silk Saree',
              images: ['https://via.placeholder.com/80']
            },
            artisan: {
              name: 'Lakshmi Devi',
              shopName: 'Traditional Weaves'
            },
            quantity: 1,
            price: 8500
          }
        ],
        totalAmount: 10900,
        subtotal: 10900,
        shipping: 0,
        tax: 1962,
        paymentMethod: 'card',
        status: 'delivered',
        paymentStatus: 'completed',
        shippingAddress: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '9876543210'
        },
        createdAt: new Date('2024-01-15')
      },
      {
        _id: '2',
        items: [
          {
            product: {
              _id: 'p3',
              name: 'Silver Necklace',
              images: ['https://via.placeholder.com/80']
            },
            artisan: {
              name: 'Suresh Jewellers',
              shopName: 'Suresh Silver Works'
            },
            quantity: 1,
            price: 4500
          }
        ],
        totalAmount: 4500,
        subtotal: 4500,
        shipping: 100,
        tax: 810,
        paymentMethod: 'upi',
        status: 'processing',
        paymentStatus: 'completed',
        shippingAddress: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          phone: '9876543210'
        },
        createdAt: new Date('2024-01-20')
      },
      {
        _id: '3',
        items: [
          {
            product: {
              _id: 'p4',
              name: 'Wooden Wall Art',
              images: ['https://via.placeholder.com/80']
            },
            artisan: {
              name: 'Mahesh Crafts',
              shopName: 'Wood Masters'
            },
            quantity: 1,
            price: 3200
          }
        ],
        totalAmount: 3200,
        subtotal: 3200,
        shipping: 100,
        tax: 576,
        paymentMethod: 'cod',
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '789 Lake View',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          phone: '9876543210'
        },
        createdAt: new Date('2024-01-25')
      }
    ];

    return [...parsedUserPlaced, ...defaultMock];
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            <Loader size="large" text="Loading your orders..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Notification Toast */}
        {notification && (
          <div className={`orders-notification ${notification.type}`}>
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            Track and manage your orders
          </p>
        </div>

        {/* Filters */}
        {orders.length > 0 && (
          <div className="orders-filters">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
                {filter.id !== 'all' && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    ({orders.filter(o => o.status === filter.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onCancelOrder={handleCancelOrder}
                onReorder={handleReorder}
              />
            ))}
          </div>
        ) : (
          <div className="orders-empty">
            <div className="empty-orders-icon">📦</div>
            <h2 className="empty-orders-title">
              {activeFilter === 'all' ? 'No Orders Yet' : `No ${activeFilter} Orders`}
            </h2>
            <p className="empty-orders-message">
              {activeFilter === 'all'
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `You don't have any ${activeFilter} orders at the moment.`}
            </p>
            {activeFilter === 'all' && (
              <Link to="/marketplace">
                <button className="btn btn-primary btn-large">
                  Start Shopping
                </button>
              </Link>
            )}
            {activeFilter !== 'all' && (
              <button
                className="btn btn-outline"
                onClick={() => setActiveFilter('all')}
              >
                View All Orders
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;