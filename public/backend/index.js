const path = require("path");
const { fork } = require("child_process");
const { ipcMain } = require("electron");
const db = require(path.join(__dirname, "../database"));

class BackEnd {
  constructor() {
    this.subscriptions = [];
    this.process = fork(
      path.join(__dirname, "../log_parser/index.js"),
      ["args"],
      {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      }
    );
    this.process.on("error", (e) => console.error("error", e.message));
    this.process.on("close", (e) => console.log("close", e.message));
    this.process.on("disconnect", () => console.log("disconnected"));
    this.process.on("exit", (e) => console.log("exit", e.message));
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
        if (!err) {
          console.log(result);
          const config = result.reduce((obj, row) => {
            return { ...obj, [row.setting]: row.value };
          }, {});
          event.reply("get_config_reply", config);
        }
      });
    });
    ipcMain.on("get_stats", (event) => {
      db.getWinLoss((err, result) => {
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

    this.process.on("message", ([action, message]) => {
      console.log("message", action, message);
      this.route(action, message);
    });
  }

  route(action, message) {
    this.subscriptions.forEach((sub) => sub.event.reply(action, message));
  }
}

module.exports = BackEnd;
