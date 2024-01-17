import React, { useEffect, useState } from 'react';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';
import { CURRENCY_UNIT, getCurrencyDenomination, getCurrencyRounded } from '../../utils/money-utils';
import { selectTeam } from '../../db/db-utils';
import { getSubmitButton } from '../../utils/submit-button';

import Loading from './Loading';

/* STYLE SHEETS */
import './HomePageCSS/HomePage.css';
import './HomePageCSS/HomePage-laptop.css';
import './HomePageCSS/HomePage-tablet.css';
import './HomePageCSS/HomePage-phone.css';

function HomePage() {
  const [teamIndex, setTeamIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [slideshowPhotos, setSlideshowPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [teamSubmitted, setTeamSubmitted] = useState(null);

  const DREAM_TEAM_LOGO = process.env.PUBLIC_URL + '/logo512.png';

  const SubmitButton = getSubmitButton();

  useEffect(() => {
    // set a new timeout to track how long user stays on team selected
    const timeoutId = setTimeout(() => {
      setSelectedTeam(teamIndex);
    }, 500); // half a second

    // Clear the timeout when the component unmounts or when teamIndex changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [teamIndex]);

  useEffect(() => {
    // this code activates once the selectedTeam changes

    let newPhotos;

    if (selectedTeam !== null) {
      // if a team is selected, use its photos
      newPhotos = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_photos;
    } else {
      // if no team is selected, use random photos from all teams
      newPhotos = [];
      for (let i = 0; i < 20; i++) {
        newPhotos.push(...PREMIER_LEAGUE_TEAM_INFOS[i].team_photos);
      }
      // we want the order to be randomized so its not just one team after the other
      for (let i = newPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPhotos[i], newPhotos[j]] = [newPhotos[j], newPhotos[i]];
      }
    }

    setPhotoIndex(0);
    setSlideshowPhotos(newPhotos);
  }, [selectedTeam]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhotoIndex((photoIndex + 1) % slideshowPhotos.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [photoIndex, slideshowPhotos]);

  useEffect(() => {
    if (teamSubmitted !== null) {
      const timer = setTimeout(() => {
        selectTeam(teamSubmitted).then(() => {
          window.location.reload();
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [teamSubmitted]);

  const handleLeftClick = () => {
    if (teamIndex === null) {
      setTeamIndex(19);
    } else {
      setTeamIndex((teamIndex + 19 /* -1 + 20 */) % 20);
    }
  }

  const handleRightClick = () => {
    if (teamIndex === null) {
      setTeamIndex(0);
    } else {
      setTeamIndex((teamIndex + 1) % 20);
    }
  }

  const handleSubmit = () => {
    setTeamSubmitted(selectedTeam);
  }

  return (
    (teamSubmitted !== null) ? (<Loading/>) : (
    <div className='home-page'>

      <h1 className='title'>
        DREAM TEAM TRANSFERS
      </h1>

      <div className='intro'>

        <div className='concept'>
          {/* SELL UNWANTED PLAYERS */}
          <div className='concept-container'>
            <div className='concept-icon-container'>
              <img
                  src={process.env.PUBLIC_URL + '/assets/concept-intro-icons/sell-players.png'}
                  alt='sell players'
                  className='concept-icon'
              />
            </div>
            <h2 className='concept-text'>
              1.<br/>Sell Unwanted Players!
            </h2>
          </div>

          {/* BUY HIDDEN GEMS ACROSS EUROPE */}
          <div className='concept-container'>
            <div className='concept-icon-container'>
              <img
                  src={process.env.PUBLIC_URL + '/assets/concept-intro-icons/european-soccer.png'}
                  alt='buy players'
                  className='concept-icon'
              />
            </div>
            <h2 className='concept-text'>
              2.<br/>Buy Hidden Gems Across Europe!
            </h2>
          </div>

          {/* BUILD YOUR DREAM TEAM */}
          <div className='concept-container'>
            <div className='concept-icon-container'>
              <img
                  src={process.env.PUBLIC_URL + '/assets/concept-intro-icons/team-build.png'}
                  alt='build team'
                  className='concept-icon'
              />
            </div>
            <h2 className='concept-text'>
              3.<br/>Build your Dream Team!
            </h2>
          </div>

        </div>

        <div className='slideshow'>
          <img
            src={slideshowPhotos[photoIndex]}
            alt="Premier League Team"
            className="slideshow-image"
          />
        </div>

      </div>

      <div className='team-selection'>

        <div className = 'team-selector'>

          <div className='team-selection-padding'>

            <div className='team-selection-background'>

              <div className='team-picker'>

                <img
                  src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/left${isHoveredLeft ? '-hover' : ''}.png`}
                  onMouseEnter={() => setIsHoveredLeft(true)}
                  onMouseLeave={() => setIsHoveredLeft(false)}
                  onClick={handleLeftClick}
                  className='arrow-button'
                  alt="left arrow"
                />

                <div className='logo-container'>
                  <img
                    src={teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].logo : DREAM_TEAM_LOGO}
                    className="team-logo"
                    alt={teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias + ' logo' : 'Dream Team Transfers Logo'}
                  />
                </div>

                <img
                  src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/right${isHoveredRight ? '-hover' : ''}.png`}
                  onMouseEnter={() => setIsHoveredRight(true)}
                  onMouseLeave={() => setIsHoveredRight(false)}
                  onClick={handleRightClick}
                  className='arrow-button'
                  alt='right arrow'
                />

              </div>

              <div className='team-name'>

                <h1 style={{ color: teamIndex !== null ? '#FFFFFF' : '#000000' }}>
                  {teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias : 'Select a Team'}
                </h1>

              </div>

            </div>

          </div>

        </div>

        <div className='selection-summary-and-submit'>

          <div className='team-summary'>

            <div className='team-value'>

              <div className='category'>
                Value
              </div>

              <div className='money'>
                {CURRENCY_UNIT} {selectedTeam !== null ? getCurrencyRounded(PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value) : '?'}
              </div>

              <div className='unit'>
                {selectedTeam !== null ? getCurrencyDenomination(PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value) : ''}
              </div>

            </div>

            <div className='team-budget'>

              <div className='category'>
                Budget
              </div>

              <div className='money'>
                {CURRENCY_UNIT} {selectedTeam !== null ? getCurrencyRounded(PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget) : '?'}
              </div>

              <div className='unit'>
                {selectedTeam !== null ? getCurrencyDenomination(PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget) : ''}
              </div>

            </div>

          </div>

          <div className='submit-button'>
            <SubmitButton
              team={selectedTeam}
              disabled={selectedTeam === null}
              onClick={handleSubmit}
            >
              {selectedTeam !== null ? `Dream the Perfect ${PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].alias}!` : 'Please Pick a Team'}
            </SubmitButton>
          </div>

        </div>

      </div>

    </div>
  )
  );
}

export default HomePage;
