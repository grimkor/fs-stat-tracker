import path from "path";
import LogParser from "./LogParser";
import Logger from "../logger";

const logger = new Logger();

// process.argv[2] == filePath
const file = path.join(process.argv[2]);
try {
  if (process) {
    // @ts-ignore
    const Parser = new LogParser(file, process);
    Parser.run();
    process.addListener("disconnect", () => {
      Parser.stop();
    });
    process.addListener("beforeExit", () => {
      Parser.stop();
    });
  }
} catch (e) {
  logger.writeError("LogParser init", e);
}
