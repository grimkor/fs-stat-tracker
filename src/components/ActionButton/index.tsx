import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import { Button } from "@material-ui/core";

interface Props {
  type: "primary" | "secondary";
}

const useStyles = makeStyles((theme) => ({
  primary: {
    background: green["400"],
  },
  secondary: {
    background: red["400"],
  },
}));

const ActionButton: FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <Button variant="contained" className={classes[props.type]}>
      {props.children}
    </Button>
  );
};

export default ActionButton;
