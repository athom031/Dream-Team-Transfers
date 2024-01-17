import Dexie from 'dexie';

export const DB_NAME = 'dream_team_transfers_db';

export const DB_VERSION = 1;

export const DB_ID = 1;

export const DB_SCHEMA = [
    '++id', 
     'team_picked',
    'team_budget',
    'players_sold',
    'players_bought',
    'team_positions',
    'player_kit_numbers',
].join(',');

export const getDb = () => {
    const db = new Dexie(DB_NAME);
    db.version(DB_VERSION).stores({
      team: DB_SCHEMA
    });

    return db;
}

export const putDbField = (field, value) => {
    const db = getDb();

    // return addding to db as a promise
    if (field === 'team_picked') {
        return db.team.put({id: DB_ID, team_picked: value});
    }

    // other fields will be added later
}

export const getDbField = field => {
    const db = getDb();

    // return the promise from db.team.get
    return db.team.get(DB_ID).then((team) => {
        if(team && team[field]) {
            return team[field];
        } else return null;
    });
}

export const clearDb = () => {
    // clear database if we are starting over
    const db = getDb();
    db.team.clear();
    const newDb = getDb();
    return newDb.getDbField('team_picked');
};
