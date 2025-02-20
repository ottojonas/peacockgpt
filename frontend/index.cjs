const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

// Start Flask backend
function startFlaskBackend() {
  const flaskProcess = spawn("python", ["-m", "flask", "run"], {
    cwd: path.join(__dirname, "../backend"),
    env: { ...process.env, FLASK_APP: "app.main" },
  });

  flaskProcess.stdout.on("data", (data) => {
    console.log(`Flask: ${data}`);
  });

  return flaskProcess;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Start Next.js frontend
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  const flaskProcess = startFlaskBackend();

  // Wait for Flask to start
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on("window-all-closed", () => {
    flaskProcess.kill();
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
