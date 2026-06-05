import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-us-section">
      <div className="about-us-container">
        <div className="about-us-content">
          <h2 className="about-us-title">About Us</h2>
          <div className="about-us-underline"></div>
          <p className="about-us-text">
            Welcome to <strong>Artisan Marketplace</strong>, where tradition meets creativity. 
            We are a passionate community of skilled artisans dedicated to preserving 
            centuries-old craftsmanship while embracing modern design aesthetics.
          </p>
          <p className="about-us-text">
            Every product in our marketplace tells a story — a story of dedication, 
            heritage, and the human touch that mass production can never replicate. 
            From handcrafted ceramics to intricate textiles, each piece is a testament 
            to the artisan's skill and passion.
          </p>
          <p className="about-us-text">
            Our mission is to connect you directly with talented artisans from around 
            the world, ensuring fair trade practices and supporting sustainable livelihoods. 
            When you shop with us, you're not just buying a product — you're becoming 
            part of a global movement to preserve artisanal traditions.
          </p>

        </div>
        <div className="about-us-video">
          <div className="video-wrapper">
            <video
              src={process.env.PUBLIC_URL + '/Videos/Pottery_Video_1.mp4'}
              title="About Artisan Marketplace"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="video-caption">Discover the art behind our artisans</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
