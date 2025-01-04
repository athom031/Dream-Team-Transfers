import './HomePage.css';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';

function HomePage() {
  const [teamIndex, setTeamIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [slideshowPhotos, setSlideshowPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);

  const DREAM_TEAM_LOGO = process.env.PUBLIC_URL + '/logo512.png';

  const SubmitButton = styled.button`
    background-color: ${props => props.backgroundColor};
    color: ${props => props.color};
    border: 2px solid ${props => props.borderColor};
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: ${props => darken(0.1, props.backgroundColor)};
      color: ${props => darken(0.1, props.color)};
      border-color: ${props => darken(0.1, props.borderColor)};
    }
  `;

  useEffect(() => {
    // this code activates when teamIndex changes

    // clear any existing timeouts
    if(hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // set a new timeout to track how long user stays on team selected
    const newTimeout = setTimeout(() => {
      setSelectedTeam(teamIndex);
    }, 1000); // 1 second

    setHoverTimeout(newTimeout);
    // Clear the timeout when the component unmounts

    return () => {
      clearTimeout(hoverTimeout);
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

  return (
    <div className='home-page'>

      <div className='title'>
        <h1>
          DREAM TEAM TRANSFERS
        </h1>
      </div>

      <div className='intro'>

        <div className='concept'>
          Concept Introduction goes here!
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
        <div className='team-picker'>
          <img
            src={`${process.env.PUBLIC_URL}/assets/left-arrow${isHoveredLeft ? '-hover' : ''}.png`}
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
            <div className='team-name'>
              <h1 style={{ color: teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].primary_color : '#000000' }}>
                {teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias : 'Select a Team'}
              </h1>
            </div>
          </div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/right-arrow${isHoveredRight ? '-hover' : ''}.png`}
            onMouseEnter={() => setIsHoveredRight(true)}
            onMouseLeave={() => setIsHoveredRight(false)}
            onClick={handleRightClick}
            className='arrow-button'
            alt='right arrow'
          />
        </div>

        <div className='selection-summary-and-submit'>

          <div className='team-summary'>
            <div className='team-value'>
              {'Value: ' + (selectedTeam !== null ? `€ ${PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value / 1000000}` : '?') + ' Million'}
            </div>
            <div className='team-budget'>
              {'Budget: ' + (selectedTeam !== null ? `€ ${PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget / 1000000}` : '?') + ' Million'}
            </div>
          </div>

          <div className='submit-button'>
          <SubmitButton
            backgroundColor={selectedTeam !== null ? PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].primary_color : '#808080'}
            color={selectedTeam !== null ? PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].secondary_color : '#FFFFFF'}
            borderColor={selectedTeam !== null ? PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].third_color : '#5A5A5A'}
          >
            Submit
          </SubmitButton>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HomePage;
