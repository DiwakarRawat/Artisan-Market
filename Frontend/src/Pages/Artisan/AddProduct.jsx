import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../../components/artisan/ProductForm';
import api from '../../api/axios';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // API call to create product
      const response = await api.post('/products', formData);
      
      alert('Product added successfully!');
      navigate('/artisan/dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      
      // Mock success for development
      alert('Product added successfully! (Demo Mode)');
      navigate('/artisan/dashboard');
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <Link to="/artisan/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="add-product-header">
          <h1 className="add-product-title">Add New Product</h1>
          <p className="add-product-subtitle">
            Fill in the details below to list your product
          </p>
        </div>

        <ProductForm onSubmit={handleSubmit} isEdit={false} />
      </div>
    </div>
  );
};

export default AddProduct;