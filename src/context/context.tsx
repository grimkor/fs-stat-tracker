import React, {
  createContext,
  FC,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Context, MatchType, Opponent, Player, Status } from "../types";
import contextReducer, { Actions } from "./contextReducer";

const { ipcRenderer } = window.require("electron");

const defaultContext: Context = {
  matchType: "casual",
  status: "Disconnected",
  player: {
    name: "-",
    rank: "-",
    winrate: 0,
  },
  opponent: {
    name: "-",
  },
};

export const AppContext = createContext<Context>(defaultContext);

const { Provider } = AppContext;

export const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(contextReducer, defaultContext);
  // const [status, setStatus] = useState<Status>("Disconnected");
  // const [player, setPlayer] = useState<Player>({ ...defaultContext.player });
  // const [opponent, setOpponent] = useState<Opponent>({
  //   ...defaultContext.opponent,
  // });
  const [matchType, setMatchtype] = useState<MatchType>("casual");
  useEffect(() => {
    ipcRenderer.send("subscribe");
    ipcRenderer.on("status", (event: unknown, payload: Status) => {
      dispatch({ type: Actions.status, payload });
    });
    ipcRenderer.on("authenticated", (event: unknown, payload: string) => {
      dispatch({ type: Actions.authenticated, payload });
    });
    ipcRenderer.on(
      "match_found",
      (
        event: unknown,
        payload: { opponent: Opponent; matchType: MatchType }
      ) => {
        dispatch({ type: Actions.match_found, payload });
      }
    );
    return () => {
      ipcRenderer.removeListener("authenticated");
      return ipcRenderer.send("unsubscribe");
    };
  }, []);

  console.log(state);
  return <Provider value={state}>{children}</Provider>;
};
