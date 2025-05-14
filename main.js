const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
let screenshotInterval = null;
// var robot = require("robotjs");
const os = require("os");

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

    /* scrot method  */

    const screenshotDir = path.join(__dirname, "screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }

    const filename = `task-${taskId}-${Date.now()}.png`;
    const filepath = path.join(screenshotDir, filename);

    let cmd;

    const platform = os.platform();
    if (platform === "win32") {
      // Windows: requires nircmd in PATH
      cmd = `nircmd.exe savescreenshot "${filepath}"`;
    } else if (platform === "darwin") {
      // macOS
      cmd = `screencapture "${filepath}"`;
    } else if (platform === "linux") {
      // Linux: requires scrot
      cmd = `scrot "${filepath}"`;
    } else {
      console.error("Unsupported platform:", platform);
      return;
    }

    exec(cmd, (err) => {
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
  }, 5000); // every 5 seconds
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

ipcMain.on("open-image-viewer", (event, imagePath) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Screenshot Viewer",
    webPreferences: {
      contextIsolation: true,
    },
  });


  win.loadFile(
    imagePath
  );
});


ipcMain.handle("get-screenshots", () => {
  const screenshotDir = path.join(__dirname, "screenshots");
  const files = fs.readdirSync(screenshotDir);
  const screenshots = files.map((file) => {
    return path.join(screenshotDir, file);
  });

  console.log("Screenshots:", screenshots);
  return screenshots;
});
