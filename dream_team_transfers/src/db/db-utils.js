import PouchDB from 'pouchdb';

const db = new PouchDB('dtt_database');

export function initializeDB() {
    return db.info().then(function (info) {
        if (info.doc_count === 0) {
            const initialData = {
                _id: 'dtt_data',
                team_picked: '',
                team_nickname: '',
                team_budget: 0,
                team_value: 0,
                team_positions: {},
                players_bought: {},
                players_sold: {},
            };
            return db.put(initialData);
        }
    });
}

export function getTeamData() {
    return db.get('dtt_data');
}
