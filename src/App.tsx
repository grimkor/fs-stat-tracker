import React from "react";
import { AppProvider } from "./context";
import {
  colors,
  createMuiTheme,
  Theme,
  ThemeProvider,
} from "@material-ui/core";
import NavBar from "./containers/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Overview from "./containers/Overview";
import History from "./containers/History";
import Settings from "./containers/Settings";
import Container from "./components/Container";
import Stats from "./containers/Stats";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import Characters from "./containers/Characters";
import CharacterDetails from "./containers/CharacterDetails";

const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.blue["400"],
    },
  },
});

export default function App() {
  return (
    <Router>
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
                <Route exact path="/stats">
                  <Stats />
                </Route>
                <Route exact path="/history">
                  <History />
                </Route>
                <Route exact path="/settings">
                  <Settings />
                </Route>
                <Route exact path="/">
                  <Overview />
                </Route>
              </Switch>
            </Container>
          </div>
        </ThemeProvider>
      </AppProvider>
    </Router>
  );
}
