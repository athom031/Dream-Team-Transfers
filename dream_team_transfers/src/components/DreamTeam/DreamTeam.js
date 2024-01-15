import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './DreamTeam.css';
import { getTeamPicked } from '../../db/db-utils';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';

function DreamTeam() {
  const [teamPicked, setTeamPicked] = useState(null); // Create a state variable for the picked team
  useEffect(() => {
    getTeamPicked().then(pickedTeam => {
      setTeamPicked(pickedTeam); // Update the state variable when the data is fetched
    });
  }, []); // Pass an empty array as the dependency list to run this effect only once, when the component mounts
  return (
    <div>
        Hello World, this is the DreamTeam page for {teamPicked !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamPicked].name : 'Loading'}!
    </div>
  );
}
export default DreamTeam;
