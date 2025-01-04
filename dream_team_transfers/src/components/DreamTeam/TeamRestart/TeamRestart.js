import { useState, useEffect, useRef } from 'react';
import { restartTeam } from '../../../db/db-utils';

import './TeamRestart.css';

function TeamRestart() {
    const [holdStart, setHoldStart] = useState(null);
    const [progress, setProgress] = useState(0);
    const intervalId = useRef(null);
    useEffect(() => {
        if (holdStart) {
            intervalId.current = setInterval(() => {
                const newProgress = Math.min((Date.now() - holdStart) / 3000 * 100, 100);
                setProgress(newProgress);
                if (newProgress === 100) {
                    // The button has been held for 4 or more seconds
                    restartTeam() // Call the teamRestart function
                        .then(() => {
                            console.log("Team should be reset now");
                            window.location.href = '/home';
                        })
                        .catch((error) => {
                            console.error("Failed to restart team:", error);
                        });
                    clearInterval(intervalId.current);
                    setHoldStart(null);
                }
            }, 100);
        }
        return () => clearInterval(intervalId.current);
    }, [holdStart]);

    const handleMouseDown = () => {
        setHoldStart(Date.now());
        setProgress(0);
    };

    const handleMouseUp = () => {
        setHoldStart(null);
        setProgress(0);
        clearInterval(intervalId.current);
    };

    return (
        <div className="team-restart">
            <h1>Restart Your Dream Team</h1>
            <p>
                Restarting your Dream Team will reset all your current progress and start a new 2023 season.
                You can choose to manage the same team or select a different Premier League team.
            </p>
            <p className="warning">
                Please note that restarting your team will permanently erase all your current data and cannot be undone.
            </p>
            {/* Insert images or slideshow here if needed */}
            <button className="restart-button" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                Hold to Confirm Restart
            </button>
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
            </div>
        </div>
    );
}

export default TeamRestart;
