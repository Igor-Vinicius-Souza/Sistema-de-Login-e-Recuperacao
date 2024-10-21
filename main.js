const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let loginWindow;
let dashboardWindow;

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  // Node.js com IPC
            contextIsolation: false
        }
    });
    loginWindow.loadFile('index.html');
}

function createDashboardWindow() {
    dashboardWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  // Node.js com IPC
            contextIsolation: false
        }
    });
    dashboardWindow.loadFile('dashboard.html');

    dashboardWindow.on('closed', () => {
        dashboardWindow = null;
    });
}

// Abre a janela depois do evento
ipcMain.on('login-success', (event) => {
    loginWindow.close();
    createDashboardWindow();
});

app.whenReady().then(() => {
    createLoginWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createLoginWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
