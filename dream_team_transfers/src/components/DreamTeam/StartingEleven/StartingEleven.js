import './StartingEleven.css';
import { DEFAULT_FORMATION, FORMATIONS } from '../../../utils/formations';
import {
  getTeamData,
  updateLineup,
  updateSelectedFormation,
} from '../../../db/db-utils';
import React, { useEffect, useRef, useState } from 'react';
import calculateAge from '../../../utils/calculate-age';
import {
  getGeneratedNationFlagPath,
  getGeneratedPlayerPortraitPath,
  getGeneratedTeamCrestPath,
  getRemoteFallbackImage,
} from '../../../utils/local-assets';
import { POSITION_CIRCLES } from '../../../utils/positions';
import { sortPlayersBySquadOrder } from '../../../utils/player-sort';

const MOBILE_BREAKPOINT = '(max-width: 768px)';
const EXPORT_WIDTH = 390;
const EXPORT_HEIGHT = 844;
const EXPORT_HEADER_HEIGHT = 76;
const EXPORT_META_HEIGHT = 42;
const EXPORT_PITCH_TOP = EXPORT_HEADER_HEIGHT + EXPORT_META_HEIGHT;
const EXPORT_PITCH_BOTTOM = EXPORT_HEIGHT;
const EXPORT_CARD_WIDTH = 68;
const EXPORT_CARD_HEIGHT = 92;
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
  const nameLength = Array.from(
    String(displayName || '').replace(/\s+/g, '')
  ).length;

  if (nameLength >= 12) return 'is-tiny';
  if (nameLength >= 8) return 'is-compact';
  return '';
};

const getValidFormation = (formation) =>
  FORMATIONS[formation] ? formation : DEFAULT_FORMATION;

const getPlayerInitials = (playerName) =>
  String(playerName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const loadExportImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const loadBestExportImage = async (...sources) => {
  for (const source of sources.filter(Boolean)) {
    const image = await loadExportImage(source);
    if (image) return image;
  }

  return null;
};

const drawRoundedRect = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
};

const drawContainedImage = (context, image, x, y, width, height) => {
  if (!image) return;

  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  const drawWidth = imageRatio > targetRatio ? width : height * imageRatio;
  const drawHeight = imageRatio > targetRatio ? width / imageRatio : height;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
};

