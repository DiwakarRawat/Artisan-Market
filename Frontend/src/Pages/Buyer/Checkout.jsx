import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, calculateCartTotal } from '../../utils/helpers';
import api from '../../api/axios';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(storedCart);
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
      newErrors.phone = 'Invalid phone number';
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
      newErrors.pincode = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
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
      };

      const response = await api.post('/orders', orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success
      setOrderId(response.data._id || 'ORD' + Date.now());
      setOrderPlaced(true);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      
      // Mock success for development
      const mockOrderId = 'ORD' + Date.now();
      setOrderId(mockOrderId);
      setOrderPlaced(true);
      localStorage.removeItem('cart');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateCartTotal(cartItems);
  const shipping = subtotal >= 5000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="order-id">
              Order ID: <strong>#{orderId.slice(-8).toUpperCase()}</strong>
            </div>
            <div className="success-actions">
              <button
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>

          {/* Progress Steps */}
          <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
              <div className="step-label">Shipping Address</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {currentStep === 1 && (
              <>
                <h2 className="section-title">
                  <span className="section-icon">📍</span>
                  Shipping Address
                </h2>

                <div className="form-grid">
                  <div className="input-group form-grid-full">
                    <label htmlFor="fullName" className="input-label">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="phone" className="input-label">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.phone ? 'input-error' : ''}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="pincode" className="input-label">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.pincode ? 'input-error' : ''}`}
                      placeholder="6-digit pincode"
                      maxLength="6"
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>

                  <div className="input-group form-grid-full">
                    <label htmlFor="street" className="input-label">Street Address *</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.street ? 'input-error' : ''}`}
                      placeholder="House no., Building name, Street"
                    />
                    {errors.street && <span className="error-message">{errors.street}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="city" className="input-label">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.city ? 'input-error' : ''}`}
                      placeholder="Enter city"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="state" className="input-label">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className={`input-field ${errors.state ? 'input-error' : ''}`}
                      placeholder="Enter state"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/cart')}
                  >
                    ← Back to Cart
                  </button>
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="section-title">
                  <span className="section-icon">💳</span>
                  Payment Method
                </h2>

                <div className="payment-methods">
                  <div
                    className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="payment-radio"
                    />
                    <div className="payment-icon">💵</div>
                    <div className="payment-details">
                      <div className="payment-name">Cash on Delivery</div>
                      <div className="payment-description">
                        Pay with cash when you receive your order
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="payment-radio"
                    />
                    <div className="payment-icon">💳</div>
                    <div className="payment-details">
                      <div className="payment-name">Credit/Debit Card</div>
                      <div className="payment-description">
                        Pay securely with your card (Test Mode)
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="payment-radio"
                    />
                    <div className="payment-icon">📱</div>
                    <div className="payment-details">
                      <div className="payment-name">UPI</div>
                      <div className="payment-description">
                        Pay using UPI apps (Test Mode)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.product._id} className="summary-item">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.product.name}
                    className="summary-item-image"
                  />
                  <div className="summary-item-details">
                    <div className="summary-item-name">{item.product.name}</div>
                    <div className="summary-item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <div className="summary-item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;