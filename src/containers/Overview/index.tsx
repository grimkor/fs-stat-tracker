import React, { FC, useEffect, useState } from "react";
import { Divider, Typography } from "@material-ui/core";
import OverviewStat from "../../components/OverviewStat";

const { ipcRenderer } = window.require("electron");

function useIpcRequest<T>(endpoint: string): { data: T | null } {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    ipcRenderer.on("update", () => ipcRenderer.send(endpoint));
    ipcRenderer.send(endpoint);
    ipcRenderer.on(`${endpoint}_reply`, (event: unknown, payload: T) => {
      setData(payload);
    });
  }, [endpoint]);

  return { data };
}

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
  const { data } = useIpcRequest<Stats>("get_stats");
  return (
    <div
      style={{
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
        title="Win/Loss"
        value={`${data?.ranked?.wins ?? " - "}:${
          data?.ranked?.losses ?? " - "
        }`}
      />
      <OverviewStat title="Rank" value={data?.ranked.rank} />
      <OverviewStat
        title="Win/Loss (30 days)"
        value={`${data?.ranked?.wins30 ?? " - "}:${
          data?.ranked?.losses30 ?? " - "
        }`}
      />
      <OverviewStat title="Highest Rank" value={data?.ranked?.max_rank} />
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
