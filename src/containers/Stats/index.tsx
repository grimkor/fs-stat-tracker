import React, { FC, useContext } from "react";
import PivotGrid from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { useIpcRequest } from "../../helpers/useIpcRequest";
import { WinratePivot } from "../../../electron/types";
import { AppContext } from "../../context";
import { IpcActions } from "../../../constants";

const makeDataSource = (data: WinratePivot[]) => {
  return new PivotGridDataSource({
    fields: [
      {
        dataField: "x",
        area: "row",
        expanded: true,
      },
      {
        dataField: "player",
        area: "row",
        caption: "Player",
      },
      {
        dataField: "y",
        area: "column",
        expanded: true,
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
          !isNaN(Number(cellInfo.value))
            ? `${Number(cellInfo.value).toFixed(0)}%`
            : "-",
      },
      {
        dataField: "wins",
        caption: "wins",
        isMeasure: true,
        summaryType: "sum",
        visible: true,
        dataType: "number",
      },
      {
        dataField: "losses",
        caption: "losses",
        isMeasure: true,
        summaryType: "sum",
        visible: true,
        dataType: "number",
      },
    ],
    store: data.map((x) => ({
      ...x,
      x: "Player",
      y: "Winrate By Opponent Character",
      winrate:
        x.wins || x.losses
          ? ((x.wins / (x.wins + x.losses)) * 100).toPrecision(2)
          : null,
    })),
  });
};

const Stats: FC = () => {
  const { filter } = useContext(AppContext);
  const { data } = useIpcRequest<WinratePivot[]>(IpcActions.get_winrate_pivot, {
    args: filter,
  });
  return data ? (
    <div style={{ flex: 1, overflow: "auto" }}>
      <PivotGrid
        rowHeaderLayout="tree"
        dataSource={makeDataSource(data)}
        hideEmptySummaryCells={true}
        showBorders={true}
        showColumnTotals={false}
        showRowTotals={false}
        texts={{ grandTotal: "", total: "Player" }}
        scrolling={{ mode: "standard" }}
        elementAttr={{ id: "character-breakdown-pivot" }}
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
