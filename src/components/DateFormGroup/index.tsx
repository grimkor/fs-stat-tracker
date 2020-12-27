import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  dateGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const DateFormGroup: FC = ({ children }) => {
  const { dateGroup } = useStyles();

  return <div className={dateGroup}>{children}</div>;
};

export default DateFormGroup;
