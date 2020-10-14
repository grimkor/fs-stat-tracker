const Actions = {
  authenticated: "authenticated",
  game_result: "game_result",
  match_result: "match_result",
  ranked_result: "ranked_result",
  match_found: "match_found",
  set_config: "set_config",
  update: "update",
};

const MatchType = {
  ranked: "ranked",
  casual: "casual",
};

module.exports = { Actions, MatchType };
