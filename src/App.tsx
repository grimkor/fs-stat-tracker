import React from "react";
import { AppProvider } from "./context";
import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import { common } from "@material-ui/core/colors";
import NavBar from "./containers/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Overview from "./containers/Overview";
import History from "./containers/History";
import Settings from "./containers/Settings";
import Container from "./components/Container";

const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      main: common.white,
    },
  },
});

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <NavBar />
            <Container>
              <Switch>
                <Route path="/overview">
                  <Overview />
                </Route>
                <Route path="/history">
                  <History />
                </Route>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/">
                  <Overview />
                </Route>
              </Switch>
            </Container>
          </div>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}
