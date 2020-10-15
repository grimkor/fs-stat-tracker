import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("appRuntime", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel: string, listener: any) => {
    // @ts-ignore
    const subscription = (event, ...args) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
