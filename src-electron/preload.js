const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  verifyPassword: (password, hash) =>
    ipcRenderer.invoke("verify-password", password, hash),
  saveUser: (username, password) =>
    ipcRenderer.invoke("save-user", { username, password }),
  getUser: (username) => ipcRenderer.invoke("get-user", username),
});
