import React, {FC} from "react";
import {Avatar, Paper, Typography} from "@material-ui/core";
import * as Characters from "../../characters/portraits";
import {toRank} from "../../helpers/formatters";

const CharacterHistoryList: FC<{ name: string; data: any[] }> = ({data}) =>
  data ? (
    <div
      style={{
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Typography variant="overline" style={{textAlign: "center"}}>
        Game History
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "auto",
        }}
      >
        {data
          .sort((a, b) => (a.id < b.id ? 1 : -1))
          .map((game, index) => (
            <Paper
              key={`${index}${game.id}${game.match_id}`}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                margin: 8,
                padding: 8,
              }}
            >
              <Typography
                variant="h6"
                style={{
                  margin: "0px 8px",
                  width: 50,
                  textAlign: "center",
                }}
              >
                {game.player_score > game.opp_score ? "Win" : "Loss"}
              </Typography>
              <Typography
                variant="h4"
                style={{
                  whiteSpace: "nowrap",
                  width: 80,
                  textAlign: "center",
                }}
              >
                {game.player_score}-{game.opp_score}
              </Typography>
              <div
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  margin: "0px 16px",
                }}
              >
                <Avatar
                  // @ts-ignore
                  src={Characters?.[game.opponent.toLowerCase()]}
                  style={{marginRight: 8}}
                />
                <Typography>{game.opp_name}</Typography>
                <Typography style={{flex: 1, textAlign: "end"}}>
                  {toRank(game.opp_league, game.opp_rank)}
                </Typography>
              </div>
            </Paper>
          ))}
      </div>
    </div>
  ) : null;

export default CharacterHistoryList;
