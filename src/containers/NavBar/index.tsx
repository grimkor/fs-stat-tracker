import {AppBar, Toolbar, Typography} from "@material-ui/core";
import React, {FC, useContext} from "react";
import NavButton from "../../components/NavButton";
import {AppContext} from "../../context";
import NavButtonGroup from "../../components/NavButtonGroup";
import FilterSelect from "../FilterSelect";

const NavBar: FC = () => {
  const context = useContext(AppContext);

  return (
    <AppBar position="static" style={{background: "white"}}>
      <Toolbar>
        <NavButtonGroup justify="flex-start">
          <NavButton label="Overview" route="/overview"/>
          {/*<NavButton label="History" route="/history" />*/}
          <NavButton label="Characters" route="/characters"/>
          <NavButton label="Stats" route="/stats"/>
          <NavButton label="Settings" route="/settings"/>
        </NavButtonGroup>
        <NavButtonGroup justify="flex-end">
            <FilterSelect/>
        </NavButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
