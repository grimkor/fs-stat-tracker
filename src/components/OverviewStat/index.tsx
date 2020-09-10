import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";

interface Props {
  title: string;
  value: number | string | undefined;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const OverviewStat: FC<Props> = ({ title, value }) => {
  const { root } = useStyles();

  return (
    <Paper className={root}>
      <Typography variant="overline">{title}</Typography>
      <Typography variant="h4">{value ?? " - "}</Typography>
    </Paper>
  );
};

export default OverviewStat;
