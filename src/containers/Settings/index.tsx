import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import FileSelectInput from "../../components/FileSelectInput";
import { Button } from "@material-ui/core";
import { AppContext } from "../../context";
import { IpcActions } from "../../../common/constants";
import useIpcSetRequest from "../../helpers/useIpcSetRequest";

enum FormStates {
  no_changes,
  changes,
  submitted,
}

const Settings: FC = () => {
  const { config } = useContext(AppContext);
  const [logFile, setLogFile] = useState(config.logFile);
  const [formState, setFormState] = useState<FormStates>(FormStates.no_changes);

  const onSubmitted = useCallback(() => {
    setFormState(FormStates.submitted);
  }, [setFormState]);

  const submitChange = useIpcSetRequest(IpcActions.set_config, onSubmitted);

  useEffect(() => {
    setLogFile(config.logFile);
  }, [config]);

  const handleChange = (str: string) => {
    setLogFile(str);
    setFormState(FormStates.changes);
  };

  const submit = () => {
    submitChange({ logFile });
  };

  return (
    <div style={{ flex: 1 }}>
      <FileSelectInput value={logFile} setValue={handleChange} />
      <Button
        color="primary"
        variant="contained"
        onClick={submit}
        disabled={formState !== FormStates.changes}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default Settings;
