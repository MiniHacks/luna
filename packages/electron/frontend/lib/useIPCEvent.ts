import { useEffect } from "react";
import electron from "electron";
import { Channels } from "@luna/common";

const ipcRenderer = electron.ipcRenderer || false;

// a hook to wrap around the ipcRenderer.on and ipcRenderer.send
// for easier use in react components
function useIPCEvent<SendType, ReceiveType>(
  event: Channels,
  callback?: (data: ReceiveType) => void
): (data?: SendType) => void {
  useEffect(() => {
    ipcRenderer.on(event, (ev, data) => {
      if (callback) callback(data as ReceiveType);
    });
    return () => {
      ipcRenderer.removeAllListeners(event);
    };
  }, [callback, event]);

  return (data?: SendType) => {
    ipcRenderer.send(event, data);
  };
}

export { useIPCEvent };
