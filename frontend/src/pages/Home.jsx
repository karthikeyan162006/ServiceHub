import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const categories = [
        { name: 'Plumbing', icon: '🚰', type: 'plumber' },
        { name: 'Electrical', icon: '⚡', type: 'electrician' },
        { name: 'Cleaning', icon: '🧹', type: 'cleaner' },
        { name: 'Carpentry', icon: '🪚', type: 'carpenter' },
        { name: 'Painting', icon: '🎨', type: 'painter' },
        { name: 'Appliance', icon: '🔌', type: 'appliance' }
    ];

    return (
        <div className="home-container animate-fade-in">
            <header className="hero-section">
                <h1>SERVICE HUB <span>!</span></h1>
                <p>Expert help for every home need. From leaky faucets to complex electrical work, we've got you covered.</p>
                <div className="hero-buttons">
                    <Link to="/services" className="btn-primary">Browse All Services</Link>
                    <Link to="/register" className="btn-secondary">Join as a Service Pro</Link>
                </div>
            </header>

            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title">Popular Categories</h2>
                    <div className="grid-container">
                        {categories.map((cat, index) => (
                            <Link to={`/services?type=${cat.type}`} key={index} className="card glass">
                                <div className="card-icon">{cat.icon}</div>
                                <h3>{cat.name}</h3>
                                <p>Verified professionals ready to help.</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why SERVICE HUB?</h2>
                    <div className="grid-container">
                        <div className="feature-card glass">
                            <div className="card-icon">🛡️</div>
                            <h3>Verified Experts</h3>
                            <p>Every pro goes through a rigorous background check to ensure your safety and quality of work.</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="card-icon">⚡</div>
                            <h3>Instant Booking</h3>
                            <p>No waiting for quotes. See availability and book your service in under 60 seconds.</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="card-icon">⭐</div>
                            <h3>Real Reviews</h3>
                            <p>Browse honest feedback and ratings from customers in your local neighborhood.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
