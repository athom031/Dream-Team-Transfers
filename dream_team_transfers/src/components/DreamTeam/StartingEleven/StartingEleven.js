import './StartingEleven.css';
import { FORMATIONS } from '../../../utils/formations';
import { getTeamData } from '../../../db/db-utils';
import React, { useEffect, useState } from 'react';
import calculateAge from '../../../utils/calculate-age';
import { POSITION_CIRCLES } from '../../../utils/positions';

function StartingEleven({
  NationsCSVData,
  PositionsCSVData,
  PlayersCSVData,
  TeamsCSVData,
}) {
  // reading from db
  const [teamPicked, setTeamPicked] = useState(-1);
  const [relevantNations, setRelevantNations] = useState({});
  const [relevantPositions, setRelevantPositions] = useState({});
  const [teamPlayers, setTeamPlayers] = useState([]);
  // writing to db
  const [playersSold, setPlayersSold] = useState([]);
  const [playersBought, setPlayersBought] = useState([]);
  const [positionsPicked, setPositionsPicked] = useState([]);
  const [kitUpdates, setKitUpdates] = useState({});

  // would define the player positions one here
  const [lineup, setLineup] = React.useState([]);
  const [subs, setSubs] = React.useState([]);

  // read from db
  useEffect(() => {
    getTeamData().then((data) => {
      setPlayersSold(data.players_sold);
      setPlayersBought(data.players_bought);
      setTeamPicked(data.team_picked);
      setPositionsPicked(data.positions_picked);
    });
  }, []);

  useEffect(() => {
    const teamPlayersUpdate = [];

    if (PlayersCSVData === null) return;

    for (let i = 0; i < PlayersCSVData.length; i++) {
      if (
        playersBought.includes(Number(PlayersCSVData[i].player_id)) ||
        (!playersSold.includes(Number(PlayersCSVData[i].player_id)) &&
          Number(PlayersCSVData[i].team_id) === teamPicked)
      ) {
        const {
          nation_id,
          player_birth_date,
          player_id,
          player_kit_number,
          player_market_value,
          player_name,
          player_portrait_big_pic,
          position_id,
        } = PlayersCSVData[i];
        const player = {
          nation_id: Number(nation_id),
          player_birth_date: new Date(player_birth_date),
          player_age: calculateAge(new Date(player_birth_date)),
          player_kit_number:
            kitUpdates[Number(player_id)] ?? Number(player_kit_number),
          player_market_value: Number(player_market_value),
          player_name: player_name,
          player_portrait: player_portrait_big_pic,
          position_id: Number(position_id),
          player_id: Number(player_id),
        };
        teamPlayersUpdate.push(player);
      }
    }

    setTeamPlayers(teamPlayersUpdate);
    setSubs([...teamPlayersUpdate.map((player) => player.player_id)]);
  }, [playersSold, playersBought, PlayersCSVData, teamPicked]);

  useEffect(() => {
    const relevantNationsUpdate = {};
    const relevantPositionsUpdate = {};

    if (
      NationsCSVData == null ||
      PositionsCSVData == null ||
      NationsCSVData.length <= 0 ||
      PositionsCSVData.length <= 0
    )
      return;

    for (let i = 0; i < teamPlayers.length; i++) {
      if (!relevantNationsUpdate[teamPlayers[i].nation_id]) {
        const { nation_name, nation_flag_small_pic } =
          NationsCSVData[teamPlayers[i].nation_id];
        relevantNationsUpdate[teamPlayers[i].nation_id] = {
          nation_name: nation_name,
          nation_pic: nation_flag_small_pic,
        };
      }

      if (!relevantPositionsUpdate[teamPlayers[i].position_id]) {
        const { position_acronym, position_name, position_grouping } =
          PositionsCSVData[teamPlayers[i].position_id];
        relevantPositionsUpdate[teamPlayers[i].position_id] = {
          position_acronym,
          position_name,
          position_grouping,
        };
      }
    }

    setRelevantNations(relevantNationsUpdate);
    setRelevantPositions(relevantPositionsUpdate);
  }, [teamPlayers, NationsCSVData, PositionsCSVData]);

  const [selectedFormation, setSelectedFormation] = React.useState('4-3-3');
  const positions = FORMATIONS[selectedFormation];

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('player', player);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex, isSub) => {
    e.preventDefault();
    const player = e.dataTransfer.getData('player');
    const sourceIndex = lineup.indexOf(player);
    const newLineup = [...lineup];
    const newSubs = [...subs];

    if (sourceIndex !== -1) {
      newLineup[sourceIndex] = newLineup[targetIndex];
      newLineup[targetIndex] = player;
    } else {
      const subIndex = subs.indexOf(player);
      if (subIndex !== -1) {
        if (isSub) {
          [newSubs[subIndex], newSubs[targetIndex]] = [
            newSubs[targetIndex],
            newSubs[subIndex],
          ];
        } else {
          newSubs[subIndex] = newLineup[targetIndex];
          newLineup[targetIndex] = player;
        }
      }
    }

    setLineup(newLineup);
    setSubs(newSubs);
  };

  const getPlayerCard = (playerId) => {
    if (teamPlayers.length === 0) return null;
  
    const player = teamPlayers.find((player) => player.player_id === Number(playerId));
    if (!player || !relevantPositions[player.position_id] || !relevantNations[player.nation_id]) return null;
  
    const positionColor = POSITION_CIRCLES[relevantPositions[player.position_id].position_grouping];
  
    return (
      <div className="player-card" draggable>
        <div className="player-card-header">
          <span className="kit-number">{player.player_kit_number}</span>
          <div className="player-info">
            <span className="position-badge" style={{ backgroundColor: positionColor }}></span>
            <img src={relevantNations[player.nation_id]?.nation_pic} alt="nation" className="nation-flag" />
          </div>
        </div>
        <div className="player-image-container">
          <img src={player.player_portrait} alt={player.player_name} className="player-card-portrait" draggable={false} />
        </div>
        <div className="player-card-footer">
          <span className="player-name">{player.player_name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="starting-eleven">
      <div className="starting-eleven-container">
        <div className="soccer-field-container">
          <div className="lineup-grid">
            {positions.map((row, rowIndex) => (
              <div key={rowIndex} className="lineup-row">
                {row.map((pos, colIndex) => {
                  const flatIndex =
                    positions.slice(0, rowIndex).flat().length + colIndex;
                  return (
                    <div
                      key={colIndex}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, flatIndex, false)}
                      className="player-slot"
                    >
                      <div>{pos}</div>
                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, lineup[flatIndex])
                        }
                        className="player"
                      >
                        {lineup[flatIndex]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <select
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="formation-selector"
          >
            {Object.keys(FORMATIONS).map((formation) => (
              <option key={formation} value={formation}>
                {formation}
              </option>
            ))}
          </select>
        </div>
        <div className="subs-bench-container">
          <h2 className="subs-title">Subs Bench</h2>
          <ul className="subs-bench">
            {subs.map((subId, index) => (
              <li
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, subId)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, true)}
                className="sub"
              >
                {getPlayerCard(subId)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StartingEleven;
