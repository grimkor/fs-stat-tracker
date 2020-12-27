import React, { FC } from "react";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(),
    cursor: "pointer",
  },
}));

const DateInput: FC<{
  value: number;
  label: string;
  onChange: (value: number) => void;
  enabled: boolean;
}> = (props) => {
  const { root } = useStyles();

  const handleChange = (date: MaterialUiPickersDate) => {
    if (date) {
      props.onChange(date.unix());
    }
  };
  return (
    <DatePicker
      className={root}
      value={moment.unix(props.value)}
      onChange={handleChange}
      format="YYYY-MM-DD"
      label={props.label}
      disabled={!props.enabled}
      helperText="YYYY-MM-DD"
    />
  );
};

export default DateInput;
