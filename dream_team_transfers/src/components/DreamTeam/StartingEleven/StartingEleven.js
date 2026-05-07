import './StartingEleven.css';
import { DEFAULT_FORMATION, FORMATIONS } from '../../../utils/formations';
import {
  getTeamData,
  updateLineup,
  updateSelectedFormation,
} from '../../../db/db-utils';
import React, { useEffect, useRef, useState } from 'react';
import calculateAge from '../../../utils/calculate-age';
import { POSITION_CIRCLES } from '../../../utils/positions';

const MOBILE_BREAKPOINT = '(max-width: 768px)';
const SLOT_POSITION_ALIASES = {
  ST: 'CF',
  CAM: 'AM',
  CDM: 'DM',
  LWB: 'LB',
  RWB: 'RB',
};
const SURNAME_PREFIXES = new Set([
  'al',
  'da',
  'das',
  'de',
  'del',
  'den',
  'der',
  'des',
  'di',
  'do',
  'dos',
  'du',
  'el',
  'la',
  'le',
  'ten',
  'ter',
  'van',
  'von',
]);

const getMobileCardName = (playerName) => {
  const nameParts = String(playerName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length <= 1) return nameParts[0] || '';

  let surnameStartIndex = nameParts.length - 1;
  while (
    surnameStartIndex > 0 &&
    SURNAME_PREFIXES.has(nameParts[surnameStartIndex - 1].toLowerCase())
  ) {
    surnameStartIndex -= 1;
  }

  return nameParts.slice(surnameStartIndex).join(' ');
};

const getMobileNameFitClass = (displayName) => {
  const nameLength = Array.from(String(displayName || '').replace(/\s+/g, ''))
    .length;

  if (nameLength >= 12) return 'is-tiny';
  if (nameLength >= 8) return 'is-compact';
  return '';
};

