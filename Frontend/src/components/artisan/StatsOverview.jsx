import React from 'react';
import { formatPrice } from '../../utils/helpers';
import './StatsOverview.css';

const StatsOverview = ({ stats }) => {
  const statsData = [
    {
      id: 'products',
      label: 'Total Products',
      value: stats.totalProducts || 0,
      icon: '📦',
      description: 'Active listings',
      type: 'primary'
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: '🛒',
      description: 'All time orders',
      type: 'success',
      trend: stats.orderTrend || 0
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue || 0),
      icon: '💰',
      description: 'Lifetime earnings',
      type: 'warning'
    },
    {
      id: 'pending',
      label: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: '⏳',
      description: 'Needs attention',
      type: 'info'
    }
  ];

  return (
    <div className="stats-overview">
      {statsData.map(stat => (
        <div key={stat.id} className={`stat-card ${stat.type}`}>
          <div className="stat-header">
            <div className="stat-icon">{stat.icon}</div>
            {stat.trend !== undefined && (
              <div className={`stat-trend ${stat.trend >= 0 ? 'up' : 'down'}`}>
                {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
              </div>
            )}
          </div>
          <div className="stat-body">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;