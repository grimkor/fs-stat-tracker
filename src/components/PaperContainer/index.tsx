import React, {FC} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const PaperContainer: FC = ({children}) => {
  const {root} = useStyles();
  return <Paper className={root}>{children}</Paper>;
};

export default PaperContainer;
