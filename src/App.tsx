import React, { useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppContext, AppProvider } from "./context/context";

function App() {
  const context = useContext(AppContext);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>The status is: {context.status}</span>
        <span>The player is: {context.player.name}</span>
        <span>The opponent is: {context.opponent.name}</span>
      </header>
    </div>
  );
}

export default () => (
  <AppProvider>
    <App />
  </AppProvider>
);
