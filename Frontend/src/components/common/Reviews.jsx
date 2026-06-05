import React from 'react';
import './Reviews.css';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    review: 'Absolutely stunning craftsmanship! The ceramic vase exceeded my expectations.',
    product: 'Hand-painted Ceramic Vase',
    avatar: 'PS'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    review: 'The quality of the handwoven textile is remarkable. Will definitely order more!',
    product: 'Handwoven Cotton Throw',
    avatar: 'RV'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Bangalore',
    rating: 4,
    review: 'Beautiful jewelry piece with intricate detailing. The packaging was thoughtful.',
    product: 'Silver Filigree Earrings',
    avatar: 'AP'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur',
    rating: 5,
    review: 'This marketplace is a treasure trove! The wooden sculpture is a masterpiece.',
    product: 'Carved Wooden Elephant',
    avatar: 'VS'
  },
  {
    id: 5,
    name: 'Meera Krishnan',
    location: 'Chennai',
    rating: 5,
    review: 'The brass lamp is absolutely gorgeous. Now the centerpiece of my pooja room.',
    product: 'Traditional Brass Diya',
    avatar: 'MK'
  },
  {
    id: 6,
    name: 'Arjun Reddy',
    location: 'Hyderabad',
    rating: 4,
    review: 'Great platform for finding unique gifts. The personalized touch is special.',
    product: 'Handmade Leather Journal',
    avatar: 'AR'
  },
  {
    id: 7,
    name: 'Sneha Gupta',
    location: 'Kolkata',
    rating: 5,
    review: 'The handloom saree is exquisite! Colors are vibrant, fabric quality top-notch.',
    product: 'Handloom Silk Saree',
    avatar: 'SG'
  },
  {
    id: 8,
    name: 'Karthik Nair',
    location: 'Kochi',
    rating: 5,
    review: 'Custom wooden chess set arrived beautifully crafted. Worth every penny!',
    product: 'Carved Rosewood Chess Set',
    avatar: 'KN'
  },
  {
    id: 9,
    name: 'Divya Menon',
    location: 'Pune',
    rating: 4,
    review: 'Love the terracotta planters! They add rustic charm to my balcony garden.',
    product: 'Terracotta Planter Set',
    avatar: 'DM'
  },
  {
    id: 10,
    name: 'Amit Sharma',
    location: 'Lucknow',
    rating: 5,
    review: 'The Chikankari kurta is a work of art. Intricate embroidery, perfect fit!',
    product: 'Chikankari Cotton Kurta',
    avatar: 'AS'
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`star ${star <= rating ? 'filled' : 'empty'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const Reviews = () => {
  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">What Our Customers Say</h2>
        <div className="reviews-underline"></div>
        <p className="reviews-subtitle">
          Real experiences from our valued customers who found their perfect artisan treasures
        </p>
      </div>

      <div className="reviews-marquee-container">
        <div className="reviews-marquee">
          {duplicatedReviews.map((review, index) => (
            <div key={`${review.id}-${index}`} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{review.avatar}</div>
                <div className="review-info">
                  <h4 className="review-name">{review.name}</h4>
                  <p className="review-location">{review.location}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-text">"{review.review}"</p>
              <p className="review-product">
                <span>Purchased:</span> {review.product}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-summary-container">
        <div className="reviews-summary">
          <div className="summary-item">
            <span className="summary-number">4.8</span>
            <div className="summary-stars">
              <StarRating rating={5} />
            </div>
            <span className="summary-label">Average Rating</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item">
            <span className="summary-number">2,500+</span>
            <span className="summary-label">Happy Customers</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item">
            <span className="summary-number">98%</span>
            <span className="summary-label">Satisfaction Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
