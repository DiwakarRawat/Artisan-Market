import React from 'react';
import { formatDate } from '../../utils/helpers';
import './UsersList.css';

const UsersList = ({ users }) => {
  const getRoleBadge = (role) => {
    const badges = {
      buyer: 'badge-info',
      artisan: 'badge-primary',
      admin: 'badge-danger'
    };
    return badges[role] || 'badge-primary';
  };

  if (!users || users.length === 0) {
    return (
      <div className="users-list-table">
        <div className="users-empty">
          No users found
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-table">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>
                <div className="user-name-cell">
                  <div className="user-avatar-small">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`badge ${getRoleBadge(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </td>
              <td>
                {user.role === 'artisan' ? (
                  user.isApproved ? (
                    <span className="badge badge-success">Approved</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )
                ) : (
                  <span className="badge badge-success">Active</span>
                )}
              </td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;