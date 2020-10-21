import React, {FC} from "react";
import {GridJustification} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface NavButtonGroup {
  justify: GridJustification;
}

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flex: 1,
    justifyContent: (props: NavButtonGroup) => props.justify,
    alignItems: "center",
  },
}));

const NavButtonGroup: FC<NavButtonGroup> = (props) => {
  const {root} = useStyles(props);
  return <div className={root}>{props.children}</div>;
};

export default NavButtonGroup;
