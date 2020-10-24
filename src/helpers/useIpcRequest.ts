import { useCallback, useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

export function useIpcRequest<T>(
  endpoint: string,
  args?: any
): { data: T | null } {
  const [data, setData] = useState<T | null>(null);
  const listenerFunc = useCallback(
    function listenerFunction(event: unknown, payload: T) {
      setData(payload);
    },
    [setData]
  );
  const updateListener = useCallback(
    function updateMessage() {
      ipcRenderer.send(endpoint, args);
    },
    [endpoint]
  );

  useEffect(() => {
    ipcRenderer.on("update", updateListener);
    ipcRenderer.on(`${endpoint}_reply`, listenerFunc);
    ipcRenderer.send(endpoint, args);

    return () => {
      ipcRenderer.removeListener(`${endpoint}_reply`, listenerFunc);
      ipcRenderer.removeListener("update", updateListener);
    };
  }, [endpoint, args]);

  return { data };
}
