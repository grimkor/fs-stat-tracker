import fs from "fs";
import { ChildProcess, fork } from "child_process";
import { ipcMain, IpcMainEvent } from "electron";
import db from "../database";
import path from "path";

class Backend {
  process: ChildProcess | null;
  subscriptions: { id: number; event: IpcMainEvent }[];

  constructor() {
    this.subscriptions = [];
    this.process = null;
  }

  startLogger() {
    try {
      this.stopLogger();
      db.getConfig((err, data) => {
        if (err) {
          throw err;
        }
        if (data) {
          const config = data.reduce(
            (obj, row) => ({ ...obj, [row.setting]: row.value }),
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
              throw e;
            }
            this.process.on("error", (e) =>
              console.error("error", e?.message ?? e)
            );
            this.process.on("close", (e) => console.log("close", e));
            this.process.on("disconnect", () => console.log("disconnected"));
            this.process.on("exit", (e) => console.log("exit", e));

            this.process.on("message", ([action, message]) => {
              console.log("message", action, message);
              this.route(action, message);
            });
          }
        }
      });
    } catch (e) {
      throw e;
    }
  }

  stopLogger() {
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
    this.startLogger();
    ipcMain.on("subscribe", (event) => {
      console.log("subscribe", event.frameId);
      this.addSubscription(event.frameId, event);
      event.reply("status", "Connected");
    });

    ipcMain.on("unsubscribe", (event) => {
      console.log("unsubscribe", event.frameId);
      this.removeSubscription(event.frameId);
    });

    ipcMain.on("get_config", (event) => {
      db.getConfig((err, data) => {
        if (err) {
          throw err;
        }
        if (!err && data) {
          const config = data.reduce((obj, row) => {
            return { ...obj, [row.setting]: row.value };
          }, {});
          event.reply("get_config_reply", config);
        }
      });
    });

    ipcMain.on("set_config", (event, args) => {
      db.setConfig(args, () => {
        this.startLogger();
        this.route("update", "");
      });
    });

    ipcMain.on("get_player", (event) => {
      db.getPlayer((err, data) => {
        if (err) {
          throw new Error(err.message);
        }
        if (!err && data) {
          const player = data.reduce((obj, row) => {
            return { ...obj, [row.property]: row.value };
          }, {});
          event.reply("get_player_reply", player);
        }
      });
    });

    ipcMain.on("get_stats", (event) => {
      db.getWinLoss((err, data) => {
        if (err) {
          throw new Error(err.message);
        }
        if (!err && data) {
          const replyObj = data.reduce(
            (obj, row) => ({
              ...obj,
              [row.match_type]: { ...row },
            }),
            {}
          );
          event.reply("get_stats_reply", replyObj);
        }
      });
    });
  }

  route(action: string, message: string) {
    console.log(action, message);
    this.subscriptions.forEach((sub) => sub.event.reply(action, message));
  }
}

export default Backend;
