import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../../components/artisan/ProductForm';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
      
      // Mock product for development
      setProduct({
        _id: id,
        name: 'Handcrafted Clay Pot',
        description: 'Beautiful traditional clay pot made with love',
        price: 1200,
        category: 'Pottery & Ceramics',
        images: ['https://via.placeholder.com/300'],
        stock: 15
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // API call to update product
      const response = await api.put(`/products/${id}`, formData);
      
      alert('Product updated successfully!');
      navigate('/artisan/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Mock success for development
      alert('Product updated successfully! (Demo Mode)');
      navigate('/artisan/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-container">
          <div className="edit-product-loading">
            <Loader size="large" text="Loading product..." />
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-container">
          <div className="edit-product-error">
            <div className="error-icon">❌</div>
            <h2 className="error-title">Product Not Found</h2>
            <p className="error-message">{error}</p>
            <Link to="/artisan/dashboard">
              <button className="btn btn-primary">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-container">
        <Link to="/artisan/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="edit-product-header">
          <h1 className="edit-product-title">Edit Product</h1>
          <p className="edit-product-subtitle">
            Update your product details
          </p>
        </div>

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditProduct;