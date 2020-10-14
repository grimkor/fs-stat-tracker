import React, { FC } from "react";
import { ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const NavButtonGroup: FC = ({ children }) => {
  const { root } = useStyles();
  return <ButtonGroup className={root}>{children}</ButtonGroup>;
};

export default NavButtonGroup;
