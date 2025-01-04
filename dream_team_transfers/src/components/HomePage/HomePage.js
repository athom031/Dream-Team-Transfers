import './HomePage.css';

import React, { useEffect, useState, useRef } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';

function HomePage() {
  const [teamIndex, setTeamIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [slideshowPhotos, setSlideshowPhotos] = useState([]);

  const DREAM_TEAM_LOGO = process.env.PUBLIC_URL + '/logo512.png';

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const sliderRef = useRef(null);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 4000); // 1 second delay
    return () => clearTimeout(timeoutId);
  }, []);


  useEffect(() => {
    // this code activates when teamIndex changes

    // clear any existing timeouts
    if(hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // set a new timeout to track how long user stays on team selected
    const newTimeout = setTimeout(() => {
      setSelectedTeam(teamIndex);
      console.log(teamIndex !== null ? `${PREMIER_LEAGUE_TEAM_INFOS[teamIndex].name} picked` : 'No team selected');
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

    setSlideshowPhotos(newPhotos);
  }, [selectedTeam]);

  const handleLeftClick = () => {
    if(teamIndex === null) {
      setTeamIndex(19);
    } else {
      setTeamIndex((teamIndex + 19 /* -1 + 20 */) % 20);
    }
  }

  const handleRightClick = () => {
    if(teamIndex === null) {
      setTeamIndex(0);
    } else {
      setTeamIndex((teamIndex + 1) % 20);
    }
  }

  return (
    <div className='home-page'>

      <div className='title'>
        <h1>
          Dream Team Transfers
        </h1>
      </div>

      <div className='intro'>

        <div className='concept'>
          Concept Introduction goes here!
        </div>

        <div className='slideshow'>
          <Slider ref={sliderRef} {...settings} autoplay autoplaySpeed={4000}>
            {slideshowPhotos.map((photo, index) => (
              <div key={index}>
                <img src={photo} alt="Premier League Team Photo" />
              </div>
            ))}
          </Slider>
        </div>

      </div>

      <div className='team-selection'>

        <div className='team-picker'>
          <button onClick={handleLeftClick}>Left</button>
          <img
            src={teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].logo : DREAM_TEAM_LOGO}
            className="team-logo"
            alt={teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias + ' logo' : 'Dream Team Transfers Logo'}
          />
          <button onClick={handleRightClick}>Right</button>
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
            Final Submit button goes here
          </div>

        </div>

      </div>
    </div>
  );
}

export default HomePage;