const drawWrappedCenteredText = (context, text, x, y, maxWidth, lineHeight) => {
  const words = String(text || '')
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width <= maxWidth || !currentLine) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  lines.slice(0, 2).forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
};

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
  const [isExportingTeam, setIsExportingTeam] = useState(false);
  const [exportError, setExportError] = useState('');
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
    const selectedTeam = TeamsCSVData.find(
      (team) => Number(team.team_id) === Number(teamPicked)
    );
    if (selectedTeam) {
      setTeamBadge(selectedTeam.team_crest_small_pic);
    }
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
          player_portrait_local: getGeneratedPlayerPortraitPath(player_id),
          position_id: Number(position_id),
          player_id: Number(player_id),
        };
        teamPlayersUpdate.push(player);
      }
    }

    const rankedTeamPlayers = sortPlayersBySquadOrder(teamPlayersUpdate);

    setTeamPlayers(rankedTeamPlayers);

    const availableSubs = rankedTeamPlayers
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
            nation_pic_local: getGeneratedNationFlagPath(nation.nation_id),
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
    typeof window !== 'undefined' &&
    window.matchMedia(MOBILE_BREAKPOINT).matches;

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
    if (
      playerPosition.position_acronym === getNormalizedSlotAcronym(slotIndex)
    ) {
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
    if (mobilePickerSlotIndex !== null && mobilePickerSlotIndex !== undefined) {
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

  const downloadTeamExport = async () => {
    if (isExportingTeam) return;

    setIsExportingTeam(true);
    setExportError('');

    try {
      const canvas = document.createElement('canvas');
      const scale = 2;
      canvas.width = EXPORT_WIDTH * scale;
      canvas.height = EXPORT_HEIGHT * scale;

      const context = canvas.getContext('2d');
      context.scale(scale, scale);
      context.textBaseline = 'middle';

      context.fillStyle = '#fdf5e6';
      context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

      context.fillStyle = '#b98f44';
      context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEADER_HEIGHT);
      context.strokeStyle = '#000';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(0, EXPORT_HEADER_HEIGHT);
      context.lineTo(EXPORT_WIDTH, EXPORT_HEADER_HEIGHT);
      context.stroke();

      const [dreamTeamLogo, exportedTeamBadge] = await Promise.all([
        loadExportImage(
          `${process.env.PUBLIC_URL}/assets/navbar-icons/logo.png`
        ),
        loadBestExportImage(getGeneratedTeamCrestPath(teamPicked), teamBadge),
      ]);

      drawContainedImage(context, dreamTeamLogo, 18, 14, 48, 48);
      context.fillStyle = '#000';
      context.font = '800 30px "Saira Condensed", Arial, sans-serif';
      context.letterSpacing = '0px';
      context.fillText('Dream Team', 74, 39);
      drawContainedImage(context, exportedTeamBadge, 324, 14, 48, 48);

      context.fillStyle = '#454545';
      context.fillRect(
        0,
        EXPORT_HEADER_HEIGHT,
        EXPORT_WIDTH,
        EXPORT_META_HEIGHT
      );
      context.fillStyle = '#fff';
      context.font = '800 17px "Saira Condensed", Arial, sans-serif';
      context.fillText('Starting XI', 18, 97);
      context.fillStyle = '#b98f44';
      context.textAlign = 'right';
      context.fillText(selectedFormation, 372, 97);
      context.textAlign = 'left';

      context.fillStyle = '#38a169';
      context.fillRect(
        0,
        EXPORT_PITCH_TOP,
        EXPORT_WIDTH,
        EXPORT_PITCH_BOTTOM - EXPORT_PITCH_TOP
      );

      const pitchTop = EXPORT_PITCH_TOP + EXPORT_CARD_HEIGHT / 2 + 14;
      const pitchBottom = EXPORT_PITCH_BOTTOM - EXPORT_CARD_HEIGHT / 2 - 18;
      const pitchHeight = pitchBottom - pitchTop;
      const rowCount = positions.length;
      const rowGap = rowCount > 1 ? pitchHeight / (rowCount - 1) : 0;

      for (let rowIndex = 0; rowIndex < positions.length; rowIndex++) {
        const row = positions[rowIndex];
        const centerY = pitchTop + rowIndex * rowGap;

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const pos = row[colIndex];
          const flatIndex =
            positions.slice(0, rowIndex).flat().length + colIndex;
          const playerId = lineup[flatIndex];
          const centerX = ((colIndex + 1) * EXPORT_WIDTH) / (row.length + 1);
          const player = getPlayerById(playerId);

          if (
            !player ||
            !relevantPositions[player.position_id] ||
            !relevantNations[player.nation_id]
          ) {
            context.fillStyle = '#f4e996';
            context.strokeStyle = '#b89e5b';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(centerX, centerY, 37, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.fillStyle = '#000';
            context.font = '800 18px Arial, sans-serif';
            context.textAlign = 'center';
            context.fillText(pos, centerX, centerY);
            context.textAlign = 'left';
            continue;
          }

          const cardWidth = EXPORT_CARD_WIDTH;
          const cardHeight = EXPORT_CARD_HEIGHT;
          const cardX = centerX - cardWidth / 2;
          const cardY = centerY - cardHeight / 2;
          const positionColor =
            POSITION_CIRCLES[
              relevantPositions[player.position_id].position_grouping
            ];
          const [portrait, flag] = await Promise.all([
            loadBestExportImage(
              player.player_portrait_local,
              player.player_portrait
            ),
            loadBestExportImage(
              relevantNations[player.nation_id]?.nation_pic_local,
              relevantNations[player.nation_id]?.nation_pic
            ),
          ]);

          drawRoundedRect(context, cardX, cardY, cardWidth, cardHeight, 8);
          context.fillStyle = '#f4e996';
          context.fill();
          context.strokeStyle = '#b89e5b';
          context.lineWidth = 2;
          context.stroke();

          context.fillStyle = 'rgba(0, 0, 0, 0.8)';
          drawRoundedRect(context, cardX + 5, cardY + 4, 20, 16, 4);
          context.fill();
          context.fillStyle = '#fff';
          context.font = '800 10px Arial, sans-serif';
          context.textAlign = 'center';
          context.fillText(
            String(player.player_kit_number),
            cardX + 15,
            cardY + 12
          );

          context.fillStyle = '#333';
          context.fillText(pos, cardX + 35, cardY + 12);
          context.fillStyle = positionColor;
          context.strokeStyle = '#000';
          context.lineWidth = 1;
          context.beginPath();
          context.arc(cardX + 48, cardY + 12, 5, 0, Math.PI * 2);
          context.fill();
          context.stroke();
          drawContainedImage(context, flag, cardX + 56, cardY + 6, 12, 12);

          if (portrait) {
            context.save();
            drawRoundedRect(context, cardX + 15, cardY + 24, 38, 46, 5);
            context.clip();
            drawContainedImage(
              context,
              portrait,
              cardX + 15,
              cardY + 24,
              38,
              46
            );
            context.restore();
          } else {
            context.fillStyle = '#ffffff';
            drawRoundedRect(context, cardX + 15, cardY + 24, 38, 46, 5);
            context.fill();
            context.fillStyle = '#454545';
            context.font = '800 18px Arial, sans-serif';
            context.fillText(
              getPlayerInitials(player.player_name),
              cardX + cardWidth / 2,
              cardY + 47
            );
          }

          context.fillStyle = 'rgba(255, 255, 255, 0.35)';
          drawRoundedRect(context, cardX + 4, cardY + 74, cardWidth - 8, 15, 5);
          context.fill();
          context.fillStyle = '#000';
          context.font = '800 9px Arial, sans-serif';
          const displayName = getMobileCardName(player.player_name);
          drawWrappedCenteredText(
            context,
            displayName,
            cardX + cardWidth / 2,
            cardY + 79,
            cardWidth - 12,
            8
          );
          context.textAlign = 'left';
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `dream-team-${selectedFormation.toLowerCase()}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (error) {
      console.error('Could not export dream team image:', error);
      setExportError('Could not export image. Please try again.');
    } finally {
      setIsExportingTeam(false);
    }
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
              src={relevantNations[player.nation_id]?.nation_pic_local}
              alt="nation"
              className="nation-flag"
              onError={(e) =>
                getRemoteFallbackImage(
                  e,
                  relevantNations[player.nation_id]?.nation_pic
                )
              }
            />
          </div>
        </div>
        <div className="image-container">
          <img
            src={player.player_portrait_local}
            alt={player.player_name}
            className="card-portrait"
            onError={(e) => getRemoteFallbackImage(e, player.player_portrait)}
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
              src={relevantNations[player.nation_id]?.nation_pic_local}
              alt="nation"
              className="nation-flag"
              onError={(e) =>
                getRemoteFallbackImage(
                  e,
                  relevantNations[player.nation_id]?.nation_pic
                )
              }
            />
          </div>
        </div>
        <div className="image-container">
          <img
            src={player.player_portrait_local}
            alt={player.player_name}
            className="card-portrait"
            onError={(e) => getRemoteFallbackImage(e, player.player_portrait)}
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
          src={player.player_portrait_local}
          alt={player.player_name}
          className="mobile-squad-portrait"
          onError={(e) => getRemoteFallbackImage(e, player.player_portrait)}
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
              src={relevantNations[player.nation_id]?.nation_pic_local}
              alt=""
              className="mobile-squad-flag"
              onError={(e) =>
                getRemoteFallbackImage(
                  e,
                  relevantNations[player.nation_id]?.nation_pic
                )
              }
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
  const totalSubPages = Math.max(1, Math.ceil(subs.length / subsPerPage));

  const handleRightClick = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalSubPages);
  };

  const handleLeftClick = () => {
    setCurrentPage(
      (prevPage) => (prevPage + totalSubPages - 1) % totalSubPages
    );
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

          <div className="desktop-team-controls">
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
            <button
              type="button"
              className="team-export-button desktop-export-button"
              onClick={downloadTeamExport}
              disabled={isExportingTeam}
            >
              {isExportingTeam ? 'Exporting' : 'Export Team'}
            </button>
          </div>
          {exportError && (
            <div className="team-export-error">{exportError}</div>
          )}
          <img
            src={getGeneratedTeamCrestPath(teamPicked)}
            alt="Team Badge"
            className="team-badge"
            onError={(e) => getRemoteFallbackImage(e, teamBadge)}
          />
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
            <button
              type="button"
              className="mobile-control-button"
              onClick={downloadTeamExport}
              disabled={isExportingTeam}
            >
              <span>Share</span>
              <strong>{isExportingTeam ? 'Saving' : 'Export'}</strong>
            </button>
          </div>
        </div>
        <div className="subs-bench-container">
          <div className="subs-pagination-controls">
            {/* LEFT ARROW */}
            <button
              type="button"
              className="bench-arrow-button"
              onMouseEnter={() => setIsHoveredLeft(true)}
              onMouseLeave={() => setIsHoveredLeft(false)}
              onClick={handleLeftClick}
              aria-label="Previous bench page"
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/left${isHoveredLeft ? '-hover' : ''}.png`}
                className="bench-arrow-image"
                alt=""
              />
            </button>

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
            <button
              type="button"
              className="bench-arrow-button"
              onMouseEnter={() => setIsHoveredRight(true)}
              onMouseLeave={() => setIsHoveredRight(false)}
              onClick={handleRightClick}
              aria-label="Next bench page"
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/right${isHoveredRight ? '-hover' : ''}.png`}
                className="bench-arrow-image"
                alt=""
              />
            </button>
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
                <div className="mobile-squad-empty">No players available</div>
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
            src={draggedMobilePlayer.player_portrait_local}
            alt=""
            onError={(e) =>
              getRemoteFallbackImage(e, draggedMobilePlayer.player_portrait)
            }
            draggable={false}
          />
          <span>{draggedMobilePlayer.player_name}</span>
        </div>
      )}
    </div>
  );
}

export default StartingEleven;
