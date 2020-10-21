import {Database} from "sqlite3";
import {
  CharacterOverview,
  Config,
  DatabaseCallback,
  DatabaseInput,
  Game,
  Match,
  Player,
  SetPlayerInput,
  WinLoss,
  WinratePivot,
} from "../types";
import Logger from "../logger";

const sqlite3 = require("sqlite3");
const path = require("path");
const homedir = require("os").homedir();
const logger = new Logger();

export const getDatabase = (callback: (db: Database) => void) => {
  const db = new sqlite3.Database(
    path.join(homedir, "fs-stat-tracker.db"),
    (err: Error | null) => {
      if (err) {
        logger.writeError("getDatabase", err.name, err.message);
      } else {
        callback(db);
      }
    }
  );
  return db;
};

const getConfig = (callback: DatabaseCallback<Config[]>) => {
  getDatabase((db) => {
    db.all(
      `SELECT * from config`,
      logger.withErrorHandling<Config[]>("getConfig", callback)
    );
  });
};

const setConfig = (
  config: DatabaseInput,
  callback?: DatabaseCallback<undefined>
) => {
  getDatabase((db) => {
    try {
      db.serialize(() => {
        const statement = db.prepare(
          `
    INSERT OR REPLACE INTO config 
    (setting, value) VALUES (?, ?)
    `,
          logger.withErrorHandling("setConfig")
        );
        Object.entries(config).forEach(([key, value]) =>
          statement.run(key, value)
        );
        statement.finalize(
          logger.withErrorHandling<undefined>("setConfig", callback)
        );
      });
    } catch (e) {
      logger.writeError("setConfig", e);
    }
  });
};

const getPlayer = (callback: DatabaseCallback<Player[]>) => {
  getDatabase((db) => {
    db.all(
      `SELECT * from player`,
      logger.withErrorHandling("getPlayer", callback)
    );
  });
};

const setPlayer = (
  player: SetPlayerInput,
  callback?: DatabaseCallback<undefined>
) => {
  getDatabase((db) => {
    db.serialize(() => {
      const statement = db.prepare(`
    INSERT OR REPLACE INTO player 
    (property, value) VALUES (?, ?)
    `);
      Object.entries(player).forEach(([key, value]) =>
        statement.run(key, value)
      );
      statement.finalize(
        logger.withErrorHandling<undefined>("setPlayer", callback)
      );
    });
  });
};

const insertMatch = (
  match: Match,
  callback: DatabaseCallback<{ id: string }>
) => {
  getDatabase((db) => {
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
      logger.withErrorHandling("insertMatch", (res) => {
        if (res) {
          return;
        }
        db.run(
          `
          INSERT OR IGNORE INTO match
          (match_id, match_type, player_league, player_rank, player_stars, opp_id, opp_name, opp_platform, opp_platform_id,
           opp_input_config, opp_league, opp_rank)
          SELECT ?,
                 (select id from match_type where type = ?),
                 ?,
                 ?,
                 ?,
                 ?,
                 ?,
                 ?,
                 ?,
                 ?,
                 ?,
                 ?
          ;
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
            db.get(
              "SELECT last_insert_rowid() as id from match",
              logger.withErrorHandling<{ id: string }>("insertMatch", callback)
            );
          }
        );
      })
    );
  });
};

const insertGameResult = (
  game: Game,
  callback: DatabaseCallback<undefined>
) => {
  getDatabase((db) => {
    db.serialize(() => {
      db.run(
        `
        INSERT INTO game (player_character, player_score, opp_character, opp_score, match_id)
        SELECT (select id from character where name = ?), ?, (select id from character where name = ?), ?, ?;
    `,
        [
          game.match_id,
          game.player_character,
          game.opp_character,
          game.player_score,
          game.opp_score,
        ],
        logger.withErrorHandling<undefined>("insertGameResult", callback)
      );
    });
  });
};

const getWinLoss = (callback: DatabaseCallback<WinLoss[]>) => {
  getDatabase((db) => {
    db.all(
      `
        select count(x.id)                                                     as total,
               sum(case when win > lose then 1 else 0 end)                     as wins,
               sum(case when win < lose then 1 else 0 end)                     as losses,
               sum(case when win > lose AND last30 then 1 else 0 end)          as wins30,
               sum(case when win < lose AND last30 then 1 else 0 end)          as losses30,
               MIN(x.player_rank)                                              as max_rank,
               (SELECT player_rank FROM match ORDER BY timestamp DESC limit 1) as rank,
               mt.type                                                         as match_type
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
                 join match_type mt on mt.id = x.match_type
        group by x.match_type;
    `,
      logger.withErrorHandling("getWinLoss", callback)
    );
  });
};

const getWinratePivot = (
  matchTypes: number[],
  callback: DatabaseCallback<WinratePivot[]>
) => {
  getDatabase((db) =>
    db.all(
      `
      select c.name                                                        as player,
             c2.name                                                       as opponent,
             sum(case when g.player_score > g.opp_score then 1 else 0 end) as wins,
             sum(case when g.player_score < g.opp_score then 1 else 0 end) as losses
      from character c
               cross join character c2
               left join (SELECT *
                          from game g
                                   join match m on g.match_id = m.id
                          where match_type in (${matchTypes.join()})
               ) g
                         on g.player_character = c.id and g.opp_character = c2.id
      group by c.name, c2.name;
      `,
      logger.withErrorHandling("getWinratePivot", callback)
    )
  );
};

const getCharacterOverview = (
  matchTypes: number[],
  callback: DatabaseCallback<CharacterOverview[]>
) => {
  getDatabase((db) => {
    db.all(
      `
      select c.name,
             sum(case when g.player_score > g.opp_score then 1 else 0 end) as wins,
             sum(case when g.player_score < g.opp_score then 1 else 0 end) as losses
      from character c
               left outer join (select *
                                from game
                                         join match m on game.match_id = m.id
                                where match_type in (${matchTypes.join()})
      ) g on c.id = g.player_character
      group by c.id
    `,
      logger.withErrorHandling("getCharacterOverview", callback)
    );
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
  getWinratePivot,
  getCharacterOverview,
};
