import React, { FC } from "react";
import { Card, CardMedia, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as Characters from "../../characters/tile";
import { useHistory } from "react-router-dom";

interface CharacterCard {
  character: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 200,
    margin: theme.spacing(1),
    cursor: "pointer",
  },
  media: {
    height: 128,
    width: 128,
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
  statsGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "min-content 1fr",
    gridTemplateRows: "repeat(3, 1fr)",
    textAlign: "center",
  },
  statValue: {
    alignSelf: "center",
    justifySelf: "left",
    fontSize: 26,
  },
  statLabel: {
    alignSelf: "center",
    justifySelf: "left",
  },
}));

const CharacterCard: FC<CharacterCard> = ({ character }) => {
  const history = useHistory();
  const { statsGrid, content, media, root, statLabel, statValue } = useStyles();
  return (
    <Card
      className={root}
      elevation={3}
      onClick={() => history.push(`/character/${character}`)}
    >
      <CardMedia
        component={"img"}
        // className={media}
        // @ts-ignore
        src={Characters?.[character.toLowerCase()]}
      />
    </Card>
  );
};

export default CharacterCard;
