import React, { FC, useContext, useState } from "react";
import FileSelectInput from "../../components/FileSelectInput";
import { Button } from "@material-ui/core";
import { AppContext } from "../../context";

const Settings: FC = () => {
  const { config } = useContext(AppContext);
  const [logFile, setLogFile] = useState(config.logFile);

  const handleChange = (str: string) => {
    setLogFile(str);
  };

  const submit = () => {
    if (config.logFile !== logFile) {
      console.log(logFile);
    }
  };

  return (
    <div>
      <FileSelectInput value={logFile} setValue={handleChange} />
      <Button color="primary" variant="contained" onClick={submit}>
        Save Changes
      </Button>
    </div>
  );
};

export default Settings;
