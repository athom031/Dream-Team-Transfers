import { useState, useEffect, useRef } from 'react';
import { restartTeam } from '../../../db/db-utils';
import Slideshow from '../../Misc/Slideshow';

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
                    // The button has been held for 3 or more seconds
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

            <div className='team-restart-container'>

                <div className='team-restart-info'>

                    <h1 className='restart-title'>
                        Restart Your Dream Team
                    </h1>

                    <div className='restart-info-text'>
                        <ul>
                            <li>
                                Restarting your Dream Team will reset all your current progress and start a new 2023 season.
                            </li>
                            <li>
                                You can choose to manage the same team or select a different Premier League team.
                            </li>
                            <li className="restart-warning">
                                PLEASE NOTE: Restarting will permanently erase all your current data and cannot be undone.
                            </li>
                        </ul>
                    </div>

                </div>

                <div className='slideshow-container'>
                    <div className='slideshow'>
                        <Slideshow selectedTeam={null} />
                    </div>
                </div>

            </div>

            <button className="restart-button" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                Hold to Confirm Restart
            </button>

            <div className="progress-bar">
                <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
            </div>

        </div>
    );
}

export default TeamRestart;
