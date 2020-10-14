import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  label: string;
  route: string;
}

const NavButton: FC<Props> = ({ label, route }) => {
  const history = useHistory();
  const classes = useStyles();

  const handleClick = () => {
    history.push(route);
  };

  return (
    <Button className={classes.root} onClick={handleClick}>
      {label}
    </Button>
  );
};

export default NavButton;
