import React, { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const Container: FC = ({ children }) => {
  const { root } = useStyles();

  return <div className={root}>{children}</div>;
};

export default Container;
