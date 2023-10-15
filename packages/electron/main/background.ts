import { app, BrowserWindow, dialog, ipcMain, screen } from "electron";
import * as path from "path";
import serve from "electron-serve";
import { Channels } from "@luna/common";
import express from "express";
import { createWindow } from "./helpers/createWindow";
import { processCommand } from "./processCommand";

const eapp = express();

let mainWindow: BrowserWindow;
// eapp.get("/", (req, res) => {
//   res.send("Hello World!");
// });

let currentPrompt = "";
eapp.get("/process/:command", async (req, res) => {
  const { command } = req.params;
  mainWindow.webContents.send(Channels.CurrentVoicePrompt, command);
  currentPrompt = command;
  res.send("done");
});

eapp.get("/finalize", async (req, res) => {
  res.send("done");
  await processCommand(currentPrompt);
});

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

if (process.defaultApp) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient("luna", process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient("luna");
  }
}

(async () => {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    return;
  }

  await app.whenReady();

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    // the url str ends with /
    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLine.pop()?.slice(0, -1) ?? "somewhere"}`
    );
  });

  const screenBounds = screen.getPrimaryDisplay().bounds;
  const WIDTH = 500;
  const HEIGHT = 550;

  mainWindow = createWindow("main", {
    width: WIDTH,
    height: HEIGHT,
    // place the window in the lower right corner of the screen
    x: screenBounds.x + screenBounds.width - WIDTH,
    y: screenBounds.y + screenBounds.height - HEIGHT,
    frame: false,
    // resizable: false,
    alwaysOnTop: true,
    transparent: true,
  });
  // mainWindow.setIgnoreMouseEvents(true);

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // uncomment below open dev tools automatically
    // mainWindow.webContents.openDevTools();

    setTimeout(() => {
      mainWindow.webContents.send(
        Channels.CurrentVoicePrompt,
        "Hello, I am Luna. How can I help you?"
      );
    }, 500);
  }
})();
app.on("window-all-closed", () => {
  app.quit();
});

app.on("open-url", (event, url) => {
  dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
});

ipcMain.on(Channels.PingPong, (event, arg) => {
  event.sender.send(
    Channels.PingPong,
    `[ipcMain] "${arg}" received asynchronously.`
  );
});

ipcMain.on(Channels.CurrentVoicePrompt, (event, arg) => {
  console.log("running CurrentVoicePrompt:", arg);
  event.sender.send(Channels.CurrentVoicePrompt, arg);
  processCommand(arg).then((response) => {
    console.log("response:", response);
  });
});

eapp.listen(8000, () => {
  console.log("electron server listening on port 8000");
});
