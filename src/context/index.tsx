import React, {
  createContext,
  Dispatch,
  FC,
  useEffect,
  useReducer,
} from "react";
import { Config, Context, MatchTypesObj, Player } from "../types";
import reducer, { Actions, ActionTypes } from "./reducer";
import { useIpcRequest } from "../helpers/useIpcRequest";
import { IpcActions } from "../../common/constants";
import moment from "moment";
import { Filter } from "../../common/types";

const { ipcRenderer } = window.require("electron");

export const defaultContext: Context = {
  player: {
    name: "-",
    rank: "-",
  },
  config: {
    logFile: "",
  },
  filter: {
    matchTypes: Object.values(MatchTypesObj),
    date: {
      startDate: moment().add(-1, "months").startOf("day").unix(),
      endDate: moment(moment().endOf("day"), "YYYY-MM-DD").unix(),
    },
    filterDate: false,
  },
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

  const setFilter = (payload: Filter) =>
    dispatch({ type: Actions.set_filter, payload });

  return <Provider value={{ ...state, setFilter }}>{children}</Provider>;
};
