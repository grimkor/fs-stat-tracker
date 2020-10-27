import {AppBar, Toolbar} from "@material-ui/core";
import React, {FC} from "react";
import NavButton from "../../components/NavButton";
import NavButtonGroup from "../../components/NavButtonGroup";
import FilterSelect from "../FilterSelect";

const NavBar: FC = () => (
  <AppBar position="static" style={{background: "white"}}>
    <Toolbar>
      <NavButtonGroup justify="flex-start">
        <NavButton label="Overview" route="/overview"/>
        <NavButton label="Characters" route="/characters"/>
        <NavButton label="Settings" route="/settings"/>
      </NavButtonGroup>
      <NavButtonGroup justify="flex-end">
        <FilterSelect/>
      </NavButtonGroup>
    </Toolbar>
  </AppBar>
);

export default NavBar;
