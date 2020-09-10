const { app, ipcMain, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const { fork } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const p = fork(path.join(__dirname, "backend.js"), ["args"], {
  stdio: ["pipe", "pipe", "pipe", "ipc"],
});

let i = 0;
setInterval(() => {
  console.log("sending message");
  p.send(`Hello there child: ${++i}`);
}, 1000);

ipcMain.on("subscribe", (event) => {
  console.log("subbed");
  p.on("message", (message) => {
    console.log("message reply", message);
    event.reply("message", message);
  });
});
