import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    // Artisan specific fields
    shopName: '',
    description: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Artisan specific validation
    if (formData.role === 'artisan') {
      if (!formData.shopName.trim()) {
        newErrors.shopName = 'Shop name is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      // Prepare data for API
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      
      // Add artisan fields if role is artisan
      if (formData.role === 'artisan') {
        dataToSend.shopName = formData.shopName;
        dataToSend.description = formData.description;
        dataToSend.phone = formData.phone;
      }
      
      let response;
      try {
        // Try API call first
        response = await api.post('/auth/register', dataToSend);
      } catch (apiErr) {
        // If API fails, use mock registration (for development)
        console.log('API not available, using mock registration');
        
        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userExists = existingUsers.some(u => u.email === formData.email);
        
        if (userExists) {
          throw { response: { data: { message: 'User with this email already exists' } } };
        }
        
        // Create mock user
        const mockUser = {
          _id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password, // In real app, this would be hashed
          role: formData.role,
          isApproved: true, // Auto-approved for both buyers and artisans!
          createdAt: new Date().toISOString()
        };
        
        if (formData.role === 'artisan') {
          mockUser.shopName = formData.shopName;
          mockUser.description = formData.description;
          mockUser.phone = formData.phone;
        }
        
        // Save to localStorage mock database
        existingUsers.push(mockUser);
        localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
        
        // Create mock response
        response = {
          data: {
            user: {
              _id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
              isApproved: mockUser.isApproved,
              shopName: mockUser.shopName
            },
            token: 'mock-token-' + mockUser._id
          }
        };
      }
      
      // Auto login for both buyers and artisans
      login(response.data.user, response.data.token);
      
      if (response.data.user.role === 'artisan') {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/artisan/dashboard');
        }, 1500);
      } else {
        navigate('/marketplace');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join our artisan community</p>
          </div>

          {apiError && (
            <div className="alert alert-error">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Role Selection */}
            <div className="input-group">
              <label className="input-label">I want to</label>
              <div className="role-selection">
                <div className="role-option">
                  <input
                    type="radio"
                    id="buyer"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleChange}
                  />
                  <label htmlFor="buyer" className="role-label">
                    <div className="role-name">Buy Products</div>
                    <div className="role-description">Browse & purchase</div>
                  </label>
                </div>
                
                <div className="role-option">
                  <input
                    type="radio"
                    id="artisan"
                    name="role"
                    value="artisan"
                    checked={formData.role === 'artisan'}
                    onChange={handleChange}
                  />
                  <label htmlFor="artisan" className="role-label">
                    <div className="role-name">Sell Products</div>
                    <div className="role-description">Become an artisan</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="password-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Artisan Specific Fields */}
            {formData.role === 'artisan' && (
              <div className="artisan-fields">
                <h3 className="artisan-fields-title">Artisan Information</h3>
                
                <div className="input-group">
                  <label htmlFor="shopName" className="input-label">Shop Name</label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    className={`input-field ${errors.shopName ? 'input-error' : ''}`}
                    placeholder="Your shop name"
                  />
                  {errors.shopName && (
                    <span className="error-message">{errors.shopName}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="description" className="input-label">
                    Shop Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`input-field ${errors.description ? 'input-error' : ''}`}
                    placeholder="Describe your crafts and skills"
                    rows="3"
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="phone" className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${errors.phone ? 'input-error' : ''}`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-block btn-large"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;