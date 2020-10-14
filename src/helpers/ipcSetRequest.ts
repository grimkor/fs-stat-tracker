const { ipcRenderer } = window.require("electron");

export default function ipcSetRequest(
  endpoint: string,
  data: any,
  callback?: (data: object) => any
) {
  ipcRenderer.on(`${endpoint}_reply`, callback);
  ipcRenderer.send(endpoint, data);
}
