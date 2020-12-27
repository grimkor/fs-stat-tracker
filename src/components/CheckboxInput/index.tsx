import React, { FC } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    userSelect: "none",
  },
}));

interface Props {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const CheckboxInput: FC<Props> = ({ checked, onChange, label }) => {
  const { root } = useStyles();
  return (
    <FormControlLabel
      className={root}
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={label}
    />
  );
};

export default CheckboxInput;
