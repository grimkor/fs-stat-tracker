// @ts-ignore
const path = require("path");
const LogParser = require("./LogParser");
const fs = require("fs");

const file = path.join(__dirname, "output_log.txt");
process.send(`exists: ${fs.existsSync(file)}`);
// try {
// let user = "";
// const file =
//   "c:\\Users\\David\\AppData\\LocalLow\\Sirlin Games\\Fantasy Strike\\output_log.txt";

// let tail = new Tail(file, {
//   useWatchFile: true,
// });
// } catch (e) {
//   process.send("ERROR", e);
// }
try {
  process.send('hello there')
  const Parser = new LogParser(file, process);
  Parser.run();
} catch (e) {
  console.error(e);
  process.send("child error");
}
