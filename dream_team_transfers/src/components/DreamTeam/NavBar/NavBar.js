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
        <div>
            <nav>
                <Link to="/home">
                    {isLogoHovered ? (
                        <img
                            src={process.env.PUBLIC_URL + '/assets/navbar-icons/logo-hover-icon.svg'}
                            alt="Dream Team Logo"
                            className="logo"
                            onMouseEnter={handleLogoMouseEnter}
                            onMouseLeave={handleLogoMouseLeave}
                        />
                    ) : (
                        <img
                            src={process.env.PUBLIC_URL + '/assets/navbar-icons/logo-icon.svg'}
                            alt="Dream Team Logo"
                            className="logo"
                            onMouseEnter={handleLogoMouseEnter}
                            onMouseLeave={handleLogoMouseLeave}
                        />
                    )}
                </Link>
                <Link to="/squad-list">Squad List</Link>
                <Link to="/player-market">Player Market</Link>
                <Link to="/transfer-summary">Transfer Summary</Link>
                <Link to="/team-restart">Team Restart</Link>
            </nav>
        </div>
    );
}

export default NavBar;
