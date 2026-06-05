import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductModerationCard from '../../components/admin/ProductModerationCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './ProductModeration.css';

const ProductModeration = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products/pending');
      setPendingProducts(response.data);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      // Use mock data for development
      setPendingProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = () => {
    return [
      {
        _id: '1',
        name: 'Handcrafted Clay Pot',
        description: 'Beautiful traditional clay pot made with love and care using ancient techniques. Perfect for home decor or as a planter.',
        price: 1200,
        category: 'Pottery & Ceramics',
        images: ['https://via.placeholder.com/300'],
        stock: 15,
        artisan: {
          _id: 'a1',
          name: 'Ramesh Kumar',
          shopName: 'Kumar Pottery'
        },
        isApproved: false,
        createdAt: new Date('2024-01-22')
      },
      {
        _id: '2',
        name: 'Silk Handloom Saree',
        description: 'Pure silk saree handwoven with traditional patterns. Each saree takes 2-3 weeks to complete.',
        price: 8500,
        category: 'Textiles & Fabrics',
        images: ['https://via.placeholder.com/300'],
        stock: 5,
        artisan: {
          _id: 'a2',
          name: 'Lakshmi Devi',
          shopName: 'Traditional Weaves'
        },
        isApproved: false,
        createdAt: new Date('2024-01-23')
      },
      {
        _id: '3',
        name: 'Silver Temple Necklace',
        description: 'Exquisite handmade silver necklace with intricate temple designs. Pure 925 silver.',
        price: 4500,
        category: 'Jewelry',
        images: ['https://via.placeholder.com/300'],
        stock: 8,
        artisan: {
          _id: 'a3',
          name: 'Suresh Jewellers',
          shopName: 'Suresh Silver Works'
        },
        isApproved: false,
        createdAt: new Date('2024-01-25')
      }
    ];
  };

  const handleApprove = async (productId) => {
    try {
      await api.patch(`/admin/products/${productId}/approve`);
      setPendingProducts(pendingProducts.filter(p => p._id !== productId));
      alert('Product approved successfully!');
    } catch (error) {
      console.error('Error approving product:', error);
      // Mock approval for development
      setPendingProducts(pendingProducts.filter(p => p._id !== productId));
      alert('Product approved! (Demo Mode)');
    }
  };

  const handleReject = async (productId) => {
    try {
      await api.delete(`/admin/products/${productId}/reject`);
      setPendingProducts(pendingProducts.filter(p => p._id !== productId));
      alert('Product rejected');
    } catch (error) {
      console.error('Error rejecting product:', error);
      // Mock rejection for development
      setPendingProducts(pendingProducts.filter(p => p._id !== productId));
      alert('Product rejected (Demo Mode)');
    }
  };

  if (loading) {
    return (
      <div className="product-moderation-page">
        <div className="product-moderation-container">
          <div className="product-moderation-loading">
            <Loader size="large" text="Loading pending products..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-moderation-page">
      <div className="product-moderation-container">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="product-moderation-header">
          <h1 className="product-moderation-title">Product Moderation</h1>
          <p className="product-moderation-subtitle">
            Review and approve product listings
          </p>
        </div>

        <div className="product-moderation-content">
          {pendingProducts.length > 0 ? (
            pendingProducts.map(product => (
              <ProductModerationCard
                key={product._id}
                product={product}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="product-moderation-empty">
              <div className="empty-moderation-icon">✅</div>
              <h2 className="empty-moderation-title">All Caught Up!</h2>
              <p className="empty-moderation-message">
                There are no pending products to review at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModeration;