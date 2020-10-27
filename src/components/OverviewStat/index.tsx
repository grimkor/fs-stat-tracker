import React, {FC} from "react";
import {Typography} from "@material-ui/core";
import PaperContainer from "../PaperContainer";

interface Props {
  title: string;
  value: number | string | undefined;
}

const OverviewStat: FC<Props> = ({title, value}) => {
  return (
    <PaperContainer>
      <Typography variant="overline">{title}</Typography>
      <Typography variant="h4">{value ?? " - "}</Typography>
    </PaperContainer>
  );
};

export default OverviewStat;
