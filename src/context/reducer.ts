import { Reducer } from "react";
import { Config, Context, MatchType, Opponent, Status } from "../types";

export enum Actions {
  status = "status",
  authenticated = "authenticated",
  match_found = "match_found",
  set_config = "set_config",
}

type ActionTypes =
  | { type: Actions.status; payload: Status }
  | { type: Actions.authenticated; payload: string }
  | {
      type: Actions.match_found;
      payload: { matchType: MatchType; opponent: Opponent };
    }
  | { type: Actions.set_config; payload: Config };

const reducer: Reducer<Context, ActionTypes> = (state, action) => {
  switch (action.type) {
    case Actions.status:
      return { ...state, status: action.payload };
    case Actions.authenticated:
      return { ...state, player: { ...state.player, name: action.payload } };
    case Actions.match_found:
      return { ...state, ...action.payload };
    case Actions.set_config:
      console.log(action);
      return {
        ...state,
        config: action.payload,
      };
  }
};

export default reducer;
