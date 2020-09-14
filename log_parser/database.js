const sqlite3 = require("sqlite3");
const os = require("os");
const fs = require("fs");
const createGameTable = `
create table game
(
    player_character TEXT,
    player_score     int,
    opp_character    TEXT,
    opp_score        int,
    match_id         int
        references match,
    constraint game_pk
        unique (player_character, opp_character, match_id)
);
`;

const createMatchTable = `
create table match
(
    match_id         TEXT not null
        constraint match_pk
            primary key,
    timestamp        INTEGER default CURRENT_TIMESTAMP,
    player_league    int,
    player_rank      int,
    player_stars     int,
    opp_id           int,
    opp_name         TEXT,
    opp_platform     TEXT,
    opp_platform_id  int,
    opp_input_config int,
    opp_league       int,
    opp_rank         int,
    match_type       TEXT
);
`;

const createConfigTable = `
create table config
(
    setting TEXT
        constraint config_pk
            primary key,
    value   TEXT
);

create unique index config_setting_uindex
    on config (setting);
`;

const getDatabase = () => {
  const newDb = !fs.existsSync("./hello.db");
  const db = new sqlite3.Database("./hello.db", (err) => {
    if (!err && newDb) {
      db.serialize(() => {
        db.run(createConfigTable);
        db.run(createMatchTable);
        db.run(createGameTable);
      });
    }
  });
  return db;
};

const getColumns = (table, callback) => {
  const db = getDatabase();
  db.all(`pragma table_info(${table})`, (err, result) => {
    callback(err, result);
  });
};

const getConfig = (callback) => {
  const db = getDatabase();
  return db.all(`SELECT * from config`, callback);
};

const setConfig = (config) => {
  const db = getDatabase();
  db.serialize(() => {
    const statement = db.prepare(`
    INSERT OR REPLACE INTO config 
    (setting, value) VALUES (?, ?)
    `);
    Object.entries(config).forEach(([key, value]) => statement.run(key, value));
    statement.finalize();
  });
};

const insertGameResult = (game, callback) => {
  const db = getDatabase();
  db.serialize(() => {
    db.run(
      `
      INSERT OR IGNORE INTO match
      (id) VALUES (?)
    `,
      [game.id],
      callback
    );
  });
};

module.exports = {
  getConfig,
  setConfig,
  insertGameResult,
};
