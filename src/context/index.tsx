import React, { createContext, FC, useEffect, useReducer } from "react";
import { Config, Context, Status } from "../types";
import reducer, { Actions } from "./reducer";

const { ipcRenderer } = window.require("electron");

const defaultContext: Context = {
  matchType: "casual",
  status: "Disconnected",
  player: {
    rank: "-",
    winrate: 0,
  },
  opponent: {
    name: "-",
  },
  config: {
    playerName: "-",
    logFile: "",
  },
};

export const AppContext = createContext<Context>(defaultContext);

const { Provider } = AppContext;

export const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext);
  useEffect(() => {
    ipcRenderer.send("subscribe");
    ipcRenderer.send("get_config");
    ipcRenderer.on("get_config_reply", (event: unknown, payload: Config) => {
      dispatch({ type: Actions.set_config, payload });
    });

    ipcRenderer.on("status", (event: unknown, payload: Status) => {
      dispatch({ type: Actions.status, payload });
    });

    ipcRenderer.on("authenticated", (event: unknown, payload: string) => {
      dispatch({ type: Actions.authenticated, payload });
    });
    return () => {
      ipcRenderer.removeListener("authenticated");
      return ipcRenderer.send("unsubscribe");
    };
  }, []);

  return <Provider value={state}>{children}</Provider>;
};
