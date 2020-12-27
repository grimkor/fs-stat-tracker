import React, { FC, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useIpcRequest } from "../../helpers/useIpcRequest";
import { AppContext } from "../../context";
import CharacterHistoryList from "../../components/CharacterHistoryList";
import * as Characters from "../../characters/portraits";
import { CharacterOverview } from "../../../electron/types";
import OverviewStat from "../../components/OverviewStat";
import { IpcActions } from "../../../common/constants";
import { toWinrate } from "../../helpers/formatters";
import { Typography } from "@material-ui/core";
import { CharactersList } from "../../types";
import { CharacterWinrate } from "../../../common/types";
import MatchupWinrateCard from "../../components/MatchupWinrateCard";

const CharacterDetails: FC = () => {
  const {
    filter,
    player: { name },
  } = useContext(AppContext);
  const { character } = useParams();
  const values = useMemo(() => ({ filter, character, limit: 200 }), [
    filter,
    character,
  ]);
  const { data: overview } = useIpcRequest<CharacterOverview>(
    IpcActions.get_character_overview,
    {
      args: values,
      defaultValue: {
        name: character,
        wins: 0,
        losses: 0,
      },
    }
  );
  const { data } = useIpcRequest<any[]>(IpcActions.get_game_results, {
    args: values,
  });

  const { data: characterWinrate } = useIpcRequest<CharacterWinrate>(
    IpcActions.get_character_winrate,
    {
      args: values,
    }
  );

  const { wins, losses } = overview;
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        overflow: "hidden",
        gridTemplateColumns: "1fr 2fr 1fr",
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: 200 }}>
          <img
            // @ts-ignore
            src={Characters?.[character.toLowerCase()]}
            alt={character}
            style={{ objectFit: "scale-down", overflow: "hidden" }}
          />
        </div>
        <OverviewStat title="Games Played" value={wins + losses} />
        <OverviewStat title="Won" value={wins} />
        <OverviewStat title="Winrate" value={`${toWinrate(wins, losses)}%`} />
      </div>
      <CharacterHistoryList name={name} data={data} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="overline" style={{ textAlign: "center" }}>
          Matchup Winrate
        </Typography>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "70px 70px 70px",
            gridTemplateRows: "repeat(4, 130px)",
            margin: "0 auto",
            gridGap: 8,
          }}
        >
          {CharactersList.map((c) => (
            <MatchupWinrateCard
              key={c}
              character={c}
              // @ts-ignore
              wins={characterWinrate?.[c].wins}
              // @ts-ignore
              losses={characterWinrate?.[c].losses}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
