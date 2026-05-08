import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NAV_LINKS = [
  { path: '/squad-list', label: 'Squad List' },
  { path: '/player-market', label: 'Player Market' },
  { path: '/transfer-summary', label: 'Transfer Summary' },
  { path: '/team-restart', label: 'Team Restart' },
];

function NavBar() {
  const [isLogoHovered, setLogoHovered] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const homeIsActive = ['/', '/home', '/starting-eleven'].includes(
    location.pathname
  );

  const handleLogoMouseEnter = () => {
    setLogoHovered(true);
  };

  const handleLogoMouseLeave = () => {
    setLogoHovered(false);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="nav-bar">
      <div className="nav-logo-padding-container">
        <Link
          to="/home"
          className={`nav-logo-container ${homeIsActive ? 'active-link' : ''}`}
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
          onClick={handleLinkClick}
        >
          <img
            src={
              process.env.PUBLIC_URL +
              '/assets/navbar-icons/' +
              (isLogoHovered || homeIsActive ? 'logo-hover.png' : 'logo.png')
            }
            alt="Dream Team Logo"
            className="navbar-icon"
          />
          <span>Dream</span>
          &nbsp;
          <span>Team</span>
        </Link>
      </div>
      <button
        type="button"
        className="nav-menu-button"
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span className="nav-menu-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div className={`other-nav ${isMenuOpen ? 'is-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${
              location.pathname === link.path ? 'active-link' : ''
            }`}
            onClick={handleLinkClick}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/home"
          className={`nav-link mobile-home-link ${
            homeIsActive ? 'active-link' : ''
          }`}
          onClick={handleLinkClick}
        >
          Starting XI
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
