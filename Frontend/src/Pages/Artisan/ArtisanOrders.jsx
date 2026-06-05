import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderManagement from '../../components/artisan/OrderManagement';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './ArtisanOrders.css';

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/artisan-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use mock data for development
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Mock update for development
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated! (Demo Mode)');
    }
  };

  const getMockOrders = () => {
    return [
      {
        _id: '1',
        items: [
          {
            product: {
              _id: 'p1',
              name: 'Handcrafted Clay Pot',
              images: ['https://via.placeholder.com/80']
            },
            quantity: 2,
            price: 1200
          }
        ],
        totalAmount: 2400,
        status: 'processing',
        buyer: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date('2024-01-20')
      },
      {
        _id: '2',
        items: [
          {
            product: {
              _id: 'p2',
              name: 'Decorative Wall Hanging',
              images: ['https://via.placeholder.com/80']
            },
            quantity: 1,
            price: 850
          }
        ],
        totalAmount: 850,
        status: 'pending',
        buyer: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        createdAt: new Date('2024-01-22')
      },
      {
        _id: '3',
        items: [
          {
            product: {
              _id: 'p1',
              name: 'Handcrafted Clay Pot',
              images: ['https://via.placeholder.com/80']
            },
            quantity: 3,
            price: 1200
          }
        ],
        totalAmount: 3600,
        status: 'shipped',
        buyer: {
          name: 'Bob Johnson',
          email: 'bob@example.com'
        },
        createdAt: new Date('2024-01-18')
      },
      {
        _id: '4',
        items: [
          {
            product: {
              _id: 'p2',
              name: 'Decorative Wall Hanging',
              images: ['https://via.placeholder.com/80']
            },
            quantity: 2,
            price: 850
          }
        ],
        totalAmount: 1700,
        status: 'delivered',
        buyer: {
          name: 'Alice Brown',
          email: 'alice@example.com'
        },
        createdAt: new Date('2024-01-15')
      }
    ];
  };

  if (loading) {
    return (
      <div className="artisan-orders-page">
        <div className="artisan-orders-container">
          <div className="artisan-orders-loading">
            <Loader size="large" text="Loading orders..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-orders-page">
      <div className="artisan-orders-container">
        <Link to="/artisan/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="artisan-orders-header">
          <h1 className="artisan-orders-title">Manage Orders</h1>
          <p className="artisan-orders-subtitle">
            Track and update your product orders
          </p>
        </div>

        <div className="artisan-orders-content">
          <OrderManagement
            orders={orders}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtisanOrders;