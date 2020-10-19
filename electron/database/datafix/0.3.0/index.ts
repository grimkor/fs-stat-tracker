import createCharacterTableScript from "./character-table-create";
import createMatchTypeTableScript from "./match_type-table-create";
import {getDatabase} from "../../index";
import Logger from "../../../logger";

const logger = new Logger();
export default (callback: () => void) => {
  try {
    getDatabase((db) => {
      db.serialize(() => {
        db.exec(createCharacterTableScript, (err) => {
          if (err) {
            logger.writeError(err.name, err.message);
          }
        });
        db.exec(createMatchTypeTableScript, (err) => {
          if (err) {
            logger.writeError(err.name, err.message);
          } else {
            callback();
          }
        });
      });
    });
  } catch (e) {
    logger.writeError(e);
  }
};
