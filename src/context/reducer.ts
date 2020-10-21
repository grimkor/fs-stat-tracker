import {Reducer} from "react";
import {Config, Context, Player} from "../types";

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
      return {
        ...state,
        config: action.payload,
      };
    case Actions.set_player:
      return {
        ...state,
        player: {...state.player, ...action.payload},
      };
    case Actions.set_filter:
      return {
        ...state,
        filter: action.payload,
      };
  }
};

export default reducer;
