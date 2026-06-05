import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ImageSlider from './components/common/ImageSlider';
import AboutUs from './components/common/AboutUs';
import Services from './components/common/Services';
import Reviews from './components/common/Reviews';
import Location from './components/common/Location';

// Auth Pages
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';

// Buyer Pages
import Marketplace from './Pages/Buyer/Marketplace';
import Cart from './Pages/Buyer/Cart';
import Orders from './Pages/Buyer/Orders';
import ProductDetails from './Pages/Buyer/ProductDetails';

// Admin Pages
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ArtisanApprovals from './Pages/Admin/ArtisanApprovals';
import ProductModeration from './Pages/Admin/ProductModeration';

// Artisan Pages
import ArtisanDashboard from './Pages/Artisan/ArtisanDashboard';
import AddProduct from './Pages/Artisan/AddProduct';
import EditProduct from './Pages/Artisan/EditProduct';
import ArtisanOrders from './Pages/Artisan/ArtisanOrders';

// Temporary Home component (we'll replace this later)
const TempHome = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <ImageSlider />
        <div className="hero-overlay">
          <h1>Welcome to Artisan Marketplace</h1>
          <p>Browse our handcrafted products</p>
          <button className="explore-btn" onClick={() => document.querySelector('.about-us-section').scrollIntoView({ behavior: 'smooth' })}>
            Explore
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>
      </div>
      <AboutUs />
      <Services />
      <Reviews />
      <Location />
    </div>
  );
};

// Layout component for pages with Navbar and Footer
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  // Determine redirect destination after login based on role
  const postLoginRedirect = user?.role === 'admin' 
    ? '/admin/dashboard' 
    : user?.role === 'artisan'
      ? '/artisan/dashboard'
      : '/marketplace';

  return (
    <div className="app-container">
      <Routes>
        {/* Marketplace route - has its own header, no Navbar/Footer */}
        <Route 
          path="/marketplace" 
          element={<Marketplace />} 
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* ── Artisan Routes (protected, artisan-only) ── */}
        <Route
          path="/artisan/dashboard"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/add-product"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/edit-product/:id"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/orders"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanOrders />
            </ProtectedRoute>
          }
        />
        
        {/* ── Admin Routes (protected, admin-only) ── */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artisan-approvals"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ArtisanApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product-moderation"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductModeration />
            </ProtectedRoute>
          }
        />

        {/* Home route redirects to marketplace */}
        <Route 
          path="/home" 
          element={<Navigate to="/marketplace" />} 
        />

        {/* Public Routes with Navbar/Footer */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <MainLayout>
                <Login />
              </MainLayout>
            ) : (
              <Navigate to={postLoginRedirect} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? (
              <MainLayout>
                <Register />
              </MainLayout>
            ) : (
              <Navigate to={postLoginRedirect} />
            )
          } 
        />

        {/* Home Route */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <TempHome />
            </MainLayout>
          } 
        />

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;