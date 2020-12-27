import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  formGroup: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(),
    marginBottom: theme.spacing(2),
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
}));

const FormGroup: FC = ({ children }) => {
  const { formGroup } = useStyles();

  return <div className={formGroup}>{children}</div>;
};

export default FormGroup;
