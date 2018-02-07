import { app, BrowserWindow } from "electron";
require("electron-debug")({ showDevTools: true });
declare var __dirname: string;
let mainWindow: Electron.BrowserWindow;

function onReady() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    const fileName = `file://${__dirname}/index.html`;
    console.log(fileName);
    mainWindow.loadURL(fileName);
    mainWindow.on("close", () => app.quit());
}

app.on("ready", () => onReady());
app.on("window-all-closed", () => app.quit());
console.log(`Electron Version ${app.getVersion()}`);
