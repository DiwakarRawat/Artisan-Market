import React from 'react';
import './Location.css';

const Location = () => {
  const googleMapsUrl = 'https://www.google.com/maps/place/Embassy+of+Japan/@28.5973389,77.1710853,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce2a99903a917:0x5e7e9c3e9c9c9c9c!8m2!3d28.5973389!4d77.1736602!16s%2Fg%2F1tdfp9hy';
  
  const handleMapClick = () => {
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <section className="location-section">
      <div className="location-container">
        <div className="location-info">
          <h2 className="location-title">Find Us</h2>
          <div className="location-underline"></div>
          <p className="location-subtitle">
            Visit our artisan marketplace and experience the craftsmanship firsthand
          </p>
          
          <div className="location-details">
            <div className="location-item">
              <span className="location-icon">📍</span>
              <div className="location-text">
                <h4>Address</h4>
                <p>Embassy of Japan, 50-G, Shantipath,<br />Chanakyapuri, New Delhi - 110021</p>
              </div>
            </div>
            
            <div className="location-item">
              <span className="location-icon">🕐</span>
              <div className="location-text">
                <h4>Working Hours</h4>
                <p>Mon - Sat: 10:00 AM - 7:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
            
            <div className="location-item">
              <span className="location-icon">📞</span>
              <div className="location-text">
                <h4>Contact</h4>
                <p>+91 11 2687 XXXX<br />info@artisanmarketplace.com</p>
              </div>
            </div>
          </div>
          
          <button className="directions-btn" onClick={handleMapClick}>
            <span>Get Directions</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <div className="location-map" onClick={handleMapClick}>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.0123456789!2d77.1710853!3d28.5973389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2a99903a917%3A0x2cf8e1e5e5e5e5e5!2sEmbassy%20of%20Japan!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Artisan Marketplace Location"
            ></iframe>
            <div className="map-overlay">
              <span>Click to open in Google Maps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
