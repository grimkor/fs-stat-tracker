const { Tail } = require("tail");
const { Actions } = require("../constants");
const { authenticated, gameResult } = require("./matchers");

class LogParser {
  constructor(file, process) {
    try {
      console.log(process);
      this.process = process;
      this.file = file;
      this.player = {
        name: "",
        rank: "",
      };
      this.opponent = {
        name: "",
        rank: "",
      };
      this.match_id = undefined;
      this.match_type = undefined;
      this.tail = new Tail(this.file, {
        useWatchFile: true,
      });
      this.tail.on("line", this.processLine.bind(this));
      this.tail.on("error", function (error) {
        this.process.send("ERROR: ", error);
      });
    } catch (e) {
      this.process.send("Error during LogParser constructor");
    }
  }

  run() {
    try {
      this.tail.watch(true);
    } catch (e) {
      this.process.send("Error during LogParser run()");
    }
  }

  processLine(line) {
    try {
      if (authenticated(line)) {
        this.process.send("starting auth");
        this.process.send(`Settings user to ${authenticated(line)}`);
        this.player.name = authenticated(line);
        this.process.send("finishing auth");
      } else if (gameResult(line)) {
        this.process.send([Actions.match_result, gameResult(line)]);
      }
    } catch (e) {
      this.process.send("Error during LogParser processLine()");
    }
  }
}

module.exports = LogParser;
