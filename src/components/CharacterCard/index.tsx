import React, {FC} from "react";
import {Card, CardMedia, LinearProgress, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

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
    height: 90,
    margin: theme.spacing(1),
  },
  media: {
    height: 90,
    width: 90,
    backgroundColor: "steelblue",
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
    marginBottom: theme.spacing(0.5)
  },
}));

const CharacterCard: FC<CharacterCard> = ({character, wins, losses}) => {
  const {barLabel, content, media, root} = useStyles();
  const winrate = (wins || losses ? (wins / (wins + losses)) * 100 : 0).toFixed(
    0
  );
  return (
    <Card className={root}>
      <CardMedia className={media}>{character}</CardMedia>
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
