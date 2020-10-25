import React, { FC } from "react";
import { Avatar, Paper, Typography } from "@material-ui/core";
import * as Characters from "../../characters/portraits";

const CharacterHistoryList: FC<{ name: string; data: any[] }> = ({
  name,
  data,
}) =>
  data ? (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Typography variant="overline" style={{ textAlign: "center" }}>
        Last 20 Games
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
          .map((game) => (
            <Paper
              key={`${game.id}-${game.match_id}`}
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
                  justifyContent: "center",
                  margin: "0px 8px",
                  width: 50,
                  textAlign: "center",
                  flex: 1,
                }}
              >
                {game.player_score > game.opp_score ? "Win" : "Loss"}
              </Typography>
              <Typography
                variant="h4"
                style={{
                  whiteSpace: "nowrap",
                  width: 100,
                  textAlign: "center",
                }}
              >
                {game.player_score}-{game.opp_score}
              </Typography>
              <div
                style={{
                  flex: 2,
                  display: "flex",
                  // flexDirection: "column",
                  alignItems: "center",
                  margin: "0px 8px",
                }}
              >
                <Avatar
                  // @ts-ignore
                  src={Characters?.[game.opponent.toLowerCase()]}
                  style={{ marginRight: 8 }}
                />
                <Typography>{game.opp_name}</Typography>
              </div>
            </Paper>
          ))}
      </div>
    </div>
  ) : null;

export default CharacterHistoryList;
