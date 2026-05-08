import PouchDB from 'pouchdb';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../constants/pl-team-infos';
import { DEFAULT_FORMATION } from '../utils/formations';

const db = new PouchDB('dtt_database');
const TEAM_DATA_ID = 'dtt_data';
let initializePromise;

function getEmptyTeam() {
  return new Array(11).fill(null);
}

function getInitialTeamData() {
  return {
    _id: TEAM_DATA_ID,
    team_picked: -1,
    team_nickname: '',
    team_budget: 0.0,
    team_value: 0.0,
    selected_formation: DEFAULT_FORMATION,
    team_positions: getEmptyTeam(),
    team_kit_updates: {},
    players_bought: [],
    players_sold: [],
  };
}

function normalizeTeamData(data) {
  const normalizedData = {
    ...getInitialTeamData(),
    ...data,
  };
  const playersSold = Array.isArray(data?.players_sold)
    ? data.players_sold
    : [];
  const soldPlayerIds = new Set(
    playersSold.map((playerId) => Number(playerId))
  );

  normalizedData.selected_formation =
    data?.selected_formation || DEFAULT_FORMATION;
  normalizedData.team_positions = (
    Array.isArray(data?.team_positions) ? data.team_positions : getEmptyTeam()
  )
    .slice(0, 11)
    .map((playerId) =>
      playerId !== null &&
      playerId !== undefined &&
      soldPlayerIds.has(Number(playerId))
        ? null
        : playerId
    );

  while (normalizedData.team_positions.length < 11) {
    normalizedData.team_positions.push(null);
  }

  normalizedData.team_kit_updates =
    data?.team_kit_updates && typeof data.team_kit_updates === 'object'
      ? data.team_kit_updates
      : {};
  normalizedData.players_bought = Array.isArray(data?.players_bought)
    ? data.players_bought
    : [];
  normalizedData.players_sold = playersSold;

  return normalizedData;
}

export function initializeDB() {
  if (!initializePromise) {
    initializePromise = db
      .get(TEAM_DATA_ID)
      .catch((error) => {
        if (error.status !== 404) throw error;

        return db.put(getInitialTeamData()).catch((putError) => {
          if (putError.status === 409) return null;
          throw putError;
        });
      })
      .then(() => undefined)
      .catch((error) => {
        initializePromise = null;
        console.error('Error in initializeDB:', error);
        throw error;
      });
  }

  return initializePromise;
}

export function getTeamData() {
  return initializeDB()
    .then(() => {
      return db.get(TEAM_DATA_ID);
    })
    .then((data) => {
      return normalizeTeamData(data);
    })
    .catch((error) => {
      console.error('Error in getTeamData:', error);
      throw error;
    });
}

export function getTeamPicked() {
  return initializeDB()
    .then(() => db.get(TEAM_DATA_ID))
    .then((data) => data.team_picked);
}

export function selectTeam(selectedTeam) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      doc.team_picked = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_id;
      doc.team_nickname = '';
      doc.team_budget = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget;
      doc.team_value = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value;
      doc.selected_formation = DEFAULT_FORMATION;
      doc.team_positions = getEmptyTeam();
      doc.team_kit_updates = {};
      doc.players_bought = [];
      doc.players_sold = [];

      return db.put(doc);
    });
  });
}

export function restartTeam() {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      doc.team_picked = -1;
      doc.team_nickname = '';
      doc.team_budget = 0.0;
      doc.team_value = 0.0;
      doc.selected_formation = DEFAULT_FORMATION;
      doc.team_positions = getEmptyTeam();
      doc.team_kit_updates = {};
      doc.players_bought = [];
      doc.players_sold = [];

      return db.put(doc);
    });
  });
}

export function sellPlayer(playerId, playerValue) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      const normalizedPlayerId = Number(playerId);

      doc.team_budget = String(Number(doc.team_budget) + playerValue);
      doc.team_value = String(Number(doc.team_value) - playerValue);
      doc.players_sold = [...doc.players_sold, playerId];
      doc.team_positions = Array.isArray(doc.team_positions)
        ? doc.team_positions.map((lineupPlayerId) =>
            lineupPlayerId !== null &&
            lineupPlayerId !== undefined &&
            Number(lineupPlayerId) === normalizedPlayerId
              ? null
              : lineupPlayerId
          )
        : getEmptyTeam();

      return db.put(doc);
    });
  });
}

export function buyPlayer(playerId, playerValue) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      // Check if we have enough budget
      if (Number(doc.team_budget) < playerValue) {
        throw new Error('Insufficient budget');
      }

      doc.team_budget = String(Number(doc.team_budget) - playerValue);
      doc.team_value = String(Number(doc.team_value) + playerValue);
      doc.players_bought = [...doc.players_bought, playerId];

      return db.put(doc);
    });
  });
}

export function updateLineup(newLineup) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      doc.team_positions = newLineup;
      return db.put(doc);
    });
  });
}

export function updateSelectedFormation(selectedFormation) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      doc.selected_formation = selectedFormation || DEFAULT_FORMATION;
      return db.put(doc);
    });
  });
}

export function updateKitNumber(playerId, playerKitNumber) {
  return initializeDB().then(() => {
    return db.get(TEAM_DATA_ID).then((doc) => {
      doc.team_kit_updates[playerId] = playerKitNumber;
      return db.put(doc);
    });
  });
}
