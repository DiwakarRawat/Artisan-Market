import React from 'react';
import './Services.css';

const services = [
  {
    icon: '🎨',
    title: 'Handcrafted Products',
    description: 'Carefully crafted using traditional techniques.'
  },
  {
    icon: '🌍',
    title: 'Global Artisan Network',
    description: 'Artisans from 50+ countries worldwide.'
  },
  {
    icon: '🤝',
    title: 'Fair Trade Practices',
    description: 'Ensuring fair compensation for artisans.'
  },
  {
    icon: '📦',
    title: 'Secure Shipping',
    description: 'Safe worldwide delivery with tracking.'
  },
  {
    icon: '✨',
    title: 'Quality Guarantee',
    description: 'High standards of craftsmanship assured.'
  },
  {
    icon: '💬',
    title: 'Direct Communication',
    description: 'Chat directly with artisans to customize.'
  }
];

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Our Services</h2>
          <div className="services-underline"></div>
          <p className="services-subtitle">
            Discover what makes Artisan Marketplace the perfect destination for unique, handcrafted treasures
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
