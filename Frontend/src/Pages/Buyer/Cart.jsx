import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/buyer/CartItem';
import { formatPrice, calculateCartTotal } from '../../utils/helpers';
import api from '../../api/axios';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' or 'success'
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
    if (user && !shippingAddress.fullName) {
      setShippingAddress(prev => ({ ...prev, fullName: user.name || '' }));
    }
  }, [isAuthenticated, navigate, user]);

  const loadCart = () => {
    setLoading(true);
    try {
      // For now, get cart from localStorage
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(storedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.product._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!shippingAddress.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Invalid phone (10 digits starting with 6-9)';
    }

    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingAddress.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Invalid pincode (exactly 6 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateAddress()) {
      return;
    }

    setIsSubmitting(true);

    const subtotal = calculateCartTotal(cartItems);
    const shipping = subtotal >= 5000 ? 0 : 100;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    
    // Save total to state before clearing cart
    setOrderTotal(total);

    const orderData = {
      items: cartItems.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          images: item.product.images || []
        },
        artisan: item.product.artisan || {
          name: 'Independent Artisan',
          shopName: 'Artisan Workshop'
        },
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: total,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      paymentMethod: paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      shippingAddress: shippingAddress,
      createdAt: new Date().toISOString()
    };

    try {
      // Attempt API call
      const response = await api.post('/orders', {
        items: cartItems.map(item => ({
          product: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        totalAmount: total,
        buyerEmail: user?.email,
        buyerName: user?.name
      });
      
      const newOrderId = response.data?._id || 'ORD' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      orderData._id = newOrderId;
    } catch (error) {
      console.error('API order placement failed, placing order locally:', error);
      const localOrderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(localOrderId);
      orderData._id = localOrderId;
    }

    // Save to local storage mock orders
    const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    localStorage.setItem('mockOrders', JSON.stringify([orderData, ...existingOrders]));

    // Clear cart
    localStorage.removeItem('cart');
    setCartItems([]);

    setIsSubmitting(false);
    setCheckoutStep('success');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setIsCheckoutOpen(true);
    setCheckoutStep('form');
  };

  const subtotal = calculateCartTotal(cartItems);
  const shipping = subtotal > 0 ? (subtotal >= 5000 ? 0 : 100) : 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading cart...
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isCheckoutOpen) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-message">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/marketplace">
              <button className="btn btn-primary btn-large">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            {shipping === 0 && subtotal >= 5000 && (
              <div className="savings-banner">
                <span className="savings-icon">🎉</span>
                <span className="savings-text">
                  You're eligible for FREE shipping!
                </span>
              </div>
            )}

            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Tax (GST 18%)</span>
              <span className="summary-value">{formatPrice(tax)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-value">{formatPrice(total)}</span>
            </div>

            <button
              className="btn btn-primary btn-large checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <div className="continue-shopping">
              <Link to="/marketplace" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-backdrop">
          <div className="checkout-modal animate-slide-up">
            {checkoutStep === 'form' ? (
              <form onSubmit={handlePlaceOrder} className="checkout-form-content">
                <div className="modal-header">
                  <h2>Checkout Details</h2>
                  <button type="button" className="close-modal-btn" onClick={() => setIsCheckoutOpen(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-section">
                    <h3>📍 Shipping Address</h3>
                    <div className="form-grid">
                      <div className="input-group full-width">
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleAddressChange}
                          className={errors.fullName ? 'error' : ''}
                          placeholder="John Doe"
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          className={errors.phone ? 'error' : ''}
                          placeholder="10-digit mobile number"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="pincode">Pincode *</label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={shippingAddress.pincode}
                          onChange={handleAddressChange}
                          className={errors.pincode ? 'error' : ''}
                          placeholder="6-digit pincode"
                          maxLength="6"
                        />
                        {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                      </div>

                      <div className="input-group full-width">
                        <label htmlFor="street">Street Address *</label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={shippingAddress.street}
                          onChange={handleAddressChange}
                          className={errors.street ? 'error' : ''}
                          placeholder="House no., Building name, Street"
                        />
                        {errors.street && <span className="error-text">{errors.street}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          className={errors.city ? 'error' : ''}
                          placeholder="Enter city"
                        />
                        {errors.city && <span className="error-text">{errors.city}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="state">State *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleAddressChange}
                          className={errors.state ? 'error' : ''}
                          placeholder="Enter state"
                        />
                        {errors.state && <span className="error-text">{errors.state}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>💳 Payment Method</h3>
                    <div className="payment-options">
                      <div
                        className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <div className="payment-icon">💵</div>
                        <div className="payment-info">
                          <h4>Cash on Delivery</h4>
                          <p>Pay when you receive the order</p>
                        </div>
                      </div>

                      <div
                        className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="payment-icon">💳</div>
                        <div className="payment-info">
                          <h4>Credit / Debit Card</h4>
                          <p>Pay securely online (Test Mode)</p>
                        </div>
                      </div>

                      <div
                        className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <div className="payment-icon">📱</div>
                        <div className="payment-info">
                          <h4>UPI</h4>
                          <p>Pay via UPI apps (Test Mode)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="order-total-brief">
                    <span>Grand Total:</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setIsCheckoutOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="checkout-success-content animate-fade-in">
                <div className="success-icon-wrapper">
                  <div className="success-circle animate-scale-up">
                    <span className="success-check-mark">✓</span>
                  </div>
                </div>
                <h2>Order Confirmed!</h2>
                <p className="success-tagline">Thank you for supporting authentic artisans.</p>
                
                <div className="order-summary-box">
                  <div className="summary-detail-row">
                    <span>Order ID:</span>
                    <strong>#{orderId}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <span>Shipping To:</span>
                    <span>{shippingAddress.fullName}</span>
                  </div>
                  <div className="summary-detail-row">
                    <span>Address:</span>
                    <span className="address-text">
                      {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    </span>
                  </div>
                  <div className="summary-detail-row">
                    <span>Total Amount Paid:</span>
                    <strong className="amount">{formatPrice(orderTotal)}</strong>
                  </div>
                </div>

                <div className="success-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      navigate('/marketplace');
                    }}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      navigate('/orders');
                    }}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;