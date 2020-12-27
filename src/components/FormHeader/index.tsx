import React, { FC } from "react";
import { Typography } from "@material-ui/core";

const FormHeader: FC<{ text: string }> = ({ text }) => (
  <Typography variant="subtitle1">{text}</Typography>
);

export default FormHeader;
