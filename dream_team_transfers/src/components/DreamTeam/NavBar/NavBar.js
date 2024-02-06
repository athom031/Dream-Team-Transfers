import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const [isLogoHovered, setLogoHovered] = useState(false);
    const [activeLink, setActiveLink] = useState('/home');

    const handleLogoMouseEnter = () => {
        setLogoHovered(true);
    };

    const handleLogoMouseLeave = () => {
        setLogoHovered(false);
    };

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <div className='nav-bar'>
            <div className='nav-logo-padding-container'>
                <Link
                    to="/home"
                    className={`nav-logo-container ${
                        activeLink === '/home' ? 'active-link' : ''}`}
                    onMouseEnter={handleLogoMouseEnter}
                    onMouseLeave={handleLogoMouseLeave}
                    onClick={() => handleLinkClick('/home')}
                >
                    <img
                        src={
                            process.env.PUBLIC_URL +
                            '/assets/navbar-icons/' +
                            (isLogoHovered  ||  (activeLink === '/home')
                                ? 'logo-hover.png' : 'logo.png')
                        }
                        alt="Dream Team Logo"
                        className="navbar-icon"
                    />
                    <span>Dream</span>
                    &nbsp;
                    <span>Team</span>
                </Link>
            </div>
            <div className='other-nav'>
                <Link
                    to="/squad-list"
                    className={`nav-link ${
                        activeLink === '/squad-list' ? 'active-link' : ''
                        }`}
                    onClick={() => handleLinkClick('/squad-list')}
                >
                    Squad List
                </Link>
                <Link
                    to="/player-market"
                    className={`nav-link ${
                        activeLink === '/player-market' ? 'active-link' : ''}`}
                    onClick={() => handleLinkClick('/player-market')}
                >
                    Player Market
                </Link>
                <Link
                    to="/transfer-summary"
                    className={`nav-link ${
                        activeLink === '/transfer-summary' ? 'active-link' : ''}`}
                    onClick={() => handleLinkClick('/transfer-summary')}
                >
                    Transfer Summary
                </Link>
                <Link
                    to="/team-restart"
                    className={`nav-link ${
                        activeLink === '/team-restart' ? 'active-link' : ''}`}
                    onClick={() => handleLinkClick('/team-restart')}
                >
                    Team Restart
                </Link>
            </div>
        </div>
    );
}

export default NavBar;
