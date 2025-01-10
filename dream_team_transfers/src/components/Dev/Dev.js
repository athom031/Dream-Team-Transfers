import './Dev.css';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';
import React, { useState, useEffect } from 'react';

function Dev() {
  const [brokenLinks, setBrokenLinks] = useState([]);

  const brokenLinkHelper = (team, index) => {
    setBrokenLinks((prevState) => [...prevState, `${team}-${index}`]);
  };

  const ALL_PICTURES = Object.entries(PREMIER_LEAGUE_TEAM_INFOS).flatMap(
    ([key, value]) =>
      value.team_photos.map((url, index) => (
        <div className="team-photo" key={`${key}-${index}`}>
          <img
            src={url}
            alt="Broken Link"
            onError={() => brokenLinkHelper(value.alias, index)}
            width={1}
            height={1}
          />
        </div>
      ))
  );

  // ----
  const [currTeam, setCurrTeam] = useState(-1);
  const [teamPhotos, setTeamPhotos] = useState([]);

  useEffect(() => {
    if (currTeam < 0 || currTeam >= 20) return;

    const teamPhotos = PREMIER_LEAGUE_TEAM_INFOS[currTeam].team_photos.map(
      (url, index) => (
        <div className="team-photo" key={`${currTeam}-${index}`}>
          <h2>
            {PREMIER_LEAGUE_TEAM_INFOS[currTeam].alias}-{index}
          </h2>
          <img src={url} alt="Broken Link" width={200} />
        </div>
      )
    );

    setTeamPhotos(teamPhotos);
  }, [currTeam]);

  return (
    <div className="dev-body">
      <h1>Dev Page</h1>

      <div className="hidden-column">{ALL_PICTURES}</div>

      {brokenLinks.length > 0 && <h2>Broken Links:</h2>}
      <ul>
        {brokenLinks.map((link, index) => (
          <li key={index}>{link}</li>
        ))}
      </ul>

      <hr></hr>

      <button onClick={() => setCurrTeam(currTeam - 1)}>Prev Team</button>
      <button onClick={() => setCurrTeam(currTeam + 1)}>Next Team</button>
      <br></br>
      {currTeam}
      <br></br>
      {teamPhotos}
    </div>
  );
}

export default Dev;

/*


<hr></hr>
        <button onClick={() => setCurrTeam(currTeam - 1)}>Prev Team</button>
        <button onClick={() => setCurrTeam(currTeam + 1)}>Next Team</button>
        <br></br>
        {currTeam}
        <br></br>
        {teamPhotos}
        </div>
*/
