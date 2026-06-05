import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

// Slides with images from public folder
const slides = [
  { 
    image: process.env.PUBLIC_URL + '/Images/Artisan ceramic mug with mountain design.png',
    title: 'Artisan Ceramic Mug', 
    description: 'Handcrafted mountain design ceramic mug' 
  },
  { 
    image: process.env.PUBLIC_URL + '/Images/Gemini_Generated_Image_7p4cbx7p4cbx7p4c.png',
    title: 'Artisan Collection', 
    description: 'Discover unique handmade treasures' 
  },
  { 
    image: process.env.PUBLIC_URL + '/Images/Earthy ceramic nesting bowls with forest scenes.png',
    title: 'Nesting Bowls', 
    description: 'Earthy ceramic bowls with forest scenes' 
  },
  { 
    image: process.env.PUBLIC_URL + '/Images/Gemini_Generated_Image_9gd37t9gd37t9gd3.png',
    title: 'Handcrafted Art', 
    description: 'Unique artisan creations' 
  },
  { 
    image: process.env.PUBLIC_URL + '/Images/Gemini_Generated_Image_k6znewk6znewk6zn.png',
    title: 'Artisan Excellence', 
    description: 'Quality craftsmanship in every piece' 
  },
  { 
    image: process.env.PUBLIC_URL + '/Images/Oceanside charcuterie spread with cheese and nuts.png',
    title: 'Oceanside Collection', 
    description: 'Beautiful charcuterie serving boards' 
  }
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(goToNext, 2500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  return (
    <div 
      className="slider-container"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`
            }}
          >
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-overlay">
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="slider-arrow slider-arrow-left" 
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      
      <button 
        className="slider-arrow slider-arrow-right" 
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,6 15,12 9,18"></polyline>
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="slider-progress">
        <div 
          className="slider-progress-bar"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;
