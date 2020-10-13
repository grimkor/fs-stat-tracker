import {useEffect, useState} from "react";

const {ipcRenderer} = window.require("electron");

export function useIpcRequest<T>(endpoint: string): { data: T | null } {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    ipcRenderer.on("update", () => ipcRenderer.send(endpoint));
    ipcRenderer.send(endpoint);
    ipcRenderer.on(`${endpoint}_reply`, listenerFunction);

    function listenerFunction(event: unknown, payload: T) {
      setData(payload);
    }

    return () => {
      ipcRenderer.removeListener(`${endpoint}_reply`, listenerFunction);
    };
  }, [endpoint]);

  return { data };
}
