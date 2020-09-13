import { Reducer } from "react";
import { Context, MatchType, Opponent, Status } from "../types";

export enum Actions {
  status = "status",
  authenticated = "authenticated",
  match_found = "match_found",
}

type ActionTypes =
  | { type: Actions.status; payload: Status }
  | { type: Actions.authenticated; payload: string }
  | {
      type: Actions.match_found;
      payload: { matchType: MatchType; opponent: Opponent };
    };

const contextReducer: Reducer<Context, ActionTypes> = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case Actions.status:
      return { ...state, status: action.payload };
    case Actions.authenticated:
      return { ...state, player: { ...state.player, name: action.payload } };
    case Actions.match_found:
      return { ...state, ...action.payload };
  }
};

export default contextReducer;
