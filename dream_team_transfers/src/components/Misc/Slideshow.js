import React, { useState, useEffect } from 'react';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';

function Slideshow({ selectedTeam }) {
  const [slideshowPhotos, setSlideshowPhotos] = useState([]);

  const [photoIndex, setPhotoIndex] = useState(0);

  const slideshowImageStyle = {
    position: 'absolute',
    top: '5%',
    left: '5%',
    width: '90%',
    height: '90%',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '10px',
  };

  // changes photos shown in slideshow based on team selected
  useEffect(() => {
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
    }

    // we want the order to be randomized
    for (let i = newPhotos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPhotos[i], newPhotos[j]] = [newPhotos[j], newPhotos[i]];
    }

    setPhotoIndex(0);
    setSlideshowPhotos(newPhotos);
  }, [selectedTeam]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhotoIndex((photoIndex + 1) % slideshowPhotos.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [photoIndex, slideshowPhotos]);

  return (
    <div className="slideshow">
      <img
        src={slideshowPhotos[photoIndex]}
        alt="Slideshow"
        className="slideshow-img"
        style={slideshowImageStyle}
      />
    </div>
  );
}

export default Slideshow;
