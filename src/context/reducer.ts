import { Reducer } from "react";
import { Config, Context, Player } from "../types";
import _ from "lodash";

export enum Actions {
  set_config = "set_config",
  set_player = "set_player",
  set_filter = "set_filter",
}

export type ActionTypes =
  | { type: Actions.set_config; payload: Config }
  | { type: Actions.set_player; payload: Player }
  | { type: Actions.set_filter; payload: number[] };

const reducer: Reducer<Context, ActionTypes> = (state, action) => {
  switch (action.type) {
    case Actions.set_config:
      if (!_.isEqual(state.config, action.payload)) {
        return {
          ...state,
          config: action.payload,
        };
      }
      break;
    case Actions.set_player:
      if (!_.isEqual(state.player, action.payload)) {
        return {
          ...state,
          player: { ...state.player, ...action.payload },
        };
      }
      break;

    case Actions.set_filter:
      if (!_.isEqual(state.filter, action.payload)) {
        return {
          ...state,
          filter: action.payload,
        };
      }
      break;
    default:
      return state;
  }
  return state;
};

export default reducer;
