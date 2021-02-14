import fs from "fs";
import { ChildProcess, fork } from "child_process";
import { ipcMain, IpcMainEvent } from "electron";
import db from "../database";
import path from "path";
import Logger from "../logger";
import { IpcActions } from "../../common/constants";
import { Filter, OverviewStats } from "../../common/types";
import _ from "lodash";

class Backend {
  process: ChildProcess | null;
  subscriptions: { id: number; event: IpcMainEvent }[];
  logger: Logger;

  constructor() {
    this.subscriptions = [];
    this.process = null;
    this.logger = new Logger();
  }

  startLogParser() {
    try {
      this.stopLogParser();
      db.getConfig((data) => {
        if (data) {
          const config = data.reduce(
            (obj, row) => ({ ...obj, [row.setting]: row.value }),
            {} as { [key: string]: string }
          );
          if (fs.existsSync(config.logFile)) {
            try {
              this.process = fork(
                path.resolve(__dirname, "logParser.js"),
                [config.logFile],
                {
                  stdio: ["pipe", "pipe", "pipe", "ipc"],
                }
              );
            } catch (e) {
              this.logger.writeError("startLogParser", e);
            }
            if (this.process) {
              this.logger.writeLine("LogParser", "started");
              const processEvent = (type: string) => (e: Error) =>
                this.logger.writeLine("LogParser", type, e?.message ?? e);

              this.process.on("error", processEvent("error"));
              this.process.on("close", processEvent("close"));
              this.process.on("disconnect", processEvent("disconnect"));
              this.process.on("exit", processEvent("exit"));

              this.process.on("message", ([action, message]) => {
                this.logger.writeLine(
                  "message",
                  action,
                  JSON.stringify(message)
                );
                this.route(action, message);
              });
            }
          }
        }
      });
    } catch (e) {
      this.logger.writeError("startLogParser", e);
    }
  }

  stopLogParser() {
    if (this.process) {
      this.process.kill();
    }
  }

  addSubscription(id: number, event: IpcMainEvent) {
    if (!this.subscriptions.some((sub) => sub.id === id)) {
      this.subscriptions = [...this.subscriptions, { id, event }];
    }
  }

  removeSubscription(id: number) {
    this.subscriptions = this.subscriptions.filter((x) => x.id !== id);
  }

  run() {
    this.startLogParser();
    ipcMain.on(IpcActions.subscribe, (event) => {
      this.addSubscription(event.frameId, event);
      event.reply("status", "Connected");
    });

    ipcMain.on(IpcActions.unsubscribe, (event) => {
      this.removeSubscription(event.frameId);
    });

    ipcMain.on(IpcActions.get_config, (event) => {
      db.getConfig((data) => {
        if (data) {
          const config = data.reduce((obj, row) => {
            return { ...obj, [row.setting]: row.value };
          }, {});
          event.reply(`${IpcActions.get_config}_reply`, config);
        }
      });
    });

    ipcMain.on(IpcActions.set_config, (event, args) => {
      db.setConfig(args, () => {
        this.startLogParser();
        this.route(`${IpcActions.set_config}_reply`, "");
        this.route(IpcActions.update, "");
      });
    });

    ipcMain.on(IpcActions.get_player, (event) => {
      db.getPlayer((data) => {
        if (data) {
          const player = data.reduce((obj, row) => {
            return { ...obj, [row.property]: row.value };
          }, {});
          event.reply(`${IpcActions.get_player}_reply`, player);
        }
      });
    });

    ipcMain.on(IpcActions.get_stats, (event, args: { filter: Filter }) => {
      db.getWinLoss(args, (data) => {
        if (data) {
          const replyObj: OverviewStats = data.reduce(
            (obj, row) => ({
              ...obj,
              [row.match_type]: { ...row },
            }),
            {
              ranked: { wins: 0, losses: 0 },
              casual: { wins: 0, losses: 0 },
              challenge: { wins: 0, losses: 0 },
            } as OverviewStats
          );
          event.reply(`${IpcActions.get_stats}_reply`, replyObj);
        }
      });
    });

    ipcMain.on(
      IpcActions.get_character_winrate,
      (event, args: { filter: Filter; character: string }) => {
        db.getWinratePivot(args, (data) => {
          if (data) {
            const response = _.keyBy(data, "opponent");
            event.reply(`${IpcActions.get_character_winrate}_reply`, response);
          }
        });
      }
    );

    ipcMain.on(
      IpcActions.get_character_overview,
      (event, args: { character: string; filter: Filter }) => {
        db.getCharacterOverview(args, (data) => {
          if (data) {
            event.reply(`${IpcActions.get_character_overview}_reply`, data[0]);
          }
        });
      }
    );

    ipcMain.on(IpcActions.get_game_results, (event, args) => {
      db.getGameResults(args, (data) => {
        if (data) {
          event.reply(`${IpcActions.get_game_results}_reply`, data);
        }
      });
    });
    ipcMain.on(IpcActions.get_rank, (event) => {
      db.getRank((data) => {
        if (data) {
          event.reply(`${IpcActions.get_rank}_reply`, data);
        }
      });
    });
  }

  stop() {
    this.stopLogParser();
    ipcMain.removeAllListeners();
  }

  route(action: string, message: string) {
    this.subscriptions.forEach((sub) => sub.event.reply(action, message));
  }
}

export default Backend;
