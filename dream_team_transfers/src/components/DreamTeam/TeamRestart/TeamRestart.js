import { useEffect, useRef, useState } from 'react';
import { restartTeam } from '../../../db/db-utils';
import Slideshow from '../../Misc/Slideshow';

import './TeamRestart.css';

const HOLD_DURATION_MS = 3000;

function TeamRestart() {
  const [holdStart, setHoldStart] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const intervalId = useRef(null);

  useEffect(() => {
    if (!holdStart || isRestarting) return undefined;

    intervalId.current = setInterval(() => {
      const newProgress = Math.min(
        ((Date.now() - holdStart) / HOLD_DURATION_MS) * 100,
        100
      );

      setProgress(newProgress);

      if (newProgress === 100) {
        setIsRestarting(true);
        clearInterval(intervalId.current);
        setHoldStart(null);

        restartTeam()
          .then(() => {
            window.location.href = '/';
          })
          .catch((error) => {
            console.error('Failed to restart team:', error);
            setIsRestarting(false);
            setProgress(0);
          });
      }
    }, 100);

    return () => clearInterval(intervalId.current);
  }, [holdStart, isRestarting]);

  const startHold = () => {
    if (isRestarting) return;
    setHoldStart(Date.now());
    setProgress(0);
  };

  const cancelHold = () => {
    if (isRestarting) return;
    setHoldStart(null);
    setProgress(0);
    clearInterval(intervalId.current);
  };

  return (
    <main className="team-restart">
      <div className="team-restart-shell">
        <section className="restart-panel restart-copy-panel">
          <div className="restart-eyebrow">Season Reset</div>
          <h1 className="restart-title">Restart Your Dream Team</h1>
          <p className="restart-description">
            Reset your current save and return to club selection. You can pick
            the same Premier League team again or begin a completely new
            rebuild.
          </p>

          <div className="restart-impact-grid" aria-label="Restart impact">
            <div className="restart-impact-card">
              <span>Clears</span>
              <strong>Starting XI</strong>
            </div>
            <div className="restart-impact-card">
              <span>Resets</span>
              <strong>Transfers</strong>
            </div>
            <div className="restart-impact-card">
              <span>Returns To</span>
              <strong>Team Pick</strong>
            </div>
          </div>

          <div className={`restart-warning ${holdStart ? 'show' : ''}`}>
            <strong>Please note:</strong> restarting permanently erases your
            current local save and cannot be undone.
          </div>

          <div className="restart-action-card">
            <div className="restart-progress-track" aria-hidden="true">
              <div
                className="restart-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button
              type="button"
              className="restart-button"
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerCancel={cancelHold}
              onPointerLeave={cancelHold}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  startHold();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  cancelHold();
                }
              }}
              disabled={isRestarting}
            >
              {isRestarting ? 'Restarting...' : 'Hold to Confirm Restart'}
            </button>
          </div>
        </section>

        <section className="restart-panel restart-preview-panel">
          <div className="restart-preview-header">
            <span>Fresh Start</span>
            <strong>Premier League</strong>
          </div>
          <div className="team-restart-slideshow">
            <Slideshow selectedTeam={null} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default TeamRestart;
