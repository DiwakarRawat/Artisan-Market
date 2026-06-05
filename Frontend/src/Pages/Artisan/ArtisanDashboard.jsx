import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatsOverview from '../../components/artisan/StatsOverview';
import ArtisanProductCard from '../../components/artisan/ArtisanProductCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './ArtisanDashboard.css';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsResponse = await api.get('/products/my-products');
      setProducts(productsResponse.data);

      // Fetch orders
      const ordersResponse = await api.get('/orders/artisan-orders');
      setRecentOrders(ordersResponse.data.slice(0, 5)); // Latest 5 orders

      // Calculate stats
      calculateStats(productsResponse.data, ordersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for development
      const mockProducts = getMockProducts();
      const mockOrders = getMockOrders();
      setProducts(mockProducts);
      setRecentOrders(mockOrders.slice(0, 5));
      calculateStats(mockProducts, mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (products, orders) => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    setStats({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      orderTrend: 12 // Mock trend percentage
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      // Recalculate stats
      calculateStats(products.filter(p => p._id !== productId), recentOrders);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Mock delete for development
      setProducts(products.filter(p => p._id !== productId));
    }
  };

  const getMockProducts = () => {
    return [
      {
        _id: '1',
        name: 'Handcrafted Clay Pot',
        description: 'Beautiful traditional clay pot',
        price: 1200,
        category: 'Pottery & Ceramics',
        images: ['https://via.placeholder.com/300'],
        stock: 15,
        isApproved: true,
        createdAt: new Date()
      },
      {
        _id: '2',
        name: 'Decorative Wall Hanging',
        description: 'Handmade wall decoration',
        price: 850,
        category: 'Home Decor',
        images: ['https://via.placeholder.com/300'],
        stock: 8,
        isApproved: false,
        createdAt: new Date()
      }
    ];
  };

  const getMockOrders = () => {
    return [
      {
        _id: '1',
        items: [
          {
            product: { _id: 'p1', name: 'Clay Pot', images: ['https://via.placeholder.com/80'] },
            quantity: 2,
            price: 1200
          }
        ],
        totalAmount: 2400,
        status: 'processing',
        createdAt: new Date()
      }
    ];
  };

  if (loading) {
    return (
      <div className="artisan-dashboard-page">
        <div className="artisan-dashboard-container">
          <div className="dashboard-loading">
            <Loader size="large" text="Loading dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-dashboard-page">
      <div className="artisan-dashboard-container">
        {/* Header */}
        <div className="artisan-dashboard-header">
          <div className="dashboard-welcome">
            <div className="welcome-text">
              <h1>Welcome back, {user?.name}!</h1>
              <p>Manage your products and orders from your dashboard</p>
            </div>
            <div className="dashboard-quick-actions">
              <Link to="/artisan/add-product">
                <button className="btn btn-primary">
                  ➕ Add New Product
                </button>
              </Link>
              <Link to="/artisan/orders">
                <button className="btn btn-outline">
                  📋 View All Orders
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Products Section */}
        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📦</span>
              My Products
            </h2>
            <div className="section-actions">
              <Link to="/artisan/add-product">
                <button className="btn btn-primary btn-small">
                  Add Product
                </button>
              </Link>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <ArtisanProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <div className="empty-products-icon">📦</div>
              <h3 className="empty-products-title">No Products Yet</h3>
              <p className="empty-products-message">
                Start adding your handcrafted products to showcase them to buyers
              </p>
              <Link to="/artisan/add-product">
                <button className="btn btn-primary">
                  Add Your First Product
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        {recentOrders.length > 0 && (
          <div className="recent-orders-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🛒</span>
                Recent Orders
              </h2>
              <Link to="/artisan/orders">
                <button className="btn btn-outline btn-small">
                  View All
                </button>
              </Link>
            </div>

            <div className="orders-preview">
              {recentOrders.map(order => (
                <div key={order._id} className="order-preview-card">
                  <div className="order-preview-info">
                    <strong>Order #{order._id?.slice(-8).toUpperCase()}</strong>
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;