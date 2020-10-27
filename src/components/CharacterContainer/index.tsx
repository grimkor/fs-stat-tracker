import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flex: 1,
    flexWrap: "wrap",
    alignContent: "flex-start",
    overflow: "auto",
  },
}));

const CharacterContainer: FC = ({ children }) => {
  const { root } = useStyles();
  return <div className={root}>{children}</div>;
};

export default CharacterContainer;
