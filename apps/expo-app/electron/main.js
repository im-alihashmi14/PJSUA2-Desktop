const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sipAddon =require('./../../../bindings/node/build/Release/sipaddon.node');
const sipFunctions = [
    'initSIP',
    'registerAccount',
    'call',
    'mute',
    'unmute',
    'hold',
    'unhold',
    'hangup',
    'hangupAll',
    'cleanup',
    'setTransportType',
    'accept',
    'reject',
    'setIceEnabled',
    'setInterfaceIp',
];

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('[main.js] preload path:', preloadPath);
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the Expo web dev server (or static build if you want)
  const devUrl = 'http://localhost:8081';
  mainWindow.loadURL(devUrl);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

  sipFunctions.forEach(fn => {
    if (typeof sipAddon[fn] === 'function') {
      ipcMain.handle('sip:' + fn, (event, ...args) => {
        console.log(`[Electron] SIP call: ${fn}(${args.map(a => JSON.stringify(a)).join(', ')})`);
        return sipAddon[fn](...args);
      });
    }
  });
  

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});


module.exports={
    sipFunctions
}