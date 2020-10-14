import React, {FC, useContext} from "react";
import {Divider, Typography} from "@material-ui/core";
import OverviewStat from "../../components/OverviewStat";
import {useIpcRequest} from "../../helpers/useIpcRequest";
import {AppContext} from "../../context";

interface Stats {
  ranked: {
    wins: number;
    losses: number;
    wins30: number;
    losses30: number;
    max_rank: number;
    rank: number;
  };
  casual: {
    wins: number;
    losses: number;
    wins30: number;
    losses30: number;
  };
}

const Overview: FC = () => {
  const context = useContext(AppContext);
  const {data} = useIpcRequest<Stats>("get_stats");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginTop: 16,
      }}
    >
      <div style={{gridColumn: "1/-1"}}>
        <Typography variant="h5">Ranked</Typography>
        <Divider/>
      </div>
      <OverviewStat
        title="Win/Loss"
        value={`${data?.ranked?.wins ?? " - "}:${
          data?.ranked?.losses ?? " - "
        }`}
      />
      <OverviewStat title="Rank" value={context.player.rank}/>
      <OverviewStat
        title="Win/Loss (30 days)"
        value={`${data?.ranked?.wins30 ?? " - "}:${
          data?.ranked?.losses30 ?? " - "
        }`}
      />
      <div style={{ gridColumn: "1/-1", padding: "0 16px" }}>
        <Typography variant="h5">Casual</Typography>
        <Divider />
      </div>
      <OverviewStat
        title="Win/Loss"
        value={`${data?.casual?.wins ?? " - "}:${
          data?.casual?.losses ?? " - "
        }`}
      />
      <OverviewStat
        title="Win/Loss (30 days)"
        value={`${data?.casual?.wins30 ?? " - "}:${
          data?.casual?.losses30 ?? " - "
        }`}
      />
    </div>
  );
};

export default Overview;
