import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isBuyer, isArtisan, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="navbar-logo-primary">Artisan</span>
            <span className="navbar-logo-secondary">Market</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                {isBuyer && (
                  <>
                    <Link to="/marketplace" className="navbar-link">
                      Browse
                    </Link>
                    <Link to="/cart" className="navbar-link">
                      Cart
                    </Link>
                    <Link to="/orders" className="navbar-link">
                      Orders
                    </Link>
                  </>
                )}

                {isArtisan && (
                  <>
                    <Link to="/artisan/dashboard" className="navbar-link">
                      Dashboard
                    </Link>
                    <Link to="/artisan/add-product" className="navbar-link">
                      Add Product
                    </Link>
                    <Link to="/artisan/orders" className="navbar-link">
                      Orders
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="navbar-link">
                      Dashboard
                    </Link>
                    <Link to="/admin/artisan-approvals" className="navbar-link">
                      Approvals
                    </Link>
                    <Link to="/admin/product-moderation" className="navbar-link">
                      Products
                    </Link>
                  </>
                )}

                <div className="navbar-user">
                  <ThemeToggle />
                  <span className="navbar-username">
                    Hi, <span className="navbar-username-highlight">{user?.name}</span>
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline btn-small">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/marketplace" className="navbar-link">
                  Browse
                </Link>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Register
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="navbar-menu-button" aria-label="Toggle menu">
            <svg className="navbar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-mobile-links">
            {isAuthenticated ? (
              <>
                {isBuyer && (
                  <>
                    <Link to="/marketplace" className="navbar-mobile-link" onClick={closeMenu}>
                      Browse
                    </Link>
                    <Link to="/cart" className="navbar-mobile-link" onClick={closeMenu}>
                      Cart
                    </Link>
                    <Link to="/orders" className="navbar-mobile-link" onClick={closeMenu}>
                      Orders
                    </Link>
                  </>
                )}

                {isArtisan && (
                  <>
                    <Link to="/artisan/dashboard" className="navbar-mobile-link" onClick={closeMenu}>
                      Dashboard
                    </Link>
                    <Link to="/artisan/add-product" className="navbar-mobile-link" onClick={closeMenu}>
                      Add Product
                    </Link>
                    <Link to="/artisan/orders" className="navbar-mobile-link" onClick={closeMenu}>
                      Orders
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="navbar-mobile-link" onClick={closeMenu}>
                      Dashboard
                    </Link>
                    <Link to="/admin/artisan-approvals" className="navbar-mobile-link" onClick={closeMenu}>
                      Approvals
                    </Link>
                    <Link to="/admin/product-moderation" className="navbar-mobile-link" onClick={closeMenu}>
                      Products
                    </Link>
                  </>
                )}

                <div className="navbar-mobile-divider">
                  <p className="navbar-mobile-user">Hi, {user?.name}</p>
                  <button onClick={handleLogout} className="btn btn-outline btn-block">
                    Logout
                  </button>
                  <div className="navbar-mobile-theme">
                    <ThemeToggle />
                    <span>Toggle Theme</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/marketplace" className="navbar-mobile-link" onClick={closeMenu}>
                  Browse
                </Link>
                <Link to="/login" className="navbar-mobile-link" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="navbar-mobile-link" onClick={closeMenu}>
                  <button className="btn btn-primary btn-block">Register</button>
                </Link>
                <div className="navbar-mobile-theme">
                  <ThemeToggle />
                  <span>Toggle Theme</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;