import path from "path";
import LogParser from "./LogParser";
import fs from "fs";


// process.argv[2] == filePath
const file = path.join(process.argv[2]);
try {
  if (process) {
    // @ts-ignore
    const Parser = new LogParser(file, process);
    Parser.run();
  }
} catch (e) {
  process.send?.(e);
  // throw new Error(e);
}
