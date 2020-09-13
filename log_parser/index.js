const path = require("path");
const LogParser = require("./LogParser");
const fs = require("fs");

const file = path.join(__dirname, "output_log.txt");
// const file = "c:\\Users\\David\\AppData\\LocalLow\\Sirlin Games\\Fantasy Strike\\output_log.txt";

try {
  const Parser = new LogParser(file, process);
  Parser.run();
} catch (e) {
  console.error(e);
  process.send(e.message);
}
