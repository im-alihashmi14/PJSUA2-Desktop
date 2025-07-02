const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Load the SIP native addon
const sipAddon = require('../../bindings/node/build/Release/sipaddon.node');
console.log('[Electron] SIP Native Addon loaded:', Object.keys(sipAddon));

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For demo, allow direct require in renderer
    },
  });
  win.loadFile('index.html');
}

// Expose all SIP functions via IPC for renderer
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

sipFunctions.forEach(fn => {
  if (typeof sipAddon[fn] === 'function') {
    ipcMain.handle('sip:' + fn, (event, ...args) => {
      console.log(`[Electron] SIP call: ${fn}(${args.map(a => JSON.stringify(a)).join(', ')})`);
      return sipAddon[fn](...args);
    });
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
}); 