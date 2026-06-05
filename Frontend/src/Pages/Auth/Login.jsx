import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const validateAdminForm = () => {
    const newErrors = {};
    
    if (!adminFormData.email) {
      newErrors.email = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminFormData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!adminFormData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!adminFormData.adminCode) {
      newErrors.adminCode = 'Admin access code is required';
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
    
    try {
      let response;
      try {
        // Try API call first
        response = await api.post('/auth/login', formData);
      } catch (apiErr) {
        // If API fails, use mock login (for development)
        console.log('API not available, using mock login');
        
        // Get users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = existingUsers.find(
          u => u.email === formData.email && u.password === formData.password
        );
        
        if (!user) {
          throw { response: { data: { message: 'Invalid email or password' } } };
        }
        
        // Create mock response
        response = {
          data: {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              isApproved: user.isApproved,
              shopName: user.shopName
            },
            token: 'mock-token-' + user._id
          }
        };
      }
      
      // Store user data and token
      login(response.data.user, response.data.token);
      
      // Redirect based on role
      if (response.data.user.role === 'buyer') {
        navigate('/marketplace');
      } else if (response.data.user.role === 'artisan') {
        navigate('/artisan/dashboard');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setApiError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateAdminForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setApiError('');
    
    try {
      let response;
      try {
        // Try API call first
        response = await api.post('/auth/admin-login', {
          email: adminFormData.email,
          password: adminFormData.password,
          adminCode: adminFormData.adminCode,
        });
      } catch (apiErr) {
        // If API fails, use mock admin login
        console.log('API not available, using mock admin login');
        
        // Hardcoded admin credentials for development
        const MOCK_ADMIN = {
          email: 'admin@artisan.com',
          password: 'admin123',
          adminCode: 'ARTISAN2026'
        };
        
        if (
          adminFormData.email !== MOCK_ADMIN.email ||
          adminFormData.password !== MOCK_ADMIN.password ||
          adminFormData.adminCode !== MOCK_ADMIN.adminCode
        ) {
          throw { response: { data: { message: 'Invalid admin credentials or access code' } } };
        }
        
        // Create mock admin response
        response = {
          data: {
            user: {
              _id: 'admin-001',
              name: 'Admin',
              email: MOCK_ADMIN.email,
              role: 'admin',
              isApproved: true
            },
            token: 'mock-admin-token-001'
          }
        };
      }
      
      // Store user data and token
      login(response.data.user, response.data.token);
      
      // Always redirect admin to admin dashboard
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Admin login error:', error);
      setApiError(
        error.response?.data?.message || 
        'Admin login failed. Please verify your credentials and access code.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setApiError('');
    setShowPassword(false);
    setShowAdminPassword(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className={`login-card ${activeTab === 'admin' ? 'admin-mode' : ''}`}>
          
          {/* Tab Switcher */}
          <div className="login-tab-switcher">
            <button 
              className={`login-tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('user')}
              type="button"
              id="user-login-tab"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              User Login
            </button>
            <button 
              className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('admin')}
              type="button"
              id="admin-login-tab"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Login
            </button>
            <div className={`tab-indicator ${activeTab === 'admin' ? 'admin' : 'user'}`}></div>
          </div>

          {/* User Login Section */}
          {activeTab === 'user' && (
            <div className="login-tab-content" key="user">
              <div className="login-header">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Login to your account</p>
              </div>

              {apiError && (
                <div className="alert alert-error">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form" id="user-login-form">
                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email Address
                  </label>
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
                  <label htmlFor="password" className="input-label">
                    Password
                  </label>
                  <div className="password-toggle">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field ${errors.password ? 'input-error' : ''}`}
                      placeholder="Enter your password"
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

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block btn-large"
                  disabled={loading}
                  id="user-login-submit"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="login-link">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Admin Login Section */}
          {activeTab === 'admin' && (
            <div className="login-tab-content admin-content" key="admin">
              <div className="login-header admin-login-header">
                <div className="admin-shield-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h1 className="login-title admin-title">Admin Portal</h1>
                <p className="login-subtitle">Secure administrator access</p>
              </div>

              {apiError && (
                <div className="alert alert-error admin-alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {apiError}
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="login-form" id="admin-login-form">
                <div className="input-group">
                  <label htmlFor="admin-email" className="input-label">
                    Admin Email
                  </label>
                  <div className="admin-input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M22 7l-10 7L2 7"/>
                    </svg>
                    <input
                      type="email"
                      id="admin-email"
                      name="email"
                      value={adminFormData.email}
                      onChange={handleAdminChange}
                      className={`input-field admin-input ${errors.email ? 'input-error' : ''}`}
                      placeholder="admin@artisan.com"
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="admin-password" className="input-label">
                    Password
                  </label>
                  <div className="password-toggle">
                    <div className="admin-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        id="admin-password"
                        name="password"
                        value={adminFormData.password}
                        onChange={handleAdminChange}
                        className={`input-field admin-input ${errors.password ? 'input-error' : ''}`}
                        placeholder="Enter admin password"
                      />
                    </div>
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    >
                      {showAdminPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="admin-code" className="input-label">
                    Access Code
                  </label>
                  <div className="admin-input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    <input
                      type="password"
                      id="admin-code"
                      name="adminCode"
                      value={adminFormData.adminCode}
                      onChange={handleAdminChange}
                      className={`input-field admin-input ${errors.adminCode ? 'input-error' : ''}`}
                      placeholder="Enter admin access code"
                    />
                  </div>
                  {errors.adminCode && (
                    <span className="error-message">{errors.adminCode}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-admin btn-block btn-large"
                  disabled={loading}
                  id="admin-login-submit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  {loading ? 'Authenticating...' : 'Access Admin Panel'}
                </button>
              </form>

              <div className="admin-login-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span>Contact the system administrator if you need access credentials.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;