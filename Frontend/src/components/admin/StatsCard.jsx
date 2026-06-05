import React from 'react';
import './StatsCard.css';

const StatsCard = ({ stats }) => {
  const statsData = [
    {
      id: 'users',
      label: 'Total Users',
      value: stats.totalUsers || 0,
      icon: '👥',
      description: 'All registered users',
      type: 'users'
    },
    {
      id: 'artisans',
      label: 'Artisans',
      value: stats.totalArtisans || 0,
      icon: '🎨',
      description: 'Active artisan accounts',
      type: 'artisans',
      badge: stats.pendingArtisans ? `${stats.pendingArtisans} pending` : null
    },
    {
      id: 'products',
      label: 'Products',
      value: stats.totalProducts || 0,
      icon: '📦',
      description: 'Listed products',
      type: 'products',
      badge: stats.pendingProducts ? `${stats.pendingProducts} pending` : null
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: '🛒',
      description: 'All time orders',
      type: 'orders',
      trend: stats.orderTrend || 0
    }
  ];

  return (
    <div className="admin-stats-grid">
      {statsData.map(stat => (
        <div key={stat.id} className={`admin-stat-card ${stat.type}`}>
          <div className="admin-stat-header">
            <div className="admin-stat-icon-wrapper">
              {stat.icon}
            </div>
            {stat.badge && (
              <span className="admin-stat-badge pending">{stat.badge}</span>
            )}
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-description">
              {stat.description}
              {stat.trend !== undefined && stat.trend !== 0 && (
                <span className={`admin-stat-trend ${stat.trend >= 0 ? 'up' : 'down'}`}>
                  {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;