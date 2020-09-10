import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React, { FC, useContext } from "react";
import NavButton from "../../components/NavButton";
import { AppContext } from "../../context";
import NavButtonGroup from "../../components/NavButtonGroup";

const NavBar: FC = () => {
  const context = useContext(AppContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <NavButtonGroup>
          <NavButton label="Overview" route="/overview" />
          {/*<NavButton label="History" route="/history" />*/}
          <NavButton label="Settings" route="/settings" />
        </NavButtonGroup>
        <Typography variant="h6">{context.config.playerName}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
