import React, { useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="landing-container">
      <div className="overlay"></div>
      
      <div className="content-wrapper">
        <div className="logo-container">
          <div className="logo-circle"></div>
          <h1 className="app-title">MaskMage</h1>
        </div>
        
        <p className="app-description">
          Transform Your Creativity into Digital Art
        </p>
        
        <div 
          className={`cta-section ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link to='/home'>
            <button className="start-button">
                <span>Start Designing</span>
                <div className="button-overlay"></div>
            </button>
          </Link>
          
          <div className="feature-highlights">
            <div className="feature">
              <i className="icon">🖌️</i>
              <span>Unlimited Creativity</span>
            </div>
            <div className="feature">
              <i className="icon">🖼️</i>
              <span>Easy Image Editing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
};

export default LandingPage;