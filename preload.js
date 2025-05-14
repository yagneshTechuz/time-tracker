const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startScreenshots: (taskId) => ipcRenderer.send('start-screenshots', taskId),
  stopScreenshots: () => ipcRenderer.send('stop-screenshots'),
  takeScreenshot: (taskId) => ipcRenderer.send('take-fullscreen-screenshot', taskId),
});
