const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startScreenshots: (taskId) => ipcRenderer.send('start-screenshots', taskId),
  stopScreenshots: () => ipcRenderer.send('stop-screenshots'),
  getScreenshots: () => ipcRenderer.invoke('get-screenshots'),
  openImageViewer: (path) => ipcRenderer.send("open-image-viewer", path),
});
