import React, {
  createContext,
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import { Config, Context, MatchTypesObj, Player } from "../types";
import reducer, { Actions, ActionTypes } from "./reducer";
import { useIpcRequest } from "../helpers/useIpcRequest";
import { IpcActions } from "../../constants";
const { ipcRenderer } = window.require("electron");

const defaultContext: Context = {
  player: {
    name: "-",
    rank: "-",
  },
  config: {
    logFile: "",
  },
  filter: Object.values(MatchTypesObj),
  setFilter: () => {},
};

export const AppContext = createContext<Context>(defaultContext);

const { Provider } = AppContext;

function useIpcDispatchRequest<T>(
  endpoint: string,
  action: Actions,
  dispatch: Dispatch<ActionTypes>
) {
  const { data } = useIpcRequest<T>(endpoint);
  useEffect(() => {
    if (data) {
      // @ts-ignore
      dispatch({ type: action, payload: data });
    }
  }, [data, dispatch]);
}

export const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext);

  useIpcDispatchRequest<Player>(
    IpcActions.get_player,
    Actions.set_player,
    dispatch
  );
  useIpcDispatchRequest<Config>(
    IpcActions.get_config,
    Actions.set_config,
    dispatch
  );

  useEffect(() => {
    ipcRenderer.send(IpcActions.subscribe);
    return () => {
      ipcRenderer.removeListener(IpcActions.update);
      return ipcRenderer.send(IpcActions.unsubscribe);
    };
  }, []);

  const setFilter = (payload: number[]) =>
    dispatch({ type: Actions.set_filter, payload });

  return <Provider value={{ ...state, setFilter }}>{children}</Provider>;
};
