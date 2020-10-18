import path from "path";
import {homedir} from "os";
import fs from "fs";
import {DatabaseCallback} from "../types";

export default class Logger {
  outputFile: string;

  private static handleError(err: NodeJS.ErrnoException | null) {
    if (err) {
      throw err;
    }
  }

  constructor() {
    this.outputFile = path.join(homedir(), "fs-stat-tracker.log");
  }

  writeLine(...args: string[]) {
    fs.appendFile(
      this.outputFile,
      `${new Date().toISOString()}: | INFO | ${args.join(" | ")}\n`,
      Logger.handleError
    );
  }

  writeError(...args: string[]) {
    fs.appendFile(
      this.outputFile,
      `${new Date().toISOString()}: | ERROR | ${args.join(" | ")}\n`,
      Logger.handleError
    );
  }

  withErrorHandling<T>(name: string, callback?: DatabaseCallback<T>) {
    return (err: Error | null, result?: T) => {
      if (err) {
        this.writeError(name, err.name, err.message);
      } else {
        if (callback) {
          callback(result);
        }
      }
    };
  }

  flushFile() {
    fs.writeFile(this.outputFile, "", Logger.handleError);
  }
}
