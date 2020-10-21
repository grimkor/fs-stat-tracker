import React, {FC, useContext} from "react";
import {Divider, Typography} from "@material-ui/core";
import OverviewStat from "../../components/OverviewStat";
import {useIpcRequest} from "../../helpers/useIpcRequest";
import {AppContext} from "../../context";
import {OverviewStats} from "../../types";

//TODO: See about moving the divs with inline styles to components in src/components
const Overview: FC = () => {
  const context = useContext(AppContext);
  const {data} = useIpcRequest<OverviewStats>("get_stats");
  return (
    <div
      style={{
        flex: 1,
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
      <div style={{gridColumn: "1/-1", padding: "0 16px"}}>
        <Typography variant="h5">Casual</Typography>
        <Divider/>
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
      <div style={{gridColumn: "1/-1", padding: "0 16px"}}>
        <Typography variant="h5">Friendly</Typography>
        <Divider/>
      </div>
      <OverviewStat
        title="Win/Loss"
        value={`${data?.challenge?.wins ?? " - "}:${
          data?.challenge?.losses ?? " - "
        }`}
      />
      <OverviewStat
        title="Win/Loss (30 days)"
        value={`${data?.challenge?.wins30 ?? " - "}:${
          data?.challenge?.losses30 ?? " - "
        }`}
      />
    </div>
  );
};

export default Overview;
