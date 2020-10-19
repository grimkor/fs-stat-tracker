import {app, BrowserWindow} from "electron";
import path from "path";
import url from "url";
import Backend from "./backend";
import electronIsDev from "electron-is-dev";
import Logger from "./logger";
import {getDatabase} from "./database";
import {
  createCharacterTable,
  createConfigTable,
  createGameTable,
  createMatchTable,
  createMatchTypeTable,
  createPlayerTable,
} from "./database/defaults";
import upgrade from "./database/upgrade";

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (electronIsDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../renderer/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
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
try {
  const logger = new Logger();
  logger.flushFile();
  logger.writeLine("main.ts");
  getDatabase((db) => {
    logger.writeLine("main getDatabase");
    db.serialize(() => {
      const errorCallback = (err: Error | null) => {
        logger.writeLine("init callback");
        if (err) {
          new Logger().writeError(err.name, err.message);
        }
      };
      db.exec(createConfigTable, errorCallback);
      db.exec(createMatchTable, errorCallback);
      db.exec(createGameTable, errorCallback);
      db.exec(createPlayerTable, errorCallback);
      db.exec(createCharacterTable, errorCallback);
      db.exec(createMatchTypeTable, (err) => {
        if (err) {
          errorCallback(err);
        } else {
          upgrade();
        }
      });
    });
    const backend = new Backend();
    backend.run();
  });
} catch (e) {
  throw e;
}
