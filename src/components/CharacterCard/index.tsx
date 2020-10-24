import React, { FC } from "react";
import { Card, CardMedia, LinearProgress, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as Characters from "../../characters";
import { useHistory } from "react-router-dom";

interface CharacterCard {
  character: string;
  wins: number;
  losses: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 300,
    height: 152,
    margin: theme.spacing(1),
    cursor: "pointer",
  },
  media: {
    // height: 90,
    width: 90,
    margin: theme.spacing(1),
    objectFit: "scale-down",
  },
  content: {
    flex: 1,
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),
  },
}));

const CharacterCard: FC<CharacterCard> = ({ character, wins, losses }) => {
  const history = useHistory();
  const { barLabel, content, media, root } = useStyles();
  const winrate = (wins || losses ? (wins / (wins + losses)) * 100 : 0).toFixed(
    0
  );
  return (
    <Card
      className={root}
      elevation={3}
      onClick={() => history.push(`/character/${character}`)}
    >
      <CardMedia
        component={"img"}
        className={media}
        // @ts-ignore
        src={Characters?.[character.toLowerCase()]}
      />
      <div className={content}>
        <span>Games played: {wins + losses}</span>
        <div>
          <div className={barLabel}>
            <span>{wins}</span>
            <span>{winrate}%</span>
            <span>{losses}</span>
          </div>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Number(winrate) ?? 0}
          />
        </div>
      </div>
    </Card>
  );
};

export default CharacterCard;
