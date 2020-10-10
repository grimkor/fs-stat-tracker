import React, { ChangeEvent, FC, useRef } from "react";
import { TextField, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  value: string;
  setValue: (str: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    margin: theme.spacing(2),
  },
  fieldGroup: {
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
  label: {
    marginRight: theme.spacing(2),
  },
  field: {
    flexGrow: 1,
  },
}));

const FileSelectInput: FC<Props> = ({ value, setValue }) => {
  const ref = useRef(null);
  const { field, fieldGroup, label, root } = useStyles();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      setValue(e.currentTarget.value);
    }
  };

  return (
    <div className={root}>
      <div className={fieldGroup}>
        <input
          type="file"
          style={{ display: "none" }}
          ref={ref}
          onChange={handleChange}
        />
        <Typography variant="h6" className={label}>
          Log File:
        </Typography>
        <TextField
          variant="outlined"
          className={field}
          value={value}
          // @ts-ignore
          onClick={() => ref.current.click()}
        />
      </div>
    </div>
  );
};

export default FileSelectInput;
