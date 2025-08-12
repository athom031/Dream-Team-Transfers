import PouchDB from 'pouchdb';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../constants/pl-team-infos';

const db = new PouchDB('dtt_database');

function getEmptyTeam() {
  return new Array(11).fill(null);
}

export function initializeDB() {
  return db
    .info()
    .then(function (info) {
      if (info.doc_count === 0) {
        const initialData = {
          _id: 'dtt_data',
          team_picked: -1,
          team_nickname: '',
          team_budget: 0.0,
          team_value: 0.0,
          team_positions: getEmptyTeam(),
          team_kit_updates: {},
          players_bought: [],
          players_sold: [],
        };
        return db.put(initialData);
      } else {
        return Promise.resolve();
      }
    })
    .catch((error) => {
      console.error('Error in initializeDB:', error);
      throw error;
    });
}

export function getTeamData() {
  return initializeDB()
    .then(() => {
      return db.get('dtt_data');
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error in getTeamData:', error);
      throw error;
    });
}

export function getTeamPicked() {
  return initializeDB()
    .then(() => db.get('dtt_data'))
    .then((data) => data.team_picked);
}

export function selectTeam(selectedTeam) {
  return initializeDB().then(() => {
    return db.get('dtt_data').then((doc) => {
      doc.team_picked = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_id;
      doc.team_nickname = '';
      doc.team_budget = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget;
      doc.team_value = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value;
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
    return db.get('dtt_data').then((doc) => {
      doc.team_picked = -1;
      doc.team_nickname = '';
      doc.team_budget = 0.0;
      doc.team_value = 0.0;
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
    return db.get('dtt_data').then((doc) => {
      doc.team_budget = String(Number(doc.team_budget) + playerValue);
      doc.team_value = String(Number(doc.team_value) - playerValue);
      doc.players_sold = [...doc.players_sold, playerId];

      return db.put(doc);
    });
  });
}

export function buyPlayer(playerId, playerValue) {
  return initializeDB().then(() => {
    return db.get('dtt_data').then((doc) => {
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
    return db.get('dtt_data').then((doc) => {
      doc.team_positions = newLineup;
      return db.put(doc);
    });
  });
}

export function updateKitNumber(playerId, playerKitNumber) {
  return initializeDB().then(() => {
    return db.get('dtt_data').then((doc) => {
      doc.team_kit_updates[playerId] = playerKitNumber;
      return db.put(doc);
    });
  });
}
