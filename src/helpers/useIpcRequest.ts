import { useCallback, useEffect, useState } from "react";
import { IpcActions } from "../../constants";

const { ipcRenderer } = window.require("electron");

export function useIpcRequest<T>(
  endpoint: string,
  options?: {
    args?: any;
    defaultValue: T;
  }
): { data: T };

export function useIpcRequest<T>(
  endpoint: string,
  options?: {
    args: any;
    defaultValue?: T;
  }
): { data: T };

export function useIpcRequest<T>(
  endpoint: string,
  options?: {
    args?: any;
    defaultValue?: T;
  }
): { data: T | null } {
  const [data, setData] = useState<T | null>(
    options?.defaultValue !== undefined ? options.defaultValue : null
  );
  const listenerFunc = useCallback(
    function listenerFunction(event: unknown, payload: T) {
      setData(payload);
    },
    [setData]
  );
  const updateListener = useCallback(
    function updateMessage() {
      ipcRenderer.send(endpoint, options?.args);
    },
    [endpoint]
  );

  useEffect(() => {
    ipcRenderer.on(IpcActions.update, updateListener);
    ipcRenderer.on(`${endpoint}_reply`, listenerFunc);
    ipcRenderer.send(endpoint, options?.args);

    return () => {
      ipcRenderer.removeListener(`${endpoint}_reply`, listenerFunc);
      ipcRenderer.removeListener(IpcActions.update, updateListener);
    };
  }, [endpoint, options?.args]);

  return { data };
}
