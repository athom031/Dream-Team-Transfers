import PouchDB from 'pouchdb';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../constants/pl-team-infos';

const db = new PouchDB('dtt_database');

export function initializeDB() {
  return db.info().then(function (info) {
    if (info.doc_count === 0) {
      const initialData = {
        _id: 'dtt_data',
        team_picked: -1,
        team_nickname: '',
        team_budget: 0.0,
        team_value: 0.0,
        team_positions: {},
        players_bought: {},
        players_sold: {},
      };
      return db.put(initialData);
    }
  });
}

export function getTeamData() {
  return initializeDB()
    .then(
      () => db.get('dtt_data')
    );
}

export function getTeamPicked() {
  return initializeDB()
    .then(
      () => db.get('dtt_data')
    )
    .then(
      (data) => data.team_picked
    );
}

export function selectTeam(selectedTeam) {
  return initializeDB()
    .then(
      () => {
        return db.get('dtt_data').then(doc => {
          doc.team_picked = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_id;
          doc.team_budget = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget;
          doc.team_value = PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value;
          doc.team_positions = {};
          doc.players_bought = {};
          doc.players_sold = {};

          return db.put(doc);
        });
      }
    );
}
