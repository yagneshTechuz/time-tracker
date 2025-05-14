const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { desktopCapturer } = require("electron");
let screenshotInterval = null;
var robot = require("robotjs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("renderer/index.html");
}

app.whenReady().then(createWindow);

// Utility: Capture full-screen screenshot with gnome-screenshot

async function captureScreenshot(taskId) {
  try {
    // robot.keyToggle("alt", "down");
    // robot.keyTap("printscreen");
    // robot.keyToggle("alt", "up");

    /* Gnome  */

    const screenshotDir = path.join(__dirname, "screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }

    const filename = `task-${taskId}-${Date.now()}.png`;
    const filepath = path.join(screenshotDir, filename);

    // Use gnome-screenshot or scrot (depending on what is installed)
    exec(`gnome-screenshot -f "${filepath}"`, (err) => {
      if (err) {
        console.error("Screenshot failed:", err);
      } else {
        console.log("Screenshot saved:", filepath);
      }
    });
  } catch (err) {
    console.error("Failed to take full screen screenshot:", err);
  }
}

// Start automatic screenshot interval
ipcMain.on("start-screenshots", (event, taskId) => {
  clearInterval(screenshotInterval); // clear if already running
  screenshotInterval = setInterval(() => {
    captureScreenshot(taskId);
  }, 5000); // every 30 seconds
});

// Take one screenshot on-demand
ipcMain.on("take-fullscreen-screenshot", (event, taskId) => {
  captureScreenshot(taskId);
});

// Stop the screenshot interval
ipcMain.on("stop-screenshots", () => {
  clearInterval(screenshotInterval);
  screenshotInterval = null;
});
