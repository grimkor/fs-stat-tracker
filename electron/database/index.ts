import {Database} from "sqlite3";
import {Config, DatabaseCallback, DatabaseInput, Game, Match, Player, SetPlayerInput, WinLoss,} from "../types";

const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");

const homedir = require("os").homedir();
const createGameTable = `
create table IF NOT EXISTS game
(
    player_character TEXT,
    player_score     integer,
    opp_character    TEXT,
    opp_score        integer,
    match_id         integer
        references match,
    constraint game_pk
        unique (player_character, opp_character, match_id)
);
`;

const createMatchTable = `
create table IF NOT EXISTS match
(
    id               integer not null
        constraint match_pk
            primary key autoincrement,
    match_id         TEXT not null,
    timestamp        INTEGER default CURRENT_TIMESTAMP,
    player_league    integer,
    player_rank      integer,
    player_stars     integer,
    opp_id           integer,
    opp_name         TEXT,
    opp_platform     TEXT,
    opp_platform_id  integer,
    opp_input_config integer,
    opp_league       integer,
    opp_rank         integer,
    match_type       TEXT
);
`;

const createConfigTable = `
create table IF NOT EXISTS config
(
    setting TEXT
        constraint config_pk
            primary key,
    value   TEXT
);

create unique index config_setting_uindex
    on config (setting);
`;

const createPlayerTable = `
create table player
(
    property TEXT not null
        constraint player_pk
            primary key,
    value    TEXT
);

create unique index player_property_uindex
    on player (property);
`;

const getDatabase = (callback: (err: Error | null, db: Database) => void) => {
  const newDb = !fs.existsSync(path.join(homedir, "fs-stat-tracker.db"));
  const db = new sqlite3.Database(
    path.join(homedir, "fs-stat-tracker.db"),
    (err: Error | null) => {
      if (!err && newDb) {
        db.serialize(() => {
          db.run(createConfigTable);
          db.run(createMatchTable);
          db.run(createGameTable);
          db.run(createPlayerTable);
          callback(err, db);
        });
      } else {
        callback(err, db);
      }
    }
  );
  return db;
};

const getConfig = (callback: DatabaseCallback<Config[]>) => {
  getDatabase((err, db) => {
    db.all(`SELECT * from config`, callback);
  });
};

const setConfig = (
  config: DatabaseInput,
  callback: DatabaseCallback<undefined>
) => {
  getDatabase((err, db) => {
    db.serialize(() => {
      const statement = db.prepare(`
    INSERT OR REPLACE INTO config 
    (setting, value) VALUES (?, ?)
    `);
      Object.entries(config).forEach(([key, value]) =>
        statement.run(key, value)
      );
      statement.finalize(callback);
    });
  });
};

const getPlayer = (callback: DatabaseCallback<Player[]>) => {
  getDatabase((err, db) => {
    db.all(`SELECT * from player`, callback);
  });
};

const setPlayer = (
  player: SetPlayerInput,
  callback?: DatabaseCallback<undefined>
) => {
  getDatabase((err, db) => {
    db.serialize(() => {
      const statement = db.prepare(`
    INSERT OR REPLACE INTO player 
    (property, value) VALUES (?, ?)
    `);
      Object.entries(player).forEach(([key, value]) =>
        statement.run(key, value)
      );
      statement.finalize(callback);
    });
  });
};

const insertMatch = (
  match: Match,
  callback: DatabaseCallback<{ id: string }>
) => {
  getDatabase((err, db) => {
    db.get(
      `
      SELECT m.id, m.match_id, m.match_type,
          (case when m.match_type = 'ranked' then 4 else 2 end) as max_games
      FROM match m
      WHERE m.match_id = ?
        AND match_type != 'challenge'
      GROUP BY m.match_id
      HAVING count(*) > max_games
    `,
      [match.matchId],
      (err, res) => {
        if (res) {
          return;
        }
        db.run(
          `
    INSERT OR IGNORE INTO match
    (match_id, match_type, player_league, player_rank, player_stars, opp_id, opp_name, opp_platform, opp_platform_id, opp_input_config, opp_league, opp_rank)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
          [
            match.matchId,
            match.matchType,
            match.playerLeague,
            match.playerRank,
            match.playerStars,
            match.oppId,
            match.oppName,
            match.oppPlatform,
            match.oppPlatformId,
            match.oppInputConfig,
            match.oppLeague,
            match.oppRank,
          ],
          () => {
            db.get("SELECT last_insert_rowid() as id from match", callback);
          }
        );
      }
    );
  });
};

const insertGameResult = (
  game: Game,
  callback: DatabaseCallback<undefined>
) => {
  getDatabase((err, db) => {
    db.serialize(() => {
      db.run(
        `
      INSERT INTO game
      (match_id, player_character, opp_character, player_score, opp_score)
      VALUES
      (?,?,?,?,?)
    `,
        [
          game.match_id,
          game.player_character,
          game.opp_character,
          game.player_score,
          game.opp_score,
        ],
        callback
      );
    });
  });
};

const getWinLoss = (callback: DatabaseCallback<WinLoss[]>) => {
  getDatabase((err, db) => {
    db.serialize(() => {
      db.all(
        `
        select count(id)                                              as total,
               sum(case when win > lose then 1 else 0 end)            as wins,
               sum(case when win < lose then 1 else 0 end)            as losses,
               sum(case when win > lose AND last30 then 1 else 0 end) as wins30,
               sum(case when win < lose AND last30 then 1 else 0 end) as losses30,
               MIN(x.player_rank)                                     as max_rank,
               (SELECT player_rank FROM match ORDER BY timestamp DESC limit 1)      as rank,
               x.match_type
        from (
                 select m.id,
                        m.match_type,
                        player_rank,
                        timestamp,
                        sum(case when g.player_score > g.opp_score then 1 else 0 end)       as win,
                        sum(case when g.player_score < g.opp_score then 1 else 0 end)       as lose,
                        case when timestamp > datetime('now', '-30 days') then 1 else 0 end as last30
                 from match m
                          join game g on m.id = g.match_id
                 group by m.id, m.match_type
             ) x
        group by x.match_type;
    `,
        callback
      );
    });
  });
};

export default {
  getConfig,
  setConfig,
  getPlayer,
  setPlayer,
  getWinLoss,
  insertGameResult,
  insertMatch,
};
