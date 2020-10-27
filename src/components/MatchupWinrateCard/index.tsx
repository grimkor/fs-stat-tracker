import React, {FC} from "react";
import * as Characters from "../../characters/portraits";
import {Paper, Typography} from "@material-ui/core";
import {toWinrate} from "../../helpers/formatters";

interface MatchupWinrateCard {
  character: string;
  wins: number;
  losses: number;
}

const MatchupWinrateCard: FC<MatchupWinrateCard> = ({
                                                      character,
                                                      wins,
                                                      losses,
                                                    }) => {
  return (
    <Paper key={character} style={{display: "flex", flexDirection: "column"}}>
      <img
        // @ts-ignore
        src={Characters?.[character.toLowerCase()]}
        style={{
          objectFit: "scale-down",
          overflow: "hidden",
          margin: 8,
        }}
        alt={character}
      />
      <Typography variant="h6" style={{margin: "8px 0", textAlign: "center"}}>
        {toWinrate(wins, losses)}%
      </Typography>
    </Paper>
  );
};

export default MatchupWinrateCard;