const getValidFormation = (formation) =>
  FORMATIONS[formation] ? formation : DEFAULT_FORMATION;

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

  const [lineup, setLineup] = React.useState([]);
  const [subs, setSubs] = React.useState([]);
  const [teamBadge, setTeamBadge] = React.useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFormation, setSelectedFormation] =
    React.useState(DEFAULT_FORMATION);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [activeMobileDrawer, setActiveMobileDrawer] = useState(null);
  const [mobilePickerSlotIndex, setMobilePickerSlotIndex] = useState(null);
  const [selectedMobilePlayerId, setSelectedMobilePlayerId] = useState(null);
  const [mobileDragState, setMobileDragState] = useState(null);
  const mobileDragStateRef = useRef(null);
  const suppressNextMobileClickRef = useRef(false);

  const positions = FORMATIONS[selectedFormation];
  const subsPerPage = 9;
  const flatPositions = positions.flat();

  // read from db
  useEffect(() => {
    if (!PlayersCSVData || !NationsCSVData || !PositionsCSVData) {
      console.log('StartingEleven: CSV data not ready yet', {
        PlayersCSVData: PlayersCSVData?.length,
        NationsCSVData: NationsCSVData?.length,
        PositionsCSVData: PositionsCSVData?.length,
      });
      return;
    }

    console.log('StartingEleven: CSV data ready, loading team data...');
    getTeamData().then((data) => {
      console.log('StartingEleven: Team data loaded:', data);
      setPlayersSold(data.players_sold);
      setPlayersBought(data.players_bought);
      setTeamPicked(data.team_picked);
      setKitUpdates(data.team_kit_updates);
      setLineup(data.team_positions || new Array(11).fill(null));
      setSelectedFormation(getValidFormation(data.selected_formation));
    });
  }, [PlayersCSVData, NationsCSVData, PositionsCSVData]);

  useEffect(() => {
    if (Number(teamPicked) === -1) return;
    if (TeamsCSVData === null) return;
    setTeamBadge(TeamsCSVData[Number(teamPicked)].team_crest_big_pic);
  }, [teamPicked, TeamsCSVData]);

  useEffect(() => {
    setLineup((prevLineup) => {
      const newLineup = [...prevLineup];

      while (newLineup.length < 11) {
        newLineup.push(null);
      }

      return newLineup.slice(0, 11);
    });
  }, [selectedFormation]);

  useEffect(() => {
    const teamPlayersUpdate = [];

    if (PlayersCSVData === null) return;

    for (let i = 0; i < PlayersCSVData.length; i++) {
      const playerId = Number(PlayersCSVData[i].player_id);
      if (
        playersBought.map((id) => Number(id)).includes(playerId) ||
        (!playersSold.map((id) => Number(id)).includes(playerId) &&
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

    const availableSubs = teamPlayersUpdate
      .map((player) => player.player_id)
      .filter((playerId) => !lineup.includes(playerId));

    setSubs(availableSubs);
  }, [
    playersSold,
    playersBought,
    PlayersCSVData,
    teamPicked,
    lineup,
    kitUpdates,
  ]);

  useEffect(() => {
    const relevantNationsUpdate = {};
    const relevantPositionsUpdate = {};

    if (
      NationsCSVData === null ||
      PositionsCSVData === null ||
      NationsCSVData.length <= 0 ||
      PositionsCSVData.length <= 0
    )
      return;

    for (let i = 0; i < teamPlayers.length; i++) {
      if (!relevantNationsUpdate[teamPlayers[i].nation_id]) {
        const nation = NationsCSVData.find(
          (n) => Number(n.nation_id) === teamPlayers[i].nation_id
        );
        if (nation) {
          relevantNationsUpdate[teamPlayers[i].nation_id] = {
            nation_name: nation.nation_name,
            nation_pic: nation.nation_flag_small_pic,
          };
        }
      }

      if (!relevantPositionsUpdate[teamPlayers[i].position_id]) {
        const position = PositionsCSVData.find(
          (p) => Number(p.position_id) === teamPlayers[i].position_id
        );
        if (position) {
          relevantPositionsUpdate[teamPlayers[i].position_id] = {
            position_acronym: position.position_acronym,
            position_name: position.position_name,
            position_grouping: position.position_grouping,
          };
        }
      }
    }

    setRelevantNations(relevantNationsUpdate);
    setRelevantPositions(relevantPositionsUpdate);
  }, [teamPlayers, NationsCSVData, PositionsCSVData]);

  const handleDragStart = (e, playerId, fromLineup = false) => {
    e.dataTransfer.setData('playerId', playerId);
    e.dataTransfer.setData('fromLineup', fromLineup);
  };

  const isMobileViewport = () =>
    typeof window !== 'undefined' && window.matchMedia(MOBILE_BREAKPOINT).matches;

  const getPlayerById = (playerId) => {
    if (playerId === null || playerId === undefined) return undefined;
    return teamPlayers.find((player) => player.player_id === Number(playerId));
  };

  const closeMobileDrawer = () => {
    setActiveMobileDrawer(null);
    setMobilePickerSlotIndex(null);
  };

  const openMobilePlayerDrawer = (slotIndex = null) => {
    setMobilePickerSlotIndex(slotIndex);
    setActiveMobileDrawer('players');
  };

  const openMobileFormationDrawer = () => {
    setMobilePickerSlotIndex(null);
    setActiveMobileDrawer('formations');
  };

  const getNormalizedSlotAcronym = (slotIndex) => {
    const slotPosition = flatPositions[slotIndex];
    return SLOT_POSITION_ALIASES[slotPosition] || slotPosition;
  };

  const getSlotGrouping = (slotIndex) => {
    const normalizedSlotAcronym = getNormalizedSlotAcronym(slotIndex);
    const position = PositionsCSVData?.find(
      (p) => p.position_acronym === normalizedSlotAcronym
    );

    return position?.position_grouping || null;
  };

  const getPlayerCompatibilityRank = (playerId, slotIndex) => {
    if (slotIndex === null || slotIndex === undefined) return 0;

    const player = getPlayerById(playerId);
    const playerPosition = player
      ? relevantPositions[player.position_id]
      : null;
    const slotGrouping = getSlotGrouping(slotIndex);

    if (!playerPosition) return 3;
    if (playerPosition.position_acronym === getNormalizedSlotAcronym(slotIndex)) {
      return 0;
    }
    if (slotGrouping && playerPosition.position_grouping === slotGrouping) {
      return 1;
    }
    return 2;
  };

  const getCompatibilityLabel = (playerId) => {
    if (mobilePickerSlotIndex === null || mobilePickerSlotIndex === undefined) {
      return '';
    }

    const rank = getPlayerCompatibilityRank(playerId, mobilePickerSlotIndex);
    if (rank === 0) return 'Exact';
    if (rank === 1) return 'Role';
    return 'Any';
  };

  const getMobilePickerPlayerIds = () => {
    const playerIds =
      mobilePickerSlotIndex !== null && mobilePickerSlotIndex !== undefined
        ? teamPlayers.map((player) => player.player_id)
        : subs;

    if (mobilePickerSlotIndex === null || mobilePickerSlotIndex === undefined) {
      return playerIds;
    }

    return [...playerIds].sort((a, b) => {
      const rankDifference =
        getPlayerCompatibilityRank(a, mobilePickerSlotIndex) -
        getPlayerCompatibilityRank(b, mobilePickerSlotIndex);
      if (rankDifference !== 0) return rankDifference;

      const playerA = getPlayerById(a);
      const playerB = getPlayerById(b);
      return (
        Number(playerB?.player_market_value || 0) -
          Number(playerA?.player_market_value || 0) ||
        String(playerA?.player_name || '').localeCompare(
          String(playerB?.player_name || '')
        )
      );
    });
  };

  const placePlayerInSlot = (playerId, targetIndex) => {
    const normalizedPlayerId = Number(playerId);
    if (Number.isNaN(normalizedPlayerId)) return;

    const newLineup = [...lineup];
    const replacedPlayer = lineup[targetIndex];
    const sourceIndex = newLineup.indexOf(normalizedPlayerId);

    if (sourceIndex !== -1) {
      [newLineup[sourceIndex], newLineup[targetIndex]] = [
        newLineup[targetIndex],
        newLineup[sourceIndex],
      ];
    } else {
      newLineup[targetIndex] = normalizedPlayerId;
      const newSubs = subs.filter((sub) => Number(sub) !== normalizedPlayerId);
      if (replacedPlayer !== null && replacedPlayer !== undefined) {
        newSubs.push(replacedPlayer);
      }
      setSubs(newSubs);
    }

    setLineup(newLineup);
    setSelectedMobilePlayerId(null);
    updateLineup(newLineup);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const playerId = Number(e.dataTransfer.getData('playerId'));

    placePlayerInSlot(playerId, targetIndex);
  };

  const handleSlotClick = (targetIndex) => {
    if (!isMobileViewport()) {
      return;
    }

    if (selectedMobilePlayerId !== null) {
      placePlayerInSlot(selectedMobilePlayerId, targetIndex);
      return;
    }

    openMobilePlayerDrawer(targetIndex);
  };

  const handleMobilePlayerSelect = (playerId) => {
    if (
      mobilePickerSlotIndex !== null &&
      mobilePickerSlotIndex !== undefined
    ) {
      placePlayerInSlot(playerId, mobilePickerSlotIndex);
      closeMobileDrawer();
      return;
    }

    setSelectedMobilePlayerId(Number(playerId));
    closeMobileDrawer();
  };

  const handleFormationChange = (formation) => {
    const nextFormation = getValidFormation(formation);

    setSelectedFormation(nextFormation);

    if (nextFormation !== selectedFormation) {
      updateSelectedFormation(nextFormation).catch((error) => {
        console.error('Error updating selected formation:', error);
      });
    }
  };

  const updateMobileDragState = (nextDragState) => {
    mobileDragStateRef.current = nextDragState;
    setMobileDragState(nextDragState);
  };

  const handleMobilePointerDown = (e, playerId) => {
    if (!isMobileViewport()) return;

    const nextDragState = {
      playerId: Number(playerId),
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      dragging: false,
    };

    updateMobileDragState(nextDragState);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleMobilePointerMove = (e) => {
    const currentDragState = mobileDragStateRef.current;
    if (!currentDragState) return;

    const dragDistance = Math.hypot(
      e.clientX - currentDragState.startX,
      e.clientY - currentDragState.startY
    );
    const dragging = currentDragState.dragging || dragDistance > 8;

    if (dragging) {
      e.preventDefault();
    }

    updateMobileDragState({
      ...currentDragState,
      x: e.clientX,
      y: e.clientY,
      dragging,
    });
  };

  const handleMobilePointerUp = (e) => {
    const currentDragState = mobileDragStateRef.current;
    if (!currentDragState) return;

    if (currentDragState.dragging) {
      suppressNextMobileClickRef.current = true;
      const dropTarget = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest('.player-slot');
      const slotIndex = Number(dropTarget?.dataset.slotIndex);

      if (!Number.isNaN(slotIndex)) {
        placePlayerInSlot(currentDragState.playerId, slotIndex);
        closeMobileDrawer();
      }

      window.setTimeout(() => {
        suppressNextMobileClickRef.current = false;
      }, 0);
    }

    updateMobileDragState(null);
  };

  const handleMobilePointerCancel = () => {
    updateMobileDragState(null);
  };

  const getPlayerCard = (playerId, pos = '', isSub = true) => {
    if (teamPlayers.length === 0) return null;

    const player = getPlayerById(playerId);
    if (
      !player ||
      !relevantPositions[player.position_id] ||
      !relevantNations[player.nation_id]
    )
      return null;

    const positionColor =
      POSITION_CIRCLES[relevantPositions[player.position_id].position_grouping];
    const isSelected = selectedMobilePlayerId === Number(playerId);
    const mobileCardName = getMobileCardName(player.player_name);

    return isSub ? (
      <div className={`sub-card ${isSelected ? 'is-selected' : ''}`} draggable>
        <div className="card-header">
          <div className="player-info">
            <span className="kit-number">{player.player_kit_number}</span>
            <span className="position-text">
              {relevantPositions[player.position_id].position_acronym}
            </span>
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
        <div className="image-container">
          <img
            src={player.player_portrait}
            alt={player.player_name}
            className="card-portrait"
            draggable={false}
          />
        </div>
        <div className="card-footer">
          <span className="name">{player.player_name}</span>
        </div>
      </div>
    ) : (
      <div
        className={`starter-card ${isSelected ? 'is-selected' : ''}`}
        draggable
      >
        <div className="card-header">
          <div className="player-info">
            <span className="kit-number">{player.player_kit_number}</span>
            <span className="position-text">{pos}</span>
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
        <div className="image-container">
          <img
            src={player.player_portrait}
            alt={player.player_name}
            className="card-portrait"
            draggable={false}
          />
        </div>
        <div className="card-footer">
          <span className="name name-full">{player.player_name}</span>
          <span
            className={`name name-mobile ${getMobileNameFitClass(
              mobileCardName
            )}`}
            title={player.player_name}
          >
            {mobileCardName}
          </span>
        </div>
      </div>
    );
  };

  const getPlayerDrawerRow = (playerId) => {
    const player = getPlayerById(playerId);

    if (
      !player ||
      !relevantPositions[player.position_id] ||
      !relevantNations[player.nation_id]
    )
      return null;

    const position = relevantPositions[player.position_id];
    const positionColor = POSITION_CIRCLES[position.position_grouping];
    const compatibilityLabel = getCompatibilityLabel(playerId);

    return (
      <button
        type="button"
        className={`mobile-squad-row ${
          selectedMobilePlayerId === Number(playerId) ? 'is-selected' : ''
        }`}
        onClick={() => {
          if (suppressNextMobileClickRef.current) return;
          handleMobilePlayerSelect(playerId);
        }}
      >
        <img
          src={player.player_portrait}
          alt={player.player_name}
          className="mobile-squad-portrait"
          draggable={false}
        />
        <span className="mobile-squad-details">
          <span className="mobile-squad-name">{player.player_name}</span>
          <span className="mobile-squad-meta">
            <span className="mobile-squad-kit">{player.player_kit_number}</span>
            <span
              className="mobile-squad-position-dot"
              style={{ backgroundColor: positionColor }}
            ></span>
            {position.position_acronym}
            <img
              src={relevantNations[player.nation_id]?.nation_pic}
              alt=""
              className="mobile-squad-flag"
            />
          </span>
        </span>
        {compatibilityLabel && (
          <span
            className={`mobile-squad-fit rank-${compatibilityLabel.toLowerCase()}`}
          >
            {compatibilityLabel}
          </span>
        )}
        <span
          className="mobile-squad-drag-handle"
          aria-hidden="true"
          onPointerDown={(e) => handleMobilePointerDown(e, playerId)}
          onPointerMove={handleMobilePointerMove}
          onPointerUp={handleMobilePointerUp}
          onPointerCancel={handleMobilePointerCancel}
        >
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
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

  const selectedMobilePlayer = getPlayerById(selectedMobilePlayerId);
  const draggedMobilePlayer = getPlayerById(mobileDragState?.playerId);
  const mobilePickerPlayerIds = getMobilePickerPlayerIds();
  const mobilePickerSlotPosition =
    mobilePickerSlotIndex !== null && mobilePickerSlotIndex !== undefined
      ? flatPositions[mobilePickerSlotIndex]
      : null;

  return (
    <div className="starting-eleven">
      <div className="starting-eleven-container">
        <div className="soccer-field-container">
          {selectedMobilePlayer && (
            <div className="mobile-selected-player">
              <span>Selected: {selectedMobilePlayer.player_name}</span>
              <button
                type="button"
                onClick={() => setSelectedMobilePlayerId(null)}
              >
                Cancel
              </button>
            </div>
          )}
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
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, flatIndex)}
                      onClick={() => handleSlotClick(flatIndex)}
                      data-slot-index={flatIndex}
                      className={`player-slot ${
                        playerId !== null && playerId !== undefined
                          ? 'has-player'
                          : ''
                      }`}
                    >
                      {playerId !== null && playerId !== undefined ? (
                        <div
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, playerId, true)
                          }
                          className="draggable-player"
                        >
                          {getPlayerCard(playerId, pos, false)}
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
            value={selectedFormation}
            onChange={(e) => handleFormationChange(e.target.value)}
            className="formation-selector"
          >
            {Object.keys(FORMATIONS).map((formation) => (
              <option key={formation} value={formation}>
                {formation}
              </option>
            ))}
          </select>
          <img src={teamBadge} alt="Team Badge" className="team-badge" />
          <div className="mobile-control-bar">
            <button
              type="button"
              className="mobile-control-button"
              onClick={openMobileFormationDrawer}
            >
              <span>Formation</span>
              <strong>{selectedFormation}</strong>
            </button>
            <button
              type="button"
              className="mobile-control-button"
              onClick={() => openMobilePlayerDrawer(null)}
            >
              <span>Squad</span>
              <strong>{subs.length}</strong>
            </button>
          </div>
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
      {activeMobileDrawer === 'players' && (
        <div
          className={`mobile-drawer-overlay ${
            mobileDragState?.dragging ? 'is-dragging' : ''
          }`}
          onClick={closeMobileDrawer}
        >
          <div
            className="mobile-bottom-drawer mobile-player-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div>
                <h2>
                  {mobilePickerSlotPosition
                    ? `Pick ${mobilePickerSlotPosition}`
                    : 'Squad'}
                </h2>
                {mobilePickerSlotPosition && (
                  <p>Exact positions first, then similar roles.</p>
                )}
              </div>
              <button type="button" onClick={closeMobileDrawer}>
                Close
              </button>
            </div>
            <div className="mobile-squad-list">
              {mobilePickerPlayerIds.length === 0 ? (
                <div className="mobile-squad-empty">
                  No players available
                </div>
              ) : (
                mobilePickerPlayerIds.map((subId) => (
                  <React.Fragment key={subId}>
                    {getPlayerDrawerRow(subId)}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {activeMobileDrawer === 'formations' && (
        <div className="mobile-drawer-overlay" onClick={closeMobileDrawer}>
          <div
            className="mobile-bottom-drawer mobile-formation-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div>
                <h2>Formation</h2>
                <p>Choose how the pitch is arranged.</p>
              </div>
              <button type="button" onClick={closeMobileDrawer}>
                Close
              </button>
            </div>
            <div className="mobile-formation-list">
              {Object.keys(FORMATIONS).map((formation) => (
                <button
                  key={formation}
                  type="button"
                  className={`mobile-formation-option ${
                    selectedFormation === formation ? 'is-active' : ''
                  }`}
                  onClick={() => {
                    handleFormationChange(formation);
                    closeMobileDrawer();
                  }}
                >
                  <span>{formation}</span>
                  {selectedFormation === formation && <strong>Current</strong>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {mobileDragState?.dragging && draggedMobilePlayer && (
        <div
          className="mobile-drag-preview"
          style={{
            left: mobileDragState.x,
            top: mobileDragState.y,
          }}
        >
          <img
            src={draggedMobilePlayer.player_portrait}
            alt=""
            draggable={false}
          />
          <span>{draggedMobilePlayer.player_name}</span>
        </div>
      )}
    </div>
  );
}

export default StartingEleven;
