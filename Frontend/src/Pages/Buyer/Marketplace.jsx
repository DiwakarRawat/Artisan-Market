import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/buyer/ProductCard';
import ThemeToggle from '../../components/common/ThemeToggle';
import Footer from '../../components/common/Footer';
import api from '../../api/axios';
import './Marketplace.css';

const Marketplace = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfilePopup(false);
    navigate('/');
  };

  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Pottery & Ceramics', icon: '🏺' },
    { name: 'Textiles & Fabrics', icon: '🧵' },
    { name: 'Jewelry', icon: '💍' },
    { name: 'Home Decor', icon: '🏡' },
    { name: 'Paintings', icon: '🎨' },
    { name: 'Sculptures', icon: '🗿' },
    { name: 'Woodwork', icon: '🪵' },
    { name: 'Leather Goods', icon: '👜' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.artisan?.name?.toLowerCase().includes(query) ||
        product.artisan?.shopName?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = existingCart.findIndex(item => item.product._id === product._id);

      if (existingIndex >= 0) {
        const existingItem = existingCart[existingIndex];

        if (existingItem.quantity >= product.stock) {
          alert('Maximum available quantity already in cart');
          return;
        }

        existingCart[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
      } else {
        existingCart.push({
          product,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Unable to add item to cart. Please try again.');
    }
  };

  const getMockProducts = () => {
    return [
      {
        _id: '1',
        name: 'Handcrafted Clay Pot',
        description: 'Beautiful traditional clay pot made with love',
        price: 1200,
        category: 'Pottery & Ceramics',
        images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'],
        stock: 15,
        artisan: { name: 'Ramesh Kumar', shopName: 'Kumar Pottery' },
        createdAt: new Date()
      },
      {
        _id: '2',
        name: 'Silk Saree - Royal Blue',
        description: 'Pure silk handwoven saree with intricate patterns',
        price: 8500,
        category: 'Textiles & Fabrics',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
        stock: 5,
        artisan: { name: 'Lakshmi Devi', shopName: 'Traditional Weaves' },
        createdAt: new Date()
      },
      {
        _id: '3',
        name: 'Silver Oxidized Necklace',
        description: 'Handmade silver necklace with traditional design',
        price: 4500,
        category: 'Jewelry',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'],
        stock: 8,
        artisan: { name: 'Suresh Jewellers', shopName: 'Suresh Silver Works' },
        createdAt: new Date()
      },
      {
        _id: '4',
        name: 'Wooden Wall Art - Mandala',
        description: 'Carved wooden decorative mandala piece',
        price: 3200,
        category: 'Home Decor',
        images: ['/Images/wooden_mandala.jpg'],
        stock: 12,
        artisan: { name: 'Mahesh Crafts', shopName: 'Wood Masters' },
        createdAt: new Date()
      },
      {
        _id: '5',
        name: 'Abstract Canvas Painting',
        description: 'Original abstract painting on premium canvas',
        price: 15000,
        category: 'Paintings',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
        stock: 3,
        artisan: { name: 'Priya Arts', shopName: 'Modern Art Studio' },
        createdAt: new Date()
      },
      {
        _id: '6',
        name: 'Brass Ganesh Statue',
        description: 'Traditional brass deity statue with fine details',
        price: 6800,
        category: 'Sculptures',
        images: ['/Images/ganesh_statue.png'],
        stock: 7,
        artisan: { name: 'Temple Arts', shopName: 'Sacred Crafts' },
        createdAt: new Date()
      },
      {
        _id: '7',
        name: 'Hand Painted Terracotta Vase',
        description: 'Colorful terracotta vase with folk art designs',
        price: 2100,
        category: 'Pottery & Ceramics',
        images: ['/Images/terracotta_daisy.png'],
        stock: 20,
        artisan: { name: 'Madhubani Crafts', shopName: 'Folk Art Studio' },
        createdAt: new Date()
      },
      {
        _id: '8',
        name: 'Embroidered Cushion Cover Set',
        description: 'Set of 5 handmade embroidered cushion covers',
        price: 1800,
        category: 'Home Decor',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
        stock: 25,
        artisan: { name: 'Zari Works', shopName: 'Needle & Thread' },
        createdAt: new Date()
      },
      {
        _id: '9',
        name: 'Leather Messenger Bag',
        description: 'Genuine leather handcrafted messenger bag',
        price: 5500,
        category: 'Leather Goods',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
        stock: 10,
        artisan: { name: 'Heritage Leather', shopName: 'Leather Luxe' },
        createdAt: new Date()
      },
      {
        _id: '10',
        name: 'Wooden Chess Set',
        description: 'Hand carved wooden chess set with intricate pieces',
        price: 4200,
        category: 'Woodwork',
        images: ['https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400'],
        stock: 6,
        artisan: { name: 'Wood Wonders', shopName: 'Craft Kings' },
        createdAt: new Date()
      },
      {
        _id: '11',
        name: 'Kundan Earrings',
        description: 'Traditional Kundan earrings with meenakari work',
        price: 3800,
        category: 'Jewelry',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'],
        stock: 15,
        artisan: { name: 'Royal Jewels', shopName: 'Jadau Collections' },
        createdAt: new Date()
      },
      {
        _id: '12',
        name: 'Pashmina Shawl',
        description: 'Pure pashmina shawl with kashmiri embroidery',
        price: 12000,
        category: 'Textiles & Fabrics',
        images: ['/Images/pashmina_shawl.jpg'],
        stock: 4,
        artisan: { name: 'Kashmir Looms', shopName: 'Valley Weaves' },
        createdAt: new Date()
      }
    ];
  };

  const getProductsByCategory = (category) => {
    if (category === 'All') return products.slice(0, 6);
    return products.filter(p => p.category === category).slice(0, 4);
  };

  return (
    <div className="marketplace">
      {/* Top Navigation Bar */}
      <header className="marketplace-header">
        <div className="marketplace-header-content">
          {/* Logo */}
          <Link to="/" className="marketplace-logo">
            <span className="logo-primary">Artisan</span>
            <span className="logo-secondary">Market</span>
          </Link>

          {/* Search Bar */}
          <form className="marketplace-search" onSubmit={handleSearch}>
            <select className="search-category-select">
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              className="search-input-main"
              placeholder="Search for handcrafted products, artisans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Right Section */}
          <div className="marketplace-nav-right">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="nav-link">
                  <span className="nav-icon">📦</span>
                  <span className="nav-text">Orders</span>
                </Link>
                <Link to="/cart" className="nav-link cart-link">
                  <span className="nav-icon">🛒</span>
                  <span className="nav-text">Cart</span>
                </Link>
                <div className="user-menu" onClick={() => setShowProfilePopup(!showProfilePopup)}>
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-greeting">
                    Hi, {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  {showProfilePopup && (
                    <div className="profile-popup">
                      <div className="profile-popup-header">
                        <div className="profile-popup-avatar">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="profile-popup-info">
                          <span className="profile-popup-name">{user?.name || 'User'}</span>
                          <span className="profile-popup-email">{user?.email || 'user@example.com'}</span>
                        </div>
                      </div>
                      <div className="profile-popup-divider"></div>
                      <Link to="/profile" className="profile-popup-item" onClick={(e) => e.stopPropagation()}>
                        <span className="profile-popup-icon">👤</span>
                        My Profile
                      </Link>
                      <Link to="/orders" className="profile-popup-item" onClick={(e) => e.stopPropagation()}>
                        <span className="profile-popup-icon">📦</span>
                        My Orders
                      </Link>
                      <Link to="/wishlist" className="profile-popup-item" onClick={(e) => e.stopPropagation()}>
                        <span className="profile-popup-icon">❤️</span>
                        Wishlist
                      </Link>
                      <div className="profile-popup-divider"></div>
                      <button className="profile-popup-logout" onClick={handleLogout}>
                        <span className="profile-popup-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="login-btn-header">
                <div className="login-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-nav">
        <div className="category-nav-content">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="marketplace-main">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <h1>Discover Unique Handcrafted Treasures</h1>
            <p>Shop authentic artisan products from skilled craftsmen across India</p>
            <button className="hero-cta" onClick={() => setSelectedCategory('All')}>
              Shop Now
            </button>
          </div>
          <div className="hero-images">
            <div className="hero-image-wrapper hero-image-1">
              <img src={process.env.PUBLIC_URL + '/Images/image 1.jpeg'} alt="Handcrafted Art" />
            </div>
            <div className="hero-image-wrapper hero-image-2">
              <img src={process.env.PUBLIC_URL + '/Images/image 2.jpeg'} alt="Artisan Products" />
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="products-loading-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!loading && searchQuery && (
          <section className="search-results-section">
            <div className="section-header">
              <h2>Search Results for "{searchQuery}"</h2>
              <span className="results-count">{filteredProducts.length} products found</span>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or browse our categories</p>
              </div>
            )}
          </section>
        )}

        {/* Category Products or All Products */}
        {!loading && !searchQuery && (
          <>
            {selectedCategory === 'All' ? (
              /* Show products by category sections */
              categories.slice(1).map(category => {
                const categoryProducts = getProductsByCategory(category.name);
                if (categoryProducts.length === 0) return null;
                return (
                  <section key={category.name} className="category-section">
                    <div className="section-header">
                      <h2>
                        <span className="section-icon">{category.icon}</span>
                        {category.name}
                      </h2>
                      <button 
                        className="see-all-btn"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        See All →
                      </button>
                    </div>
                    <div className="products-scroll">
                      {categoryProducts.map(product => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              /* Show filtered products for selected category */
              <section className="filtered-products-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">
                      {categories.find(c => c.name === selectedCategory)?.icon}
                    </span>
                    {selectedCategory}
                  </h2>
                  <span className="results-count">{filteredProducts.length} products</span>
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="products-grid">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <span className="no-results-icon">📦</span>
                    <h3>No products in this category</h3>
                    <p>Check back soon for new additions!</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Featured Artisans Section */}
        {!loading && !searchQuery && selectedCategory === 'All' && (
          <section className="featured-artisans">
            <div className="section-header">
              <h2>
                <span className="section-icon">⭐</span>
                Featured Artisans
              </h2>
            </div>
            <div className="artisans-grid">
              {[
                { name: 'Kumar Pottery', specialty: 'Pottery & Ceramics', rating: 4.9, products: 45 },
                { name: 'Traditional Weaves', specialty: 'Textiles & Fabrics', rating: 4.8, products: 32 },
                { name: 'Suresh Silver Works', specialty: 'Jewelry', rating: 4.7, products: 28 },
                { name: 'Wood Masters', specialty: 'Woodwork', rating: 4.9, products: 56 }
              ].map((artisan, index) => (
                <div key={index} className="artisan-card">
                  <div className="artisan-avatar">
                    {artisan.name.charAt(0)}
                  </div>
                  <h3 className="artisan-name">{artisan.name}</h3>
                  <p className="artisan-specialty">{artisan.specialty}</p>
                  <div className="artisan-stats">
                    <span>⭐ {artisan.rating}</span>
                    <span>📦 {artisan.products} products</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
