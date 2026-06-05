import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/admin/StatsCard';
import UsersList from '../../components/admin/UsersList';
import ThemeToggle from '../../components/common/ThemeToggle';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);
      const usersResponse = await api.get('/admin/users?limit=10');
      setRecentUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(getMockStats());
      setRecentUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockStats = () => ({
    totalUsers: 156,
    totalArtisans: 42,
    pendingArtisans: 8,
    totalProducts: 234,
    pendingProducts: 15,
    totalOrders: 567,
    orderTrend: 12
  });

  const getMockUsers = () => [
    { _id: '1', name: 'John Doe',    email: 'john@example.com',  role: 'buyer',   createdAt: new Date('2024-01-15') },
    { _id: '2', name: 'Jane Smith',  email: 'jane@example.com',  role: 'artisan', isApproved: true,  createdAt: new Date('2024-01-20') },
    { _id: '3', name: 'Bob Johnson', email: 'bob@example.com',   role: 'buyer',   createdAt: new Date('2024-01-22') },
    { _id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'artisan', isApproved: false, createdAt: new Date('2024-01-25') },
  ];

  const quickActions = [
    {
      id: 'artisan-approvals',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      label: 'Artisan Approvals',
      description: 'Review and approve artisan registrations',
      count: stats.pendingArtisans || 0,
      path: '/admin/artisan-approvals',
      color: 'clay',
    },
    {
      id: 'product-moderation',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      label: 'Product Moderation',
      description: 'Moderate and approve product listings',
      count: stats.pendingProducts || 0,
      path: '/admin/product-moderation',
      color: 'sand',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-loading-screen">
          <div className="admin-loading-spinner"></div>
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* ── Hero Header ── */}
      <div className="admin-hero">
        <div className="admin-hero-inner">
          <div className="admin-hero-left">
            <div className="admin-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Portal
            </div>
            <h1 className="admin-hero-title">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="admin-hero-subtitle">
              Manage your Artisan Marketplace — approvals, products, and users all in one place.
            </p>
          </div>
          <div className="admin-hero-right">
            <ThemeToggle />
            <button className="admin-logout-btn" onClick={handleLogout} id="admin-logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="admin-hero-divider"></div>
      </div>

      {/* ── Page Body ── */}
      <div className="admin-dashboard-container">

        {/* Stats */}
        <section className="admin-section-block">
          <div className="admin-section-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Platform Overview
          </div>
          <StatsCard stats={stats} />
        </section>

        {/* Quick Actions */}
        <section className="admin-section-block">
          <div className="admin-section-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Quick Actions
          </div>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <div
                key={action.id}
                className={`quick-action-card ${action.color}`}
                onClick={() => navigate(action.path)}
                id={`quick-action-${action.id}`}
              >
                <div className="quick-action-top">
                  <div className="quick-action-icon">{action.icon}</div>
                  {action.count > 0 && (
                    <span className="quick-action-badge">{action.count} pending</span>
                  )}
                </div>
                <div className="quick-action-label">{action.label}</div>
                <div className="quick-action-desc">{action.description}</div>
                <div className="quick-action-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Users */}
        <section className="admin-section-block">
          <div className="admin-section-header-row">
            <div className="admin-section-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Recent Users
            </div>
            <Link to="/admin/users" className="admin-view-all-btn" id="view-all-users-btn">
              View All Users →
            </Link>
          </div>
          <UsersList users={recentUsers} />
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;