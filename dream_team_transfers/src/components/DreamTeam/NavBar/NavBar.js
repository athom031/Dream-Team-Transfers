import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';

function NavBar() {
    const [isLogoHovered, setLogoHovered] = useState(false);

    const handleLogoMouseEnter = () => {
        setLogoHovered(true);
    };

    const handleLogoMouseLeave = () => {
        setLogoHovered(false);
    };

    return (
        <div className='nav-bar'>
            <div className='logo-padding-container'>
                <Link
                    to="/home"
                    className="logo-container"
                    onMouseEnter={handleLogoMouseEnter}
                    onMouseLeave={handleLogoMouseLeave}
                >
                    <img
                        src={
                            process.env.PUBLIC_URL +
                            '/assets/navbar-icons/' +
                            (isLogoHovered ? 'logo-hover.png' : 'logo.png')
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
                <Link to="/squad-list" className="nav-link">Squad List</Link>
                <Link to="/player-market" className="nav-link">Player Market</Link>
                <Link to="/transfer-summary" className="nav-link">Transfer Summary</Link>
                <Link to="/team-restart" className="nav-link">Team Restart</Link>
            </div>
        </div>
    );
}

export default NavBar;
