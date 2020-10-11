const path = require("path");
const LogParser = require("./LogParser");
const fs = require("fs");

// process.argv[2] == filePath

const file = path.join(process.argv[2]);
// const file = "c:\\Users\\David\\AppData\\LocalLow\\Sirlin Games\\Fantasy Strike\\output_log.txt";

try {
  const Parser = new LogParser(file, process);
  Parser.run();
} catch (e) {
  process.send(e.message);
  throw new Error(e);
}
