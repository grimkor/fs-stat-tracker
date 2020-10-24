import React, { FC, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useIpcRequest } from "../../helpers/useIpcRequest";
import { AppContext } from "../../context";
import { Avatar, List, ListItem, Typography } from "@material-ui/core";
import * as Characters from "../../characters";

const CharacterDetails: FC = () => {
  const {
    filter,
    player: { name },
  } = useContext(AppContext);
  const { character } = useParams();
  const values = useMemo(() => ({ filter, character }), [filter, character]);
  console.log("values", values);
  const { data } = useIpcRequest<any[]>("get_game_results", values);
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div style={{ flex: 1 }} />
      <div style={{ flex: 2, display: "flex", overflow: "auto" }}>
        {data ? (
          <List
            component="div"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {data
              .sort((a, b) => (a.id < b.id ? 1 : -1))
              .map((game) => (
                <ListItem
                  key={`${game.id}-${game.match_id}`}
                  style={{ border: "1px dotted black", display: "flex" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        flex: 1,
                      }}
                    >
                      <Avatar src={Characters?.[game.player.toLowerCase()]} />
                      <Typography>{name}</Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <span>{game.player_score}</span>
                    <span>vs</span>
                    <span>{game.opp_score}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                      }}
                    >
                      <Avatar src={Characters?.[game.opponent.toLowerCase()]} />
                      <Typography>{game.opp_name}</Typography>
                    </div>
                  </div>
                </ListItem>
              ))}
          </List>
        ) : null}
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default CharacterDetails;
