import React, { FC, useContext } from "react";
import { Divider, Typography } from "@material-ui/core";
import OverviewStat from "../../components/OverviewStat";
import { useIpcRequest } from "../../helpers/useIpcRequest";
import { IpcActions } from "../../../common/constants";
import { OverviewStats, Rank } from "../../../common/types";
import { toRank, toWinrate } from "../../helpers/formatters";
import { AppContext } from "../../context";
import moment from "moment";

//TODO: See about moving the divs with inline styles to components in src/components
const Overview: FC = () => {
  const { filter } = useContext(AppContext);
  const { data } = useIpcRequest<OverviewStats>(IpcActions.get_stats, {
    args: {
      filter,
    },
    defaultValue: {
      casual: {
        wins: 0,
        losses: 0,
      },
      ranked: {
        wins: 0,
        losses: 0,
      },
      challenge: {
        wins: 0,
        losses: 0,
      },
    },
  });
  const { data: rank } = useIpcRequest<Rank>(IpcActions.get_rank, {
    defaultValue: {
      player_league: 0,
      player_rank: 0,
    },
  });
  const { ranked, casual, challenge } = data;

  const addSuffix = (text: string) =>
    filter.filterDate ? `${text} (date filtered)` : text;

  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginTop: 16,
      }}
    >
      <div style={{ gridColumn: "1/-1", padding: "0 16px" }}>
        <Typography variant="h5">Ranked</Typography>
        <Divider />
      </div>
      <OverviewStat
        title={addSuffix("Win/Loss")}
        value={`${ranked.wins}:${ranked.losses}`}
      />
      <OverviewStat
        title={"Rank"}
        value={toRank(rank.player_league, rank.player_rank)}
      />
      <OverviewStat
        title={addSuffix("Winrate")}
        value={`${toWinrate(ranked.wins, ranked.losses)}%`}
      />
      <div style={{ gridColumn: "1/-1", padding: "0 16px" }}>
        <Typography variant="h5">Casual</Typography>
        <Divider />
      </div>
      <OverviewStat
        title={addSuffix("Win/Loss")}
        value={`${data?.casual?.wins ?? " - "}:${
          data?.casual?.losses ?? " - "
        }`}
      />
      <OverviewStat
        title={addSuffix("Winrate")}
        value={`${toWinrate(casual.wins, casual.losses)}%`}
      />
      <div style={{ gridColumn: "1/-1", padding: "0 16px" }}>
        <Typography variant="h5">Friendly</Typography>
        <Divider />
      </div>
      <OverviewStat
        title={addSuffix("Win/Loss")}
        value={`${data?.challenge?.wins ?? " - "}:${
          data?.challenge?.losses ?? " - "
        }`}
      />
      <OverviewStat
        title={addSuffix("Winrate")}
        value={`${toWinrate(challenge.wins, challenge.losses)}%`}
      />
    </div>
  );
};

export default Overview;
