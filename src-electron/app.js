const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const userDb = require("./userDb");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  win.loadFile("dist/dashboard-app/index.html");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("save-user", async (event, { username, password }) => {
    try {
      await userDb.saveUser(username, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("get-user", async (event, username) => {
    try {
      const user = await userDb.getUser(username);
      return user;
    } catch (err) {
      return null;
    }
  });

  ipcMain.handle("verify-password", async (event, password, hash) => {
    try {
      const valid = await userDb.verifyPassword(password, hash);
      return valid;
    } catch (err) {
      return false;
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
