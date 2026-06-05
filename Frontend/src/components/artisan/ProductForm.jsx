import React, { useState, useRef } from 'react';
import './ProductForm.css';

const ProductForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || '',
    stock: initialData.stock || '',
    images: initialData.images || []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Fabrics',
    'Jewelry',
    'Home Decor',
    'Paintings',
    'Sculptures',
    'Handicrafts',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 5 - formData.images.length);
    
    // Convert to base64 or use URLs
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock && formData.stock !== 0) {
      newErrors.stock = 'Stock quantity is required';
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {/* Basic Information */}
      <div className="form-section">
        <h2 className="form-section-title">Basic Information</h2>

        <div className="form-row">
          <div className="input-group form-row-full">
            <label htmlFor="name" className="input-label">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g., Handcrafted Clay Pot"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="input-group form-row-full">
            <label htmlFor="description" className="input-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe your product in detail..."
              rows="5"
              maxLength="1000"
            />
            <div className={`char-counter ${formData.description.length > 900 ? 'warning' : ''}`}>
              {formData.description.length}/1000 characters
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="form-section">
        <h2 className="form-section-title">Pricing & Inventory</h2>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="price" className="input-label">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input-field ${errors.price ? 'input-error' : ''}`}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="stock" className="input-label">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`input-field ${errors.stock ? 'input-error' : ''}`}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>

          <div className="input-group form-row-full">
            <label htmlFor="category" className="input-label">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="form-section">
        <h2 className="form-section-title">Product Images *</h2>

        <div className="image-upload-section">
          <div
            className={`image-upload-area ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📸</div>
            <div className="upload-text">Click to upload or drag and drop</div>
            <div className="upload-hint">
              PNG, JPG up to 5MB (Max 5 images)
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="upload-input"
          />
          {errors.images && <span className="error-message">{errors.images}</span>}

          {formData.images.length > 0 && (
            <div className="image-preview-grid">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img src={image} alt={`Preview ${index + 1}`} className="preview-image" />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;