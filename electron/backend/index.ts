import fs from "fs";
import {ChildProcess, fork} from "child_process";
import {ipcMain, IpcMainEvent} from "electron";
import db from "../database";
import path from "path";
import Logger from "../logger";

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
            (obj, row) => ({...obj, [row.setting]: row.value}),
            {} as { [key: string]: string }
          );
          if (fs.existsSync(config.logFile)) {
            try {
              console.log(path.resolve(__dirname, "logParser.js"));
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
              const processEvent = (type: string) => (e: Error) =>
                this.logger.writeLine("LogParser", "error", e.message ?? e);

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
    ipcMain.on("subscribe", (event) => {
      this.addSubscription(event.frameId, event);
      event.reply("status", "Connected");
    });

    ipcMain.on("unsubscribe", (event) => {
      this.removeSubscription(event.frameId);
    });

    ipcMain.on("get_config", (event) => {
      db.getConfig((data) => {
        if (data) {
          const config = data.reduce((obj, row) => {
            return {...obj, [row.setting]: row.value};
          }, {});
          event.reply("get_config_reply", config);
        }
      });
    });

    ipcMain.on("set_config", (event, args) => {
      db.setConfig(args, () => {
        this.startLogParser();
        this.route("update", "");
      });
    });

    ipcMain.on("get_player", (event) => {
      db.getPlayer((data) => {
        if (data) {
          const player = data.reduce((obj, row) => {
            return {...obj, [row.property]: row.value};
          }, {});
          event.reply("get_player_reply", player);
        }
      });
    });

    ipcMain.on("get_stats", (event) => {
      db.getWinLoss((data) => {
        if (data) {
          const replyObj = data.reduce(
            (obj, row) => ({
              ...obj,
              [row.match_type]: {...row},
            }),
            {}
          );
          event.reply("get_stats_reply", replyObj);
        }
      });
    });
  }

  route(action: string, message: string) {
    this.subscriptions.forEach((sub) => sub.event.reply(action, message));
  }
}

export default Backend;
