import React from "react";
import { AppProvider } from "./context";
import {
  colors,
  createMuiTheme,
  Theme,
  ThemeProvider,
} from "@material-ui/core";
import NavBar from "./containers/NavBar";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Overview from "./containers/Overview";
import History from "./containers/History";
import Settings from "./containers/Settings";
import Container from "./components/Container";
import Characters from "./containers/Characters";
import CharacterDetails from "./containers/CharacterDetails";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.teal["800"],
    },
    secondary: {
      main: colors.pink["700"],
    },
  },
});

export default function App() {
  return (
    <Router>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <div
              //TODO: Change to component in src/components
              style={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <NavBar />
              <Container>
                <Switch>
                  <Route exact path="/overview">
                    <Overview />
                  </Route>
                  <Route exact path="/character/:character">
                    <CharacterDetails />
                  </Route>
                  <Route exact path="/characters">
                    <Characters />
                  </Route>
                  <Route exact path="/history">
                    <History />
                  </Route>
                  <Route exact path="/settings">
                    <Settings />
                  </Route>
                  <Route path="/">
                    <Overview />
                  </Route>
                </Switch>
              </Container>
            </div>
          </ThemeProvider>
        </AppProvider>
      </MuiPickersUtilsProvider>
    </Router>
  );
}
