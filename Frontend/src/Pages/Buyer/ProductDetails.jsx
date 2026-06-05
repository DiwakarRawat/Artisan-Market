import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
      // Use mock product for development
      setProduct(getMockProduct());
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = () => {
    const mockProducts = [
      {
        _id: '1',
        name: 'Handcrafted Clay Pot',
        description: 'This beautiful traditional clay pot is made with love by skilled artisans. Each piece is hand-thrown on a traditional potter\'s wheel and carefully baked. Ideal for home decoration or as a rustic planter.',
        price: 1200,
        category: 'Pottery & Ceramics',
        images: [
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600',
          '/Images/blue_clay_pot.jpg'
        ],
        imagePositions: [
          'center 50%',
          'center 50%',
          'center 15%'
        ],
        stock: 15,
        artisan: { name: 'Ramesh Kumar', shopName: 'Kumar Pottery', description: 'Traditional pottery maker' },
        createdAt: new Date()
      },
      {
        _id: '2',
        name: 'Silk Saree - Royal Blue',
        description: 'A luxurious pure silk handwoven saree with traditional intricate zari patterns. Crafted using pure Mulberry silk and silver threads, this saree is perfect for weddings and festive occasions.',
        price: 8500,
        category: 'Textiles & Fabrics',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
          'https://images.unsplash.com/photo-1601244005535-a48d4d4e0d6f?w=600'
        ],
        stock: 5,
        artisan: { name: 'Lakshmi Devi', shopName: 'Traditional Weaves', description: 'Master weaver since 1995' },
        createdAt: new Date()
      },
      {
        _id: '3',
        name: 'Silver Oxidized Necklace',
        description: 'An elegant handcrafted silver necklace featuring traditional antique tribal patterns. Perfect for ethnic attire, showcasing authentic metal craftsmanship and engraving details.',
        price: 4500,
        category: 'Jewelry',
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'
        ],
        stock: 8,
        artisan: { name: 'Suresh Jewellers', shopName: 'Suresh Silver Works', description: 'Fine metal ornaments artisan' },
        createdAt: new Date()
      },
      {
        _id: '4',
        name: 'Wooden Wall Art - Mandala',
        description: 'A stunning wall art panel, intricately hand-carved with a classic mandala pattern out of premium solid rosewood. Adds a warm, spiritual focal point to any room layout.',
        price: 3200,
        category: 'Home Decor',
        images: [
          '/Images/wooden_mandala.jpg',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
        ],
        imagePositions: [
          'center 30%',
          'center 50%',
          'center 50%'
        ],
        stock: 12,
        artisan: { name: 'Mahesh Crafts', shopName: 'Wood Masters', description: 'Wood carving specialist' },
        createdAt: new Date()
      },
      {
        _id: '5',
        name: 'Abstract Canvas Painting',
        description: 'An original abstract acrylic painting on heavy-duty stretched canvas. A unique blend of warm tones and textured brushstrokes, signed by the visual artist Priya.',
        price: 15000,
        category: 'Paintings',
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600',
          'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=600'
        ],
        stock: 3,
        artisan: { name: 'Priya Arts', shopName: 'Modern Art Studio', description: 'Contemporary visual artist' },
        createdAt: new Date()
      },
      {
        _id: '6',
        name: 'Brass Ganesh Statue',
        description: 'A traditional heavy brass statue of Lord Ganesha, detailed with fine hand-chiseled engravings. Brings prosperity, wisdom, and elegant Indian heritage to your living spaces.',
        price: 6800,
        category: 'Sculptures',
        images: [
          '/Images/ganesh_statue.png'
        ],
        imagePositions: [
          'center 50%'
        ],
        stock: 7,
        artisan: { name: 'Temple Arts', shopName: 'Sacred Crafts', description: 'Brass casting and polishing artisan' },
        createdAt: new Date()
      },
      {
        _id: '7',
        name: 'Hand Painted Terracotta Vase',
        description: 'A vibrant terracotta clay vase individually painted by hand with traditional tribal Madhubani designs. Adds a colorful dash of ethnic beauty to floral arrangements.',
        price: 2100,
        category: 'Pottery & Ceramics',
        images: [
          '/Images/terracotta_daisy.png',
          '/Images/terracotta_peacock.jpg',
          '/Images/terracotta_floral.png'
        ],
        imagePositions: [
          'center 30%',
          'center 30%',
          'center 15%'
        ],
        stock: 20,
        artisan: { name: 'Madhubani Crafts', shopName: 'Folk Art Studio', description: 'Madhubani paint expert' },
        createdAt: new Date()
      },
      {
        _id: '8',
        name: 'Embroidered Cushion Cover Set',
        description: 'A set of 5 cotton cushion covers detailed with hand embroidery, mirrors, and beadwork. Crafted using traditional Rajasthani styles, perfect for living room couches.',
        price: 1800,
        category: 'Home Decor',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600'
        ],
        stock: 25,
        artisan: { name: 'Zari Works', shopName: 'Needle & Thread', description: 'Traditional embroidery guild' },
        createdAt: new Date()
      },
      {
        _id: '9',
        name: 'Leather Messenger Bag',
        description: 'A vintage-style messenger bag handcrafted out of genuine vegetable-tanned leather. Includes padded interior laptop sleeves, sturdy brass buckles, and adjustable shoulder straps.',
        price: 5500,
        category: 'Leather Goods',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'
        ],
        stock: 10,
        artisan: { name: 'Heritage Leather', shopName: 'Leather Luxe', description: 'Experienced leather craftsman' },
        createdAt: new Date()
      },
      {
        _id: '10',
        name: 'Wooden Chess Set',
        description: 'A luxury wooden chess set where each chess piece is hand-carved individually from Indian rosewood and boxwood. Features a folding chessboard box for easy storage.',
        price: 4200,
        category: 'Woodwork',
        images: [
          'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600',
          'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600',
          '/Images/glass_chess_set.png'
        ],
        imagePositions: [
          'center 50%',
          'center 50%',
          'center 50%'
        ],
        stock: 6,
        artisan: { name: 'Wood Wonders', shopName: 'Craft Kings', description: 'Classic woodwork turners' },
        createdAt: new Date()
      },
      {
        _id: '11',
        name: 'Kundan Earrings',
        description: 'Stunning traditional earrings made with Kundan stone setting and delicate enamel (Meenakari) work. Features small pearls at the base for an authentic royal look.',
        price: 3800,
        category: 'Jewelry',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'
        ],
        stock: 15,
        artisan: { name: 'Royal Jewels', shopName: 'Jadau Collections', description: 'Ethnic jewelry designers' },
        createdAt: new Date()
      },
      {
        _id: '12',
        name: 'Pashmina Shawl',
        description: 'An incredibly soft, authentic Pashmina shawl hand-loomed in Kashmir. Detailed with classic Kashmiri embroidery around the borders, providing unmatched warmth and luxury.',
        price: 12000,
        category: 'Textiles & Fabrics',
        images: [
          '/Images/pashmina_shawl.jpg',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600'
        ],
        imagePositions: [
          'center 50%',
          'center 50%',
          'center 50%'
        ],
        stock: 4,
        artisan: { name: 'Kashmir Looms', shopName: 'Valley Weaves', description: 'Pashmina craft preservationists' },
        createdAt: new Date()
      }
    ];

    const found = mockProducts.find(p => p._id === id);
    if (found) return found;

    // Fallback product
    return {
      _id: id,
      name: 'Handcrafted Clay Pot',
      description: 'This beautiful clay pot is handmade by skilled artisans using traditional techniques passed down through generations. Perfect for home decor or as a planter.',
      price: 1200,
      category: 'Pottery & Ceramics',
      images: [
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
        'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600',
        '/Images/blue_clay_pot.jpg'
      ],
      imagePositions: [
        'center 50%',
        'center 50%',
        'center 15%'
      ],
      stock: 15,
      artisan: { name: 'Ramesh Kumar', shopName: 'Kumar Pottery', description: 'Traditional pottery maker' },
      createdAt: new Date()
    };
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isBuyer) {
      alert('Only buyers can add products to cart');
      return;
    }

    setAddingToCart(true);
    try {
      // API call will go here
      await api.post('/cart/add', {
        productId: product._id,
        quantity: quantity
      });

      // For now, store in localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          product: product,
          quantity: quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart!');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return <span className="stock-out">Out of Stock</span>;
    } else if (product.stock <= 5) {
      return <span className="stock-low">Only {product.stock} left in stock</span>;
    } else {
      return <span className="stock-available">In Stock ({product.stock} available)</span>;
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-loading">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-error">
            <div className="error-icon">❌</div>
            <h2 className="error-title">Product Not Found</h2>
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </div>

        <div className="product-details-content">
          <div className="product-details-grid">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image-container">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="main-image"
                  style={{
                    objectPosition: product.imagePositions?.[selectedImage]
                  }}
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-container">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="thumbnail-image" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <span className="badge badge-primary product-category-badge">
                {product.category}
              </span>

              <h1 className="product-title">{product.name}</h1>

              {/* Artisan Info */}
              <div className="product-artisan-info">
                <div className="artisan-avatar">
                  {product.artisan?.shopName?.[0] || product.artisan?.name?.[0] || 'A'}
                </div>
                <div className="artisan-details">
                  <div className="artisan-label">Crafted by</div>
                  <div className="artisan-name">
                    {product.artisan?.shopName || product.artisan?.name || 'Artisan'}
                  </div>
                </div>
              </div>

              <div className="product-price">
                {formatPrice(product.price)}
              </div>

              <div className="product-stock">
                {getStockStatus()}
              </div>

              <div className="product-description">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{product.description}</p>
              </div>

              {product.stock > 0 && (
                <div className="product-actions">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-primary btn-large add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                  </button>
                </div>
              )}

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{product.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Stock</span>
                  <span className="meta-value">{product.stock} units</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Listed on</span>
                  <span className="meta-value">{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;