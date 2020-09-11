import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ipcRenderer from "./appRuntime";

ipcRenderer.subscribe("message", console.log);

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    return ipcRenderer.subscribe("message", setMessage);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {message}
        </a>
      </header>
    </div>
  );
}

export default App;
