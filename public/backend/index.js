const path = require("path");
const fs = require("fs");
const { fork } = require("child_process");
const { ipcMain } = require("electron");
const db = require(path.join(__dirname, "../database"));

class BackEnd {
  constructor() {
    this.subscriptions = [];
    this.process = null;
  }

  startLogger() {
    this.stopLogger();
    db.getConfig((err, data) => {
      if (err) {
        throw new Error(err);
      }
      const config = data.reduce(
        (obj, row) => ({ ...obj, [row.setting]: row.value }),
        {}
      );
      if (fs.existsSync(config.logFile)) {
        this.process = fork(
          path.join(__dirname, "../log_parser/index.js"),
          [config.logFile],
          {
            stdio: ["pipe", "pipe", "pipe", "ipc"],
          }
        );
        this.process.on("error", (e) =>
          console.error("error", e?.message ?? e)
        );
        this.process.on("close", (e) => console.log("close", e?.message ?? e));
        this.process.on("disconnect", () => console.log("disconnected"));
        this.process.on("exit", (e) => console.log("exit", e?.message ?? e));

        this.process.on("message", ([action, message]) => {
          console.log("message", action, message);
          this.route(action, message);
        });
      }
    });
  }

  stopLogger() {
    if (this.process) {
      this.process.kill();
    }
  }

  addSubscription(id, event) {
    if (!this.subscriptions.some((sub) => sub.id === id)) {
      this.subscriptions = [...this.subscriptions, { id, event }];
    }
  }

  removeSubscription(id) {
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
      db.getConfig((err, result) => {
        if (err) {
          throw new Error(err.message);
        }
        if (!err) {
          const config = result.reduce((obj, row) => {
            return { ...obj, [row.setting]: row.value };
          }, {});
          event.reply("get_config_reply", config);
        }
      });
    });

    ipcMain.on("set_config", (event, args) => {
      db.setConfig(args, (result) => {
        this.startLogger();
        event.reply("set_config_reply", result);
        this.route("update", "");
      });
    });

    ipcMain.on("get_stats", (event) => {
      db.getWinLoss((err, result) => {
        if (err) {
          throw new Error(err.message);
        }
        if (!err) {
          console.log("stats", result);
          const replyObj = result.reduce(
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

  route(action, message) {
    this.subscriptions.forEach((sub) => sub.event.reply(action, message));
  }
}

module.exports = BackEnd;
