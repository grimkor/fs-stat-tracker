import React, {FC, useContext, useEffect, useState} from "react";
import FileSelectInput from "../../components/FileSelectInput";
import {Button} from "@material-ui/core";
import {AppContext} from "../../context";
import ipcSetRequest from "../../helpers/ipcSetRequest";
import {IpcActions} from "../../../common/constants";

const Settings: FC = () => {
  const {config} = useContext(AppContext);
  const [logFile, setLogFile] = useState(config.logFile);

  useEffect(() => {
    setLogFile(config.logFile);
  }, [config]);

  const handleChange = (str: string) => {
    setLogFile(str);
  };

  const submit = () => {
    if (config.logFile !== logFile) {
      ipcSetRequest(IpcActions.set_config, {logFile}, () => {
      });
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <FileSelectInput value={logFile} setValue={handleChange} />
      <Button color="primary" variant="contained" onClick={submit}>
        Save Changes
      </Button>
    </div>
  );
};

export default Settings;
