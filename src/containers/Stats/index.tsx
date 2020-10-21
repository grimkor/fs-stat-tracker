import React, {FC, useContext} from "react";
import PivotGrid from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {useIpcRequest} from "../../helpers/useIpcRequest";
import {WinratePivot} from "../../../electron/types";
import {AppContext} from "../../context";

const makeDataSource = (data: WinratePivot[]) =>
  new PivotGridDataSource({
    fields: [
      {
        dataField: "player",
        area: "row",
        caption: "Player",
      },
      {
        dataField: "opponent",
        area: "column",
      },
      {
        dataField: "winrate",
        caption: "Winrate",
        dataType: "number",
        area: "data",
        summaryType: "avg",
        showGrandTotals: true,
        customizeText: (cellInfo) =>
          cellInfo.value ? `${Number(cellInfo.value).toFixed(0)}%` : "-",
      },
    ],
    store: data.map((x) => ({
      ...x,
      winrate:
        x.wins || x.losses
          ? ((x.wins / (x.wins + x.losses)) * 100).toPrecision(2)
          : null,
    })),
  });

const Stats: FC = () => {
  const {filter} = useContext(AppContext);
  const {data} = useIpcRequest<WinratePivot[]>("get_winrate_pivot", filter);
  return data ? (
    <div style={{flex: 1}}>
      <PivotGrid
        dataSource={makeDataSource(data)}
        hideEmptySummaryCells={true}
        showBorders={true}
        onCellPrepared={(e) => {
          if (e.cellElement) {
            e.cellElement.style.textAlign = "center";
          }
        }}
      />
    </div>
  ) : null;
};

export default Stats;
