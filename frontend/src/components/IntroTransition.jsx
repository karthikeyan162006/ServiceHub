import React, { useEffect, useState } from 'react';
import '../styles/introTransition.css';

const IntroTransition = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.2s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
    // Fully unmount after the fade animation completes (0.8s more)
    const removeTimer = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`intro-overlay ${fadeOut ? 'intro-fade-out' : ''}`}>
      {/* Animated background blobs */}
      <div className="intro-blob blob-1" />
      <div className="intro-blob blob-2" />
      <div className="intro-blob blob-3" />

      {/* Particles */}
      {[...Array(18)].map((_, i) => (
        <span key={i} className={`intro-particle particle-${i + 1}`} />
      ))}

      {/* Logo & Text */}
      <div className="intro-content">
        <div className="intro-logo-ring">
          <div className="intro-logo-inner">
            <span className="intro-logo-icon">🔍</span>
          </div>
        </div>
        <h1 className="intro-title">
          <span className="intro-word">Find</span>
          <span className="intro-word delay-1">Local</span>
          <span className="intro-word delay-2">Pros</span>
        </h1>
        <p className="intro-subtitle">Connecting you with trusted professionals</p>
        <div className="intro-loader">
          <div className="intro-loader-bar" />
        </div>
      </div>
    </div>
  );
};

export default IntroTransition;
