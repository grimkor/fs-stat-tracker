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
  WinratePivot,
} from "../types";
import Logger from "../logger";
import {WinLoss} from "../../common/types";

const sqlite3 = require("sqlite3");
const path = require("path");
const homedir = require("os").homedir();
const logger = new Logger();

export const getDatabase = (callback: (db: Database) => void) => {
  try {
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
  } catch (e) {
    logger.writeError("getDatabase", e);
  }
};

const getConfig = (callback: DatabaseCallback<Config[]>) => {
  getDatabase((db) => {
    try {
      db.all(
        `SELECT * from config`,
        logger.withErrorHandling<Config[]>("getConfig", callback)
      );
    } catch (e) {
      logger.writeError("getConfig", e);
    }
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
    try {
      db.all(
        `SELECT * from player`,
        logger.withErrorHandling("getPlayer", callback)
      );
    } catch (e) {
      logger.writeError("getPlayer", e);
    }
  });
};

const setPlayer = (
  player: SetPlayerInput,
  callback?: DatabaseCallback<undefined>
) => {
  getDatabase((db) => {
    try {
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
    } catch (e) {
      logger.writeError("setPlayer", e);
    }
  });
};

const insertMatch = (
  match: Match,
  callback: DatabaseCallback<{ id: string }>
) => {
  getDatabase((db) => {
    try {
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
    } catch (e) {
      logger.writeError("insertMatch", e);
    }
  });
};

const insertGameResult = (
  game: Game,
  callback: DatabaseCallback<undefined>
) => {
  getDatabase((db) => {
    try {
      db.serialize(() => {
        db.run(
          `
        INSERT INTO game (player_character, player_score, opp_character, opp_score, match_id)
        SELECT (select id from character where name = ?), ?, (select id from character where name = ?), ?, ?;
    `,
          [
            game.player_character,
            game.player_score,
            game.opp_character,
            game.opp_score,
            game.match_id,
          ],
          logger.withErrorHandling<undefined>("insertGameResult", callback)
        );
      });
    } catch (e) {
      logger.writeError("insertGameResult", e);
    }
  });
};

const getWinLoss = (callback: DatabaseCallback<WinLoss[]>) => {
  getDatabase((db) => {
    try {
      db.all(
        `
        select count(x.id)                                 as total,
               sum(case when win > lose then 1 else 0 end) as wins,
               sum(case when win < lose then 1 else 0 end) as losses,
               mt.type                                     as match_type
        from match_type mt
                 left join (
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
        ) x on mt.id = x.match_type
        group by x.match_type;
        `,
        logger.withErrorHandling("getWinLoss", callback)
      );
    } catch (e) {
      logger.writeError("getWinLoss", e);
    }
  });
};

const getWinratePivot = (
  args: {
    filter: number[];
    character: string;
  },
  callback: DatabaseCallback<WinratePivot[]>
) => {
  if (!args.filter) {
    return;
  }
  getDatabase((db) => {
    try {
      db.all(
        `
        select c2.name                                                       as opponent,
               sum(case when g.player_score > g.opp_score then 1 else 0 end) as wins,
               sum(case when g.player_score < g.opp_score then 1 else 0 end) as losses
        from character c
                 cross join character c2
                 left join (SELECT *
                            from game g
                                     join match m on g.match_id = m.id
                            where match_type in (${args.filter.join()})
                 ) g
                           on g.player_character = c.id and g.opp_character = c2.id
        where c.name = '${args.character}'
        group by c2.name;
        `,
        logger.withErrorHandling("getWinratePivot callback", callback)
      );
    } catch (e) {
      logger.writeError("getWinratePivot", e);
    }
  });
};

const getCharacterOverview = (
  args: { character?: string; filter: number[] },
  callback: DatabaseCallback<CharacterOverview[]>
) => {
  getDatabase((db) => {
    try {
      if (args) {
        db.all(
          `
        select c.name,
               sum(case when g.player_score > g.opp_score then 1 else 0 end) as wins,
               sum(case when g.player_score < g.opp_score then 1 else 0 end) as losses
        from character c
                 left outer join (select *
                                  from game
                                           join match m on game.match_id = m.id
                                  where match_type in (${args.filter.join()})
        ) g on c.id = g.player_character
        ${args.character ? `where c.name = '${args.character}'` : ""}
        group by c.id
    `,
          logger.withErrorHandling("getCharacterOverview", callback)
        );
      }
    } catch (e) {
      logger.writeError("getCharacterOverview", e);
    }
  });
};

const getGameResults = (
  args: { filter: number[]; character?: string; limit?: number },
  callback: DatabaseCallback<CharacterOverview[]>
) => {
  getDatabase((db) => {
    try {
      db.all(
        `
        select c.name as player, c2.name as opponent,
        (case when g.player_score > g.opp_score then 1 else 0 end) as win,
        m.*,
        g.player_score,
        g.opp_score
        
        from game g
        join match m on g.match_id = m.id
        join character c on g.player_character = c.id
        join character c2 on g.opp_character = c2.id
        
        where m.match_type in (${args.filter.join()})
        ${args.character ? `and c.name = '${args.character}'` : ""}
        ${args.limit ? `limit ${args.limit}` : ""}
        
        ;`,
        logger.withErrorHandling("getGameResults", callback)
      );
    } catch (e) {
      logger.writeError("getGameResults", e);
    }
  });
};

const getRank = (callback: DatabaseCallback<CharacterOverview[]>) => {
  getDatabase((db) => {
    try {
      db.get(
        `
        SELECT m.player_rank, player_league
        from match m
        where match_type = 2
        order by m.timestamp desc
        limit 1;
        `,
        logger.withErrorHandling("getRank", callback)
      );
    } catch (e) {
      logger.writeError("getRank", e);
    }
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
  getGameResults,
  getRank,
};
