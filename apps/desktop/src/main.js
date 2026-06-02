const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");

const {
    DEFAULT_BACKEND_URL,
    buildWorkbenchUrl,
    projectRootFromDesktopDir,
    runStartupSequence,
} = require("./runtime");

let mainWindow = null;
let latestRuntimeState = null;
let runtimeInFlight = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 980,
        minHeight: 680,
        title: "AI Learning Assistant",
        backgroundColor: "#151411",
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    mainWindow.loadFile(path.join(__dirname, "shell.html"));
}

async function startRuntime() {
    if (runtimeInFlight) {
        return latestRuntimeState;
    }
    runtimeInFlight = true;
    const backendUrl = process.env.AILA_BACKEND_URL || DEFAULT_BACKEND_URL;
    const workbenchUrl = process.env.AILA_WORKBENCH_URL || buildWorkbenchUrl(backendUrl);

    const result = await runStartupSequence({
        projectRoot: projectRootFromDesktopDir(__dirname),
        backendUrl,
        workbenchUrl,
        onState: publishRuntimeState,
    });
    runtimeInFlight = false;

    if (result.state === "ready" && mainWindow && !mainWindow.isDestroyed()) {
        await mainWindow.loadURL(result.workbenchUrl);
    }
    return result;
}

function publishRuntimeState(event) {
    latestRuntimeState = event;
    if (event.state === "failed") {
        console.error("[desktop-runtime]", event.message, event.details || {});
    } else {
        console.log("[desktop-runtime]", event.state, event.message);
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("runtime:state", event);
    }
}

ipcMain.handle("runtime:get-state", () => latestRuntimeState);
ipcMain.handle("runtime:retry", () => startRuntime());
ipcMain.handle("runtime:reveal-path", async (_event, targetPath) => {
    if (typeof targetPath !== "string" || !targetPath.trim()) {
        return { ok: false, message: "No artifact path was provided." };
    }
    shell.showItemInFolder(targetPath);
    return { ok: true };
});
ipcMain.handle("runtime:open-diagnostics", async () => {
    await shell.openPath(projectRootFromDesktopDir(__dirname));
    return { ok: true };
});

app.whenReady().then(() => {
    createWindow();
    startRuntime();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            startRuntime();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
