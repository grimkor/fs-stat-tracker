import React, {createContext, Dispatch, FC, useEffect, useReducer,} from "react";
import {Config, Context, Player} from "../types";
import reducer, {Actions, ActionTypes} from "./reducer";
import {useIpcRequest} from "../helpers/useIpcRequest";

const {ipcRenderer} = window.require("electron");

const defaultContext: Context = {
  player: {
    name: "-",
    rank: "-",
  },
  config: {
    logFile: "",
  },
};

export const AppContext = createContext<Context>(defaultContext);

const {Provider} = AppContext;

function useIpcDispatchRequest<T>(
  endpoint: string,
  action: Actions,
  dispatch: Dispatch<ActionTypes>
) {
  const {data} = useIpcRequest<T>(endpoint);
  useEffect(() => {
    if (data) {
      // @ts-ignore
      dispatch({type: action, payload: data});
    }
  }, [data, dispatch]);
}

export const AppProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, defaultContext);

  useIpcDispatchRequest<Player>("get_player", Actions.set_player, dispatch);
  useIpcDispatchRequest<Config>("get_config", Actions.set_config, dispatch);

  useEffect(() => {
    ipcRenderer.send("subscribe");
    return () => {
      ipcRenderer.removeListener("update");
      return ipcRenderer.send("unsubscribe");
    };
  }, []);
  return <Provider value={state}>{children}</Provider>;
};
