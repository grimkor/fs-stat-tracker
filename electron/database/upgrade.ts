import fs from "fs";
import path from "path";
import {homedir} from "os";
import datafix from "./datafix";
import Logger from "../logger";
import db from "./index";

const sortBySemver = (list: string[]) =>
  list.sort((a: string, b: string) => {
    const [majorA, minorA, patchA] = a.split(".").map(Number);
    const [majorB, minorB, patchB] = b.split(".").map(Number);

    if (majorA > majorB) {
      return 1;
    }
    if (minorA > minorB) {
      return 1;
    }
    if (patchA > patchB) {
      return 1;
    }
    return -1;
  });

const getUpgradesRequired = (list: string[], version: string) =>
  list.slice(list.indexOf(version) + 1, list.length);

const backupDatabase = (version: string) => {
  fs.copyFileSync(
    path.join(homedir(), "fs-stat-tracker.db"),
    path.join(homedir(), `fs-stat-tracker_BACKUP(${version}).db`)
  );
};

const updateVersion = (version: string) => db.setConfig({version});

export default () => {
  db.getConfig((data) => {
    const version =
      data?.find((row) => row.setting === "version")?.value ?? "0.0.0";
    const directories = Object.keys(datafix);
    const sorted = sortBySemver(directories);
    const toUpgrade = getUpgradesRequired(sorted, version);
    toUpgrade.forEach((ver) => {
      try {
        backupDatabase(ver);
        // @ts-ignore
        datafix[ver](() => updateVersion(ver));
      } catch (e) {
        new Logger().writeError(
          "upgrade step",
          `starting upgrade version: ${version}`,
          `upgrading to: ${ver}`,
          e
        );
      }
    });
  });
};
