import React, { FC, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useIpcRequest } from "../../helpers/useIpcRequest";
import { AppContext } from "../../context";
import CharacterHistoryList from "../../components/CharacterHistoryList";
import * as Characters from "../../characters/portraits";
import { CharacterOverview } from "../../../electron/types";
import OverviewStat from "../../components/OverviewStat";
import { IpcActions } from "../../../constants";

const CharacterDetails: FC = () => {
  const {
    filter,
    player: { name },
  } = useContext(AppContext);
  const { character } = useParams();
  const values = useMemo(() => ({ filter, character, limit: 20 }), [
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
  const { wins, losses } = overview;
  const winrate =
    !wins && !losses ? 0 : ((wins / (wins + losses)) * 100).toFixed(0);

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
        <OverviewStat title="Winrate" value={`${winrate}%`} />
      </div>
      {data ? <CharacterHistoryList name={name} data={data} /> : null}
      <div style={{ display: "flex" }} />
    </div>
  );
};

export default CharacterDetails;
