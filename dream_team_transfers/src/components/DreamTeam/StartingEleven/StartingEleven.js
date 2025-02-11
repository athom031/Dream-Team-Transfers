import './StartingEleven.css';
import { FORMATIONS } from '../../../utils/formations';
import { getTeamData } from '../../../db/db-utils';
import React, { useEffect, useState } from 'react';
import calculateAge from '../../../utils/calculate-age';
import { POSITION_CIRCLES } from '../../../utils/positions';
import { updateLineup } from '../../../db/db-utils';

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
  const [playersSold, setPlayersSold] = useState([]);
  const [playersBought, setPlayersBought] = useState([]);
  const [kitUpdates, setKitUpdates] = useState({});
  // writing to db
  const [positionsPicked, setPositionsPicked] = useState([]);

  const [lineup, setLineup] = React.useState([]);
  const [subs, setSubs] = React.useState([]);
  const [teamBadge, setTeamBadge] = React.useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFormation, setSelectedFormation] = React.useState('4-3-3');
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);

  const positions = FORMATIONS[selectedFormation];
  const subsPerPage = 9;

  // read from db
  useEffect(() => {
    getTeamData().then((data) => {
      setPlayersSold(data.players_sold);
      setPlayersBought(data.players_bought);
      setTeamPicked(data.team_picked);
      setPositionsPicked(data.team_positions || new Array(11).fill(null));
      setKitUpdates(data.team_kit_updates);
      setLineup(data.team_positions || new Array(11).fill(null)); // Load saved lineup
    });
  }, []);

  useEffect(() => {
    if (Number(teamPicked) === -1) return;
    if (TeamsCSVData === null) return;
    setTeamBadge(TeamsCSVData[Number(teamPicked)].team_crest_big_pic);
  }, [teamPicked, TeamsCSVData]);

  useEffect(() => {
    setLineup((prevLineup) => {
      const newLineup = [...prevLineup];

      // Ensure lineup always has 11 slots
      while (newLineup.length < 11) {
        newLineup.push(null);
      }

      return newLineup.slice(0, 11); // Trim excess (if any) and keep 11 slots
    });
  }, [selectedFormation]);

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
          player_kit_number: kitUpdates[Number(player_id)]
            ? Number(kitUpdates[Number(player_id)])
            : Number(player_kit_number),
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

    // Filter out players already in the starting lineup (lineup should not include any subs)
    const availableSubs = teamPlayersUpdate
      .map((player) => player.player_id)
      .filter((playerId) => !lineup.includes(playerId));

    setSubs(availableSubs);
  }, [playersSold, playersBought, PlayersCSVData, teamPicked, lineup]); // Make sure to include lineup in the dependency array

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

  const handleDragStart = (e, playerId, fromLineup = false) => {
    e.dataTransfer.setData('playerId', playerId);
    e.dataTransfer.setData('fromLineup', fromLineup);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const playerId = Number(e.dataTransfer.getData('playerId'));
    const fromLineup = e.dataTransfer.getData('fromLineup') === 'true'; // Check if dragged from lineup

    if (!playerId) return;

    const replacedPlayer = lineup[targetIndex];

    // If dragging within lineup, swap positions
    let newLineup = [...lineup];
    if (fromLineup) {
      const sourceIndex = lineup.indexOf(playerId);
      if (sourceIndex !== -1) {
        [newLineup[sourceIndex], newLineup[targetIndex]] = [
          newLineup[targetIndex],
          newLineup[sourceIndex],
        ];
      }
    } else {
      // If dragging from subs, move player to lineup
      if (!lineup.includes(playerId)) {
        newLineup[targetIndex] = playerId;
        const newSubs = subs.filter((sub) => sub !== playerId);
        if (replacedPlayer) {
          newSubs.push(replacedPlayer);
        }
        setSubs(newSubs);
      }
    }

    // Update lineup state
    setLineup(newLineup);

    // Write changes to the database
    updateLineup(newLineup);
  };

  const getPlayerCard = (playerId) => {
    if (teamPlayers.length === 0) return null;

    const player = teamPlayers.find(
      (player) => player.player_id === Number(playerId)
    );
    if (
      !player ||
      !relevantPositions[player.position_id] ||
      !relevantNations[player.nation_id]
    )
      return null;

    const positionColor =
      POSITION_CIRCLES[relevantPositions[player.position_id].position_grouping];

    return (
      <div className="player-card" draggable>
        <div className="player-card-header">
          <span className="kit-number">{player.player_kit_number}</span>
          <div className="player-info">
            <span
              className="position-badge"
              style={{ backgroundColor: positionColor }}
            ></span>
            <img
              src={relevantNations[player.nation_id]?.nation_pic}
              alt="nation"
              className="nation-flag"
            />
          </div>
        </div>
        <div className="player-image-container">
          <img
            src={player.player_portrait}
            alt={player.player_name}
            className="player-card-portrait"
            draggable={false}
          />
        </div>
        <div className="player-card-footer">
          <span className="player-name">{player.player_name}</span>
        </div>
      </div>
    );
  };

  const paginatedSubs = subs.slice(
    currentPage * subsPerPage,
    (currentPage + 1) * subsPerPage
  );

  const handleRightClick = () => {
    if ((currentPage + 1) * subsPerPage < subs.length) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0);
    }
  };

  const handleLeftClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(Math.ceil(subs.length / subsPerPage) - 1);
    }
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
                  const playerId = lineup[flatIndex];

                  return (
                    <div
                      key={colIndex}
                      onDragOver={(e) => e.preventDefault()} // Allow drop
                      onDrop={(e) => handleDrop(e, flatIndex)}
                      className="player-slot"
                    >
                      {playerId ? (
                        <div
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, playerId, true)
                          }
                          className="draggable-player"
                        >
                          {getPlayerCard(playerId)}
                        </div>
                      ) : (
                        pos
                      )}
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
          <img src={teamBadge} alt="Team Badge" className="team-badge" />
        </div>
        <div className="subs-bench-container">
          <div className="subs-pagination-controls">
            {/* LEFT ARROW */}
            <img
              src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/left${isHoveredLeft ? '-hover' : ''}.png`}
              onMouseEnter={() => setIsHoveredLeft(true)}
              onMouseLeave={() => setIsHoveredLeft(false)}
              onClick={handleLeftClick}
              className="arrow-button"
              alt="left arrow"
            />

            {/* Subs 3x3 Grid */}
            <div className="subs-bench-grid">
              {paginatedSubs.map((subId, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, subId)}
                  className="sub"
                >
                  {getPlayerCard(subId)}
                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <img
              src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/right${isHoveredRight ? '-hover' : ''}.png`}
              onMouseEnter={() => setIsHoveredRight(true)}
              onMouseLeave={() => setIsHoveredRight(false)}
              onClick={handleRightClick}
              className="arrow-button"
              alt="right arrow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartingEleven;
