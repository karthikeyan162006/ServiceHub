import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="navbar glass">
            <div className="navbar-logo">
                <Link to="/">SERVICE <span>HUB</span></Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button onClick={handleLogout} className="btn-secondary btn-sm">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register" className="btn-primary btn-sm">Join as Pro</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
