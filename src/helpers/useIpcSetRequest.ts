import { useCallback, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

export default function useIpcSetRequest(
  endpoint: string,
  callback: (data: object) => any
): (data: any) => any {
  useEffect(() => {
    ipcRenderer.on(`${endpoint}_reply`, callback);
    return () => ipcRenderer.removeListener(`${endpoint}_reply`, callback);
  }, [callback, endpoint]);

  return useCallback(
    (data: any) => {
      ipcRenderer.send(endpoint, data);
    },
    [callback, endpoint]
  );
}
